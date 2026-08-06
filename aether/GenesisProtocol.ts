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

// Correct repository path for CapabilityBootstrap
import { CapabilityBootstrap } from "../runtime/CapabilityBootstrap";

// Correct repository path for CapabilityContext
// CapabilityBootstrap.ts imports CapabilityContext from capabilities/CapabilityTypes.ts
import type { CapabilityContext } from "../capabilities/CapabilityTypes";

export class GenesisProtocol {
  static async execute(
    compositionRuntime: CompositionRuntime,
    context: CapabilityContext
  ): Promise<Aether> {
    // Use existing bootstrap implementation exactly as written in the ZIP
    const bootstrap = new CapabilityBootstrap();

    await bootstrap.initialize(context);
    await bootstrap.execute(context);

    // Use the existing registry produced by CapabilityBootstrap
    const capabilityRegistry: CapabilityRegistry = bootstrap.registry;

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
