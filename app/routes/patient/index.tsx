import { LoaderFunctionArgs, redirect } from "react-router";
import { requireAuthCookie } from "~/auth";

export const loader = async ({ request }: LoaderFunctionArgs)=> {
    const user = await requireAuthCookie(request);
    return redirect(`/patient/${user.sub}/health-condition`);
}

export default function Patient() {
  return null;
}