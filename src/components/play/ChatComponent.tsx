import React, { useRef, useEffect } from "react";
import Image from "next/image";
import useUserModal from "~/hooks/useUserStore";
import Assets from "~/helpers/assets";
const { extractFirstAndLast5Characters } = Assets;
import { useMediaQuery } from "react-responsive";

interface ChatComponentProps {
  chatMessages: { text: string; sender: string }[];
  newMessage: string;
  onNewMessageChange: (event: React.ChangeEvent<HTMLInputElement>) => void;
  onSendChatMessage: (icon?: string) => void;
}

const ChatComponent: React.FC<ChatComponentProps> = ({
  chatMessages,
  newMessage,
  onNewMessageChange,
  onSendChatMessage,
}) => {
  const user = useUserModal();
  const chatContainerRef = useRef<HTMLDivElement | null>(null); // Reference to the chat component
  const isLargeScreen = useMediaQuery({ minWidth: 992 });
  const messagesContainerRef = useRef<HTMLDivElement | null>(null);
  const handleKeyPress = (event: React.KeyboardEvent<HTMLInputElement>) => {
    if (event.key === "Enter") {
      event.preventDefault();
      onSendChatMessage();
    }
  };
  const handleContainerClick = () => {
    if (!isLargeScreen) {
      // console.log("hey"); // Log "hey" on non-large screens when chat container is clicked
    }
  };

  const scrollToBottom = () => {
    if (messagesContainerRef.current) {
      messagesContainerRef.current.scrollIntoView({ behavior: "smooth" });
    }
  };
  useEffect(() => {
    scrollToBottom();
  }, [chatMessages]);

  return (
    <div
      className={`flex w-full flex-col ${
        isLargeScreen
          ? "h-[90%]"
          : "fixed bottom-60 right-[10%] h-[50%] w-[70%] bg-white"
      } z-50 h-[90%] rounded-lg`}
      ref={chatContainerRef} // Set the reference to the chat component
      id="chat-container"
    >
      <div className="overflow-hidden-scroll h-60 flex-grow space-y-2 overflow-y-auto px-3 py-2">
        {chatMessages.map((message, index) => (
          <div
            key={index}
            className={`flex w-full gap-2 rounded-md ${
              message.sender ===
              //@ts-ignore
              `${extractFirstAndLast5Characters(user.user.walletAddress)}`
                ? "bg-blue-500"
                : ""
            }`}
          >
            {message.text === "monkey" || message.text === "kekw" ? (
              <>
                <strong>{message.sender}: </strong>
                <Image
                  // onClick={() => router.push("/")}
                  alt="Logo"
                  className="cursor-pointer md:block"
                  height={30}
                  width={30}
                  src={`/images/${message.text}.jpeg`}
                />
              </>
            ) : (
              <>
                <strong>{message.sender}: </strong>
                {message.text}
              </>
            )}
          </div>
        ))}
        {/* Create a placeholder div to scroll to */}
        <div ref={messagesContainerRef}></div>
      </div>
      <div className="item-center flex w-full justify-center gap-3 p-2">
        <Image
          // onClick={() => router.push("/")}
          alt="Logo"
          className="cursor-pointer md:block"
          height={30}
          width={30}
          src="/images/kekw.jpeg"
          onClick={() => {
            onSendChatMessage("kekw");
          }}
        />
        <Image
          // onClick={() => router.push("/")}
          alt="Logo"
          className="cursor-pointer md:block"
          height={30}
          width={30}
          src="/images/monkey.jpeg"
          onClick={() => {
            onSendChatMessage("monkey");
          }}
        />
      </div>
      <div className="w-full pb-2 pl-2 pr-2">
        <input
          type="text"
          placeholder="Type your message..."
          value={newMessage}
          onChange={onNewMessageChange}
          onKeyPress={handleKeyPress}
          className="bg-yellow w-full rounded-lg  px-3 py-2 "
        />
      </div>
    </div>
  );
};

export default ChatComponent;
