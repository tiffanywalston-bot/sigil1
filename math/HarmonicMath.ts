/**
 * HarmonicMath.ts
 *
 * Pure mathematics.
 * No engine logic.
 * No renderer logic.
 * No audio processing.
 * No Three.js.
 * No DOM.
 * No browser APIs.
 *
 * Static utility class only — HarmonicMath is never
 * instantiated. Every method is a deterministic pure
 * function: same input always produces the same output,
 * with no session data, no AI, no presets, no WAV
 * generation, and no binaural/subliminal logic.
 *
 * Frequencies are expressed in Hz via the Frequency type
 * from HarmonicTypes.ts. All frequency-accepting methods
 * throw on non-positive values, since a zero or negative
 * frequency has no physical or mathematical meaning here.
 *
 * Independent of every other engine subsystem except
 * Vector.ts and HarmonicTypes.ts.
 */

import type { Frequency, FrequencyRange } from "../HarmonicTypes";

const MAX_NORMALIZE_ITERATIONS = 1024;

function assertPositive(value: number, label: string): void {

    if (!(value > 0)) {
        throw new Error(`HarmonicMath: ${label} must be a positive number.`);
    }

}

function freq(value: number): Frequency {

    return { value, unit: "Hz" };

}

export class HarmonicMath {

    private constructor() {

        // Static utility class only — never instantiated.

    }

    /* ---------- Frequency Ratio ---------- */

    static frequencyRatio(a: Frequency, b: Frequency): number {

        assertPositive(a.value, "a");
        assertPositive(b.value, "b");

        return a.value / b.value;

    }

    /* ---------- Harmonic Series Generation ---------- */

    static generateHarmonicSeries(fundamental: Frequency, count: number): Frequency[] {

        assertPositive(fundamental.value, "fundamental");

        if (!Number.isInteger(count) || count < 1) {
            throw new Error("HarmonicMath.generateHarmonicSeries: count must be a positive integer.");
        }

        const series: Frequency[] = [];

        for (let i = 1; i <= count; i++) {
            series.push(freq(fundamental.value * i));
        }

        return series;

    }

    /* ---------- Harmonic Interval ---------- */

    static harmonicIntervalCents(a: Frequency, b: Frequency): number {

        assertPositive(a.value, "a");
        assertPositive(b.value, "b");

        return 1200 * Math.log2(b.value / a.value);

    }

    /* ---------- Resonance ---------- */

    /**
     * Heuristic measure, in [0, 1], of how closely the ratio
     * between two frequencies approximates a simple integer
     * ratio (n/d with d up to maxDenominator) — the harmonic
     * relationships that produce consonance (e.g. 3:2, 4:3).
     * 1 means an exact simple-ratio match; the score falls
     * off smoothly as the true ratio drifts from the nearest
     * simple fraction. Throws if either frequency is
     * non-positive or maxDenominator is not a positive
     * integer.
     */
    static resonance(a: Frequency, b: Frequency, maxDenominator: number = 8): number {

        assertPositive(a.value, "a");
        assertPositive(b.value, "b");

        if (!Number.isInteger(maxDenominator) || maxDenominator < 1) {
            throw new Error("HarmonicMath.resonance: maxDenominator must be a positive integer.");
        }

        const ratio = Math.max(a.value, b.value) / Math.min(a.value, b.value);

        let bestDeviation = Infinity;

        for (let d = 1; d <= maxDenominator; d++) {

            const n = Math.round(ratio * d);

            if (n === 0) continue;

            const approx = n / d;
            const deviation = Math.abs(ratio - approx) / approx;

            if (deviation < bestDeviation) {
                bestDeviation = deviation;
            }

        }

        const SCALE = 10;

        const score = 1 / (1 + bestDeviation * SCALE);

        return Math.min(1, Math.max(0, score));

    }

    /* ---------- Phase Difference ---------- */

    static phaseDifference(phaseA: number, phaseB: number): number {

        const TWO_PI = Math.PI * 2;

        let diff = (phaseB - phaseA) % TWO_PI;

        if (diff > Math.PI) diff -= TWO_PI;
        if (diff <= -Math.PI) diff += TWO_PI;

        return diff;

    }

    /* ---------- Wave Interference ---------- */

    static waveInterference(
        amplitudeA: number,
        phaseA: number,
        amplitudeB: number,
        phaseB: number
    ): { amplitude: number; phase: number } {

        if (amplitudeA < 0 || amplitudeB < 0) {
            throw new Error("HarmonicMath.waveInterference: amplitudes must be non-negative.");
        }

        const realSum = amplitudeA * Math.cos(phaseA) + amplitudeB * Math.cos(phaseB);
        const imagSum = amplitudeA * Math.sin(phaseA) + amplitudeB * Math.sin(phaseB);

        return {
            amplitude: Math.sqrt(realSum * realSum + imagSum * imagSum),
            phase: Math.atan2(imagSum, realSum)
        };

    }

    /* ---------- Frequency Normalization ---------- */

    static normalizeFrequency(frequency: Frequency, range: FrequencyRange): Frequency {

        assertPositive(frequency.value, "frequency");
        assertPositive(range.minimum, "range.minimum");

        if (range.maximum <= range.minimum) {
            throw new Error("HarmonicMath.normalizeFrequency: range.maximum must exceed range.minimum.");
        }

        if (range.maximum < range.minimum * 2) {
            throw new Error("HarmonicMath.normalizeFrequency: range must span at least one octave.");
        }

        let value = frequency.value;
        let iterations = 0;

        while (value < range.minimum) {

            value *= 2;
            iterations++;

            if (iterations > MAX_NORMALIZE_ITERATIONS) {
                throw new Error("HarmonicMath.normalizeFrequency: failed to converge.");
            }

        }

        while (value > range.maximum) {

            value /= 2;
            iterations++;

            if (iterations > MAX_NORMALIZE_ITERATIONS) {
                throw new Error("HarmonicMath.normalizeFrequency: failed to converge.");
            }

        }

        return freq(value);

    }

    /* ---------- Frequency Interpolation ---------- */

    static interpolateFrequency(a: Frequency, b: Frequency, t: number): Frequency {

        assertPositive(a.value, "a");
        assertPositive(b.value, "b");

        return freq(a.value * Math.pow(b.value / a.value, t));

    }

    /* ---------- Harmonic Distance ---------- */

    static harmonicDistance(a: Frequency, b: Frequency): number {

        assertPositive(a.value, "a");
        assertPositive(b.value, "b");

        return Math.abs(Math.log2(b.value / a.value));

    }

    /* ---------- Harmonic Similarity ---------- */

    static harmonicSimilarity(a: Frequency, b: Frequency): number {

        return 1 / (1 + HarmonicMath.harmonicDistance(a, b));

    }

}
