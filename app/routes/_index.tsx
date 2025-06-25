import type { MetaFunction } from "react-router";
import Card from "~/components/common/Card";

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
          <h1 className="leading text-2xl font-bold">
            Welcome to MedTok
          </h1>

        </header>
        <nav>
          <Card>
            <p className="leading-6">
              Are you a practitioner or a patient?
            </p>
            <ul>
              <li>
                <a
                  className="group flex items-center gap-3 self-stretch p-3 leading-normal text-link hover:underline"
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
                  className="group flex items-center gap-3 self-stretch p-3 leading-normal text-link hover:underline"
                  href="/patient"
                >
                  <span role="img" aria-label="user">
                    👤
                  </span>{" "}
                  Patient
                </a>
              </li>

            </ul>
          </Card>
        </nav>
      </div>
    </div>
  );
}

