/*
===========================================================
SIGIL1 ENGINE
crystals.js
Version: 1.0 Gold Master
===========================================================

Purpose:
Production crystal rendering module.

Responsibilities:
- Source Crystal
- Identity Crystal
- Intention Crystal
- Reinforcement Crystal
- Manifestation Crystal
- Pregnancy Harmonic Crystal

This module ONLY renders crystals.

It does NOT render:

- Rings
- Sacred Geometry
- Clouds
- Stars
- Background
- Animation timing

Renderer usage:

import { Crystals } from "./crystals.js";

const crystals = new Crystals();

crystals.drawAll(ctx, scene);

===========================================================
*/

export class Crystals {

    constructor() {

        this.defaultGlow = 18;
        this.defaultOpacity = 0.95;

        this.gold = "#d4af37";
        this.white = "#ffffff";

        this.crystals = [];

    }

    initialize(scene) {

        const c = scene.center;

        this.crystals = [

            {
                id: "source",
                x: c.x,
                y: c.y - 330,
                radius: 34,
                color: "#ffffff",
                glow: "#ffffff",
                rotation: 0,
                pulse: 1
            },

            {
                id: "identity",
                x: c.x,
                y: c.y,
                radius: 46,
                color: "#dff6ff",
                glow: "#7fd8ff",
                rotation: 0,
                pulse: 1
            },

            {
                id: "intention",
                x: c.x - 205,
                y: c.y,
                radius: 28,
                color: "#ffc8ef",
                glow: "#ff8fd4",
                rotation: 0,
                pulse: 1
            },

            {
                id: "reinforcement",
                x: c.x + 205,
                y: c.y,
                radius: 28,
                color: "#d7bcff",
                glow: "#9b6cff",
                rotation: 0,
                pulse: 1
            },

            {
                id: "manifestation",
                x: c.x,
                y: c.y + 250,
                radius: 32,
                color: "#ffe89d",
                glow: "#ffd046",
                rotation: 0,
                pulse: 1
            },

            {
                id: "pregnancy",
                x: c.x,
                y: c.y + 385,
                radius: 30,
                color: "#edf7ff",
                glow: "#c4ebff",
                rotation: 0,
                pulse: 1
            }

        ];

    }

    drawAll(ctx, scene) {

        if (!this.crystals.length) {
            this.initialize(scene);
        }

        for (const crystal of this.crystals) {

            this.drawCrystal(ctx, crystal);

        }

    }

    drawCrystal(ctx, crystal) {

        ctx.save();

        ctx.translate(crystal.x, crystal.y);

        ctx.rotate(crystal.rotation);

        ctx.globalAlpha = this.defaultOpacity;

        this.drawGlow(ctx, crystal);

        this.drawFacets(ctx, crystal);

        this.drawHighlights(ctx, crystal);

        this.drawGoldMount(ctx, crystal);

        ctx.restore();

    }
    
        drawGlow(ctx, crystal) {

        const glow = ctx.createRadialGradient(
            0,
            0,
            crystal.radius * 0.15,
            0,
            0,
            crystal.radius * 2.4
        );

        glow.addColorStop(0, crystal.glow);
        glow.addColorStop(0.25, crystal.glow + "AA");
        glow.addColorStop(0.55, crystal.glow + "44");
        glow.addColorStop(1, "rgba(0,0,0,0)");

        ctx.fillStyle = glow;

        ctx.beginPath();
        ctx.arc(
            0,
            0,
            crystal.radius * 2.3,
            0,
            Math.PI * 2
        );
        ctx.fill();

    }

    drawFacets(ctx, crystal) {

        const r = crystal.radius;

        const body = ctx.createLinearGradient(
            -r,
            -r,
            r,
            r
        );

        body.addColorStop(0, "#ffffff");
        body.addColorStop(0.20, crystal.color);
        body.addColorStop(0.55, "#d9f4ff");
        body.addColorStop(1, "#7ebeff");

        ctx.fillStyle = body;

        ctx.beginPath();

        ctx.moveTo(0, -r);

        ctx.lineTo(r * 0.55, -r * 0.35);

        ctx.lineTo(r * 0.85, r * 0.20);

        ctx.lineTo(0, r);

        ctx.lineTo(-r * 0.85, r * 0.20);

        ctx.lineTo(-r * 0.55, -r * 0.35);

        ctx.closePath();

        ctx.fill();

        ctx.lineWidth = 2;

        ctx.strokeStyle = this.gold;

        ctx.stroke();

        this.drawFacetLines(ctx, r);

    }

    drawFacetLines(ctx, r) {

        ctx.strokeStyle = "rgba(255,255,255,.55)";
        ctx.lineWidth = 1;

        ctx.beginPath();

        ctx.moveTo(0, -r);

        ctx.lineTo(0, r);

        ctx.moveTo(-r * .55, -r * .35);

        ctx.lineTo(0, 0);

        ctx.lineTo(r * .55, -r * .35);

        ctx.moveTo(-r * .85, r * .20);

        ctx.lineTo(0, 0);

        ctx.lineTo(r * .85, r * .20);

        ctx.stroke();

    }

    drawHighlights(ctx, crystal) {

        const r = crystal.radius;

        ctx.fillStyle = "rgba(255,255,255,.85)";

        ctx.beginPath();

        ctx.ellipse(
            -r * .20,
            -r * .30,
            r * .18,
            r * .10,
            -0.6,
            0,
            Math.PI * 2
        );

        ctx.fill();

        ctx.fillStyle = "rgba(255,255,255,.35)";

        ctx.beginPath();

        ctx.arc(
            r * .15,
            r * .15,
            r * .10,
            0,
            Math.PI * 2
        );

        ctx.fill();

    }
    
        drawGoldMount(ctx, crystal) {

        const r = crystal.radius;

        ctx.save();

        ctx.strokeStyle = this.gold;
        ctx.fillStyle = this.gold;

        ctx.lineWidth = 2;

        // Top Mount

        ctx.beginPath();

        ctx.moveTo(-r * 0.20, -r * 1.05);
        ctx.lineTo(r * 0.20, -r * 1.05);

        ctx.stroke();

        ctx.beginPath();

        ctx.arc(
            0,
            -r * 1.05,
            r * 0.08,
            0,
            Math.PI * 2
        );

        ctx.fill();

        // Bottom Mount

        ctx.beginPath();

        ctx.moveTo(-r * 0.20, r * 1.05);
        ctx.lineTo(r * 0.20, r * 1.05);

        ctx.stroke();

        ctx.beginPath();

        ctx.arc(
            0,
            r * 1.05,
            r * 0.08,
            0,
            Math.PI * 2
        );

        ctx.fill();

        ctx.restore();

    }

    update(deltaTime = 0.016) {

        for (const crystal of this.crystals) {

            crystal.rotation += deltaTime * 0.15;

            crystal.pulse += deltaTime * 2;

        }

    }

    setPulse(value) {

        for (const crystal of this.crystals) {

            crystal.pulse = value;

        }

    }

    setOpacity(value) {

        this.defaultOpacity = value;

    }

    setGlow(value) {

        this.defaultGlow = value;

    }

}