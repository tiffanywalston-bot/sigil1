// AudioModel.ts
/**
 * AudioModel.ts
 *
 * Data model only.
 * No classes.
 * No functions.
 * No calculations.
 * No engine logic.
 * No renderer logic.
 * No behavior.
 *
 * Represents stored audio data only — id references into
 * other stored records (mix, tracks, binaural, subliminal,
 * wav), not embedded objects.
 *
 * Reuses AudioPlaybackStatus from AudioTypes.ts rather than
 * redefining it.
 */

import type { AudioPlaybackStatus } from "./AudioTypes";

export interface AudioModel {

    readonly id: string;

    readonly mixId: string | null;

    readonly trackIds: string[];

    readonly binauralId: string | null;

    readonly subliminalId: string | null;

    readonly wavId: string | null;

    readonly sampleRate: number;

    readonly durationSeconds: number;

    readonly playbackStatus: AudioPlaybackStatus;

}
