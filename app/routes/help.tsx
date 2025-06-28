import React, { useState } from "react";
import { LoaderFunctionArgs, useLoaderData } from "react-router";
import { authCookie } from "~/auth";
import AppHeader, { AppHeaderProps } from "~/components/common/AppHeader";
import { Input } from "~/components/common/Input";
import { TextArea } from "~/components/common/TextArea";
import { PatientAppHeader, PatientAppHeaderProps } from "~/components/patient/PatientAppHeader";
import { ProviderHeader, ProviderHeaderProps } from "~/components/provider/ProviderAppHeader";
import { usePageTitle } from "~/hooks";
import { User } from "./provider/complete-profile";

const faqs = [
    {
        question: "How do I schedule an appointment?",
        answer: "Login as a patient, click on 'Find Doctors' option in navigation bar. Then choose the doctor and click on 'Book' button.",
    },
    {
        question: "How do I reset my password?",
        answer: "Click on 'Forgot Password' at the login page and follow the instructions.",
    },

    {
        question: "Who do I contact for technical support?",
        answer: "You can use the contact form below to reach out to our admins.",
    },
];

export const loader = async ({ request }: LoaderFunctionArgs) => {
    const cookie = await authCookie.parse(request.headers.get("Cookie"));
    if (cookie) {
        const user = JSON.parse(cookie) as User;
        return { user }
    }
    return { user: null };
}

type AccountType = "default" | "patient" | "practitioner";

const headerMap: Record<AccountType, React.ComponentType<PatientAppHeaderProps | ProviderHeaderProps | AppHeaderProps>> = {
    default: AppHeader,
    patient: PatientAppHeader,
    practitioner: ProviderHeader
};

export default function HelpPage() {
    usePageTitle("Help & Support - MedTok");

    const { user } = useLoaderData<{ user: User }>();

    const [form, setForm] = useState({ name: "", email: "", message: "" });
    const [submitted, setSubmitted] = useState(false);

    const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
        setForm({ ...form, [e.target.name]: e.target.value });
    };

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        // Here you would send the form data to your backend or API
        setSubmitted(true);
    };
    const accountType: AccountType =
        user?.account_type === "patient" || user?.account_type === "practitioner"
            ? user.account_type
            : "default";
    const Header = headerMap[accountType];


    return (
        <div className="flex flex-col h-screen">
            <div className="h-50">
                <Header user={user} />
            </div>
            <div className="flex-1 overflow-y-auto">
                <div className="max-w-2xl mx-auto p-6">
                    <h1 className="text-3xl font-bold mb-6">Help & Support</h1>
                    <section>
                        <h2 className="text-2xl font-semibold mb-4">Frequently Asked Questions</h2>
                        <ul>
                            {faqs.map((faq, idx) => (
                                <li key={idx} className="mb-4">
                                    <strong>{faq.question}</strong>
                                    <div>{faq.answer}</div>
                                </li>
                            ))}
                        </ul>
                    </section>
                    <section className="mt-10">
                        <h2 className="text-xl font-semibold mb-2">Contact Admins</h2>
                        {submitted ? (
                            <div className="text-success">Thank you for contacting us! We will get back to you soon.</div>
                        ) : (
                            <form
                                onSubmit={handleSubmit}
                                className="flex flex-col gap-3 max-w-md"
                            >
                                <fieldset className="fieldset">
                                    <Input
                                        label="Name"
                                        type="text"
                                        name="name"
                                        placeholder="Your Name"
                                        value={form.name}
                                        onChange={handleChange}
                                        required
                                    />
                                    <Input
                                        label="Email"
                                        type="email"
                                        name="email"
                                        placeholder="Your Email"
                                        value={form.email}
                                        onChange={handleChange}
                                        required
                                    />
                                    <TextArea
                                        label="Message"
                                        name="message"
                                        placeholder="Your Message"
                                        value={form.message}
                                        onChange={handleChange}
                                        rows={4}
                                        textarea
                                        required
                                    />
                                    <button type="submit" className="btn btn-primary">Send Message</button>
                                </fieldset>
                            </form>
                        )}
                    </section>
                </div>
            </div>
        </div>
    );
}