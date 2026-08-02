// capabilities/CapabilityRegistry.ts

import type { CapabilityDefinition } from "./CapabilityInterfaces";
import type {
  CapabilityId,
  CapabilityContext,
  CapabilityError,
  CapabilityStatus,
} from "./CapabilityTypes";
import { CAPABILITY_METADATA, getCapabilityMetadata } from "./CapabilityMetadata";
import { CapabilityValidator } from "./CapabilityValidator";
import {
  CORE_CAPABILITIES,
  AUDIO_CAPABILITIES,
  VISUALIZATION_CAPABILITIES,
  SESSION_CAPABILITIES,
  OUTPUT_CAPABILITIES,
  FUTURE_CAPABILITIES,
} from "./CapabilityConstants";

export class CapabilityRegistry {
  private readonly capabilities = new Map<CapabilityId, CapabilityDefinition>();
  private readonly validator = new CapabilityValidator();

  register(capability: CapabilityDefinition): void {
    const id = capability.metadata.id;
    if (this.capabilities.has(id)) {
      return;
    }
    this.capabilities.set(id, capability);
    this.updateStatus(id, (status) => ({
      ...status,
      registered: true,
    }));
  }

  getCapability(id: CapabilityId): CapabilityDefinition | undefined {
    return this.capabilities.get(id);
  }

  getAllCapabilities(): CapabilityDefinition[] {
    return Array.from(this.capabilities.values());
  }

  getEnabledCapabilities(): CapabilityDefinition[] {
    return Array.from(this.capabilities.values()).filter((c) => c.enabled);
  }

  getStatus(id: CapabilityId): CapabilityStatus | undefined {
    const cap = this.capabilities.get(id);
    return cap?.status;
  }

  async initializeAll(context: CapabilityContext): Promise<CapabilityError[]> {
    const errors: CapabilityError[] = [];
    const orderedIds: CapabilityId[] = [
      ...CORE_CAPABILITIES,
      ...SESSION_CAPABILITIES,
      ...VISUALIZATION_CAPABILITIES,
      ...AUDIO_CAPABILITIES,
      ...OUTPUT_CAPABILITIES,
      ...FUTURE_CAPABILITIES,
    ];

    for (const id of orderedIds) {
      const capability = this.capabilities.get(id);
      if (!capability) continue;

      const meta = getCapabilityMetadata(id);
      if (!meta || !meta.defaultEnabled) continue;

      const validationError = await this.validator.validateDefinition(
        capability,
        context
      );
      if (validationError) {
        errors.push(validationError);
        this.updateStatus(id, (status) => ({
          ...status,
          validated: false,
          lastError: validationError,
        }));
        continue;
      }

      this.updateStatus(id, (status) => ({
        ...status,
        validated: true,
      }));

      const initError = await capability.initialize(context);
      if (initError) {
        errors.push(initError);
        this.updateStatus(id, (status) => ({
          ...status,
          initialized: false,
          lastError: initError,
        }));
        continue;
      }

      this.updateStatus(id, (status) => ({
        ...status,
        initialized: true,
      }));
    }

    return errors;
  }

  async executeAll(context: CapabilityContext): Promise<CapabilityError[]> {
    const errors: CapabilityError[] = [];
    for (const capability of this.getEnabledCapabilities()) {
      const execError = await capability.execute(context);
      if (execError) {
        errors.push(execError);
        this.updateStatus(capability.metadata.id, (status) => ({
          ...status,
          executed: false,
          lastError: execError,
        }));
      } else {
        this.updateStatus(capability.metadata.id, (status) => ({
          ...status,
          executed: true,
        }));
      }
    }
    return errors;
  }

  async shutdownAll(context: CapabilityContext): Promise<CapabilityError[]> {
    const errors: CapabilityError[] = [];
    for (const capability of this.getEnabledCapabilities()) {
      const shutError = await capability.shutdown(context);
      if (shutError) {
        errors.push(shutError);
        this.updateStatus(capability.metadata.id, (status) => ({
          ...status,
          shutdown: false,
          lastError: shutError,
        }));
      } else {
        this.updateStatus(capability.metadata.id, (status) => ({
          ...status,
          shutdown: true,
        }));
      }
    }
    return errors;
  }

  private updateStatus(
    id: CapabilityId,
    updater: (status: CapabilityStatus) => CapabilityStatus
  ): void {
    const capability = this.capabilities.get(id);
    if (!capability) return;
    const current = capability.status;
    const next = updater(current);
    (capability as any).status = next;
  }
}
