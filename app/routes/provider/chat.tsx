import { LoaderFunction, useLoaderData } from "react-router";
import { requireAuthCookie } from "~/auth";
import { Chat, ChatComponent, ChatMessage } from "../../components/ChatComponent";

import axios from "axios";
import { API_BASE_URL } from "~/api";
import ErrorPage from "~/components/common/ErrorPage";
import { usePageTitle } from "~/hooks";


export const loader: LoaderFunction = async ({ request, params }) => {
  const user = await requireAuthCookie(request);

  // fetch encounter-id
  const { patientId } = params
  const providerId = user.sub


  try {
    const chatUrl = `${API_BASE_URL}/chat/by-patient-and-provider?patientId=${patientId}&practitionerId=${providerId}`
    const chatResponse = await axios.get(chatUrl);
    const chat = chatResponse.data as Chat;
    const messages = await axios.get(`${API_BASE_URL}/chat/${chat.chatId}/messages`)
    return {
      user,
      chat: chat,
      messages: messages.data || [],
      wsUrl: `${API_BASE_URL.replace('http', 'ws')}/ws`
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

export default function PractitionerChat() {
  usePageTitle("Chat - Provider - MedTok");
  const { chat, messages, error, wsUrl } = useLoaderData<{ chat: Chat, messages: ChatMessage[], error: string, wsUrl: string }>();

  if (error) {
    return <ErrorPage error={error} />;
  }
  return (
    <ChatComponent
      key={chat.patientId}
      wsUrl={wsUrl}
      chat={chat}
      receiverId={chat.patientId}
      senderId={chat.providerId}
      initialMessages={messages}
    />
  );
}

