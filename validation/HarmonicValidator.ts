// validation/HarmonicValidator.ts
/**
 * validation/HarmonicValidator.ts
 *
 * Validation only.
 * Pure functions only.
 * No classes.
 * No engine logic.
 * No renderer logic.
 * No persistence.
 * No side effects.
 *
 * Reuses the HarmonicModel shape from ../HarmonicModel.ts
 * (for documentation/reference), the shared result contract
 * from ../ValidationTypes.ts, and the shared runtime-checking
 * primitives from ./ValidationHelpers.ts.
 *
 * validateHarmonic() takes `unknown`, not HarmonicModel.
 *
 * frequency is checked only for being an object (object
 * presence), not for its internal value/unit shape. An
 * earlier version of this file inspected frequency.value and
 * frequency.unit individually, which made it the only
 * validator in this layer that looked inside a nested complex
 * object — UniverseValidator's bounds/transform and
 * RendererValidator's renderSettings/renderState are all
 * shallow "is this an object" checks. Unified to match: every
 * nested complex object in this validation layer is checked
 * the same way, consistently, across all six validators.
 *
 * resonance/phase/amplitude are checked only for being finite
 * numbers. HarmonicModel.ts declares them as plain `number`
 * with no stated range (e.g. resonance is not declared to be
 * within [0, 1] in the model itself, even though
 * HarmonicMath.resonance() happens to return values in that
 * range elsewhere) — enforcing an unstated range here would
 * be guessing, so none is enforced.
 *
 * harmonicFamily is an id reference (per HarmonicModel.ts's
 * own docs) and is checked for shape only (null or non-empty
 * string) — no lookup against FrequencyLibrary.ts, since that
 * would be a cross-model lookup.
 *
 * Note: HarmonicWaveform ("SINE" | "COSINE") is a
 * TypeScript string-literal union declared directly in
 * ../HarmonicModel.ts. It still doesn't exist at runtime, so
 * the HARMONIC_WAVEFORMS array below is a local mirror,
 * consistent with how SessionValidator.ts and
 * UniverseValidator.ts mirror their own unions.
 *
 * Export only validateHarmonic(). All helper functions are
 * private to this file.
 */

import type { ValidationIssue, ValidationResult } from "../ValidationTypes";
import { isObject, isNonEmptyString, isFiniteNumber, UnknownRecord } from "./ValidationHelpers";

const HARMONIC_WAVEFORMS = ["SINE", "COSINE"] as const;

/* ---------- Required Fields ---------- */

function checkRequiredFields(harmonic: UnknownRecord): ValidationIssue[] {

    const issues: ValidationIssue[] = [];

    if (harmonic.id === undefined || harmonic.id === null) {
        issues.push({ field: "id", message: "id is required.", severity: "ERROR" });
    }

    if (harmonic.frequency === undefined || harmonic.frequency === null) {
        issues.push({ field: "frequency", message: "frequency is required.", severity: "ERROR" });
    }

    if (harmonic.harmonicFamily === undefined) {
        issues.push({ field: "harmonicFamily", message: "harmonicFamily is required (may be null, but not absent).", severity: "ERROR" });
    }

    if (harmonic.resonance === undefined || harmonic.resonance === null) {
        issues.push({ field: "resonance", message: "resonance is required.", severity: "ERROR" });
    }

    if (harmonic.phase === undefined || harmonic.phase === null) {
        issues.push({ field: "phase", message: "phase is required.", severity: "ERROR" });
    }

    if (harmonic.amplitude === undefined || harmonic.amplitude === null) {
        issues.push({ field: "amplitude", message: "amplitude is required.", severity: "ERROR" });
    }

    if (harmonic.waveform === undefined || harmonic.waveform === null) {
        issues.push({ field: "waveform", message: "waveform is required.", severity: "ERROR" });
    }

    return issues;

}

/* ---------- Non-Empty id ---------- */

function checkId(harmonic: UnknownRecord): ValidationIssue[] {

    if (harmonic.id !== undefined && harmonic.id !== null && !isNonEmptyString(harmonic.id)) {
        return [{ field: "id", message: "id must be a non-empty string.", severity: "ERROR" }];
    }

    return [];

}

/* ---------- frequency: { value: number, unit: string } ---------- */

function checkFrequencyIsObject(harmonic: UnknownRecord): ValidationIssue[] {

    if (harmonic.frequency !== undefined && harmonic.frequency !== null && !isObject(harmonic.frequency)) {
        return [{ field: "frequency", message: "frequency must be an object.", severity: "ERROR" }];
    }

    return [];

}

/* ---------- harmonicFamily ---------- */

function checkHarmonicFamily(harmonic: UnknownRecord): ValidationIssue[] {

    const value = harmonic.harmonicFamily;

    if (value !== undefined && value !== null && !isNonEmptyString(value)) {
        return [{ field: "harmonicFamily", message: "harmonicFamily must be either null or a non-empty string.", severity: "ERROR" }];
    }

    return [];

}

/* ---------- resonance / phase / amplitude ---------- */

function checkNumericField(harmonic: UnknownRecord, field: string): ValidationIssue[] {

    const value = harmonic[field];

    if (value !== undefined && value !== null && !isFiniteNumber(value)) {
        return [{ field, message: `${field} must be a finite number.`, severity: "ERROR" }];
    }

    return [];

}

/* ---------- Valid waveform ---------- */

function checkWaveform(harmonic: UnknownRecord): ValidationIssue[] {

    if (
        harmonic.waveform !== undefined &&
        harmonic.waveform !== null &&
        !HARMONIC_WAVEFORMS.includes(harmonic.waveform as typeof HARMONIC_WAVEFORMS[number])
    ) {
        return [{
            field: "waveform",
            message: `waveform must be one of: ${HARMONIC_WAVEFORMS.join(", ")}.`,
            severity: "ERROR"
        }];
    }

    return [];

}

/* ---------- Primary Export ---------- */

export function validateHarmonic(harmonic: unknown): ValidationResult {

    if (!isObject(harmonic)) {
        return {
            valid: false,
            issues: [{ field: "root", message: "harmonic must be a non-null object.", severity: "ERROR" }]
        };
    }

    const issues: ValidationIssue[] = [
        ...checkRequiredFields(harmonic),
        ...checkId(harmonic),
        ...checkFrequencyIsObject(harmonic),
        ...checkHarmonicFamily(harmonic),
        ...checkNumericField(harmonic, "resonance"),
        ...checkNumericField(harmonic, "phase"),
        ...checkNumericField(harmonic, "amplitude"),
        ...checkWaveform(harmonic)
    ];

    return {
        valid: !issues.some(issue => issue.severity === "ERROR"),
        issues
    };

}
