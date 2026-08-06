// FILE: runtime/CompositionRuntimeBridge.ts  (NEW)
//
// Bridges the real runtime/CompositionRuntime.ts (a static,
// never-instantiated preset -> AudioBuffer composer) and the real
// capabilities/output/{WaveCapability,ExportCapability}.ts (session
// lifecycle capabilities) to the foundation/FoundationTypes.CompositionRuntime
// interface required by foundation/FoundationAdapter.ts.
//
// foundation/FoundationTypes.CompositionRuntime declares three members:
//   - registerSubsystem(name, runtime): void
//   - requestWaveCapability(): WaveCapability | null   (Foundation's own
//     WaveCapability: createAmbientStream / createHarmonicStream /
//     createRhythmicStream / updateStream — live ambient/harmonic/rhythmic
//     STREAM creation from FoundationTypes parameter objects)
//   - requestExportCapability(): ExportCapability | null  (Foundation's
//     own ExportCapability: exportSnapshot(name, state) — persisting an
//     arbitrary FoundationLayerState snapshot)
//
// Nothing in the repository implements either of the latter two.
// capabilities/output/WaveCapability.ts only composes a full Session's
// audio via runtime/CompositionRuntime.compose(session) — a different
// input (Session) and output (one finished stereo AudioBuffer) than
// "create an ambient/harmonic/rhythmic stream from Foundation
// parameters." capabilities/output/ExportCapability.ts only encodes an
// AudioBuffer to WAV — not "export an arbitrary layer state snapshot."
// There is no existing code to adapt for either method, and this bridge
// does not invent that logic.
//
// VERIFIED (exhaustive repository search, recorded here so this decision
// is auditable rather than assumed):
//   1. By name — grep for createAmbientStream / createHarmonicStream /
//      createRhythmicStream / updateStream / exportSnapshot across every
//      .ts and .js file returns ONLY: the interface declarations in
//      FoundationTypes.ts, their consumers (AmbientFoundation.ts:31,33,
//      HarmonicFoundation.ts:30,32, RhythmicFoundation.ts:31,33,
//      FoundationAdapter.ts:103), and this comment. Zero producers.
//   2. By capability — the repository's only audio generator,
//      runtime/AudioRuntime.ts, is entirely offline buffer math
//      (generateSineBuffer, generateCosineBuffer,
//      generateHarmonicSeriesBuffer, mixBuffers, applyGain,
//      normalizeBuffer, measureRms/Peak/Energy, generateBinauralPair,
//      assembleAudioBuffer). It returns finished number[] buffers and has
//      no concept of a stream or a stream handle.
//   3. By primitive — no AudioContext, createOscillator, MediaStream,
//      AudioWorklet, ScriptProcessor, or .connect() call exists anywhere
//      in the repository, so no live-streaming substrate exists to build
//      a WaveCapability on.
//   4. By persistence — no JSON.stringify, localStorage, sessionStorage,
//      or indexedDB usage exists anywhere (the single grep hit is prose
//      inside a comment in validation/IdentityValidator.ts), so nothing
//      can persist an arbitrary FoundationLayerState snapshot.
// Conclusion: no existing implementation can satisfy either contract,
// under these names or any other. Returning null is therefore the
// accurate representation of the current repository, not a placeholder.
//
// foundation/AmbientFoundation.ts, HarmonicFoundation.ts, and
// RhythmicFoundation.ts already treat `WaveCapability | null` as fully
// valid (every stream-creation call site is null-guarded), and
// foundation/FoundationAdapter.ts already null-guards exportCapability
// the same way. Returning null from both request methods below is
// therefore not a stub — it is the repository's own documented
// "capability not available" path, reached honestly because that
// capability doesn't exist yet.
//
// registerSubsystem has no existing analog anywhere in the repository.
// It is pure bookkeeping (a named map), not business logic, so it is
// implemented directly here.

import type {
  CompositionRuntime as FoundationCompositionRuntimeInterface,
  WaveCapability as FoundationWaveCapability,
  ExportCapability as FoundationExportCapability,
  FoundationRuntimeInterface,
} from "../foundation/FoundationTypes";

export class CompositionRuntimeBridge implements FoundationCompositionRuntimeInterface {
  private readonly subsystems = new Map<string, FoundationRuntimeInterface>();

  registerSubsystem(name: string, runtime: FoundationRuntimeInterface): void {
    this.subsystems.set(name, runtime);
  }

  /** Read accessor — not part of the Foundation interface, provided for callers that need it. */
  getSubsystem(name: string): FoundationRuntimeInterface | undefined {
    return this.subsystems.get(name);
  }

  requestWaveCapability(): FoundationWaveCapability | null {
    // No repository code creates ambient/harmonic/rhythmic streams.
    // capabilities/output/WaveCapability.ts solves a different problem
    // (full-session composition). Returning null exercises the
    // repository's existing null-safe path in AmbientFoundation /
    // HarmonicFoundation / RhythmicFoundation rather than fabricating
    // stream behavior that doesn't exist.
    return null;
  }

  requestExportCapability(): FoundationExportCapability | null {
    // No repository code exports an arbitrary FoundationLayerState
    // snapshot. capabilities/output/ExportCapability.ts only encodes an
    // AudioBuffer to WAV. FoundationAdapter already null-guards this
    // capability, so null is the honest, existing path here too.
    return null;
  }
}
