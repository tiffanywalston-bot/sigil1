/**
 * ============================================================
 * SIGIL1 Renderer
 * Gold Master Version 4.0
 * ============================================================
 *
 * Master Render Pipeline
 *
 * Render Order
 *
 * Background
 * Clouds
 * Rings
 * Source
 * Core Axis
 * Sacred Geometry
 * Chains
 * Crystals
 * Jewels
 * Sparkles
 * Lighting
 *
 * ============================================================
 */

import { Scene } from "./scene.js";
import { Geometry } from "./geometry.js";
import { Background } from "./background.js";
import { Rings } from "./rings.js";
import { SacredGeometry } from "./sacredgeometry.js";

import { Clouds } from "./clouds.js";
import { Chains } from "./chains.js";
import { Crystals } from "./crystals.js";
import { Jewels } from "./jewels.js";
import { Sparkles } from "./sparkles.js";

export class Renderer {

    constructor(canvas) {

        this.canvas = canvas;

        this.ctx = canvas.getContext("2d");

        this.width = 0;

        this.height = 0;

        this.clouds = new Clouds();

        this.chains = new Chains();

        this.crystals = new Crystals();

        this.jewels = new Jewels();

        this.sparkles = new Sparkles();

        this.resize();

        window.addEventListener(
            "resize",
            () => this.resize()
        );

    }

    resize() {

        this.canvas.width = window.innerWidth;

        this.canvas.height = window.innerHeight;

        this.width = this.canvas.width;

        this.height = this.canvas.height;

    }

    render(animation) {

        this.clear();

        Background.draw(
            this.ctx,
            this.width,
            this.height
        );
                Rings.draw(
            this.ctx,
            this.width / 2,
            this.height * 0.43
        );

        this.drawSource(animation);

        this.drawCoreAxis();

        this.drawGeometry();

        this.clouds.drawAll(
            this.ctx,
            Scene
        );

        this.chains.drawAll(
            this.ctx,
            Scene
        );

        this.crystals.drawAll(
            this.ctx,
            Scene
        );

        this.jewels.drawAll(
            this.ctx,
            Scene
        );

        this.sparkles.drawAll(
            this.ctx,
            Scene
        );

        this.drawPregnancyJewel();

    }

    clear() {

        this.ctx.clearRect(
            0,
            0,
            this.width,
            this.height
        );

    }

    drawSource(animation) {

        const s = Scene.source;

        const pulse = animation
            ? animation.breathe(1, 5)
            : 0;

        const x = s.x * this.width;

        const y = s.y * this.height;

        Geometry.drawGlow(
            this.ctx,
            x,
            y,
            s.radius + pulse,
            Scene.colors.gold
        );

        Geometry.drawFilledCircle(
            this.ctx,
            x,
            y,
            s.radius,
            Scene.colors.gold
        );

    }
        drawCoreAxis() {

        const axis = Scene.axis;

        Geometry.drawAxis(
            this.ctx,
            axis.x * this.width,
            axis.top * this.height,
            axis.bottom * this.height,
            Scene.colors.gold
        );

    }

    drawGeometry() {

        const left = Scene.geometry.leftIdentity;

        const right = Scene.geometry.rightIdentity;

        const core = Scene.geometry.engineCore;

        const magnetic = Scene.geometry.magneticField;

        Geometry.drawCircle(
            this.ctx,
            left.x * this.width,
            left.y * this.height,
            left.radius,
            Scene.colors.blue,
            2
        );

        Geometry.drawCircle(
            this.ctx,
            right.x * this.width,
            right.y * this.height,
            right.radius,
            Scene.colors.blue,
            2
        );

        Geometry.drawCircle(
            this.ctx,
            core.x * this.width,
            core.y * this.height,
            core.radius,
            Scene.colors.gold,
            3
        );

        Geometry.drawCircle(
            this.ctx,
            magnetic.x * this.width,
            magnetic.y * this.height,
            magnetic.radius,
            Scene.colors.purple,
            2
        );

        SacredGeometry.drawFlowerOfLife(
            this.ctx,
            core.x * this.width,
            core.y * this.height,
            40
        );

        SacredGeometry.drawConnectionLines(
            this.ctx,
            core.x * this.width,
            core.y * this.height,
            40
        );

        SacredGeometry.drawCenterNode(
            this.ctx,
            core.x * this.width,
            core.y * this.height
        );

    }

    drawPregnancyJewel() {

        const jewel = Scene.pregnancyHarmonic;

        const x = jewel.x * this.width;

        const y = jewel.y * this.height;

        Geometry.drawDiamond(
            this.ctx,
            x,
            y,
            90,
            130,
            Scene.colors.gold
        );

        Geometry.drawGlow(
            this.ctx,
            x,
            y,
            10,
            Scene.colors.gold
        );

        Geometry.drawFilledCircle(
            this.ctx,
            x,
            y,
            4,
            "#FFFFFF"
        );

    }

}
