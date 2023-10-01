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
import { BsFillChatDotsFill, BsFlag } from "react-icons/bs";
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
  const [isChatOpen, setIsChatOpen] = useState(false);
  const [chatMessages, setChatMessages] = useState([]); // State to store chat messages
  const [newMessage, setNewMessage] = useState(""); //
  const router = useRouter();
  const session = useSession();
  const { playID } = router.query;

  const toggleChat = () => {
    setIsChatOpen(!isChatOpen);
  };

  const sendChatMessage = (icon?: string) => {
    let chatMessage = newMessage;
    if (icon !== undefined) {
      chatMessage = icon;
    }
    socket.emit("chatMessage", {
      roomId: playID,
      message: chatMessage,
      sender: extractFirstAndLast5Characters(session.data.user.name), // Sender's name
    });
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
      socket.off("chatMessageInc");
    };
  }, []);

  return (
    <div
      className="flex h-[calc(100vh-112px)] w-screen items-center justify-center gap-5
     overflow-hidden px-2 pt-2 md:px-4 md:pt-4 "
    >
      <div className="hidden h-full w-1/4 flex-col items-center justify-center xl:flex">
        {" "}
        {/* <div className="relative flex h-[12%] w-full items-center justify-center rounded-t-lg bg-slate-100">
          <ActionContainer />
        </div> */}
        <div className="flex h-5/6 w-full flex-col rounded-lg border border-yellow">
          <div className="flex h-[10%] w-full items-center justify-center border-b border-black py-8 text-4xl text-yellow">
            CHAT
          </div>
          <ChatComponent
            chatMessages={chatMessages}
            newMessage={newMessage}
            onNewMessageChange={(e) => setNewMessage(e.target.value)}
            onSendChatMessage={sendChatMessage}
          />
        </div>
      </div>
      <div className=" flex h-full w-full flex-col  items-center md:w-auto">
        <div className="w-full rounded-t-lg  md:hidden">
          <RatingContainer type="opponent" />
        </div>
        <div className="flex h-auto w-full items-center justify-center py-2 pr-4 md:justify-end">
          <LiveGame boardOrientation={boardOrientation} connected={connected} />
        </div>
        <div className="w-full rounded-b-lg  md:hidden">
          <RatingContainer type="me" />
        </div>
        <div className="mt-3 flex w-full justify-evenly ">
          <div className="w-full rounded-lg py-2 md:hidden">
            <ActionContainer />
          </div>
          <div className="relative flex h-full w-1/2 items-center justify-center rounded-lg py-2 xl:hidden">
            {isChatOpen && (
              <ChatComponent
                chatMessages={chatMessages}
                newMessage={newMessage}
                onNewMessageChange={(e) => setNewMessage(e.target.value)}
                onSendChatMessage={sendChatMessage}
                // onClose={toggleChat}
              />
            )}
          </div>
        </div>
      </div>
      <div className=" hidden h-5/6 flex-col md:flex  lg:w-1/3  ">
        <LiveGameScoreBoard />
        <div className="relative flex h-[12%] w-full items-center justify-center">
          <ActionContainer />
        </div>
      </div>
      <div className="absolute bottom-24 right-5 z-50 cursor-pointer md:bottom-5 lg:right-20 xl:hidden">
        {" "}
        <BsFillChatDotsFill
          size={50}
          color="white"
          onClick={toggleChat}
          id="messages-icon"
          className={`${
            isChatOpen ? "cursor-pointer bg-gray-800 text-white" : ""
          } cursor-pointer rounded-full p-2 transition-colors duration-300 ease-in-out`}
        />
      </div>
    </div>
  );
};

export default LiveGameContainer;
