/*
===========================================================
SIGIL1 ENGINE
materials.js
Version: 1.0 Gold Master
===========================================================

Purpose:
Production material rendering library.

Responsibilities:

- Gold Materials
- Crystal Materials
- Jewel Materials
- Glass Materials
- Glow Materials
- Metallic Finishes

This module ONLY creates reusable materials.

It does NOT render:

- Geometry
- Rings
- Clouds
- Stars
- Animation
- Background

Renderer usage:

import { Materials } from "./materials.js";

const materials = new Materials();

===========================================================
*/

export class Materials {

    constructor() {

        this.gold = "#d4af37";

        this.materials = {};

        this.initialize();

    }

    initialize() {

        this.materials = {

            gold14k: {

                highlight: "#fff6c8",

                light: "#f5d76e",

                base: "#d4af37",

                shadow: "#8b6a16"

            },

            crystal: {

                highlight: "#ffffff",

                light: "#dff8ff",

                base: "#8edcff",

                shadow: "#5ca9da"

            },

            diamond: {

                highlight: "#ffffff",

                light: "#eefcff",

                base: "#d7f2ff",

                shadow: "#9cc8e6"

            },

            glass: {

                highlight: "#ffffff",

                light: "#d9ecff",

                base: "#9bc9ff",

                shadow: "#6d92c2"

            },

            glow: {

                center: "rgba(255,255,255,.95)",

                middle: "rgba(255,240,180,.45)",

                edge: "rgba(255,255,255,0)"

            }

        };

    }

    get(name) {

        return this.materials[name];

    }
        createGoldGradient(ctx, radius) {

        const material = this.materials.gold14k;

        const gradient = ctx.createLinearGradient(
            -radius,
            -radius,
            radius,
            radius
        );

        gradient.addColorStop(0, material.highlight);
        gradient.addColorStop(0.30, material.light);
        gradient.addColorStop(0.70, material.base);
        gradient.addColorStop(1, material.shadow);

        return gradient;

    }

    createCrystalGradient(ctx, radius) {

        const material = this.materials.crystal;

        const gradient = ctx.createLinearGradient(
            -radius,
            -radius,
            radius,
            radius
        );

        gradient.addColorStop(0, material.highlight);
        gradient.addColorStop(0.35, material.light);
        gradient.addColorStop(0.75, material.base);
        gradient.addColorStop(1, material.shadow);

        return gradient;

    }

    createDiamondGradient(ctx, radius) {

        const material = this.materials.diamond;

        const gradient = ctx.createLinearGradient(
            -radius,
            -radius,
            radius,
            radius
        );

        gradient.addColorStop(0, material.highlight);
        gradient.addColorStop(0.40, material.light);
        gradient.addColorStop(0.75, material.base);
        gradient.addColorStop(1, material.shadow);

        return gradient;

    }
        createGlowGradient(ctx, radius) {

        const material = this.materials.glow;

        const gradient = ctx.createRadialGradient(
            0,
            0,
            radius * 0.15,
            0,
            0,
            radius
        );

        gradient.addColorStop(0, material.center);
        gradient.addColorStop(0.45, material.middle);
        gradient.addColorStop(1, material.edge);

        return gradient;

    }

    has(name) {

        return Object.prototype.hasOwnProperty.call(
            this.materials,
            name
        );

    }

    update() {

        // Reserved for future animated materials.
        // Gold Master Version 1 remains static.

    }

}