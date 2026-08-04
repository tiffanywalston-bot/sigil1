// runtime/WavEncoder.ts

/**
 * runtime/WavEncoder.ts
 *
 * WAV encoding layer.
 *
 * Converts the repository's existing AudioBuffer (AudioTypes.ts)
 * into RIFF/WAVE PCM bytes.
 *
 * This is the layer that was missing between in-memory sample
 * math and binary output. It introduces no audio mathematics:
 * sample generation remains entirely the responsibility of
 * runtime/AudioRuntime.ts, and all wave/frequency/harmonic math
 * remains in math/. This file only quantizes, interleaves, and
 * serializes samples that already exist.
 *
 * Reused from the repository, nothing redeclared:
 *   - AudioTypes.ts       AudioBuffer, AudioFrame, WAVData
 *   - AudioConstants.ts   AUDIO.SAMPLE_RATE, BIT_DEPTH, CHANNELS,
 *                         WAV.FORMAT
 *
 * Scope notes:
 *
 *   1. Only 16-bit PCM is implemented. AUDIO.BIT_DEPTH is 16 and
 *      AUDIO.WAV.FORMAT is "PCM"; no other bit depth or format is
 *      declared anywhere in the repository, so none is invented
 *      here. encodeWav() throws rather than silently mis-encoding
 *      if given a buffer whose bit depth is anything else.
 *
 *   2. Only stereo (2-channel) output is implemented, because
 *      AudioTypes.AudioFrame declares every frame as left+right
 *      with no mono variant, and AUDIO.CHANNELS is 2. A mono
 *      source can be encoded by passing the same samples as both
 *      channels (AudioRuntime.assembleAudioBuffer already
 *      documents this).
 *
 *   3. This file returns bytes (ArrayBuffer). It does not write
 *      files, trigger downloads, or touch the DOM — that is
 *      runtime/AudioExporter.ts's responsibility.
 */

import type { AudioBuffer as SigilAudioBuffer, WAVData } from "../AudioTypes";
import { AUDIO } from "../AudioConstants";

/** Bytes in a canonical RIFF/WAVE PCM header. */
const WAV_HEADER_BYTES = 44;

/** PCM format code in the fmt chunk. */
const PCM_FORMAT_CODE = 1;

/** Bounds of a signed 16-bit sample. */
const INT16_MAX = 32767;
const INT16_MIN = -32768;

function writeAscii(view: DataView, offset: number, text: string): void {

    for (let i = 0; i < text.length; i++) {
        view.setUint8(offset + i, text.charCodeAt(i));
    }

}

/**
 * Clamps a float sample to [-1, 1] and quantizes it to signed
 * 16-bit. Clamping prevents wraparound distortion when a mixed
 * buffer exceeds unity — AudioRuntime.normalizeBuffer() exists to
 * avoid that upstream, but this layer must not corrupt output if
 * it was skipped.
 */
function floatToInt16(sample: number): number {

    if (!Number.isFinite(sample)) {
        return 0;
    }

    const clamped = Math.max(-1, Math.min(1, sample));

    const scaled = Math.round(clamped * INT16_MAX);

    return Math.max(INT16_MIN, Math.min(INT16_MAX, scaled));

}

export class WavEncoder {

    private constructor() {

        // Static utility class only — never instantiated, matching
        // the convention of WaveMath, FrequencyMath, HarmonicMath,
        // and AudioRuntime.

    }

    /**
     * Wraps an existing AudioBuffer in the repository's declared
     * WAVData shape. No encoding happens here — this only records
     * format metadata alongside the buffer.
     */
    static toWavData(buffer: SigilAudioBuffer): WAVData {

        return {
            format: AUDIO.WAV.FORMAT,
            sampleRate: buffer.sampleRate,
            bitDepth: AUDIO.BIT_DEPTH,
            channels: buffer.channels,
            buffer
        };

    }

    /**
     * Encodes an AudioBuffer into a complete RIFF/WAVE PCM file as
     * raw bytes.
     *
     * Layout produced (44-byte header + interleaved 16-bit LE PCM):
     *   "RIFF" | chunkSize | "WAVE"
     *   "fmt " | 16 | audioFormat=1 | numChannels | sampleRate
     *          | byteRate | blockAlign | bitsPerSample
     *   "data" | dataSize | <samples>
     */
    static encodeWav(buffer: SigilAudioBuffer): ArrayBuffer {

        if (!buffer || !Array.isArray(buffer.frames)) {
            throw new Error("WavEncoder.encodeWav: buffer.frames must be an array.");
        }

        if (buffer.frames.length === 0) {
            throw new Error("WavEncoder.encodeWav: buffer.frames must not be empty.");
        }

        if (!Number.isFinite(buffer.sampleRate) || buffer.sampleRate <= 0) {
            throw new Error("WavEncoder.encodeWav: buffer.sampleRate must be a positive finite number.");
        }

        if (buffer.channels !== AUDIO.CHANNELS) {
            throw new Error(
                `WavEncoder.encodeWav: only ${AUDIO.CHANNELS}-channel audio is supported (received ${buffer.channels}).`
            );
        }

        if (AUDIO.BIT_DEPTH !== 16) {
            throw new Error(
                `WavEncoder.encodeWav: only 16-bit PCM is implemented (AUDIO.BIT_DEPTH is ${AUDIO.BIT_DEPTH}).`
            );
        }

        const numChannels = buffer.channels;
        const sampleRate = buffer.sampleRate;
        const bitsPerSample = AUDIO.BIT_DEPTH;

        const bytesPerSample = bitsPerSample / 8;
        const blockAlign = numChannels * bytesPerSample;
        const byteRate = sampleRate * blockAlign;

        const frameCount = buffer.frames.length;
        const dataSize = frameCount * blockAlign;
        const totalSize = WAV_HEADER_BYTES + dataSize;

        const arrayBuffer = new ArrayBuffer(totalSize);
        const view = new DataView(arrayBuffer);

        /* ---------- RIFF chunk descriptor ---------- */

        writeAscii(view, 0, "RIFF");
        view.setUint32(4, totalSize - 8, true);
        writeAscii(view, 8, "WAVE");

        /* ---------- fmt subchunk ---------- */

        writeAscii(view, 12, "fmt ");
        view.setUint32(16, 16, true);
        view.setUint16(20, PCM_FORMAT_CODE, true);
        view.setUint16(22, numChannels, true);
        view.setUint32(24, sampleRate, true);
        view.setUint32(28, byteRate, true);
        view.setUint16(32, blockAlign, true);
        view.setUint16(34, bitsPerSample, true);

        /* ---------- data subchunk ---------- */

        writeAscii(view, 36, "data");
        view.setUint32(40, dataSize, true);

        let offset = WAV_HEADER_BYTES;

        for (let i = 0; i < frameCount; i++) {

            const frame = buffer.frames[i];

            view.setInt16(offset, floatToInt16(frame.left), true);
            offset += bytesPerSample;

            view.setInt16(offset, floatToInt16(frame.right), true);
            offset += bytesPerSample;

        }

        return arrayBuffer;

    }

}
