import { create } from "zustand";

interface ProfileModalStore {
  pk: string;
  setPk: (pk: string) => void;
  isOpen: boolean;
  onOpen: () => void;
  onClose: () => void;
}

const useProfileModal = create<ProfileModalStore>((set) => ({
  pk: "",
  setPk: (pk: string) => set({ pk: pk }),
  isOpen: false,
  onOpen: () => set({ isOpen: true }),
  onClose: () => {
    set({ isOpen: false });
  },
}));

export default useProfileModal;
