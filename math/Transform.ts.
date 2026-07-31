/**
 * Transform.ts
 *
 * Pure mathematics.
 * No engine logic.
 * No renderer logic.
 * No Three.js.
 * No DOM.
 * No browser APIs.
 *
 * Immutable Transform. Every operation returns a new
 * instance; the original is never mutated.
 *
 * position: Vector3
 * rotation: Quaternion
 * scale:    Vector3
 *
 * toMatrix() composes Translation * Rotation * Scale (TRS),
 * matching Matrix4's composition convention: scale is
 * applied first, then rotation, then translation.
 *
 * Independent of every other engine subsystem except
 * Vector.ts, Quaternion.ts, and Matrix.ts.
 */

import { Vector3 } from "./Vector";
import { Quaternion } from "./Quaternion";
import { Matrix4 } from "./Matrix";

export class Transform {

    readonly position: Vector3;
    readonly rotation: Quaternion;
    readonly scale: Vector3;

    constructor(
        position: Vector3 = Vector3.zero(),
        rotation: Quaternion = Quaternion.identity(),
        scale: Vector3 = Vector3.one()
    ) {

        this.position = position;
        this.rotation = rotation;
        this.scale = scale;

    }

    /* ---------- Copy ---------- */

    clone(): Transform {

        return new Transform(this.position, this.rotation, this.scale);

    }

    /* ---------- With-ers ---------- */

    withPosition(position: Vector3): Transform {

        return new Transform(position, this.rotation, this.scale);

    }

    withRotation(rotation: Quaternion): Transform {

        return new Transform(this.position, rotation, this.scale);

    }

    withScale(scale: Vector3): Transform {

        return new Transform(this.position, this.rotation, scale);

    }

    /* ---------- Matrix Composition ---------- */

    /**
     * Composes Translation * Rotation * Scale into a single
     * Matrix4. Following Matrix4's composition convention
     * (A.multiply(B) applies B first), this means a point is
     * scaled, then rotated, then translated — standard TRS.
     */
    toMatrix(): Matrix4 {

        const t = Matrix4.translation(
            this.position.x,
            this.position.y,
            this.position.z
        );

        const r = Transform.rotationMatrixFromQuaternion(this.rotation);

        const s = Matrix4.scaling(
            this.scale.x,
            this.scale.y,
            this.scale.z
        );

        return t.multiply(r).multiply(s);

    }

    /**
     * Builds a Matrix4 from a unit quaternion. Kept private
     * to this file: Quaternion.ts stays independent of
     * Matrix.ts, so the conversion lives on the one file
     * that is allowed to import both.
     */
    private static rotationMatrixFromQuaternion(q: Quaternion): Matrix4 {

        const { x, y, z, w } = q;

        const xx = x * x, yy = y * y, zz = z * z;
        const xy = x * y, xz = x * z, yz = y * z;
        const wx = w * x, wy = w * y, wz = w * z;

        return new Matrix4([
            1 - 2 * (yy + zz),     2 * (xy - wz),     2 * (xz + wy), 0,
                2 * (xy + wz), 1 - 2 * (xx + zz),     2 * (yz - wx), 0,
                2 * (xz - wy),     2 * (yz + wx), 1 - 2 * (xx + yy), 0,
                            0,                 0,                 0, 1
        ]);

    }

    /* ---------- Comparison ---------- */

    /**
     * Compares position, rotation, and scale component-wise
     * within a small tolerance. Note: a quaternion q and its
     * negation -q represent the identical rotation (the
     * double-cover property of quaternions), but this method
     * compares components directly and will report them as
     * unequal. Normalize/canonicalize sign before comparing
     * if that distinction matters for a given use case.
     */
    equals(t: Transform, epsilon: number = 1e-10): boolean {

        return (
            this.position.equals(t.position, epsilon) &&
            Math.abs(this.rotation.x - t.rotation.x) <= epsilon &&
            Math.abs(this.rotation.y - t.rotation.y) <= epsilon &&
            Math.abs(this.rotation.z - t.rotation.z) <= epsilon &&
            Math.abs(this.rotation.w - t.rotation.w) <= epsilon &&
            this.scale.equals(t.scale, epsilon)
        );

    }

    /* ---------- Static Constructors ---------- */

    static identity(): Transform {

        return new Transform(
            Vector3.zero(),
            Quaternion.identity(),
            Vector3.one()
        );

    }

}
