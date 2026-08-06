// foundation/PrimaryAttunement.ts

import {
  FoundationLayer,
  FoundationLayerId,
  FoundationLayerState,
  PrimaryAttunementPreset,
  PrimaryAttunementPresetName,
} from "./FoundationTypes";
import { PRIMARY_ATTUNEMENT_PRESETS } from "./FoundationConfig";

export class PrimaryAttunement implements FoundationLayer {
  readonly id: FoundationLayerId = "attunement";
  private preset: PrimaryAttunementPreset =
    PRIMARY_ATTUNEMENT_PRESETS["Internal Resonance"];

  getState(): FoundationLayerState {
    return { attunement: this.preset };
  }

  setPresetByName(name: PrimaryAttunementPresetName): void {
    const preset = PRIMARY_ATTUNEMENT_PRESETS[name];
    if (preset) {
      this.preset = preset;
    }
  }

  applyAttunement(preset: PrimaryAttunementPreset): void {
    this.preset = preset;
  }

  updateFromRuntime(state: FoundationLayerState): void {
    if (state.attunement) {
      this.preset = state.attunement;
    }
  }

  getCurrentPreset(): PrimaryAttunementPreset {
    return this.preset;
  }
}
