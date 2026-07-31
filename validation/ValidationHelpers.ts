// validation/ValidationHelpers.ts
/**
 * validation/ValidationHelpers.ts
 *
 * Shared runtime-checking primitives used by every Group B
 * validator. Added because isObject/isNonEmptyString/
 * isFiniteNumber/isPoint3 were being independently duplicated
 * across all three validators, and the timestamp check
 * specifically had drifted to plain Date.parse() in a way
 * that didn't enforce this project's documented ISO 8601
 * timestamp policy (see IdentityModel.ts, SessionTypes.ts).
 *
 * Pure functions only. No classes. No engine logic. No
 * renderer logic. No side effects.
 */

export type UnknownRecord = Record<string, unknown>;

export function isObject(value: unknown): value is UnknownRecord {
    return typeof value === "object" && value !== null;
}

export function isNonEmptyString(value: unknown): value is string {
    return typeof value === "string" && value.trim().length > 0;
}

export function isFiniteNumber(value: unknown): value is number {
    return typeof value === "number" && Number.isFinite(value);
}

export function isPoint3(value: unknown): value is { x: number; y: number; z: number } {
    return (
        isObject(value) &&
        isFiniteNumber(value.x) &&
        isFiniteNumber(value.y) &&
        isFiniteNumber(value.z)
    );
}

/**
 * Project timestamp policy: ISO 8601, full date-time,
 * mandatory 'T' separator, mandatory zone designator (either
 * 'Z' or a +HH:mm / -HH:mm offset). Matches
 * Date.prototype.toISOString() output.
 *
 * Deliberately NOT "anything JavaScript's Date can parse" —
 * Date.parse() alone accepts a wide, implementation-dependent
 * range of formats, which would silently accept data that
 * violates the project's own documented format. The regex
 * enforces the format; Date.parse() afterward only guards
 * against calendar-invalid values the shape wouldn't catch.
 */
const ISO_8601_PATTERN = /^\d{4}-\d{2}-\d{2}T\d{2}:\d{2}:\d{2}(\.\d{1,3})?(Z|[+-]\d{2}:\d{2})$/;

export function isIso8601Timestamp(value: unknown): boolean {
    if (typeof value !== "string" || !ISO_8601_PATTERN.test(value)) {
        return false;
    }
    return !Number.isNaN(Date.parse(value));
}
