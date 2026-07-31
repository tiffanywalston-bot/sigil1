/**
 * Matrix.ts
 *
 * Pure mathematics.
 * No engine logic.
 * No renderer logic.
 * No Three.js.
 * No DOM.
 * No browser APIs.
 *
 * Immutable Matrix4. Every operation returns a new instance;
 * the original is never mutated.
 *
 * Storage: row-major, flattened to a 16-element array.
 * Element (row, col) lives at index [row * 4 + col].
 *
 * Multiplication convention: A.multiply(B) produces a matrix
 * equivalent to applying B first, then A — i.e.
 * A.multiply(B).transformVector(v) === A.transformVector(B.transformVector(v)).
 * This matches standard "transform = parent * child" composition.
 *
 * Independent of every other engine subsystem except Vector.ts.
 */

import { Vector3 } from "./Vector";

const EPSILON = 1e-10;

export class Matrix4 {

    readonly elements: readonly number[];

    constructor(elements?: readonly number[]) {

        if (elements) {

            if (elements.length !== 16) {
                throw new Error("Matrix4: elements must contain exactly 16 values.");
            }

            this.elements = elements.slice();

        } else {

            this.elements = Matrix4.identityElements();

        }

    }

    /* ---------- Element Access ---------- */

    private get(row: number, col: number): number {

        return this.elements[row * 4 + col];

    }

    /* ---------- Copy ---------- */

    clone(): Matrix4 {

        return new Matrix4(this.elements);

    }

    /**
     * Returns a fresh identity matrix. Does not depend on
     * (or preserve) the current instance's values.
     */
    identity(): Matrix4 {

        return Matrix4.identity();

    }

    /* ---------- Composition ---------- */

    multiply(m: Matrix4): Matrix4 {

        const a = this.elements;
        const b = m.elements;
        const out = new Array<number>(16).fill(0);

        for (let row = 0; row < 4; row++) {

            for (let col = 0; col < 4; col++) {

                let sum = 0;

                for (let k = 0; k < 4; k++) {
                    sum += a[row * 4 + k] * b[k * 4 + col];
                }

                out[row * 4 + col] = sum;

            }

        }

        return new Matrix4(out);

    }

    transpose(): Matrix4 {

        const a = this.elements;
        const out = new Array<number>(16);

        for (let row = 0; row < 4; row++) {

            for (let col = 0; col < 4; col++) {
                out[col * 4 + row] = a[row * 4 + col];
            }

        }

        return new Matrix4(out);

    }

    /* ---------- Determinant ---------- */

    determinant(): number {

        const m = this.elements;

        const m00 = m[0],  m01 = m[1],  m02 = m[2],  m03 = m[3];
        const m10 = m[4],  m11 = m[5],  m12 = m[6],  m13 = m[7];
        const m20 = m[8],  m21 = m[9],  m22 = m[10], m23 = m[11];
        const m30 = m[12], m31 = m[13], m32 = m[14], m33 = m[15];

        return (
            m03 * m12 * m21 * m30 - m02 * m13 * m21 * m30 -
            m03 * m11 * m22 * m30 + m01 * m13 * m22 * m30 +
            m02 * m11 * m23 * m30 - m01 * m12 * m23 * m30 -
            m03 * m12 * m20 * m31 + m02 * m13 * m20 * m31 +
            m03 * m10 * m22 * m31 - m00 * m13 * m22 * m31 -
            m02 * m10 * m23 * m31 + m00 * m12 * m23 * m31 +
            m03 * m11 * m20 * m32 - m01 * m13 * m20 * m32 -
            m03 * m10 * m21 * m32 + m00 * m13 * m21 * m32 +
            m01 * m10 * m23 * m32 - m00 * m11 * m23 * m32 -
            m02 * m11 * m20 * m33 + m01 * m12 * m20 * m33 +
            m02 * m10 * m21 * m33 - m00 * m12 * m21 * m33 -
            m01 * m10 * m22 * m33 + m00 * m11 * m22 * m33
        );

    }

    /* ---------- Inverse ---------- */

    /**
     * Full 4x4 inverse via the adjugate matrix.
     * Throws if the matrix is non-invertible (determinant
     * within EPSILON of zero) rather than returning a
     * matrix full of Infinity/NaN.
     */
    inverse(): Matrix4 {

        const m = this.elements;
        const det = this.determinant();

        if (Math.abs(det) < EPSILON) {
            throw new Error("Matrix4.inverse: matrix is not invertible (determinant ~ 0).");
        }

        const m00 = m[0],  m01 = m[1],  m02 = m[2],  m03 = m[3];
        const m10 = m[4],  m11 = m[5],  m12 = m[6],  m13 = m[7];
        const m20 = m[8],  m21 = m[9],  m22 = m[10], m23 = m[11];
        const m30 = m[12], m31 = m[13], m32 = m[14], m33 = m[15];

        const A2323 = m22 * m33 - m23 * m32;
        const A1323 = m21 * m33 - m23 * m31;
        const A1223 = m21 * m32 - m22 * m31;
        const A0323 = m20 * m33 - m23 * m30;
        const A0223 = m20 * m32 - m22 * m30;
        const A0123 = m20 * m31 - m21 * m30;
        const A2313 = m12 * m33 - m13 * m32;
        const A1313 = m11 * m33 - m13 * m31;
        const A1213 = m11 * m32 - m12 * m31;
        const A2312 = m12 * m23 - m13 * m22;
        const A1312 = m11 * m23 - m13 * m21;
        const A1212 = m11 * m22 - m12 * m21;
        const A0313 = m10 * m33 - m13 * m30;
        const A0213 = m10 * m32 - m12 * m30;
        const A0312 = m10 * m23 - m13 * m20;
        const A0212 = m10 * m22 - m12 * m20;
        const A0113 = m10 * m31 - m11 * m30;
        const A0112 = m10 * m21 - m11 * m20;

        const invDet = 1 / det;

        const out = new Array<number>(16);

        out[0]  = invDet *  (m11 * A2323 - m12 * A1323 + m13 * A1223);
        out[1]  = invDet * -(m01 * A2323 - m02 * A1323 + m03 * A1223);
        out[2]  = invDet *  (m01 * A2313 - m02 * A1313 + m03 * A1213);
        out[3]  = invDet * -(m01 * A2312 - m02 * A1312 + m03 * A1212);

        out[4]  = invDet * -(m10 * A2323 - m12 * A0323 + m13 * A0223);
        out[5]  = invDet *  (m00 * A2323 - m02 * A0323 + m03 * A0223);
        out[6]  = invDet * -(m00 * A2313 - m02 * A0313 + m03 * A0213);
        out[7]  = invDet *  (m00 * A2312 - m02 * A0312 + m03 * A0212);

        out[8]  = invDet *  (m10 * A1323 - m11 * A0323 + m13 * A0123);
        out[9]  = invDet * -(m00 * A1323 - m01 * A0323 + m03 * A0123);
        out[10] = invDet *  (m00 * A1313 - m01 * A0313 + m03 * A0113);
        out[11] = invDet * -(m00 * A1312 - m01 * A0312 + m03 * A0112);

        out[12] = invDet * -(m10 * A1223 - m11 * A0223 + m12 * A0123);
        out[13] = invDet *  (m00 * A1223 - m01 * A0223 + m02 * A0123);
        out[14] = invDet * -(m00 * A1213 - m01 * A0213 + m02 * A0113);
        out[15] = invDet *  (m00 * A1212 - m01 * A0212 + m02 * A0112);

        return new Matrix4(out);

    }

    /* ---------- Vector Transformation ---------- */

    /**
     * Transforms a point (implicit w = 1). If the resulting
     * homogeneous w is neither 0 nor 1 (i.e. a projective
     * matrix was applied), the result is perspective-divided
     * before being returned as a Vector3.
     */
    transformVector(v: Vector3): Vector3 {

        const m = this.elements;

        const x = m[0] * v.x + m[1] * v.y + m[2] * v.z + m[3];
        const y = m[4] * v.x + m[5] * v.y + m[6] * v.z + m[7];
        const z = m[8] * v.x + m[9] * v.y + m[10] * v.z + m[11];
        const w = m[12] * v.x + m[13] * v.y + m[14] * v.z + m[15];

        if (w !== 0 && Math.abs(w - 1) > EPSILON) {
            return new Vector3(x / w, y / w, z / w);
        }

        return new Vector3(x, y, z);

    }

    /* ---------- Conversion ---------- */

    toArray(): number[] {

        return this.elements.slice();

    }

    /* ---------- Static Helpers ---------- */

    private static identityElements(): number[] {

        return [
            1, 0, 0, 0,
            0, 1, 0, 0,
            0, 0, 1, 0,
            0, 0, 0, 1
        ];

    }

    /* ---------- Static Constructors ---------- */

    static identity(): Matrix4 {

        return new Matrix4(Matrix4.identityElements());

    }

    static translation(x: number, y: number, z: number): Matrix4 {

        return new Matrix4([
            1, 0, 0, x,
            0, 1, 0, y,
            0, 0, 1, z,
            0, 0, 0, 1
        ]);

    }

    static scaling(x: number, y: number, z: number): Matrix4 {

        return new Matrix4([
            x, 0, 0, 0,
            0, y, 0, 0,
            0, 0, z, 0,
            0, 0, 0, 1
        ]);

    }

    static rotationX(radians: number): Matrix4 {

        const c = Math.cos(radians);
        const s = Math.sin(radians);

        return new Matrix4([
            1, 0,  0, 0,
            0, c, -s, 0,
            0, s,  c, 0,
            0, 0,  0, 1
        ]);

    }

    static rotationY(radians: number): Matrix4 {

        const c = Math.cos(radians);
        const s = Math.sin(radians);

        return new Matrix4([
             c, 0, s, 0,
             0, 1, 0, 0,
            -s, 0, c, 0,
             0, 0, 0, 1
        ]);

    }

    static rotationZ(radians: number): Matrix4 {

        const c = Math.cos(radians);
        const s = Math.sin(radians);

        return new Matrix4([
            c, -s, 0, 0,
            s,  c, 0, 0,
            0,  0, 1, 0,
            0,  0, 0, 1
        ]);

    }

}
