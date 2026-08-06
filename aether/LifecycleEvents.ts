// aether/LifecycleEvents.ts
//
// Constitutional lifecycle event types.
// Types only. No dispatcher, no implementation.

export type BeforeGenesisEvent = {
  type: "BeforeGenesis";
};

export type AfterGenesisEvent = {
  type: "AfterGenesis";
};

export type BeforeShutdownEvent = {
  type: "BeforeShutdown";
};

export type AfterShutdownEvent = {
  type: "AfterShutdown";
};

export type LifecycleEvent =
  | BeforeGenesisEvent
  | AfterGenesisEvent
  | BeforeShutdownEvent
  | AfterShutdownEvent;
