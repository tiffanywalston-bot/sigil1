// aether/StartupResult.ts
//
// Constitutional startup result returned from Genesis.
// Data only. No logic.

import type { Aether } from "./Aether";
import { EngineState } from "./EngineState";

// Use the existing repository validation contract.
// Do NOT redefine ValidationIssue.
import type { ValidationIssue } from "../validation/ValidationTypes";

export interface StartupMessage {
  readonly level: "info" | "warning" | "error";
  readonly text: string;
}

export interface StartupResult {
  readonly aether: Aether | null;
  readonly state: EngineState;
  readonly success: boolean;
  readonly messages: readonly StartupMessage[];
  readonly validationIssues?: readonly ValidationIssue[];
}
