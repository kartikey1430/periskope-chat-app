import { useEffect, useState } from "react";
import { supabase } from "../lib/supabaseClient";
import { FiSend, FiSmile, FiPaperclip, FiSearch } from "react-icons/fi";

interface Message {
  id: number;
  content: string;
  sender: string;
  created_at: string;
  chat_id: number;
}

interface Chat {
  id: number;
  title: string;
}

export default function Chats() {
  const [messages, setMessages] = useState<Message[]>([]);
  const [chats, setChats] = useState<Chat[]>([]);
  const [selectedChat, setSelectedChat] = useState<number | null>(null);
  const [input, setInput] = useState("");

  useEffect(() => {
    const fetchChats = async () => {
      const { data } = await supabase.from("chats").select("*").order("id");
      if (data) setChats(data);
    };
    fetchChats();
  }, []);

  useEffect(() => {
    if (selectedChat === null) return;

    const fetchMessages = async () => {
      const { data } = await supabase
        .from("messages")
        .select("*")
        .eq("chat_id", selectedChat)
        .order("created_at", { ascending: true });
      if (data) setMessages(data);
    };

    fetchMessages();

    const channel = supabase
      .channel("realtime:messages")
      .on(
        "postgres_changes",
        {
          event: "INSERT",
          schema: "public",
          table: "messages",
          filter: `chat_id=eq.${selectedChat}`,
        },
        (payload) => {
          const newMsg = payload.new as Message;
          setMessages((prev) => [...prev, newMsg]);
        }
      )
      .subscribe();

    return () => {
      supabase.removeChannel(channel);
    };
  }, [selectedChat]);

  const sendMessage = async () => {
    if (!input.trim() || selectedChat === null) return;
    await supabase.from("messages").insert([
      {
        content: input,
        sender: "Periskope",
        chat_id: selectedChat,
      },
    ]);
    setInput("");
  };

  return (
    <div className="flex h-screen bg-gray-50">
      {/* Sidebar */}
      <div className="w-[320px] bg-white border-r overflow-y-auto">
        <div className="px-4 py-4 border-b flex items-center justify-between">
          <h2 className="text-xl font-semibold">Chats</h2>
          <FiSearch className="text-gray-600 text-lg" />
        </div>
        <ul>
          {chats.map((chat) => (
            <li
              key={chat.id}
              onClick={() => setSelectedChat(chat.id)}
              className={`px-4 py-3 border-b cursor-pointer hover:bg-gray-100 ${
                selectedChat === chat.id ? "bg-gray-100 font-bold" : ""
              }`}
            >
              {chat.title}
            </li>
          ))}
        </ul>
      </div>

      {/* Chat Window */}
      <div className="flex-1 flex flex-col">
        <div className="flex-1 overflow-y-auto px-6 py-4 bg-gray-100">
          {selectedChat === null ? (
            <div className="text-gray-500 mt-4">Select a chat to view messages</div>
          ) : (
            messages.map((msg) => (
              <div
                key={msg.id}
                className={`max-w-[60%] mb-3 p-3 rounded-lg ${
                  msg.sender === "Periskope"
                    ? "ml-auto bg-green-200 text-right"
                    : "mr-auto bg-white text-left"
                }`}
              >
                <div className="text-sm font-medium text-gray-700">{msg.sender}</div>
                <div className="text-base">{msg.content}</div>
                <div className="text-xs text-gray-500 mt-1">
                  {new Date(msg.created_at).toLocaleTimeString()}
                </div>
              </div>
            ))
          )}
        </div>

        {selectedChat !== null && (
          <div className="border-t p-4 flex items-center gap-2 bg-white">
            <FiSmile className="text-gray-600 text-xl cursor-pointer" />
            <FiPaperclip className="text-gray-600 text-xl cursor-pointer" />
            <input
              type="text"
              value={input}
              onChange={(e) => setInput(e.target.value)}
              className="flex-1 px-4 py-2 border rounded"
              placeholder="Type a message..."
            />
            <button
              onClick={sendMessage}
              className="bg-green-600 text-white p-2 rounded hover:bg-green-700"
            >
              <FiSend className="text-lg" />
            </button>
          </div>
        )}
      </div>
    </div>
  );
}
