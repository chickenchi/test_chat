import { useEffect, useState } from "react";
import { db } from "@/lib/firebase";
import { ref, onValue, push, set } from "firebase/database";

// 채팅에서 사용할 닉네임을 관리하는 커스텀 훅
export function useChat(roomId: string, nickname: string) {
  const [messages, setMessages] = useState<{ id: string; text: string; nickname: string }[]>([]);

  useEffect(() => {
    const messagesRef = ref(db, `rooms/${roomId}/messages`);

    const unsubscribe = onValue(messagesRef, (snapshot) => {
      const data = snapshot.val();
      if (data) {
        const parsedMessages = Object.keys(data).map((key) => ({
          id: key,
          text: data[key].text,
          nickname: data[key].nickname, // 닉네임도 함께 저장
        }));
        setMessages(parsedMessages);
      }
    });

    return () => unsubscribe();
  }, [roomId]);

  const sendMessage = async (text: string) => {
    const newMessageRef = push(ref(db, `rooms/${roomId}/messages`));
    await set(newMessageRef, { text, nickname });
  };

  return { messages, sendMessage };
}
