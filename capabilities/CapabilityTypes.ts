// capabilities/CapabilityTypes.ts

export type CapabilityCategory =
  | "core"
  | "audio"
  | "visualization"
  | "session"
  | "output"
  | "future";

export type CapabilityId =
  | "core.identity"
  | "core.memory"
  | "core.validation"
  | "audio.frequency"
  | "audio.binaural"
  | "audio.subliminal"
  | "visualization.geometry"
  | "visualization.harmonic"
  | "visualization.cloud"
  | "visualization.ring"
  | "visualization.star"
  | "session.meditation"
  | "session.ritual"
  | "session.oracle"
  | "session.reflection"
  | "output.wave"
  | "output.image"
  | "output.export"
  | "future.reserved";

export type CapabilityDependency = CapabilityId;

export type CapabilitySeverity = "info" | "warning" | "error";

export interface CapabilityError {
  severity: CapabilitySeverity;
  code: string;
  message: string;
  timestamp: string;
}

export interface CapabilityContext {
  engineId: string;
  sessionId?: string;
}

export interface CapabilityStatus {
  id: CapabilityId;
  version: string;
  category: CapabilityCategory;
  enabled: boolean;
  dependencies: readonly CapabilityDependency[];
  registered: boolean;
  validated: boolean;
  initialized: boolean;
  executed: boolean;
  shutdown: boolean;
  lastError: CapabilityError | null;
}
