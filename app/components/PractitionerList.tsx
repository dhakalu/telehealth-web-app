import axios from "axios";
import React, { useEffect, useState } from "react";
import { StarRating } from "./RatingStar";


export interface PractitionerSearchItem {
  id: string;
  name: string;
  gender?: string;
  qualification?: string;
  specialty?: string;
  rating?: number;
}

export type Establishment = {
  id: string;
}

export const PractitionerList: React.FC<{
  patientId: string
  baseURL?: string
}> = ({ patientId, baseURL }) => {
  const [practitioners, setPractitioners] = useState<PractitionerSearchItem[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    fetch(`${baseURL}/practitioner`)
      .then((res) => {
        if (!res.ok) throw new Error("Failed to fetch practitioners");
        return res.json();
      })
      .then((data) => {
        setPractitioners(Array.isArray(data) ? data : data.entry?.map((e: { resource: PractitionerSearchItem }) => e.resource) || []);
        setLoading(false);
      })
      .catch((err) => {
        setError(err.message);
        setLoading(false);
      });
  }, [baseURL]);

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
      console.warn("failed to crete an establishment", error)
      // Optionally handle error, but don't block navigation
    }

  }

  if (loading) return <div>Loading practitioners...</div>;
  if (error) return <div className="text-red-500">Error: {error}</div>;

  return (
    <div>
      {
        !practitioners.length ? <div className="opacity-60">No practitioners available at this time</div> : <ul className="space-y-2">
          {practitioners.map((p, idx) => {
            // Use the first identifier value as doctorId if available
            const doctorId = p.id;
            return (
              <li key={idx} className="bg-base-100 rounded p-3 shadow flex items-center justify-between">
                <div>
                  <a
                    href={`/patient/profile/${p.id}`}
                    className="font-semibold text-blue-600 hover:underline"
                  >
                    {p.name}
                  </a>
                  <div className="flex items-center gap-2 mb-1">
                    <StarRating rating={p.rating} />
                    {typeof p.rating === 'number' && <span className="text-xs opacity-60">{p.rating.toFixed(1)}</span>}
                  </div>
                  <div className="text-sm opacity-60">Gender: {p.gender || "Unknown"}</div>
                  <div className="text-sm opacity-60">Qualification: {p.qualification}</div>
                  <div className="text-sm opacity-60">Specialty: {p.specialty}</div>
                </div>
                <div>
                  <button
                    className="ml-4 p-2 rounded-full hover:bg-blue-100 text-blue-600"
                    title="Chat with doctor"
                    onClick={() => handleChatClick(doctorId)}
                  >
                    <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-6 h-6">
                      <path strokeLinecap="round" strokeLinejoin="round" d="M8.625 15.75a6.75 6.75 0 01-2.458-.45l-2.507.627a.75.75 0 01-.91-.91l.627-2.508A6.75 6.75 0 1120.25 12c0 3.728-3.022 6.75-6.75 6.75a6.716 6.716 0 01-4.875-2.025z" />
                    </svg>
                  </button>
                </div>

              </li>
            );
          })}
        </ul>
      }
    </div>
  );
};
