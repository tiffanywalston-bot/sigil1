// foundation/ReflectiveGuidance.ts

import {
  FoundationLayer,
  FoundationLayerId,
  FoundationLayerState,
  ReflectiveGuidanceState,
  ReflectiveOutputMode,
  ReflectivePrompt,
  ReflectivePromptCategory,
  PrimaryAttunementPreset,
} from "./FoundationTypes";

const PROMPT_LIBRARY: Record<ReflectivePromptCategory, ReflectivePrompt[]> = {
  Centering: [
    {
      id: "centering-1",
      category: "Centering",
      content: "Notice your breath and gently return attention to the present moment.",
    },
    {
      id: "centering-2",
      category: "Centering",
      content: "Scan your body from head to toe, observing sensations without judgment.",
    },
  ],
  Reflection: [
    {
      id: "reflection-1",
      category: "Reflection",
      content: "What felt meaningful today, even in a small way?",
    },
    {
      id: "reflection-2",
      category: "Reflection",
      content: "Which emotion is most present right now, and what might it be asking of you?",
    },
  ],
  Decision: [
    {
      id: "decision-1",
      category: "Decision",
      content: "What outcome matters most to you in this decision?",
    },
    {
      id: "decision-2",
      category: "Decision",
      content: "If you imagine yourself looking back in a year, what choice feels aligned?",
    },
  ],
  Integration: [
    {
      id: "integration-1",
      category: "Integration",
      content: "What is one insight you want to carry forward from this moment?",
    },
    {
      id: "integration-2",
      category: "Integration",
      content: "How can you translate today’s learning into a small, concrete action?",
    },
  ],
};

export class ReflectiveGuidance implements FoundationLayer {
  readonly id: FoundationLayerId = "guidance";
  private state: ReflectiveGuidanceState = {
    category: "Centering",
    mode: "silent",
    currentPrompt: null,
  };

  getState(): FoundationLayerState {
    return { guidance: { ...this.state } };
  }

  setCategory(category: ReflectivePromptCategory): void {
    this.state.category = category;
    this.state.currentPrompt = this.selectPrompt(category);
  }

  setMode(mode: ReflectiveOutputMode): void {
    this.state.mode = mode;
    if (mode === "silent") {
      this.state.currentPrompt = null;
    } else if (!this.state.currentPrompt) {
      this.state.currentPrompt = this.selectPrompt(this.state.category);
    }
  }

  private selectPrompt(category: ReflectivePromptCategory): ReflectivePrompt {
    const prompts = PROMPT_LIBRARY[category];
    return prompts[0];
  }

  applyAttunement(preset: PrimaryAttunementPreset): void {
    const { intensity } = preset.controls;
    if (intensity < 0.3) {
      this.setMode("silent");
    } else if (intensity < 0.6) {
      this.setMode("text");
    } else {
      this.setMode("voice");
    }
  }

  updateFromRuntime(state: FoundationLayerState): void {
    if (state.guidance) {
      this.state = { ...this.state, ...state.guidance };
    }
  }

  // Voice-ready backend integration point:
  // Host runtime can attach TTS/voice pipeline to this method.
  buildVoicePayload(): { text: string | null; category: ReflectivePromptCategory } {
    return {
      text: this.state.currentPrompt?.content ?? null,
      category: this.state.category,
    };
  }
}
