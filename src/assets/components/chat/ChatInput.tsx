import { useState } from "react";
import { useChat } from "../../../context/ChatContext";
import { useSpamGuard } from "../../../hooks/useSpamGuard";

const ChatInput = ({ currentUser }: any) => {
  const [content, setContent] = useState("");
  const { sendMessage } = useChat();
  const { canSend } = useSpamGuard();

  const handleSend = () => {
    if (!content.trim()) return;

    if (!canSend()) {
      alert("Please wait before sending another message.");
      return;
    }

    if (content.length > 300) {
      alert("Message too long.");
      return;
    }

    sendMessage(content, currentUser.id, currentUser.name);
    setContent("");
  };

  return (
    <div className="flex gap-2 mt-4">
      <input
        value={content}
        onChange={(e) => setContent(e.target.value)}
        className="flex-1 border p-2 rounded"
        placeholder="Type message..."
      />
      <button
        onClick={handleSend}
        className="bg-green-600 text-white px-4 rounded"
      >
        Send
      </button>
    </div>
  );
};

export default ChatInput;