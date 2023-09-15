import { create } from "zustand";

interface userModalStore {
  user: {};
  setUser: (puzzle: any) => void;
}

const useUserModal = create<userModalStore>((set) => ({
  user: {
    id: "",
    walletAddress: "",
    puzzleRating: 1200,
    bulletRating: 1200,
    blitzRating: 1200,
    rapidRating: 1200,
    createdAt: "",
    completedPuzzles: [],
    ratedAccount: false,
  },
  setUser: (user: any) => {
    set({ user: user });
  },
}));

export default useUserModal;
