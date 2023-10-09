//@ts-nocheck
import { useRouter } from "next/router";
import useUserModal from "~/hooks/useUserStore";
import ModalGame from "~/modals/InGameModals/ModalGame";
import usePlayModal from "~/hooks/usePlayModal";
import useTournamentModal from "~/hooks/useTournamentModal";
import useDrawModal from "~/hooks/InGameModals/useDrawModal";

const ModalDraw = () => {
  const ModalDraw = useDrawModal();
  const user = useUserModal();
  const tournamentStore = useTournamentModal();
  const router = useRouter();
  const play = usePlayModal();

  function getGameType(timeControl) {
    // Split the string by the "+" sign
    const [minutes, increment] = timeControl.split("+").map(Number);

    if (minutes < 3) {
      return "Bullet";
    } else if (minutes < 10) {
      return "Blitz";
    } else {
      return "Rapid";
    }
  }
  const time = getGameType(play.minutes + " + " + play.increment);
  const bodyContent = (
    <div className="flex flex-col items-center justify-center gap-8 rounded-lg p-4 text-white shadow-lg">
      <h1 className="text-4xl font-bold">Congratulations</h1>
      {time === "Bullet" && (
        <h2 className="text-2xl font-bold">
          Your New Rank: {user.user.bulletRating}
        </h2>
      )}
      {time === "Blitz" && (
        <h2 className="text-2xl font-bold">
          Your New Rank: {user.user.blitzRating}
        </h2>
      )}
      {time === "Rapid" && (
        <h2 className="text-2xl font-bold">
          Your New Rank: {user.user.rapidRating}
        </h2>
      )}
      <div className="mt-4 grid grid-cols-2 gap-4">
        <button className="bg-yellow px-6 py-3 text-green">Rematch </button>
        <button className="bg-yellow px-6 py-3 text-green">New Opponent</button>
      </div>
      <div className="mt-4 grid grid-cols-1 gap-4">
        <button className="bg-yellow px-6 py-3 text-green">
          Mint your Game
        </button>
        <button className="bg-yellow px-6 py-3 text-green">Tweet It</button>
        {tournamentStore.tournamentID !== "" && (
          <button
            className="bg-yellow px-6 py-3 text-green"
            onClick={() => {
              router.push(`/tournaments/${tournamentStore.tournamentID}`);
              ModalDraw.onClose();
            }}
          >
            Return to Tournament{" "}
          </button>
        )}
      </div>
    </div>
  );

  const footerContent = <div className=" flex flex-col gap-4"></div>;

  return (
    <ModalGame
      //   disabled={isLoading}
      isOpen={ModalDraw.isOpen}
      title="Draw"
      actionLabel="Continue"
      onClose={ModalDraw.onClose}
      onSubmit={() => {}}
      body={bodyContent}
      footer={footerContent}
    />
  );
};

export default ModalDraw;
