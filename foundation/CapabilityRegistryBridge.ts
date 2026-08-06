// FILE: foundation/CapabilityRegistryBridge.ts  (NEW)
//
// Bridges the real capabilities/CapabilityRegistry.ts to the
// foundation/FoundationTypes.CapabilityRegistry interface.
//
// The real CapabilityRegistry stores CapabilityDefinition objects
// keyed by CapabilityId and drives their initialize/execute/shutdown
// lifecycle (see capabilities/CapabilityRegistry.ts: register(),
// getCapability(), getAllCapabilities(), getEnabledCapabilities(),
// getStatus(), initializeAll(), executeAll(), shutdownAll()).
//
// foundation/FoundationTypes.CapabilityRegistry wants something
// different: registerCapability(name: string, capability: unknown).
// The one caller of that method — FoundationRegistry.registerCapabilities()
// — passes ("foundation.layers", a Map<FoundationLayerId, FoundationLayer>).
// That Map has no .metadata, .initialize, .execute, .shutdown, or
// .validate members, so handing it to the real registry's register()
// would throw (register() reads capability.metadata.id). There is no
// legitimate mapping between the two contracts — only a name collision.
//
// This bridge does NOT forward into the real registry and does NOT
// modify it. It holds Foundation's named blob in its own map, and
// separately exposes the one real registry it wraps for anything that
// needs it. No second CapabilityRegistry is created.

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
