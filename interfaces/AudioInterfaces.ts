/**
 * AudioInterfaces.ts
 *
 * Shared audio contracts for Sigil1.
 * Interfaces only.
 * No types, enums, classes, or implementation.
 * No audio processing logic.
 *
 * Audio implementations will be written later.
 */

import type {
    Identifiable,
    Initializable,
    Updatable,
    Disposable,
    Engine
} from "./EngineInterfaces";

/* ---------- Audio Player ---------- */

export interface AudioPlayer extends Identifiable, Updatable {

    playing: boolean;

    position: number;

    play(): void;

    pause(): void;

    stop(): void;

    seek(position: number): void;

}

/* ---------- Audio Recorder ---------- */

export interface AudioRecorder extends Identifiable {

    recording: boolean;

    start(): void;

    stop(): void;

}

/* ---------- Audio Analyzer ---------- */

export interface AudioAnalyzer extends Identifiable, Updatable {

    analyzing: boolean;

    analyze(): void;

}

/* ---------- Binaural Generator ---------- */

export interface BinauralGenerator extends Identifiable {

    enabled: boolean;

    setBeatFrequency(frequency: number): void;

    generate(): void;

}

/* ---------- Subliminal Generator ---------- */

export interface SubliminalGenerator extends Identifiable {

    enabled: boolean;

    setContent(content: string): void;

    generate(): void;

}

/* ---------- WAV Exporter ---------- */

export interface WAVExporter extends Identifiable {

    exporting: boolean;

    export(): void;

}

/* ---------- Audio Track ---------- */

export interface AudioTrack extends Identifiable, Updatable {

    name: string;

    volume: number;

    muted: boolean;

    play(): void;

    pause(): void;

    stop(): void;

    setVolume(volume: number): void;

}

/* ---------- Audio Mixer ---------- */

export interface AudioMixer extends Identifiable, Updatable {

    tracks: AudioTrack[];

    masterGain: number;

    addTrack(track: AudioTrack): void;

    removeTrack(trackId: string): void;

    setMasterGain(gain: number): void;

}

/* ---------- Audio Session ---------- */

export interface AudioSession extends Identifiable, Initializable, Disposable {

    active: boolean;

    mixer: AudioMixer;

    player: AudioPlayer;

    recorder: AudioRecorder;

    start(): void;

    end(): void;

}

/* ---------- Audio Engine ---------- */

export interface AudioEngine
    extends Identifiable, Initializable, Updatable, Disposable {

    engine: Engine;

    mixer: AudioMixer;

    player: AudioPlayer;

    recorder: AudioRecorder;

    analyzer: AudioAnalyzer;

    binaural: BinauralGenerator;

    subliminal: SubliminalGenerator;

    wavExporter: WAVExporter;

    session: AudioSession | null;

}
