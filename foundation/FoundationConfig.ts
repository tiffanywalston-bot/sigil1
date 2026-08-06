// foundation/FoundationConfig.ts

import {
  AmbientParameters,
  AmbientType,
  HarmonicParameters,
  RhythmicParameters,
  PrimaryAttunementPreset,
  PrimaryAttunementPresetName,
  PrimaryAttunementControls,
} from "./FoundationTypes";

export const DEFAULT_AMBIENT: AmbientParameters = {
  type: AmbientType.EnvironmentalAmbience,
  intensity: 0.5,
  textureDepth: 0.5,
  motion: 0.4,
  loopLengthSeconds: 600,
  crossfadeSeconds: 8,
};

export const DEFAULT_HARMONIC: HarmonicParameters = {
  padEvolving: true,
  harmonicDensity: 0.5,
  warmth: 0.6,
  brightness: 0.4,
  intensity: 0.5,
  evolutionRate: 0.5,
};

export const DEFAULT_RHYTHMIC: RhythmicParameters = {
  mode: "Relaxation",
  tempoBpm: 60,
  density: 0.3,
  complexity: 0.3,
  accentIntensity: 0.3,
  evolutionRate: 0.4,
};

const presetControls = (
  intensity: number,
  warmth: number,
  rhythm: number,
  environment: number
): PrimaryAttunementControls => ({
  intensity,
  warmth,
  rhythm,
  environment,
});

export const PRIMARY_ATTUNEMENT_PRESETS: Record<
  PrimaryAttunementPresetName,
  PrimaryAttunementPreset
> = {
  "Internal Resonance": {
    name: "Internal Resonance",
    controls: presetControls(0.7, 0.7, 0.5, 0.6),
  },
  "Social Boundary Integrity": {
    name: "Social Boundary Integrity",
    controls: presetControls(0.6, 0.4, 0.5, 0.5),
  },
  "Deep Stability": {
    name: "Deep Stability",
    controls: presetControls(0.5, 0.6, 0.2, 0.4),
  },
  "Reflective Awareness": {
    name: "Reflective Awareness",
    controls: presetControls(0.5, 0.5, 0.4, 0.5),
  },
  "Focused Attention": {
    name: "Focused Attention",
    controls: presetControls(0.8, 0.3, 0.6, 0.4),
  },
  "Creative Flow": {
    name: "Creative Flow",
    controls: presetControls(0.7, 0.5, 0.7, 0.6),
  },
};

export const INTERPOLATION_DEFAULT_DURATION_MS = 1500;

// Integration points (backend only, no browser)
// These strings can be used by the host runtime to attach UI/DOM later.
export const INTEGRATION_POINTS = {
  ambientControlChannel: "foundation:ambient:control",
  harmonicControlChannel: "foundation:harmonic:control",
  rhythmicControlChannel: "foundation:rhythmic:control",
  soundscapeControlChannel: "foundation:soundscape:control",
  guidanceControlChannel: "foundation:guidance:control",
  attunementControlChannel: "foundation:attunement:control",
};
