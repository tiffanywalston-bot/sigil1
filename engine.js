/**
 * ============================================================
 * SIGIL1 Engine
 * Version 2.0
 * ============================================================
 *
 * Scope note (repository-verified):
 * This file orchestrates only the subsystems that currently
 * exist as runnable browser JS in this repository:
 *   - Animation  (./animation.js)
 *   - Renderer   (./renderer.js)
 *
 * The following repository subsystems exist ONLY as .ts files
 * with no build/compile step present anywhere in the repo
 * (no package.json, tsconfig, or bundler config), and are
 * therefore NOT importable by this browser-native engine.js
 * as the repository currently stands. They are intentionally
 * NOT wired in below, to avoid fabricating non-existent
 * runtime imports:
 *   - capabilities/ (CapabilityRegistry, CapabilityIndex, etc.)
 *   - validation/
 *   - models/
 *   - interfaces/ (EngineInterfaces, RendererInterfaces, etc. —
 *     these are type-only and produce no runtime values even
 *     if compiled)
 *   - UniverseTypes / UniverseConstants (Universe subsystem)
 *   - SessionTypes (Session subsystem)
 *
 * Until one of those is resolved (a build step is added, or
 * these are ported to plain JS), Engine cannot legitimately
 * call initializeCapabilities(), initializeSessions(),
 * initializeIdentity(), initializeUniverse(), or
 * initializeValidation() — there is nothing real to call.
 * ============================================================
 */

import { Renderer } from "./renderer.js";
import { Animation } from "./animation.js";

export class Engine {

    constructor() {

        this.canvas = document.getElementById("sigil1");

        if (!this.canvas) {
            throw new Error("Canvas with id 'sigil1' not found.");
        }

        this.renderer = new Renderer(this.canvas);

        this.animation = new Animation();

        this.running = false;

        this.lastTime = 0;

    }

    start() {

        if (this.running) return;

        this.running = true;

        requestAnimationFrame(this.loop.bind(this));

    }

    stop() {

        this.running = false;

    }

    /**
     * Shutdown coordination.
     * Stops the run loop. No capability/session/identity/
     * universe shutdown is invoked here, since none of those
     * subsystems have a runnable (non-TypeScript) form in this
     * repository yet — see scope note above.
     */
    shutdown() {

        this.stop();

    }

    loop(time) {

        if (!this.running) return;

        const delta = time - this.lastTime;

        this.lastTime = time;

        this.update(delta);

        this.renderer.render(this.animation);

        requestAnimationFrame(this.loop.bind(this));

    }

    update(delta) {

        this.animation.update(delta);

    }

}
