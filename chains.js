/*
===========================================================
SIGIL1 ENGINE
chains.js
Version: 1.0 Gold Master
===========================================================

Purpose:
Production chain rendering module.

Responsibilities:

- Crystal Chains
- Jewel Chains
- Pendant Chains
- Hanging Chains
- Harmonic Connectors

This module ONLY renders chains.

It does NOT render:

- Crystals
- Jewels
- Rings
- Sacred Geometry
- Clouds
- Stars
- Background

Renderer usage:

import { Chains } from "./chains.js";

const chains = new Chains();

chains.drawAll(ctx, scene);

===========================================================
*/

export class Chains {

    constructor() {

        this.gold = "#d4af37";

        this.defaultOpacity = 0.95;

        this.chains = [];

    }

    initialize(scene) {

        const c = scene.center;

        this.chains = [

            {
                id: "sourceIdentity",

                x1: c.x,
                y1: c.y - 330,

                x2: c.x,
                y2: c.y,

                linkRadius: 4,

                visible: true
            },

            {
                id: "identityLeft",

                x1: c.x,
                y1: c.y,

                x2: c.x - 205,
                y2: c.y,

                linkRadius: 4,

                visible: true
            },

            {
                id: "identityRight",

                x1: c.x,
                y1: c.y,

                x2: c.x + 205,
                y2: c.y,

                linkRadius: 4,

                visible: true
            },

            {
                id: "identityManifest",

                x1: c.x,
                y1: c.y,

                x2: c.x,
                y2: c.y + 250,

                linkRadius: 4,

                visible: true
            },

            {
                id: "manifestPregnancy",

                x1: c.x,
                y1: c.y + 250,

                x2: c.x,
                y2: c.y + 385,

                linkRadius: 4,

                visible: true
            }

        ];

    }

    drawAll(ctx, scene) {

        if (!this.chains.length) {

            this.initialize(scene);

        }

        for (const chain of this.chains) {

            if (!chain.visible) continue;

            this.drawChain(ctx, chain);

        }

    }

    drawChain(ctx, chain) {

        ctx.save();

        ctx.globalAlpha = this.defaultOpacity;

        this.drawLinks(ctx, chain);

        ctx.restore();

    }
        drawLinks(ctx, chain) {

        const dx = chain.x2 - chain.x1;
        const dy = chain.y2 - chain.y1;

        const distance = Math.sqrt(dx * dx + dy * dy);

        const spacing = chain.linkRadius * 2.4;

        const count = Math.max(2, Math.floor(distance / spacing));

        for (let i = 0; i <= count; i++) {

            const t = i / count;

            const x = chain.x1 + dx * t;
            const y = chain.y1 + dy * t;

            this.drawLink(ctx, x, y, chain.linkRadius);

        }

    }

    drawLink(ctx, x, y, radius) {

        ctx.save();

        ctx.translate(x, y);

        const gradient = ctx.createRadialGradient(
            -radius * 0.3,
            -radius * 0.3,
            radius * 0.2,
            0,
            0,
            radius
        );

        gradient.addColorStop(0, "#fff7c7");
        gradient.addColorStop(0.35, "#f5d76e");
        gradient.addColorStop(0.70, "#d4af37");
        gradient.addColorStop(1, "#8b6a16");

        ctx.fillStyle = gradient;

        ctx.beginPath();

        ctx.arc(
            0,
            0,
            radius,
            0,
            Math.PI * 2
        );

        ctx.fill();

        ctx.lineWidth = 1;

        ctx.strokeStyle = "#fff5b5";

        ctx.stroke();

        this.drawHighlight(ctx, radius);

        ctx.restore();

    }

    drawHighlight(ctx, radius) {

        ctx.fillStyle = "rgba(255,255,255,.70)";

        ctx.beginPath();

        ctx.ellipse(
            -radius * 0.25,
            -radius * 0.30,
            radius * 0.30,
            radius * 0.18,
            -0.5,
            0,
            Math.PI * 2
        );

        ctx.fill();

    }
        update(deltaTime = 0.016) {

        // Reserved for future chain animation
        // (sway, shimmer, pendulum motion)

    }

    setOpacity(value) {

        this.defaultOpacity = value;

    }

    show(id) {

        const chain = this.chains.find(c => c.id === id);

        if (chain) {

            chain.visible = true;

        }

    }

    hide(id) {

        const chain = this.chains.find(c => c.id === id);

        if (chain) {

            chain.visible = false;

        }

    }

    showAll() {

        for (const chain of this.chains) {

            chain.visible = true;

        }

    }

    hideAll() {

        for (const chain of this.chains) {

            chain.visible = false;

        }

    }

}