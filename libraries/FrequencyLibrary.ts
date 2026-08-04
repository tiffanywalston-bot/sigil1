/**
 * FrequencyLibrary.ts
 *
 * Data library only.
 * No classes.
 * No functions.
 * No calculations.
 * No engine logic.
 * No renderer logic.
 *
 * Every export is Object.freeze()'d. Values are hardcoded
 * literals — nothing here is derived or computed.
 *
 * Data only: no therapeutic claims, no recommendations, no
 * AI mappings, no session mappings, no user presets.
 */

import type { Frequency, FrequencyRange } from "../HarmonicTypes";

/* ---------- Reference Frequencies ---------- */

export const REFERENCE_FREQUENCIES: Readonly<Record<string, Frequency>> = Object.freeze({

    A432: Object.freeze({ value: 432, unit: "Hz" }),
    A440: Object.freeze({ value: 440, unit: "Hz" })

});

/* ---------- Harmonic Family ---------- */

export const HARMONIC_FAMILY: readonly Frequency[] = Object.freeze([

    Object.freeze({ value: 216, unit: "Hz" }),
    Object.freeze({ value: 324, unit: "Hz" }),
    Object.freeze({ value: 432, unit: "Hz" }),
    Object.freeze({ value: 540, unit: "Hz" }),
    Object.freeze({ value: 648, unit: "Hz" }),
    Object.freeze({ value: 864, unit: "Hz" })

]);

/* ---------- Solfeggio Frequencies ---------- */

export const SOLFEGGIO_FREQUENCIES: Readonly<Record<string, Frequency>> = Object.freeze({

    UT:  Object.freeze({ value: 174, unit: "Hz" }),
    RE:  Object.freeze({ value: 285, unit: "Hz" }),
    MI:  Object.freeze({ value: 396, unit: "Hz" }),
    FA:  Object.freeze({ value: 417, unit: "Hz" }),
    SOL: Object.freeze({ value: 528, unit: "Hz" }),
    LA:  Object.freeze({ value: 639, unit: "Hz" }),
    SI:  Object.freeze({ value: 741, unit: "Hz" }),
    HI:  Object.freeze({ value: 852, unit: "Hz" }),
    UR:  Object.freeze({ value: 963, unit: "Hz" })

});

export const SOLFEGGIO_FREQUENCY_LIST: readonly Frequency[] = Object.freeze([

    SOLFEGGIO_FREQUENCIES.UT,
    SOLFEGGIO_FREQUENCIES.RE,
    SOLFEGGIO_FREQUENCIES.MI,
    SOLFEGGIO_FREQUENCIES.FA,
    SOLFEGGIO_FREQUENCIES.SOL,
    SOLFEGGIO_FREQUENCIES.LA,
    SOLFEGGIO_FREQUENCIES.SI,
    SOLFEGGIO_FREQUENCIES.HI,
    SOLFEGGIO_FREQUENCIES.UR

]);

/* ---------- Brainwave Bands ---------- */

export const BRAINWAVE_BANDS: Readonly<Record<string, FrequencyRange>> = Object.freeze({

    DELTA: Object.freeze({ minimum: 0.5, maximum: 4 }),
    THETA: Object.freeze({ minimum: 4,   maximum: 8 }),
    ALPHA: Object.freeze({ minimum: 8,   maximum: 13 }),
    BETA:  Object.freeze({ minimum: 13,  maximum: 30 }),
    GAMMA: Object.freeze({ minimum: 30,  maximum: 100 })

});

/* ---------- Schumann Resonance ---------- */

export const SCHUMANN_RESONANCE: Frequency = Object.freeze({ value: 7.83, unit: "Hz" });
