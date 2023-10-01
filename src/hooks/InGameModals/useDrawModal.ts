import { create } from "zustand";

interface DrawModalStore {
  isOpen: boolean;
  onOpen: () => void;
  onClose: () => void;
}

const useDrawModal = create<DrawModalStore>((set) => ({
  isOpen: false,
  onOpen: () => set({ isOpen: true }),
  onClose: () => {
    set({ isOpen: false });
  },
}));

export default useDrawModal;
