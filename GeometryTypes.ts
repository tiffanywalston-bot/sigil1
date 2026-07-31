/**
 * GeometryTypes.ts
 *
 * Shared geometry types for Sigil1.
 * No logic.
 * No classes.
 * Types only.
 */

/* ---------- Basic ---------- */

export interface Vector2 {

    x: number;
    y: number;

}

export interface Vector3 {

    x: number;
    y: number;
    z: number;

}

export interface Rotation {

    x: number;
    y: number;
    z: number;

}

export interface Scale {

    x: number;
    y: number;
    z: number;

}

/* ---------- Transform ---------- */

export interface Transform {

    position: Vector3;

    rotation: Rotation;

    scale: Scale;

}

/* ---------- Bounds ---------- */

export interface Bounds {

    width: number;

    height: number;

    depth: number;

}

/* ---------- Geometry ---------- */

export interface GeometryObject {

    id: string;

    name: string;

    transform: Transform;

    visible: boolean;

}

/* ---------- Axis ---------- */

export interface AxisGeometry {

    start: Vector3;

    end: Vector3;

    length: number;

}

/* ---------- Ring ---------- */

export interface RingGeometry {

    radius: number;

    thickness: number;

    segments: number;

}

/* ---------- Sphere ---------- */

export interface SphereGeometry {

    radius: number;

    segments: number;

}

/* ---------- Cloud ---------- */

export interface CloudGeometry {

    position: Vector3;

    size: number;

    density: number;

}

/* ---------- Star ---------- */

export interface StarGeometry {

    position: Vector3;

    brightness: number;

    size: number;

}