/**
 * GeometryMath.ts
 *
 * Pure mathematics.
 * No engine logic.
 * No renderer logic.
 * No Three.js.
 * No DOM.
 * No browser APIs.
 *
 * Static utility class only — GeometryMath is never
 * instantiated. Every method is a deterministic pure
 * function operating on Vector3 values. No geometry
 * creation, no rendering, no mesh/scene concepts.
 *
 * Independent of every other engine subsystem except
 * Vector.ts. (Matrix.ts and Quaternion.ts are not needed by
 * any of the operations below, so neither is imported —
 * nothing here transforms a vector by a matrix or rotates it
 * by a quaternion.)
 */

import { Vector3 } from "./Vector";

const EPSILON = 1e-10;

function assertNonZeroLength(v: Vector3, label: string): void {

    if (v.length() < EPSILON) {
        throw new Error(`GeometryMath: ${label} must not be a zero-length vector.`);
    }

}

function assertNonEmpty<T>(points: T[], label: string): void {

    if (points.length === 0) {
        throw new Error(`GeometryMath: ${label} must not be empty.`);
    }

}

export interface Plane {

    readonly normal: Vector3;

    readonly d: number;

}

export interface BoundingBox {

    readonly min: Vector3;

    readonly max: Vector3;

}

export interface BoundingSphere {

    readonly center: Vector3;

    readonly radius: number;

}

export class GeometryMath {

    private constructor() {

        // Static utility class only — never instantiated.

    }

    /* ---------- Distance ---------- */

    static distance(a: Vector3, b: Vector3): number {

        return a.distanceTo(b);

    }

    /* ---------- Midpoint ---------- */

    static midpoint(a: Vector3, b: Vector3): Vector3 {

        return a.add(b).multiplyScalar(0.5);

    }

    /* ---------- Linear Interpolation ---------- */

    static lerp(a: Vector3, b: Vector3, t: number): Vector3 {

        return a.add(b.subtract(a).multiplyScalar(t));

    }

    /* ---------- Angle Between ---------- */

    static angleBetween(a: Vector3, b: Vector3): number {

        assertNonZeroLength(a, "a");
        assertNonZeroLength(b, "b");

        const cos = a.dot(b) / (a.length() * b.length());

        const clamped = Math.min(1, Math.max(-1, cos));

        return Math.acos(clamped);

    }

    /* ---------- Projection ---------- */

    static project(a: Vector3, onto: Vector3): Vector3 {

        assertNonZeroLength(onto, "onto");

        const scale = a.dot(onto) / onto.dot(onto);

        return onto.multiplyScalar(scale);

    }

    /* ---------- Reflection ---------- */

    static reflect(v: Vector3, normal: Vector3): Vector3 {

        assertNonZeroLength(normal, "normal");

        const n = normal.normalize();

        return v.subtract(n.multiplyScalar(2 * v.dot(n)));

    }

    /* ---------- Triangle Normal ---------- */

    static triangleNormal(a: Vector3, b: Vector3, c: Vector3): Vector3 {

        const cross = b.subtract(a).cross(c.subtract(a));

        assertNonZeroLength(cross, "triangle (a, b, c) — points must not be collinear");

        return cross.normalize();

    }

    /* ---------- Triangle Area ---------- */

    static triangleArea(a: Vector3, b: Vector3, c: Vector3): number {

        return 0.5 * b.subtract(a).cross(c.subtract(a)).length();

    }

    /* ---------- Plane Equation ---------- */

    static planeEquation(a: Vector3, b: Vector3, c: Vector3): Plane {

        const normal = GeometryMath.triangleNormal(a, b, c);

        return { normal, d: -normal.dot(a) };

    }

    /* ---------- Centroid ---------- */

    static centroid(points: Vector3[]): Vector3 {

        assertNonEmpty(points, "points");

        let sum = Vector3.zero();

        for (const p of points) {
            sum = sum.add(p);
        }

        return sum.multiplyScalar(1 / points.length);

    }

    /* ---------- Bounding Box ---------- */

    static boundingBox(points: Vector3[]): BoundingBox {

        assertNonEmpty(points, "points");

        let minX = points[0].x, minY = points[0].y, minZ = points[0].z;
        let maxX = points[0].x, maxY = points[0].y, maxZ = points[0].z;

        for (const p of points) {

            if (p.x < minX) minX = p.x;
            if (p.y < minY) minY = p.y;
            if (p.z < minZ) minZ = p.z;

            if (p.x > maxX) maxX = p.x;
            if (p.y > maxY) maxY = p.y;
            if (p.z > maxZ) maxZ = p.z;

        }

        return {
            min: new Vector3(minX, minY, minZ),
            max: new Vector3(maxX, maxY, maxZ)
        };

    }

    /* ---------- Bounding Sphere ---------- */

    static boundingSphere(points: Vector3[]): BoundingSphere {

        assertNonEmpty(points, "points");

        const box = GeometryMath.boundingBox(points);
        const center = GeometryMath.midpoint(box.min, box.max);

        let radius = 0;

        for (const p of points) {

            const d = center.distanceTo(p);

            if (d > radius) radius = d;

        }

        return { center, radius };

    }

}
