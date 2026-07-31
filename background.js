/**
 * ============================================================
 * SIGIL1 Background Renderer
 * Version 1.0
 * ============================================================
 */

export class Background {

    static draw(ctx, width, height) {

        // Space Gradient
        const gradient = ctx.createRadialGradient(
            width / 2,
            height / 2,
            100,
            width / 2,
            height / 2,
            width
        );

        gradient.addColorStop(0, "#0B1224");
        gradient.addColorStop(0.35, "#08111F");
        gradient.addColorStop(0.70, "#050814");
        gradient.addColorStop(1.00, "#020307");

        ctx.fillStyle = gradient;
        ctx.fillRect(0, 0, width, height);

        this.drawStars(ctx, width, height);

    }

    static drawStars(ctx, width, height) {

        ctx.save();

        ctx.fillStyle = "rgba(255,255,255,.8)";

        for (let i = 0; i < 350; i++) {

            const x = (Math.sin(i * 83.91) * 100000 % width + width) % width;
            const y = (Math.cos(i * 27.37) * 100000 % height + height) % height;

            const r = (i % 3) + 0.5;

            ctx.beginPath();
            ctx.arc(x, y, r, 0, Math.PI * 2);
            ctx.fill();
        }

        ctx.restore();

    }

}