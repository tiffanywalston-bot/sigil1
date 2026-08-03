/**
 * ============================================================
 * SIGIL1 Engine
 * Version 2.0
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

    shutdown() {
        this.stop();
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
