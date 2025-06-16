import React, { useEffect, useState } from "react";
import axios from "axios";

const baseURL = "http://localhost:8090";

export interface Practitioner {
  resourceType: string;
  identifier?: Array<{ system?: string; value?: string }>;
  active?: boolean;
  name?: Array<{
    use?: string;
    text?: string;
    family?: string;
    given?: string[];
    suffix?: string[];
    prefix?: string[];
  }>;
  telecom?: Array<{ system?: string; value?: string; use?: string; rank?: number }>;
  gender?: string;
  birthDate?: string;
  deceasedBoolean?: boolean;
  deceasedDateTime?: string;
  address?: Array<any>;
  photo?: Array<any>;
  qualification?: {
    identifier?: Array<{ system?: string; value?: string }>;
    code?: { text?: string };
    period?: { start?: string; end?: string };
    issuer?: { display?: string };
  }[];
  communication?: Array<any>;
}

export type Establishment = {
  id: string;
}

export const PractitionerList: React.FC<{
  patientId: string
}> = ({patientId}) => {
  const [practitioners, setPractitioners] = useState<Practitioner[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    fetch(`${baseURL}/practitioner`)
      .then((res) => {
        if (!res.ok) throw new Error("Failed to fetch practitioners");
        return res.json();
      })
      .then((data) => {
        setPractitioners(Array.isArray(data) ? data : data.entry?.map((e: any) => e.resource) || []);
        setLoading(false);
      })
      .catch((err) => {
        setError(err.message);
        setLoading(false);
      });
  }, []);

  const handleChatClick = async (doctorId?: string) => {
    if (!doctorId) return;
    try {
      await axios.put(`${baseURL}/establishment`, {
        practitionerId: doctorId,
        patientId: patientId,
        status: "pending"
        }, {
        headers: {
          "Content-Type": "application/json",
        }
      });
      window.location.href = `/patient/qa/${doctorId}`;
    } catch (error) {
      // Optionally handle error, but don't block navigation
    }

  }

  if (loading) return <div>Loading practitioners...</div>;
  if (error) return <div className="text-red-500">Error: {error}</div>;

  return (
    <div className="p-4">
      <h2 className="text-xl font-bold mb-4">Practitioner List</h2>
      
      {
        !practitioners.length ?<div className="text-gray-600">No practitioners available at this time</div>:<ul className="space-y-2">
        {practitioners.map((p, idx) => {
          // Use the first identifier value as doctorId if available
          const doctorId = p.identifier?.[0]?.value;
          return (
            <li key={idx} className="border rounded p-3 bg-white shadow flex items-center justify-between">
              <div>
                <div className="font-semibold">
                  {p.name?.[0]?.text || `${p.name?.[0]?.given?.join(" ") || ""} ${p.name?.[0]?.family || ""}`.trim() || "(No Name)"}
                </div>
                <div className="text-sm text-gray-600">Gender: {p.gender || "Unknown"}</div>
                <div className="text-sm text-gray-600">Qualification: {p.qualification?.[0]?.identifier?.[0]?.value}</div>
                <div className="text-sm text-gray-600">Specialty: {p.qualification?.[0]?.code?.text || "N/A"}</div>
                <div className="text-sm text-gray-600">Phone: {p.telecom?.find(t => t.system === "phone")?.value || "N/A"}</div>
              </div>
              <button
                className="ml-4 p-2 rounded-full hover:bg-blue-100 text-blue-600"
                title="Chat with doctor"
                onClick={() => handleChatClick(doctorId)}
              >
                <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-6 h-6">
                  <path strokeLinecap="round" strokeLinejoin="round" d="M8.625 15.75a6.75 6.75 0 01-2.458-.45l-2.507.627a.75.75 0 01-.91-.91l.627-2.508A6.75 6.75 0 1120.25 12c0 3.728-3.022 6.75-6.75 6.75a6.716 6.716 0 01-4.875-2.025z" />
                </svg>
              </button>
            </li>
          );
        })}
      </ul>
}
    </div>
  );
};
