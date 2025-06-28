import React from "react";
import type { LinksFunction } from "react-router";
import {
  isRouteErrorResponse,
  Links,
  Outlet,
  Scripts,
  ScrollRestoration,
  useRouteError
} from "react-router";

import ErrorPage from "./components/common/ErrorPage";
import { NotificationsContainer } from "./components/common/Notifications";
import { NotificationProvider } from "./context/NotificationContext";
import { TitleProvider } from "./context/TitleContext";
import { useTitle } from "./hooks";
import NotFoundPage from "./NotFoundPage";
import "./tailwind.css";

export const links: LinksFunction = () => [
  { rel: "preconnect", href: "https://fonts.googleapis.com" },
  {
    rel: "preconnect",
    href: "https://fonts.gstatic.com",
    crossOrigin: "anonymous",
  },
  {
    rel: "stylesheet",
    href: "https://fonts.googleapis.com/css2?family=Inter:ital,opsz,wght@0,14..32,100..900;1,14..32,100..900&display=swap",
  },
];

export function ErrorBoundary() {
  const error = useRouteError();

  if (isRouteErrorResponse(error)) {

    if (error.status === 404) {
      return (<NotFoundPage />)
    }

    return (
      <div className="min-h-screen flex items-center justify-center  p-8">
        <div className=" text-destructive p-4 rounded shadow-md">
          <h1 className="font-semibold">Error {error.status}</h1>
          <p>{error.statusText || "An unexpected error occurred."}</p>
          <p>Try refreshing the page. If the issue persists contact an Administrator.</p>
        </div>
      </div>
    );
  } else if (error instanceof Error) {
    return (
      <div className="min-h-screen flex items-center justify-center  p-8">
        <div className="text-destructive p-4 rounded shadow-md">
          <h1 className="font-semibold">Error</h1>
          <p>{error.message}</p>
          <p>The stack trace is:</p>
          <pre className="mt-2  p-2 rounded">{error.stack}</pre>
        </div>
      </div>
    );
  } else {
    return <ErrorPage error="An unknown error occurred." />;
  }
}

function DynamicTitle() {
  const { title } = useTitle();
  return <title>{title}</title>;
}

export function Layout({ children }: { children: React.ReactNode }) {
  return (
    <TitleProvider>
      <html lang="en">
        <head>
          <meta charSet="utf-8" />
          <meta name="viewport" content="width=device-width, initial-scale=1" />
          <DynamicTitle />
          <meta
            name="description"
            content="Find doctors 24/7"
          />
          <Links />
        </head>
        <body className="bg-base-200 text-base-content h-full">
          <NotificationProvider>
            {children}
            <NotificationsContainer />
          </NotificationProvider>
          <ScrollRestoration />
          <Scripts />
        </body>
      </html>
    </TitleProvider>
  );
}

export default function App() {
  return <Outlet />;
}
