import React from "react";
import { StarRating } from "./RatingStar";
import { LoaderFunction } from "@remix-run/node";
import axios from "axios";
import { useLoaderData } from "@remix-run/react";

// FHIR Practitioner resource type (simplified for this context)
export type FHIRPractitioner = {
    resourceType: "Practitioner";
    id: string;
    name: Array<{
        family?: string;
        given?: string[];
        prefix?: string[];
        suffix?: string[];
        text?: string;
    }>;
    gender?: string;
    telecom?: Array<{
        system?: "phone" | "email" | "fax" | "pager" | "url" | "sms" | "other";
        value?: string;
        use?: "home" | "work" | "temp" | "old" | "mobile";
    }>;
    qualification?: Array<{
        code?: {
            text?: string;
        };
        issuer?: {
            display?: string;
            reference?: string;
        };
        period?: {
            start?: string;
            end?: string;
        };
        identifier?: Array<{
            system?: string;
            value?: string;
        }>;
    }>;
    photo?: Array<{
        url: string;
    }>;
    // Extensions for custom fields (e.g., rating, bio, specialty)
    extension?: {
        url: string;
        valueString?: string;
        valueDecimal?: number;
        bio?: string;
        rating?: number;
    };
};

type DoctorDetailProps = {
    doctor: FHIRPractitioner;
};

// Helper functions to extract FHIR fields
const getName = (practitioner: FHIRPractitioner) => {
    const nameObj = practitioner.name?.[0];
    if (nameObj?.text) return nameObj.text;
    const given = nameObj?.given?.join(" ") || "";
    const family = nameObj?.family || "";
    return [given, family].filter(Boolean).join(" ") || "Unknown";
};

export const loader: LoaderFunction = async ({params}) => {
    const { practitionerId } = params;
    try {
      const res = await axios.get(`${process.env.API_URL || "http://localhost:8090"}/practitioner/${practitionerId}`);
      return {data: res.data};
    } catch (error: any) {
      return { error: error?.response?.data?.error || error.message || "cannot fetch provider" };
    }
}


export const DoctorDetail: React.FC<DoctorDetailProps> = ({ doctor }) => {
  const { data, error} = useLoaderData<{data: FHIRPractitioner, error: string}>()
const photoUrl = data?.photo?.[0].url;
const name = getName(data);
const rating = data.extension?.rating || 0;
const bio = data.extension?.bio

  return (
    <div className="bg-white rounded shadow p-6 max-w-lg mx-auto mt-8">
      <div className="flex items-center gap-6 mb-4">
        {photoUrl ? (
          <img src={photoUrl} alt="Profile" className="w-20 h-20 rounded-full object-cover border" />
        ) : (
          <div className="w-20 h-20 rounded-full flex items-center justify-center bg-blue-500 text-white font-bold text-2xl border">
            {name.split(" ").map(n => n[0]).join("")}
          </div>
        )}
        <div>
          <div className="text-2xl font-bold">{name}</div>
          <div className="flex items-center gap-2">
            <StarRating rating={rating} />
            {typeof rating === 'number' && <span className="text-xs text-gray-500">{rating.toFixed(1)}</span>}
          </div>
          <div className="mb-2">{doctor.gender || "Unknown"}</div>
        </div>
      </div>
      
    <span className="font-semibold">Qualifications</span>
    {doctor.qualification && doctor.qualification.length > 0 ? (
        <table className="min-w-full text-sm mt-2">
            <thead>
                <tr>
                    <th className="text-left font-semibold">Qualification</th>
                    <th className="text-left font-semibold">Issued By</th>
                    <th className="text-left font-semibold">Valid for</th>
                </tr>
            </thead>
            <tbody>
                {doctor.qualification.map((q, idx) => (
                    <tr key={idx}>
                        <td>{q.code?.text || "N/A"}</td>
                        <td>{q.issuer?.display || "N/A"}</td>
                        <td>
                            {q.period?.start
                                ? `${q.period.start}-${q.period.end ? ` ${q.period.end}` : " Present"}`
                                : "N/A"}
                        </td>
                    </tr>
                ))}
            </tbody>
        </table>
    ) : (
        <span className="ml-2">N/A</span>
    )}
    <span className="font-semibold mt-4 block">Contacts</span>
    {doctor.telecom && doctor.telecom.length > 0 ? (
        <table className="min-w-full text-sm mt-2 mb-4">
            <thead>
                <tr>
                    <th className="text-left font-semibold">Type</th>
                    <th className="text-left font-semibold">Value</th>
                    <th className="text-left font-semibold">Use</th>
                </tr>
            </thead>
            <tbody>
                {doctor.telecom.map((contact, idx) => (
                    <tr key={idx}>
                        <td>{contact.system || "N/A"}</td>
                        <td>{contact.value || "N/A"}</td>
                        <td>{contact.use || "N/A"}</td>
                    </tr>
                ))}
            </tbody>
        </table>
    ) : (
        <span className="ml-2">N/A</span>
    )}
    <div>
      {bio && <div className="mb-2"><span className="font-semibold">Bio:</span> {bio}</div>}
    </div>
    </div>
  );
};
export default DoctorDetail;
