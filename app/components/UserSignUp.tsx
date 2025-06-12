import { Form } from "@remix-run/react";
import React, { useState } from "react";
import { useNavigate } from "react-router-dom";

const baseURL = "http://localhost:8090";

type UserSignUpProps = {
  type?: "patient" | "provider";
  error: string | null;
};

export const UserSignUp: React.FC<UserSignUpProps> = ({ type, error }) => {
  // const navigate = useNavigate();
  // const [form, setForm] = useState({
  //   sub: "",
  //   name: "",
  //   given_name: "",
  //   family_name: "",
  //   middle_name: "",
  //   nickname: "",
  //   preferred_username: "",
  //   profile: "",
  //   picture: "",
  //   website: "",
  //   email: "",
  //   email_verified: false,
  //   gender: "",
  //   birthdate: "",
  //   zoneinfo: "",
  //   locale: "",
  //   phone_number: "",
  //   phone_number_verified: false,
  //   address: "",
  //   updated_at: "",
  //   password: ""
  // });
  // const [loading, setLoading] = useState(false);
  // const [error, setError] = useState<string | null>(null);
  // const [success, setSuccess] = useState(false);

  // const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
  //   const { name, value, type, checked } = e.target;
  //   setForm((prev) => ({
  //     ...prev,
  //     [name]: type === "checkbox" ? checked : value,
  //   }));
  // };

  // const handleSubmit = async (e: React.FormEvent) => {
  //   e.preventDefault();
  //   setLoading(true);
  //   setError(null);
  //   setSuccess(false);
  //   try {
  //     const res = await fetch(`${baseURL}/user`, {
  //       method: "POST",
  //       headers: { "Content-Type": "application/json" },
  //       body: JSON.stringify({
  //         sub: form.sub,
  //         name: form.name,
  //         given_name: form.given_name,
  //         family_name: form.family_name,
  //         middle_name: form.middle_name,
  //         nickname: form.nickname,
  //         preferred_username: form.preferred_username,
  //         profile: form.profile,
  //         picture: form.picture,
  //         website: form.website,
  //         email: form.email,
  //         email_verified: form.email_verified,
  //         gender: form.gender,
  //         birthdate: form.birthdate,
  //         zoneinfo: form.zoneinfo,
  //         locale: form.locale,
  //         phone_number: form.phone_number,
  //         phone_number_verified: form.phone_number_verified,
  //         address: form.address,
  //         updated_at: form.updated_at ? Number(form.updated_at) : undefined,
  //         password: form.password
  //       }),
  //     });
  //     if (!res.ok) {
  //       const err = await res.json();
  //       throw new Error(err.error || "Failed to sign up");
  //     }
  //     setSuccess(true);
  //     setForm({
  //       sub: "",
  //       name: "",
  //       given_name: "",
  //       family_name: "",
  //       middle_name: "",
  //       nickname: "",
  //       preferred_username: "",
  //       profile: "",
  //       picture: "",
  //       website: "",
  //       email: "",
  //       email_verified: false,
  //       gender: "",
  //       birthdate: "",
  //       zoneinfo: "",
  //       locale: "",
  //       phone_number: "",
  //       phone_number_verified: false,
  //       address: "",
  //       updated_at: "",
  //       password: ""
  //     });
  //     // Redirect to login page after successful signup
  //     setTimeout(() => navigate("/user-login"), 1000);
  //   } catch (err: any) {
  //     setError(err.message);
  //   } finally {
  //     setLoading(false);
  //   }
  // };

  return (
    <Form className="max-w-xl mx-auto p-6 bg-white rounded shadow space-y-4" method="post">
      <h2 className="text-2xl font-bold mb-4">{type == "patient" ? "Patient": "Provider"} Sign Up</h2>
      <div className="text-sm text-gray-500 mb-2">* indicates required fields</div>
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {/* Required: Given Name (firstName) */}
        <div className="flex flex-col">
          <label className="mb-1 text-sm font-medium">
            First Name <span className="text-red-600">*</span>
          </label>
          <input name="given_name" placeholder="Given Name" className="input" required />
        </div>
        {/* Required: Family Name (lastName) */}
        <div className="flex flex-col">
          <label className="mb-1 text-sm font-medium">
            Last Name <span className="text-red-600">*</span>
          </label>
          <input name="family_name" placeholder="Family Name" className="input" required />
        </div>
        <div className="flex flex-col">
          <label className="mb-1 text-sm font-medium">Middle Name</label>
          <input name="middle_name" placeholder="Middle Name" className="input" />
        </div>
         <div className="flex flex-col">
          <label className="mb-1 text-sm font-medium">Full Name (Including suffix and prefix)</label>
          <input name="name" placeholder="Full Name" className="input" />
        </div>
        <div className="flex flex-col">
          <label className="mb-1 text-sm font-medium">Nickname</label>
          <input name="nickname" placeholder="Nickname" className="input" />
        </div>
        {/* Email (required) */}
        <div className="flex flex-col">
          <label className="mb-1 text-sm font-medium">
            Email <span className="text-red-600">*</span>
          </label>
          <input name="email"  placeholder="Email" className="input" type="email" required />
        </div>
        {/* Birthdate (required) */}
        <div className="flex flex-col">
          <label className="mb-1 text-sm font-medium">
            Birthdate <span className="text-red-600">*</span>
          </label>
          <input name="birthdate"  placeholder="Birthdate" className="input" required />
        </div>
        {/* Gender (required) */}
        <div className="flex flex-col">
          <label className="mb-1 text-sm font-medium">
            Gender <span className="text-red-600">*</span>
          </label>
          <input name="gender"  placeholder="Gender" className="input" required />
        </div>
        {/* Phone Number (required) */}
        <div className="flex flex-col">
          <label className="mb-1 text-sm font-medium">
            Phone Number <span className="text-red-600">*</span>
          </label>
          <input name="phone_number"  placeholder="Phone Number" className="input" required />
        </div>
        {/* Optional fields below, all with labels */}
        <div className="flex flex-col">
          <label className="mb-1 text-sm font-medium">Preferred Username</label>
          <input name="preferred_username"  placeholder="Preferred Username" className="input" />
        </div>
        <div className="flex flex-col">
          <label className="mb-1 text-sm font-medium">Profile URL</label>
          <input name="profile" placeholder="Profile URL" className="input" />
        </div>
        <div className="flex flex-col">
          <label className="mb-1 text-sm font-medium">Picture URL</label>
          <input name="picture" placeholder="Picture URL" className="input" />
        </div>
        <div className="flex flex-col">
          <label className="mb-1 text-sm font-medium">Website</label>
          <input name="website" placeholder="Website" className="input" />
        </div>
        <div className="flex flex-col">
          <label className="mb-1 text-sm font-medium">Time Zone</label>
          <input name="zoneinfo" placeholder="Time Zone" className="input" />
        </div>
        <div className="flex flex-col">
          <label className="mb-1 text-sm font-medium">Locale</label>
          <input name="locale"  placeholder="Locale" className="input" />
        </div>
        <div className="flex flex-col">
          <label className="mb-1 text-sm font-medium">
            Password <span className="text-red-600">*</span>
          </label>
          <input name="password"  placeholder="Password" className="input" type="password" required />
        </div>
      </div>
        <div className="flex center mt-4">
        <button type="submit" className="btn btn-primary px-4 py-2 rounded bg-blue-600 text-white hover:bg-blue-700">
          Sign Up
        </button>
        </div>
        <div>
          <a href="/user-login" className="text-blue-600 hover:underline">
          Already have an account? Login
        </a>
        </div>
      {error && <div className="text-red-500">{error}</div>}
    </Form>
  );
};
