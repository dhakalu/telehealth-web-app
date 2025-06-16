import React from "react";
import { PractitionerList } from "../../components/PractitionerList";
import { authCookie, requireAuthCookie } from "~/auth";
import { useLoaderData } from "@remix-run/react";
import { User } from "../provider.complete-profile/route";
import { LoaderFunction } from "@remix-run/node";


export const loader: LoaderFunction = async ({request}) =>{
  const user = requireAuthCookie(request);
  return user;
}

export default function PractitionerListPage() {
  const user = useLoaderData<User>();
  return (
    <div className="min-h-screen bg-gray-50 p-8">
      <PractitionerList patientId={user.sub} />
    </div>
  );
}
