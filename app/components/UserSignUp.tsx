import { Form } from "react-router";
import React from "react";

type UserSignUpProps = {
  type?: "patient" | "practitioner";
  error: string | null;
};

export const UserSignUp: React.FC<UserSignUpProps> = ({ type, error }) => {

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
          <label className="mb-1 text-sm font-medium">
            Email <span className="text-red-600">*</span>
          </label>
          <input name="email"  placeholder="Email" className="input" type="email" required />
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
          <a href="/login" className="text-blue-600 hover:underline">
          Already have an account? Login
        </a>
        </div>
      {error && <div className="text-red-500">{error}</div>}
    </Form>
  );
};
