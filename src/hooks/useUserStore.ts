import { create } from "zustand";

interface LoginModalStore {
  user: {};
  setUser: (puzzle: any) => void;
}

const useLoginModal = create<LoginModalStore>((set) => ({
  user: {
    id: "",
    walletAddress: "",
    puzzleRating: 1200,
    bulletRating: 1200,
    blitzRating: 1200,
    rapidRating: 1200,
    createdAt: "",
    completedPuzzles: [],
  },
  setUser: (user: any) => {
    set({ user: user });
  },
}));

export default useLoginModal;
