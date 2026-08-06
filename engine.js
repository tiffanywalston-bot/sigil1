// FILE: engine.js
/**
 * ============================================================
 * SIGIL1 Engine
 * Version 2.0
 * ============================================================
 */

import { Renderer } from "./renderer.js";
import { Animation } from "./animation.js";

// Constitutional startup path. Founder is a singleton and does not
// construct CompositionRuntime or CapabilityContext itself (see
// aether/Founder.ts) — the engine startup pathway is responsible for
// supplying both. CompositionRuntimeBridge is not a second runtime: it
// wraps the single real runtime/CompositionRuntime.ts to satisfy
// foundation/FoundationTypes.CompositionRuntime (see
// runtime/CompositionRuntimeBridge.ts for why a bridge, not a rewrite,
// was required).
//
// Resolution of these TypeScript specifiers is handled by Vite
// (see package.json / vite.config.js / tsconfig.json). tsconfig sets
// allowJs so this .js file and the .ts constitutional layer share one
// module graph, and moduleResolution "bundler" so the repository's
// existing extensionless imports work unchanged.
import { Founder } from "./aether/Founder";
import { CompositionRuntimeBridge } from "./runtime/CompositionRuntimeBridge";

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

        // Set once the constitutional startup pathway has produced an
        // Aether instance. Null until start() completes Founder's
        // startup sequence.
        this.aether = null;

    }

    async start() {

        if (this.running) return;

        // Founder → GenesisProtocol → CapabilityBootstrap →
        // CapabilityRegistry → FoundationAdapter → FoundationRuntime →
        // FoundationRegistry → Aether. Founder.getInstance() is a
        // singleton, so a repeated call to start() returns the same
        // Aether rather than re-running startup — this does not
        // duplicate engine startup or create a second runtime.
        const compositionRuntime = new CompositionRuntimeBridge();
        const context = { engineId: "sigil1" };

        this.aether = await Founder.getInstance().startEngine(compositionRuntime, context);

        this.running = true;

        requestAnimationFrame(this.loop.bind(this));

    }

    stop() {

        this.running = false;

    }

    shutdown() {
        this.stop();
        // Mirrors start()'s use of Founder: authorizes constitutional
        // shutdown before tearing down the renderer. Founder.shutdownEngine()
        // only marks lifecycle state (see aether/Founder.ts) — it does not
        // dismantle Foundation/capability subsystems itself, so renderer
        // disposal below is unaffected and unchanged from before.
        Founder.getInstance().shutdownEngine();
        if (this.renderer && typeof this.renderer.dispose === "function") {
            this.renderer.dispose();
        }
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
