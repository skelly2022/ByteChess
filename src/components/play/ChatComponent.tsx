import React from "react";

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
  return (
    <div className="rounded-lg bg-gray-100 p-4 shadow-md">
      <div className="chat-messages space-y-2">
        {chatMessages.map((message, index) => (
          <div
            key={index}
            className={`rounded-md p-2 ${
              message.sender.toLowerCase() === "you"
                ? "bg-blue-500"
                : "bg-green-500"
            } text-white`}
          >
            <strong>{message.sender}: </strong>
            {message.text}
          </div>
        ))}
      </div>
      <div className="chat-input mt-4">
        <input
          type="text"
          placeholder="Type your message..."
          value={newMessage}
          onChange={onNewMessageChange}
          className="w-full rounded-lg border px-3 py-2"
        />
        <button
          onClick={onSendChatMessage}
          className="bg-blue-500 ml-2 rounded-lg px-4 py-2 text-white"
        >
          Send
        </button>
      </div>
    </div>
  );
};

export default ChatComponent;
