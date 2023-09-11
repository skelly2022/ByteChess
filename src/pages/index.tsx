import ClientOnly from "src/components/ClientOnly";
import Navbar from "src/components/navbar/Navbar";
import ToasterProvider from "src/providers/ToasterProvider";
import LoginModal from "src/modals/LoginModal";
import LandingPage from "src/components/home/LandingPage";
import PlayFriend from "src/modals/PlayFriend";

export default function Home() {
  return (
    <>
      <ClientOnly>
        <ToasterProvider />
        <LoginModal />
        <PlayFriend />
        <Navbar />
      </ClientOnly>
      <main className="no-scrollbar flex min-h-screen flex-col items-center justify-center overflow-auto  bg-gray-900">
        <LandingPage />
      </main>
    </>
  );
}
