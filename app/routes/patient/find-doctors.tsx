import { LoaderFunction, useLoaderData } from "react-router";
import { requireAuthCookie } from "~/auth";
import { PractitionerList } from "../../components/PractitionerList";
import { User } from "../provider/complete-profile";

import { API_BASE_URL } from "~/api";
import PageHeader from "~/components/common/PageHeader";


export const loader: LoaderFunction = async ({ request }) => {
  const user = await requireAuthCookie(request);
  return {
    user,
    baseUrl: API_BASE_URL
  };
}

export default function PractitionerListPage() {
  const { user, baseUrl } = useLoaderData<{ user: User, baseUrl: string }>();
  return (
    <div className="min-h-screen  px-10">
      <PageHeader
        title="Find Doctors"
        description="Use the search below to find doctors who can help"
      />
      <PractitionerList patientId={user.sub} baseURL={baseUrl} />
    </div>
  );
}
