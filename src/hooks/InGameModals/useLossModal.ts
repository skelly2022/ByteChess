import { create } from "zustand";

interface LossModalStore {
  isOpen: boolean;
  onOpen: () => void;
  onClose: () => void;
}

const useLossModal = create<LossModalStore>((set) => ({
  isOpen: false,
  onOpen: () => set({ isOpen: true }),
  onClose: () => {
    set({ isOpen: false });
  },
}));

export default useLossModal;
