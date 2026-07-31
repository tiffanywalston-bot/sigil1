/**
 * ============================================================
 * SIGIL1 Geometry Library
 * Version 1.0
 * ============================================================
 */

export class Geometry {

    static drawCircle(ctx, x, y, radius, color = "#E9C46A", width = 2) {

        ctx.beginPath();
        ctx.arc(x, y, radius, 0, Math.PI * 2);
        ctx.strokeStyle = color;
        ctx.lineWidth = width;
        ctx.stroke();

    }

    static drawFilledCircle(ctx, x, y, radius, color = "#E9C46A") {

        ctx.beginPath();
        ctx.arc(x, y, radius, 0, Math.PI * 2);
        ctx.fillStyle = color;
        ctx.fill();

    }

    static drawAxis(ctx, x, top, bottom, color = "#E9C46A") {

        ctx.beginPath();
        ctx.moveTo(x, top);
        ctx.lineTo(x, bottom);

        ctx.strokeStyle = color;
        ctx.lineWidth = 2;
        ctx.stroke();

    }

    static drawDiamond(ctx, x, y, width, height, color="#E9C46A") {

        ctx.beginPath();

        ctx.moveTo(x, y - height / 2);
        ctx.lineTo(x + width / 2, y);
        ctx.lineTo(x, y + height / 2);
        ctx.lineTo(x - width / 2, y);

        ctx.closePath();

        ctx.strokeStyle = color;
        ctx.lineWidth = 2;
        ctx.stroke();

    }

    static drawRing(ctx, x, y, radius, color="#E9C46A") {

        this.drawCircle(ctx, x, y, radius, color, 1);

    }

    static drawGlow(ctx, x, y, radius, color="#E9C46A") {

        ctx.save();

        ctx.shadowBlur = 35;
        ctx.shadowColor = color;

        this.drawFilledCircle(ctx, x, y, radius, color);

        ctx.restore();

    }

}