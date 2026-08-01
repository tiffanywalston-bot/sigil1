// validation/RendererValidator.ts
/**
 * validation/RendererValidator.ts
 *
 * Validation only.
 * Pure functions only.
 * No classes.
 * No engine logic.
 * No renderer logic.
 * No persistence.
 * No side effects.
 *
 * Reuses the RendererModel shape from ../RendererModel.ts
 * (for documentation/reference), the shared result contract
 * from ../ValidationTypes.ts, and the shared runtime-checking
 * primitives from ./ValidationHelpers.ts.
 *
 * validateRenderer() takes `unknown`, not RendererModel.
 *
 * sceneId/activeCameraId are id references (per
 * RendererModel.ts's own docs) and are checked for shape
 * only (null or non-empty string) — no lookup against any
 * scene/camera collection, since that would be a cross-model
 * lookup.
 *
 * lightIds/materialIds are checked element-by-element (each
 * must be a non-empty string), because RendererModel declares
 * them as primitive string[] — the same reasoning as
 * AudioValidator.ts's trackIds check.
 *
 * renderSettings/renderState are checked only for being
 * objects, not validated field-by-field. RendererModel.ts
 * embeds full RenderSettings/RenderState objects rather than
 * ids, but per the shallow-nested-object precedent already
 * set by UniverseValidator.ts (bounds/transform are also only
 * checked for being objects, not validated field-by-field),
 * this file follows the same pattern rather than reaching
 * into RendererTypes.ts's RenderSettings/RenderState shapes.
 *
 * Note: RenderStatus ("IDLE" | "RENDERING" | "PAUSED" |
 * "ERROR", part of RenderState in ../RendererTypes.ts) is not
 * checked here at all, since renderState itself is only
 * validated as "is an object" — consistent with the shallow
 * treatment above. If deeper RenderState validation is wanted
 * later, it likely belongs in a dedicated file rather than
 * folded back in here.
 *
 * Export only validateRenderer(). All helper functions are
 * private to this file.
 */

import type { ValidationIssue, ValidationResult } from "../ValidationTypes";
import { isObject, isNonEmptyString, UnknownRecord } from "./ValidationHelpers";

/* ---------- Required Fields ---------- */

function checkRequiredFields(renderer: UnknownRecord): ValidationIssue[] {

    const issues: ValidationIssue[] = [];

    if (renderer.id === undefined || renderer.id === null) {
        issues.push({ field: "id", message: "id is required.", severity: "ERROR" });
    }

    if (renderer.sceneId === undefined) {
        issues.push({ field: "sceneId", message: "sceneId is required (may be null, but not absent).", severity: "ERROR" });
    }

    if (renderer.activeCameraId === undefined) {
        issues.push({ field: "activeCameraId", message: "activeCameraId is required (may be null, but not absent).", severity: "ERROR" });
    }

    if (renderer.lightIds === undefined || renderer.lightIds === null) {
        issues.push({ field: "lightIds", message: "lightIds is required.", severity: "ERROR" });
    }

    if (renderer.materialIds === undefined || renderer.materialIds === null) {
        issues.push({ field: "materialIds", message: "materialIds is required.", severity: "ERROR" });
    }

    if (renderer.renderSettings === undefined || renderer.renderSettings === null) {
        issues.push({ field: "renderSettings", message: "renderSettings is required.", severity: "ERROR" });
    }

    if (renderer.renderState === undefined || renderer.renderState === null) {
        issues.push({ field: "renderState", message: "renderState is required.", severity: "ERROR" });
    }

    return issues;

}

/* ---------- Non-Empty id ---------- */

function checkId(renderer: UnknownRecord): ValidationIssue[] {

    if (renderer.id !== undefined && renderer.id !== null && !isNonEmptyString(renderer.id)) {
        return [{ field: "id", message: "id must be a non-empty string.", severity: "ERROR" }];
    }

    return [];

}

/* ---------- Nullable String Reference Fields ---------- */

function checkNullableStringField(renderer: UnknownRecord, field: string): ValidationIssue[] {

    const value = renderer[field];

    if (value !== undefined && value !== null && !isNonEmptyString(value)) {
        return [{ field, message: `${field} must be either null or a non-empty string.`, severity: "ERROR" }];
    }

    return [];

}

/* ---------- Array-of-String Fields ---------- */

function checkStringArrayField(renderer: UnknownRecord, field: string): ValidationIssue[] {

    const value = renderer[field];

    if (value === undefined || value === null) {
        return [];
    }

    if (!Array.isArray(value)) {
        return [{ field, message: `${field} must be an array.`, severity: "ERROR" }];
    }

    const issues: ValidationIssue[] = [];

    (value as unknown[]).forEach((entry, index) => {

        if (!isNonEmptyString(entry)) {
            issues.push({
                field: `${field}[${index}]`,
                message: `each ${field} entry must be a non-empty string.`,
                severity: "ERROR"
            });
        }

    });

    return issues;

}

/* ---------- renderSettings / renderState: Object Presence ---------- */

function checkIsObjectField(renderer: UnknownRecord, field: string): ValidationIssue[] {

    const value = renderer[field];

    if (value !== undefined && value !== null && !isObject(value)) {
        return [{ field, message: `${field} must be an object.`, severity: "ERROR" }];
    }

    return [];

}

/* ---------- Primary Export ---------- */

export function validateRenderer(renderer: unknown): ValidationResult {

    if (!isObject(renderer)) {
        return {
            valid: false,
            issues: [{ field: "root", message: "renderer must be a non-null object.", severity: "ERROR" }]
        };
    }

    const issues: ValidationIssue[] = [
        ...checkRequiredFields(renderer),
        ...checkId(renderer),
        ...checkNullableStringField(renderer, "sceneId"),
        ...checkNullableStringField(renderer, "activeCameraId"),
        ...checkStringArrayField(renderer, "lightIds"),
        ...checkStringArrayField(renderer, "materialIds"),
        ...checkIsObjectField(renderer, "renderSettings"),
        ...checkIsObjectField(renderer, "renderState")
    ];

    return {
        valid: !issues.some(issue => issue.severity === "ERROR"),
        issues
    };

}
