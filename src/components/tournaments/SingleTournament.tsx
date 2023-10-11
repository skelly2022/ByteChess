import { useSession } from "next-auth/react";
import { Tournament, TournamentPlayer } from "../../types/games";
import {
  AiFillCheckCircle,
  AiFillFastBackward,
  AiFillFastForward,
  AiFillStepBackward,
  AiFillStepForward,
} from "react-icons/ai";
import { GiHeavyBullets, GiTrophy } from "react-icons/gi";
import assets from "~/helpers/assets";
import { api } from "~/utils/api";
import TournamentLobby from "./TournamentLobby";
import { useState, useEffect } from "react";
import socket from "~/helpers/socket";
import Chat from "./Chat";
import Logs from "./Logs";
import { useRouter } from "next/router";
import useTournamentModal from "~/hooks/useTournamentModal";
import usePlayModal from "~/hooks/usePlayModal";

const {
  formatTimeDifference,
  extractFirstAndLast5Characters,
  getRandomColor,
  getTimeControlFromString,
} = assets;

interface SingleTournamentProps {
  tournament: Tournament;
  players: TournamentPlayer[];
}

const SingleTournament: React.FC<SingleTournamentProps> = ({
  tournament,
  players,
}) => {
  const session = useSession();
  const router = useRouter();
  const play = usePlayModal();
  const tournamentID = Array.isArray(router.query.tournamentID)
    ? router.query.tournamentID[0]
    : router.query.tournamentID;
  const tournamentStore = useTournamentModal();
  const [playersInGame, setPlayers] = useState<TournamentPlayer[]>(players);
  const [chatMessages, setChatMessages] = useState([]); // State to store chat messages
  const [logMessages, setLogMessages] = useState([]); // State to store chat messages

  const [newMessage, setNewMessage] = useState(""); //
  const [joined, setJoined] = useState(false); //
  const [myId, setMyId] = useState(""); //

  const newGame = api.games.newGame.useMutation({
    async onSuccess(data) {
      tournamentStore.setTournamentID(tournament.id);

      // socket.emit()
      router.push(`/play/${data.id}`);
    },
    onError(error) {},
  });
  const getGame = api.games.getGameTournament.useMutation({
    async onSuccess(data) {
      tournamentStore.setTournamentID(tournament.id);
      router.push(`/play/${data.id}`);
    },
    onError(error) {},
  });
  const join = api.tournament.joinTournament.useMutation({
    onSuccess(data, variables, context) {
      setPlayers(data.players);
      socket.emit("joinTournamentRoom", {
        id: tournament.id,
        wallet: session.data.user.name,
      });
      setLogMessages((prevLogs) => [
        ...prevLogs,
        `${extractFirstAndLast5Characters(
          session.data.user.name,
        )} has joined the Lobby`,
      ]);
    },
    onError(error) {},
  });
  const newPlayers = api.tournament.getPlayers.useMutation({
    onSuccess(data, variables, context) {
      setPlayers(data.players);
    },
    onError(error) {},
  });
  const leave = api.tournament.leaveTournament.useMutation({
    onSuccess(data, variables, context) {
      setPlayers(data.players);
      socket.emit("leaveTournamentRoom", {
        id: tournament.id,
        wallet: session.data.user.name,
      });
      setLogMessages((prevLogs) => [
        ...prevLogs,
        `${extractFirstAndLast5Characters(
          session.data.user.name,
        )} has left the Lobby`,
      ]);
    },
    onError(error) {},
  });

  const [timeDifference, setTimeDifference] = useState<string>(
    formatTimeDifference(tournament.date),
  );

  const updateTimeDifference = () => {
    const formattedTime = formatTimeDifference(tournament.date);
    setTimeDifference(formattedTime);
  };
  const sendChatMessage = (icon?: string) => {
    let chatMessage = newMessage;
    if (icon !== undefined) {
      chatMessage = icon;
    }
    if (chatMessage !== "") {
      socket.emit("chatMessage", {
        roomId: tournament.id,
        message: chatMessage,
        sender: extractFirstAndLast5Characters(session.data.user.name), // Sender's name
      });
      const senderMessage = {
        text: chatMessage,
        sender: extractFirstAndLast5Characters(session.data.user.name),
      };
      setChatMessages([...chatMessages, senderMessage]); // Add the sender's message only

      // Clear the input field
      setNewMessage("");
    }
  };
  function isJoinedFunc(walletAddressToFind) {
    // Use the Array.find() method to search for an object with a matching walletAddress
    const foundObject = playersInGame.find(
      (obj) => obj.walletAddress === walletAddressToFind,
    );

    if (foundObject) {
      // Set state or perform any desired action when a match is found
      setMyId(foundObject.id);
      tournamentStore.setTournamentID(tournament.id);
      tournamentStore.setMyID(foundObject.id);
      return true;
    }

    // Return false if no match is found
    return false;
  }
  useEffect(() => {
    socket.on("opponentJoinedTournament", (data) => {
      newPlayers.mutateAsync({ id: tournament.id });

      // Add a message to the logMessages
      setLogMessages((prevLogs) => [
        ...prevLogs,
        `${extractFirstAndLast5Characters(data.wallet)} has joined the Lobby`,
      ]);
    });

    return () => {
      socket.off("opponentJoinedTournament");
    };
  }, []);
  useEffect(() => {
    socket.on("opponentLeftTournament", (data) => {
      newPlayers.mutateAsync({ id: tournament.id });

      // Add a message to the logMessages
      setLogMessages((prevLogs) => [
        ...prevLogs,
        `${extractFirstAndLast5Characters(data.wallet)} has left the Lobby`,
      ]);
    });

    return () => {
      socket.off("opponentLeftTournament");
    };
  }, []);
  useEffect(() => {
    const isJoined = isJoinedFunc(session.data.user.name);
    setJoined(isJoined);
  }, [playersInGame]);
  useEffect(() => {
    play.resetState();
  }, []);
  useEffect(() => {
    updateTimeDifference();
    const interval = setInterval(updateTimeDifference, 1000);
    return () => clearInterval(interval);
  }, []);

  useEffect(() => {
    socket.on("chatMessageInc", (data) => {
      setChatMessages((prevChatMessages) => [
        ...prevChatMessages,
        {
          text: data.message,
          sender: data.sender,
        },
      ]);
    });

    return () => {
      socket.off("chatMessageInc");
    };
  }, []);
  useEffect(() => {
    socket.emit("userConnectedTournament", {
      id: tournament.id,
      wallet: session.data.user.name,
    });
    return () => {
      socket.off("userConnectedTournament");
    };
  }, []);
  useEffect(() => {
    socket.on("matchFoundCreator", async (args) => {
      const data = {
        address: session.data.user.name,
        mode: tournament.type,
        time: getTimeControlFromString(tournament.type),
        color: getRandomColor("wb"),
      };
      newGame.mutateAsync(data);
    });
    return () => {
      socket.off("matchFoundCreator");
    };
  }, []);

  useEffect(() => {
    socket.on("matchFound", (data) => {
      const dataToSend = {
        id: data.opponentSocketWallet,
      };
      setTimeout(() => {
        getGame.mutateAsync(dataToSend);
      }, 2000);
    });
    return () => {
      socket.off("matchFound");
    };
  }, []);
  return (
    <div className="flex h-full w-full items-center justify-center gap-6 p-3">
      <div className="flex h-full w-full flex-col  rounded-xl bg-white shadow-lg md:w-[55%]">
        <div className="flex h-[15%] w-full items-center justify-between ">
          <div className="flex h-full items-center pl-5">
            <GiTrophy size={60} color="gold" />
            <h1 className="px-4 text-2xl font-bold">{tournament.name}</h1>
          </div>

          <div className="flex flex-col items-center px-4">
            <p>STARTING IN</p>
            <p>{timeDifference}</p>
            <button
              className="bg-error"
              onClick={() => {
                socket.emit("startTournament", { id: tournament.id });
              }}
            >
              Start Tournament
            </button>
          </div>
        </div>
        <div
          className=" flex h-[8%] cursor-pointer
       items-center justify-center gap-3 bg-slate-200 p-2 text-black shadow"
        >
          <div className=" flex h-full w-[80%] items-center justify-center">
            {" "}
            <AiFillFastBackward size={30} onClick={() => {}} />
            <AiFillStepBackward size={25} onClick={() => {}} />
            <h1>0-0/{playersInGame.length}</h1>
            <AiFillStepForward size={25} onClick={() => {}} />
            <AiFillFastForward size={30} onClick={() => {}} />
          </div>

          {!joined ? (
            <button
              className="w-[20%] rounded-lg bg-green px-2 py-2"
              onClick={() => {
                join.mutateAsync({
                  id: tournamentID,
                  address: session.data.user.name,
                });
              }}
            >
              Join
            </button>
          ) : (
            <button
              className="w-[20%] rounded-lg bg-error px-2 py-2"
              onClick={() => {
                leave.mutateAsync({
                  id: myId,
                  tournamentId: tournament.id,
                });
              }}
            >
              Leave
            </button>
          )}
        </div>
        <TournamentLobby players={playersInGame} />
        <div className="flex h-[17%] w-full items-center justify-center gap-3 rounded-b-xl bg-slate-200">
          <div className=" flex-start flex h-full w-auto items-center justify-center gap-3">
            <div className="flex w-auto">
              <GiHeavyBullets color="black" size={50} />
            </div>
            <div className="flex w-full flex-col text-black">
              1+0 • Bullet • 27m
              <span>Tournament</span>
            </div>
          </div>
          <div className=" flex-start flex h-full w-auto items-center justify-center gap-3">
            <div className="flex w-auto">
              <AiFillCheckCircle color="green" size={50} />
            </div>
            <div className="flex w-full flex-col text-green">
              Entry Requirements:
              <span>≥ 20 Bullet rated Games</span>
            </div>
          </div>
        </div>
      </div>
      <div className=" hidden h-full w-1/3  gap-2 md:block">
        <div className="mb-[14px] h-[32%] w-full rounded-xl bg-white p-2">
          {" "}
          <Logs logMessages={logMessages} />
        </div>
        <div className="h-[66%] w-full rounded-xl bg-white">
          {" "}
          <Chat
            chatMessages={chatMessages}
            newMessage={newMessage}
            onNewMessageChange={(e) => setNewMessage(e.target.value)}
            onSendChatMessage={sendChatMessage}
          />
        </div>
      </div>
    </div>
  );
};

export default SingleTournament;
