import axios from "axios";
import React from "react";
import { Form, useNavigate } from "react-router";
import Button from "./common/Button";
import { Input } from "./common/Input";


export const UserLogin: React.FC = () => {

  const [isLoading, setIsLoading] = React.useState(false);
  const [error, setError] = React.useState<string | null>(null);
  const navigate = useNavigate();
  const handleSubmit = async (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    setIsLoading(true);
    setError(null);

    const formData = new FormData(event.currentTarget);
    // const email = formData.get("email") as string;
    // const password = formData.get("password") as string;
    // const accountType = formData.get("account_type") as string;

    try {
      await axios.post("/login", formData);
      navigate("/");
    } catch (error) {
      console.error("Login error:", error);
      setError("Invalid email or password");
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <Form className="p-6  rounded shadow space-y-4" onSubmit={handleSubmit}>
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
            <a href={'/signup'} className="text-blue-600 hover:underline">Don&apos;t have an account? Sign up</a>
          </div>
        </>
      </fieldset>
    </Form>
  );
};
