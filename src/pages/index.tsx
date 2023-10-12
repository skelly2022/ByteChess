import ClientOnly from "src/components/ClientOnly";
import Navbar from "src/components/navbar/Navbar";
import ToasterProvider from "src/providers/ToasterProvider";
import LoginModal from "src/modals/LoginModal";
import LandingPage from "src/components/home/LandingPage";
import PlayFriend from "src/modals/PlayFriend";
import { useEffect } from "react";
import usePlayModal from "~/hooks/usePlayModal";
import { api } from "~/utils/api";
import useUserModal from "~/hooks/useUserStore";
import { useSession } from "next-auth/react";
import UserProfile from "~/modals/UserProfile";
import socket from "~/helpers/socket";
import useLoginModal from "~/hooks/useLoginModal";
import Head from "next/head";
import assets from "~/helpers/assets";
import { useRouter } from "next/router";
import toast from "react-hot-toast";

const { getRandomColor, getTimeControlFromString } = assets;

export default function Home() {
  const user = useUserModal();
  const session = useSession();
  const router = useRouter();
  const play = usePlayModal();
  const loginModal = useLoginModal();
  const getUser = api.example.getUser.useMutation({
    onSuccess(data) {
      user.setUser(data);
    },
    onError(error) {
      console.log(error);
    },
  });
  const getGame = api.games.getGameTournament.useMutation({
    async onSuccess(data) {
      const [minutes, seconds] = data.Time.split("+").map((part) =>
        parseInt(part.trim()),
      );
      play.setMinutes(minutes);
      play.setIncrement(seconds.toString());
      router.push(`/play/${data.id}`);
    },
    onError(error) {
      console.log(error);
    },
  });
  const newGame = api.games.newGame.useMutation({
    async onSuccess(data) {
      // socket.emit()
      const [minutes, seconds] = data.Time.split("+").map((part) =>
        parseInt(part.trim()),
      );
      play.setMinutes(minutes);
      play.setIncrement(seconds.toString());
      router.push(`/play/${data.id}`);
    },
    onError(error) {
      console.log(error);
    },
  });
  useEffect(() => {
    if (session.status === "authenticated") {
      getUser.mutateAsync({ address: session.data.user.name });
      socket.emit("userConnected", session.data.user.name);
    } else {
      loginModal.onOpen();
    }
  }, [session]);
  useEffect(() => {
    play.resetState();
  }, []);
  useEffect(() => {
    socket.on("matchedUp", (data) => {
      toast.success("Match Found");
      const dataToSend = {
        id: data.opponentWallet,
      };
      setTimeout(() => {
        getGame.mutateAsync(dataToSend);
      }, 2000);
    });
    return () => {
      socket.off("matchedUp");
    };
  }, []);
  useEffect(() => {
    socket.on("matched", (roomData) => {
      toast.success("Match Found");
      console.log("hey");
      console.log(roomData);
      const data = {
        address: roomData.opponentWallet,
        mode: "Rated",
        time: roomData.type,
        color: getRandomColor("wb"),
      };
      newGame.mutateAsync(data);
    });

    return () => {
      socket.off("matched");
    };
  }, []);
  useEffect(() => {
    if (session.status === "authenticated") {
      play.resetState();
      socket.emit(
        "pageLoad",
        { address: session.data.user.name },
        (response) => {
          console.log("Response from server:", response);
        },
      );
    } else {
    }

    return () => {
      socket.off("pageLoad");
    };
  }, [session]);
  return (
    <>
      <ClientOnly>
        <ToasterProvider />
        <LoginModal />
        <PlayFriend />
        <Navbar />
        <UserProfile />
      </ClientOnly>
      <Head>
        <link
          href="https://fonts.googleapis.com/css2?family=Orbitron:wght@400;500;600;700;800;900&display=swap"
          rel="stylesheet"
        />
      </Head>
      <main className="no-scrollbar flex min-h-[calc(100vh-112px)] flex-col items-center overflow-auto bg-green ">
        <LandingPage />
      </main>
    </>
  );
}
