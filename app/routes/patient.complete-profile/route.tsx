import { ActionFunctionArgs, LoaderFunction } from "@remix-run/node";
import { Form, redirect } from "@remix-run/react"
import axios, { AxiosError } from "axios";
import { requireAuthCookie } from "~/auth";



export const  loader: LoaderFunction = async ({request}) => {
    const user =  await requireAuthCookie(request);
    return user;
}

export const action = async ({request}: ActionFunctionArgs) => {
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
        await axios.post("http://localhost:8090/patient", practitionerData)
        await axios.patch(`http://localhost:8090/user/${user.sub}/status`, {
            status: "complete",
        });
        return redirect(`/patient`, {})
    } catch (error) {
        console.error("Error saving practitioner data:", error);
        return Response.json({ error: "Failed to save practitioner data" }, { status: (error as AxiosError).response?.status || 500 });
    }

}

export default function CompleteProfilePage() {
    return (
        <div className="min-h-screen flex items-center justify-center bg-gray-50 p-8">
            <div className="bg-white p-6 rounded-lg shadow-md w-full max-w-md">
                <h1 className="text-2xl font-bold mb-4">Complete Your Profile</h1>
                <p className="text-gray-600 mb-6">Please fill out the following information to complete your profile.</p>
                <Form method="post" className="space-y-4">
                    <div className="flex flex-col">
                    <label className="mb-1 text-sm font-medium">
                        Date of Birth <span className="text-red-600">*</span>
                    </label>
                    <input name="birthdate" type="date" className="input" required />
                    </div>
                    <div className="flex flex-col">
                    <label className="mb-1 text-sm font-medium">
                        Gender <span className="text-red-600">*</span>
                    </label>
                    <select name="gender" className="input" required>
                        <option value="male">Male</option>
                        <option value="female">Female</option>
                    </select>
                    </div>
                    <div className="flex flex-col">
                    <label className="mb-1 text-sm font-medium">
                        Phone Number <span className="text-red-600">*</span>
                    </label>
                        <input name="phone_number"  placeholder="Phone Number" className="input" type="text" required />
                    </div>

                    <h3>Address</h3>

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
                    <button type="submit" className="btn btn-primary w-full mt-4">Save Profile</button>
                </Form>
            </div>
        </div>
    )
}