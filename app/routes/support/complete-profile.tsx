import axios from "axios";
import { useState } from "react";
import { LoaderFunction, redirect, useLoaderData } from "react-router";
import { API_BASE_URL } from "~/api";
import { userApi } from "~/api/users";
import { requireAuthCookie } from "~/auth";
import Button from "~/components/common/Button";
import { Input } from "~/components/common/Input";
import { Select } from "~/components/common/Select";
import { usePageTitle, useToast } from "~/hooks";
import { User } from "../provider/complete-profile";


export const loader: LoaderFunction = async ({ request }) => {
    const loggedInUser = await requireAuthCookie(request);
    const user = await userApi.getUserById(loggedInUser.sub);
    // If already complete, redirect to support dashboard
    if (user?.status === "complete") {
        return redirect("/support");
    }

    return { user, baseUrl: API_BASE_URL, loggedInUser };
}


export default function SupportCompleteProfile() {
    usePageTitle("Complete Your Profile - MedTok Support");
    const toast = useToast();
    const { user, baseUrl, loggedInUser } = useLoaderData<{ loggedInUser: User, user: User, baseUrl: string }>();
    const [isSubmitting, setIsSubmitting] = useState(false);

    const [formData, setFormData] = useState({
        employeeId: "",
        department: "",
        position: "",
        hireDate: "",
        phoneNumber: "",
        extension: "",
        supervisorId: loggedInUser?.sub || "",
        accessLevel: "basic"
    });

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setIsSubmitting(true);
        try {
            await axios.post(`${baseUrl}/support-staff`, {
                userId: user.sub,
                ...formData,
                employeeId: user.sub,
                hireDate: formData.hireDate || null,
                extension: formData.extension || null,
                supervisorId: formData.supervisorId || null,
                active: true,
            });

            await userApi.updateUserStatus(user.sub, "complete");
            toast.success("Profile updated successfully!");
            window.location.href = "/support";
        } catch {
            toast.error("Failed to save profile. Please try again.");
        } finally {
            setIsSubmitting(false);
        }
    };

    const handleInputChange = (name: string, value: string) => {
        setFormData(prev => ({
            ...prev,
            [name]: value
        }));
    };

    const departments = [
        { value: "Support", label: "Customer Support" },
        { value: "Technical", label: "Technical Support" },
        { value: "Billing", label: "Billing & Finance" },
        { value: "HR", label: "Human Resources" },
        { value: "IT", label: "Information Technology" },
        { value: "Operations", label: "Operations" },
        { value: "Management", label: "Management" }
    ];

    const positions = [
        { value: "Support Agent", label: "Support Agent" },
        { value: "Senior Support Agent", label: "Senior Support Agent" },
        { value: "Team Lead", label: "Team Lead" },
        { value: "Supervisor", label: "Supervisor" },
        { value: "Manager", label: "Manager" },
        { value: "Senior Manager", label: "Senior Manager" },
        { value: "Director", label: "Director" },
        { value: "Specialist", label: "Specialist" },
        { value: "Analyst", label: "Analyst" }
    ];

    const accessLevels = [
        { value: "basic", label: "Basic Access" },
        { value: "advanced", label: "Advanced Access" },
        { value: "admin", label: "Administrator" }
    ];

    return (
        <div className="min-h-screen py-12 px-4 sm:px-6 lg:px-8">
            <div className="max-w-2xl mx-auto">
                <div className="shadow rounded-lg p-8">
                    <div className="mb-8 text-center">
                        <h1 className="text-3xl font-bold opacity-90">Complete Your Support Profile</h1>
                        <p className="mt-2 opacity-60">
                            Please provide your employment details to complete your support staff profile.
                        </p>
                    </div>

                    <form onSubmit={handleSubmit} className="space-y-6">
                        <div className="grid grid-cols-1 gap-6 sm:grid-cols-2">

                            <Select
                                label="Department"
                                name="department"
                                required
                                value={formData.department}
                                onChange={(e) => handleInputChange("department", e.target.value)}
                                options={departments}
                            />

                            <Select
                                label="Position"
                                name="position"
                                required
                                value={formData.position}
                                onChange={(e) => handleInputChange("position", e.target.value)}
                                options={positions}
                            />

                            <Input
                                label="Hire Date"
                                name="hireDate"
                                type="date"
                                value={formData.hireDate}
                                onChange={(e) => handleInputChange("hireDate", e.target.value)}
                            />

                            <Input
                                label="Phone Number"
                                name="phoneNumber"
                                type="tel"
                                required
                                value={formData.phoneNumber}
                                onChange={(e) => handleInputChange("phoneNumber", e.target.value)}
                                placeholder="Your direct work phone number"
                            />

                            <Input
                                label="Extension (Optional)"
                                name="extension"
                                type="text"
                                value={formData.extension}
                                onChange={(e) => handleInputChange("extension", e.target.value)}
                                placeholder="Phone extension"
                            />

                            <Input
                                label="Supervisor ID (Optional)"
                                name="supervisorId"
                                type="text"
                                value={formData.supervisorId}
                                onChange={(e) => handleInputChange("supervisorId", e.target.value)}
                                placeholder="Your supervisor's employee ID"
                            />

                            <Select
                                label="Access Level"
                                name="accessLevel"
                                required
                                value={formData.accessLevel}
                                onChange={(e) => handleInputChange("accessLevel", e.target.value)}
                                options={accessLevels}
                            />
                        </div>

                        <div className="pt-6">
                            <Button
                                wide
                                type="submit"
                                isLoading={isSubmitting}
                                disabled={isSubmitting}
                            >
                                Complete Profile
                            </Button>
                        </div>
                    </form>
                </div>
            </div>
        </div>
    );
}
