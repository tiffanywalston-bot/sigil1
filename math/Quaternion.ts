/**
 * Quaternion.ts
 *
 * Pure mathematics.
 * No engine logic.
 * No renderer logic.
 * No Three.js.
 * No DOM.
 * No browser APIs.
 *
 * Immutable Quaternion. Every operation returns a new
 * instance; the original is never mutated.
 *
 * Convention: (x, y, z) is the vector part, w is the scalar
 * part — q = w + xi + yj + zk.
 *
 * Multiplication follows the same composition rule as
 * Matrix4: A.multiply(B) applies B's rotation first, then A's
 * — i.e. A.multiply(B).rotateVector(v) === A.rotateVector(B.rotateVector(v)).
 *
 * Rotation direction follows the right-hand rule about the
 * given axis, matching Matrix4.rotationX/Y/Z.
 *
 * Independent of every other engine subsystem except Vector.ts.
 */

import { Vector3 } from "./Vector";

const EPSILON = 1e-10;

export class Quaternion {

    readonly x: number;
    readonly y: number;
    readonly z: number;
    readonly w: number;

    constructor(x: number = 0, y: number = 0, z: number = 0, w: number = 1) {

        this.x = x;
        this.y = y;
        this.z = z;
        this.w = w;

    }

    /* ---------- Copy ---------- */

    clone(): Quaternion {

        return new Quaternion(this.x, this.y, this.z, this.w);

    }

    /* ---------- Magnitude ---------- */

    length(): number {

        return Math.sqrt(
            this.x * this.x +
            this.y * this.y +
            this.z * this.z +
            this.w * this.w
        );

    }

    /**
     * Returns a unit-length quaternion in the same
     * orientation. A zero-length quaternion normalizes to
     * the identity quaternion rather than producing NaN
     * components.
     */
    normalize(): Quaternion {

        const len = this.length();

        if (len === 0) {
            return Quaternion.identity();
        }

        return new Quaternion(
            this.x / len,
            this.y / len,
            this.z / len,
            this.w / len
        );

    }

    /* ---------- Products ---------- */

    dot(q: Quaternion): number {

        return (
            this.x * q.x +
            this.y * q.y +
            this.z * q.z +
            this.w * q.w
        );

    }

    /**
     * Hamilton product. See the file-level note on
     * composition order: this.multiply(q) applies q first,
     * then this.
     */
    multiply(q: Quaternion): Quaternion {

        return new Quaternion(
            this.w * q.x + this.x * q.w + this.y * q.z - this.z * q.y,
            this.w * q.y - this.x * q.z + this.y * q.w + this.z * q.x,
            this.w * q.z + this.x * q.y - this.y * q.x + this.z * q.w,
            this.w * q.w - this.x * q.x - this.y * q.y - this.z * q.z
        );

    }

    /**
     * Negates the vector part. For a unit quaternion this is
     * equal to the inverse; for a non-unit quaternion it is
     * not — use inverse() when the quaternion may not be
     * normalized.
     */
    conjugate(): Quaternion {

        return new Quaternion(-this.x, -this.y, -this.z, this.w);

    }

    /**
     * True multiplicative inverse: conjugate scaled by
     * 1 / lengthSquared. Throws on a zero-length quaternion,
     * which has no inverse.
     */
    inverse(): Quaternion {

        const lenSq = this.x * this.x + this.y * this.y + this.z * this.z + this.w * this.w;

        if (lenSq < EPSILON) {
            throw new Error("Quaternion.inverse: zero-length quaternion has no inverse.");
        }

        const invLenSq = 1 / lenSq;

        return new Quaternion(
            -this.x * invLenSq,
            -this.y * invLenSq,
            -this.z * invLenSq,
             this.w * invLenSq
        );

    }

    /* ---------- Vector Rotation ---------- */

    /**
     * Rotates v by this quaternion using the optimized
     * q * v * q^-1 expansion (no intermediate quaternion
     * multiplications). Assumes this quaternion is unit
     * length; normalize() first if that is not guaranteed.
     */
    rotateVector(v: Vector3): Vector3 {

        const qx = this.x, qy = this.y, qz = this.z, qw = this.w;
        const vx = v.x, vy = v.y, vz = v.z;

        const tx = 2 * (qy * vz - qz * vy);
        const ty = 2 * (qz * vx - qx * vz);
        const tz = 2 * (qx * vy - qy * vx);

        const rx = vx + qw * tx + (qy * tz - qz * ty);
        const ry = vy + qw * ty + (qz * tx - qx * tz);
        const rz = vz + qw * tz + (qx * ty - qy * tx);

        return new Vector3(rx, ry, rz);

    }

    /* ---------- Conversion ---------- */

    toArray(): [number, number, number, number] {

        return [this.x, this.y, this.z, this.w];

    }

    /* ---------- Static Constructors ---------- */

    static identity(): Quaternion {

        return new Quaternion(0, 0, 0, 1);

    }

    /**
     * Builds a unit quaternion representing a right-handed
     * rotation of `radians` about `axis`. Throws if axis is
     * zero-length (no rotation axis to rotate about).
     */
    static fromAxisAngle(axis: Vector3, radians: number): Quaternion {

        const axisLength = axis.length();

        if (axisLength < EPSILON) {
            throw new Error("Quaternion.fromAxisAngle: axis must be non-zero.");
        }

        const normalizedAxis = axis.normalize();
        const half = radians / 2;
        const s = Math.sin(half);

        return new Quaternion(
            normalizedAxis.x * s,
            normalizedAxis.y * s,
            normalizedAxis.z * s,
            Math.cos(half)
        );

    }

    /**
     * Builds a quaternion from Euler angles (radians),
     * applied intrinsically in X, then Y, then Z order —
     * i.e. equivalent to
     * Quaternion.fromAxisAngle(Z_AXIS, z)
     *   .multiply(Quaternion.fromAxisAngle(Y_AXIS, y))
     *   .multiply(Quaternion.fromAxisAngle(X_AXIS, x))
     * This matches Matrix4's per-axis rotation handedness.
     */
    static fromEuler(x: number, y: number, z: number): Quaternion {

        const qx = Quaternion.fromAxisAngle(new Vector3(1, 0, 0), x);
        const qy = Quaternion.fromAxisAngle(new Vector3(0, 1, 0), y);
        const qz = Quaternion.fromAxisAngle(new Vector3(0, 0, 1), z);

        return qz.multiply(qy).multiply(qx);

    }

}
