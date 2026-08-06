import type {
  CompositionRuntime as FoundationCompositionRuntimeInterface,
  WaveCapability as FoundationWaveCapability,
  ExportCapability as FoundationExportCapability,
  FoundationRuntimeInterface,
} from "../foundation/FoundationTypes";

export class CompositionRuntimeBridge implements FoundationCompositionRuntimeInterface {
  private readonly subsystems = new Map<string, FoundationRuntimeInterface>();

  registerSubsystem(name: string, runtime: FoundationRuntimeInterface): void {
    this.subsystems.set(name, runtime);
  }

  /** Read accessor — not part of the Foundation interface, provided for callers that need it. */
  getSubsystem(name: string): FoundationRuntimeInterface | undefined {
    return this.subsystems.get(name);
  }

  requestWaveCapability(): FoundationWaveCapability | null {
    // No repository code creates ambient/harmonic/rhythmic streams.
    // capabilities/output/WaveCapability.ts solves a different problem
    // (full-session composition). Returning null exercises the
    // repository's existing null-safe path in AmbientFoundation /
    // HarmonicFoundation / RhythmicFoundation rather than fabricating
    // stream behavior that doesn't exist.
    return null;
  }

  requestExportCapability(): FoundationExportCapability | null {
    // No repository code exports an arbitrary FoundationLayerState
    // snapshot. capabilities/output/ExportCapability.ts only encodes an
    // AudioBuffer to WAV. FoundationAdapter already null-guards this
    // capability, so null is the honest, existing path here too.
    return null;
  }
}
