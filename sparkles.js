/*
===========================================================
SIGIL1 ENGINE
sparkles.js
Version: 1.0 Gold Master
===========================================================

Purpose:
Production sparkle rendering module.

Responsibilities:

- Diamond Sparkles
- Gold Sparkles
- Harmonic Sparkles
- Accent Sparkles
- Ambient Sparkles

This module ONLY renders sparkles.

It does NOT render:

- Crystals
- Jewels
- Chains
- Rings
- Sacred Geometry
- Clouds
- Stars
- Background

Renderer usage:

import { Sparkles } from "./sparkles.js";

const sparkles = new Sparkles();

sparkles.drawAll(ctx, scene);

===========================================================
*/

export class Sparkles {

    constructor() {

        this.defaultOpacity = 1.0;

        this.sparkles = [];

    }

    initialize(scene) {

        const c = scene.center;

        this.sparkles = [

            {
                id: "center",

                x: c.x,
                y: c.y,

                radius: 8,

                rotation: 0,

                visible: true
            },

            {
                id: "north",

                x: c.x,
                y: c.y - 170,

                radius: 6,

                rotation: 0,

                visible: true
            },

            {
                id: "south",

                x: c.x,
                y: c.y + 170,

                radius: 6,

                rotation: 0,

                visible: true
            },

            {
                id: "east",

                x: c.x + 170,
                y: c.y,

                radius: 6,

                rotation: 0,

                visible: true
            },

            {
                id: "west",

                x: c.x - 170,
                y: c.y,

                radius: 6,

                rotation: 0,

                visible: true
            }

        ];

    }

    drawAll(ctx, scene) {

        if (!this.sparkles.length) {

            this.initialize(scene);

        }

        for (const sparkle of this.sparkles) {

            if (!sparkle.visible) continue;

            this.drawSparkle(ctx, sparkle);

        }

    }

    drawSparkle(ctx, sparkle) {

        ctx.save();

        ctx.translate(sparkle.x, sparkle.y);

        ctx.rotate(sparkle.rotation);

        ctx.globalAlpha = this.defaultOpacity;
                this.drawGlow(ctx, sparkle);

        this.drawStar(ctx, sparkle);

        this.drawCenter(ctx, sparkle);

        ctx.restore();

    }

    drawGlow(ctx, sparkle) {

        const glow = ctx.createRadialGradient(
            0,
            0,
            sparkle.radius * 0.15,
            0,
            0,
            sparkle.radius * 2.8
        );

        glow.addColorStop(0, "rgba(255,255,255,.95)");
        glow.addColorStop(0.30, "rgba(255,245,180,.70)");
        glow.addColorStop(0.65, "rgba(255,220,120,.20)");
        glow.addColorStop(1, "rgba(255,255,255,0)");

        ctx.fillStyle = glow;

        ctx.beginPath();

        ctx.arc(
            0,
            0,
            sparkle.radius * 2.8,
            0,
            Math.PI * 2
        );

        ctx.fill();

    }

    drawStar(ctx, sparkle) {

        const r = sparkle.radius;

        ctx.strokeStyle = "#ffffff";

        ctx.lineWidth = 1.5;

        ctx.beginPath();

        ctx.moveTo(-r, 0);
        ctx.lineTo(r, 0);

        ctx.moveTo(0, -r);
        ctx.lineTo(0, r);

        ctx.moveTo(-r * 0.7, -r * 0.7);
        ctx.lineTo(r * 0.7, r * 0.7);

        ctx.moveTo(-r * 0.7, r * 0.7);
        ctx.lineTo(r * 0.7, -r * 0.7);

        ctx.stroke();

    }

    drawCenter(ctx, sparkle) {

        ctx.fillStyle = "#ffffff";

        ctx.beginPath();

        ctx.arc(
            0,
            0,
            sparkle.radius * 0.18,
            0,
            Math.PI * 2
        );

        ctx.fill();

    }
        update(deltaTime = 0.016) {

        for (const sparkle of this.sparkles) {

            sparkle.rotation += deltaTime * 0.85;

        }

    }

    setOpacity(value) {

        this.defaultOpacity = value;

    }

}