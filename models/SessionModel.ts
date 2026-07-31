// SessionModel.ts
/**
 * SessionModel.ts
 *
 * Data model only.
 * No classes.
 * No functions.
 * No calculations.
 * No engine logic.
 * No renderer logic.
 * No behavior.
 *
 * Reuses SessionMode, SessionState, SessionParticipant, and
 * SessionGoal from SessionTypes.ts rather than redefining
 * them — this is a flatter model shape (mode/universeId/
 * audioMixId/startTime/endTime at the top level instead of
 * nested under settings/timing), not a competing definition
 * of what those individual pieces are.
 */

import type {
    SessionMode,
    SessionState,
    SessionParticipant,
    SessionGoal
} from "./SessionTypes";

export interface Session {

    readonly id: string;

    readonly participants: SessionParticipant[];

    readonly activeIdentityId: string | null;

    readonly mode: SessionMode;

    readonly goals: SessionGoal[];

    readonly universeId: string | null;

    readonly audioMixId: string | null;

    readonly state: SessionState;

    readonly startTime: string | null;

    readonly endTime: string | null;

}
