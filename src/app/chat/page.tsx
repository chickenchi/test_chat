"use client";

import { useState } from "react";
import { useChat } from "@/hooks/useChat";

export default function ChatPage() {
  const roomId = "test-room";
  const { messages, sendMessage } = useChat(roomId);
  const [input, setInput] = useState("");

  return (
    <div>
      <h1>Firebase WebSocket Chat</h1>
      <div>
        {messages.map((msg) => (
          <p key={msg.id}>{msg.text}</p>
        ))}
      </div>
      <input
        value={input}
        onChange={(e) => setInput(e.target.value)}
        onKeyDown={(e) => {
          if (e.key === "Enter" && input.trim()) {
            sendMessage(input);
            setInput("");
          }
        }}
      />
      <button onClick={() => sendMessage(input)}>보내기</button>
    </div>
  );
}
