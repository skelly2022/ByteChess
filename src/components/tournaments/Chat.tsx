import React, { useRef, useEffect } from "react";
import Image from "next/image";
import useUserModal from "~/hooks/useUserStore";
import Assets from "~/helpers/assets";
const { extractFirstAndLast5Characters } = Assets;
import { useMediaQuery } from "react-responsive";

interface ChatProps {
  chatMessages: { text: string; sender: string }[];
  newMessage: string;
  onNewMessageChange: (event: React.ChangeEvent<HTMLInputElement>) => void;
  onSendChatMessage: (icon?: string) => void;
}

const Chat: React.FC<ChatProps> = ({
  chatMessages,
  newMessage,
  onNewMessageChange,
  onSendChatMessage,
}) => {
  const user = useUserModal();
  const chatContainerRef = useRef<HTMLDivElement | null>(null); // Reference to the chat component
  const isLargeScreen = useMediaQuery({ minWidth: 1280 });
  const messagesContainerRef = useRef<HTMLDivElement | null>(null);
  const handleKeyPress = (event: React.KeyboardEvent<HTMLInputElement>) => {
    if (event.key === "Enter") {
      event.preventDefault();
      onSendChatMessage();
    }
  };
  const handleContainerClick = () => {
    if (!isLargeScreen) {
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
      className={`flex h-full w-full flex-col`}
      ref={chatContainerRef} // Set the reference to the chat component
      id="chat-container"
    >
      <div className="no-scrollbar flex h-[90%] flex-col gap-3  overflow-auto  px-3 py-2">
        {chatMessages.map((message, index) => (
          <div
            key={index}
            className={` flex max-h-fit w-full gap-1 break-words ${
              message.text === "monkey" || message.text === "kekw"
                ? "items-start"
                : "items-center "
            } ${
              message.sender ===
              //@ts-ignore
              `${extractFirstAndLast5Characters(user.user.walletAddress)}`
                ? "bg-blue-500"
                : ""
            }`}
          >
            <strong className=" self-start">{message.sender}:</strong>
            {message.text === "monkey" || message.text === "kekw" ? (
              <Image
                alt="Logo"
                className="cursor-pointer md:block"
                height={30}
                width={30}
                src={`/images/${message.text}.jpeg`}
              />
            ) : (
              <span className="self-start">{message.text}</span>
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
          className="w-full rounded-lg bg-slate-200 px-3  py-2 outline-none "
        />
      </div>
    </div>
  );
};

export default Chat;
