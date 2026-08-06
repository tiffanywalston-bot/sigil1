// capabilities/audio/SubliminalCapability.ts

/**
 * SubliminalCapability
 *
 * Implements the subliminal layer declared by
 * AudioTypes.SubliminalLayer and bounded by
 * AudioConstants.AUDIO.SUBLIMINAL.
 *
 * NOTHING NEW IS BUILT HERE:
 *   - sample generation  -> runtime/AudioRuntime.ts
 *   - mixing / gain      -> runtime/AudioRuntime.ts (WaveMath)
 *   - buffer assembly    -> runtime/AudioRuntime.ts
 *   - session composition-> runtime/CompositionRuntime.ts
 *   - WAV encoding       -> runtime/WavEncoder.ts (via AudioExporter)
 *   - export packaging   -> runtime/AudioExporter.ts
 * No second audio engine, WAV generator, runtime or registry is
 * introduced. AudioRuntime is not modified.
 *
 * ---------------------------------------------------------------
 * IMPORTANT LIMITATION — READ BEFORE USING
 * ---------------------------------------------------------------
 * SubliminalLayer.content is TEXT. This repository contains NO way
 * to turn text into audio samples:
 *   - no speech synthesis anywhere (the only "voice" reference,
 *     ReflectiveGuidance.buildVoicePayload(), is an integration
 *     point for a HOST-supplied TTS pipeline, not an implementation)
 *   - no bundled voice/audio assets of any kind
 *   - math/WaveMath.ts implements only sineWave() and cosineWave()
 *
 * Therefore this capability does NOT produce spoken affirmations.
 * It produces a low-gain CARRIER layer whose amplitude envelope is
 * gated deterministically from the content string, so the text
 * governs the layer's rhythm and structure but is NOT recoverable
 * as speech by a listener.
 *
 * To produce actual spoken subliminal audio you must add a speech
 * SOURCE — either browser SpeechSynthesis captured via
 * MediaRecorder, or pre-recorded voice assets decoded to samples.
 * Both are new architecture and are deliberately NOT invented here.
 * buildLayerBuffer() below is written so that such a source can be
 * substituted later without changing any caller: supply the decoded
 * voice samples as `sourceSamples` and the same gating, gain
 * clamping and mixing path is reused unchanged.
 * ---------------------------------------------------------------
 */

import type { CapabilityDefinition } from "../CapabilityInterfaces";
import type {
  CapabilityContext,
  CapabilityError,
  CapabilityStatus,
} from "../CapabilityTypes";

import type {
  AudioBuffer as SigilAudioBuffer,
  SubliminalLayer,
} from "../../AudioTypes";
import type { Frequency } from "../../HarmonicTypes";
import type { Session } from "../../SessionTypes";

import { AudioRuntime } from "../../runtime/AudioRuntime";
import { CompositionRuntime } from "../../runtime/CompositionRuntime";
import { AudioExporter, type EncodedAudioExport } from "../../runtime/AudioExporter";

import { AUDIO } from "../../AudioConstants";
import { HARMONICS } from "../../HarmonicConstants";

/** Diagnostic report surfaced to the UI for troubleshooting. */
export interface SubliminalReport {
  readonly layerId: string;
  readonly content: string;
  readonly wordCount: number;
  readonly requestedGain: number;
  readonly appliedGain: number;
  readonly gainWasClamped: boolean;
  readonly belowAudibleThreshold: boolean;
  readonly audibleThreshold: number;
  readonly carrierFrequencyHz: number;
  readonly durationSeconds: number;
  readonly sampleCount: number;
  readonly layerPeak: number;
  readonly layerRms: number;
  readonly mixedPeak: number;
  readonly mixedRms: number;
  /** True when the layer is inaudible relative to the mix it sits under. */
  readonly maskedByMix: boolean;
  readonly isSpeech: false;
  readonly notes: readonly string[];
}

export interface SubliminalComposition {
  readonly buffer: SigilAudioBuffer;
  readonly report: SubliminalReport;
}

export class SubliminalCapability implements CapabilityDefinition {
  readonly metadata = {
    id: "audio.subliminal",
    name: "Subliminal",
    category: "audio",
    description: "Subliminal audio capability.",
    version: "GMC-1.0.0",
    defaultEnabled: false,
  } as const;
  readonly enabled = false;
  readonly dependencies = ["audio.frequency"] as const;
  readonly status: CapabilityStatus = {
    id: this.metadata.id,
    version: this.metadata.version,
    category: this.metadata.category,
    enabled: this.enabled,
    dependencies: this.dependencies,
    registered: false,
    validated: false,
    initialized: false,
    executed: false,
    shutdown: false,
    lastError: null,
  };

  /* ============================================================
   * Capability lifecycle
   *
   * CapabilityContext carries only engineId/sessionId and no
   * Session or SubliminalLayer, so execute() has nothing to
   * compose and remains a no-op success — the same pattern already
   * established by WaveCapability.execute() and
   * ExportCapability.execute(). Callers holding a real Session use
   * composeWithSubliminal() below.
   * ============================================================ */

  async initialize(_context: CapabilityContext): Promise<CapabilityError | null> {
    return null;
  }

  async execute(_context: CapabilityContext): Promise<CapabilityError | null> {
    return null;
  }

  async shutdown(_context: CapabilityContext): Promise<CapabilityError | null> {
    return null;
  }

  async validate(_context: CapabilityContext): Promise<CapabilityError | null> {
    return null;
  }

  /* ============================================================
   * Gain policy — bounded by AudioConstants.AUDIO.SUBLIMINAL
   * ============================================================ */

  /** Clamps to AUDIO.SUBLIMINAL.MIN_GAIN..MAX_GAIN. */
  static clampGain(gain: number): number {
    if (!Number.isFinite(gain)) {
      return AUDIO.SUBLIMINAL.DEFAULT_GAIN;
    }
    return Math.min(
      AUDIO.SUBLIMINAL.MAX_GAIN,
      Math.max(AUDIO.SUBLIMINAL.MIN_GAIN, gain)
    );
  }

  /* ============================================================
   * Content -> envelope
   *
   * Deterministic and dependency-free: the same content always
   * yields the same envelope. This is amplitude gating (plain
   * arithmetic), NOT speech synthesis and NOT new DSP — the
   * samples it scales are produced entirely by AudioRuntime.
   * ============================================================ */

  /** Words used as gate slots. Empty content yields an empty list. */
  static tokenize(content: string): string[] {
    return content.split(/\s+/).filter((word) => word.length > 0);
  }

  /**
   * Builds a 0..1 gate envelope of `sampleCount` values. Each word
   * occupies one equal time slot and is gated on for the fraction
   * of that slot proportional to its length, with a short linear
   * ramp at each edge so the layer does not click.
   */
  static buildEnvelope(content: string, sampleCount: number): number[] {
    const envelope = new Array<number>(sampleCount).fill(0);
    const words = SubliminalCapability.tokenize(content);

    if (words.length === 0 || sampleCount <= 0) {
      return envelope;
    }

    const slot = sampleCount / words.length;
    // Ramp is 5% of a slot, capped so it can never exceed half a slot.
    const ramp = Math.max(1, Math.min(Math.floor(slot * 0.05), Math.floor(slot / 2)));

    for (let w = 0; w < words.length; w++) {
      const slotStart = Math.floor(w * slot);
      const slotEnd = Math.floor((w + 1) * slot);

      // Longer words stay gated on longer, bounded to 30%..90% of the slot.
      const fill = Math.min(0.9, Math.max(0.3, words[w].length / 12));
      const onEnd = slotStart + Math.floor((slotEnd - slotStart) * fill);

      for (let i = slotStart; i < onEnd && i < sampleCount; i++) {
        const intoGate = i - slotStart;
        const untilEnd = onEnd - i;
        const rampIn = Math.min(1, intoGate / ramp);
        const rampOut = Math.min(1, untilEnd / ramp);
        envelope[i] = Math.min(rampIn, rampOut);
      }
    }

    return envelope;
  }

  /* ============================================================
   * Layer generation
   * ============================================================ */

  /**
   * Carrier frequency for the layer. Derived deterministically from
   * the content so different affirmations sit at slightly different
   * offsets, anchored on HARMONICS.BASE_FREQUENCY. Bounded to
   * +/- 40 Hz around the base so it always stays in the same region.
   */
  static carrierFrequency(content: string): Frequency {
    let sum = 0;
    for (let i = 0; i < content.length; i++) {
      sum += content.charCodeAt(i);
    }
    const offset = content.length === 0 ? 0 : (sum % 81) - 40;
    return { value: HARMONICS.BASE_FREQUENCY + offset, unit: "Hz" };
  }

  /**
   * Produces the subliminal layer samples.
   *
   * Every sample originates in AudioRuntime.generateSineBuffer (or
   * in `sourceSamples` when a real speech source is supplied later
   * — see the limitation note at the top of this file). This method
   * only gates and attenuates them.
   */
  static buildLayerBuffer(
    layer: SubliminalLayer,
    durationSeconds: number,
    sampleRate: number = AUDIO.SAMPLE_RATE,
    sourceSamples?: readonly number[]
  ): number[] {
    const count = AudioRuntime.sampleCount(durationSeconds, sampleRate);

    // Carrier: generated by AudioRuntime, never by this file.
    const carrier =
      sourceSamples && sourceSamples.length > 0
        ? Array.from({ length: count }, (_, i) => sourceSamples[i % sourceSamples.length])
        : AudioRuntime.generateSineBuffer(
            SubliminalCapability.carrierFrequency(layer.content),
            AUDIO.MAX_GAIN,
            HARMONICS.DEFAULT_PHASE,
            durationSeconds,
            sampleRate
          );

    const envelope = SubliminalCapability.buildEnvelope(layer.content, count);
    const gated = carrier.map((sample, i) => sample * envelope[i]);

    // Attenuation uses AudioRuntime.applyGain — no local gain math.
    return AudioRuntime.applyGain(gated, SubliminalCapability.clampGain(layer.gain));
  }

  /* ============================================================
   * Pipeline integration
   * ============================================================ */

  /**
   * Composes the session through the EXISTING CompositionRuntime,
   * then mixes the subliminal layer into both channels using
   * AudioRuntime.mixBuffers. CompositionRuntime is called, not
   * modified or replaced.
   *
   * Returns the mixed buffer plus a SubliminalReport for the UI.
   */
  static composeWithSubliminal(
    session: Session,
    layer: SubliminalLayer
  ): SubliminalComposition {
    const composition = CompositionRuntime.compose(session);
    const base = composition.buffer;

    const durationSeconds = base.durationSeconds;
    const sampleRate = base.sampleRate;

    const baseLeft = base.frames.map((frame) => frame.left);
    const baseRight = base.frames.map((frame) => frame.right);

    const notes: string[] = [];

    if (!layer.enabled) {
      notes.push("Layer disabled — base composition returned unchanged.");
      return {
        buffer: base,
        report: SubliminalCapability.buildReport(
          layer,
          [],
          baseLeft,
          durationSeconds,
          notes
        ),
      };
    }

    const layerSamples = SubliminalCapability.buildLayerBuffer(
      layer,
      durationSeconds,
      sampleRate
    );

    if (SubliminalCapability.tokenize(layer.content).length === 0) {
      notes.push("Content is empty — envelope is silent, layer contributes nothing.");
    }

    const left = AudioRuntime.mixBuffers([baseLeft, layerSamples]);
    const right = AudioRuntime.mixBuffers([baseRight, layerSamples]);

    const buffer = AudioRuntime.assembleAudioBuffer(
      `${base.id}-subliminal`,
      AudioRuntime.normalizeBuffer(left, AUDIO.MAX_GAIN),
      AudioRuntime.normalizeBuffer(right, AUDIO.MAX_GAIN),
      sampleRate
    );

    return {
      buffer,
      report: SubliminalCapability.buildReport(
        layer,
        layerSamples,
        buffer.frames.map((frame) => frame.left),
        durationSeconds,
        notes
      ),
    };
  }

  /**
   * Composes with the subliminal layer and hands the result to the
   * EXISTING WAV pipeline (AudioExporter -> WavEncoder). No
   * encoding logic exists in this file.
   */
  static composeAndExport(
    session: Session,
    layer: SubliminalLayer,
    filename?: string
  ): { export: EncodedAudioExport; report: SubliminalReport } {
    const { buffer, report } = SubliminalCapability.composeWithSubliminal(session, layer);

    return {
      export: AudioExporter.buildExport(
        buffer,
        filename ?? `subliminal-${layer.id}-${session.id}`
      ),
      report,
    };
  }

  /* ============================================================
   * Diagnostics
   * ============================================================ */

  private static buildReport(
    layer: SubliminalLayer,
    layerSamples: readonly number[],
    mixedChannel: readonly number[],
    durationSeconds: number,
    notes: string[]
  ): SubliminalReport {
    const applied = SubliminalCapability.clampGain(layer.gain);
    const clamped = Number.isFinite(layer.gain) && applied !== layer.gain;

    if (clamped) {
      notes.push(
        `Requested gain ${layer.gain} clamped to ${applied} by AUDIO.SUBLIMINAL bounds.`
      );
    }

    const layerPeak = layerSamples.length > 0 ? AudioRuntime.measurePeak(layerSamples) : 0;
    const layerRms = layerSamples.length > 0 ? AudioRuntime.measureRms(layerSamples) : 0;
    const mixedPeak = mixedChannel.length > 0 ? AudioRuntime.measurePeak(mixedChannel) : 0;
    const mixedRms = mixedChannel.length > 0 ? AudioRuntime.measureRms(mixedChannel) : 0;

    const belowThreshold = layerPeak < layer.audibleThreshold;
    const masked = mixedRms > 0 && layerRms > 0 && layerRms < mixedRms * 0.1;

    if (belowThreshold) {
      notes.push(
        `Layer peak ${layerPeak.toFixed(4)} is below its declared audibleThreshold ${layer.audibleThreshold}.`
      );
    }

    return {
      layerId: layer.id,
      content: layer.content,
      wordCount: SubliminalCapability.tokenize(layer.content).length,
      requestedGain: layer.gain,
      appliedGain: applied,
      gainWasClamped: clamped,
      belowAudibleThreshold: belowThreshold,
      audibleThreshold: layer.audibleThreshold,
      carrierFrequencyHz: SubliminalCapability.carrierFrequency(layer.content).value,
      durationSeconds,
      sampleCount: layerSamples.length,
      layerPeak,
      layerRms,
      mixedPeak,
      mixedRms,
      maskedByMix: masked,
      isSpeech: false,
      notes,
    };
  }
}
