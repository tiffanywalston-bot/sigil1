/**
 * ============================================================
 * SIGIL1 Sacred Geometry
 * Version 1.0
 * ============================================================
 */

export class SacredGeometry {

    static drawFlowerOfLife(ctx, x, y, radius = 45) {

        ctx.save();

        ctx.strokeStyle = "#E9C46A";
        ctx.lineWidth = 1;
        ctx.globalAlpha = 0.45;

        const circles = [
            [0,0],
            [1,0],
            [-1,0],
            [0.5,0.866],
            [-0.5,0.866],
            [0.5,-0.866],
            [-0.5,-0.866]
        ];

        circles.forEach(([cx,cy])=>{

            ctx.beginPath();

            ctx.arc(
                x + cx * radius,
                y + cy * radius,
                radius,
                0,
                Math.PI*2
            );

            ctx.stroke();

        });

        ctx.restore();

    }

    static drawCenterNode(ctx,x,y){

        ctx.save();

        ctx.beginPath();

        ctx.arc(
            x,
            y,
            6,
            0,
            Math.PI*2
        );

        ctx.fillStyle="#FFFFFF";
        ctx.fill();

        ctx.restore();

    }

    static drawConnectionLines(ctx,x,y,radius=45){

        ctx.save();

        ctx.strokeStyle="#FFD56A";
        ctx.globalAlpha=.35;

        const pts=[];

        for(let i=0;i<6;i++){

            const a=(Math.PI/3)*i;

            pts.push({

                x:x+Math.cos(a)*radius,

                y:y+Math.sin(a)*radius

            });

        }

        pts.forEach(p=>{

            ctx.beginPath();

            ctx.moveTo(x,y);

            ctx.lineTo(p.x,p.y);

            ctx.stroke();

        });

        ctx.restore();

    }

}