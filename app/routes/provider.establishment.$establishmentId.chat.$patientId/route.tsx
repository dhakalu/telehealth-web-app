import {Chat, ChatComponent, ChatMessage} from "../../components/ChatComponent";
import { LoaderFunction } from "@remix-run/node";
import { requireAuthCookie } from "~/auth";
import { useLoaderData } from "@remix-run/react";
import axios from "axios";

const WS_BASE = "ws://localhost:8090/ws";

export const loader: LoaderFunction = async ({ request, params }) => {
  const user =  await requireAuthCookie(request);

  // fetch encounter-id
  const {patientId} = params
  const providerId = user.sub

    
  try {
      const chatUrl = `http://localhost:8090/chat/by-patient-and-provider?patientId=${patientId}&practitionerId=${providerId}`
      console.log('chat url', chatUrl)
      const chatResponse = await axios.get(chatUrl);
      const chat = chatResponse.data as Chat;
      const messages = await axios.get(`http://localhost:8090/chat/${chat.chatId}/messages`)
      return {
        user,
        chat: chat,
        messages: messages.data || []
      }
  } catch (error) {
      console.error(error)
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
  const { chat, messages } = useLoaderData<{user: any, chat: Chat, messages: ChatMessage[]}>();

  return (
    <ChatComponent
      wsUrl={WS_BASE}
      chat={chat}
      receiverId={chat.patientId}
      senderId={chat.providerId}
      initialMessages={messages}
    />
  );
};

