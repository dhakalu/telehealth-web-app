import React from "react";
import { Form } from "react-router";


export const UserLogin: React.FC<{ error?: string; signupUrl?: string, isLoading: boolean }> = ({ error, signupUrl, isLoading = false }) => {
  return (
    <Form className="max-w-md mx-auto p-6  rounded shadow space-y-4" method="post">
      <fieldset className="fieldset">
        <div className="flex flex-col mb-2">
          <label className="mb-1 text-sm font-medium">Email <span className="text-red-600">*</span></label>
          <input name="email" placeholder="Email" className="input" type="email" required />
        </div>
        <div className="flex flex-col mb-2">
          <label className="mb-1 text-sm font-medium">Password <span className="text-red-600">*</span></label>
          <input name="password" placeholder="Password" className="input" type="password" required />
        </div>
        {error && (
          <div className="mb-2 text-red-600 bg-red-100 border border-red-300 rounded p-2 text-center">
            {error}
          </div>
        )}

        {isLoading ? (
          <div className="flex justify-center items-center mt-4">
            <span className="loader mr-2" />
            <span>Loading...</span>
          </div>
        ) : (
          <>
            <button className="btn btn-primary mt-4" type="submit">
              Login
            </button>
            <div className="text-center mt-4">
              <a href={signupUrl} className="text-blue-600 hover:underline">Don&apos;t have an account? Sign up</a>
            </div>
          </>
        )}
      </fieldset>
    </Form>
  );
};
