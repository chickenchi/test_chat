import { useEffect, useState } from "react";
import { db } from "@/lib/firebase";
import { ref, onValue, push, set } from "firebase/database";

export function useChat(roomId: string) {
  const [messages, setMessages] = useState<{ id: string; text: string }[]>([]);

  useEffect(() => {
    const messagesRef = ref(db, `rooms/${roomId}/messages`);

    const unsubscribe = onValue(messagesRef, (snapshot) => {
      const data = snapshot.val();
      if (data) {
        const parsedMessages = Object.keys(data).map((key) => ({
          id: key,
          text: data[key].text,
        }));
        setMessages(parsedMessages);
      }
    });

    return () => unsubscribe(); 
  }, [roomId]);

  const sendMessage = async (text: string) => {
    const newMessageRef = push(ref(db, `rooms/${roomId}/messages`));
    await set(newMessageRef, { text });
  };

  return { messages, sendMessage };
}
