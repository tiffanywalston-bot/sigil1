/**
 * FrequencyMath.ts
 *
 * Pure mathematics.
 * No engine logic.
 * No renderer logic.
 * No audio processing.
 * No Three.js.
 * No DOM.
 * No browser APIs.
 *
 * Static utility class only — FrequencyMath is never
 * instantiated. Every method is a deterministic pure
 * function: same input always produces the same output,
 * with no session data, no AI, no presets, no WAV
 * generation, and no binaural/subliminal logic.
 *
 * Frequencies are expressed in Hz via the Frequency type
 * from HarmonicTypes.ts. Methods throw only for
 * mathematically invalid input (non-positive frequencies,
 * malformed ranges, non-finite shift amounts) — a frequency
 * simply falling outside a valid range is not itself invalid
 * input, so isValidFrequency() returns false rather than
 * throwing for that case.
 *
 * Independent of every other engine subsystem except
 * HarmonicTypes.ts.
 */

import type { Frequency, FrequencyRange } from "./HarmonicTypes";

function assertPositive(value: number, label: string): void {

    if (!(value > 0)) {
        throw new Error(`FrequencyMath: ${label} must be a positive number.`);
    }

}

function assertFinite(value: number, label: string): void {

    if (!Number.isFinite(value)) {
        throw new Error(`FrequencyMath: ${label} must be a finite number.`);
    }

}

function freq(value: number): Frequency {

    return { value, unit: "Hz" };

}

export class FrequencyMath {

    private constructor() {

        // Static utility class only — never instantiated.

    }

    /* ---------- Hertz <-> Period ---------- */

    static hertzToPeriod(frequency: Frequency): number {

        assertPositive(frequency.value, "frequency");

        return 1 / frequency.value;

    }

    static periodToHertz(periodSeconds: number): Frequency {

        assertPositive(periodSeconds, "periodSeconds");

        return freq(1 / periodSeconds);

    }

    /* ---------- Angular Frequency ---------- */

    static angularFrequency(frequency: Frequency): number {

        assertPositive(frequency.value, "frequency");

        return 2 * Math.PI * frequency.value;

    }

    /* ---------- Wavelength ---------- */

    static wavelength(frequency: Frequency, speed: number): number {

        assertPositive(frequency.value, "frequency");
        assertPositive(speed, "speed");

        return speed / frequency.value;

    }

    /* ---------- Octave / Semitone / Cents Shift ---------- */

    static octaveShift(frequency: Frequency, octaves: number): Frequency {

        assertPositive(frequency.value, "frequency");
        assertFinite(octaves, "octaves");

        return freq(frequency.value * Math.pow(2, octaves));

    }

    static semitoneShift(frequency: Frequency, semitones: number): Frequency {

        assertPositive(frequency.value, "frequency");
        assertFinite(semitones, "semitones");

        return freq(frequency.value * Math.pow(2, semitones / 12));

    }

    static centsShift(frequency: Frequency, cents: number): Frequency {

        assertPositive(frequency.value, "frequency");
        assertFinite(cents, "cents");

        return freq(frequency.value * Math.pow(2, cents / 1200));

    }

    /* ---------- Clamping ---------- */

    static clampFrequency(frequency: Frequency, range: FrequencyRange): Frequency {

        assertPositive(frequency.value, "frequency");
        assertPositive(range.minimum, "range.minimum");

        if (range.maximum <= range.minimum) {
            throw new Error("FrequencyMath.clampFrequency: range.maximum must exceed range.minimum.");
        }

        const clamped = Math.min(range.maximum, Math.max(range.minimum, frequency.value));

        return freq(clamped);

    }

    /* ---------- Averaging ---------- */

    static averageFrequency(frequencies: Frequency[]): Frequency {

        if (frequencies.length === 0) {
            throw new Error("FrequencyMath.averageFrequency: frequencies must not be empty.");
        }

        let sum = 0;

        for (const f of frequencies) {
            assertPositive(f.value, "frequency");
            sum += f.value;
        }

        return freq(sum / frequencies.length);

    }

    /* ---------- Beat Frequency ---------- */

    static beatFrequency(a: Frequency, b: Frequency): Frequency {

        assertPositive(a.value, "a");
        assertPositive(b.value, "b");

        return freq(Math.abs(a.value - b.value));

    }

    /* ---------- Validation ---------- */

    static isValidFrequency(frequency: Frequency, range?: FrequencyRange): boolean {

        if (!Number.isFinite(frequency.value) || frequency.value <= 0) {
            return false;
        }

        if (range) {

            assertPositive(range.minimum, "range.minimum");

            if (range.maximum <= range.minimum) {
                throw new Error("FrequencyMath.isValidFrequency: range.maximum must exceed range.minimum.");
            }

            return frequency.value >= range.minimum && frequency.value <= range.maximum;

        }

        return true;

    }

}
