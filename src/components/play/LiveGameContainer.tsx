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
import { useSession } from "next-auth/react";
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
  const session = useSession();
  const user = useUserStore();

  const { playID } = router.query;
  const play = usePlayModal();
  const sendChatMessage = (icon?: string) => {
    let chatMessage = newMessage;
    if (icon !== undefined) {
      chatMessage = icon;
    }
    console.log(chatMessage);

    // Emit the chat message to the server and specify the roomId

    socket.emit("chatMessage", {
      roomId: playID,
      message: chatMessage,
      sender: extractFirstAndLast5Characters(session.data.user.name), // Sender's name
    });

    // Add the sender's message to the local chatMessages state
    const senderMessage = {
      text: chatMessage,
      sender: extractFirstAndLast5Characters(session.data.user.name),
    };
    console.log([...chatMessages, senderMessage]);
    setChatMessages([...chatMessages, senderMessage]); // Add the sender's message only

    // Clear the input field
    setNewMessage("");
  };
  useEffect(() => {
    socket.on("chatMessageInc", (data) => {
      console.log(chatMessages);
      console.log([
        ...chatMessages,
        {
          text: data.message,
          sender: data.sender,
        },
      ]);
      const senderMessage = {
        text: data.message,
        sender: data.sender,
      };
      setChatMessages((prevChatMessages) => [
        ...prevChatMessages,
        {
          text: data.message,
          sender: data.sender,
        },
      ]);
    });

    return () => {
      // Clean up socket event listeners
      socket.off("chatMessageInc");
    };
  }, []);
  // Now, chessMoves contains the alternated moves with new rows as

  return (
    <div className="flex h-[calc(100vh-112px)] w-screen items-center justify-center gap-5 p-3">
      <div className="hidden h-full w-1/4 flex-col items-center justify-center lg:flex">
        {" "}
        <div className="flex h-[12%] w-full items-center justify-center rounded-t-lg bg-slate-50">
          <ActionContainer />
        </div>
        <div className="flex h-auto w-full rounded-b-lg border-t-2 bg-slate-50">
          <ChatComponent
            chatMessages={chatMessages}
            newMessage={newMessage}
            onNewMessageChange={(e) => setNewMessage(e.target.value)}
            onSendChatMessage={sendChatMessage}
          />
        </div>
      </div>
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
        <div className="mt-4 w-full rounded-lg bg-slate-50 py-2 md:hidden">
          <ActionContainer />
        </div>
      </div>
      <div className=" hidden h-auto w-1/4 flex-col lg:flex  ">
        <LiveGameScoreBoard />
      </div>
      {/* <div className=" hidden h-full w-1/4 flex-col gap-2  md:flex md:justify-start ">
        <div className=" flex h-2/3 w-full flex-col  bg-white">
          Hey
          <LiveGameScoreBoard />
        </div>
        <div className="h-1/3 w-full">
          <ChatComponent
            chatMessages={chatMessages}
            newMessage={newMessage}
            onNewMessageChange={(e) => setNewMessage(e.target.value)}
            onSendChatMessage={sendChatMessage}
          />
        </div>
      </div> */}
    </div>
  );
};

export default LiveGameContainer;
