// aether/Founder.ts
//
// Founder
// Authoritative singleton that owns engine lifecycle and authorizes
// startup/shutdown.
//
// Founder owns constitutional authority verification.
// Founder does NOT define constitutional identity.
// FounderIdentity is the constitutional source of authority.

import { GenesisProtocol } from "./GenesisProtocol";
import { Aether } from "./Aether";
import { FounderIdentity } from "./FounderIdentity";

import type { CompositionRuntime } from "../foundation/FoundationTypes";
import type { CapabilityContext } from "../capabilities/CapabilityTypes";

export class Founder {
  private static instance: Founder | null = null;

  private aether: Aether | null = null;
  private started = false;

  private constructor() {
    // Private to enforce singleton.
  }

  static getInstance(): Founder {
    if (!Founder.instance) {
      Founder.instance = new Founder();
    }

    return Founder.instance;
  }

  /**
   * Constitutional identity for this Founder.
   */
  getIdentity() {
    return FounderIdentity;
  }

  /**
   * Authorize engine startup.
   *
   * Founder verifies constitutional authority before delegating
   * orchestration to GenesisProtocol.
   */
  async startEngine(
    compositionRuntime: CompositionRuntime,
    context: CapabilityContext
  ): Promise<Aether> {
    if (this.started && this.aether) {
      return this.aether;
    }

    this.verifyAuthority();

    this.aether = await GenesisProtocol.execute(
      FounderIdentity,
      compositionRuntime,
      context
    );

    this.started = true;

    return this.aether;
  }

  /**
   * Constitutional shutdown authorization.
   */
  shutdownEngine(): void {
    this.verifyAuthority();
    this.started = false;
  }

  /**
   * Verify the constitutional Founder identity.
   *
   * Founder does not own identity.
   * FounderIdentity is the constitutional authority record.
   */
  private verifyAuthority(): void {
    if (!FounderIdentity) {
      throw new Error(
        "FounderIdentity is unavailable."
      );
    }

    if (
      FounderIdentity.signature !==
      "FOUNDER::TIFFANY_ALEXIS_WALSTON"
    ) {
      throw new Error(
        "Founder constitutional signature verification failed."
      );
    }

    if (
      FounderIdentity.constitutionalFounder !==
      "Tiffany Alexis Walston"
    ) {
      throw new Error(
        "Founder constitutional identity verification failed."
      );
    }

    if (
      !FounderIdentity.authorityScope.includes(
        "AUTHORIZE_GENESIS"
      )
    ) {
      throw new Error(
        "Founder is not authorized to invoke Genesis."
      );
    }
  }

  /**
   * Returns the initialized Aether instance.
   */
  getAether(): Aether | null {
    return this.aether;
  }
}
