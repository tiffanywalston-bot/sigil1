// capabilities/CapabilityLaw.ts

export enum CapabilityLawCode {
  REGISTRY_AUTHORITY = "LAW_CAP_001",
  SINGLE_RESPONSIBILITY = "LAW_CAP_002",
  DEPENDENCY_DECLARATION = "LAW_CAP_003",
  DETERMINISTIC_INITIALIZATION = "LAW_CAP_004",
  GRACEFUL_REMOVAL = "LAW_CAP_005",
  RENDERER_INDEPENDENCE = "LAW_CAP_006",
  SCENE_INDEPENDENCE = "LAW_CAP_007",
  ENGINE_ORCHESTRATION = "LAW_CAP_008",
  CAPABILITY_SOVEREIGNTY = "LAW_CAP_009",
  CAPABILITY_IMMUTABILITY = "LAW_CAP_010",
  CAPABILITY_OBSERVABILITY = "LAW_CAP_011",
  CONTINUOUS_BUBBLE = "LAW_CB_001",
}

export interface CapabilityLaw {
  code: CapabilityLawCode;
  name: string;
  description: string;
}

export const CAPABILITY_LAW_VERSION = "GMC-1.0.0" as const;

export const CAPABILITY_LAWS: readonly CapabilityLaw[] = Object.freeze([
  {
    code: CapabilityLawCode.REGISTRY_AUTHORITY,
    name: "Registry Authority",
    description:
      "Every capability must be registered through the Capability Registry. No subsystem may bypass the registry.",
  },
  {
    code: CapabilityLawCode.SINGLE_RESPONSIBILITY,
    name: "Single Responsibility",
    description:
      "A capability has one primary purpose. It may depend on other capabilities but must not absorb their responsibilities.",
  },
  {
    code: CapabilityLawCode.DEPENDENCY_DECLARATION,
    name: "Dependency Declaration",
    description:
      "Every capability explicitly declares its dependencies. Hidden or implicit dependencies are prohibited.",
  },
  {
    code: CapabilityLawCode.DETERMINISTIC_INITIALIZATION,
    name: "Deterministic Initialization",
    description:
      "Capabilities initialize only after dependency validation succeeds. Initialization order is determined by the registry, not individual capabilities.",
  },
  {
    code: CapabilityLawCode.GRACEFUL_REMOVAL,
    name: "Graceful Removal",
    description:
      "Disabling or removing a capability must not destabilize the engine. Dependent capabilities must fail predictably with clear validation messages.",
  },
  {
    code: CapabilityLawCode.RENDERER_INDEPENDENCE,
    name: "Renderer Independence",
    description:
      "Capabilities may request rendering services but never own or modify the renderer itself.",
  },
  {
    code: CapabilityLawCode.SCENE_INDEPENDENCE,
    name: "Scene Independence",
    description:
      "Capabilities may contribute objects to the scene but never become the scene manager.",
  },
  {
    code: CapabilityLawCode.ENGINE_ORCHESTRATION,
    name: "Engine Orchestration",
    description:
      "The Engine orchestrates capability execution. Capabilities never orchestrate the Engine.",
  },
  {
    code: CapabilityLawCode.CAPABILITY_SOVEREIGNTY,
    name: "Capability Sovereignty",
    description:
      "A capability owns only its internal state and behavior. Cross-capability interaction occurs only through declared interfaces, registry contracts, or engine orchestration.",
  },
  {
    code: CapabilityLawCode.CAPABILITY_IMMUTABILITY,
    name: "Capability Immutability",
    description:
      "Once registered and initialized, a capability’s identity, category, and declared dependency contract are immutable for the lifetime of that engine session.",
  },
  {
    code: CapabilityLawCode.CAPABILITY_OBSERVABILITY,
    name: "Capability Observability",
    description:
      "Every capability shall expose sufficient metadata and lifecycle state for the Engine to inspect, diagnose, and report capability status without requiring access to the capability's internal implementation.",
  },
  {
    code: CapabilityLawCode.CONTINUOUS_BUBBLE,
    name: "Continuous Bubble Law",
    description:
      "The capability architecture remains continuously expandable. New capabilities integrate exclusively through the Capability Registry without requiring modification of existing capabilities or the Engine orchestration contract.",
  },
] as const);

export function getCapabilityLaw(
  code: CapabilityLawCode
): CapabilityLaw | undefined {
  return CAPABILITY_LAWS.find((law) => law.code === code);
}

export function hasCapabilityLaw(code: CapabilityLawCode): boolean {
  return CAPABILITY_LAWS.some((law) => law.code === code);
}
