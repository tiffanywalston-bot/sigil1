// validation/AudioValidator.ts
/**
 * validation/AudioValidator.ts
 *
 * Validation only.
 * Pure functions only.
 * No classes.
 * No engine logic.
 * No renderer logic.
 * No persistence.
 * No side effects.
 *
 * Reuses the AudioModel shape from ../AudioModel.ts (for
 * documentation/reference), the shared result contract from
 * ../ValidationTypes.ts, and the shared runtime-checking
 * primitives from ./ValidationHelpers.ts.
 *
 * validateAudio() takes `unknown`, not AudioModel.
 *
 * mixId/binauralId/subliminalId/wavId are id references (per
 * AudioModel.ts's own docs), checked for shape only (null or
 * non-empty string) — this file does not look up whether
 * those ids resolve to anything, since that would be a
 * cross-model lookup, out of scope for a structural
 * validator.
 *
 * trackIds is checked element-by-element (each must be a
 * non-empty string), because AudioModel.trackIds is declared
 * as a primitive string[] — checking each element's runtime
 * type is exactly "runtime types" + "arrays" validation, not
 * an invented business rule.
 *
 * sampleRate/durationSeconds are checked only for being
 * finite numbers. AudioModel.ts does not declare a minimum,
 * maximum, or positivity constraint on either field, so none
 * is enforced here — inventing e.g. "sampleRate must be > 0"
 * would be a guessed constraint not present in the
 * repository.
 *
 * Note: AudioPlaybackStatus ("IDLE" | "PLAYING" | "PAUSED" |
 * "RENDERING" | "EXPORTED") is a TypeScript string-literal
 * union from ../AudioTypes.ts, which doesn't exist at
 * runtime. Per the current directive, ../AudioTypes.ts is not
 * modified to add a runtime-checkable value list — the
 * AUDIO_PLAYBACK_STATUSES array below is a local mirror only.
 *
 * Export only validateAudio(). All helper functions are
 * private to this file.
 */

import type { ValidationIssue, ValidationResult } from "../ValidationTypes";
import { isObject, isNonEmptyString, isFiniteNumber, UnknownRecord } from "./ValidationHelpers";

const AUDIO_PLAYBACK_STATUSES = [
    "IDLE",
    "PLAYING",
    "PAUSED",
    "RENDERING",
    "EXPORTED"
] as const;

/* ---------- Required Fields ---------- */

function checkRequiredFields(audio: UnknownRecord): ValidationIssue[] {

    const issues: ValidationIssue[] = [];

    if (audio.id === undefined || audio.id === null) {
        issues.push({ field: "id", message: "id is required.", severity: "ERROR" });
    }

    if (audio.mixId === undefined) {
        issues.push({ field: "mixId", message: "mixId is required (may be null, but not absent).", severity: "ERROR" });
    }

    if (audio.trackIds === undefined || audio.trackIds === null) {
        issues.push({ field: "trackIds", message: "trackIds is required.", severity: "ERROR" });
    }

    if (audio.binauralId === undefined) {
        issues.push({ field: "binauralId", message: "binauralId is required (may be null, but not absent).", severity: "ERROR" });
    }

    if (audio.subliminalId === undefined) {
        issues.push({ field: "subliminalId", message: "subliminalId is required (may be null, but not absent).", severity: "ERROR" });
    }

    if (audio.wavId === undefined) {
        issues.push({ field: "wavId", message: "wavId is required (may be null, but not absent).", severity: "ERROR" });
    }

    if (audio.sampleRate === undefined || audio.sampleRate === null) {
        issues.push({ field: "sampleRate", message: "sampleRate is required.", severity: "ERROR" });
    }

    if (audio.durationSeconds === undefined || audio.durationSeconds === null) {
        issues.push({ field: "durationSeconds", message: "durationSeconds is required.", severity: "ERROR" });
    }

    if (audio.playbackStatus === undefined || audio.playbackStatus === null) {
        issues.push({ field: "playbackStatus", message: "playbackStatus is required.", severity: "ERROR" });
    }

    return issues;

}

/* ---------- Non-Empty id ---------- */

function checkId(audio: UnknownRecord): ValidationIssue[] {

    if (audio.id !== undefined && audio.id !== null && !isNonEmptyString(audio.id)) {
        return [{ field: "id", message: "id must be a non-empty string.", severity: "ERROR" }];
    }

    return [];

}

/* ---------- Nullable String Reference Fields ---------- */

function checkNullableStringField(audio: UnknownRecord, field: string): ValidationIssue[] {

    const value = audio[field];

    if (value !== undefined && value !== null && !isNonEmptyString(value)) {
        return [{ field, message: `${field} must be either null or a non-empty string.`, severity: "ERROR" }];
    }

    return [];

}

/* ---------- trackIds: Array of Non-Empty Strings ---------- */

function checkTrackIds(audio: UnknownRecord): ValidationIssue[] {

    if (audio.trackIds === undefined || audio.trackIds === null) {
        return [];
    }

    if (!Array.isArray(audio.trackIds)) {
        return [{ field: "trackIds", message: "trackIds must be an array.", severity: "ERROR" }];
    }

    const issues: ValidationIssue[] = [];

    (audio.trackIds as unknown[]).forEach((value, index) => {

        if (!isNonEmptyString(value)) {
            issues.push({
                field: `trackIds[${index}]`,
                message: "each trackIds entry must be a non-empty string.",
                severity: "ERROR"
            });
        }

    });

    return issues;

}

/* ---------- sampleRate / durationSeconds ---------- */

function checkNumericField(audio: UnknownRecord, field: string): ValidationIssue[] {

    const value = audio[field];

    if (value !== undefined && value !== null && !isFiniteNumber(value)) {
        return [{ field, message: `${field} must be a finite number.`, severity: "ERROR" }];
    }

    return [];

}

/* ---------- Valid playbackStatus ---------- */

function checkPlaybackStatus(audio: UnknownRecord): ValidationIssue[] {

    if (
        audio.playbackStatus !== undefined &&
        audio.playbackStatus !== null &&
        !AUDIO_PLAYBACK_STATUSES.includes(audio.playbackStatus as typeof AUDIO_PLAYBACK_STATUSES[number])
    ) {
        return [{
            field: "playbackStatus",
            message: `playbackStatus must be one of: ${AUDIO_PLAYBACK_STATUSES.join(", ")}.`,
            severity: "ERROR"
        }];
    }

    return [];

}

/* ---------- Primary Export ---------- */

export function validateAudio(audio: unknown): ValidationResult {

    if (!isObject(audio)) {
        return {
            valid: false,
            issues: [{ field: "root", message: "audio must be a non-null object.", severity: "ERROR" }]
        };
    }

    const issues: ValidationIssue[] = [
        ...checkRequiredFields(audio),
        ...checkId(audio),
        ...checkNullableStringField(audio, "mixId"),
        ...checkTrackIds(audio),
        ...checkNullableStringField(audio, "binauralId"),
        ...checkNullableStringField(audio, "subliminalId"),
        ...checkNullableStringField(audio, "wavId"),
        ...checkNumericField(audio, "sampleRate"),
        ...checkNumericField(audio, "durationSeconds"),
        ...checkPlaybackStatus(audio)
    ];

    return {
        valid: !issues.some(issue => issue.severity === "ERROR"),
        issues
    };

}
