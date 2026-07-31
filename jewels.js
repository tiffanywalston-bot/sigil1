/*
===========================================================
SIGIL1 ENGINE
jewels.js
Version: 1.0 Gold Master
===========================================================

Purpose:
Production jewel rendering module.

Responsibilities:
- Center Jewel
- Ring Jewels
- Harmonic Jewels
- Connection Jewels
- Accent Jewels
- Hanging Jewels

This module ONLY renders jewels.

It does NOT render:

- Crystals
- Rings
- Sacred Geometry
- Clouds
- Stars
- Background
- Animation timing

Renderer usage:

import { Jewels } from "./jewels.js";

const jewels = new Jewels();

jewels.drawAll(ctx, scene);

===========================================================
*/

export class Jewels {

    constructor() {

        this.gold = "#d4af37";
        this.defaultOpacity = 0.95;

        this.jewels = [];

    }

    initialize(scene) {

        const c = scene.center;

        this.jewels = [

            {
                id: "center",
                x: c.x,
                y: c.y,
                radius: 10,
                color: "#ffffff",
                glow: "#ffffff",
                rotation: 0,
                pulse: 1,
                visible: true
            },

            {
                id: "north",
                x: c.x,
                y: c.y - 165,
                radius: 8,
                color: "#00d4ff",
                glow: "#7ee9ff",
                rotation: 0,
                pulse: 1,
                visible: true
            },

            {
                id: "south",
                x: c.x,
                y: c.y + 165,
                radius: 8,
                color: "#ffd64d",
                glow: "#ffe98a",
                rotation: 0,
                pulse: 1,
                visible: true
            },

            {
                id: "east",
                x: c.x + 165,
                y: c.y,
                radius: 8,
                color: "#b66cff",
                glow: "#d5a7ff",
                rotation: 0,
                pulse: 1,
                visible: true
            },

            {
                id: "west",
                x: c.x - 165,
                y: c.y,
                radius: 8,
                color: "#ff6a8b",
                glow: "#ffb4c4",
                rotation: 0,
                pulse: 1,
                visible: true
            }

        ];

    }

    drawAll(ctx, scene) {

        if (!this.jewels.length) {

            this.initialize(scene);

        }

        for (const jewel of this.jewels) {

            if (!jewel.visible) continue;

            this.drawJewel(ctx, jewel);

        }

    }

    drawJewel(ctx, jewel) {

        ctx.save();

        ctx.translate(jewel.x, jewel.y);

        ctx.rotate(jewel.rotation);

        ctx.globalAlpha = this.defaultOpacity;

        this.drawGlow(ctx, jewel);

        this.drawFacet(ctx, jewel);

        this.drawHighlight(ctx, jewel);

        this.drawBezel(ctx, jewel);

        ctx.restore();

    }
        drawGlow(ctx, jewel) {

        const glow = ctx.createRadialGradient(
            0,
            0,
            jewel.radius * 0.15,
            0,
            0,
            jewel.radius * 2.2
        );

        glow.addColorStop(0, jewel.glow);
        glow.addColorStop(0.35, jewel.glow + "AA");
        glow.addColorStop(0.70, jewel.glow + "33");
        glow.addColorStop(1, "rgba(0,0,0,0)");

        ctx.fillStyle = glow;

        ctx.beginPath();

        ctx.arc(
            0,
            0,
            jewel.radius * 2.2,
            0,
            Math.PI * 2
        );

        ctx.fill();

    }

    drawFacet(ctx, jewel) {

        const r = jewel.radius;

        const gradient = ctx.createLinearGradient(
            -r,
            -r,
            r,
            r
        );

        gradient.addColorStop(0, "#ffffff");
        gradient.addColorStop(0.25, jewel.color);
        gradient.addColorStop(0.75, "#d8f6ff");
        gradient.addColorStop(1, "#7ec8ff");

        ctx.fillStyle = gradient;

        ctx.beginPath();

        ctx.moveTo(0, -r);

        ctx.lineTo(r * 0.75, -r * 0.20);

        ctx.lineTo(r, r * 0.35);

        ctx.lineTo(0, r);

        ctx.lineTo(-r, r * 0.35);

        ctx.lineTo(-r * 0.75, -r * 0.20);

        ctx.closePath();

        ctx.fill();

        ctx.lineWidth = 1.5;

        ctx.strokeStyle = this.gold;

        ctx.stroke();

        this.drawFacetLines(ctx, r);

    }

    drawFacetLines(ctx, r) {

        ctx.strokeStyle = "rgba(255,255,255,.60)";
        ctx.lineWidth = 0.8;

        ctx.beginPath();

        ctx.moveTo(0, -r);
        ctx.lineTo(0, r);

        ctx.moveTo(-r * 0.75, -r * 0.20);
        ctx.lineTo(0, 0);
        ctx.lineTo(r * 0.75, -r * 0.20);

        ctx.moveTo(-r, r * 0.35);
        ctx.lineTo(0, 0);
        ctx.lineTo(r, r * 0.35);

        ctx.stroke();

    }

    drawHighlight(ctx, jewel) {

        const r = jewel.radius;

        ctx.fillStyle = "rgba(255,255,255,.90)";

        ctx.beginPath();

        ctx.ellipse(
            -r * 0.18,
            -r * 0.25,
            r * 0.16,
            r * 0.09,
            -0.6,
            0,
            Math.PI * 2
        );

        ctx.fill();

        ctx.fillStyle = "rgba(255,255,255,.35)";

        ctx.beginPath();

        ctx.arc(
            r * 0.15,
            r * 0.15,
            r * 0.08,
            0,
            Math.PI * 2
        );

        ctx.fill();

    }
        drawBezel(ctx, jewel) {

        const r = jewel.radius;

        ctx.save();

        ctx.strokeStyle = this.gold;
        ctx.fillStyle = this.gold;

        ctx.lineWidth = 1.5;

        // Outer Gold Ring

        ctx.beginPath();

        ctx.arc(
            0,
            0,
            r + 1.5,
            0,
            Math.PI * 2
        );

        ctx.stroke();

        // Top Mount

        ctx.beginPath();

        ctx.arc(
            0,
            -r - 2,
            1.5,
            0,
            Math.PI * 2
        );

        ctx.fill();

        // Bottom Mount

        ctx.beginPath();

        ctx.arc(
            0,
            r + 2,
            1.5,
            0,
            Math.PI * 2
        );

        ctx.fill();

        // Left Mount

        ctx.beginPath();

        ctx.arc(
            -r - 2,
            0,
            1.5,
            0,
            Math.PI * 2
        );

        ctx.fill();

        // Right Mount

        ctx.beginPath();

        ctx.arc(
            r + 2,
            0,
            1.5,
            0,
            Math.PI * 2
        );

        ctx.fill();

        ctx.restore();

    }

    update(deltaTime = 0.016) {

        for (const jewel of this.jewels) {

            jewel.rotation += deltaTime * 0.20;

            jewel.pulse += deltaTime * 2.0;

        }

    }

    setOpacity(value) {

        this.defaultOpacity = value;

    }

    setPulse(value) {

        for (const jewel of this.jewels) {

            jewel.pulse = value;

        }

    }

}