import { create } from "zustand";

interface PuzzleStore {
  ranked: boolean;
  setRanked: (loading: boolean) => void;
  sign: string;
  setSign: (sign: string) => void;
  correct: boolean;
  loading: boolean;
  puzzleFen: any;
  side: string;
  puzzleMoves: [];
  puzzleFens: [];
  setLoading: (loading: boolean) => void;
  setPuzzleFens: (puzzleFens: any) => void;
  onCorrect: () => void;
  onFalse: () => void;
  setSide: (side: any) => void;

  setPuzzle: (puzzle: any) => void;
  setPuzzleMoves: (move: any) => void;
}

const usePuzzleStore = create<PuzzleStore>((set) => ({
  ranked: false,
  setRanked: (loading: boolean) => set({ ranked: loading }),
  sign: "",
  setSign: (sign: any) => {
    set({ sign: sign });
  },
  correct: true,
  loading: true,
  side: "",
  setSide: (side: any) => {
    set({ side: side });
  },

  setLoading: (loading: boolean) => set({ loading: loading }),
  puzzleFens: [],
  setPuzzleFens: (puzzleFens: any) => {
    set({ puzzleFens: puzzleFens });
  },
  puzzleFen: "rnbqkbnr/pppppppp/8/8/8/8/PPPPPPPP/RNBQKBNR w KQkq - 0 1",
  puzzleMoves: [],
  onCorrect: () => set({ correct: true }),
  onFalse: () => {
    set({ correct: false });
  },
  setPuzzle: (puzzleFen: any) => {
    set({ puzzleFen: puzzleFen });
  },
  setPuzzleMoves: (puzzleMove: any) => {
    set({ puzzleMoves: puzzleMove });
  },
}));

export default usePuzzleStore;
