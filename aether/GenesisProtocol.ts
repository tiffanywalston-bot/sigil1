// aether/GenesisProtocol.ts
//
// Genesis Protocol
// Executes the constitutional startup sequence:
// Founder → Genesis Protocol → CapabilityBootstrap → CapabilityRegistry → FoundationAdapter → FoundationRuntime → FoundationRegistry → Aether (Initialized Engine)
//
// Genesis owns orchestration only. It does not implement subsystems.

import { CapabilityRegistry, CompositionRuntime } from "../foundation/FoundationTypes";
import { FoundationAdapter, FoundationAdapterBundle } from "../foundation/FoundationAdapter";
import { Aether, AetherFactory } from "./Aether";

// Use the existing CapabilityBootstrap implementation from the runtime folder.
import { CapabilityBootstrap } from "../runtime/CapabilityBootstrap";

// Use the existing CapabilityContext type from the same place CapabilityBootstrap does.
// This path must match the repository; it is not invented here.
import { CapabilityContext } from "../runtime/CapabilityBootstrap";

export class GenesisProtocol {
  /**
   * Execute the constitutional startup.
   *
   * Responsibilities:
   * 1. Verify Founder authority (performed by Founder before calling this method).
   * 2. Initialize CapabilityBootstrap.
   * 3. Acquire CapabilityRegistry.
   * 4. Initialize FoundationAdapter.
   * 5. Initialize FoundationRuntime (via FoundationAdapter).
   * 6. Verify successful initialization.
   * 7. Return a fully initialized Aether instance.
   *
   * CompositionRuntime is provided by the existing engine startup pathway
   * and passed into Genesis rather than constructed here.
   */
  static async execute(
    compositionRuntime: CompositionRuntime,
    context: CapabilityContext
  ): Promise<Aether> {
    // 2. Initialize CapabilityBootstrap using the existing implementation.
    const bootstrap = new CapabilityBootstrap();

    await bootstrap.initialize(context);
    await bootstrap.execute(context);

    // 3. Acquire CapabilityRegistry from the existing bootstrap instance.
    const capabilityRegistry: CapabilityRegistry = bootstrap.registry;

    // 4. Initialize FoundationAdapter using the existing constructor.
    const foundationAdapter = new FoundationAdapter({
      compositionRuntime,
      capabilityRegistry,
    });

    // 5. Initialize FoundationRuntime (via FoundationAdapter).
    const foundationBundle: FoundationAdapterBundle = foundationAdapter.initialize();

    // 6. Verify successful initialization.
    GenesisProtocol.verifyInitialization(
      capabilityRegistry,
      foundationBundle
    );

    // 7. Return a fully initialized Aether instance using AetherFactory.
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

    // Verification is intentionally minimal to avoid redesigning
    // existing subsystem behavior.
  }
}
