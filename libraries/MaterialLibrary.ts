// MaterialLibrary.ts
/**
 * MaterialLibrary.ts
 *
 * Data library only.
 * No classes.
 * No functions.
 * No calculations.
 * No engine logic.
 * No renderer logic.
 * No shaders. No textures. No animation. No Three.js types.
 * No user customization.
 *
 * Every export is Object.freeze()'d. Values are hardcoded
 * literals — nothing here is derived or computed.
 *
 * Note on RendererTypes.ts: its Material interface uses the
 * field names (color, glow) rather than the (baseColor,
 * emissiveColor, transparent) shape required here, so this
 * file does not import or implement that interface — it
 * defines its own local MaterialDefinition shape instead.
 * See the flag at the bottom of this file.
 */

interface MaterialDefinition {

    readonly id: string;

    readonly name: string;

    readonly baseColor: string;

    readonly opacity: number;

    readonly emissiveColor: string;

    readonly emissiveIntensity: number;

    readonly transparent: boolean;

}

/* ---------- Source ---------- */

export const SOURCE_MATERIAL: MaterialDefinition = Object.freeze({
    id: "source",
    name: "Source",
    baseColor: "#FFE9B0",
    opacity: 1,
    emissiveColor: "#FFD700",
    emissiveIntensity: 0.9,
    transparent: false
});

/* ---------- Axis ---------- */

export const AXIS_MATERIAL: MaterialDefinition = Object.freeze({
    id: "axis",
    name: "Axis",
    baseColor: "#E9C46A",
    opacity: 0.8,
    emissiveColor: "#E9C46A",
    emissiveIntensity: 0.5,
    transparent: true
});

/* ---------- Structural Ring ---------- */

export const STRUCTURAL_RING_MATERIAL: MaterialDefinition = Object.freeze({
    id: "structural-ring",
    name: "Structural Ring",
    baseColor: "#E9C46A",
    opacity: 0.5,
    emissiveColor: "#E9C46A",
    emissiveIntensity: 0.3,
    transparent: true
});

/* ---------- Harmonic Ring ---------- */

export const HARMONIC_RING_MATERIAL: MaterialDefinition = Object.freeze({
    id: "harmonic-ring",
    name: "Harmonic Ring",
    baseColor: "#F5D76E",
    opacity: 0.55,
    emissiveColor: "#FFE066",
    emissiveIntensity: 0.4,
    transparent: true
});

/* ---------- Cloud ---------- */

export const CLOUD_MATERIAL: MaterialDefinition = Object.freeze({
    id: "cloud",
    name: "Cloud",
    baseColor: "#F0F8FF",
    opacity: 0.2,
    emissiveColor: "#D8F6FF",
    emissiveIntensity: 0.1,
    transparent: true
});

/* ---------- Star ---------- */

export const STAR_MATERIAL: MaterialDefinition = Object.freeze({
    id: "star",
    name: "Star",
    baseColor: "#FFFFFF",
    opacity: 1,
    emissiveColor: "#FFFFFF",
    emissiveIntensity: 0.8,
    transparent: false
});

/* ---------- Parallel Universe ---------- */

export const PARALLEL_UNIVERSE_MATERIAL: MaterialDefinition = Object.freeze({
    id: "parallel-universe",
    name: "Parallel Universe",
    baseColor: "#C9A6FF",
    opacity: 0.6,
    emissiveColor: "#B47DFF",
    emissiveIntensity: 0.5,
    transparent: true
});

/* ---------- Sigil ---------- */

export const SIGIL_MATERIAL: MaterialDefinition = Object.freeze({
    id: "sigil",
    name: "Sigil",
    baseColor: "#E9C46A",
    opacity: 0.7,
    emissiveColor: "#FFE066",
    emissiveIntensity: 0.45,
    transparent: true
});

/* ---------- Crystal ---------- */

export const CRYSTAL_MATERIAL: MaterialDefinition = Object.freeze({
    id: "crystal",
    name: "Crystal",
    baseColor: "#D8F6FF",
    opacity: 0.85,
    emissiveColor: "#7EC8FF",
    emissiveIntensity: 0.35,
    transparent: true
});

/* ---------- Gold ---------- */

export const GOLD_MATERIAL: MaterialDefinition = Object.freeze({
    id: "gold",
    name: "Gold",
    baseColor: "#D4AF37",
    opacity: 1,
    emissiveColor: "#F5D76E",
    emissiveIntensity: 0.25,
    transparent: false
});

/* ---------- Diamond ---------- */

export const DIAMOND_MATERIAL: MaterialDefinition = Object.freeze({
    id: "diamond",
    name: "Diamond",
    baseColor: "#FFFFFF",
    opacity: 0.9,
    emissiveColor: "#D8F6FF",
    emissiveIntensity: 0.2,
    transparent: true
});

/* ---------- Glass ---------- */

export const GLASS_MATERIAL: MaterialDefinition = Object.freeze({
    id: "glass",
    name: "Glass",
    baseColor: "#E0E0E8",
    opacity: 0.15,
    emissiveColor: "#FFFFFF",
    emissiveIntensity: 0,
    transparent: true
});

/* ---------- Collection ---------- */

export const MATERIALS: Readonly<Record<string, MaterialDefinition>> = Object.freeze({
    SOURCE: SOURCE_MATERIAL,
    AXIS: AXIS_MATERIAL,
    STRUCTURAL_RING: STRUCTURAL_RING_MATERIAL,
    HARMONIC_RING: HARMONIC_RING_MATERIAL,
    CLOUD: CLOUD_MATERIAL,
    STAR: STAR_MATERIAL,
    PARALLEL_UNIVERSE: PARALLEL_UNIVERSE_MATERIAL,
    SIGIL: SIGIL_MATERIAL,
    CRYSTAL: CRYSTAL_MATERIAL,
    GOLD: GOLD_MATERIAL,
    DIAMOND: DIAMOND_MATERIAL,
    GLASS: GLASS_MATERIAL
});
