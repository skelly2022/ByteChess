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
    avatar:
      "https://ipfs.io/ipfs/QmQ5TWTtXoKeupMucMUuss8pCbt3ZyyfV3frCKPjzzJXQf/35…",
  },
  setUser: (user: any) => {
    set({ user: user });
  },
}));

export default useUserModal;
