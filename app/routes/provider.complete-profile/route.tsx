import { ActionFunctionArgs, LoaderFunction } from "@remix-run/node";
import { Form, redirect, useLoaderData } from "@remix-run/react"
import axios, { Axios, AxiosError } from "axios";
import { getAppPath, requireAuthCookie } from "~/auth";


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

export const  loader: LoaderFunction = async ({request}) => {
    const user =  await requireAuthCookie(request);
    return user;
}

export const action = async ({request}: ActionFunctionArgs) => {
    const formData = await request.formData();
    const user = await requireAuthCookie(request);
    const practitionerData = {
        resourceType: "Practitioner",
        identifier: [{
            system: "http://example.com/practitioner-id",
            value: user.sub,
        }],
        active: true,
        name: [{
            use: "official",
            given: [user.given_name || ""],
            family: user.family_name || "",
        }],
        qualification: [{
            identifier: [{
                system: "http://example.com/qualification-id",
                value: formData.get("qualification") as string,
            }],
            code: {
                text: formData.get("specialty") as string,
            },
        }],
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
                value: user.phone_number || "",
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
        await axios.post("http://localhost:8090/practitioner", practitionerData)
        await axios.patch(`http://localhost:8090/user/${user.sub}/status`, {
            status: "complete",
        });
        const appPath = getAppPath(request);
        return redirect(`/${appPath}`, {})
    } catch (error) {
        console.error("Error saving practitioner data:", error);
        return Response.json({ error: "Failed to save practitioner data" }, { status: (error as AxiosError).response?.status || 500 });
    }

    return { success: true, user };
}

export default function CompleteProfilePage() {

    const user = useLoaderData<User>();


    return (
        <div className="min-h-screen flex items-center justify-center bg-gray-50 p-8">
            <div className="bg-white p-6 rounded-lg shadow-md w-full max-w-md">
                <h1 className="text-2xl font-bold mb-4">Complete Your Profile</h1>
                <p className="text-gray-600 mb-6">Please fill out the following information to complete your profile.</p>
                <Form method="post" className="space-y-4">
                    <div className="flex flex-col">
                        <label className="mb-1 text-sm font-medium">Practitioner ID <span className="text-red-600">*</span></label>
                        <input disabled name="id" className="input" required defaultValue={user?.sub} />
                    </div>
                    <div className="flex flex-col">
                        <label className="mb-1 text-sm font-medium" defaultValue={user?.name}>Full Name <span className="text-red-600">*</span></label>
                        <input name="name" className="input" required />
                    </div>
                    <div className="flex flex-col">
                        <label className="mb-1 text-sm font-medium">Qualification <span className="text-red-600">*</span></label>
                        <input name="qualification" className="input" required />
                    </div>
                    <div className="flex flex-col">
                        <label className="mb-1 text-sm font-medium">Specialty <span className="text-red-600">*</span></label>
                        <input name="specialty" className="input" required />
                    </div>
                    <div className="flex flex-col">
                        <label className="mb-1 text-sm font-medium">Street</label>
                        <input name="street" className="input" />
                    </div>
                    <div className="flex flex-col">
                        <label className="mb-1 text-sm font-medium">City</label>
                        <input name="city" className="input" />
                    </div>
                    <div className="flex flex-col">
                        <label className="mb-1 text-sm font-medium">State</label>
                        <input name="state" className="input" />
                    </div>
                    <div className="flex flex-col">
                        <label className="mb-1 text-sm font-medium">Postal Code</label>
                        <input name="postalCode" className="input" />
                    </div>
                    <div className="flex flex-col">
                        <label className="mb-1 text-sm font-medium">Country</label>
                        <input name="country" className="input" />
                    </div>
                    <div className="flex flex-col">
                        <label className="mb-1 text-sm font-medium">Active</label>
                        <select name="active" className="input">
                            <option value="true">Active</option>
                            <option value="false">Inactive</option>
                        </select>
                    </div>
                    <button type="submit" className="btn btn-primary w-full mt-4">Save Profile</button>
                </Form>
            </div>
        </div>
    )
}