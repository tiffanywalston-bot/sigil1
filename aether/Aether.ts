// aether/Aether.ts
//
// Aether (Initialized Engine)
//
// Represents the fully initialized engine instance produced by the
// Genesis Protocol.
//
// Aether does not perform startup orchestration or authority
// verification. It represents the verified, initialized engine and
// retains the constitutional Founder identity that authorized startup.

import {
  CompositionRuntime,
  CapabilityRegistry,
} from "../foundation/FoundationTypes";

import {
  FoundationAdapterBundle,
} from "../foundation/FoundationAdapter";

import type {
  FounderIdentityRecord,
} from "./FounderIdentity";

export interface Aether {
  /**
   * Verified constitutional Founder identity that authorized startup.
   */
  readonly founderIdentity: FounderIdentityRecord;

  /**
   * Composition runtime used by the engine.
   */
  readonly compositionRuntime: CompositionRuntime;

  /**
   * Active capability registry.
   */
  readonly capabilityRegistry: CapabilityRegistry;

  /**
   * Initialized Foundation bundle.
   */
  readonly foundation: FoundationAdapterBundle;
}

/**
 * AetherFactory
 *
 * Constructs the initialized Aether instance.
 * Startup orchestration remains the responsibility of GenesisProtocol.
 */
export class AetherFactory {
  static create(
    founderIdentity: FounderIdentityRecord,
    compositionRuntime: CompositionRuntime,
    capabilityRegistry: CapabilityRegistry,
    foundationBundle: FoundationAdapterBundle
  ): Aether {
    return Object.freeze({
      founderIdentity,
      compositionRuntime,
      capabilityRegistry,
      foundation: foundationBundle,
    });
  }
}