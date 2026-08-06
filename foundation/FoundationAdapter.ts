// foundation/FoundationAdapter.ts
//
// AETHER FOUNDATION ADAPTER — FINAL v1
// Thin integration layer connecting the Foundation subsystem
// to the existing repository architecture.

import {
  CompositionRuntime,
  CapabilityRegistry,
  WaveCapability,
  ExportCapability,
} from "./FoundationTypes";

import { FoundationRuntime } from "./FoundationRuntime";
import { FoundationRegistry } from "./FoundationRegistry";

import { AmbientFoundation } from "./AmbientFoundation";
import { HarmonicFoundation } from "./HarmonicFoundation";
import { RhythmicFoundation } from "./RhythmicFoundation";
import { DynamicSoundscape } from "./DynamicSoundscape";
import { ReflectiveGuidance } from "./ReflectiveGuidance";
import { PrimaryAttunement } from "./PrimaryAttunement";

export interface FoundationAdapterBundle {
  runtime: FoundationRuntime;
  registry: FoundationRegistry;
  ambient: AmbientFoundation;
  harmonic: HarmonicFoundation;
  rhythmic: RhythmicFoundation;
  soundscape: DynamicSoundscape;
  guidance: ReflectiveGuidance;
  attunement: PrimaryAttunement;
  waveCapability: WaveCapability | null;
  exportCapability: ExportCapability | null;
}

export class FoundationAdapter {
  private readonly compositionRuntime: CompositionRuntime;
  private readonly capabilityRegistry: CapabilityRegistry | null;

  // Idempotent initialization guards
  private initialized = false;
  private bundle: FoundationAdapterBundle | null = null;

  constructor(options: {
    compositionRuntime: CompositionRuntime;
    capabilityRegistry: CapabilityRegistry | null;
  }) {
    this.compositionRuntime = options.compositionRuntime;
    this.capabilityRegistry = options.capabilityRegistry;
  }

  initialize(): FoundationAdapterBundle {
    // Prevent duplicate initialization
    if (this.initialized && this.bundle) {
      return this.bundle;
    }

    // Acquire existing capabilities
    const waveCapability: WaveCapability | null =
      this.compositionRuntime.requestWaveCapability();

    const exportCapability: ExportCapability | null =
      this.compositionRuntime.requestExportCapability();

    // Create runtime + registry
    const runtime = new FoundationRuntime();
    const registry = new FoundationRegistry(this.capabilityRegistry);

    // Initialize layers
    const ambient = new AmbientFoundation(waveCapability);
    const harmonic = new HarmonicFoundation(waveCapability);
    const rhythmic = new RhythmicFoundation(waveCapability);
    const soundscape = new DynamicSoundscape(ambient, harmonic, rhythmic);
    const guidance = new ReflectiveGuidance();
    const attunement = new PrimaryAttunement();

    // Register layers with runtime
    runtime.registerLayer(ambient);
    runtime.registerLayer(harmonic);
    runtime.registerLayer(rhythmic);
    runtime.registerLayer(soundscape);
    runtime.registerLayer(guidance);
    runtime.registerLayer(attunement);

    // Register layers with capability registry
    registry.registerLayer(ambient);
    registry.registerLayer(harmonic);
    registry.registerLayer(rhythmic);
    registry.registerLayer(soundscape);
    registry.registerLayer(guidance);
    registry.registerLayer(attunement);
    registry.registerCapabilities();

    // Register subsystem with CompositionRuntime
    this.compositionRuntime.registerSubsystem("Foundation", runtime);

    // Export snapshots on attunement changes
    if (exportCapability) {
      runtime.onEvent(async (event) => {
        if (event.type === "primaryAttunementApplied") {
          const snapshot = runtime.getGlobalState();
          await exportCapability.exportSnapshot("FoundationSnapshot", snapshot);
        }
      });
    }

    // Build bundle
    this.bundle = {
      runtime,
      registry,
      ambient,
      harmonic,
      rhythmic,
      soundscape,
      guidance,
      attunement,
      waveCapability,
      exportCapability,
    };

    this.initialized = true;
    return this.bundle;
  }
}
