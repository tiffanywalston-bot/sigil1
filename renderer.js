/**
 * ============================================================
 * SIGIL1 Renderer
 * Version 1.0
 * Reads Scene and renders Gold Master
 * ============================================================
 */

import { Scene } from "./scene.js";

export class Renderer {

    constructor(canvas) {

        this.canvas = canvas;
        this.ctx = canvas.getContext("2d");

        this.resize();

        window.addEventListener("resize", () => this.resize());
    }

    resize() {

        this.canvas.width = window.innerWidth;
        this.canvas.height = window.innerHeight;

        this.width = this.canvas.width;
        this.height = this.canvas.height;
    }

    render() {

        this.clear();

        this.drawBackground();

        this.drawSource();

        this.drawCoreAxis();

        this.drawGeometry();

        this.drawPregnancyJewel();

    }

    clear() {

        this.ctx.fillStyle = Scene.colors.background;
        this.ctx.fillRect(0,0,this.width,this.height);

    }

    drawBackground() {

        this.ctx.fillStyle = "#04060F";
        this.ctx.fillRect(0,0,this.width,this.height);

    }

    drawSource() {

        const s = Scene.source;

        const x = s.x * this.width;
        const y = s.y * this.height;

        this.ctx.beginPath();

        this.ctx.arc(
            x,
            y,
            s.radius,
            0,
            Math.PI*2
        );

        this.ctx.fillStyle = Scene.colors.gold;

        this.ctx.fill();

    }

    drawCoreAxis() {

        const a = Scene.axis;

        const x = a.x * this.width;

        this.ctx.strokeStyle = Scene.colors.gold;

        this.ctx.lineWidth = 2;

        this.ctx.beginPath();

        this.ctx.moveTo(
            x,
            a.top * this.height
        );

        this.ctx.lineTo(
            x,
            a.bottom * this.height
        );

        this.ctx.stroke();

    }

    drawGeometry() {

        const left = Scene.geometry.leftIdentity;

        const right = Scene.geometry.rightIdentity;

        this.drawCircle(left);

        this.drawCircle(right);

    }

    drawCircle(data) {

        this.ctx.beginPath();

        this.ctx.arc(

            data.x * this.width,

            data.y * this.height,

            data.radius,

            0,

            Math.PI*2

        );

        this.ctx.strokeStyle = Scene.colors.blue;

        this.ctx.lineWidth = 2;

        this.ctx.stroke();

    }

    drawPregnancyJewel() {

        const jewel = Scene.pregnancyHarmonic;

        const x = jewel.x * this.width;

        const y = jewel.y * this.height;

        this.ctx.beginPath();

        this.ctx.moveTo(x, y-90);

        this.ctx.lineTo(x+55,y);

        this.ctx.lineTo(x,y+90);

        this.ctx.lineTo(x-55,y);

        this.ctx.closePath();

        this.ctx.strokeStyle = Scene.colors.gold;

        this.ctx.lineWidth = 2;

        this.ctx.stroke();

    }

}