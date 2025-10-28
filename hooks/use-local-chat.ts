import { create } from "zustand";
import { persist } from "zustand/middleware";

type LocalChatState = {
  localModelId: string;
  isHistoryOpen: boolean;
  setLocalModelId: (id: string) => void;
  onToggleHistory: () => void;
};

export const useLocalChat = create<LocalChatState>()(
  persist(
    (set, get) => ({
      localModelId: "",
      isHistoryOpen: false,
      setLocalModelId: (id) => set({ localModelId: id }),
      onToggleHistory: () => set({ isHistoryOpen: !get().isHistoryOpen }),
    }),
    {
      name: "local-chat",
    }
  )
);
