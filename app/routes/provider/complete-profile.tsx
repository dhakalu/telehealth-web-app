import { ActionFunctionArgs, Form, LoaderFunction, redirect } from "react-router";

import axios, { AxiosError } from "axios";
import { API_BASE_URL } from "~/api";
import { requireAuthCookie } from "~/auth";
import { Input } from "~/components/common/Input";
import { Select } from "~/components/common/Select";
import { usePageTitle } from "~/hooks";


export type User = {
    sub: string;
    name?: string;
    given_name?: string;
    family_name?: string;
    middle_name?: string;
    nickname?: string;
    preferred_username?: string;
    profile?: string;
    picture?: string;
    website?: string;
    email?: string;
    email_verified?: boolean;
    gender?: string;
    birthdate?: string;
    zoneinfo?: string;
    locale?: string;
    phone_number?: string;
    phone_number_verified?: boolean;
    address?: string;
    updated_at?: number;
    account_type?: string;
    status?: string;
}

export const loader: LoaderFunction = async ({ request }) => {
    const user = await requireAuthCookie(request);
    return user;
}

export const action = async ({ request }: ActionFunctionArgs) => {
    const formData = await request.formData();
    const user = await requireAuthCookie(request);
    if (user.status === "complete") {
        return redirect(`/provider`, {});
    }
    const practitionerData = {
        resourceType: "Practitioner",
        identifier: [{
            system: "http://example.com/practitioner-id",
            value: user.sub,
        }],
        active: true,
        qualification: [{
            identifier: [{
                system: "http://example.com/qualification-id",
                value: formData.get("qualification") as string,
            }],
            code: {
                text: formData.get("specialty") as string,
            },
            period: {
                start: formData.get("issued_on"),
                end: formData.get("expires_on") || null
            },
            issuer: {
                reference: formData.get("issued_by") as string
            }
        }],
        gender: formData.get("gender") as string,
        birthDate: formData.get("birthdate") as string,
        address: [{
            line: [formData.get("street") as string],
            city: formData.get("city") as string,
            state: formData.get("state") as string,
            postalCode: formData.get("postalCode") as string,
            country: formData.get("country") as string,
        }],
        telecom: [
            {
                system: "phone",
                value: formData.get("phone_number"),
                use: "work",
            },
            {
                system: "email",
                value: user.email || "",
                use: "work",
            },
        ],
    }

    try {
        await axios.post(`${API_BASE_URL}/practitioner`, practitionerData)
        return redirect(`/provider`, {})
    } catch (error) {
        console.error("Error saving practitioner data:", error);
        return Response.json({ error: "Failed to save practitioner data" }, { status: (error as AxiosError).response?.status || 500 });
    }

}

export default function CompleteProfilePage() {
    usePageTitle("Complete Profile - Provider - MedTok");

    return (
        <div className="min-h-screen flex items-center justify-center  p-8">
            <div className=" p-6 rounded-lg shadow-md w-full max-w-md">
                <h1 className="text-2xl font-bold mb-4">Complete Your Profile</h1>
                <p className="text-gray-600 mb-6">Please fill out the following information to complete your profile.</p>
                <Form method="post" className="space-y-4">
                    <Input
                        name="birthdate"
                        type="date"
                        label="Date of Birth"
                        required
                    />

                    <Select
                        name="gender"
                        label="Gender"
                        options={[
                            { value: "male", label: "Male" },
                            { value: "female", label: "Female" }
                        ]}
                        required
                    />

                    <Input
                        name="phone_number"
                        placeholder="Phone Number"
                        label="Phone Number"
                        type="text"
                        required
                    />

                    <h3 className="text-lg font-semibold mt-6 mb-4">Qualifications</h3>
                    <Input
                        name="qualification"
                        placeholder="E.g. MD, MBBS"
                        label="Qualification"
                        required
                    />

                    <Input
                        name="specialty"
                        placeholder="E.g. Dermatology"
                        label="Specialty"
                        required
                    />

                    <Input
                        name="issued_on"
                        type="date"
                        label="Issued On"
                        required
                    />

                    <Input
                        name="issued_by"
                        placeholder="Issuing Authority or Organization"
                        label="Issued By"
                        required
                    />
                    <Input
                        name="street"
                        label="Street"
                        placeholder="123 Main St, Apt 4B"
                    />

                    <Input
                        name="city"
                        label="City"
                        placeholder="Anytown"
                    />

                    <Input
                        name="state"
                        label="State"
                        placeholder="CA"
                    />

                    <Input
                        name="postalCode"
                        label="Postal Code"
                        placeholder="12345"
                    />

                    <Input
                        name="country"
                        label="Country"
                        placeholder="United States"
                    />

                    <button type="submit" className="btn btn-primary w-full mt-4">Save Profile</button>
                </Form>
            </div>
        </div>
    )
}