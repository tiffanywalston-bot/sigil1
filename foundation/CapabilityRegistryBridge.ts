import type { CapabilityRegistry as FoundationCapabilityRegistryInterface } from "./FoundationTypes";
import type { CapabilityRegistry as RealCapabilityRegistry } from "../capabilities/CapabilityRegistry";

export class CapabilityRegistryBridge implements FoundationCapabilityRegistryInterface {
  private readonly real: RealCapabilityRegistry;
  private readonly foundationBlobs = new Map<string, unknown>();

  constructor(real: RealCapabilityRegistry) {
    this.real = real;
  }

  /**
   * Satisfies foundation/FoundationTypes.CapabilityRegistry.
   * Stores the named blob locally. Does not touch the real registry,
   * whose register() requires a CapabilityDefinition shape this blob
   * does not have.
   */
  registerCapability(name: string, capability: unknown): void {
    this.foundationBlobs.set(name, capability);
  }

  /** Read accessor for whatever Foundation has registered under `name`. */
  getFoundationBlob(name: string): unknown {
    return this.foundationBlobs.get(name);
  }

  /** Access to the single real CapabilityRegistry this bridge wraps. */
  getRealRegistry(): RealCapabilityRegistry {
    return this.real;
  }
}
