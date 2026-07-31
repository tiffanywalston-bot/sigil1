/**
 * ColorLibrary.ts
 *
 * Data library only.
 * No classes.
 * No functions.
 * No calculations.
 * No engine logic.
 * No renderer logic.
 * No gradients. No shaders. No themes. No user customization.
 *
 * Every export is Object.freeze()'d. hex and rgb are both
 * hardcoded literals describing the same color — rgb is not
 * derived from hex by any code in this file.
 */

interface RGB {

    readonly r: number;

    readonly g: number;

    readonly b: number;

}

interface ColorEntry {

    readonly id: string;

    readonly name: string;

    readonly hex: string;

    readonly rgb: RGB;

}

/* ---------- Source ---------- */

export const SOURCE_COLORS: Readonly<Record<string, ColorEntry>> = Object.freeze({

    PRIMARY: Object.freeze({ id: "source-primary", name: "Source Primary", hex: "#FFE9B0", rgb: Object.freeze({ r: 255, g: 233, b: 176 }) }),
    GLOW:    Object.freeze({ id: "source-glow",    name: "Source Glow",    hex: "#FFD700", rgb: Object.freeze({ r: 255, g: 215, b: 0 }) })

});

/* ---------- Axis ---------- */

export const AXIS_COLORS: Readonly<Record<string, ColorEntry>> = Object.freeze({

    PRIMARY: Object.freeze({ id: "axis-primary", name: "Axis Primary", hex: "#E9C46A", rgb: Object.freeze({ r: 233, g: 196, b: 106 }) })

});

/* ---------- Structural Rings ---------- */

export const STRUCTURAL_RING_COLORS: Readonly<Record<string, ColorEntry>> = Object.freeze({

    PRIMARY: Object.freeze({ id: "structural-ring-primary", name: "Structural Ring Primary", hex: "#E9C46A", rgb: Object.freeze({ r: 233, g: 196, b: 106 }) })

});

/* ---------- Harmonic Rings ---------- */

export const HARMONIC_RING_COLORS: Readonly<Record<string, ColorEntry>> = Object.freeze({

    PRIMARY: Object.freeze({ id: "harmonic-ring-primary", name: "Harmonic Ring Primary", hex: "#F5D76E", rgb: Object.freeze({ r: 245, g: 215, b: 110 }) }),
    GLOW:    Object.freeze({ id: "harmonic-ring-glow",    name: "Harmonic Ring Glow",    hex: "#FFE066", rgb: Object.freeze({ r: 255, g: 224, b: 102 }) })

});

/* ---------- Parallel Universes ---------- */

export const PARALLEL_UNIVERSE_COLORS: Readonly<Record<string, ColorEntry>> = Object.freeze({

    PRIMARY: Object.freeze({ id: "parallel-universe-primary", name: "Parallel Universe Primary", hex: "#C9A6FF", rgb: Object.freeze({ r: 201, g: 166, b: 255 }) }),
    GLOW:    Object.freeze({ id: "parallel-universe-glow",    name: "Parallel Universe Glow",    hex: "#B47DFF", rgb: Object.freeze({ r: 180, g: 125, b: 255 }) })

});

/* ---------- Clouds ---------- */

export const CLOUD_COLORS: Readonly<Record<string, ColorEntry>> = Object.freeze({

    PRIMARY: Object.freeze({ id: "cloud-primary", name: "Cloud Primary", hex: "#F0F8FF", rgb: Object.freeze({ r: 240, g: 248, b: 255 }) }),
    GLOW:    Object.freeze({ id: "cloud-glow",    name: "Cloud Glow",    hex: "#D8F6FF", rgb: Object.freeze({ r: 216, g: 246, b: 255 }) })

});

/* ---------- Stars ---------- */

export const STAR_COLORS: Readonly<Record<string, ColorEntry>> = Object.freeze({

    PRIMARY: Object.freeze({ id: "star-primary", name: "Star Primary", hex: "#FFFFFF", rgb: Object.freeze({ r: 255, g: 255, b: 255 }) })

});

/* ---------- Sigils ---------- */

export const SIGIL_COLORS: Readonly<Record<string, ColorEntry>> = Object.freeze({

    PRIMARY: Object.freeze({ id: "sigil-primary", name: "Sigil Primary", hex: "#E9C46A", rgb: Object.freeze({ r: 233, g: 196, b: 106 }) }),
    GLOW:    Object.freeze({ id: "sigil-glow",    name: "Sigil Glow",    hex: "#FFE066", rgb: Object.freeze({ r: 255, g: 224, b: 102 }) })

});

/* ---------- Gold ---------- */

export const GOLD_COLORS: Readonly<Record<string, ColorEntry>> = Object.freeze({

    PRIMARY: Object.freeze({ id: "gold-primary", name: "Gold Primary", hex: "#D4AF37", rgb: Object.freeze({ r: 212, g: 175, b: 55 }) }),
    LIGHT:   Object.freeze({ id: "gold-light",   name: "Gold Light",   hex: "#F5D76E", rgb: Object.freeze({ r: 245, g: 215, b: 110 }) }),
    DARK:    Object.freeze({ id: "gold-dark",    name: "Gold Dark",    hex: "#8B6A16", rgb: Object.freeze({ r: 139, g: 106, b: 22 }) })

});

/* ---------- Diamond ---------- */

export const DIAMOND_COLORS: Readonly<Record<string, ColorEntry>> = Object.freeze({

    PRIMARY: Object.freeze({ id: "diamond-primary", name: "Diamond Primary", hex: "#FFFFFF", rgb: Object.freeze({ r: 255, g: 255, b: 255 }) }),
    GLOW:    Object.freeze({ id: "diamond-glow",    name: "Diamond Glow",    hex: "#D8F6FF", rgb: Object.freeze({ r: 216, g: 246, b: 255 }) })

});

/* ---------- Crystal ---------- */

export const CRYSTAL_COLORS: Readonly<Record<string, ColorEntry>> = Object.freeze({

    PRIMARY: Object.freeze({ id: "crystal-primary", name: "Crystal Primary", hex: "#D8F6FF", rgb: Object.freeze({ r: 216, g: 246, b: 255 }) }),
    GLOW:    Object.freeze({ id: "crystal-glow",    name: "Crystal Glow",    hex: "#7EC8FF", rgb: Object.freeze({ r: 126, g: 200, b: 255 }) })

});

/* ---------- Background ---------- */

export const BACKGROUND_COLORS: Readonly<Record<string, ColorEntry>> = Object.freeze({

    DEEP_SPACE: Object.freeze({ id: "background-deep-space", name: "Deep Space", hex: "#0A1428", rgb: Object.freeze({ r: 10, g: 20, b: 40 }) }),
    VOID:       Object.freeze({ id: "background-void",       name: "Void",       hex: "#060C1A", rgb: Object.freeze({ r: 6, g: 12, b: 26 }) }),
    NEBULA:     Object.freeze({ id: "background-nebula",     name: "Nebula",     hex: "#1A2744", rgb: Object.freeze({ r: 26, g: 39, b: 68 }) })

});

/* ---------- Accent Colors ---------- */

export const ACCENT_COLORS: Readonly<Record<string, ColorEntry>> = Object.freeze({

    BLUE:   Object.freeze({ id: "accent-blue",   name: "Accent Blue",   hex: "#5FB8FF", rgb: Object.freeze({ r: 95, g: 184, b: 255 }) }),
    PURPLE: Object.freeze({ id: "accent-purple", name: "Accent Purple", hex: "#B47DFF", rgb: Object.freeze({ r: 180, g: 125, b: 255 }) }),
    GREEN:  Object.freeze({ id: "accent-green",  name: "Accent Green",  hex: "#95F48F", rgb: Object.freeze({ r: 149, g: 244, b: 143 }) }),
    PINK:   Object.freeze({ id: "accent-pink",   name: "Accent Pink",   hex: "#FF8FD4", rgb: Object.freeze({ r: 255, g: 143, b: 212 }) }),
    AMBER:  Object.freeze({ id: "accent-amber",  name: "Accent Amber",  hex: "#F7A84B", rgb: Object.freeze({ r: 247, g: 168, b: 75 }) })

});
