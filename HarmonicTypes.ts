/**
 * HarmonicTypes.ts
 *
 * Shared harmonic data types for Sigil1.
 * No logic.
 * No calculations.
 * Types only.
 */

/* ---------- Frequency ---------- */

export interface Frequency {

    value: number;

    unit: "Hz";

}

/* ---------- Amplitude ---------- */

export interface Amplitude {

    value: number;

}

/* ---------- Phase ---------- */

export interface Phase {

    value: number;

}

/* ---------- Resonance ---------- */

export interface Resonance {

    value: number;

}

/* ---------- Harmonic ---------- */

export interface Harmonic {

    id: string;

    frequency: Frequency;

    amplitude: Amplitude;

    phase: Phase;

    resonance: Resonance;

}

/* ---------- Harmonic Family ---------- */

export interface HarmonicFamily {

    id: string;

    name: string;

    frequencies: number[];

}

/* ---------- Harmonic Wave ---------- */

export interface HarmonicWave {

    id: string;

    harmonics: Harmonic[];

    duration: number;

}

/* ---------- Pulse ---------- */

export interface Pulse {

    bpm: number;

    phase: number;

}

/* ---------- Frequency Range ---------- */

export interface FrequencyRange {

    minimum: number;

    maximum: number;

}

/* ---------- Harmonic State ---------- */

export interface HarmonicState {

    active: boolean;

    primaryFrequency: number;

    resonance: number;

    pulse: Pulse;

}