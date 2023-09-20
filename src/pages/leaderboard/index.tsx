import ClientOnly from "src/components/ClientOnly";
import Navbar from "src/components/navbar/Navbar";
import ToasterProvider from "src/providers/ToasterProvider";
import LoginModal from "src/modals/LoginModal";
import LandingPage from "src/components/home/LandingPage";
import PlayFriend from "src/modals/PlayFriend";
import { useEffect } from "react";
import usePlayModal from "~/hooks/usePlayModal";
import LeaderboardContainer from "~/components/leaderboard/LeaderBoardContainer";

export default function Home() {
  const play = usePlayModal();
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
      </ClientOnly>
      <main
        className="no-scrollbar flex min-h-screen flex-col items-center overflow-auto"
        style={{
          backgroundImage: `url(/images/2.jpg)`,
          backgroundSize: "cover",
          backgroundRepeat: "no-repeat",
          backgroundPosition: "center center",
        }}
      >
        <LeaderboardContainer />
      </main>
    </>
  );
}
