import { create } from "zustand";

interface WaitingModalStore {
  pk: string;
  setPk: (pk: string) => void;
  isOpen: boolean;
  onOpen: () => void;
  onClose: () => void;
}

const useWaitingModal = create<WaitingModalStore>((set) => ({
  pk: "",
  setPk: (pk: string) => set({ pk: pk }),
  isOpen: false,
  onOpen: () => set({ isOpen: true }),
  onClose: () => {
    set({ isOpen: false });
  },
}));

export default useWaitingModal;