import axios from "axios";
import { useEffect, useState } from "react";
import { LoaderFunction, useLoaderData, useNavigate, useParams } from "react-router";
import { API_BASE_URL } from "~/api";
import { userApi } from "~/api/users";
import { requireAuthCookie } from "~/auth";
import Button from "~/components/common/Button";
import ErrorPage from "~/components/common/ErrorPage";
import SupportPageLayout from "~/components/support/SupportPageLayout";
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

interface Practitioner {
    id: string;
    identifier: Array<{
        use: string;
        type: {
            coding: Array<{
                system: string;
                code: string;
                display: string;
            }>;
        };
        system: string;
        value: string;
    }>;
    active: boolean;
    name: Array<{
        use: string;
        family: string;
        given: string[];
        prefix: string[];
        suffix: string[];
    }>;
    telecom: Array<{
        system: string;
        value: string;
        use: string;
    }>;
    address: Array<{
        use: string;
        type: string;
        text: string;
        line: string[];
        city: string;
        district: string;
        state: string;
        postalCode: string;
        country: string;
    }>;
    gender: string;
    birthDate: string;
    photo: Array<{
        contentType: string;
        data: string;
        url: string;
    }>;
    qualification: Array<{
        identifier: Array<{
            use: string;
            type: {
                coding: Array<{
                    system: string;
                    code: string;
                    display: string;
                }>;
            };
            system: string;
            value: string;
        }>;
        code: {
            coding: Array<{
                system: string;
                code: string;
                display: string;
            }>;
            text: string;
        };
        period: {
            start: string;
            end: string;
        };
        issuer: {
            reference: string;
            display: string;
        };
    }>;
    communication: Array<{
        coding: Array<{
            system: string;
            code: string;
            display: string;
        }>;
    }>;
}

export const loader: LoaderFunction = async ({ request }) => {
    const user = await requireAuthCookie(request);
    return { user, baseUrl: API_BASE_URL };
}

export default function PractitionerApproval() {
    usePageTitle("Practitioner Approval - MedTok Support");
    const { baseUrl } = useLoaderData<{ user: User, baseUrl: string }>();
    const { userId } = useParams<{ userId: string }>();
    const navigate = useNavigate();

    const [user, setUser] = useState<User | null>(null);
    const [practitioner, setPractitioner] = useState<Practitioner | null>(null);
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

                // Fetch practitioner details
                try {
                    const practitionerResponse = await axios.get(`${baseUrl}/practitioner/${userId}`);
                    setPractitioner(practitionerResponse.data);
                } catch (practitionerError) {
                    console.warn('Practitioner details not found:', practitionerError);
                    // This is okay - the user might not have completed their practitioner profile yet
                }

            } catch (err) {
                console.error('Error fetching data:', err);
                setError('Failed to load practitioner details. Please try again.');
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
                state: { message: 'Practitioner approved successfully!' }
            });
        } catch (err) {
            console.error('Error approving practitioner:', err);
            setError('Failed to approve practitioner. Please try again.');
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
                state: { message: 'Practitioner rejected successfully!' }
            });
        } catch (err) {
            console.error('Error rejecting practitioner:', err);
            setError('Failed to reject practitioner. Please try again.');
        } finally {
            setProcessing(false);
        }
    };

    if (loading) {
        return (
            <div className="min-h-screen flex items-center justify-center">
                <div className="animate-spin rounded-full h-32 w-32 border-b-2 border-blue-600"></div>
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
                        <h1 className="text-3xl font-bold opacity-90">Practitioner Approval</h1>
                    </div>
                </header>
                <main className="max-w-7xl mx-auto py-6 sm:px-6 lg:px-8">
                    <div className="text-center">
                        <h3 className="text-lg font-medium opacity-90">User not found</h3>
                        <p className="mt-1 text-sm opacity-50">The requested user could not be found.</p>
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
            title="Practitioner Approval"
            headerActions={headerActions}
        >
            <div className="grid grid-cols-1 gap-6 lg:grid-cols-3">
                {/* User Information */}
                <div className="lg:col-span-2">
                    <div className="shadow rounded-lg">
                        <div className="px-4 py-5 sm:p-6">
                            <h3 className="text-lg font-medium opacity-90 mb-4">User Information</h3>

                            <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
                                <div>
                                    <label className="block text-sm font-medium text-gray-700">Name</label>
                                    <p className="mt-1 text-sm opacity-90">{displayName}</p>
                                </div>

                                {user.middle_name && (
                                    <div>
                                        <label className="block text-sm font-medium text-gray-700">Middle Name</label>
                                        <p className="mt-1 text-sm opacity-90">{user.middle_name}</p>
                                    </div>
                                )}

                                <div>
                                    <label className="block text-sm font-medium text-gray-700">Email</label>
                                    <p className="mt-1 text-sm opacity-90">{user.email}</p>
                                </div>

                                <div>
                                    <label className="block text-sm font-medium text-gray-700">Account Type</label>
                                    <span className="mt-1 inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-indigo-100 text-indigo-800">
                                        {user.account_type}
                                    </span>
                                </div>

                                <div>
                                    <label className="block text-sm font-medium text-gray-700">Current Status</label>
                                    <span className="mt-1 inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-yellow-100 text-yellow-800">
                                        {user.status}
                                    </span>
                                </div>

                                <div>
                                    <label className="block text-sm font-medium text-gray-700">User ID</label>
                                    <p className="mt-1 text-sm opacity-50 font-mono">{user.sub}</p>
                                </div>
                            </div>
                        </div>
                    </div>

                    {/* Practitioner Details */}
                    {practitioner && (
                        <div className="mt-6 shadow rounded-lg">
                            <div className="px-4 py-5 sm:p-6">
                                <h3 className="text-lg font-medium opacity-90 mb-4">Practitioner Profile</h3>

                                {/* Qualifications */}
                                {practitioner.qualification && practitioner.qualification.length > 0 && (
                                    <div className="mb-6">
                                        <h4 className="text-md font-medium opacity-90 mb-2">Qualifications</h4>
                                        <div className="space-y-3">
                                            {practitioner.qualification.map((qual, index) => (
                                                <div key={index} className="border rounded-lg p-3">
                                                    <div className="flex justify-between items-start">
                                                        <div>
                                                            <p className="text-sm font-medium opacity-90">
                                                                {qual.code?.text || qual.code?.coding?.[0]?.display || 'Unknown Qualification'}
                                                            </p>
                                                            {qual.issuer && (
                                                                <p className="text-sm opacity-50">
                                                                    Issued by: {qual.issuer.display}
                                                                </p>
                                                            )}
                                                        </div>
                                                        {qual.period && (
                                                            <div className="text-sm opacity-50">
                                                                {qual.period.start} - {qual.period.end || 'Present'}
                                                            </div>
                                                        )}
                                                    </div>
                                                </div>
                                            ))}
                                        </div>
                                    </div>
                                )}

                                {/* Contact Information */}
                                {practitioner.telecom && practitioner.telecom.length > 0 && (
                                    <div className="mb-6">
                                        <h4 className="text-md font-medium opacity-90 mb-2">Contact Information</h4>
                                        <div className="grid grid-cols-1 gap-2 sm:grid-cols-2">
                                            {practitioner.telecom.map((contact, index) => (
                                                <div key={index}>
                                                    <label className="block text-sm font-medium text-gray-700 capitalize">
                                                        {contact.system} ({contact.use})
                                                    </label>
                                                    <p className="mt-1 text-sm opacity-90">{contact.value}</p>
                                                </div>
                                            ))}
                                        </div>
                                    </div>
                                )}

                                {/* Address */}
                                {practitioner.address && practitioner.address.length > 0 && (
                                    <div>
                                        <h4 className="text-md font-medium opacity-90 mb-2">Address</h4>
                                        {practitioner.address.map((addr, index) => (
                                            <div key={index} className="text-sm opacity-90">
                                                <p>{addr.text || addr.line?.join(', ')}</p>
                                                <p>{addr.city}, {addr.state} {addr.postalCode}</p>
                                                <p>{addr.country}</p>
                                            </div>
                                        ))}
                                    </div>
                                )}
                            </div>
                        </div>
                    )}

                    {!practitioner && (
                        <div className="mt-6 bg-yellow-50 border border-yellow-200 rounded-lg p-4">
                            <div className="flex">
                                <div className="flex-shrink-0">
                                    <svg className="h-5 w-5 text-yellow-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-2.5L13.732 4c-.77-.833-1.99-.833-2.25 0L3.732 16.5c-.77.833.192 2.5 1.732 2.5z" />
                                    </svg>
                                </div>
                                <div className="ml-3">
                                    <h3 className="text-sm font-medium text-yellow-800">
                                        Practitioner Profile Incomplete
                                    </h3>
                                    <p className="mt-1 text-sm text-yellow-700">
                                        This user has not completed their practitioner profile yet.
                                        You can still approve them based on the user information above.
                                    </p>
                                </div>
                            </div>
                        </div>
                    )}
                </div>

                {/* Actions */}
                <div className="lg:col-span-1">
                    <div className="shadow rounded-lg">
                        <div className="px-4 py-5 sm:p-6">
                            <h3 className="text-lg font-medium opacity-90 mb-4">Actions</h3>

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
                                    {user.status === 'complete' ? 'Already Approved' : 'Approve Practitioner'}
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
                                    {user.status === 'rejected' ? 'Already Rejected' : 'Reject Practitioner'}
                                </Button>
                            </div>

                            <div className="mt-6 pt-6 border-t border-gray-200">
                                <h4 className="text-sm font-medium opacity-90 mb-2">Status Information</h4>
                                <div className="text-sm opacity-60">
                                    <p><strong>Approve:</strong> Sets status to "complete" and allows the practitioner to use the platform.</p>
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
