"use client";
import { useSession } from "next-auth/react";
import { useEffect, useRef, useState } from "react";
import ClientOnly from "src/components/ClientOnly";
import Navbar from "src/components/navbar/Navbar";
import PuzzlesMain from "src/components/puzzles/PuzzlesMain";
import ToasterProvider from "src/providers/ToasterProvider";
import Loading from "~/components/Loading";
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
  const [loading, setLoading] = useState(true);
  const puzzle = usePuzzleStore();
  const user = useUserModal();
  const session = useSession();
  const getUser = api.example.getUser.useMutation({
    onSuccess(data) {
      console.log(data);
      user.setUser(data);
      setLoading(false);
    },
  });

  useEffect(() => {
    puzzle.setPuzzleFens([]);
    puzzle.setMoves([]);
    puzzle.setRanked(false);
  }, []);
  useEffect(() => {
    console.log(session);
    if (session.status === "authenticated") {
      getUser.mutateAsync({ address: session.data.user.name });
    } else {
      // loginModal.onOpen();
    }
  }, [session]);
  return (
    <>
      <ClientOnly>
        <ToasterProvider />
        <Navbar />
        <LoginModal />
        <TournamentModal />
      </ClientOnly>
      <main
        className="min-w-screen   bg-green  no-scrollbar overflow-aut flex min-h-screen "
        // style={{
        //   backgroundImage: `url(/images/1.png)`,
        //   backgroundSize: "cover",
        //   backgroundRepeat: "no-repeat",
        //   backgroundPosition: "center center",
        // }}
      >
        <div className="no-scrollbar h-full w-full  pt-28">
          {loading ? <Loading /> : <TouramentContainer />}
        </div>
      </main>
    </>
  );
};

export default Home;
