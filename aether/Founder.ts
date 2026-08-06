// aether/Founder.ts
//
// Founder
// Authoritative singleton that owns engine lifecycle and authorizes startup/shutdown.
// Founder does NOT initialize subsystems directly and does NOT contain business logic.
// It issues authority and invokes the Genesis Protocol.

import { GenesisProtocol } from "./GenesisProtocol";
import { Aether } from "./Aether";

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
   * Authorize engine startup and invoke Genesis Protocol.
   * Returns the fully initialized Aether instance.
   *
   * Founder does not construct CompositionRuntime or CapabilityContext.
   * They must be provided by the engine startup pathway.
   */
  async startEngine(
    compositionRuntime: CompositionRuntime,
    context: CapabilityContext
  ): Promise<Aether> {
    if (this.started && this.aether) {
      return this.aether;
    }

    // Founder authorizes startup.
    this.verifyAuthority();

    // Invoke Genesis Protocol with the correct signature.
    this.aether = await GenesisProtocol.execute(compositionRuntime, context);
    this.started = true;

    return this.aether;
  }

  /**
   * Authorize engine shutdown.
   * This does not dismantle subsystems; it only marks lifecycle state.
   */
  shutdownEngine(): void {
    this.verifyAuthority();
    this.started = false;
  }

  /**
   * Authority verification.
   * In this constitutional skeleton, authority is implicit.
   * This method exists to preserve the architectural contract.
   */
  private verifyAuthority(): void {
    // No-op in this skeleton; real authority checks would be additive.
  }

  /**
   * Accessor for the initialized Aether instance.
   * Returns null if the engine has not been started.
   */
  getAether(): Aether | null {
    return this.aether;
  }
}
```**aether/Founder.ts**

```ts
// aether/Founder.ts
//
// Founder
// Authoritative singleton that owns engine lifecycle and authorizes startup/shutdown.
// Founder does NOT initialize subsystems directly and does NOT contain business logic.
// It issues authority and invokes the Genesis Protocol.

import { GenesisProtocol } from "./GenesisProtocol";
import { Aether } from "./Aether";

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
   * Authorize engine startup and invoke Genesis Protocol.
   * Returns the fully initialized Aether instance.
   *
   * Founder does not construct CompositionRuntime or CapabilityContext.
   * They must be provided by the engine startup pathway.
   */
  async startEngine(
    compositionRuntime: CompositionRuntime,
    context: CapabilityContext
  ): Promise<Aether> {
    if (this.started && this.aether) {
      return this.aether;
    }

    // Founder authorizes startup.
    this.verifyAuthority();

    // Invoke Genesis Protocol with the correct signature.
    this.aether = await GenesisProtocol.execute(compositionRuntime, context);
    this.started = true;

    return this.aether;
  }

  /**
   * Authorize engine shutdown.
   * This does not dismantle subsystems; it only marks lifecycle state.
   */
  shutdownEngine(): void {
    this.verifyAuthority();
    this.started = false;
  }

  /**
   * Authority verification.
   * In this constitutional skeleton, authority is implicit.
   * This method exists to preserve the architectural contract.
   */
  private verifyAuthority(): void {
    // No-op in this skeleton; real authority checks would be additive.
  }

  /**
   * Accessor for the initialized Aether instance.
   * Returns null if the engine has not been started.
   */
  getAether(): Aether | null {
    return this.aether;
  }
}
