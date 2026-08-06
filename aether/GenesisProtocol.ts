// aether/GenesisProtocol.ts
//
// Genesis Protocol
// Executes the constitutional startup sequence:
// Founder → GenesisProtocol → CapabilityBootstrap → CapabilityRegistry → FoundationAdapter → FoundationRuntime → FoundationRegistry → Aether (Initialized Engine)
//
// Genesis owns orchestration only. It does not implement subsystems.

import { CapabilityRegistry, CompositionRuntime } from "../foundation/FoundationTypes";
import { FoundationAdapter, FoundationAdapterBundle } from "../foundation/FoundationAdapter";
import { Aether, AetherFactory } from "./Aether";

import type { FounderIdentityRecord } from "./FounderIdentity";

// Correct repository path for CapabilityBootstrap
import { CapabilityBootstrap } from "../runtime/CapabilityBootstrap";

// bootstrap.registry (capabilities/CapabilityRegistry.ts) does not
// structurally satisfy foundation/FoundationTypes.CapabilityRegistry
// (registerCapability(name, capability)) — the two share a name but not
// a shape. This bridge wraps the real registry without modifying or
// duplicating it. See foundation/CapabilityRegistryBridge.ts for why.
import { CapabilityRegistryBridge } from "../foundation/CapabilityRegistryBridge";

// Correct repository path for CapabilityContext
// CapabilityBootstrap.ts imports CapabilityContext from capabilities/CapabilityTypes.ts
import type { CapabilityContext } from "../capabilities/CapabilityTypes";

export class GenesisProtocol {
  static async execute(
    founderIdentity: FounderIdentityRecord,
    compositionRuntime: CompositionRuntime,
    context: CapabilityContext
  ): Promise<Aether> {
    // Use existing bootstrap implementation exactly as written in the ZIP
    const bootstrap = new CapabilityBootstrap();

    await bootstrap.initialize(context);
    await bootstrap.execute(context);

    // Use the existing registry produced by CapabilityBootstrap, bridged
    // to the shape FoundationAdapter expects (the real registry itself
    // is not modified or duplicated — see CapabilityRegistryBridge).
    const capabilityRegistry: CapabilityRegistry = new CapabilityRegistryBridge(
      bootstrap.registry
    );

    // Use the existing FoundationAdapter constructor
    const foundationAdapter = new FoundationAdapter({
      compositionRuntime,
      capabilityRegistry,
    });

    // Use the existing FoundationAdapter initialization sequence
    const foundationBundle: FoundationAdapterBundle = foundationAdapter.initialize();

    // Minimal constitutional verification
    GenesisProtocol.verifyInitialization(
      capabilityRegistry,
      foundationBundle
    );

    // Return the initialized Aether instance
    return AetherFactory.create(
      founderIdentity,
      compositionRuntime,
      capabilityRegistry,
      foundationBundle
    );
  }

  private static verifyInitialization(
    capabilityRegistry: CapabilityRegistry,
    foundationBundle: FoundationAdapterBundle
  ): void {
    if (!capabilityRegistry) {
      throw new Error("GenesisProtocol: CapabilityRegistry is not initialized.");
    }

    if (!foundationBundle.runtime) {
      throw new Error("GenesisProtocol: FoundationRuntime is not initialized.");
    }

    if (!foundationBundle.registry) {
      throw new Error("GenesisProtocol: FoundationRegistry is not initialized.");
    }
  }
}
