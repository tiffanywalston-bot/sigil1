// capabilities/CapabilityInterfaces.ts

import type {
  CapabilityCategory,
  CapabilityId,
  CapabilityDependency,
  CapabilityContext,
  CapabilityError,
  CapabilityStatus,
} from "./CapabilityTypes";

export interface CapabilityMetadata {
  id: CapabilityId;
  name: string;
  category: CapabilityCategory;
  description: string;
  version: string;
  author?: string;
  icon?: string;
  featureFlags?: readonly string[];
  defaultEnabled: boolean;
}

export interface CapabilityLifecycle {
  initialize(context: CapabilityContext): Promise<CapabilityError | null>;
  execute(context: CapabilityContext): Promise<CapabilityError | null>;
  shutdown(context: CapabilityContext): Promise<CapabilityError | null>;
  validate(context: CapabilityContext): Promise<CapabilityError | null>;
}

export interface CapabilityDefinition extends CapabilityLifecycle {
  readonly metadata: CapabilityMetadata;
  readonly enabled: boolean;
  readonly dependencies: readonly CapabilityDependency[];
  readonly status: CapabilityStatus;
}
