"use client";
import { useEffect, useRef, useState } from "react";
import { useChat } from "@/hooks/useChat";
import styled from "styled-components";
import { handleMessageSend } from "../components/chatting/filter";
import { useOnlineUsers } from "@/hooks/useOnlineUsers";
import { getAuth, onAuthStateChanged, updateProfile } from "firebase/auth";
import { useRouter } from "next/navigation";

const auth = getAuth();

const ChatDiv = styled.div`
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  width: 100%;
  height: 100%;
`;

const LoadingDiv = styled.div`
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  width: 100%;
  height: 100%;

  font-size: 23pt;
  color: white;
`;

const ChatContainer = styled.div`
  border: 1px solid white;
  width: 50%;
  height: 90%;
  display: flex;
  flex-direction: column;
  justify-content: flex-start;
  border-radius: 5px;
`;

const Title = styled.p`
  font-size: 20pt;
  font-weight: 600;
  padding: 15px;
  height: 5%;
  color: white;
`;

const Description = styled.p`
  font-size: 13pt;
  font-weight: 600;
  padding: 15px;
  height: 5%;
  color: white;
`;

const MessageContainer = styled.div`
  height: 88%;
  padding: 10px;
  display: flex;
  flex-direction: column;
  overflow-y: auto;
  overflow-x: hidden;
`;

const Name = styled.p`
  color: white;
`;

const Message = styled.p`
  background-color: white;
  display: inline-block;

  width: auto;
  max-width: 250px;

  border-radius: 3px;

  margin: 6px;
  margin-left: 0;

  color: black;
  font-size: 14pt;

  padding: 8px;
  align-self: flex-start;
`;

const InputContainer = styled.div`
  background-color: rgb(255, 255, 255);

  border-radius: 5px;
  border-top-left-radius: 0px;
  border-top-right-radius: 0px;

  width: 100%;
  height: 9%;

  display: flex;
  align-items: center;
`;

const Text = styled.input`
  width: 100%;
  padding-left: 8px;
  border: none;
  color: black;
  font-size: 13pt;
  outline: none;
`;

const Send = styled.svg`
  width: 30px;
  height: 30px;
  padding: 10px;
  margin-right: 5px;
`;

const NicknameContainer = styled.div`
  width: 50%;
  margin-bottom: 20px;
  display: flex;
  justify-content: center;
`;

const NicknameInput = styled.input`
  width: 80%;
  padding: 10px;
  font-size: 14pt;
  border-radius: 5px;
  margin-right: 10px;
`;

const NicknameButton = styled.button`
  padding: 10px;
  font-size: 14pt;
  border-radius: 5px;
  background-color: blue;
  color: white;
  cursor: pointer;

  &:hover {
    background-color: darkblue;
  }
`;

export default function ChatPage() {
  const router = useRouter();
  const roomId = "test-room";
  const [nickname, setNickname] = useState<string>("");
  const [input, setInput] = useState("");
  const [isNicknameSet, setIsNicknameSet] = useState<boolean>(false);
  const [isLoading, setIsLoading] = useState(true);

  const { messages, sendMessage } = useChat(roomId, nickname);
  const onlineUsers = useOnlineUsers(roomId);

  const messageEndRef = useRef<HTMLDivElement | null>(null);

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, (user) => {
      if (!user) {
        router.push("/");
        return;
      }

      const firebaseNickname = user.displayName;

      if (firebaseNickname) {
        setNickname(firebaseNickname);
        setIsNicknameSet(true);
      } else {
        setIsNicknameSet(false);
      }

      setIsLoading(false);
    });

    return () => unsubscribe();
  }, [router]);

  useEffect(() => {
    if (messageEndRef.current) {
      messageEndRef.current.scrollIntoView({ behavior: "smooth" });
    }
  }, [messages]);

  const filterAndSendMessage = (input: string) => {
    const result = handleMessageSend(input);
    if (result === "bad word") return "fail";
    sendMessage(result);
    return "success";
  };

  const handleNicknameSubmit = async () => {
    if (nickname.trim()) {
      try {
        await updateProfile(auth.currentUser!, { displayName: nickname });
        setIsNicknameSet(true);
      } catch (error) {
        console.error("Error updating profile:", error);
      }
    }
  };

  if (isLoading) {
    return <LoadingDiv>Loading...</LoadingDiv>;
  }

  return (
    <ChatDiv>
      {!isNicknameSet ? (
        <NicknameContainer>
          <NicknameInput
            type="text"
            placeholder="닉네임을 입력하세요"
            value={nickname}
            onChange={(e) => setNickname(e.target.value)}
          />
          <NicknameButton onClick={handleNicknameSubmit}>
            닉네임 설정
          </NicknameButton>
        </NicknameContainer>
      ) : (
        <ChatContainer>
          <Title>채팅방 (생성된 유저 수: {onlineUsers}명)</Title>
          <Description>
            ※ 개인 정보 등 민감한 내용은 작성하면 안 돼요!
          </Description>
          <MessageContainer>
            {messages.map((msg) => (
              <div key={msg.id}>
                <Name>{msg.nickname}</Name>
                <Message>{msg.text}</Message>
              </div>
            ))}
            <div ref={messageEndRef} />
          </MessageContainer>
          <InputContainer>
            <Text
              value={input}
              placeholder={`당신의 닉네임은 ${
                nickname ? nickname : "없음"
              }입니다. 개인 정보인 경우 구글 계정을 변경해 주세요.`}
              onChange={(e) => setInput(e.target.value)}
              onKeyDown={(e) => {
                if (e.key === "Enter" && input.trim()) {
                  if (filterAndSendMessage(input) === "success") {
                    setInput("");
                  }
                }
              }}
            />
            {input && (
              <Send
                width="18"
                height="18"
                viewBox="0 0 18 18"
                fill="none"
                onClick={() => {
                  if (filterAndSendMessage(input) === "success") {
                    setInput("");
                  }
                }}
              >
                <path
                  d="M17.3301 0.669989C17.141 0.482156 16.9037 0.35011 16.6443 0.288363C16.385 0.226616 16.1136 0.237559 15.8601 0.319988L1.23012 5.19999C0.958795 5.28596 0.71903 5.45042 0.541111 5.67258C0.363193 5.89474 0.255103 6.16465 0.230492 6.44821C0.205881 6.73177 0.265854 7.01626 0.402836 7.26575C0.539818 7.51525 0.747665 7.71855 1.00012 7.84999L7.07012 10.85L10.0701 16.94C10.1907 17.1784 10.3752 17.3785 10.603 17.518C10.8309 17.6575 11.093 17.7309 11.3601 17.73H11.4601C11.7462 17.7089 12.0194 17.6023 12.2441 17.424C12.4688 17.2456 12.6346 17.0038 12.7201 16.73L17.6701 2.13999C17.7585 1.88792 17.7735 1.61593 17.7133 1.35569C17.6531 1.09544 17.5202 0.857646 17.3301 0.669989ZM1.85012 6.57999L14.6201 2.31999L7.53012 9.40999L1.85012 6.57999ZM11.4301 16.15L8.59012 10.47L15.6801 3.37999L11.4301 16.15Z"
                  fill="blue"
                />
              </Send>
            )}
          </InputContainer>
        </ChatContainer>
      )}
    </ChatDiv>
  );
}
