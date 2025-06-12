import { signupAction } from "~/common-actions/signup";
import { UserSignUp } from "../components/UserSignUp";

export const action = signupAction("patient");

export default function UserSignUpPage() {
  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-50 p-8">
      <UserSignUp error={""} type={"patient"} />
    </div>
  );
}
