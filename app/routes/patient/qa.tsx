import React, { useState } from "react";
import { ActionFunctionArgs, Form, redirect } from "react-router";

import axios from "axios";
import { API_BASE_URL } from "~/api";
import { requireAuthCookie } from "~/auth";
import Button from "~/components/common/Button";
import { Input } from "~/components/common/Input";
import PageHeader from "~/components/common/PageHeader";

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

export const action = async ({ request, params }: ActionFunctionArgs) => {
  const user = await requireAuthCookie(request);
  const formData = await request.formData();
  const answers: Record<string, string | string[]> = {};

  screeningQuestions.forEach((q, idx) => {
    const answerKey = `question-${idx}`;
    const answerValue = formData.getAll(answerKey);
    if (answerValue.length > 0) {
      answers[q.question] = String(answerValue);
    }
  });

  try {
    const response = await axios.post(`${API_BASE_URL}/qa`, {
      providerId: params.providerId,
      patientId: user.sub,
      answers: answers
    });
    const savedQA = response.data;
    return redirect(`/patient/estimates/${params.providerId}/${savedQA.id}`)
  } catch (error) {
    if (axios.isAxiosError(error)) {
      return Response.json(
        { error: error.response?.data?.message || error.message || "An error occurred" },
        { status: error.response?.status || 500 }
      );
    }
    return Response.json(
      { error: error instanceof Error ? error.message : "An unknown error occurred" },
      { status: 500 }
    );
  }
}

export default function ScreeningQuestionAnswers() {

  const [current, setCurrent] = useState(0);
  const [answers, setAnswers] = useState<Record<string, string | string[]>>({});
  const [submitting, setSubmitting] = useState(false);
  const q = screeningQuestions[current];

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
    if (q.type === "checkbox") {
      const prev = Array.isArray(answers[q.question]) ? (answers[q.question] as string[]) : [];
      if (
        e.target instanceof HTMLInputElement &&
        e.target.type === "checkbox"
      ) {
        if (e.target.checked) {
          setAnswers({ ...answers, [q.question]: [...prev, e.target.value] });
        } else {
          setAnswers({ ...answers, [q.question]: prev.filter(v => v !== e.target.value) });
        }
      }
    } else {
      setAnswers({ ...answers, [q.question]: e.target.value });
    }
  };

  const handleNext = () => {
    if (current < screeningQuestions.length - 1) setCurrent(current + 1);
  };
  const handlePrev = () => {
    if (current > 0) setCurrent(current - 1);
  };

  const handleSubmit = async () => {
    setSubmitting(true);
    // let the form submit as normal, answers will be picked up by the action
  };

  return (
    <Form method="post" className="max-w-2xl mx-auto p-6  rounded shadow space-y-6" onSubmit={handleSubmit}>
      <PageHeader title="Screening Questions" description="Almost there, before we connect with a doctor, please answer the following questions." />
      <div className="space-y-2">
        {q.type === "text" && (
          <Input
            label={q.question}
            type="text"
            name={`question-${current}`}
            required={q.isRequired}
            value={typeof answers[q.question] === 'string' ? answers[q.question] as string : ''}
            onChange={handleChange}
            textarea={q.isMultiLine}
          />
        )}
        {q.type === "checkbox" && q.options && (
          <div className="flex flex-wrap gap-4">
            {q.options.map((opt, oidx) => (
              <label key={oidx} className="flex items-center gap-2">
                <input
                  type="checkbox"
                  className="checkbox"
                  name={`question-${current}`}
                  value={opt}
                  checked={Array.isArray(answers[q.question]) && (answers[q.question] as string[]).includes(opt)}
                  onChange={handleChange}
                />
                {opt}
              </label>
            ))}
          </div>
        )}
        {q.type === "radio" && q.options && (
          <div className="flex flex-wrap gap-4">
            {q.options.map((opt, oidx) => (
              <label key={oidx} className="flex items-center gap-2">
                <input
                  type="radio"
                  className="radio"
                  name={`question-${current}`}
                  value={opt}
                  checked={answers[q.question] === opt}
                  required={q.isRequired}
                  onChange={handleChange}
                />
                {opt}
              </label>
            ))}
          </div>
        )}
      </div>
      <div className="flex gap-4 mt-6">
        <Button type="button" buttonType={"secondaryReversed"} onClick={handlePrev} disabled={current === 0}>Previous</Button>
        {current < screeningQuestions.length - 1 ? (
          <Button type="button" buttonType={"parimaryReversed"} onClick={handleNext}>Next</Button>
        ) : (
          <button type="submit" className="px-6 py-2 bg-blue-600 text-white rounded hover:bg-blue-700" disabled={submitting}>Submit</button>
        )}
      </div>
    </Form>
  );
}
