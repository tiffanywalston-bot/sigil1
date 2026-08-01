// validation/UniverseValidator.ts
/**
 * validation/UniverseValidator.ts
 *
 * Validation only.
 * Pure functions only.
 * No classes.
 * No engine logic.
 * No renderer logic.
 * No persistence.
 * No side effects.
 *
 * Reuses the UniverseModel shape from ../UniverseModel.ts
 * (for documentation/reference), the shared result contract
 * from ../ValidationTypes.ts, and the shared runtime-checking
 * primitives from ./ValidationHelpers.ts.
 *
 * This is a shallow structural pass: bounds/transform are
 * checked for being objects, and connections/fields are
 * checked for being arrays — none of the four are validated
 * item-by-item (no check of bounds.center/radius shape,
 * transform.position/rotation/scale shape, or individual
 * connection/field entries). That's narrower than an earlier
 * draft of this file, which did that deeper structural
 * validation. If it's still wanted, it likely belongs in a
 * separate, more targeted file rather than folded back in
 * here.
 *
 * Note: UniverseState is a TypeScript string-literal union
 * (from ../UniverseTypes.ts), which doesn't exist at runtime.
 * The UNIVERSE_STATES list below is hand-kept in sync with
 * that union.
 *
 * Export only validateUniverse(). All helper functions are
 * private to this file.
 */

import type { ValidationIssue, ValidationResult } from "../ValidationTypes";
import { isObject, isNonEmptyString, isFiniteNumber, UnknownRecord } from "./ValidationHelpers";

const UNIVERSE_STATES = [
    "DORMANT",
    "STABILIZING",
    "ACTIVE",
    "EXPANDING",
    "COLLAPSING"
] as const;

/* ---------- Required Fields ---------- */

function checkRequiredFields(universe: UnknownRecord): ValidationIssue[] {

    const issues: ValidationIssue[] = [];

    if (universe.id === undefined || universe.id === null) {
        issues.push({ field: "id", message: "id is required.", severity: "ERROR" });
    }

    if (universe.name === undefined || universe.name === null) {
        issues.push({ field: "name", message: "name is required.", severity: "ERROR" });
    }

    if (universe.axisId === undefined || universe.axisId === null) {
        issues.push({ field: "axisId", message: "axisId is required.", severity: "ERROR" });
    }

    if (universe.harmonicIndex === undefined || universe.harmonicIndex === null) {
        issues.push({ field: "harmonicIndex", message: "harmonicIndex is required.", severity: "ERROR" });
    }

    if (universe.state === undefined || universe.state === null) {
        issues.push({ field: "state", message: "state is required.", severity: "ERROR" });
    }

    if (universe.bounds === undefined || universe.bounds === null) {
        issues.push({ field: "bounds", message: "bounds is required.", severity: "ERROR" });
    }

    if (universe.transform === undefined || universe.transform === null) {
        issues.push({ field: "transform", message: "transform is required.", severity: "ERROR" });
    }

    if (universe.connections === undefined || universe.connections === null) {
        issues.push({ field: "connections", message: "connections is required.", severity: "ERROR" });
    }

    if (universe.fields === undefined || universe.fields === null) {
        issues.push({ field: "fields", message: "fields is required.", severity: "ERROR" });
    }

    return issues;

}

/* ---------- Non-Empty id / name / axisId ---------- */

function checkNonEmptyStringField(universe: UnknownRecord, field: string): ValidationIssue[] {

    const value = universe[field];

    if (value !== undefined && value !== null && !isNonEmptyString(value)) {
        return [{ field, message: `${field} must be a non-empty string.`, severity: "ERROR" }];
    }

    return [];

}

/* ---------- Non-Negative Harmonic Index ---------- */

function checkHarmonicIndex(universe: UnknownRecord): ValidationIssue[] {

    if (universe.harmonicIndex === undefined || universe.harmonicIndex === null) {
        return [];
    }

    if (!isFiniteNumber(universe.harmonicIndex) || universe.harmonicIndex < 0) {
        return [{
            field: "harmonicIndex",
            message: "harmonicIndex must be a finite number >= 0.",
            severity: "ERROR"
        }];
    }

    return [];

}

/* ---------- Valid State ---------- */

function checkState(universe: UnknownRecord): ValidationIssue[] {

    if (
        universe.state !== undefined &&
        universe.state !== null &&
        !UNIVERSE_STATES.includes(universe.state as typeof UNIVERSE_STATES[number])
    ) {
        return [{
            field: "state",
            message: `state must be one of: ${UNIVERSE_STATES.join(", ")}.`,
            severity: "ERROR"
        }];
    }

    return [];

}

/* ---------- Bounds Is Object ---------- */

function checkBoundsIsObject(universe: UnknownRecord): ValidationIssue[] {

    if (universe.bounds !== undefined && universe.bounds !== null && !isObject(universe.bounds)) {
        return [{ field: "bounds", message: "bounds must be an object.", severity: "ERROR" }];
    }

    return [];

}

/* ---------- Transform Is Object ---------- */

function checkTransformIsObject(universe: UnknownRecord): ValidationIssue[] {

    if (universe.transform !== undefined && universe.transform !== null && !isObject(universe.transform)) {
        return [{ field: "transform", message: "transform must be an object.", severity: "ERROR" }];
    }

    return [];

}

/* ---------- Connections Is Array ---------- */

function checkConnectionsIsArray(universe: UnknownRecord): ValidationIssue[] {

    if (universe.connections !== undefined && universe.connections !== null && !Array.isArray(universe.connections)) {
        return [{ field: "connections", message: "connections must be an array.", severity: "ERROR" }];
    }

    return [];

}

/* ---------- Fields Is Array ---------- */

function checkFieldsIsArray(universe: UnknownRecord): ValidationIssue[] {

    if (universe.fields !== undefined && universe.fields !== null && !Array.isArray(universe.fields)) {
        return [{ field: "fields", message: "fields must be an array.", severity: "ERROR" }];
    }

    return [];

}

/* ---------- Primary Export ---------- */

export function validateUniverse(universe: unknown): ValidationResult {

    if (!isObject(universe)) {
        return {
            valid: false,
            issues: [{ field: "root", message: "universe must be a non-null object.", severity: "ERROR" }]
        };
    }

    const issues: ValidationIssue[] = [
        ...checkRequiredFields(universe),
        ...checkNonEmptyStringField(universe, "id"),
        ...checkNonEmptyStringField(universe, "name"),
        ...checkNonEmptyStringField(universe, "axisId"),
        ...checkHarmonicIndex(universe),
        ...checkState(universe),
        ...checkBoundsIsObject(universe),
        ...checkTransformIsObject(universe),
        ...checkConnectionsIsArray(universe),
        ...checkFieldsIsArray(universe)
    ];

    return {
        valid: !issues.some(issue => issue.severity === "ERROR"),
        issues
    };

}
