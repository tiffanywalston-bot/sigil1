import {
  FoundationRuntimeInterface,
  FoundationLayer,
  FoundationLayerId,
  FoundationLayerState,
  FoundationEvent,
  PrimaryAttunementPreset,
  PrimaryAttunementPresetName,
} from "./FoundationTypes";
import {
  INTERPOLATION_DEFAULT_DURATION_MS,
  PRIMARY_ATTUNEMENT_PRESETS,
} from "./FoundationConfig";

type EventHandler = (event: FoundationEvent) => void;

export class FoundationRuntime implements FoundationRuntimeInterface {
  private readonly layers: Map<FoundationLayerId, FoundationLayer> = new Map();
  private globalState: FoundationLayerState = {};
  private readonly eventHandlers: EventHandler[] = [];

  registerLayer(layer: FoundationLayer): void {
    this.layers.set(layer.id, layer);
    const state = layer.getState();
    this.globalState = { ...this.globalState, ...state };
  }

  getLayer(id: FoundationLayerId): FoundationLayer | undefined {
    return this.layers.get(id);
  }

  getGlobalState(): FoundationLayerState {
    return { ...this.globalState };
  }

  updateLayerState(
    id: FoundationLayerId,
    partial: Partial<FoundationLayerState>,
    options?: { interpolate?: boolean; durationMs?: number }
  ): void {
    const layer = this.layers.get(id);
    if (!layer) {
      return;
    }

    const duration =
      options?.durationMs ?? INTERPOLATION_DEFAULT_DURATION_MS;
    const interpolate = options?.interpolate ?? true;

    const current = layer.getState();
    const target: FoundationLayerState = { ...current, ...partial };

    if (!interpolate) {
      layer.updateFromRuntime(target);
      this.globalState = { ...this.globalState, ...target };
      this.broadcastEvent({
        layerId: id,
        type: "stateUpdated",
        payload: target,
        timestamp: Date.now(),
      });
      return;
    }

    this.interpolateState(id, current, target, duration);
  }

  private interpolateState(
    id: FoundationLayerId,
    from: FoundationLayerState,
    to: FoundationLayerState,
    durationMs: number
  ): void {
    const layer = this.layers.get(id);
    if (!layer) {
      return;
    }

    const steps = Math.max(4, Math.floor(durationMs / 100));
    for (let step = 1; step <= steps; step++) {
      const t = step / steps;
      const interpolated = this.interpolateLayerState(from, to, t);
      layer.updateFromRuntime(interpolated);
      this.globalState = { ...this.globalState, ...interpolated };
    }

    this.broadcastEvent({
      layerId: id,
      type: "stateInterpolated",
      payload: to,
      timestamp: Date.now(),
    });
  }

  private interpolateLayerState(
    from: FoundationLayerState,
    to: FoundationLayerState,
    t: number
  ): FoundationLayerState {
    const lerp = (a: number | undefined, b: number | undefined): number => {
      if (a === undefined) return b ?? 0;
      if (b === undefined) return a;
      return a + (b - a) * t;
    };

    const result: FoundationLayerState = {};

    if (from.ambient || to.ambient) {
      const fa = from.ambient;
      const ta = to.ambient ?? fa!;
      result.ambient = {
        type: ta.type,
        intensity: lerp(fa?.intensity, ta.intensity),
        textureDepth: lerp(fa?.textureDepth, ta.textureDepth),
        motion: lerp(fa?.motion, ta.motion),
        loopLengthSeconds: lerp(
          fa?.loopLengthSeconds,
          ta.loopLengthSeconds
        ),
        crossfadeSeconds: lerp(fa?.crossfadeSeconds, ta.crossfadeSeconds),
      };
    }

    if (from.harmonic || to.harmonic) {
      const fh = from.harmonic;
      const th = to.harmonic ?? fh!;
      result.harmonic = {
        padEvolving: th.padEvolving,
        harmonicDensity: lerp(fh?.harmonicDensity, th.harmonicDensity),
        warmth: lerp(fh?.warmth, th.warmth),
        brightness: lerp(fh?.brightness, th.brightness),
        intensity: lerp(fh?.intensity, th.intensity),
        evolutionRate: lerp(fh?.evolutionRate, th.evolutionRate),
      };
    }

    if (from.rhythmic || to.rhythmic) {
      const fr = from.rhythmic;
      const tr = to.rhythmic ?? fr!;
      result.rhythmic = {
        mode: tr.mode,
        tempoBpm: lerp(fr?.tempoBpm, tr.tempoBpm),
        density: lerp(fr?.density, tr.density),
        complexity: lerp(fr?.complexity, tr.complexity),
        accentIntensity: lerp(fr?.accentIntensity, tr.accentIntensity),
        evolutionRate: lerp(fr?.evolutionRate, tr.evolutionRate),
      };
    }

    if (from.soundscape || to.soundscape) {
      const fs = from.soundscape;
      const ts = to.soundscape ?? fs!;
      result.soundscape = {
        ambient: result.ambient ?? ts.ambient,
        harmonic: result.harmonic ?? ts.harmonic,
        rhythmic: result.rhythmic ?? ts.rhythmic,
        globalIntensity: lerp(
          fs?.globalIntensity,
          ts.globalIntensity
        ),
      };
    }

    if (to.guidance) {
      result.guidance = to.guidance;
    }

    if (to.attunement) {
      result.attunement = to.attunement;
    }

    return result;
  }

  broadcastEvent(event: FoundationEvent): void {
    for (const handler of this.eventHandlers) {
      handler(event);
    }
  }

  onEvent(handler: EventHandler): void {
    this.eventHandlers.push(handler);
  }

  applyPrimaryAttunement(preset: PrimaryAttunementPreset): void {
    for (const layer of this.layers.values()) {
      layer.applyAttunement(preset);
    }
    this.globalState.attunement = preset;
    this.broadcastEvent({
      layerId: "attunement",
      type: "primaryAttunementApplied",
      payload: preset,
      timestamp: Date.now(),
    });
  }

  applyPrimaryAttunementByName(name: PrimaryAttunementPresetName): void {
    const preset = PRIMARY_ATTUNEMENT_PRESETS[name];
    if (preset) {
      this.applyPrimaryAttunement(preset);
    }
  }
}
