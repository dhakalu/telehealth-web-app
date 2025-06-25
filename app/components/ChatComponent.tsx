import React, { useEffect, useRef, useState } from "react";
import { User } from "~/routes/provider/complete-profile";
import Button from "./common/Button";
import { Input } from "./common/Input";

interface ChatComponentProps {
  wsUrl: string;
  chat: Chat;
  senderId?: string;
  receiverId?: string;
  initialMessages?: ChatMessage[];
}

export interface Chat {
  chatId: string;
  patientId: string;
  providerId: string;
  patient: User;
  provider: User;
}

export interface ChatMessage {
  chatId: string;
  text: string;
  senderId?: string;
  sentAt?: string;
}


export const ChatComponent: React.FC<ChatComponentProps> = ({
  wsUrl,
  chat,
  // providerId,
  // patientId,
  receiverId,
  senderId,
  initialMessages = [],
}) => {
  const [messages, setMessages] = useState<ChatMessage[]>(initialMessages);
  const [input, setInput] = useState("");
  const ws = useRef<WebSocket | null>(null);
  const [connected, setConnected] = useState(false);
  const bottomRef = useRef<HTMLDivElement>(null);

  const { chatId, patient, provider } = chat;

  const receiver = patient.sub == receiverId ? patient : provider;
  const receiverName = `${receiver.given_name} ${receiver.family_name}`

  useEffect(() => {
    ws.current = new WebSocket(`${wsUrl}?receiverId=${receiverId}&senderId=${senderId}`);
    ws.current.onopen = () => setConnected(true);
    ws.current.onclose = () => setConnected(false);
    ws.current.onmessage = (event) => {
      try {
        const msg = JSON.parse(event.data);
        setMessages((prev) => [...prev, msg]);
      } catch {
        setMessages((prev) => [
          ...prev,
          {
            chatId,
            senderId,
            receiverId,
            text: "Invalid message format received"
          }
        ]);
      }
    };
    return () => {
      ws.current?.close();
    };
  }, [wsUrl, chatId, senderId, receiverId]);

  useEffect(() => {
    bottomRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages]);

  const sendMessage = (e: React.FormEvent) => {
    e.preventDefault();
    if (!input.trim() || !ws.current || ws.current.readyState !== 1) return;
    const msg = {
      chatId,
      senderId,
      receiverId,
      text: input
    };
    console.log('sending message', msg)
    ws.current.send(JSON.stringify(msg));
    setMessages((prev) => [...prev, msg]);
    setInput("");
  };


  return (
    <div className="w-full p-6 bg-base-100 justify-between rounded shadow mt-10 flex flex-col h-full">
      <div>
        <h2 className="text-xl font-bold mb-4">
          Chat with {receiverName}
        </h2>
        <div className="flex-1 overflow-y-auto  rounded p-4  mb-4">
          {messages.map((msg, idx) => {
            const isMine = msg.senderId === senderId;
            return (
              <div
                key={idx}
                className={`mb-2 flex ${isMine ? "justify-end" : "justify-start"}`}
              >
                <div
                  className={`px-3 py-2 rounded-lg max-w-xs ${isMine ? "bg-blue-500 text-white" : "bg-gray-200 text-gray-800"
                    }`}
                >
                  <span>{msg.text}</span>
                </div>
              </div>
            );
          })}
          <div ref={bottomRef} />
        </div>
      </div>
      <div>
        <form onSubmit={sendMessage} className="flex w-full gap-2">
          <Input
            label=""
            id="chat-input"
            wrapperClass="flex-1"
            value={input}
            onChange={(e) => setInput(e.target.value)}
            placeholder={connected ? "Type your message..." : "Connecting..."}
            disabled={!connected}
          />
          <div className="mt-1">
            <Button
              buttonType="primary"
              type="submit"
              disabled={!connected || !input.trim()}
            >
              Send
            </Button>
          </div>
        </form>
      </div>
    </div>
  );
};