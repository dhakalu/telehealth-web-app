import axios, { AxiosError } from "axios";
import React from "react";
import { Form, useNavigate } from "react-router";
import { useToast } from "~/hooks";
import { ApiError } from "~/routes/_auth.provider.signup";
import Button from "./common/Button";
import { Input } from "./common/Input";
import { Select } from "./common/Select";

export type AccountType = {
  value: string;
  label: string;
}

export type UserSignUpProps = {
  allowedAccountTypes: AccountType[];
  baseUrl?: string;
  buttonLabel?: string;
  title?: string; // Title for the form
  onSuccess?: () => void; // Optional callback for success
  showLoginLink?: boolean; // Optional prop to show login link
};

export const UserSignUp: React.FC<UserSignUpProps> = ({ allowedAccountTypes, title, showLoginLink = true, baseUrl, buttonLabel, onSuccess }) => {
  const [error, setError] = React.useState<string | null>(null);
  const [isSubmitting, setIsSubmitting] = React.useState(false);
  const navigate = useNavigate()
  const toast = useToast();

  const [form, setForm] = React.useState({
    account_type: "patient",
    given_name: "",
    family_name: "",
    middle_name: "",
    email: "",
    password: ""
  });

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    const { name, value } = e.target;
    setForm(prev => ({
      ...prev,
      [name]: value
    }));
    setError(null); // Clear error on change
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);
    const data = {
      ...form,
      status: "created"
    };

    try {
      const response = await axios.post(`${baseUrl}/user`, data);
      const user = response.data;
      const status = response.status;



      if (status !== 201 || !user || !user.sub) {
        return Response.json(
          {
            status,
          }
        );
      }
      toast.success("User created successfully! Please login to continue.");
      onSuccess?.();
      return navigate("/login");
    } catch (error) {
      const errorMessage = (((error as AxiosError).response?.data) as ApiError)?.error || "An error occurred. Please try again.";
      // toast.error(errorMessage);
      setError(errorMessage);
    } finally {
      setIsSubmitting(false);
    }
  }



  return (
    <Form onSubmit={handleSubmit} className="max-w-xl mx-auto rounded  space-y-4">
      {title && <h2 className="text-2xl font-bold mb-4">{title}</h2>}
      <div className="text-sm mb-2 opacity-80">* indicates required fields</div>
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {/* Required: User Type */}
        <div className="flex flex-col">
          <Select
            label="User Type"
            name="account_type"
            value={form.account_type}
            required
            onChange={handleChange}
            options={allowedAccountTypes}
          />
        </div>
        {/* Required: Given Name (firstName) */}
        <div className="flex flex-col">
          <Input
            label="First Name"
            name="given_name"
            placeholder="Given Name"
            value={form.given_name}
            required
            onChange={handleChange}
          />
        </div>
        {/* Required: Family Name (lastName) */}
        <div className="flex flex-col">
          <Input
            label="Last Name"
            name="family_name"
            placeholder="Family Name"
            value={form.family_name}
            required
            onChange={handleChange}
          />
        </div>
        <div className="flex flex-col">
          <Input
            label="Middle Name"
            name="middle_name"
            placeholder="Middle Name"
            value={form.middle_name}
            onChange={handleChange}
          />
        </div>
        <div className="flex flex-col">
          <Input
            label="Email"
            name="email"
            placeholder="Email"
            type="email"
            value={form.email}
            required
            onChange={handleChange}
          />
        </div>
        <div className="flex flex-col">
          <Input
            label="Password"
            name="password"
            placeholder="Password"
            type="password"
            value={form.password}
            required
            onChange={handleChange}
          />
        </div>
      </div>
      {error && !isSubmitting && <div className="text-red-500">{error}</div>}

      <div className="flex center mt-4">
        <Button type="submit" isLoading={isSubmitting} className="btn btn-primary px-4 py-2 rounded bg-blue-600 text-white hover:bg-blue-700">
          {buttonLabel || "Sign Up"}
        </Button>
      </div>
      {showLoginLink && (
        <div>
          <a href="/login" className="text-blue-600 hover:underline">
            Already have an account? Login
          </a>
        </div>
      )}
    </Form>
  );
};
