import { create } from "zustand";
import type { Proof, ProofStep } from "../types/graph";
import { longestPathCycleProof } from "../proofs/longestPathCycle";
import { fiveColorTheoremProof } from "../proofs/fiveColorTheorem";

interface ProofState {
  currentProof: Proof | null;
  currentStepIndex: number;
  proofs: Proof[];
  setCurrentProof: (proof: Proof) => void;
  nextStep: () => void;
  previousStep: () => void;
  resetProof: () => void;
}

export const useProofStore = create<ProofState>((set) => ({
  currentProof: null,
  currentStepIndex: 0,
  proofs: [longestPathCycleProof, fiveColorTheoremProof],
  setCurrentProof: (proof) => set({ currentProof: proof, currentStepIndex: 0 }),
  nextStep: () =>
    set((state) => ({
      currentStepIndex:
        state.currentProof &&
        state.currentStepIndex < state.currentProof.steps.length - 1
          ? state.currentStepIndex + 1
          : state.currentStepIndex,
    })),
  previousStep: () =>
    set((state) => ({
      currentStepIndex:
        state.currentStepIndex > 0 ? state.currentStepIndex - 1 : 0,
    })),
  resetProof: () => set({ currentStepIndex: 0 }),
}));
