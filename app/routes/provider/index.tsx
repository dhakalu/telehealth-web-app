import { LoaderFunction, redirect, useLoaderData } from "react-router";

import { usePageTitle } from "~/hooks";

export const loader: LoaderFunction = async () => {
  return redirect(`/provider/patients`)
}

export default function NotFound() {
  usePageTitle("Provider Dashboard - MedTok");

  const { error } = useLoaderData<{ error: string }>();

  if (error) {
    return (
      <div className="max-w-xl mx-auto p-8 bg-red-100 text-red-800 rounded shadow mt-10">
        <h2 className="text-2xl font-bold mb-4">Error</h2>
        <p>{error}</p>
      </div>
    );
  }
  return null;
}