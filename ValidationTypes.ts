// ValidationTypes.ts
/**
 * ValidationTypes.ts
 *
 * Shared validation contracts used by every Group B
 * validator (IdentityValidator.ts, SessionValidator.ts,
 * UniverseValidator.ts, AudioValidator.ts,
 * RendererValidator.ts, HarmonicValidator.ts).
 *
 * TypeScript only.
 * Types/interfaces only.
 * No classes.
 * No functions.
 * No engine logic.
 * No renderer logic.
 * No calculations.
 * No validation implementation — this file defines the
 * shape validators return, not how any validator decides
 * what's valid.
 */

/* ---------- Validation Severity ---------- */

export type ValidationSeverity =
    | "ERROR"
    | "WARNING"
    | "INFO";

/* ---------- Validation Issue ---------- */

export interface ValidationIssue {

    readonly field: string;

    readonly message: string;

    readonly severity: ValidationSeverity;

}

/* ---------- Validation Result ---------- */

export interface ValidationResult {

    readonly valid: boolean;

    readonly issues: readonly ValidationIssue[];

}
