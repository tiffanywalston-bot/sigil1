/**
 * Vector.ts
 *
 * Pure mathematics.
 * No engine logic.
 * No renderer logic.
 * No Three.js.
 * No DOM.
 * No browser APIs.
 *
 * Immutable Vector3. Every operation returns a new instance;
 * the original is never mutated.
 *
 * Used by Geometry, Axis, Parallel Universes, Harmonics,
 * Renderer, and Audio. This file must not import from any
 * of them.
 */

export class Vector3 {

    readonly x: number;
    readonly y: number;
    readonly z: number;

    constructor(x: number = 0, y: number = 0, z: number = 0) {

        this.x = x;
        this.y = y;
        this.z = z;

    }

    /* ---------- Copy ---------- */

    clone(): Vector3 {

        return new Vector3(this.x, this.y, this.z);

    }

    /* ---------- Arithmetic ---------- */

    add(v: Vector3): Vector3 {

        return new Vector3(
            this.x + v.x,
            this.y + v.y,
            this.z + v.z
        );

    }

    subtract(v: Vector3): Vector3 {

        return new Vector3(
            this.x - v.x,
            this.y - v.y,
            this.z - v.z
        );

    }

    multiplyScalar(scalar: number): Vector3 {

        return new Vector3(
            this.x * scalar,
            this.y * scalar,
            this.z * scalar
        );

    }

    divideScalar(scalar: number): Vector3 {

        if (scalar === 0) {
            throw new Error("Vector3.divideScalar: division by zero.");
        }

        return new Vector3(
            this.x / scalar,
            this.y / scalar,
            this.z / scalar
        );

    }

    /* ---------- Products ---------- */

    dot(v: Vector3): number {

        return (
            this.x * v.x +
            this.y * v.y +
            this.z * v.z
        );

    }

    cross(v: Vector3): Vector3 {

        return new Vector3(
            this.y * v.z - this.z * v.y,
            this.z * v.x - this.x * v.z,
            this.x * v.y - this.y * v.x
        );

    }

    /* ---------- Magnitude ---------- */

    length(): number {

        return Math.sqrt(
            this.x * this.x +
            this.y * this.y +
            this.z * this.z
        );

    }

    /**
     * Returns a unit-length vector in the same direction.
     * A zero-length vector normalizes to Vector3.zero()
     * rather than throwing or producing NaN components.
     */
    normalize(): Vector3 {

        const len = this.length();

        if (len === 0) {
            return Vector3.zero();
        }

        return this.divideScalar(len);

    }

    /* ---------- Distance ---------- */

    distanceTo(v: Vector3): number {

        return this.subtract(v).length();

    }

    /* ---------- Comparison ---------- */

    /**
     * Compares components within a small tolerance to guard
     * against floating-point drift. Pass epsilon = 0 for an
     * exact comparison.
     */
    equals(v: Vector3, epsilon: number = 1e-10): boolean {

        return (
            Math.abs(this.x - v.x) <= epsilon &&
            Math.abs(this.y - v.y) <= epsilon &&
            Math.abs(this.z - v.z) <= epsilon
        );

    }

    /* ---------- Conversion ---------- */

    toArray(): [number, number, number] {

        return [this.x, this.y, this.z];

    }

    /* ---------- Static Constructors ---------- */

    static zero(): Vector3 {

        return new Vector3(0, 0, 0);

    }

    static one(): Vector3 {

        return new Vector3(1, 1, 1);

    }

}
