// runtime/AudioExporter.ts

/**
 * runtime/AudioExporter.ts
 *
 * Export layer.
 *
 * Turns encoded WAV bytes into the repository's declared
 * AudioExport shape, and (in a browser) into a downloadable file.
 *
 * Reused from the repository, nothing redeclared:
 *   - AudioTypes.ts       AudioBuffer, AudioExport, WAVData
 *   - AudioConstants.ts   AUDIO.EXPORT.DEFAULT_FILENAME,
 *                         AUDIO.EXPORT.MIME_TYPE,
 *                         AUDIO.WAV.EXTENSION
 *   - runtime/WavEncoder  encodeWav(), toWavData()
 *
 * Sample generation (runtime/AudioRuntime.ts) and encoding
 * (runtime/WavEncoder.ts) are not duplicated here — this file
 * only packages their output.
 *
 * Scope notes:
 *
 *   1. buildExport() is environment-independent: it produces an
 *      AudioExport plus raw bytes and touches no browser API. It
 *      is the function non-browser callers should use.
 *
 *   2. downloadWav() is the only browser-dependent function in
 *      this file. It feature-detects Blob/URL/document rather than
 *      assuming them, and throws a clear error if called outside a
 *      browser. No DOM types are imported, so this file does not
 *      add a DOM lib requirement to the repository's compile.
 *
 *   3. Node/filesystem writing is deliberately not implemented.
 *      The repository contains no filesystem usage anywhere and
 *      index.html loads the engine as a browser module; adding a
 *      Node write path would be new architecture, not reuse.
 */

import type {
    AudioBuffer as SigilAudioBuffer,
    AudioExport,
    WAVData
} from "../AudioTypes";

import { AUDIO } from "../AudioConstants";
import { WavEncoder } from "./WavEncoder";

export interface EncodedAudioExport {

    /** Matches AudioTypes.AudioExport exactly. */
    readonly manifest: AudioExport;

    /** Raw RIFF/WAVE PCM bytes produced by WavEncoder. */
    readonly bytes: ArrayBuffer;

}

function ensureWavExtension(filename: string): string {

    const extension = AUDIO.WAV.EXTENSION;

    return filename.toLowerCase().endsWith(extension)
        ? filename
        : `${filename}${extension}`;

}

export class AudioExporter {

    private constructor() {

        // Static utility class only — never instantiated, matching
        // the convention of AudioRuntime and WavEncoder.

    }

    /**
     * Encodes an AudioBuffer and packages it as an AudioExport
     * manifest plus the raw bytes. No browser API is used.
     */
    static buildExport(
        buffer: SigilAudioBuffer,
        filename: string = AUDIO.EXPORT.DEFAULT_FILENAME
    ): EncodedAudioExport {

        const bytes = WavEncoder.encodeWav(buffer);

        const wav: WAVData = WavEncoder.toWavData(buffer);

        const manifest: AudioExport = {
            filename: ensureWavExtension(filename),
            mimeType: AUDIO.EXPORT.MIME_TYPE,
            wav,
            exportedAt: new Date().toISOString()
        };

        return { manifest, bytes };

    }

    /**
     * Browser-only. Encodes the buffer and triggers a download of
     * the resulting .wav file. Returns the AudioExport manifest
     * describing what was written.
     */
    static downloadWav(
        buffer: SigilAudioBuffer,
        filename: string = AUDIO.EXPORT.DEFAULT_FILENAME
    ): AudioExport {

        const globalScope = globalThis as Record<string, unknown>;

        const BlobCtor = globalScope.Blob as
            | (new (parts: unknown[], options?: { type?: string }) => unknown)
            | undefined;

        const urlApi = globalScope.URL as
            | { createObjectURL(value: unknown): string; revokeObjectURL(url: string): void }
            | undefined;

        const doc = globalScope.document as
            | {
                  createElement(tag: string): {
                      href: string;
                      download: string;
                      style: { display: string };
                      click(): void;
                  };
                  body: {
                      appendChild(node: unknown): void;
                      removeChild(node: unknown): void;
                  };
              }
            | undefined;

        if (!BlobCtor || !urlApi || !doc) {
            throw new Error(
                "AudioExporter.downloadWav: requires a browser environment (Blob, URL, and document). Use buildExport() instead."
            );
        }

        const { manifest, bytes } = AudioExporter.buildExport(buffer, filename);

        const blob = new BlobCtor([bytes], { type: manifest.mimeType });

        const objectUrl = urlApi.createObjectURL(blob);

        const anchor = doc.createElement("a");

        anchor.href = objectUrl;
        anchor.download = manifest.filename;
        anchor.style.display = "none";

        doc.body.appendChild(anchor);
        anchor.click();
        doc.body.removeChild(anchor);

        urlApi.revokeObjectURL(objectUrl);

        return manifest;

    }

}
