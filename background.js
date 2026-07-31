/**
 * ============================================================
 * SIGIL1 Background System
 * Version 2.0
 * ============================================================
 */

export class Background {

    static draw(ctx, width, height) {

        this.drawSpace(ctx, width, height);
        this.drawNebula(ctx, width, height);
        this.drawStars(ctx, width, height);

    }

    static drawSpace(ctx, width, height) {

        const gradient = ctx.createRadialGradient(
            width / 2,
            height / 2,
            width * 0.05,
            width / 2,
            height / 2,
            width * 0.8
        );

        gradient.addColorStop(0, "#121a30");
        gradient.addColorStop(0.30, "#0b1224");
        gradient.addColorStop(0.65, "#060b16");
        gradient.addColorStop(1, "#010204");

        ctx.fillStyle = gradient;
        ctx.fillRect(0, 0, width, height);

    }

    static drawNebula(ctx, width, height) {

        ctx.save();

        ctx.globalAlpha = 0.12;

        for (let i = 0; i < 8; i++) {

            const x = width * (0.15 + i * 0.1);
            const y = height * (0.2 + (i % 2) * 0.1);

            const radius = 180 + i * 35;

            const glow = ctx.createRadialGradient(
                x,
                y,
                0,
                x,
                y,
                radius
            );

            glow.addColorStop(0, "#4e79ff");
            glow.addColorStop(.5, "#402060");
            glow.addColorStop(1, "transparent");

            ctx.fillStyle = glow;

            ctx.beginPath();
            ctx.arc(x, y, radius, 0, Math.PI * 2);
            ctx.fill();

        }

        ctx.restore();

    }

    static drawStars(ctx, width, height) {

        ctx.save();

        for (let i = 0; i < 500; i++) {

            const x = ((Math.sin(i * 2345.21) + 1) / 2) * width;
            const y = ((Math.cos(i * 984.44) + 1) / 2) * height;

            const r = (i % 4) + 0.5;

            ctx.beginPath();

            ctx.arc(
                x,
                y,
                r,
                0,
                Math.PI * 2
            );

            ctx.fillStyle = "rgba(255,255,255,.85)";
            ctx.fill();

        }

        ctx.restore();

    }

}