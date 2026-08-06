// foundation/AmbientFoundation.ts

import {
  AmbientParameters,
  AmbientType,
  FoundationLayer,
  FoundationLayerId,
  FoundationLayerState,
  PrimaryAttunementPreset,
  WaveCapability,
} from "./FoundationTypes";
import { DEFAULT_AMBIENT } from "./FoundationConfig";

export class AmbientFoundation implements FoundationLayer {
  readonly id: FoundationLayerId = "ambient";
  private params: AmbientParameters = { ...DEFAULT_AMBIENT };
  private readonly waveCapability: WaveCapability | null;
  private ambientStreamHandle: unknown | null = null;

  constructor(waveCapability: WaveCapability | null) {
    this.waveCapability = waveCapability;
    this.ensureStream();
  }

  private ensureStream(): void {
    if (!this.waveCapability) {
      return;
    }
    if (!this.ambientStreamHandle) {
      this.ambientStreamHandle =
        this.waveCapability.createAmbientStream(this.params);
    } else {
      this.waveCapability.updateStream(this.ambientStreamHandle, this.params);
    }
  }

  setAmbientType(type: AmbientType): void {
    this.params.type = type;
    this.ensureStream();
  }

  setParameters(params: Partial<AmbientParameters>): void {
    this.params = { ...this.params, ...params };
    this.ensureStream();
  }

  getState(): FoundationLayerState {
    return { ambient: { ...this.params } };
  }

  applyAttunement(preset: PrimaryAttunementPreset): void {
    const { intensity, warmth, environment } = preset.controls;
    this.params.intensity = intensity;
    this.params.textureDepth = warmth;
    this.params.motion = environment;
    this.ensureStream();
  }

  updateFromRuntime(state: FoundationLayerState): void {
    if (state.ambient) {
      this.params = { ...this.params, ...state.ambient };
      this.ensureStream();
    }
  }
}
