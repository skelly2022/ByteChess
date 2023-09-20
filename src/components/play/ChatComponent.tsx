import React, { useRef, useEffect } from "react";

interface ChatComponentProps {
  chatMessages: { text: string; sender: string }[];
  newMessage: string;
  onNewMessageChange: (event: React.ChangeEvent<HTMLInputElement>) => void;
  onSendChatMessage: () => void;
}

const ChatComponent: React.FC<ChatComponentProps> = ({
  chatMessages,
  newMessage,
  onNewMessageChange,
  onSendChatMessage,
}) => {
  const handleKeyPress = (event: React.KeyboardEvent<HTMLInputElement>) => {
    if (event.key === "Enter") {
      // Prevent the default behavior of the "Enter" key
      event.preventDefault();

      // Trigger the send action when "Enter" is pressed
      onSendChatMessage();
    }
  };

  // Create a ref for the messages container
  const messagesContainerRef = useRef<HTMLDivElement | null>(null);

  // Function to scroll to the bottom of the messages container
  const scrollToBottom = () => {
    if (messagesContainerRef.current) {
      messagesContainerRef.current.scrollIntoView({ behavior: "smooth" });
    }
  };

  // Scroll to the bottom whenever chatMessages change
  useEffect(() => {
    scrollToBottom();
  }, [chatMessages]);

  return (
    <div className=" flex h-full w-full flex-col rounded-lg bg-gray-100 text-black">
      <div className="overflow-hidden-scroll flex-grow space-y-2 overflow-y-auto px-3 py-2">
        {chatMessages.map((message, index) => (
          <div
            key={index}
            className={`w-full rounded-md   ${
              message.sender.toLowerCase() === "you" ? "bg-blue-500" : ""
            }`}
          >
            <strong>{message.sender}: </strong>
            {message.text}
          </div>
        ))}
        {/* Create a placeholder div to scroll to */}
        <div ref={messagesContainerRef}></div>
      </div>
      <div className="w-full pb-2 pl-2 pr-2">
        <input
          type="text"
          placeholder="Type your message..."
          value={newMessage}
          onChange={onNewMessageChange}
          onKeyPress={handleKeyPress}
          className="w-full rounded-lg border px-3 py-2"
        />
      </div>
    </div>
  );
};

export default ChatComponent;
