import React, { useEffect, useState } from "react";

import LiveGame from "./LiveGame";
import LiveGameScoreBoard from "./LiveGameScoreBoard";
import RatingContainer from "./RatingContainer";
import useUserStore from "~/hooks/useUserStore";
import Assets from "~/helpers/assets";
import Timer from "./Timer";
import usePlayModal from "~/hooks/usePlayModal";
import joinGameLogic from "~/helpers/joinGameLogic";
import socket from "~/helpers/socket";
import { AiOutlineClose } from "react-icons/ai";
import { BsFlag } from "react-icons/bs";
import ActionContainer from "./ActionContainer";
import ChatComponent from "./ChatComponent";
import { useRouter } from "next/router";
const { categorizeChessGame, getOppositeColor } = joinGameLogic;
const { extractFirstAndLast5Characters } = Assets;

interface LiveGameProps {
  boardOrientation: any;
  connected: boolean;
}

const LiveGameContainer: React.FC<LiveGameProps> = ({
  boardOrientation,
  connected,
}) => {
  const [chatMessages, setChatMessages] = useState([]); // State to store chat messages
  const [newMessage, setNewMessage] = useState(""); //
  const router = useRouter();
  const user = useUserStore();

  const { playID } = router.query;
  const play = usePlayModal();
  const sendChatMessage = () => {
    console.log(newMessage);
    if (newMessage.trim() !== "") {
      // Emit the chat message to the server and specify the roomId

      socket.emit("chatMessage", {
        roomId: playID,
        message: newMessage,
        sender: "You", // Sender's name
      });

      // Add the sender's message to the local chatMessages state
      const senderMessage = { text: newMessage, sender: "You" };
      console.log([...chatMessages, senderMessage]);
      setChatMessages([...chatMessages, senderMessage]); // Add the sender's message only

      // Clear the input field
      setNewMessage("");
    }
  };
  useEffect(() => {
    socket.on("chatMessageInc", (data) => {
      console.log(data);
      setChatMessages([
        ...chatMessages,
        { text: data.message, sender: "Opponent" },
      ]);
    });

    return () => {
      // Clean up socket event listeners
      socket.off("chatMessageInc");
    };
  }, []);
  // Now, chessMoves contains the alternated moves with new rows as

  return (
    <div className="flex h-[calc(1indexvh-112px)] w-screen  justify-center gap-2 ">
      <div className=" flex h-full w-full flex-col  md:w-auto">
        <div className="w-full md:hidden">
          <RatingContainer type="opponent" />
        </div>
        <div className="flex h-auto w-full   md:justify-end">
          <LiveGame boardOrientation={boardOrientation} connected={connected} />
        </div>
        <div className="w-full md:hidden">
          <RatingContainer type="me" />
        </div>
        <div className="w-full md:hidden">
          <ActionContainer />
        </div>
      </div>
      <div className=" hidden h-full w-1/4 flex-col gap-2  md:flex md:justify-start ">
        <div className=" flex h-auto w-full flex-col ">
          <LiveGameScoreBoard />
        </div>
        <ChatComponent
          chatMessages={chatMessages}
          newMessage={newMessage}
          onNewMessageChange={(e) => setNewMessage(e.target.value)}
          onSendChatMessage={sendChatMessage}
        />
      </div>
    </div>
  );
};

export default LiveGameContainer;
