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

const { categorizeChessGame, getOppositeColor } = joinGameLogic;

const Home = () => {
  const router = useRouter();
  const play = usePlayModal();
  const [boardOrientation, setBoardOrientation] = useState("black");
  const [gameID, setGameID] = useState("");
  const { playID } = router.query;
  const { publicKey } = useWallet();
  const getGame = api.games.getGame.useMutation({
    async onSuccess(userData) {
      console.log(userData);
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
  const getPlayerSide = (userData, myWalletAddress) => {
    const isMySide = userData.walletAddress === myWalletAddress;
    if (isMySide === true) {
      socket.emit("createRoom", { roomId: userData.id }, (r) => {});
    } else {
      const data = { address: userData.walletAddress };
      getOpponent.mutateAsync(data);

      socket.emit("joinRoom", { roomId: userData.id }, (r) => {});
    }
    console.log(isMySide);
    console.log(getOppositeColor(userData.Color));
    const playerSide = isMySide
      ? userData.Color
      : getOppositeColor(userData.Color);
    console.log(playerSide);
    setBoardOrientation(playerSide);
    return playerSide;
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
    });
    socket.on("updateTime", (data) => {
      console.log(data);
      play.setOpponentTime(data);
    });
  }, [socket]);

  useEffect(() => {
    if (publicKey !== null && playID !== undefined) {
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
        <LiveGameContainer boardOrientation={boardOrientation} />
      </main>
    </>
  );
};

export default Home;
