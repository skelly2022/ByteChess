import { create } from "zustand";

interface WinModalStore {
  pk: string;
  setPk: (pk: string) => void;
  isOpen: boolean;
  onOpen: () => void;
  onClose: () => void;
}

const useWinModal = create<WinModalStore>((set) => ({
  pk: "",
  setPk: (pk: string) => set({ pk: pk }),
  isOpen: false,
  onOpen: () => set({ isOpen: true }),
  onClose: () => {
    set({ isOpen: false });
  },
}));

export default useWinModal;
