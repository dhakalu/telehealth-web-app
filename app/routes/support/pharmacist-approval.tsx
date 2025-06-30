import axios from "axios";
import { useEffect, useState } from "react";
import { LoaderFunction, useLoaderData, useNavigate, useParams } from "react-router";
import { API_BASE_URL } from "~/api";
import { userApi } from "~/api/users";
import { requireAuthCookie } from "~/auth";
import Button from "~/components/common/Button";
import ErrorPage from "~/components/common/ErrorPage";
import SupportPageLayout from "~/components/common/page-layout/PageLayout";
import { PharmacistWithUser } from "~/components/pharmacist/types";
import { usePageTitle } from "~/hooks";

interface User {
    sub: string;
    name?: string;
    given_name?: string;
    family_name?: string;
    middle_name?: string;
    email?: string;
    account_type?: string;
    status?: string;
    verification_token?: string;
}

export const loader: LoaderFunction = async ({ request }) => {
    const user = await requireAuthCookie(request);
    return { user, baseUrl: API_BASE_URL };
}

export default function PharmacistApproval() {
    usePageTitle("Pharmacist Approval - MedTok Support");
    const { baseUrl } = useLoaderData<{ user: User, baseUrl: string }>();
    const { userId } = useParams<{ userId: string }>();
    const navigate = useNavigate();

    const [user, setUser] = useState<User | null>(null);
    const [pharmacist, setPharmacist] = useState<PharmacistWithUser | null>(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);
    const [processing, setProcessing] = useState(false);

    useEffect(() => {
        const fetchData = async () => {
            if (!userId) return;

            try {
                setLoading(true);
                setError(null);

                // Fetch user details
                const user = await userApi.getUserById(userId);
                setUser(user);

                // Fetch pharmacist details
                try {
                    const pharmacistResponse = await axios.get(`${baseUrl}/pharmacists/${userId}`);
                    setPharmacist(pharmacistResponse.data);
                } catch (pharmacistError) {
                    console.warn('Pharmacist details not found:', pharmacistError);
                    // This is okay - the user might not have completed their pharmacist profile yet
                }

            } catch (err) {
                console.error('Error fetching data:', err);
                setError('Failed to load pharmacist details. Please try again.');
            } finally {
                setLoading(false);
            }
        };

        if (userId) {
            fetchData();
        }
    }, [baseUrl, userId]);

    const handleApprove = async () => {
        if (!userId) return;

        setProcessing(true);
        try {
            await userApi.updateUserStatus(userId, 'complete');

            // Navigate back to team management with success message
            navigate('/support/team-management', {
                state: { message: 'Pharmacist approved successfully!' }
            });
        } catch (err) {
            console.error('Error approving pharmacist:', err);
            setError('Failed to approve pharmacist. Please try again.');
        } finally {
            setProcessing(false);
        }
    };

    const handleReject = async () => {
        if (!userId) return;

        setProcessing(true);
        try {
            await userApi.updateUserStatus(userId, 'rejected');

            // Navigate back to team management with success message
            navigate('/support/team-management', {
                state: { message: 'Pharmacist rejected successfully!' }
            });
        } catch (err) {
            console.error('Error rejecting pharmacist:', err);
            setError('Failed to reject pharmacist. Please try again.');
        } finally {
            setProcessing(false);
        }
    };

    if (loading) {
        return (
            <div className="min-h-screen flex items-center justify-center">
                <div className="animate-spin rounded-full h-32 w-32 border-b-2 border-info"></div>
            </div>
        );
    }

    if (error) {
        return (
            <ErrorPage error={error} />
        );
    }

    if (!user) {
        return (
            <div className="min-h-screen">
                <header className="shadow">
                    <div className="max-w-7xl mx-auto py-6 px-4 sm:px-6 lg:px-8">
                        <h1 className="text-3xl font-bold text-base-content">Pharmacist Approval</h1>
                    </div>
                </header>
                <main className="max-w-7xl mx-auto py-6 sm:px-6 lg:px-8">
                    <div className="text-center">
                        <h3 className="text-lg font-medium text-base-content">User not found</h3>
                        <p className="mt-1 text-sm text-base-content opacity-60">The requested user could not be found.</p>
                    </div>
                </main>
            </div>
        );
    }

    const displayName = user.name ||
        `${user.given_name || ''} ${user.family_name || ''}`.trim() ||
        user.email?.split('@')[0] ||
        'Unknown User';

    const headerActions = (
        <Button
            onClick={() => navigate('/support/team-management')}
            buttonType="neutral"
        >
            <svg className="-ml-1 mr-2 h-4 w-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M10 19l-7-7m0 0l7-7m-7 7h18" />
            </svg>
            Back to Team Management
        </Button>
    );

    return (
        <SupportPageLayout
            title="Pharmacist Approval"
            headerActions={headerActions}
        >
            <div className="grid grid-cols-1 gap-6 lg:grid-cols-3">
                {/* User Information */}
                <div className="lg:col-span-2">
                    <div className="shadow rounded-lg bg-base-100">
                        <div className="px-4 py-5 sm:p-6">
                            <h3 className="text-lg font-medium text-base-content mb-4">User Information</h3>

                            <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
                                <div>
                                    <label className="block text-sm font-medium text-base-content opacity-70">Name</label>
                                    <p className="mt-1 text-sm text-base-content">{displayName}</p>
                                </div>

                                {user.middle_name && (
                                    <div>
                                        <label className="block text-sm font-medium text-base-content opacity-70">Middle Name</label>
                                        <p className="mt-1 text-sm text-base-content">{user.middle_name}</p>
                                    </div>
                                )}

                                <div>
                                    <label className="block text-sm font-medium text-base-content opacity-70">Email</label>
                                    <p className="mt-1 text-sm text-base-content">{user.email}</p>
                                </div>

                                <div>
                                    <label className="block text-sm font-medium text-base-content opacity-70">Account Type</label>
                                    <span className="mt-1 inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-info text-info-content">
                                        {user.account_type}
                                    </span>
                                </div>

                                <div>
                                    <label className="block text-sm font-medium text-base-content opacity-70">Current Status</label>
                                    <span className="mt-1 inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-warning text-warning-content">
                                        {user.status}
                                    </span>
                                </div>

                                <div>
                                    <label className="block text-sm font-medium text-base-content opacity-70">User ID</label>
                                    <p className="mt-1 text-sm text-base-content opacity-60 font-mono">{user.sub}</p>
                                </div>
                            </div>
                        </div>
                    </div>

                    {/* Pharmacist Details */}
                    {pharmacist && (
                        <div className="mt-6 shadow rounded-lg bg-base-100">
                            <div className="px-4 py-5 sm:p-6">
                                <h3 className="text-lg font-medium text-base-content mb-4">Pharmacist Profile</h3>

                                {/* License Information */}
                                <div className="mb-6">
                                    <h4 className="text-md font-medium text-base-content mb-2">License Information</h4>
                                    <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
                                        <div>
                                            <label className="block text-sm font-medium text-base-content opacity-70">License Number</label>
                                            <p className="mt-1 text-sm text-base-content font-mono">{pharmacist.license_number}</p>
                                        </div>
                                        <div>
                                            <label className="block text-sm font-medium text-base-content opacity-70">License State</label>
                                            <p className="mt-1 text-sm text-base-content">{pharmacist.license_state}</p>
                                        </div>
                                        {pharmacist.license_expiry_date && (
                                            <div>
                                                <label className="block text-sm font-medium text-base-content opacity-70">License Expiry</label>
                                                <p className="mt-1 text-sm text-base-content">{new Date(pharmacist.license_expiry_date).toLocaleDateString()}</p>
                                            </div>
                                        )}
                                        {pharmacist.npi_number && (
                                            <div>
                                                <label className="block text-sm font-medium text-base-content opacity-70">NPI Number</label>
                                                <p className="mt-1 text-sm text-base-content font-mono">{pharmacist.npi_number}</p>
                                            </div>
                                        )}
                                        {pharmacist.dea_number && (
                                            <div>
                                                <label className="block text-sm font-medium text-base-content opacity-70">DEA Number</label>
                                                <p className="mt-1 text-sm text-base-content font-mono">{pharmacist.dea_number}</p>
                                            </div>
                                        )}
                                    </div>
                                </div>

                                {/* Professional Information */}
                                <div className="mb-6">
                                    <h4 className="text-md font-medium text-base-content mb-2">Professional Information</h4>
                                    <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
                                        {pharmacist.position && (
                                            <div>
                                                <label className="block text-sm font-medium text-base-content opacity-70">Position</label>
                                                <p className="mt-1 text-sm text-base-content">{pharmacist.position}</p>
                                            </div>
                                        )}
                                        {pharmacist.years_experience && (
                                            <div>
                                                <label className="block text-sm font-medium text-base-content opacity-70">Years of Experience</label>
                                                <p className="mt-1 text-sm text-base-content">{pharmacist.years_experience} years</p>
                                            </div>
                                        )}
                                        {pharmacist.hire_date && (
                                            <div>
                                                <label className="block text-sm font-medium text-base-content opacity-70">Hire Date</label>
                                                <p className="mt-1 text-sm text-base-content">{new Date(pharmacist.hire_date).toLocaleDateString()}</p>
                                            </div>
                                        )}
                                        {pharmacist.employee_id && (
                                            <div>
                                                <label className="block text-sm font-medium text-base-content opacity-70">Employee ID</label>
                                                <p className="mt-1 text-sm text-base-content font-mono">{pharmacist.employee_id}</p>
                                            </div>
                                        )}
                                    </div>
                                </div>

                                {/* Specializations */}
                                {pharmacist.specializations && pharmacist.specializations.length > 0 && (
                                    <div className="mb-6">
                                        <h4 className="text-md font-medium text-base-content mb-2">Specializations</h4>
                                        <div className="flex flex-wrap gap-2">
                                            {pharmacist.specializations.map((spec, index) => (
                                                <span key={index} className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-info text-info-content">
                                                    {spec}
                                                </span>
                                            ))}
                                        </div>
                                    </div>
                                )}

                                {/* Certifications */}
                                {pharmacist.certifications && pharmacist.certifications.length > 0 && (
                                    <div className="mb-6">
                                        <h4 className="text-md font-medium text-base-content mb-2">Certifications</h4>
                                        <div className="space-y-2">
                                            {pharmacist.certifications.map((cert, index) => (
                                                <div key={index} className="border border-base-300 rounded-lg p-3">
                                                    <p className="text-sm font-medium text-base-content">{cert}</p>
                                                </div>
                                            ))}
                                        </div>
                                    </div>
                                )}

                                {/* Permissions */}
                                <div className="mb-6">
                                    <h4 className="text-md font-medium text-base-content mb-2">Permissions & Capabilities</h4>
                                    <div className="grid grid-cols-1 gap-2 sm:grid-cols-3">
                                        <div className="flex items-center">
                                            <div className={`w-3 h-3 rounded-full mr-2 ${pharmacist.can_dispense_controlled ? 'bg-success' : 'bg-base-300'}`}></div>
                                            <span className="text-sm text-base-content">Can dispense controlled substances</span>
                                        </div>
                                        <div className="flex items-center">
                                            <div className={`w-3 h-3 rounded-full mr-2 ${pharmacist.can_counsel_patients ? 'bg-success' : 'bg-base-300'}`}></div>
                                            <span className="text-sm text-base-content">Can counsel patients</span>
                                        </div>
                                        <div className="flex items-center">
                                            <div className={`w-3 h-3 rounded-full mr-2 ${pharmacist.can_verify_prescriptions ? 'bg-success' : 'bg-base-300'}`}></div>
                                            <span className="text-sm text-base-content">Can verify prescriptions</span>
                                        </div>
                                    </div>
                                </div>

                                {/* Status Information */}
                                <div>
                                    <h4 className="text-md font-medium text-base-content mb-2">Account Status</h4>
                                    <div className="grid grid-cols-1 gap-2 sm:grid-cols-2">
                                        <div className="flex items-center">
                                            <div className={`w-3 h-3 rounded-full mr-2 ${pharmacist.active ? 'bg-success' : 'bg-base-300'}`}></div>
                                            <span className="text-sm text-base-content">Active</span>
                                        </div>
                                        <div className="flex items-center">
                                            <div className={`w-3 h-3 rounded-full mr-2 ${pharmacist.verified ? 'bg-success' : 'bg-warning'}`}></div>
                                            <span className="text-sm text-base-content">Verified</span>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        </div>
                    )}

                    {!pharmacist && (
                        <div className="mt-6 bg-warning opacity-80 border border-warning rounded-lg p-4">
                            <div className="flex">
                                <div className="flex-shrink-0">
                                    <svg className="h-5 w-5 text-warning" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-2.5L13.732 4c-.77-.833-1.99-.833-2.25 0L3.732 16.5c-.77.833.192 2.5 1.732 2.5z" />
                                    </svg>
                                </div>
                                <div className="ml-3">
                                    <h3 className="text-sm font-medium text-warning-content">
                                        Pharmacist Profile Incomplete
                                    </h3>
                                    <p className="mt-1 text-sm text-warning-content opacity-80">
                                        This user has not completed their pharmacist profile yet.
                                        You can still approve them based on the user information above.
                                    </p>
                                </div>
                            </div>
                        </div>
                    )}
                </div>

                {/* Actions */}
                <div className="lg:col-span-1">
                    <div className="shadow rounded-lg bg-base-100">
                        <div className="px-4 py-5 sm:p-6">
                            <h3 className="text-lg font-medium text-base-content mb-4">Actions</h3>

                            <div className="space-y-4">
                                <Button
                                    onClick={handleApprove}
                                    buttonType="success"
                                    isLoading={processing}
                                    disabled={processing || user.status === 'complete'}
                                    wide
                                >
                                    <svg className="-ml-1 mr-2 h-4 w-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M5 13l4 4L19 7" />
                                    </svg>
                                    {user.status === 'complete' ? 'Already Approved' : 'Approve Pharmacist'}
                                </Button>

                                <Button
                                    onClick={handleReject}
                                    buttonType="error"
                                    isLoading={processing}
                                    disabled={processing || user.status === 'rejected'}
                                    wide
                                >
                                    <svg className="-ml-1 mr-2 h-4 w-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M6 18L18 6M6 6l12 12" />
                                    </svg>
                                    {user.status === 'rejected' ? 'Already Rejected' : 'Reject Pharmacist'}
                                </Button>
                            </div>

                            <div className="mt-6 pt-6 border-t border-base-300">
                                <h4 className="text-sm font-medium text-base-content mb-2">Status Information</h4>
                                <div className="text-sm text-base-content opacity-60">
                                    <p><strong>Approve:</strong> Sets status to "complete" and allows the pharmacist to use the platform.</p>
                                    <p className="mt-2"><strong>Reject:</strong> Sets status to "rejected" and prevents platform access.</p>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </SupportPageLayout>
    );
}
