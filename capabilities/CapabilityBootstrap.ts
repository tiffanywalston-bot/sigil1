// runtime/CapabilityBootstrap.ts

/**
 * runtime/CapabilityBootstrap.ts
 *
 * Minimal registration layer connecting the existing
 * capability architecture to a running CapabilityRegistry.
 *
 * This file does not redesign CapabilityRegistry, does not
 * change dependency behavior, and does not implement any
 * capability. It only imports the 19 existing capability
 * classes and calls registry.register() on each, in the
 * order verified against the registration table (matching
 * CapabilityRegistry.initializeAll()'s actual iteration
 * order: CORE, SESSION, VISUALIZATION, AUDIO, OUTPUT, FUTURE
 * — not CapabilityConstants.ts's declared file order, which
 * groups AUDIO before SESSION).
 *
 * register() order is functionally irrelevant to
 * CapabilityRegistry itself (capabilities are stored in a Map
 * keyed by id, and initializeAll() looks them up by id in its
 * own fixed sequence regardless of registration order). This
 * file registers in the registry's real init sequence anyway,
 * for readability and to keep this file's order and the
 * registry's behavior visibly aligned.
 *
 * engine.js is not touched by or referenced from this file.
 * It is plain JS with no build step; this file is TypeScript
 * and cannot be imported by engine.js until that gap is
 * resolved (documented previously, unchanged here).
 */

import type { CapabilityContext, CapabilityError } from "../capabilities/CapabilityTypes";
import { CapabilityRegistry } from "../capabilities/CapabilityRegistry";

import { IdentityCapability } from "../capabilities/core/IdentityCapability";
import { MemoryCapability } from "../capabilities/core/MemoryCapability";
import { ValidationCapability } from "../capabilities/core/ValidationCapability";

import { MeditationCapability } from "../capabilities/session/MeditationCapability";
import { RitualCapability } from "../capabilities/session/RitualCapability";
import { OracleCapability } from "../capabilities/session/OracleCapability";
import { ReflectionCapability } from "../capabilities/session/ReflectionCapability";

import { GeometryCapability } from "../capabilities/visualization/GeometryCapability";
import { HarmonicCapability } from "../capabilities/visualization/HarmonicCapability";
import { CloudCapability } from "../capabilities/visualization/CloudCapability";
import { RingCapability } from "../capabilities/visualization/RingCapability";
import { StarCapability } from "../capabilities/visualization/StarCapability";

import { FrequencyCapability } from "../capabilities/core/FrequencyCapability";
import { BinauralCapability } from "../capabilities/audio/BinauralCapability";
import { SubliminalCapability } from "../capabilities/audio/SubliminalCapability";

import { WaveCapability } from "../capabilities/output/WaveCapability";
import { ImageCapability } from "../capabilities/output/ImageCapability";
import { ExportCapability } from "../capabilities/output/ExportCapability";

import { ReservedCapability } from "../capabilities/future/ReservedCapability";

export class CapabilityBootstrap {

    readonly registry: CapabilityRegistry;

    constructor() {

        this.registry = new CapabilityRegistry();
        this.registerAll();

    }

    /**
     * Registers all 19 existing capability implementations, in
     * the verified registration table's order: CORE, SESSION,
     * VISUALIZATION, AUDIO, OUTPUT, FUTURE. No capability logic
     * lives here — only construction and registry.register()
     * calls.
     */
    private registerAll(): void {

        /* ---------- CORE ---------- */
        this.registry.register(new IdentityCapability());
        this.registry.register(new MemoryCapability());
        this.registry.register(new ValidationCapability());

        /* ---------- SESSION ---------- */
        this.registry.register(new MeditationCapability());
        this.registry.register(new RitualCapability());
        this.registry.register(new OracleCapability());
        this.registry.register(new ReflectionCapability());

        /* ---------- VISUALIZATION ---------- */
        this.registry.register(new GeometryCapability());
        this.registry.register(new HarmonicCapability());
        this.registry.register(new CloudCapability());
        this.registry.register(new RingCapability());
        this.registry.register(new StarCapability());

        /* ---------- AUDIO ---------- */
        this.registry.register(new FrequencyCapability());
        this.registry.register(new BinauralCapability());
        this.registry.register(new SubliminalCapability());

        /* ---------- OUTPUT ---------- */
        this.registry.register(new WaveCapability());
        this.registry.register(new ImageCapability());
        this.registry.register(new ExportCapability());

        /* ---------- FUTURE ---------- */
        this.registry.register(new ReservedCapability());

    }

    async initialize(context: CapabilityContext): Promise<CapabilityError[]> {

        return this.registry.initializeAll(context);

    }

    async execute(context: CapabilityContext): Promise<CapabilityError[]> {

        return this.registry.executeAll(context);

    }

    async shutdown(context: CapabilityContext): Promise<CapabilityError[]> {

        return this.registry.shutdownAll(context);

    }

}
