/**
 * SessionTypes.ts
 *
 * Shared session data types for Sigil1.
 * No logic.
 * No classes.
 * No functions.
 * Types only.
 */

/* ---------- Session Mode ---------- */

export type SessionMode =
    | "SOLO"
    | "SHARED";

/* ---------- Session State ---------- */

export type SessionState =
    | "IDLE"
    | "ACTIVE"
    | "PAUSED"
    | "COMPLETE";

/* ---------- Session Identity ---------- */

export interface SessionIdentity {

    id: string;

    label: string;

    anchorId: string;

    color: string;

}

/* ---------- Session Participant ---------- */

export interface SessionParticipant {

    id: string;

    identity: SessionIdentity;

    joinedAt: string;

    active: boolean;

}

/* ---------- Session Goal ---------- */

export interface SessionGoal {

    id: string;

    content: string;

    ownerId: string;

    achieved: boolean;

    createdAt: string;

}

/* ---------- Session Timing ---------- */

export interface SessionTiming {

    startTime: string | null;

    endTime: string | null;

    durationMinutes: number;

}

/* ---------- Session Settings ---------- */

export interface SessionSettings {

    mode: SessionMode;

    maxParticipants: number;

    audioMixId: string | null;

    universeId: string | null;

}

/* ---------- Session Result ---------- */

export interface SessionResult {

    sessionId: string;

    completed: boolean;

    goalsAchieved: string[];

    summary: string;

}

/* ---------- Session Summary ---------- */

export interface SessionSummary {

    sessionId: string;

    mode: SessionMode;

    participantCount: number;

    goalCount: number;

    goalsAchievedCount: number;

    state: SessionState;

    timing: SessionTiming;

}

/* ---------- Session ---------- */

export interface Session {

    id: string;

    mode: SessionMode;

    state: SessionState;

    participants: SessionParticipant[];

    goals: SessionGoal[];

    settings: SessionSettings;

    timing: SessionTiming;

    result: SessionResult | null;

}
