import React, { useState } from "react";
import { LoaderFunction, redirect, useLoaderData, useNavigate, useParams } from "react-router";

import axios from "axios";
import { API_BASE_URL } from "~/api";
import { requireAuthCookie } from "~/auth";
import Button from "~/components/common/Button";
import { CheckboxGroup } from "~/components/common/CheckboxGroup";
import ErrorPage from "~/components/common/ErrorPage";
import { Input } from "~/components/common/Input";
import PageHeader from "~/components/common/PageHeader";
import { RadioGroup } from "~/components/common/RadioGroup";
import { usePageTitle, useToast } from "~/hooks";
import { User } from "../provider/complete-profile";

type Question = {
  question: string;
  type: "text" | "checkbox" | "radio";
  isMultiLine?: boolean;
  options?: string[];
  isRequired: boolean;
}

const screeningQuestions: Question[] = [
  {
    question: "What is the reason for your visit today?",
    type: "text",
    isMultiLine: true,
    isRequired: true,
  },
  {
    question: "Do you have any allergies?",
    type: "checkbox",
    options: ["Peanuts", "Shellfish", "Penicillin", "Latex", "None"],
    isRequired: false,
  },
  {
    question: "Have you experienced any of the following symptoms recently?",
    type: "checkbox",
    options: ["Fever", "Cough", "Shortness of breath", "Fatigue", "None"],
    isRequired: false,
  },
  {
    question: "Are you currently taking any medications?",
    type: "radio",
    options: ["Yes", "No"],
    isRequired: true,
  },
  {
    question: "Do you have a history of chronic conditions?",
    type: "checkbox",
    options: ["Diabetes", "Hypertension", "Asthma", "Heart Disease", "None"],
    isRequired: false,
  },
  {
    question: "Have you traveled internationally in the last 30 days?",
    type: "radio",
    options: ["Yes", "No"],
    isRequired: true,
  },
  // Smoking habits
  {
    question: "Do you currently smoke tobacco products?",
    type: "radio",
    options: ["Yes", "No", "Former smoker"],
    isRequired: true,
  },
  {
    question: "If yes or former smoker, how many years have you smoked?",
    type: "text",
    isRequired: false,
  },
  {
    question: "How many cigarettes (or equivalent) do you smoke per day?",
    type: "text",
    isRequired: false,
  },
  // Family history
  {
    question: "Does anyone in your family have a history of chronic diseases?",
    type: "checkbox",
    options: [
      "Diabetes",
      "Hypertension",
      "Cancer",
      "Heart Disease",
      "Stroke",
      "None"
    ],
    isRequired: false,
  },
  {
    question: "Please specify any other relevant family medical history.",
    type: "text",
    isRequired: false,
  },
];

// Loader for authentication
export const loader: LoaderFunction = async ({ request, params }) => {
  const user = await requireAuthCookie(request);
  const { providerId } = params;
  // make api call to /encounter/search?patientId={user.sub}&status=open
  try {
    const { data } = await axios.get(`${API_BASE_URL}/encounter/search`, {
      params: {
        patientId: user.sub,
        providerId,
        status: "open"
      }
    });
    if (data.length === 0) {
      // no active encounts found, they have to fill screening questions
      return { user, baseUrl: API_BASE_URL };
    } else {
      return redirect(`/patient/chat/${providerId}`);
    }
  } catch (error) {
    console.error("Error fetching encounters:", error);
    return { user, baseUrl: API_BASE_URL, error: "Failed to fetch encounters" };
  }

};

export default function ScreeningQuestionAnswers() {
  usePageTitle("Screening Questions");

  const { user, baseUrl, error } = useLoaderData() as { user: User, baseUrl: string, error?: string };
  const navigate = useNavigate();
  const params = useParams();

  const [current, setCurrent] = useState(0);
  const [answers, setAnswers] = useState<Record<string, string | string[]>>({});
  const [submitting, setSubmitting] = useState(false);
  const toast = useToast();
  const q = screeningQuestions[current];

  const handleTextChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    setAnswers({ ...answers, [q.question]: e.target.value });
  };

  const handleCheckboxChange = (value: string[]) => {
    setAnswers({ ...answers, [q.question]: value });
  };

  const handleRadioChange = (value: string) => {
    setAnswers({ ...answers, [q.question]: value });
  };

  const handleNext = () => {
    if (current < screeningQuestions.length - 1) setCurrent(current + 1);
  };
  const handlePrev = () => {
    if (current > 0) setCurrent(current - 1);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setSubmitting(true);

    try {
      const response = await axios.post(`${baseUrl}/qa`, {
        providerId: params.providerId,
        patientId: user.sub,
        answers: answers
      });
      const savedQA = response.data;
      toast.success("Screening questions submitted successfully!");
      navigate(`/patient/estimates/${params.providerId}/${savedQA.id}`);
    } catch (error) {
      console.error("Error submitting screening questions:", error);
      if (axios.isAxiosError(error)) {
        const errorMessage = error.response?.data?.message || error.message || "An error occurred";
        toast.error(errorMessage);
      } else {
        toast.error(error instanceof Error ? error.message : "An unknown error occurred");
      }
      setSubmitting(false);
    }
  };

  if (error) {
    toast.error(error);
    return <ErrorPage error={error} />;
  }

  return (
    <form className="max-w-2xl mx-auto p-6  rounded shadow space-y-6" onSubmit={handleSubmit}>
      <PageHeader title="Screening Questions" description="Almost there, before we connect with a doctor, please answer the following questions." />
      <div className="space-y-2">
        {q.type === "text" && (
          <Input
            label={q.question}
            type="text"
            name={`question-${current}`}
            required={q.isRequired}
            value={typeof answers[q.question] === 'string' ? answers[q.question] as string : ''}
            onChange={handleTextChange}
            textarea={q.isMultiLine}
          />
        )}
        {q.type === "checkbox" && q.options && (
          <CheckboxGroup
            label={q.question}
            name={`question-${current}`}
            options={q.options.map(opt => ({ value: opt, label: opt }))}
            value={Array.isArray(answers[q.question]) ? (answers[q.question] as string[]) : []}
            onChange={handleCheckboxChange}
            required={q.isRequired}
          />
        )}
        {q.type === "radio" && q.options && (
          <RadioGroup
            label={q.question}
            name={`question-${current}`}
            options={q.options.map(opt => ({ value: opt, label: opt }))}
            value={typeof answers[q.question] === 'string' ? answers[q.question] as string : ''}
            onChange={handleRadioChange}
            required={q.isRequired}
          />
        )}
      </div>
      <div className="flex gap-4 mt-6">
        <Button type="button" buttonType={"primary"} soft onClick={handlePrev} disabled={current === 0}>Previous</Button>
        {current < screeningQuestions.length - 1 ? (
          <Button type="button" buttonType={"primary"} soft onClick={handleNext}>Next</Button>
        ) : (
          <Button
            type="submit"
            buttonType="primary"
            disabled={submitting}
            isLoading={submitting}
          >
            {submitting ? "Submitting..." : "Submit"}
          </Button>
        )}
      </div>
    </form>
  );
}
