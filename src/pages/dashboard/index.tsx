"use client";
import { useSession } from "next-auth/react";
import { useEffect, useRef, useState } from "react";
import ClientOnly from "src/components/ClientOnly";
import Navbar from "src/components/navbar/Navbar";
import ToasterProvider from "src/providers/ToasterProvider";
import Loading from "~/components/Loading";
import DashMain from "~/components/dashboard/DashMain";
import useLoginModal from "~/hooks/useLoginModal";
import usePuzzleStore from "~/hooks/usePuzzleStore";
import useUserModal from "~/hooks/useUserStore";
import LoginModal from "~/modals/LoginModal";
import UserProfile from "~/modals/UserProfile";
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
    console.log(session);
    if (session.status === "authenticated") {
      getUser.mutateAsync({ address: session.data.user.name });
    } else {
      // loginModal.onOpen();
    }
  }, [session]);
  // useEffect(() => {
  //   puzzle.setPuzzleFens([]);
  //   puzzle.setMoves([]);
  //   puzzle.setRanked(false);
  // }, []);
  return (
    <>
      <ClientOnly>
        <ToasterProvider />
        <Navbar />
        <LoginModal />
        <UserProfile />
      </ClientOnly>
      <main className="no-scrollbar flex h-[calc(100vh-112px)] flex-col items-center overflow-auto bg-green ">
        {loading ? <Loading /> : <DashMain />}
      </main>
    </>
  );
};

export default Home;
