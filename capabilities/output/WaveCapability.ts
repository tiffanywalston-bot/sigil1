// capabilities/output/WaveCapability.ts

import type { CapabilityDefinition } from "../CapabilityInterfaces";
import type {
  CapabilityContext,
  CapabilityError,
  CapabilityStatus,
} from "../CapabilityTypes";
import type { AudioBuffer as SigilAudioBuffer } from "../../AudioTypes";
import type { Session } from "../../SessionTypes";
import { CompositionRuntime } from "../../runtime/CompositionRuntime";

export class WaveCapability implements CapabilityDefinition {
  readonly metadata = {
    id: "output.wave",
    name: "Wave Output",
    category: "output",
    description: "Wave audio output capability.",
    version: "GMC-1.0.0",
    defaultEnabled: true,
  } as const;
  readonly enabled = true;
  readonly dependencies = ["audio.frequency"] as const;
  readonly status: CapabilityStatus = {
    id: this.metadata.id,
    version: this.metadata.version,
    category: this.metadata.category,
    enabled: this.enabled,
    dependencies: this.dependencies,
    registered: false,
    validated: false,
    initialized: false,
    executed: false,
    shutdown: false,
    lastError: null,
  };

  async initialize(_context: CapabilityContext): Promise<CapabilityError | null> {
    return null;
  }

  /**
   * Delegates composition to runtime/CompositionRuntime. No
   * frequency/harmonic/waveform logic is reimplemented here —
   * this method only adapts the runtime layer to the capability
   * lifecycle and converts thrown errors into CapabilityError.
   *
   * The capability lifecycle (CapabilityContext) carries only
   * engineId/sessionId and no Session object, so execute() has
   * nothing to compose and remains a no-op success — the same
   * pattern already established in ExportCapability.execute().
   * Callers holding a real Session should use composeBuffer()
   * below.
   */
  async execute(_context: CapabilityContext): Promise<CapabilityError | null> {
    return null;
  }

  /**
   * Composes a session's audio via CompositionRuntime and
   * returns the resulting AudioBuffer, or a CapabilityError on
   * failure. Does not export or encode — the returned buffer is
   * exactly what ExportCapability.exportBuffer() accepts, kept
   * as a separate step so this capability's own responsibility
   * (composition) stays independent of export, matching the
   * target chain: Session -> WaveCapability -> CompositionRuntime
   * -> [buffer] -> ExportCapability -> WAV.
   */
  async composeBuffer(
    session: Session
  ): Promise<SigilAudioBuffer | CapabilityError> {
    try {
      return CompositionRuntime.compose(session).buffer;
    } catch (error) {
      return {
        severity: "error",
        code: "output.wave.failed",
        message: error instanceof Error ? error.message : String(error),
        timestamp: new Date().toISOString(),
      };
    }
  }

  async shutdown(_context: CapabilityContext): Promise<CapabilityError | null> {
    return null;
  }

  async validate(_context: CapabilityContext): Promise<CapabilityError | null> {
    return null;
  }
}
