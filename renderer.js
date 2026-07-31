/**
 * ============================================================
 * SIGIL1 Renderer
 * Version 2.0
 * ============================================================
 */

import { Scene } from "./scene.js";
import { Geometry } from "./geometry.js";
import { Background } from "./background.js";
import { Rings } from "./rings.js";

export class Renderer {

    constructor(canvas) {

        this.canvas = canvas;
        this.ctx = canvas.getContext("2d");

        this.width = 0;
        this.height = 0;

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

        const x = axis.x * this.width;

        Geometry.drawAxis(
            this.ctx,
            x,
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

    }

}