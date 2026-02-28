import { createContext, useContext, useState } from "react";
import type { ChatMessage } from "../types/chat";
import { v4 as uuid } from "uuid";

interface ChatContextType {
  messages: ChatMessage[];
  sendMessage: (content: string, userId: string, userName: string) => void;
  editMessage: (id: string, newContent: string, userId: string) => void;
}

const ChatContext = createContext<ChatContextType | null>(null);

export const ChatProvider = ({ children }: { children: React.ReactNode }) => {
  const [messages, setMessages] = useState<ChatMessage[]>([]);

  const sendMessage = (content: string, userId: string, userName: string) => {
    const newMessage: ChatMessage = {
      id: uuid(),
      userId,
      userName,
      content,
      createdAt: new Date().toISOString(),
    };

    setMessages((prev) => [...prev,   newMessage ]);
  };

  const editMessage = (id: string, newContent: string, userId: string) => {
    setMessages((prev) =>
      prev.map((msg) =>
        msg.id === id && msg.userId === userId
          ? { ...msg, content: newContent, updatedAt: new Date().toISOString() }
          : msg
      )
    );
  };

  return (
    <ChatContext.Provider value={{ messages, sendMessage, editMessage }}>
      {children}
    </ChatContext.Provider>
  );
};

export const useChat = () => {
  const context = useContext(ChatContext);
  if (!context) throw new Error("useChat must be used inside ChatProvider");
  return context;
};