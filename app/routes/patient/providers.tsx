import axios from "axios";
import { useState } from "react";
import { LoaderFunction, useLoaderData, useNavigate } from "react-router";
import { API_BASE_URL } from "~/api";
import { requireAuthCookie } from "~/auth";
import ErrorPage from "~/components/common/ErrorPage";
import PageHeader from "~/components/common/PageHeader";
import { ReviewModal } from "~/components/ReviewModal";
import { User } from "../provider/complete-profile";


// Loader for React Router
export const loader: LoaderFunction = async ({ request }) => {
    const user = await requireAuthCookie(request)
    const baseUrl = API_BASE_URL
    try {
        const response = await axios.get(`${baseUrl}/patient/${user.sub}/providers`);
        return {
            practitioners: response.data,
            user,
            baseUrl
        }
    } catch (error) {
        if (axios.isAxiosError(error)) {
            if (error.response?.status === 404) {
                return {
                    practitioners: [],
                    user,
                    baseUrl
                };
            } else {
                return Response.json(error.response?.data, { status: error.response?.status || 500 })
            }
        }
        return Response.json({
            error: "Unexpected error occurred",
        }, {
            status: 500,
        })
    }
};

type PractitionerSummary = {
    id: string;
    first_name: string;
    last_name: string;
    email: string;
}

export default function Providers() {
    const navigate = useNavigate();

    const [reviewModalDoctor, setReviewModalDoctor] = useState<PractitionerSummary | null>(null);


    const { practitioners, error, user, baseUrl } = useLoaderData() as {
        practitioners: PractitionerSummary[];
        error: string;
        baseUrl: string;
        user: User,
    };

    const handleSelect = (p: PractitionerSummary) => {
        navigate(`/patient/profile/${p.id}`)
    }

    const handleAddReview = (e: React.MouseEvent<HTMLButtonElement>, p: PractitionerSummary) => {
        e.stopPropagation();
        setReviewModalDoctor(p);
    }

    if (error) {
        return (
            <ErrorPage error={error} />
        )
    }

    return (
        <div className="px-10">
            <PageHeader
                title="My Doctors"
                description="List of doctors that you have interacted with in the past."
            />
            <ul style={{ listStyle: "none", padding: 0 }}>
                {practitioners.map((practitioner) => (
                    <li
                        onClick={() => handleSelect(practitioner)}
                        key={practitioner.id}
                        className="border cursor-pointer p-3 bg-white shadow flex items-center justify-between"
                    >
                        <div className="flex flex-1 gap-2">
                            <div className="font-bold">{practitioner.first_name} {practitioner.last_name}</div>
                            <div className="text-gray-400">{practitioner.email}</div>
                        </div>
                        <button
                            className="flex ml-2 p-2 rounded-full hover:bg-green-100 text-green-600"
                            title="Add review"
                            onClick={(e) => handleAddReview(e, practitioner)}
                        >
                            <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-6 h-6">
                                <path strokeLinecap="round" strokeLinejoin="round" d="M12 4.5v15m7.5-7.5h-15" />
                            </svg>
                            Add Review
                        </button>
                    </li>
                ))}
            </ul>
            {reviewModalDoctor && (
                <ReviewModal
                    doctorName={`${reviewModalDoctor.first_name} ${reviewModalDoctor.last_name}`}
                    onClose={() => setReviewModalDoctor(null)}
                    onSubmit={async (rating, comment) => {
                        await axios.post(`${baseUrl}/review`, {
                            rating,
                            comment,
                            reviewerId: user.sub,
                            encounterId: "badfb50c-89d3-4297-9c6f-3f7c4a38f28f",
                            revieweeId: reviewModalDoctor.id,
                        });
                        setReviewModalDoctor(null);
                    }} />
            )}
        </div>
    );
}