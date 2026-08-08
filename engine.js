/**
 * ============================================================
 * SIGIL1 Engine
 * Diagnostic Startup Build
 * ============================================================
 */

import { Renderer } from "./renderer.js";
import { Animation } from "./animation.js";

import { Founder } from "./aether/Founder";
import { CompositionRuntimeBridge } from "./runtime/CompositionRuntimeBridge";
import { SubliminalPanel } from "./ui/SubliminalPanel";

export class Engine {

    constructor() {

        console.log("[STARTUP 00] Engine constructor");

        this.canvas = document.getElementById("sigil1");

        if (!this.canvas) {
            throw new Error("Canvas with id 'sigil1' not found.");
        }

        console.log("[STARTUP 01] Canvas found");

        this.renderer = new Renderer(this.canvas);

        console.log("[STARTUP 02] Renderer created");

        this.animation = new Animation();

        console.log("[STARTUP 03] Animation created");

        this.running = false;
        this.lastTime = 0;

        this.aether = null;
        this.session = null;

        console.log("[STARTUP 04] Engine constructor complete");
    }

    setSession(session) {
        this.session = session;
    }

    async start() {

        if (this.running) {
            console.log("[STARTUP] Engine already running");
            return;
        }

        console.log("[STARTUP 05] Engine.start entered");

        const compositionRuntime = new CompositionRuntimeBridge();

        console.log("[STARTUP 06] CompositionRuntimeBridge created");

        const context = {
            engineId: "sigil1"
        };

        console.log("[STARTUP 07] Startup context created");

        console.log("[STARTUP 08] BEFORE Founder.startEngine");

        try {

            this.aether =
                await Founder
                    .getInstance()
                    .startEngine(
                        compositionRuntime,
                        context
                    );

        } catch (error) {

            console.error(
                "[STARTUP ERROR] Founder.startEngine failed",
                error
            );

            throw error;
        }

        console.log("[STARTUP 09] AFTER Founder.startEngine");

        try {

            console.log("[STARTUP 10] BEFORE SubliminalPanel.attach");

            SubliminalPanel.attach(() => this.session);

            console.log("[STARTUP 11] AFTER SubliminalPanel.attach");

        } catch (error) {

            console.warn(
                "[STARTUP WARNING] SubliminalPanel failed",
                error
            );

        }

        this.running = true;

        console.log("[STARTUP 12] Engine marked running");

        requestAnimationFrame(this.loop.bind(this));

        console.log("[STARTUP 13] requestAnimationFrame scheduled");
    }

    stop() {

        console.log("[STARTUP] Engine.stop");

        this.running = false;
    }

    shutdown() {

        console.log("[STARTUP] Engine.shutdown");

        this.stop();

        Founder
            .getInstance()
            .shutdownEngine();

        if (
            this.renderer &&
            typeof this.renderer.dispose === "function"
        ) {
            this.renderer.dispose();
        }
    }

    loop(time) {

        if (!this.running) {
            return;
        }

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