import React, { useEffect, useRef, useState } from "react";
import AppHeader from "./common/AppHeader";
import { User } from "~/routes/provider.complete-profile/route";

type ChatParticipantType = "patient" | "provider";

interface ChatComponentProps {
  wsUrl: string;
  senderType?: ChatParticipantType;
  receiverType?: ChatParticipantType;
  providerId: string;
  patientId: string;
  senderId?: string;
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
  senderType: string;
  patientId: string;
  providerId: string;
  receiverType: string;
  text: string;
  senderId?: string;
}


export const ChatComponent: React.FC<ChatComponentProps> = ({
  wsUrl,
  senderType,
  receiverType,
  providerId,
  patientId,
  senderId,
  initialMessages = [],
}) => {
  console.log('initialMessages', initialMessages)
  const [messages, setMessages] = useState<ChatMessage[]>(initialMessages);
  const [input, setInput] = useState("");
  const ws = useRef<WebSocket | null>(null);
  const [connected, setConnected] = useState(false);
  const bottomRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    ws.current = new WebSocket(`${wsUrl}?patientId=${patientId}&providerId=${providerId}&senderType=${senderType}`);
    ws.current.onopen = () => setConnected(true);
    ws.current.onclose = () => setConnected(false);
    ws.current.onmessage = (event) => {
      try {
        const msg = JSON.parse(event.data);
        setMessages((prev) => [...prev, msg]);
      } catch {
        console.error("Failed to parse message:", event.data);
        // roles of senderType and receiverType are 
        // reversed in the received message
        setMessages((prev) => [
          ...prev,
          { 
            senderType: senderType ? String(receiverType) : "", 
            patientId: patientId ? String(patientId) : "", 
            providerId: providerId ? String(providerId) : "", 
            receiverType: receiverType ? String(senderType) : "", 
            text: "Invalid message format received"
          }
        ]);
      }
    };
    return () => {
      ws.current?.close();
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [wsUrl, providerId, patientId, senderType]);

  useEffect(() => {
    bottomRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages]);

  const sendMessage = (e: React.FormEvent) => {
    e.preventDefault();
    if (!input.trim() || !ws.current || ws.current.readyState !== 1) return;
    const msg = {
       senderType: senderType ? String(senderType) : "", 
       patientId: patientId ? String(patientId) : "", 
       providerId: providerId ? String(providerId) : "", 
       receiverType: receiverType ? String(receiverType) : "", 
       text: input 
    };
    console.log('sending message', msg)
    ws.current.send(JSON.stringify(msg));
    setMessages((prev) => [...prev, msg]);
    setInput("");
  };


  return (
    <div className="w-full p-6 bg-white rounded shadow mt-10 flex flex-col h-full">
      <h2 className="text-xl font-bold mb-4">
        Chat with 
      </h2>
      <div className="flex-1 overflow-y-auto border rounded p-4 bg-gray-50 mb-4">
        {messages.map((msg, idx) => {
          const isMine = msg.senderId === senderId;
          return (
            <div
              key={idx}
              className={`mb-2 flex ${isMine ? "justify-end" : "justify-start"}`}
            >
              <div
                className={`px-3 py-2 rounded-lg max-w-xs ${
                  isMine ? "bg-blue-500 text-white" : "bg-gray-200 text-gray-800"
                }`}
              >
                <span>{msg.text}</span>
              </div>
            </div>
          );
        })}
        <div ref={bottomRef} />
      </div>
      <form onSubmit={sendMessage} className="flex gap-2">
        <input
          className="flex-1 border rounded px-3 py-2"
          value={input}
          onChange={(e) => setInput(e.target.value)}
          placeholder={connected ? "Type your message..." : "Connecting..."}
          disabled={!connected}
        />
        <button
          type="submit"
          className="btn btn-primary"
          disabled={!connected || !input.trim()}
        >
          Send
        </button>
      </form>
    </div>
  );
};