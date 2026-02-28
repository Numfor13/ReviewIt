import ChatBox from "../assets/components/chat/ChatBox";
import ChatInput from "../assets/components/chat/ChatInput";

const SideChat = () => {
  const currentUser = { id: "u1", name: "Precious" };

  return (
    <div className="max-w-md mx-auto p-4 flex flex-col h-screen">
      <h2 className="text-xl font-bold text-green-600 mb-4">
        Community Chat
      </h2>

      <div className="flex-1">
        <ChatBox currentUser={currentUser} />
        </div>
      <ChatInput currentUser={currentUser} />
    </div>
  );
};

export default SideChat;