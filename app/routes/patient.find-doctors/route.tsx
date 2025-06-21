import { PractitionerList } from "../../components/PractitionerList";
import { requireAuthCookie } from "~/auth";
import { useLoaderData } from "@remix-run/react";
import { User } from "../provider.complete-profile/route";
import { LoaderFunction } from "@remix-run/node";
import { API_BASE_URL } from "~/api";


export const loader: LoaderFunction = async ({request}) =>{
  const user = await requireAuthCookie(request);
  return {
    user,
    baseUrl: API_BASE_URL
  };
}

export default function PractitionerListPage() {
  const {user, baseUrl} = useLoaderData<{user: User, baseUrl: string}>();
  return (
    <div className="min-h-screen bg-gray-50 p-8">
      <PractitionerList patientId={user.sub} baseURL={baseUrl} />
    </div>
  );
}
