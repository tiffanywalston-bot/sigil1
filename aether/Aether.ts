// aether/Aether.ts
//
// Aether (Initialized Engine)
// Represents the fully initialized engine instance produced by the Genesis Protocol.
// This is a constitutional construct, not a replacement for existing subsystems.

import { CompositionRuntime, CapabilityRegistry } from "../foundation/FoundationTypes";
import { FoundationAdapter, FoundationAdapterBundle } from "../foundation/FoundationAdapter";

export interface Aether {
  readonly compositionRuntime: CompositionRuntime;
  readonly capabilityRegistry: CapabilityRegistry;
  readonly foundation: FoundationAdapterBundle;
}

/**
 * AetherFactory
 *
 * Simple helper to construct an Aether instance from existing runtime objects.
 * This does not own orchestration; GenesisProtocol is responsible for calling it.
 */
export class AetherFactory {
  static create(
    compositionRuntime: CompositionRuntime,
    capabilityRegistry: CapabilityRegistry,
    foundationBundle: FoundationAdapterBundle
  ): Aether {
    return {
      compositionRuntime,
      capabilityRegistry,
      foundation: foundationBundle,
    };
  }
}
