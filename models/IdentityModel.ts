// IdentityModel.ts
/**
 * IdentityModel.ts
 *
 * Data model only.
 * No classes.
 * No functions.
 * No calculations.
 * No engine logic.
 * No renderer logic.
 * No behavior.
 *
 * Timestamps are ISO 8601 strings, matching the convention
 * used by SessionTypes.ts (SessionParticipant.joinedAt,
 * SessionGoal.createdAt).
 */

export interface Identity {

    readonly id: string;

    readonly name: string;

    readonly role: string;

    readonly sigilId: string | null;

    readonly frequencyProfileId: string | null;

    readonly journalId: string | null;

    readonly preferencesId: string | null;

    readonly active: boolean;

    readonly createdAt: string;

    readonly updatedAt: string;

}
