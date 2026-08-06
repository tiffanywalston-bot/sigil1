// foundation/HarmonicFoundation.ts

import {
  FoundationLayer,
  FoundationLayerId,
  FoundationLayerState,
  HarmonicParameters,
  PrimaryAttunementPreset,
  WaveCapability,
} from "./FoundationTypes";
import { DEFAULT_HARMONIC } from "./FoundationConfig";

export class HarmonicFoundation implements FoundationLayer {
  readonly id: FoundationLayerId = "harmonic";
  private params: HarmonicParameters = { ...DEFAULT_HARMONIC };
  private readonly waveCapability: WaveCapability | null;
  private harmonicStreamHandle: unknown | null = null;

  constructor(waveCapability: WaveCapability | null) {
    this.waveCapability = waveCapability;
    this.ensureStream();
  }

  private ensureStream(): void {
    if (!this.waveCapability) {
      return;
    }
    if (!this.harmonicStreamHandle) {
      this.harmonicStreamHandle =
        this.waveCapability.createHarmonicStream(this.params);
    } else {
      this.waveCapability.updateStream(this.harmonicStreamHandle, this.params);
    }
  }

  setParameters(params: Partial<HarmonicParameters>): void {
    this.params = { ...this.params, ...params };
    this.ensureStream();
  }

  getState(): FoundationLayerState {
    return { harmonic: { ...this.params } };
  }

  applyAttunement(preset: PrimaryAttunementPreset): void {
    const { intensity, warmth } = preset.controls;
    this.params.intensity = intensity;
    this.params.warmth = warmth;
    this.params.padEvolving = true;
    this.ensureStream();
  }

  updateFromRuntime(state: FoundationLayerState): void {
    if (state.harmonic) {
      this.params = { ...this.params, ...state.harmonic };
      this.ensureStream();
    }
  }
}
