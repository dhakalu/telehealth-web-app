import React from "react";
import { PractitionerList } from "../../components/PractitionerList";
import { Form } from "@remix-run/react";
import { ActionFunctionArgs } from "@remix-run/node";
import axios from "axios";
import { requireAuthCookie } from "~/auth";

type Question = {
  question: string;
  type: "text" | "checkbox" | "radio";
  options?: string[];
  isRequired: boolean;
}

const screeningQuestions: Question[] = [
  {
    question: "What is the reason for your visit today?",
    type: "text",
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

type Answer = {
  providerId: string;
  patientId: string;
  answers: Record<string, string | string[]>;
}

export const action = async ({ request, params }: ActionFunctionArgs) => {
  const user = await requireAuthCookie(request);
  const formData = await request.formData();
  const answers: Record<string, string | string[]> = {};

  screeningQuestions.forEach((q, idx) => {
    const answerKey = `question-${idx}`;
    const answerValue = formData.getAll(answerKey);
    if (answerValue.length > 0) {
      answers[q.question] =  String(answerValue);
    }
  });

  await axios.post("http://localhost:8090/qa", {
    providerId: params.providerId,
    patientId: user.sub,
    answers: answers
  });


  // Here you would typically send the answers to your backend or process them as needed
  console.log("Screening Answers:", answers);

  return { success: true, message: "Screening questions submitted successfully." };
}

export default function ScreeningQuestionAnswers() {
  return (
    <Form method="post" className="max-w-2xl mx-auto p-6 bg-white rounded shadow space-y-6">
      <h2 className="text-2xl font-bold mb-2">Screening Questions</h2>
      <p className="text-gray-600 mb-4">Almost there, before we connect with a doctor, please answer the following questions.</p>
      {screeningQuestions.map((q, idx) => (
        <div key={idx} className="space-y-2">
          <label className="block font-medium">
            {q.question}
            {q.isRequired && <span className="text-red-500 ml-1">*</span>}
          </label>
          {q.type === "text" && (
            <input
              type="text"
              className="w-full border rounded px-3 py-2"
              name={`question-${idx}`}
              required={q.isRequired}
            />
          )}
          {q.type === "checkbox" && q.options && (
            <div className="flex flex-wrap gap-4">
              {q.options.map((opt, oidx) => (
                <label key={oidx} className="flex items-center gap-2">
                  <input
                    type="checkbox"
                    name={`question-${idx}`}
                    value={opt}
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
                    name={`question-${idx}`}
                    value={opt}
                    required={q.isRequired}
                  />
                  {opt}
                </label>
              ))}
            </div>
          )}
        </div>
      ))}
      <button type="submit" className="mt-6 px-6 py-2 bg-blue-600 text-white rounded hover:bg-blue-700">Submit</button>
    </Form>
  );
}
