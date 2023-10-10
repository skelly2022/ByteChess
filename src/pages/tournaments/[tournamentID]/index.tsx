"use client";
//@ts-nocheck
import { useSession } from "next-auth/react";
import { useRouter } from "next/router";
import { useEffect, useRef, useState } from "react";
import ClientOnly from "src/components/ClientOnly";
import Navbar from "src/components/navbar/Navbar";
import PuzzlesMain from "src/components/puzzles/PuzzlesMain";
import ToasterProvider from "src/providers/ToasterProvider";
import Loading from "~/components/Loading";
import SingleTournament from "~/components/tournaments/SingleTournament";
import TouramentContainer from "~/components/tournaments/TournamentContainer";
import useLoginModal from "~/hooks/useLoginModal";
import usePuzzleStore from "~/hooks/usePuzzleStore";
import useUserModal from "~/hooks/useUserStore";
import LoginModal from "~/modals/LoginModal";
import TournamentModal from "~/modals/TournamentModal";
import Tournament from "~/modals/TournamentModal";
import UserProfile from "~/modals/UserProfile";
import { api } from "~/utils/api";

type Page = {
  Page: string;
};

const Home: React.FC<Page> = ({ Page }) => {
  const router = useRouter();
  const tournamentID = Array.isArray(router.query.tournamentID)
    ? router.query.tournamentID[0]
    : router.query.tournamentID;
  const [loading, setLoading] = useState(true);
  const [lobbyData, setLobbyData] = useState<any>();

  const data = api.tournament.getTournament.useMutation({
    //@ts-ignore
    onSuccess(data) {
      setLoading(false);

      setLobbyData(data);
    },
    onError(error) {
      console.log(error);
    },
  });
  console.log(data);
  console.log(tournamentID);
  const user = useUserModal();
  const session = useSession();
  const getUser = api.example.getUser.useMutation({
    onSuccess(data) {
      console.log(data);
      user.setUser(data);
    },
    onError(error) {
      console.log(error);
    },
  });

  useEffect(() => {
    console.log(session);
    if (session.status === "authenticated") {
      getUser.mutateAsync({ address: session.data.user.name });
    } else {
      // loginModal.onOpen();
    }
  }, [session]);
  useEffect(() => {
    console.log(tournamentID);
    data.mutateAsync({ id: tournamentID });
  }, []);
  return (
    <>
      <ClientOnly>
        <ToasterProvider />
        <Navbar />
        <LoginModal />
        <UserProfile />

        <TournamentModal />
      </ClientOnly>
      <main className="no-scrollbar flex h-[calc(100vh-112px)] flex-col items-center overflow-auto bg-green ">
        <div className="no-scrollbar h-full w-full  ">
          {loading ? (
            <Loading />
          ) : (
            <SingleTournament
              tournament={lobbyData.tournament}
              players={lobbyData.players}
            />
          )}
        </div>
      </main>
    </>
  );
};

export default Home;
