import React from "react";
import { Form } from "react-router";
import Button from "./common/Button";
import { Input } from "./common/Input";


export const UserLogin: React.FC<{ error?: string; signupUrl?: string, isLoading: boolean }> = ({ error, signupUrl, isLoading = false }) => {
  return (
    <Form className="max-w-md mx-auto p-6  rounded shadow space-y-4" method="post">
      <fieldset className="fieldset">
        <Input label="Email" name="email" placeholder="Email" type="email" required />
        <Input label="Password" name="password" placeholder="Password" type="password" required />
        {error && (
          <div className="text-error-content bg-error border border-error rounded p-2 text-center">
            {error}
          </div>
        )}
        <>
          <Button isLoading={isLoading} className="btn btn-primary mt-4" type="submit">
            Login
          </Button>
          <div className="text-center mt-4">
            <a href={signupUrl} className="text-blue-600 hover:underline">Don&apos;t have an account? Sign up</a>
          </div>
        </>
      </fieldset>
    </Form>
  );
};
