import React from "react";
import { useParams } from "react-router-dom";
import {ChatComponent} from "../../components/ChatComponent";
import { useLoaderData } from "@remix-run/react";
import { requireAuthCookie } from "~/auth";
import { LoaderFunction } from "@remix-run/node";

const WS_BASE = "ws://localhost:8090/ws";

export const loader: LoaderFunction = async ({ request }) => {
  const user =  await requireAuthCookie(request);
  return {
    user
  }
}

export default function PatientChat(){
  const { practitioner } = useParams();
  const { user } = useLoaderData<{user: any}>();

  return (
    <div className="min-h-screen flex flex-col bg-gray-50">
      <ChatComponent
        wsUrl={WS_BASE}
        senderType="patient"
        receiverType="provider"
        patientId={user.sub}
        providerId={practitioner || ""}
        participiantType="patient"
      />
    </div>
  );
};
