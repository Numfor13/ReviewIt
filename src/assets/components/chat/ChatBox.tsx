import { useRef, useEffect, useState } from "react";
import { useChat } from "../../../context/ChatContext";
import ChatMessage from "./ChatMessage";


const ChatBox = ({ currentUser }: any) => {
  const { messages } = useChat();
  const bottomRef = useRef<HTMLDivElement | null>(null);

  const lastMessageId = messages[messages.length - 1]?.id;

  useEffect(() => {
    bottomRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [lastMessageId]);

  const pageSize = 20;
  const [visibleCount, setVisibleCount] = useState(20);
  
  const visibleMessages = messages.slice(-visibleCount);

  return (
    <div className="h-100 overflow-y-auto space-y-3">

       {visibleCount < messages.length && (
        <button
          onClick={() => setVisibleCount((prev) => prev + pageSize)}
          className="text-green-600 text-sm mb-2"
        >
          Load older messages
        </button>
      )}

      {visibleMessages.map((msg) => (
        <ChatMessage
          key={msg.id}
          message={msg}
          currentUser={currentUser}
        />
      ))}

      <div ref={bottomRef} />
    </div>
  );
};

export default ChatBox;