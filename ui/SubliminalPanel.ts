// ui/SubliminalPanel.ts

/**
 * SubliminalPanel
 *
 * Display + troubleshooting surface for subliminal generation.
 *
 * This file contains NO audio logic. It generates nothing, mixes
 * nothing and encodes nothing: it calls
 * SubliminalCapability.composeAndExport() and renders the
 * SubliminalReport that comes back. All audio work happens in
 * AudioRuntime / CompositionRuntime / WavEncoder / AudioExporter,
 * exactly as before.
 *
 * The repository had no UI layer at all (index.html previously held
 * only a canvas and a loading overlay), so this is a new file by
 * necessity — but it duplicates no existing system.
 */

import type { Session } from "../SessionTypes";
import type { SubliminalLayer } from "../AudioTypes";
import { AUDIO } from "../AudioConstants";
import {
  SubliminalCapability,
  type SubliminalReport,
} from "../capabilities/audio/SubliminalCapability";

type El = {
  textContent: string;
  innerHTML: string;
  style: { display: string };
  value?: string;
  disabled?: boolean;
  addEventListener(type: string, handler: () => void): void;
  appendChild(child: unknown): void;
};

function byId(id: string): El | null {
  const doc = (globalThis as Record<string, unknown>).document as
    | { getElementById(id: string): El | null }
    | undefined;
  return doc ? doc.getElementById(id) : null;
}

function row(label: string, value: string | number | boolean): string {
  return `<div class="sub-row"><span>${label}</span><span>${String(value)}</span></div>`;
}

export class SubliminalPanel {
  /** Renders a report into #subliminal-output. */
  static render(report: SubliminalReport): void {
    const out = byId("subliminal-output");
    if (!out) return;

    const warnings: string[] = [...report.notes];
    if (report.maskedByMix) {
      warnings.push("Layer RMS is under 10% of the mix — effectively inaudible.");
    }

    out.innerHTML = [
      row("Layer", report.layerId),
      row("Words", report.wordCount),
      row("Carrier", `${report.carrierFrequencyHz.toFixed(2)} Hz`),
      row("Duration", `${report.durationSeconds.toFixed(2)} s`),
      row("Samples", report.sampleCount),
      row("Gain requested", report.requestedGain),
      row("Gain applied", report.appliedGain),
      row("Gain clamped", report.gainWasClamped),
      row("Layer peak", report.layerPeak.toFixed(5)),
      row("Layer RMS", report.layerRms.toFixed(5)),
      row("Mixed peak", report.mixedPeak.toFixed(5)),
      row("Mixed RMS", report.mixedRms.toFixed(5)),
      row("Below threshold", report.belowAudibleThreshold),
      row("Masked by mix", report.maskedByMix),
      // Stated in the UI, not just in code comments: this layer is
      // not speech and cannot be heard as words.
      row("Is speech", "no — carrier layer, not synthesized voice"),
      warnings.length
        ? `<div class="sub-warn">${warnings.map((w) => `• ${w}`).join("<br>")}</div>`
        : "",
    ].join("");

    out.style.display = "block";
  }

  /**
   * Wires the Generate button. Composition and WAV encoding are
   * delegated to the existing pipeline via SubliminalCapability.
   */
  static attach(getSession: () => Session | null): void {
    const button = byId("subliminal-generate");
    const contentInput = byId("subliminal-content");
    const gainInput = byId("subliminal-gain");
    if (!button) return;

    button.addEventListener("click", () => {
      const session = getSession();
      const out = byId("subliminal-output");

      if (!session) {
        if (out) {
          out.innerHTML =
            '<div class="sub-warn">No active session — cannot compose.</div>';
          out.style.display = "block";
        }
        return;
      }

      const layer: SubliminalLayer = {
        id: "ui-subliminal",
        content: (contentInput && contentInput.value) || "",
        gain: Number((gainInput && gainInput.value) ?? AUDIO.SUBLIMINAL.DEFAULT_GAIN),
        audibleThreshold: AUDIO.SUBLIMINAL.DEFAULT_GAIN,
        enabled: true,
      };

      try {
        const { export: encoded, report } =
          SubliminalCapability.composeAndExport(session, layer);
        SubliminalPanel.render(report);
        SubliminalPanel.offerDownload(encoded.manifest.filename, encoded.bytes);
      } catch (error) {
        if (out) {
          out.innerHTML = `<div class="sub-warn">Generation failed: ${
            error instanceof Error ? error.message : String(error)
          }</div>`;
          out.style.display = "block";
        }
      }
    });
  }

  /** Exposes the encoded WAV produced by the existing exporter. */
  private static offerDownload(filename: string, bytes: ArrayBuffer): void {
    const scope = globalThis as Record<string, unknown>;
    const BlobCtor = scope.Blob as
      | (new (parts: unknown[], options?: { type?: string }) => unknown)
      | undefined;
    const urlApi = scope.URL as { createObjectURL(v: unknown): string } | undefined;
    const link = byId("subliminal-download") as
      | (El & { href: string; download: string })
      | null;

    if (!BlobCtor || !urlApi || !link) return;

    link.href = urlApi.createObjectURL(
      new BlobCtor([bytes], { type: AUDIO.EXPORT.MIME_TYPE })
    );
    link.download = filename;
    link.textContent = `Download ${filename}`;
    link.style.display = "inline-block";
  }
}
