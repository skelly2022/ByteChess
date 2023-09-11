import { create } from "zustand";

interface PlayModalStore {
  side: string;
  setSide: (side: string) => void;
  time: any;
  setTime: (time: any) => void;
  opponentTime: any;
  setOpponentTime: (time: any) => void;
  myTimer: boolean;
  setMyTimer: (running: boolean) => void;
  opponentTimer: boolean;
  setOpponentTimer: (running: boolean) => void;
  minutes: any;
  setMinutes: (minutes: any) => void;
  increment: string;
  setIncrement: (seconds: string) => void;
  opponent: any;
  setOpponent: (data: any) => void;
  fens: any;
  setFens: (fens: any) => void;
  isOpen: boolean;
  onOpen: () => void;
  onClose: () => void;
}

const usePlayModal = create<PlayModalStore>((set) => ({
  side: "",
  setSide: (side: string) => set({ side: side }),
  time: "",
  setTime: (time: any) => set({ time: time }),
  opponentTime: "",
  setOpponentTime: (time: any) => set({ opponentTime: time }),
  minutes: "",
  setMinutes: (minutes: string) => set({ minutes: minutes }),
  increment: "",
  setIncrement: (seconds: string) => set({ increment: seconds }),
  fens: ["rnbqkbnr/pppppppp/8/8/8/8/PPPPPPPP/RNBQKBNR w KQkq - 0 1"],
  setFens: (fens: any) => set({ fens: fens }),
  opponent: {
    id: "",
    walletAddress: "",
    puzzleRating: 1200,
    bulletRating: 1200,
    blitzRating: 1200,
    rapidRating: 1200,
    createdAt: "",
    completedPuzzles: [],
  },
  setOpponent: (data: any) => set({ opponent: data }),
  myTimer: false,
  setMyTimer: (running: boolean) => set({ myTimer: running }),
  opponentTimer: false,
  setOpponentTimer: (running: boolean) => set({ opponentTimer: running }),
  isOpen: false,
  onOpen: () => set({ isOpen: true }),
  onClose: () => {
    set({ isOpen: false });
  },
}));

export default usePlayModal;
