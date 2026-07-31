/**
 * ============================================================
 * SIGIL1 Rings
 * ============================================================
 */

export class Rings {

    static draw(ctx, x, y) {

        this.drawRing(ctx, x, y, 120);
        this.drawRing(ctx, x, y, 180);
        this.drawRing(ctx, x, y, 250);

    }

    static drawRing(ctx, x, y, radius) {

        ctx.save();

        ctx.beginPath();

        ctx.arc(
            x,
            y,
            radius,
            0,
            Math.PI * 2
        );

        ctx.strokeStyle = "#E9C46A";
        ctx.lineWidth = 1.5;

        ctx.shadowBlur = 12;
        ctx.shadowColor = "#E9C46A";

        ctx.stroke();

        ctx.restore();

    }

}