// capabilities/CapabilityValidator.ts

import type { CapabilityDefinition } from "./CapabilityInterfaces";
import type { CapabilityContext, CapabilityError } from "./CapabilityTypes";

export class CapabilityValidator {
  async validateDefinition(
    capability: CapabilityDefinition,
    context: CapabilityContext
  ): Promise<CapabilityError | null> {
    if (!capability.metadata.id) {
      return this.error("error", "CAP_META_ID_MISSING", "Capability id is missing.");
    }
    if (!capability.metadata.name) {
      return this.error("error", "CAP_META_NAME_MISSING", "Capability name is missing.");
    }
    if (!Array.isArray(capability.dependencies)) {
      return this.error("error", "CAP_DEP_INVALID", "Capability dependencies must be an array.");
    }
    return capability.validate(context);
  }

  private error(
    severity: "info" | "warning" | "error",
    code: string,
    message: string
  ): CapabilityError {
    return {
      severity,
      code,
      message,
      timestamp: new Date().toISOString(),
    };
  }
}
