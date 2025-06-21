import React, { useEffect, useState } from "react";
import axios from "axios";
import { StarRating } from "./RatingStar";
import { ReviewModal } from "./ReviewModal";


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
}> = ({patientId, baseURL}) => {
  const [practitioners, setPractitioners] = useState<PractitionerSearchItem[]>([]);
  const [reviewModalDoctorId, setReviewModalDoctorId] = useState<string | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    fetch(`${baseURL}/practitioner`)
      .then((res) => {
        if (!res.ok) throw new Error("Failed to fetch practitioners");
        return res.json();
      })
      .then((data) => {
        setPractitioners(Array.isArray(data) ? data : data.entry?.map((e: { resource: PractitionerSearchItem}) => e.resource) || []);
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
          const doctorId = p.id;
          return (
            <li key={idx} className="border rounded p-3 bg-white shadow flex items-center justify-between">
              <div>
                <a
                  href={`/patient/profile/${p.id}`}
                  className="font-semibold text-blue-600 hover:underline"
                >
                  {p.name}
                </a>
                <div className="flex items-center gap-2 mb-1">
                  <StarRating rating={p.rating} />
                  {typeof p.rating === 'number' && <span className="text-xs text-gray-500">{p.rating.toFixed(1)}</span>}
                </div>
                <div className="text-sm text-gray-600">Gender: {p.gender || "Unknown"}</div>
                <div className="text-sm text-gray-600">Qualification: {p.qualification}</div>
                <div className="text-sm text-gray-600">Specialty: {p.specialty}</div>
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
                <button
                  className="ml-2 p-2 rounded-full hover:bg-green-100 text-green-600"
                  title="Add review"
                  onClick={() => setReviewModalDoctorId(doctorId)}
                >
                  <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-6 h-6">
                  <path strokeLinecap="round" strokeLinejoin="round" d="M12 4.5v15m7.5-7.5h-15" />
                  </svg>
                </button>
                {reviewModalDoctorId === doctorId && (
                   <ReviewModal
                    doctorName={p.name}
                    onClose={() => setReviewModalDoctorId(null)}
                    onSubmit={async (rating, comment) => {
                      await axios.post(`${baseURL}/review`, {
                        rating,
                        comment,
                        reviewerId: patientId,
                        encounterId: "91eac2ad-617d-4fa1-90e8-ad02e4cf3dca",
                        revieweeId: reviewModalDoctorId,
                      });
                      setReviewModalDoctorId(null);
                    }} />
                )}
              </div>
              
            </li>
          );
        })}
      </ul>
}
    </div>
  );
};
