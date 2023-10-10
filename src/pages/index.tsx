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

export default function Home() {
  const user = useUserModal();
  const session = useSession();
  const play = usePlayModal();
  const loginModal = useLoginModal();
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
      socket.emit("userConnected", session.data.user.name);
    } else {
      loginModal.onOpen();
    }
  }, [session]);
  useEffect(() => {
    play.resetState();
  }, []);
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
