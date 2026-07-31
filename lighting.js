/*
===========================================================
SIGIL1 ENGINE
lighting.js
Version: 1.0 Gold Master
===========================================================

Purpose:
Production lighting module.

Responsibilities:

- Global Illumination
- Gold Reflections
- Crystal Lighting
- Jewel Lighting
- Ambient Glow
- Highlight Layers

This module ONLY provides lighting.

It does NOT render:

- Geometry
- Rings
- Clouds
- Stars
- Animation
- Background

Renderer usage:

import { Lighting } from "./lighting.js";

const lighting = new Lighting();

===========================================================
*/

export class Lighting {

    constructor() {

        this.defaultOpacity = 1.0;

        this.ambientStrength = 0.35;

        this.highlightStrength = 0.80;

        this.glowStrength = 0.55;

    }

    begin(ctx) {

        ctx.save();

        ctx.globalAlpha = this.defaultOpacity;

    }

    end(ctx) {

        ctx.restore();

    }

    applyAmbient(ctx, radius) {

        const gradient = ctx.createRadialGradient(
            0,
            0,
            radius * 0.10,
            0,
            0,
            radius
        );

        gradient.addColorStop(
            0,
            `rgba(255,255,255,${this.ambientStrength})`
        );

        gradient.addColorStop(
            1,
            "rgba(255,255,255,0)"
        );

        return gradient;

    }
        applyGlow(ctx, radius) {

        const gradient = ctx.createRadialGradient(
            0,
            0,
            radius * 0.15,
            0,
            0,
            radius * 1.8
        );

        gradient.addColorStop(
            0,
            `rgba(255,255,255,${this.glowStrength})`
        );

        gradient.addColorStop(
            0.45,
            "rgba(255,235,180,.25)"
        );

        gradient.addColorStop(
            1,
            "rgba(255,255,255,0)"
        );

        return gradient;

    }

    applyHighlight(ctx, radius) {

        const gradient = ctx.createLinearGradient(
            -radius,
            -radius,
            radius,
            radius
        );

        gradient.addColorStop(
            0,
            `rgba(255,255,255,${this.highlightStrength})`
        );

        gradient.addColorStop(
            0.50,
            "rgba(255,255,255,.18)"
        );

        gradient.addColorStop(
            1,
            "rgba(255,255,255,0)"
        );

        return gradient;

    }

    setAmbient(value) {

        this.ambientStrength = value;

    }

    setGlow(value) {

        this.glowStrength = value;

    }

    setHighlight(value) {

        this.highlightStrength = value;

    }
        update() {

        // Reserved for future dynamic lighting.
        // Gold Master Version 1 remains static.

    }

}