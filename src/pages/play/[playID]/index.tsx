import { useEffect, useRef, useState } from "react";
import ClientOnly from "src/components/ClientOnly";
import Navbar from "src/components/navbar/Navbar";
import LiveGameContainer from "src/components/play/LiveGameContainer";
import { useWallet } from "@solana/wallet-adapter-react";

import ToasterProvider from "src/providers/ToasterProvider";
import { useRouter } from "next/router";
import { api } from "~/utils/api";
import joinGameLogic from "~/helpers/joinGameLogic";
import useUserStore from "~/hooks/useUserStore";
import socket from "~/helpers/socket";
import usePlayModal from "~/hooks/usePlayModal";
import { toast } from "react-hot-toast";

const { categorizeChessGame, getOppositeColor } = joinGameLogic;

const Home = () => {
  const router = useRouter();
  const user = useUserStore();

  const play = usePlayModal();
  const [boardOrientation, setBoardOrientation] = useState("black");
  const [connected, setConnected] = useState(false);
  const [gameID, setGameID] = useState("");
  const { playID } = router.query;
  const { publicKey } = useWallet();
  const getGame = api.games.getGame.useMutation({
    async onSuccess(userData) {
      setGameID(userData.id);
      const [minutes, seconds] = userData.Time.split("+").map((part) =>
        parseInt(part.trim()),
      );
      play.setMinutes(minutes);
      socket.emit("username", { username: publicKey.toBase58() }, (r) => {});
      getPlayerSide(userData, publicKey.toBase58());
    },
  });
  const getOpponent = api.example.getUser.useMutation({
    async onSuccess(userData) {
      play.setOpponent(userData);
    },
  });
  const updateGame = api.games.updatePlayerJoin.useMutation({
    async onSuccess(data) {},
  });
  const getPlayerSide = async (userData, myWalletAddress) => {
    const isMySide = userData.walletAddress === myWalletAddress;

    if (isMySide === true) {
      socket.emit("createRoom", { roomId: userData.id }, () => {});
      const playerSide = isMySide
        ? userData.Color
        : getOppositeColor(userData.Color);
      setBoardOrientation(userData.Color);
      if (userData.walletAddress2 !== "") {
        getOpponent.mutateAsync({ address: userData.walletAddress2 });
      }
    } else {
      const playerAddress2 = userData.walletAddress2;

      if (
        userData.walletAddress2 === "" ||
        userData.walletAddress2 === publicKey.toBase58()
      ) {
        socket.emit("joinRoom", { roomId: userData.id });
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
    if (play.time !== "" && play.minutes !== "") {
      if (play.time > play.minutes) {
        const data = { time: play.time, roomId: gameID };
        socket.emit("time", data);
      }
    }
  }, [play.time]);
  useEffect(() => {
    socket.on("opponentJoined", (roomData) => {
      const data = { address: roomData.username.username };
      getOpponent.mutateAsync(data);
      setConnected(true);
    });
    socket.on("updateTime", (data) => {
      play.setOpponentTime(data);
    });
  }, [socket]);

  useEffect(() => {
    if (publicKey !== null && playID !== undefined) {
      setConnected(false);

      const data = { id: playID.toString() };
      getGame.mutateAsync(data);
    }
  }, [playID, publicKey]);

  return (
    <>
      <ClientOnly>
        <ToasterProvider />
        <Navbar />
      </ClientOnly>
      <main className="min-w-screen  flex min-h-screen bg-blue pt-28">
        <LiveGameContainer
          boardOrientation={boardOrientation}
          connected={connected}
        />
      </main>
    </>
  );
};

export default Home;
