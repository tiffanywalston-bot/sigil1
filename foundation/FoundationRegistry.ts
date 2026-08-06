// foundation/FoundationRegistry.ts

import {
  CapabilityRegistry,
  FoundationLayer,
  FoundationLayerId,
} from "./FoundationTypes";

export class FoundationRegistry {
  private readonly capabilityRegistry: CapabilityRegistry | null;
  private readonly layers: Map<FoundationLayerId, FoundationLayer> = new Map();

  constructor(capabilityRegistry: CapabilityRegistry | null) {
    this.capabilityRegistry = capabilityRegistry;
  }

  registerLayer(layer: FoundationLayer): void {
    this.layers.set(layer.id, layer);
  }

  getLayer(id: FoundationLayerId): FoundationLayer | undefined {
    return this.layers.get(id);
  }

  registerCapabilities(): void {
    if (!this.capabilityRegistry) {
      return;
    }
    this.capabilityRegistry.registerCapability("foundation.layers", this.layers);
  }
}
