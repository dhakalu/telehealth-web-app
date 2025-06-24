import type { MetaFunction } from "react-router";

export const meta: MetaFunction = () => {
  return [
    { title: "Med Tok" },
    { name: "description", content: "Welcome medtok" },
  ];
};

export default function Index() {
  return (
    <div className="flex h-screen items-center justify-center">
      <div className="flex flex-col items-center gap-16">
        <header className="flex flex-col items-center gap-9">
          <img
            src="/logo.png"
            alt="MedTok Logo"
            className="h-24 w-24 rounded-full shadow-lg"
          />
          <h1 className="leading text-2xl font-bold text-gray-800 dark:text-gray-100">
            Welcome to MedTok
          </h1>

        </header>
        <nav className="flex flex-col items-center justify-center gap-4 rounded-3xl border border-gray-200 p-6 dark:border-gray-700">
          <p className="leading-6 text-gray-700 dark:text-gray-200">
            Are you a practitioner or a patient?
          </p>
          <ul>
            <li>
              <a
                className="group flex items-center gap-3 self-stretch p-3 leading-normal text-blue-700 hover:underline dark:text-blue-500"
                href="/provider"
              >
                <span role="img" aria-label="doctor">
                  🩺
                </span>{" "}
                Practitioner
              </a>
            </li>
            <li>
              <a
                className="group flex items-center gap-3 self-stretch p-3 leading-normal text-blue-700 hover:underline dark:text-blue-500"
                href="/patient"
              >
                <span role="img" aria-label="user">
                  👤
                </span>{" "}
                Patient
              </a>
            </li>

          </ul>
        </nav>
      </div>
    </div>
  );
}

