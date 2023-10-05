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
    data.mutateAsync({ id: tournamentID });
  }, []);
  return (
    <>
      <ClientOnly>
        <ToasterProvider />
        <Navbar />
        <LoginModal />
        <TournamentModal />
      </ClientOnly>
      <main
        className="min-w-screen   no-scrollbar  flex min-h-screen overflow-auto bg-green "
        // style={{
        //   backgroundImage: `url(/images/1.png)`,
        //   backgroundSize: "cover",
        //   backgroundRepeat: "no-repeat",
        //   backgroundPosition: "center center",
        // }}
      >
        <div className="no-scrollbar h-screen w-full  pt-28">
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
