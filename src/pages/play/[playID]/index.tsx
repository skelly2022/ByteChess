import { useEffect, useRef, useState } from "react";
import ClientOnly from "src/components/ClientOnly";
import Navbar from "src/components/navbar/Navbar";
import LiveGameContainer from "src/components/play/LiveGameContainer";
import { useWallet } from "@solana/wallet-adapter-react";
import assets from "~/helpers/assets";
import ToasterProvider from "src/providers/ToasterProvider";
import { useRouter } from "next/router";
import { api } from "~/utils/api";
import joinGameLogic from "~/helpers/joinGameLogic";
import useUserStore from "~/hooks/useUserStore";
import socket from "~/helpers/socket";
import usePlayModal from "~/hooks/usePlayModal";
import { toast } from "react-hot-toast";
import Loading from "~/components/Loading";
import { useSession } from "next-auth/react";
import LoginModal from "~/modals/LoginModal";
import ModalWin from "~/modals/InGameModals/ModalWin";
import ModalDraw from "~/modals/InGameModals/ModalDraw";
import ModalLoss from "~/modals/InGameModals/ModalLoss";
import useWinModal from "~/hooks/InGameModals/useWinModal";
import UserProfile from "~/modals/UserProfile";
import useLossModal from "~/hooks/InGameModals/useLossModal";
import useDrawModal from "~/hooks/InGameModals/useDrawModal";
const { getRandomColor } = assets;
const { getOppositeColor } = joinGameLogic;

const Home = () => {
  const router = useRouter();
  const user = useUserStore();
  const [loading, setLoading] = useState(true);
  const session = useSession();
  const WinModal = useWinModal();
  const LossModal = useLossModal();
  const DrawModal = useDrawModal();
  const play = usePlayModal();
  const [boardOrientation, setBoardOrientation] = useState("black");
  const [connected, setConnected] = useState(false);
  const [gameID, setGameID] = useState("");
  const [gameType, setGameType] = useState("");
  const { playID } = router.query;
  const { publicKey } = useWallet();
  const getUser = api.example.getUser.useMutation({
    async onSuccess(data) {
      user.setUser(data);
      setTimeout(() => {
        setLoading(false);
      }, 400);
    },
    async onError(error) {
      console.log(error);
    },
  });
  const getGame2 = api.games.getGameTournament.useMutation({
    async onSuccess(data) {
      router.push(`/play/${data.id}`);
    },
    onError(error) {
      console.log(error);
    },
  });
  const newGame = api.games.newGame.useMutation({
    async onSuccess(data) {
      // socket.emit()
      router.push(`/play/${data.id}`);
    },
    onError(error) {
      console.log(error);
    },
  });
  const getGame = api.games.getGame.useMutation({
    async onSuccess(userData) {
      if (userData.gameOver === true) {
        toast.error("Game Over");
        router.push("/");
      }
      setGameID(userData.id);
      setGameType(userData.Time);

      const [minutes, seconds] = userData.Time.split("+").map((part) =>
        parseInt(part.trim()),
      );
      play.setMinutes(minutes);
      play.setIncrement(seconds.toString());

      socket.emit("username", { username: publicKey.toBase58() }, (r) => {});
      getPlayerSide(userData, publicKey.toBase58());
    },
    onError(error) {
      console.log(error);
    },
  });
  const getOpponent = api.example.getUser.useMutation({
    async onSuccess(userData) {
      play.setOpponent(userData);
    },
    async onError(error) {
      console.log(error);
    },
  });
  const updateGame = api.games.updatePlayerJoin.useMutation({
    async onSuccess(data) {},
    async onError(error) {
      console.log(error);
    },
  });
  const getPlayerSide = async (userData, myWalletAddress) => {
    const isMySide = userData.walletAddress === myWalletAddress;

    if (isMySide === true) {
      play.setSide(userData.Color);
      socket.emit(
        "createRoom",
        { roomId: userData.id, type: userData.Time },
        (data) => {
          if (data.lastMove === null) {
            return;
          } else {
            play.setCurrentFen(data.fen);
            if (data.lastMoveColor === null) {
              return;
            }
            if (data.lastMoveColor[0] === userData.Color[0]) {
              play.setOpponentTimer(true);
              if (data.lastMoveColor === "black") {
                play.setOpponentTime(
                  data.whiteTime -
                    (Date.now() - data.lastMoveBlack + 40) / 1000,
                );
                play.setTime(data.blackTime);
              } else {
                play.setOpponentTime(
                  data.blackTime -
                    (Date.now() - data.lastMoveWhite + 40) / 1000,
                );
                play.setTime(data.whiteTime);
              }
            } else {
              play.setMyTimer(true);
              if (data.lastMoveColor === "black") {
                play.setTime(
                  data.whiteTime -
                    (Date.now() - data.lastMoveBlack + 40) / 1000,
                );
                play.setOpponentTime(data.blackTime);
              } else {
                play.setTime(
                  data.blackTime -
                    (Date.now() - data.lastMoveWhite + 40) / 1000,
                );
                play.setOpponentTime(data.whiteTime);
              }
            }
          }
        },
      );
      const playerSide = isMySide
        ? userData.Color
        : getOppositeColor(userData.Color);
      setBoardOrientation(playerSide);
      if (userData.walletAddress2 !== "") {
        getOpponent.mutateAsync({ address: userData.walletAddress2 });
      }
    } else {
      const playerAddress2 = userData.walletAddress2;

      if (
        userData.walletAddress2 === "" ||
        userData.walletAddress2 === publicKey.toBase58()
      ) {
        if (userData.Color === "white") {
          play.setSide("black");
        }
        if (userData.Color === "black") {
          play.setSide("white");
        }
        socket.emit("joinRoom", { roomId: userData.id }, (data) => {
          if (data.lastMoveColor === null) {
            return;
          } else {
            play.setCurrentFen(data.fen);

            if (data.lastMoveColor[0] !== userData.Color[0]) {
              play.setOpponentTimer(true);
              if (data.lastMoveColor === "black") {
                play.setOpponentTime(
                  data.whiteTime -
                    (Date.now() - data.lastMoveBlack + 40) / 1000,
                );
                play.setTime(data.blackTime);
              } else {
                play.setOpponentTime(
                  data.blackTime -
                    (Date.now() - data.lastMoveWhite + 40) / 1000,
                );
                play.setTime(data.whiteTime);
              }
            } else {
              play.setMyTimer(true);
              if (data.lastMoveColor === "black") {
                play.setTime(
                  data.whiteTime - (Date.now() - data.lastMoveBlack) / 1000,
                );
                play.setOpponentTime(data.blackTime);
              } else {
                play.setTime(
                  data.blackTime - (Date.now() - data.lastMoveWhite) / 1000,
                );
                play.setOpponentTime(data.whiteTime);
              }
            }
          }
        });
        setBoardOrientation(getOppositeColor(userData.Color));
        const data = { address: userData.walletAddress };
        //@ts-ignore
        const updateData = {
          address: publicKey.toBase58(),
          id: playID.toString(),
        };
        getOpponent.mutateAsync(data);
        updateGame.mutateAsync(updateData);
      } else {
        toast.error("Game is full ");
      }

      // setBoardOrientation(getOppositeColor(userData.Color));
    }
  };

  useEffect(() => {
    socket.on("opponentJoined", (roomData) => {
      console.log("opponentJoined");
      const data = { address: roomData.username.username };
      getOpponent.mutateAsync(data);
      setConnected(true);
    });
    // socket.on("updateTime", (data) => {
    //   play.setOpponentTime(data);
    // });
    return () => {
      socket.off("opponentJoined");
    };
  }, [socket]);
  useEffect(() => {
    if (session.status === "authenticated") {
      getUser.mutateAsync({ address: session.data.user.name });
    } else {
      // loginModal.onOpen();
    }
  }, [session]);
  useEffect(() => {
    if (publicKey !== null && playID !== undefined) {
      setConnected(false);

      const data = { id: playID.toString() };
      getGame.mutateAsync(data);
    }
  }, [playID, publicKey]);

  useEffect(() => {
    play.setRematch();
    LossModal.onClose();
    WinModal.onClose();
    DrawModal.onClose();
  }, []);
  useEffect(() => {
    socket.on("matchedUp", (data) => {
      console.log("matchedUp");
      toast.success("Match Found");
      play.resetState();
      LossModal.onClose();
      WinModal.onClose();
      DrawModal.onClose();
      const dataToSend = {
        id: data.opponentWallet,
      };
      setTimeout(() => {
        getGame2.mutateAsync(dataToSend);
      }, 2000);
    });
    return () => {
      socket.off("matchedUp");
    };
  }, []);
  useEffect(() => {
    socket.on("matched", (roomData) => {
      console.log("matched");

      LossModal.onClose();
      WinModal.onClose();
      play.resetState();
      toast.success("Match Found");
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
  return (
    <>
      <ClientOnly>
        <ToasterProvider />
        <Navbar />
        <LoginModal />
        <ModalWin />
        <ModalLoss />
        <UserProfile />
        <ModalDraw />
      </ClientOnly>
      <main className="no-scrollbar flex min-h-[calc(100vh-112px)] flex-col items-center overflow-auto bg-green ">
        <div className="no-scrollbar h-full w-full  ">
          {loading ? (
            <Loading />
          ) : (
            <LiveGameContainer
              boardOrientation={boardOrientation}
              connected={connected}
              gameType={gameType}
            />
          )}
        </div>
      </main>
    </>
  );
};

export default Home;
