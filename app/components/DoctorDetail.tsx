import React from "react";
import { Column, Table } from "./common/Table";
import { StarRating } from "./RatingStar";
import { ReviewList } from "./ReviewList";


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
    id: string;
    doctor: FHIRPractitioner;
};

// Types for table data
type QualificationTableRow = {
    id: string;
    qualification: string;
    issuedBy: string;
    validFor: string;
};

type TelecomTableRow = {
    id: string;
    type: string;
    value: string;
    use: string;
};

// Helper functions to extract FHIR fields
const getName = (practitioner: FHIRPractitioner) => {
    const nameObj = practitioner.name?.[0];
    if (nameObj?.text) return nameObj.text;
    const given = nameObj?.given?.join(" ") || "";
    const family = nameObj?.family || "";
    return [given, family].filter(Boolean).join(" ") || "Unknown";
};


export const DoctorDetail: React.FC<DoctorDetailProps> = ({ doctor, id }) => {
    const photoUrl = doctor?.photo?.[0].url;
    const name = getName(doctor);
    const rating = doctor.extension?.rating || 0;
    const bio = doctor.extension?.bio

    // Transform qualifications data for Table component
    const qualificationsData: QualificationTableRow[] = doctor.qualification?.map((q, idx) => ({
        id: `qual-${idx}`,
        qualification: q.code?.text || "N/A",
        issuedBy: q.issuer?.display || "N/A",
        validFor: q.period?.start
            ? `${q.period.start}${q.period.end ? ` - ${q.period.end}` : " - Present"}`
            : "N/A"
    })) || [];

    const qualificationColumns: Column<QualificationTableRow>[] = [
        {
            header: "Qualification",
            accessor: (row) => row.qualification
        },
        {
            header: "Issued By",
            accessor: (row) => row.issuedBy
        },
        {
            header: "Valid for",
            accessor: (row) => row.validFor
        }
    ];

    // Transform telecom data for Table component
    const telecomData: TelecomTableRow[] = doctor.telecom?.map((contact, idx) => ({
        id: `telecom-${idx}`,
        type: contact.system || "N/A",
        value: contact.value || "N/A",
        use: contact.use || "N/A"
    })) || [];

    const telecomColumns: Column<TelecomTableRow>[] = [
        {
            header: "Type",
            accessor: (row) => row.type
        },
        {
            header: "Value",
            accessor: (row) => row.value
        },
        {
            header: "Use",
            accessor: (row) => row.use
        }
    ];

    return (
        <div className=" rounded shadow p-6 max-w-lg mx-auto mt-8">
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
                        {typeof rating === 'number' && <span className="text-xs opacity-50">{rating.toFixed(1)}</span>}
                    </div>
                    <div className="mb-2">{doctor.gender || "Unknown"}</div>
                </div>
            </div>

            <span className="font-semibold">Qualifications</span>
            <div className="mt-2">
                <Table
                    columns={qualificationColumns}
                    data={qualificationsData}
                    emptyMessage="No qualifications available"
                />
            </div>

            <span className="font-semibold mt-4 block">Contacts</span>
            <div className="mt-2 mb-4">
                <Table
                    columns={telecomColumns}
                    data={telecomData}
                    emptyMessage="No contact information available"
                />
            </div>

            <div>
                {bio && <div className="mb-2"><span className="font-semibold">Bio:</span> {bio}</div>}
            </div>

            {/* Reviews Section */}
            <ReviewList
                revieweeId={id}
                title="Reviews"
                maxReviews={5}
                onViewAll={() => {
                    // TODO: Navigate to full reviews page or open modal
                    console.log('View all reviews clicked');
                }}
            />
        </div>
    );
};
export default DoctorDetail;
