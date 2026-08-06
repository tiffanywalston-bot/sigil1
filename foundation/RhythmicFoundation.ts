// foundation/RhythmicFoundation.ts

import {
  FoundationLayer,
  FoundationLayerId,
  FoundationLayerState,
  RhythmicParameters,
  RhythmicMode,
  PrimaryAttunementPreset,
  WaveCapability,
} from "./FoundationTypes";
import { DEFAULT_RHYTHMIC } from "./FoundationConfig";

export class RhythmicFoundation implements FoundationLayer {
  readonly id: FoundationLayerId = "rhythmic";
  private params: RhythmicParameters = { ...DEFAULT_RHYTHMIC };
  private readonly waveCapability: WaveCapability | null;
  private rhythmicStreamHandle: unknown | null = null;

  constructor(waveCapability: WaveCapability | null) {
    this.waveCapability = waveCapability;
    this.ensureStream();
  }

  private ensureStream(): void {
    if (!this.waveCapability) {
      return;
    }
    if (!this.rhythmicStreamHandle) {
      this.rhythmicStreamHandle =
        this.waveCapability.createRhythmicStream(this.params);
    } else {
      this.waveCapability.updateStream(this.rhythmicStreamHandle, this.params);
    }
  }

  setMode(mode: RhythmicMode): void {
    this.params.mode = mode;
    this.applyModeDefaults(mode);
    this.ensureStream();
  }

  private applyModeDefaults(mode: RhythmicMode): void {
    switch (mode) {
      case "Relaxation":
        this.params.tempoBpm = 60;
        this.params.density = 0.3;
        this.params.complexity = 0.3;
        this.params.accentIntensity = 0.3;
        this.params.evolutionRate = 0.4;
        break;
      case "Focus":
        this.params.tempoBpm = 80;
        this.params.density = 0.6;
        this.params.complexity = 0.5;
        this.params.accentIntensity = 0.6;
        this.params.evolutionRate = 0.6;
        break;
      case "Reflection":
        this.params.tempoBpm = 70;
        this.params.density = 0.4;
        this.params.complexity = 0.4;
        this.params.accentIntensity = 0.4;
        this.params.evolutionRate = 0.5;
        break;
      case "Breathing":
        this.params.tempoBpm = 6 * 10; // 6 breaths/min mapped to rhythmic pulses
        this.params.density = 0.2;
        this.params.complexity = 0.2;
        this.params.accentIntensity = 0.5;
        this.params.evolutionRate = 0.3;
        break;
    }
  }

  setParameters(params: Partial<RhythmicParameters>): void {
    this.params = { ...this.params, ...params };
    this.ensureStream();
  }

  getState(): FoundationLayerState {
    return { rhythmic: { ...this.params } };
  }

  applyAttunement(preset: PrimaryAttunementPreset): void {
    const { rhythm, intensity } = preset.controls;
    this.params.density = rhythm;
    this.params.accentIntensity = intensity;
    this.params.evolutionRate = 0.5 + rhythm * 0.3;
    this.ensureStream();
  }

  updateFromRuntime(state: FoundationLayerState): void {
    if (state.rhythmic) {
      this.params = { ...this.params, ...state.rhythmic };
      this.ensureStream();
    }
  }
}
