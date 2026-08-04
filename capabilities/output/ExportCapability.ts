// capabilities/output/ExportCapability.ts

import type { CapabilityDefinition } from "../CapabilityInterfaces";
import type {
  CapabilityContext,
  CapabilityError,
  CapabilityStatus,
} from "../CapabilityTypes";
import type { AudioBuffer as SigilAudioBuffer, AudioExport } from "../../AudioTypes";
import { AudioExporter } from "../../runtime/AudioExporter";

export class ExportCapability implements CapabilityDefinition {
  readonly metadata = {
    id: "output.export",
    name: "Session Export",
    category: "output",
    description: "Session export capability.",
    version: "GMC-1.0.0",
    defaultEnabled: true,
  };
  readonly enabled = true;
  readonly dependencies = [] as const;
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
   * Delegates WAV export to runtime/AudioExporter. Encoding and
   * sample generation are not reimplemented here — this method
   * only adapts the runtime layer to the capability lifecycle and
   * converts thrown errors into CapabilityError.
   *
   * The capability lifecycle (CapabilityContext) carries only
   * engineId/sessionId and no audio payload, so execute() has no
   * buffer to act on and remains a no-op success. Callers holding
   * an AudioBuffer should use exportBuffer() below.
   */
  async execute(_context: CapabilityContext): Promise<CapabilityError | null> {
    return null;
  }

  /**
   * Exports an AudioBuffer as a playable .wav via
   * runtime/AudioExporter. Returns the AudioExport manifest on
   * success, or a CapabilityError on failure.
   *
   * Defaults to the environment-independent path
   * (AudioExporter.buildExport), which encodes the WAV without
   * touching any browser API and therefore works in any context.
   * Pass download: true to additionally trigger a browser
   * download via AudioExporter.downloadWav — that path requires
   * Blob, URL, and document, and returns a CapabilityError rather
   * than throwing if they are unavailable.
   */
  async exportBuffer(
    buffer: SigilAudioBuffer,
    filename?: string,
    download: boolean = false
  ): Promise<AudioExport | CapabilityError> {
    try {
      if (download) {
        return AudioExporter.downloadWav(buffer, filename);
      }

      return AudioExporter.buildExport(buffer, filename).manifest;
    } catch (error) {
      return {
        severity: "error",
        code: "output.export.failed",
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
