// validation/IdentityValidator.ts
/**
 * validation/IdentityValidator.ts
 *
 * Validation only.
 * Pure functions only.
 * No classes.
 * No engine logic.
 * No renderer logic.
 * No persistence.
 * No side effects.
 *
 * Reuses the Identity shape from ../IdentityModel.ts (for
 * documentation/reference), the shared result contract from
 * ../ValidationTypes.ts, and the shared runtime-checking
 * primitives from ./ValidationHelpers.ts (including the
 * project's ISO 8601 timestamp policy).
 *
 * validateIdentity() takes `unknown`, not Identity: the
 * point of this file is to check data that may not actually
 * satisfy the Identity shape yet (parsed JSON, localStorage,
 * an external source).
 *
 * Only validateIdentity() is exported. The per-field checks
 * are internal helpers, not part of the public surface.
 */

import type { ValidationIssue, ValidationResult } from "./ValidationTypes";
import { isObject, isNonEmptyString, isIso8601Timestamp, UnknownRecord } from "./ValidationHelpers";

/* ---------- Required Fields ---------- */

function checkRequiredFields(identity: UnknownRecord): ValidationIssue[] {

    const issues: ValidationIssue[] = [];

    if (identity.id === undefined || identity.id === null) {
        issues.push({ field: "id", message: "id is required.", severity: "ERROR" });
    }

    if (identity.name === undefined || identity.name === null) {
        issues.push({ field: "name", message: "name is required.", severity: "ERROR" });
    }

    if (identity.role === undefined || identity.role === null) {
        issues.push({ field: "role", message: "role is required.", severity: "ERROR" });
    }

    if (typeof identity.active !== "boolean") {
        issues.push({ field: "active", message: "active is required and must be a boolean.", severity: "ERROR" });
    }

    if (identity.createdAt === undefined || identity.createdAt === null) {
        issues.push({ field: "createdAt", message: "createdAt is required.", severity: "ERROR" });
    }

    if (identity.updatedAt === undefined || identity.updatedAt === null) {
        issues.push({ field: "updatedAt", message: "updatedAt is required.", severity: "ERROR" });
    }

    return issues;

}

/* ---------- Non-Empty id ---------- */

function checkId(identity: UnknownRecord): ValidationIssue[] {

    if (identity.id !== undefined && identity.id !== null && !isNonEmptyString(identity.id)) {
        return [{ field: "id", message: "id must be a non-empty string.", severity: "ERROR" }];
    }

    return [];

}

/* ---------- Non-Empty name ---------- */

function checkName(identity: UnknownRecord): ValidationIssue[] {

    if (identity.name !== undefined && identity.name !== null && !isNonEmptyString(identity.name)) {
        return [{ field: "name", message: "name must be a non-empty string.", severity: "ERROR" }];
    }

    return [];

}

/* ---------- Timestamps ---------- */

function checkTimestamps(identity: UnknownRecord): ValidationIssue[] {

    const issues: ValidationIssue[] = [];

    if (identity.createdAt !== undefined && identity.createdAt !== null && !isIso8601Timestamp(identity.createdAt)) {
        issues.push({ field: "createdAt", message: "createdAt must be an ISO 8601 timestamp string (e.g. 2024-01-15T14:30:00.000Z).", severity: "ERROR" });
    }

    if (identity.updatedAt !== undefined && identity.updatedAt !== null && !isIso8601Timestamp(identity.updatedAt)) {
        issues.push({ field: "updatedAt", message: "updatedAt must be an ISO 8601 timestamp string (e.g. 2024-01-15T14:30:00.000Z).", severity: "ERROR" });
    }

    if (
        isIso8601Timestamp(identity.createdAt) &&
        isIso8601Timestamp(identity.updatedAt) &&
        Date.parse(identity.updatedAt as string) < Date.parse(identity.createdAt as string)
    ) {
        issues.push({ field: "updatedAt", message: "updatedAt must not be earlier than createdAt.", severity: "WARNING" });
    }

    return issues;

}

/* ---------- Optional Reference Ids ---------- */

function checkReferenceIds(identity: UnknownRecord): ValidationIssue[] {

    const issues: ValidationIssue[] = [];

    const referenceFields = [
        "sigilId",
        "frequencyProfileId",
        "journalId",
        "preferencesId"
    ];

    for (const field of referenceFields) {

        const value = identity[field];

        if (value !== null && value !== undefined && !isNonEmptyString(value)) {
            issues.push({
                field,
                message: `${field} must be either null or a non-empty string.`,
                severity: "ERROR"
            });
        }

    }

    return issues;

}

/* ---------- Primary Export ---------- */

export function validateIdentity(identity: unknown): ValidationResult {

    if (!isObject(identity)) {
        return {
            valid: false,
            issues: [{ field: "root", message: "identity must be a non-null object.", severity: "ERROR" }]
        };
    }

    const issues: ValidationIssue[] = [
        ...checkRequiredFields(identity),
        ...checkId(identity),
        ...checkName(identity),
        ...checkTimestamps(identity),
        ...checkReferenceIds(identity)
    ];

    return {
        valid: !issues.some(issue => issue.severity === "ERROR"),
        issues
    };

}
