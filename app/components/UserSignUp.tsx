import React from "react";
import { Form } from "react-router";
import Button from "./common/Button";

type UserSignUpProps = {
  error: string | null;
  isSubmitting: boolean;
};

export const UserSignUp: React.FC<UserSignUpProps> = ({ error, isSubmitting }) => {

  return (
    <Form className="max-w-xl mx-auto p-6  rounded shadow space-y-4" method="post">
      <h2 className="text-2xl font-bold mb-4">Sign Up</h2>
      <div className="text-sm mb-2 opacity-80">* indicates required fields</div>
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {/* Required: User Type */}
        <div className="flex flex-col">
          <label className="mb-1 text-sm font-medium">
            User Type <span className="text-red-600">*</span>
          </label>
          <select name="account_type" className="input" required>
            <option value="patient" disabled selected>Select User Type</option>
            <option value="practitioner">Practitioner</option>
            <option value="patient">Patient</option>
          </select>
        </div>
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
          <input name="email" placeholder="Email" className="input" type="email" required />
        </div>
        <div className="flex flex-col">
          <label className="mb-1 text-sm font-medium">
            Password <span className="text-red-600">*</span>
          </label>
          <input name="password" placeholder="Password" className="input" type="password" required />
        </div>
      </div>
      {error && <div className="text-red-500">{error}</div>}

      <div className="flex center mt-4">
        {
          isSubmitting ? (<div>Loading...</div>) : (<Button type="submit" className="btn btn-primary px-4 py-2 rounded bg-blue-600 text-white hover:bg-blue-700">
            Sign Up
          </Button>)
        }
      </div>
      <div>
        <a href="/login" className="text-blue-600 hover:underline">
          Already have an account? Login
        </a>
      </div>
    </Form >
  );
};
