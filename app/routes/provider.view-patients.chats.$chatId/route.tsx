import {Chat, ChatComponent, Message} from "../../components/ChatComponent";
import { LoaderFunction } from "@remix-run/node";
import { requireAuthCookie } from "~/auth";
import { useLoaderData } from "@remix-run/react";
import axios from "axios";

const WS_BASE = "ws://localhost:8090/ws";

export const loader: LoaderFunction = async ({ request, params }) => {
  const user =  await requireAuthCookie(request);
  const { chatId } = params;
  try {
    const [chat, messages] = await axios.all([
      axios.get(`http://localhost:8090/chat/${chatId}`),
      axios.get(`http://localhost:8090/chat/${chatId}/messages`)
    ]);
    return {
      user,
      chat: chat.data as Chat,
      messages: messages.data
    }
  } catch (error) {
    if (axios.isAxiosError(error) && error.response) {
      return Response.json(
      error.response.data,
      { status: error.response.status }
      );
    } else {
      console.error("Error fetching chat:", error);
      return Response.json(
        { error: "Internal server error" },
        { status: 500 }
      );
    }
    
  }
}

export default function PractitionerChat(){
  const { user, chat, messages } = useLoaderData<{user: any, chat: Chat, messages: Message[]}>();

  return (
    <ChatComponent
      wsUrl={WS_BASE}
      senderType="provider"
      receiverType="patient"
      providerId={chat.providerId}
      patientId={chat.patientId || ""}
      participiantType="provider"
      initialMessages={messages}
    />
  );
};

