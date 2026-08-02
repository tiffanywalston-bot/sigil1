// capabilities/CapabilityMetadata.ts

import type { CapabilityMetadata } from "./CapabilityInterfaces";
import type { CapabilityId, CapabilityCategory } from "./CapabilityTypes";

function meta(
  id: CapabilityId,
  name: string,
  category: CapabilityCategory,
  description: string,
  defaultEnabled = true,
  featureFlags: readonly string[] = []
): CapabilityMetadata {
  return {
    id,
    name,
    category,
    description,
    version: "GMC-1.0.0",
    defaultEnabled,
    featureFlags,
  };
}

export const CAPABILITY_METADATA: readonly CapabilityMetadata[] = Object.freeze([
  meta("core.identity", "Identity", "core", "Core identity capability."),
  meta("core.memory", "Memory", "core", "Core memory capability."),
  meta("core.validation", "Validation", "core", "Core validation capability."),
  meta("audio.frequency", "Frequency", "audio", "Frequency audio capability."),
  meta("audio.binaural", "Binaural", "audio", "Binaural audio capability."),
  meta("audio.subliminal", "Subliminal", "audio", "Subliminal audio capability.", false),
  meta("visualization.geometry", "Geometry", "visualization", "Geometry visualization capability."),
  meta("visualization.harmonic", "Harmonic", "visualization", "Harmonic visualization capability."),
  meta("visualization.cloud", "Cloud", "visualization", "Cloud visualization capability."),
  meta("visualization.ring", "Ring", "visualization", "Ring visualization capability."),
  meta("visualization.star", "Star", "visualization", "Star visualization capability."),
  meta("session.meditation", "Meditation", "session", "Meditation session capability."),
  meta("session.ritual", "Ritual", "session", "Ritual session capability."),
  meta("session.oracle", "Oracle", "session", "Oracle session capability."),
  meta("session.reflection", "Reflection", "session", "Reflection session capability."),
  meta("output.wave", "Wave Output", "output", "Wave audio output capability."),
  meta("output.image", "Image Output", "output", "Image export capability."),
  meta("output.export", "Session Export", "output", "Session export capability."),
  meta("future.reserved", "Reserved", "future", "Reserved future capability.", false),
] as const);

export function getCapabilityMetadata(
  id: CapabilityId
): CapabilityMetadata | undefined {
  return CAPABILITY_METADATA.find((m) => m.id === id);
}
