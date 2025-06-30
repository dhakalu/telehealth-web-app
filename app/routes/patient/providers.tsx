import axios from "axios";
import { useEffect, useState } from "react";
import { LoaderFunction, useLoaderData, useNavigate } from "react-router";
import { API_BASE_URL } from "~/api";
import { reviewApi } from "~/api/review";
import { requireAuthCookie } from "~/auth";
import Button from "~/components/common/Button";
import ErrorPage from "~/components/common/ErrorPage";
import { Modal } from "~/components/common/Modal";
import PageHeader from "~/components/common/PageHeader";
import { BookAppointment } from "~/components/provider/BookAppointment";
import { ReviewModal } from "~/components/ReviewModal";
import { usePageTitle, useToast } from "~/hooks";
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
    usePageTitle("My Doctors");
    const toast = useToast();

    const navigate = useNavigate();

    const [reviewModalDoctor, setReviewModalDoctor] = useState<PractitionerSummary | null>(null);
    const [isBookingModalOpen, setIsBookingModalOpen] = useState(false);
    const [selectedProviderId, setSelectedProviderId] = useState<string | null>(null);


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

    useEffect(() => {
        if (reviewModalDoctor?.id) {
            (document.getElementById('review_modal') as HTMLDialogElement)?.showModal()
        }
    }, [reviewModalDoctor?.id])


    const handleBookingModalClose = () => {
        setIsBookingModalOpen(false);
        setSelectedProviderId(null);
    }

    const handleAppointmentBooked = () => {
        handleBookingModalClose();
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
            {practitioners.length === 0 ? (
                <div className="p-4 rounded-box shadow-md">
                    <div className="text-base-content opacity-70">
                        You have not visited any doctors in the past. Please visit a doctor to see them listed here.
                    </div>
                </div>
            ) : (
                <ul className="p-4 rounded-box shadow-md">
                    {practitioners.map((practitioner) => (
                        <li
                            onClick={() => handleSelect(practitioner)}
                            key={practitioner.id}
                            className="flex flex-col md:flex-row py-4 border-b cursor-pointer hover:bg-base-200 transition-colors"
                        >
                            <div className="md:flex-1">
                                <div className="font-bold">{practitioner.first_name} {practitioner.last_name}</div>
                                <div className="opacity-60 truncate">{practitioner.email}</div>
                            </div>
                            <div className="divider"></div>
                            <div className="flex md:items-center flex-col md:flex-row gap-2 mt-2 md:mt-0">
                                <Button
                                    buttonType="primary"
                                    soft
                                    title="Book appointment"
                                    onClick={(e) => {
                                        e.stopPropagation();
                                        setSelectedProviderId(practitioner.id);
                                        setIsBookingModalOpen(true);
                                    }}
                                >
                                    Book Appointment
                                </Button>
                                <Button
                                    buttonType="info"
                                    soft
                                    title="Add review"
                                    onClick={(e) => handleAddReview(e, practitioner)}
                                >
                                    <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-6 h-6">
                                        <path strokeLinecap="round" strokeLinejoin="round" d="M12 4.5v15m7.5-7.5h-15" />
                                    </svg>
                                    Add Review
                                </Button>
                            </div>
                        </li>
                    ))}
                </ul>
            )}
            {reviewModalDoctor && <ReviewModal
                doctorName={`${reviewModalDoctor.first_name} ${reviewModalDoctor.last_name}`}
                onClose={() => setReviewModalDoctor(null)}
                onSubmit={async (rating, comment) => {
                    try {
                        await reviewApi.createReview({
                            rating,
                            comment,
                            reviewerId: user.sub,
                            revieweeId: reviewModalDoctor.id,
                            encounterId: "badfb50c-89d3-4297-9c6f-3f7c4a38f28f",
                        });
                        toast.success("Review submitted successfully!");
                        setReviewModalDoctor(null);
                    } catch (error) {
                        console.error('Error creating review:', error);
                        toast.error("Failed to submit review. Please try again.");
                    } finally {
                        setReviewModalDoctor(null);
                    }
                }} />
            }
            <Modal
                isOpen={isBookingModalOpen && selectedProviderId !== null}
                onClose={handleBookingModalClose}
                title="Schedule an Appointment"
            >
                {selectedProviderId && (
                    <BookAppointment
                        providerId={selectedProviderId}
                        patientId={user.sub}
                        baseUrl={baseUrl}
                        onAppointmentBooked={handleAppointmentBooked}
                    />
                )}
            </Modal>
        </div>
    );
}