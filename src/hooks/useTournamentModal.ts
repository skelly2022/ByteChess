import { create } from "zustand";

interface tournamentModalStore {
  myID: any;
  setMyID: (id: any) => void;
  tournamentID: any;
  setTournamentID: (id: any) => void;
  tournamentStatus: any;
  setTournamentStatus: (status: any) => void;
  image: any;
  setTournamentImage: (image: any) => void;
  tournaments: any;
  setTournaments: (tournaments: any) => void;
  name: string;
  setName: (name: string) => void;
  type: string;
  setType: (type: string) => void;
  duration: string;
  setDuration: (duration: string) => void;
  date: any;
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
  myID: "",
  setMyID: (id: any) => {
    set({ myID: id });
  },
  tournamentID: "",
  tournamentStatus: "",
  setTournamentID: (id: any) => {
    set({ tournamentID: id });
  },
  setTournamentStatus: (status: any) => {
    set({ tournamentStatus: status });
  },
  image: "",
  setTournamentImage: (image: any) => {
    set({ image: image });
  },
  tournaments: [],
  setTournaments: (tournaments: any) => {
    set({ tournaments: tournaments });
  },
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
  date: new Date(),
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
