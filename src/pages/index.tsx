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
      <main
        className="no-scrollbar  flex min-h-screen flex-col 
         overflow-auto bg-green pt-20"
        // style={{
        //   backgroundImage: `url(/images/white.jpg)`,
        //   backgroundSize: "cover",
        //   backgroundRepeat: "no-repeat",
        //   backgroundPosition: "center center",
        // }}
      >
        <LandingPage />
      </main>
    </>
  );
}
