// aether/EngineState.ts
//
// Constitutional engine lifecycle state representation.
// No runtime or subsystem logic. State only.

export enum EngineState {
  CREATED = "CREATED",
  INITIALIZING = "INITIALIZING",
  RUNNING = "RUNNING",
  PAUSED = "PAUSED",
  SHUTTING_DOWN = "SHUTTING_DOWN",
  STOPPED = "STOPPED",
  ERROR = "ERROR",
}
