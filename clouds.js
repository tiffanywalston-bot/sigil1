/*
===========================================================
SIGIL1 ENGINE
clouds.js
Version: 1.0 Gold Master
===========================================================

Purpose:
Production cloud rendering module.

Responsibilities:

- Shadow Mass Billows
- Layered Cloud Fields
- Harmonic Atmosphere
- Environmental Depth
- Atmospheric Softening

This module ONLY renders clouds.

It does NOT render:

- Crystals
- Jewels
- Chains
- Sparkles
- Rings
- Sacred Geometry
- Stars
- Background

Renderer usage:

import { Clouds } from "./clouds.js";

const clouds = new Clouds();

clouds.drawAll(ctx, scene);

===========================================================
*/

export class Clouds {

    constructor() {

        this.defaultOpacity = 0.32;

        this.clouds = [];

    }

    initialize(scene) {

        const c = scene.center;

        this.clouds = [

            {
                id: "upper",

                x: c.x,
                y: c.y - 240,

                radius: 95,

                visible: true

            },

            {
                id: "left",

                x: c.x - 170,
                y: c.y - 60,

                radius: 105,

                visible: true

            },

            {
                id: "right",

                x: c.x + 170,
                y: c.y - 60,

                radius: 105,

                visible: true

            },

            {
                id: "lower",

                x: c.x,
                y: c.y + 170,

                radius: 120,

                visible: true

            }

        ];

    }

    drawAll(ctx, scene) {

        if (!this.clouds.length) {

            this.initialize(scene);

        }

        for (const cloud of this.clouds) {

            if (!cloud.visible) continue;

            this.drawCloud(ctx, cloud);

        }

    }

    drawCloud(ctx, cloud) {

        ctx.save();

        ctx.globalAlpha = this.defaultOpacity;
                ctx.translate(cloud.x, cloud.y);

        this.drawBillow(ctx, cloud);

        ctx.restore();

    }

    drawBillow(ctx, cloud) {

        const r = cloud.radius;

        const gradient = ctx.createRadialGradient(
            0,
            0,
            r * 0.20,
            0,
            0,
            r
        );

        gradient.addColorStop(0, "rgba(255,255,255,.22)");
        gradient.addColorStop(0.30, "rgba(210,225,255,.16)");
        gradient.addColorStop(0.65, "rgba(145,165,210,.10)");
        gradient.addColorStop(1, "rgba(0,0,0,0)");

        ctx.fillStyle = gradient;

        const billows = [

            { x: -0.55, y:  0.08, s: 0.58 },
            { x: -0.20, y: -0.18, s: 0.66 },
            { x:  0.22, y: -0.08, s: 0.72 },
            { x:  0.58, y:  0.12, s: 0.55 },
            { x:  0.00, y:  0.22, s: 0.80 }

        ];

        for (const b of billows) {

            ctx.beginPath();

            ctx.arc(
                b.x * r,
                b.y * r,
                b.s * r,
                0,
                Math.PI * 2
            );

            ctx.fill();

        }

        this.drawMist(ctx, r);

    }

    drawMist(ctx, radius) {

        ctx.strokeStyle = "rgba(255,255,255,.08)";

        ctx.lineWidth = radius * 0.12;

        ctx.beginPath();

        ctx.arc(
            0,
            0,
            radius * 0.72,
            Math.PI * 0.10,
            Math.PI * 0.90
        );

        ctx.stroke();

    }