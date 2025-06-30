import { ActionFunctionArgs, Form, LoaderFunction, redirect } from "react-router";

import axios, { AxiosError } from "axios";
import { API_BASE_URL } from "~/api";
import { userApi } from "~/api/users";
import { requireAuthCookie } from "~/auth";
import Button from "~/components/common/Button";
import { Input } from "~/components/common/Input";
import { Select } from "~/components/common/Select";
import { usePageTitle } from "~/hooks";



export const loader: LoaderFunction = async ({ request }) => {
    const user = await requireAuthCookie(request);
    return user;
}

export const action = async ({ request }: ActionFunctionArgs) => {
    const formData = await request.formData();
    const user = await requireAuthCookie(request);
    const practitionerData = {
        resourceType: "Patient",
        id: user.sub,
        active: true,
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
        await axios.post(`${API_BASE_URL}/patient`, practitionerData)
        await userApi.updateUserStatus(user.sub, "complete");
        return redirect(`/patient/find-doctors`, {})
    } catch (error) {
        console.error("Error saving practitioner data:", error);
        return Response.json({ error: "Failed to save practitioner data" }, { status: (error as AxiosError).response?.status || 500 });
    }
}

export default function CompleteProfilePage() {
    usePageTitle("Complete Profile");

    return (
        <div className="min-h-screen flex items-center justify-center  p-8">
            <div className=" p-6 rounded-lg shadow-md w-full max-w-md">
                <h1 className="text-2xl font-bold mb-4">Complete Your Profile</h1>
                <p className="opacity-60 mb-6">Please fill out the following information to complete your profile.</p>
                <Form method="post" className="space-y-4">
                    <Input
                        label="Date of Birth"
                        name="birthdate"
                        type="date"
                        required
                    />
                    <Select
                        label="Gender"
                        name="gender"
                        required
                        options={[
                            { value: "male", label: "Male" },
                            { value: "female", label: "Female" }
                        ]}
                    />
                    <Input
                        label="Phone Number"
                        name="phone_number"
                        placeholder="Phone Number"
                        type="text"
                        required
                    />


                    <Input
                        label="Street Address"
                        name="street"
                        placeholder="123 Main St, Apt 4B"
                    />

                    <Input
                        label="City"
                        name="city"
                        placeholder="Anytown"
                    />
                    <Input
                        label="State"
                        name="state"
                        placeholder="CA"
                    />
                    <Input
                        label="Postal Code"
                        name="postalCode"
                        placeholder="12345"
                    />
                    <Input
                        label="Country"
                        name="country"
                        placeholder="United States"
                    />
                    <Button type="submit" buttonType="primary" wide>
                        Save Profile
                    </Button>
                </Form>
            </div>
        </div>
    )
}