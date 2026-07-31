/**
 * AudioTypes.ts
 *
 * Shared audio data types for Sigil1.
 * No logic.
 * No classes.
 * No functions.
 * No Web Audio API types.
 * Types only.
 */

import type { Frequency, HarmonicWave } from "./HarmonicTypes";

/* ---------- Audio Channel ---------- */

export type AudioChannel =
    | "LEFT"
    | "RIGHT"
    | "STEREO";

/* ---------- Audio Frame ---------- */

export interface AudioFrame {

    index: number;

    time: number;

    left: number;

    right: number;

}

/* ---------- Audio Buffer ---------- */

export interface AudioBuffer {

    id: string;

    sampleRate: number;

    channels: number;

    frames: AudioFrame[];

    durationSeconds: number;

}

/* ---------- WAV Data ---------- */

export interface WAVData {

    format: "PCM";

    sampleRate: number;

    bitDepth: number;

    channels: number;

    buffer: AudioBuffer;

}

/* ---------- Binaural Beat ---------- */

export interface BinauralBeat {

    id: string;

    leftFrequency: Frequency;

    rightFrequency: Frequency;

    beatFrequency: number;

    enabled: boolean;

}

/* ---------- Subliminal Layer ---------- */

export interface SubliminalLayer {

    id: string;

    content: string;

    gain: number;

    audibleThreshold: number;

    enabled: boolean;

}

/* ---------- Audio Track ---------- */

export interface AudioTrack {

    id: string;

    name: string;

    harmonics: HarmonicWave;

    binaural: BinauralBeat | null;

    subliminal: SubliminalLayer | null;

    volume: number;

    muted: boolean;

}

/* ---------- Audio Mix ---------- */

export interface AudioMix {

    id: string;

    tracks: AudioTrack[];

    masterGain: number;

    durationSeconds: number;

}

/* ---------- Audio Export ---------- */

export interface AudioExport {

    filename: string;

    mimeType: string;

    wav: WAVData;

    exportedAt: string;

}

/* ---------- Audio State ---------- */

export type AudioPlaybackStatus =
    | "IDLE"
    | "PLAYING"
    | "PAUSED"
    | "RENDERING"
    | "EXPORTED";

export interface AudioState {

    status: AudioPlaybackStatus;

    currentMix: AudioMix | null;

    position: number;

    loop: boolean;

}
