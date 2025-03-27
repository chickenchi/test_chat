"use client";

import { useEffect, useRef, useState } from "react";
import { useChat } from "@/hooks/useChat";
import styled from "styled-components";
import { handleMessageSend } from "../components/chatting/filter";

const ChatDiv = styled.div`
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;

  width: 100%;
  height: 100%;
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
  height: 8%;

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

export default function ChatPage() {
  const roomId = "test-room";
  const { messages, sendMessage } = useChat(roomId);
  const [input, setInput] = useState("");

  const messageEndRef = useRef<HTMLDivElement | null>(null);

  const filterAndSendMessage = (input: string) => {
    const result = handleMessageSend(input);

    if (result === "bad word") return "fail";

    sendMessage(result);
    return "success";
  };

  useEffect(() => {
    if (messageEndRef.current) {
      messageEndRef.current.scrollIntoView({ behavior: "smooth" });
    }
  }, [messages]); // 메시지가 변경될 때마다 실행

  return (
    <ChatDiv>
      <ChatContainer>
        <Title>바보들의 채팅방</Title>

        <MessageContainer>
          {messages.map((msg) => (
            <>
              <Name>익명의 누군가</Name>
              <Message key={msg.id}>{msg.text}</Message>
            </>
          ))}
          <div ref={messageEndRef} />
        </MessageContainer>
        <InputContainer>
          <Text
            value={input}
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
              onClick={() => filterAndSendMessage(input)}
            >
              <path
                d="M17.3301 0.669989C17.141 0.482156 16.9037 0.35011 16.6443 0.288363C16.385 0.226616 16.1136 0.237559 15.8601 0.319988L1.23012 5.19999C0.958795 5.28596 0.71903 5.45042 0.541111 5.67258C0.363193 5.89474 0.255103 6.16465 0.230492 6.44821C0.205881 6.73177 0.265854 7.01626 0.402836 7.26575C0.539818 7.51525 0.747665 7.71855 1.00012 7.84999L7.07012 10.85L10.0701 16.94C10.1907 17.1784 10.3752 17.3785 10.603 17.518C10.8309 17.6575 11.093 17.7309 11.3601 17.73H11.4601C11.7462 17.7089 12.0194 17.6023 12.2441 17.424C12.4688 17.2456 12.6346 17.0038 12.7201 16.73L17.6701 2.13999C17.7585 1.88792 17.7735 1.61593 17.7133 1.35569C17.6531 1.09544 17.5202 0.857646 17.3301 0.669989ZM1.85012 6.57999L14.6201 2.31999L7.53012 9.40999L1.85012 6.57999ZM11.4301 16.15L8.59012 10.47L15.6801 3.37999L11.4301 16.15Z"
                fill="blue"
              />
            </Send>
          )}
        </InputContainer>
      </ChatContainer>
    </ChatDiv>
  );
}
