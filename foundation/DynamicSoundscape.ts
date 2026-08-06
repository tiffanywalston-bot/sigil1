// foundation/DynamicSoundscape.ts

import {
  DynamicSoundscapeState,
  FoundationLayer,
  FoundationLayerId,
  FoundationLayerState,
  PrimaryAttunementPreset,
} from "./FoundationTypes";
import {
  DEFAULT_AMBIENT,
  DEFAULT_HARMONIC,
  DEFAULT_RHYTHMIC,
} from "./FoundationConfig";

export class DynamicSoundscape implements FoundationLayer {
  readonly id: FoundationLayerId = "soundscape";
  private state: DynamicSoundscapeState = {
    ambient: { ...DEFAULT_AMBIENT },
    harmonic: { ...DEFAULT_HARMONIC },
    rhythmic: { ...DEFAULT_RHYTHMIC },
    globalIntensity: 0.5,
  };

  constructor(
    private readonly ambientLayer: FoundationLayer,
    private readonly harmonicLayer: FoundationLayer,
    private readonly rhythmicLayer: FoundationLayer
  ) {}

  getState(): FoundationLayerState {
    return { soundscape: { ...this.state } };
  }

  applyAttunement(preset: PrimaryAttunementPreset): void {
    const { intensity } = preset.controls;
    this.state.globalIntensity = intensity;
    const ambient = this.ambientLayer.getState().ambient ?? DEFAULT_AMBIENT;
    const harmonic = this.harmonicLayer.getState().harmonic ?? DEFAULT_HARMONIC;
    const rhythmic = this.rhythmicLayer.getState().rhythmic ?? DEFAULT_RHYTHMIC;

    this.state.ambient = { ...ambient, intensity: intensity };
    this.state.harmonic = { ...harmonic, intensity: intensity };
    this.state.rhythmic = {
      ...rhythmic,
      accentIntensity: intensity,
    };
  }

  updateFromRuntime(state: FoundationLayerState): void {
    if (state.soundscape) {
      this.state = { ...this.state, ...state.soundscape };
    }
    if (state.ambient) {
      this.state.ambient = { ...this.state.ambient, ...state.ambient };
    }
    if (state.harmonic) {
      this.state.harmonic = { ...this.state.harmonic, ...state.harmonic };
    }
    if (state.rhythmic) {
      this.state.rhythmic = { ...this.state.rhythmic, ...state.rhythmic };
    }
  }

  synchronizeFromLayers(): void {
    const ambient = this.ambientLayer.getState().ambient ?? DEFAULT_AMBIENT;
    const harmonic = this.harmonicLayer.getState().harmonic ?? DEFAULT_HARMONIC;
    const rhythmic = this.rhythmicLayer.getState().rhythmic ?? DEFAULT_RHYTHMIC;
    this.state = {
      ambient,
      harmonic,
      rhythmic,
      globalIntensity: this.state.globalIntensity,
    };
  }
}
