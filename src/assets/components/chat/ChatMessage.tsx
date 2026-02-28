import { useState } from "react";
import { useChat } from "../../../context/ChatContext";

const ChatMessage = ({ message, currentUser }: any) => {
  const { editMessage } = useChat();
  const [editing, setEditing] = useState(false);
  const [newContent, setNewContent] = useState(message.content);

  const isOwner = message.userId === currentUser.id;

  const handleSave = () => {
    editMessage(message.id, newContent, currentUser.id);
    setEditing(false);
  };

  return (
    <div className="border p-2 rounded bg-green-50">
      <p className="font-semibold">{message.userName}</p>

      {editing ? (
        <>
          <input
            value={newContent}
            onChange={(e) => setNewContent(e.target.value)}
            className="border p-1 w-full"
          />
          <button onClick={handleSave} className="text-green-600 text-sm">
            Save
          </button>
        </>
      ) : (
        <p>{message.content}</p>
      )}

      {isOwner && !editing && (
        <button
          onClick={() => setEditing(true)}
          className="text-green-600 text-xs mt-1"
        >
          Edit
        </button>
      )}
    </div>
  );
};

export default ChatMessage;