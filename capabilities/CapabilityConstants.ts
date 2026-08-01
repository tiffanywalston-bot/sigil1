// capabilities/CapabilityConstants.ts

import type { CapabilityId } from "./CapabilityTypes";

export const CAPABILITY_REGISTRY_VERSION = "GMC-1.0.0" as const;

export const CORE_CAPABILITIES: readonly CapabilityId[] = [
  "core.identity",
  "core.memory",
  "core.validation",
] as const;

export const AUDIO_CAPABILITIES: readonly CapabilityId[] = [
  "audio.frequency",
  "audio.binaural",
  "audio.subliminal",
] as const;

export const VISUALIZATION_CAPABILITIES: readonly CapabilityId[] = [
  "visualization.geometry",
  "visualization.harmonic",
  "visualization.cloud",
  "visualization.ring",
  "visualization.star",
] as const;

export const SESSION_CAPABILITIES: readonly CapabilityId[] = [
  "session.meditation",
  "session.ritual",
  "session.oracle",
  "session.reflection",
] as const;

export const OUTPUT_CAPABILITIES: readonly CapabilityId[] = [
  "output.wave",
  "output.image",
  "output.export",
] as const;

export const FUTURE_CAPABILITIES: readonly CapabilityId[] = [
  "future.reserved",
] as const;
