// validation/SessionValidator.ts
/**
 * validation/SessionValidator.ts
 *
 * Validation only.
 * Pure functions only.
 * No classes.
 * No engine logic.
 * No renderer logic.
 * No persistence.
 * No side effects.
 *
 * Reuses the Session shape from ../SessionModel.ts (for
 * documentation/reference), the shared result contract from
 * ../ValidationTypes.ts, and the shared runtime-checking
 * primitives from ./ValidationHelpers.ts (including the
 * project's ISO 8601 timestamp policy).
 *
 * This is a shallow structural pass: participants/goals are
 * checked for being arrays, not validated item-by-item, and
 * activeIdentityId is checked for shape only (null or
 * non-empty string) rather than cross-referenced against any
 * participant. That's narrower than an earlier draft of this
 * file, which did per-item participant/goal checks and an
 * activeIdentityId-to-participant cross-reference. If that
 * deeper validation is still wanted, it likely belongs in a
 * separate, more targeted file (e.g. a participant/goal
 * collection validator) rather than folded back in here.
 *
 * Note: SessionMode ("SOLO" | "SHARED") and SessionState
 * ("IDLE" | "ACTIVE" | "PAUSED" | "COMPLETE") are TypeScript
 * string-literal unions, which don't exist at runtime. The
 * SESSION_MODES / SESSION_STATES lists below are hand-kept in
 * sync with the unions declared in ../SessionTypes.ts.
 *
 * Export only validateSession(). All helper functions are
 * private to this file.
 */

import type { ValidationIssue, ValidationResult } from "../ValidationTypes";
import { isObject, isNonEmptyString, isIso8601Timestamp, UnknownRecord } from "./ValidationHelpers";

const SESSION_MODES = ["SOLO", "SHARED"] as const;
const SESSION_STATES = ["IDLE", "ACTIVE", "PAUSED", "COMPLETE"] as const;

/* ---------- Required Fields ---------- */

function checkRequiredFields(session: UnknownRecord): ValidationIssue[] {

    const issues: ValidationIssue[] = [];

    if (session.id === undefined || session.id === null) {
        issues.push({ field: "id", message: "id is required.", severity: "ERROR" });
    }

    if (session.participants === undefined || session.participants === null) {
        issues.push({ field: "participants", message: "participants is required.", severity: "ERROR" });
    }

    if (session.mode === undefined || session.mode === null) {
        issues.push({ field: "mode", message: "mode is required.", severity: "ERROR" });
    }

    if (session.goals === undefined || session.goals === null) {
        issues.push({ field: "goals", message: "goals is required.", severity: "ERROR" });
    }

    if (session.state === undefined || session.state === null) {
        issues.push({ field: "state", message: "state is required.", severity: "ERROR" });
    }

    if (session.activeIdentityId === undefined) {
        issues.push({ field: "activeIdentityId", message: "activeIdentityId is required (may be null, but not absent).", severity: "ERROR" });
    }

    if (session.universeId === undefined) {
        issues.push({ field: "universeId", message: "universeId is required (may be null, but not absent).", severity: "ERROR" });
    }

    if (session.audioMixId === undefined) {
        issues.push({ field: "audioMixId", message: "audioMixId is required (may be null, but not absent).", severity: "ERROR" });
    }

    if (session.startTime === undefined) {
        issues.push({ field: "startTime", message: "startTime is required (may be null, but not absent).", severity: "ERROR" });
    }

    if (session.endTime === undefined) {
        issues.push({ field: "endTime", message: "endTime is required (may be null, but not absent).", severity: "ERROR" });
    }

    return issues;

}

/* ---------- Non-Empty id ---------- */

function checkId(session: UnknownRecord): ValidationIssue[] {

    if (session.id !== undefined && session.id !== null && !isNonEmptyString(session.id)) {
        return [{ field: "id", message: "id must be a non-empty string.", severity: "ERROR" }];
    }

    return [];

}

/* ---------- Valid Mode ---------- */

function checkMode(session: UnknownRecord): ValidationIssue[] {

    if (session.mode !== undefined && session.mode !== null && !SESSION_MODES.includes(session.mode as typeof SESSION_MODES[number])) {
        return [{
            field: "mode",
            message: `mode must be one of: ${SESSION_MODES.join(", ")}.`,
            severity: "ERROR"
        }];
    }

    return [];

}

/* ---------- Valid State ---------- */

function checkState(session: UnknownRecord): ValidationIssue[] {

    if (session.state !== undefined && session.state !== null && !SESSION_STATES.includes(session.state as typeof SESSION_STATES[number])) {
        return [{
            field: "state",
            message: `state must be one of: ${SESSION_STATES.join(", ")}.`,
            severity: "ERROR"
        }];
    }

    return [];

}

/* ---------- Participants Is Array ---------- */

function checkParticipantsIsArray(session: UnknownRecord): ValidationIssue[] {

    if (session.participants !== undefined && session.participants !== null && !Array.isArray(session.participants)) {
        return [{ field: "participants", message: "participants must be an array.", severity: "ERROR" }];
    }

    return [];

}

/* ---------- Goals Is Array ---------- */

function checkGoalsIsArray(session: UnknownRecord): ValidationIssue[] {

    if (session.goals !== undefined && session.goals !== null && !Array.isArray(session.goals)) {
        return [{ field: "goals", message: "goals must be an array.", severity: "ERROR" }];
    }

    return [];

}

/* ---------- Nullable String Reference Fields ---------- */

function checkNullableStringField(session: UnknownRecord, field: string): ValidationIssue[] {

    const value = session[field];

    if (value !== undefined && value !== null && !isNonEmptyString(value)) {
        return [{ field, message: `${field} must be either null or a non-empty string.`, severity: "ERROR" }];
    }

    return [];

}

/* ---------- Start / End Timestamps ---------- */

function checkTiming(session: UnknownRecord): ValidationIssue[] {

    const issues: ValidationIssue[] = [];

    if (session.startTime !== undefined && session.startTime !== null && !isIso8601Timestamp(session.startTime)) {
        issues.push({ field: "startTime", message: "startTime must be null or a valid ISO 8601 timestamp.", severity: "ERROR" });
    }

    if (session.endTime !== undefined && session.endTime !== null && !isIso8601Timestamp(session.endTime)) {
        issues.push({ field: "endTime", message: "endTime must be null or a valid ISO 8601 timestamp.", severity: "ERROR" });
    }

    if (
        isIso8601Timestamp(session.startTime) &&
        isIso8601Timestamp(session.endTime) &&
        Date.parse(session.endTime as string) < Date.parse(session.startTime as string)
    ) {
        issues.push({ field: "endTime", message: "endTime must not be earlier than startTime.", severity: "ERROR" });
    }

    return issues;

}

/* ---------- Primary Export ---------- */

export function validateSession(session: unknown): ValidationResult {

    if (!isObject(session)) {
        return {
            valid: false,
            issues: [{ field: "root", message: "session must be a non-null object.", severity: "ERROR" }]
        };
    }

    const issues: ValidationIssue[] = [
        ...checkRequiredFields(session),
        ...checkId(session),
        ...checkMode(session),
        ...checkState(session),
        ...checkParticipantsIsArray(session),
        ...checkGoalsIsArray(session),
        ...checkNullableStringField(session, "activeIdentityId"),
        ...checkNullableStringField(session, "universeId"),
        ...checkNullableStringField(session, "audioMixId"),
        ...checkTiming(session)
    ];

    return {
        valid: !issues.some(issue => issue.severity === "ERROR"),
        issues
    };

}
