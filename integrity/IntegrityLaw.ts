export enum IntegrityLawCode {
  SINGLE_AUTHORITY = "LAW_INT_001",
  PURE_CONTRACTS = "LAW_INT_002",
  NO_DOWNSTREAM_KNOWLEDGE = "LAW_INT_003",
  STABLE_PUBLIC_API = "LAW_INT_004",
  NO_CIRCULAR_REFERENCES = "LAW_INT_005",
  OWNERSHIP = "LAW_INT_006",
  EXTENSION_WITHOUT_MODIFICATION = "LAW_INT_007",
  ONE_NAMING_STANDARD = "LAW_INT_008",
  NO_DEAD_CONTRACTS = "LAW_INT_009",
  IMMUTABLE_AUTHORITY = "LAW_INT_010",
  INTERFACE_COMPLETENESS = "LAW_INT_011",
  CONTRACT_ISOLATION = "LAW_INT_012",
}

export enum IntegrityDomain {
  INTERFACES = "interfaces",
  AUDIO = "audio",
  GEOMETRY = "geometry",
  HARMONICS = "harmonics",
  CAPABILITIES = "capabilities",
  VALIDATION = "validation",
  SESSIONS = "sessions",
  UNIVERSE = "universe",
  RENDERER = "renderer",
  FUTURE = "future",
}

export type IntegritySeverity = "critical" | "major" | "minor";

export type IntegrityCategory =
  | "architecture"
  | "dependency"
  | "contracts"
  | "ownership"
  | "documentation";

export interface IntegrityLaw {
  code: IntegrityLawCode;
  name: string;
  description: string;

  rationale?: string;
  severity?: IntegritySeverity;
  category?: IntegrityCategory;
  domain?: IntegrityDomain | IntegrityDomain[];
  version?: number;
  autoFixable?: boolean;
  mandatory?: boolean;
}

export const INTERFACES_INTEGRITY_VERSION = "v1.2.0" as const;
export const INTEGRITY_VERSION = INTERFACES_INTEGRITY_VERSION;

export const INTEGRITY_LAWS: readonly IntegrityLaw[] = Object.freeze([
  {
    code: IntegrityLawCode.SINGLE_AUTHORITY,
    name: "Single Authority",
    description:
      "Each architectural contract represents exactly one concept. No duplicates, no competing contracts, one owner.",
    rationale:
      "Preserves a single contractual authority and prevents architectural drift across subsystems.",
    severity: "critical",
    category: "architecture",
    domain: [
      IntegrityDomain.INTERFACES,
      IntegrityDomain.CAPABILITIES,
      IntegrityDomain.UNIVERSE,
    ],
    version: 1,
    autoFixable: false,
    mandatory: true,
  },
  {
    code: IntegrityLawCode.PURE_CONTRACTS,
    name: "Pure Contracts",
    description:
      "Architectural contracts define only structure and behavior signatures. No algorithms, state mutation, or initialization logic.",
    rationale:
      "Ensures contracts remain declarative and implementation-agnostic for all engine subsystems.",
    severity: "critical",
    category: "contracts",
    domain: [
      IntegrityDomain.INTERFACES,
      IntegrityDomain.CAPABILITIES,
      IntegrityDomain.RENDERER,
    ],
    version: 1,
    autoFixable: false,
    mandatory: true,
  },
  {
    code: IntegrityLawCode.NO_DOWNSTREAM_KNOWLEDGE,
    name: "No Downstream Knowledge",
    description:
      "Contracts may depend on primitives, shared types, and other contracts, but never on concrete implementation layers.",
    rationale:
      "Prevents dependency inversion violations and preserves clean architectural layering.",
    severity: "critical",
    category: "dependency",
    domain: [
      IntegrityDomain.INTERFACES,
      IntegrityDomain.GEOMETRY,
      IntegrityDomain.HARMONICS,
      IntegrityDomain.RENDERER,
    ],
    version: 1,
    autoFixable: false,
    mandatory: true,
  },
  {
    code: IntegrityLawCode.STABLE_PUBLIC_API,
    name: "Stable Public API",
    description:
      "Every exported contract is intended for long-term public consumption. No temporary, experimental, or hidden alternates.",
    rationale:
      "Maintains stability and predictability for all consumers of the engine’s architectural surface.",
    severity: "major",
    category: "documentation",
    domain: [
      IntegrityDomain.INTERFACES,
      IntegrityDomain.CAPABILITIES,
      IntegrityDomain.SESSIONS,
    ],
    version: 1,
    autoFixable: false,
    mandatory: true,
  },
  {
    code: IntegrityLawCode.NO_CIRCULAR_REFERENCES,
    name: "No Circular References",
    description:
      "Architectural contracts must not form cycles. The dependency graph remains acyclic.",
    rationale:
      "Ensures deterministic initialization and prevents dependency graph collapse.",
    severity: "critical",
    category: "dependency",
    domain: [
      IntegrityDomain.INTERFACES,
      IntegrityDomain.CAPABILITIES,
      IntegrityDomain.VALIDATION,
    ],
    version: 1,
    autoFixable: false,
    mandatory: true,
  },
  {
    code: IntegrityLawCode.OWNERSHIP,
    name: "Ownership",
    description:
      "Every contract must clearly define who owns it, who implements it, and who consumes it.",
    rationale:
      "Eliminates ambiguity and enforces architectural accountability across all subsystems.",
    severity: "major",
    category: "ownership",
    domain: [
      IntegrityDomain.INTERFACES,
      IntegrityDomain.CAPABILITIES,
      IntegrityDomain.UNIVERSE,
    ],
    version: 1,
    autoFixable: false,
    mandatory: true,
  },
  {
    code: IntegrityLawCode.EXTENSION_WITHOUT_MODIFICATION,
    name: "Extension Without Modification",
    description:
      "Adding new implementations must not require editing existing contract definitions unless the architecture itself changes.",
    rationale:
      "Preserves stability of architectural contracts and prevents churn.",
    severity: "major",
    category: "architecture",
    domain: [
      IntegrityDomain.INTERFACES,
      IntegrityDomain.CAPABILITIES,
      IntegrityDomain.RENDERER,
    ],
    version: 1,
    autoFixable: false,
    mandatory: true,
  },
  {
    code: IntegrityLawCode.ONE_NAMING_STANDARD,
    name: "One Naming Standard",
    description:
      "Contracts must follow a single naming convention within a domain. Never mix styles.",
    rationale:
      "Ensures consistency and readability across architectural surfaces.",
    severity: "minor",
    category: "documentation",
    domain: IntegrityDomain.INTERFACES,
    version: 1,
    autoFixable: true,
    mandatory: true,
  },
  {
    code: IntegrityLawCode.NO_DEAD_CONTRACTS,
    name: "No Dead Contracts",
    description:
      "Every contract must be Active, Reserved, or Deprecated. No unknown or unused contracts.",
    rationale:
      "Prevents clutter and maintains a clear, intentional architectural map.",
    severity: "major",
    category: "documentation",
    domain: [
      IntegrityDomain.INTERFACES,
      IntegrityDomain.CAPABILITIES,
      IntegrityDomain.SESSIONS,
    ],
    version: 1,
    autoFixable: true,
    mandatory: true,
  },
  {
    code: IntegrityLawCode.IMMUTABLE_AUTHORITY,
    name: "Immutable Authority",
    description:
      "No other subsystem may redefine these contracts. The designated authority domain owns the canonical definitions.",
    rationale:
      "Prevents contract fragmentation and preserves a single source of truth.",
    severity: "critical",
    category: "architecture",
    domain: [
      IntegrityDomain.INTERFACES,
      IntegrityDomain.UNIVERSE,
    ],
    version: 1,
    autoFixable: false,
    mandatory: true,
  },
  {
    code: IntegrityLawCode.INTERFACE_COMPLETENESS,
    name: "Interface Completeness",
    description:
      "Every contract must be Complete or Deferred by Design. No placeholders or TODO contracts.",
    rationale:
      "Ensures the architectural surface contains only meaningful, intentional contracts.",
    severity: "major",
    category: "contracts",
    domain: [
      IntegrityDomain.INTERFACES,
      IntegrityDomain.CAPABILITIES,
    ],
    version: 1,
    autoFixable: true,
    mandatory: true,
  },
  {
    code: IntegrityLawCode.CONTRACT_ISOLATION,
    name: "Contract Isolation",
    description:
      "Architectural contracts must never expose implementation-specific details or leak implementation-owned types across subsystem boundaries.",
    rationale:
      "Preserves abstraction boundaries and prevents implementation leakage.",
    severity: "critical",
    category: "contracts",
    domain: [
      IntegrityDomain.INTERFACES,
      IntegrityDomain.RENDERER,
      IntegrityDomain.CAPABILITIES,
    ],
    version: 1,
    autoFixable: false,
    mandatory: true,
  },
] as const);

export function getIntegrityLaw(
  code: IntegrityLawCode
): IntegrityLaw | undefined {
  return INTEGRITY_LAWS.find((law) => law.code === code);
}

export function hasIntegrityLaw(code: IntegrityLawCode): boolean {
  return INTEGRITY_LAWS.some((law) => law.code === code);
}
