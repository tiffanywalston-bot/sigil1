/**
 * ============================================================
 * SIGIL1 Engine
 * Version 1.0
 * ============================================================
 */

import { Renderer } from "./renderer.js";

export class Engine {

    constructor() {

        this.canvas = document.getElementById("sigil1");

        if (!this.canvas) {
            throw new Error("Canvas with id 'sigil1' not found.");
        }

        this.renderer = new Renderer(this.canvas);

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

    loop(time) {

        if (!this.running) return;

        const delta = time - this.lastTime;

        this.lastTime = time;

        this.update(delta);

        this.renderer.render();

        requestAnimationFrame(this.loop.bind(this));

    }

    update(delta) {

        // Future Engine Logic

        // Identity Layer

        // Intention Layer

        // Harmonic Layer

        // Emotional Layer

        // Pregnancy Harmonic

        // WAV Synchronization

        // Subliminal Synchronization

    }

}