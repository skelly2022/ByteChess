import { create } from "zustand";

interface tournamentModalStore {
  name: string;
  setName: (name: string) => void;
  type: string;
  setType: (type: string) => void;
  duration: string;
  setDuration: (duration: string) => void;
  date: string;
  setDate: (date: any) => void;
  startTime: string;
  setStartTime: (time: string) => void;
  isOpen: boolean;
  onOpen: () => void;
  onClose: () => void;
  selectedGame: string;
  setSelectedGame: (game: string) => void;
}

const useTournamentModal = create<tournamentModalStore>((set) => ({
  name: "",
  setName: (name: string) => {
    set({ name: name });
  },
  type: "",
  setType: (type: string) => {
    set({ type: type });
  },
  duration: "",
  setDuration: (duration: string) => {
    set({ duration: duration });
  },
  date: "",
  setDate: (date: any) => {
    set({ date: date });
  },
  startTime: "",
  setStartTime: (time: string) => {
    set({ startTime: time });
  },
  isOpen: false,
  onOpen: () => set({ isOpen: true }),
  onClose: () => {
    set({ isOpen: false });
  },
  selectedGame: "",
  setSelectedGame: (game: string) => {
    set({ selectedGame: game });
  },
}));

export default useTournamentModal;
