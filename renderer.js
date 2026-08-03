// renderer.js

/**
 * ============================================================
 * SIGIL1 Renderer
 * Version 2.0
 * ============================================================
 *
 * Scope note (repository-verified):
 * engine.js already does `import { Renderer } from "./renderer.js"`,
 * but no renderer.js file existed anywhere in the repository.
 * This file supplies it, preserving that exact existing contract:
 *   new Renderer(canvas)
 *   renderer.render(animation)
 *
 * Draw order below mirrors the repository's own documented
 * canonical order in scene/renderer/RendererDrawOrder.ts:
 *   ["background", "universe-boundary", "clouds", "stars",
 *    "rings", "chains", "nodes", "labels", "effects"]
 * (that file is TypeScript-only and not imported here — no
 * build step exists in this repo to compile it — but its
 * stated order is honored rather than re-invented.)
 *
 * Two DRAW_ORDER entries have no runnable implementation
 * anywhere in this repository and are skipped, not fabricated:
 *   - "universe-boundary" (no universe.js / no compiled
 *     Universe subsystem exists)
 *   - "labels" (no labels.js exists)
 * "stars" has no separate module either — Background.draw()
 * already renders stars internally (see background.js), so it
 * is not invoked a second time.
 *
 * "nodes" is mapped to the two existing node-like modules:
 * Crystals and Jewels. "effects" is mapped to the two existing
 * accent modules: SacredGeometry and Sparkles.
 *
 * Materials and Lighting are instantiated for ownership/
 * lifecycle completeness (the directive lists both as reusable
 * rendering subsystems), but neither is called by any other
 * module in this repository — Crystals/Jewels/Chains already
 * build their own gradients internally with no dependency on
 * either. No draw-time integration is invented for them here;
 * they're exposed on the instance for future wiring once a real
 * consumer exists in the repo.
 *
 * scene.center gap:
 * Clouds, Crystals, Chains, Sparkles, and Jewels all require
 * scene.center = { x, y } inside their initialize(scene)
 * methods, but the only Scene data object in the repository
 * (scene.js) has no `center` property — its coordinates are
 * normalized (0–1) fractions under source/axis/geometry/etc.,
 * not a center point, and nothing in the repo defines how to
 * derive one. The one fact a renderer legitimately owns is its
 * own canvas, so the canvas midpoint is supplied below — canvas
 * ownership plumbing, not invented scene/geometry logic.
 * ============================================================
 */

import { Background } from "./background.js";
import { Clouds } from "./clouds.js";
import { Crystals } from "./crystals.js";
import { Chains } from "./chains.js";
import { Rings } from "./rings.js";
import { SacredGeometry } from "./sacredgeometry.js";
import { Sparkles } from "./sparkles.js";
import { Jewels } from "./jewels.js";
import { Lighting } from "./lighting.js";
import { Materials } from "./materials.js";
import { Scene } from "./scene.js";

export class Renderer {

    constructor(canvas) {

        this.canvas = canvas;

        this.ctx = canvas.getContext("2d");

        if (!this.ctx) {
            throw new Error("Canvas 2D context could not be acquired.");
        }

        // Repository scene metadata (scene.js). Consumed for
        // colors/metadata only; does not supply `center` — see
        // scope note above.
        this.scene = Scene;

        // Visual layer modules — all confirmed runnable, no
        // build step required for any of these.
        this.background = Background;
        this.clouds = new Clouds();
        this.crystals = new Crystals();
        this.chains = new Chains();
        this.rings = Rings;
        this.sacredGeometry = SacredGeometry;
        this.sparkles = new Sparkles();
        this.jewels = new Jewels();

        // Owned for lifecycle completeness; not invoked during
        // draw below — no existing consumer in the repository to
        // model integration on (see scope note above).
        this.lighting = new Lighting();
        this.materials = new Materials();

    }

    /**
     * Canvas ownership: syncs the backing store to the element's
     * displayed size. Plumbing only — no rendering logic.
     */
    resize() {

        const width = this.canvas.clientWidth || this.canvas.width;
        const height = this.canvas.clientHeight || this.canvas.height;

        if (this.canvas.width !== width || this.canvas.height !== height) {
            this.canvas.width = width;
            this.canvas.height = height;
        }

    }

    /**
     * Minimal integration shim filling the scene.center gap
     * described above. Derived only from canvas dimensions —
     * no positions, offsets, or layout are invented here.
     */
    getSceneCenter() {

        return {
            x: this.canvas.width / 2,
            y: this.canvas.height / 2
        };

    }

    /**
     * Per-frame update for the visual modules that carry their
     * own animated state. Sourced from Animation's own delta
     * (set by Animation.update(delta), which Engine already
     * calls before render() runs each frame).
     */
    updateVisuals(delta) {

        this.clouds.update(delta);
        this.crystals.update(delta);
        this.chains.update(delta);
        this.sparkles.update(delta);
        this.jewels.update(delta);
        this.lighting.update();
        this.materials.update();

    }

    /**
     * Deterministic render ordering, mirroring the repository's
     * own canonical DRAW_ORDER from
     * scene/renderer/RendererDrawOrder.ts:
     *   background → universe-boundary (skipped, no module) →
     *   clouds → stars (folded into background) → rings →
     *   chains → nodes (crystals, jewels) →
     *   labels (skipped, no module) →
     *   effects (sacredGeometry, sparkles)
     */
    executeDrawOrder(ctx, width, height, sceneWithCenter, center) {

        // background (stars are drawn internally by this call)
        this.background.draw(ctx, width, height);

        // universe-boundary — skipped: no runnable module exists.

        // clouds
        this.clouds.drawAll(ctx, sceneWithCenter);

        // stars — already drawn as part of background above.

        // rings
        this.rings.draw(ctx, center.x, center.y);

        // chains
        this.chains.drawAll(ctx, sceneWithCenter);

        // nodes
        this.crystals.drawAll(ctx, sceneWithCenter);
        this.jewels.drawAll(ctx, sceneWithCenter);

        // labels — skipped: no runnable module exists.

        // effects
        this.sacredGeometry.drawFlowerOfLife(ctx, center.x, center.y);
        this.sacredGeometry.drawCenterNode(ctx, center.x, center.y);
        this.sacredGeometry.drawConnectionLines(ctx, center.x, center.y);
        this.sparkles.drawAll(ctx, sceneWithCenter);

    }

    /**
     * Frame lifecycle entry point. Preserves the existing
     * engine.js contract: renderer.render(animation).
     */
    render(animation) {

        this.resize();

        const width = this.canvas.width;
        const height = this.canvas.height;
        const ctx = this.ctx;

        const center = this.getSceneCenter();
        const sceneWithCenter = { center };

        const delta = (animation && typeof animation.delta === "number")
            ? animation.delta
            : 0;

        this.updateVisuals(delta);

        this.executeDrawOrder(ctx, width, height, sceneWithCenter, center);

    }

    dispose() {

        // No owned resources beyond the canvas context require
        // explicit teardown; nothing in the repository's visual
        // modules exposes a dispose()/teardown method to call.

    }

}
