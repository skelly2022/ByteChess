"use client";
import { useWallet } from "@solana/wallet-adapter-react";
import { useSession } from "next-auth/react";
import { useRouter } from "next/navigation";
import { useEffect, useRef, useState } from "react";
import { toast } from "react-hot-toast";
import ClientOnly from "src/components/ClientOnly";
import Navbar from "src/components/navbar/Navbar";
import PuzzlesMain from "src/components/puzzles/PuzzlesMain";
import ToasterProvider from "src/providers/ToasterProvider";
import Loading from "~/components/Loading";
import useLoginModal from "~/hooks/useLoginModal";
import usePuzzleStore from "~/hooks/usePuzzleStore";
import useUserModal from "~/hooks/useUserStore";
import LoginModal from "~/modals/LoginModal";
import { api } from "~/utils/api";

type Page = {
  Page: string;
};

const Home: React.FC<Page> = ({ Page }) => {
  const { publicKey } = useWallet();
  const [loading, setLoading] = useState(true);
  const puzzle = usePuzzleStore();
  const router = useRouter();
  const user = useUserModal();
  const loginModal = useLoginModal();
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
  // useEffect(() => {
  //   console.log(session);
  //   if (session.status === "authenticated") {
  //     getUser.mutateAsync({ address: session.data.user.name });
  //   } else {
  //     // loginModal.onOpen();
  //   }
  // }, [session]);
  return (
    <>
      <ClientOnly>
        <ToasterProvider />
        <Navbar />
        <LoginModal />
      </ClientOnly>
      <main
        className="fixed min-h-screen bg-gray-900  "
        style={{
          backgroundImage: `url(/images/1.jpg)`,
          backgroundSize: "cover",
          backgroundRepeat: "no-repeat",
          backgroundPosition: "center center",
        }}
      >
        {loading ? <Loading /> : <PuzzlesMain />}
      </main>
    </>
  );
};

export default Home;
