import {Chat, ChatComponent, ChatMessage} from "../../components/ChatComponent";
import { useLoaderData } from "@remix-run/react";
import { requireAuthCookie } from "~/auth";
import { LoaderFunction } from "@remix-run/node";
import axios from "axios";
import { API_BASE_URL } from "~/api";
import ErrorPage from "~/components/common/ErrorPage";


export const loader: LoaderFunction = async ({ request, params }) => {
  const user =  await requireAuthCookie(request);

  // fetch encounter-id
  const {practitioner: providerId} = params
  const patientId = user.sub

  try {
      const chatUrl = `${API_BASE_URL}/chat`
      console.log('chat url', chatUrl)
      const chatResponse = await axios.put(chatUrl, {
        providerId,
        patientId
      });
      const chat = chatResponse.data as Chat;
      const messages = await axios.get(`${chatUrl}/${chat.chatId}/messages`)
      return {
        user,
        chat: chat,
        messages: messages.data || [],
        wsUrl: `${API_BASE_URL.replace('https', 'wss')}/ws`
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
  const { chat, messages, error, wsUrl } = useLoaderData<{ chat: Chat, messages: ChatMessage[], error: string, wsUrl: string}>();

  if (error) {
    return (
      <ErrorPage
        error={error}
      />
    );
  }

  return (
    <div className="min-h-screen flex flex-col bg-gray-50">
      <ChatComponent
        wsUrl={wsUrl}
        chat={chat}
        receiverId={chat.providerId}
        senderId={chat.patientId}
        initialMessages={messages}
      />
    </div>
  );
}
