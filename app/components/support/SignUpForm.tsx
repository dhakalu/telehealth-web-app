import React, { useState } from "react";
import { userApi } from "~/api/users";
import Button from "../common/Button";

interface SignUpFormProps {
    onSuccess?: () => void;
    onError?: (error: string) => void;
}

export const SignUpForm: React.FC<SignUpFormProps> = ({ onSuccess, onError }) => {
    const [isSubmitting, setIsSubmitting] = useState(false);
    const [form, setForm] = useState({
        account_type: "patient",
        given_name: "",
        family_name: "",
        middle_name: "",
        email: "",
        password: ""
    });

    const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
        const { name, value } = e.target;
        setForm(prev => ({
            ...prev,
            [name]: value
        }));
    };

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setIsSubmitting(true);

        try {
            const user = await userApi.createUser({ ...form, status: "incomplete" });

            if (user?.sub) {
                onSuccess?.();
            } else {
                onError?.("Failed to create user. Please try again.");
            }
        } catch (error) {
            console.error("Sign up error:", error);
            const errorMessage = error instanceof Error ? error.message : "An error occurred during sign up. Please try again.";
            onError?.(errorMessage);
        } finally {
            setIsSubmitting(false);
        }
    };

    return (
        <form onSubmit={handleSubmit} className="space-y-4">
            <div className="text-sm mb-2 opacity-80">* indicates required fields</div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {/* Required: User Type */}
                <div className="flex flex-col">
                    <label className="mb-1 text-sm font-medium">
                        User Type <span className="text-red-600">*</span>
                    </label>
                    <select
                        value={form.account_type}
                        name="account_type"
                        className="input"
                        required
                        onChange={handleChange}
                    >
                        <option value="patient">Patient</option>
                        <option value="practitioner">Practitioner</option>
                        <option value="pharmacist">Pharmacist</option>
                        <option value="support">Support Staff</option>
                    </select>
                </div>

                {/* Required: Given Name */}
                <div className="flex flex-col">
                    <label className="mb-1 text-sm font-medium">
                        First Name <span className="text-red-600">*</span>
                    </label>
                    <input
                        name="given_name"
                        placeholder="First Name"
                        className="input"
                        value={form.given_name}
                        required
                        onChange={handleChange}
                    />
                </div>

                {/* Required: Family Name */}
                <div className="flex flex-col">
                    <label className="mb-1 text-sm font-medium">
                        Last Name <span className="text-red-600">*</span>
                    </label>
                    <input
                        name="family_name"
                        placeholder="Last Name"
                        className="input"
                        value={form.family_name}
                        required
                        onChange={handleChange}
                    />
                </div>

                {/* Optional: Middle Name */}
                <div className="flex flex-col">
                    <label className="mb-1 text-sm font-medium">Middle Name</label>
                    <input
                        name="middle_name"
                        placeholder="Middle Name"
                        className="input"
                        value={form.middle_name}
                        onChange={handleChange}
                    />
                </div>

                {/* Required: Email */}
                <div className="flex flex-col md:col-span-2">
                    <label className="mb-1 text-sm font-medium">
                        Email <span className="text-red-600">*</span>
                    </label>
                    <input
                        name="email"
                        placeholder="Email"
                        className="input"
                        type="email"
                        value={form.email}
                        required
                        onChange={handleChange}
                    />
                </div>

                {/* Required: Password */}
                <div className="flex flex-col md:col-span-2">
                    <label className="mb-1 text-sm font-medium">
                        Password <span className="text-red-600">*</span>
                    </label>
                    <input
                        name="password"
                        placeholder="Password"
                        className="input"
                        type="password"
                        value={form.password}
                        required
                        onChange={handleChange}
                    />
                </div>
            </div>

            <div className="flex justify-end space-x-3 pt-4">
                <Button
                    type="submit"
                    isLoading={isSubmitting}
                    disabled={isSubmitting}
                    className="btn-primary"
                >
                    Create User
                </Button>
            </div>
        </form>
    );
};
