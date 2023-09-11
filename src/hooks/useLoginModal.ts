import { create } from "zustand";

interface LoginModalStore {
  pk: string;
  setPk: (pk: string) => void;
  isOpen: boolean;
  onOpen: () => void;
  onClose: () => void;
}

const useLoginModal = create<LoginModalStore>((set) => ({
  pk: "",
  setPk: (pk: string) => set({ pk: pk }),
  isOpen: false,
  onOpen: () => set({ isOpen: true }),
  onClose: () => {
    set({ isOpen: false });
  },
}));

export default useLoginModal;
