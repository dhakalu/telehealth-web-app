import React from "react";
import { useParams } from "react-router-dom";
import {Chat, ChatComponent, ChatMessage} from "../../components/ChatComponent";
import { useLoaderData } from "@remix-run/react";
import { requireAuthCookie } from "~/auth";
import { LoaderFunction } from "@remix-run/node";
import axios from "axios";

const WS_BASE = "ws://localhost:8090/ws";

export const loader: LoaderFunction = async ({ request, params }) => {
  const user =  await requireAuthCookie(request);

  // fetch encounter-id
  const {practitioner: providerId} = params
  const patientId = user.sub

    
  try {
      const chatUrl = `http://localhost:8090/chat`
      console.log('chat url', chatUrl)
      const chatResponse = await axios.put(chatUrl, {
        providerId,
        patientId
      });
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

        if (error.response.status == 404) {
          return {
            user,
            chat: null,
            messages: []
          }
        }

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


export default function PatientChat(){
  const { user, chat, messages } = useLoaderData<{user: any, chat: Chat, messages: ChatMessage[]}>();

  return (
    <div className="min-h-screen flex flex-col bg-gray-50">
      <ChatComponent
        wsUrl={WS_BASE}
        chat={chat}
        receiverId={chat.providerId}
        senderId={chat.patientId}
        initialMessages={messages}
      />
    </div>
  );
};
