// foundation/FoundationTypes.ts

export type FoundationLayerId =
  | "ambient"
  | "harmonic"
  | "rhythmic"
  | "soundscape"
  | "guidance"
  | "attunement";

export enum AmbientType {
  Rain = "rain",
  Ocean = "ocean",
  Forest = "forest",
  Wind = "wind",
  EnvironmentalAmbience = "environmental_ambience",
}

export interface AmbientParameters {
  type: AmbientType;
  intensity: number; // 0–1
  textureDepth: number; // 0–1
  motion: number; // 0–1, perceived movement
  loopLengthSeconds: number;
  crossfadeSeconds: number;
}

export interface HarmonicParameters {
  padEvolving: boolean;
  harmonicDensity: number; // 0–1
  warmth: number; // 0–1
  brightness: number; // 0–1
  intensity: number; // 0–1
  evolutionRate: number; // 0–1
}

export type RhythmicMode = "Relaxation" | "Focus" | "Reflection" | "Breathing";

export interface RhythmicParameters {
  mode: RhythmicMode;
  tempoBpm: number;
  density: number; // 0–1
  complexity: number; // 0–1
  accentIntensity: number; // 0–1
  evolutionRate: number; // 0–1
}

export interface DynamicSoundscapeState {
  ambient: AmbientParameters;
  harmonic: HarmonicParameters;
  rhythmic: RhythmicParameters;
  globalIntensity: number; // 0–1
}

export type ReflectivePromptCategory =
  | "Centering"
  | "Reflection"
  | "Decision"
  | "Integration";

export type ReflectiveOutputMode = "text" | "voice" | "silent";

export interface ReflectivePrompt {
  id: string;
  category: ReflectivePromptCategory;
  content: string;
}

export interface ReflectiveGuidanceState {
  category: ReflectivePromptCategory;
  mode: ReflectiveOutputMode;
  currentPrompt: ReflectivePrompt | null;
}

export type PrimaryAttunementPresetName =
  | "Internal Resonance"
  | "Social Boundary Integrity"
  | "Deep Stability"
  | "Reflective Awareness"
  | "Focused Attention"
  | "Creative Flow";

export interface PrimaryAttunementControls {
  intensity: number; // 0–1
  warmth: number; // 0–1
  rhythm: number; // 0–1
  environment: number; // 0–1
}

export interface PrimaryAttunementPreset {
  name: PrimaryAttunementPresetName;
  controls: PrimaryAttunementControls;
}

export interface FoundationLayerState {
  ambient?: AmbientParameters;
  harmonic?: HarmonicParameters;
  rhythmic?: RhythmicParameters;
  soundscape?: DynamicSoundscapeState;
  guidance?: ReflectiveGuidanceState;
  attunement?: PrimaryAttunementPreset;
}

export interface FoundationEvent {
  layerId: FoundationLayerId;
  type: string;
  payload: unknown;
  timestamp: number;
}

export interface FoundationLayer {
  readonly id: FoundationLayerId;
  getState(): FoundationLayerState;
  applyAttunement(preset: PrimaryAttunementPreset): void;
  updateFromRuntime(state: FoundationLayerState): void;
}

export interface FoundationRuntimeInterface {
  registerLayer(layer: FoundationLayer): void;
  getLayer(id: FoundationLayerId): FoundationLayer | undefined;
  getGlobalState(): FoundationLayerState;
  updateLayerState(
    id: FoundationLayerId,
    partial: Partial<FoundationLayerState>,
    options?: { interpolate?: boolean; durationMs?: number }
  ): void;
  broadcastEvent(event: FoundationEvent): void;
  onEvent(handler: (event: FoundationEvent) => void): void;
  applyPrimaryAttunement(preset: PrimaryAttunementPreset): void;
}

// Integration points to existing runtime (do not re‑implement, only interface)

export interface CompositionRuntime {
  registerSubsystem(name: string, runtime: FoundationRuntimeInterface): void;
  requestWaveCapability(): WaveCapability | null;
  requestExportCapability(): ExportCapability | null;
}

export interface WaveCapability {
  createAmbientStream(params: AmbientParameters): unknown;
  createHarmonicStream(params: HarmonicParameters): unknown;
  createRhythmicStream(params: RhythmicParameters): unknown;
  updateStream(streamHandle: unknown, params: unknown): void;
}

export interface ExportCapability {
  exportSnapshot(name: string, state: FoundationLayerState): Promise<void>;
}

export interface CapabilityRegistry {
  registerCapability(name: string, capability: unknown): void;
}
