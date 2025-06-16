import { ActionFunctionArgs, LoaderFunction } from "@remix-run/node";
import { Form, Link, Outlet, redirect, useLoaderData, useLocation, useNavigate } from "@remix-run/react"
import axios, { Axios, AxiosError } from "axios";
import { getAppPath, requireAuthCookie } from "~/auth";
import React, { useState } from "react";
import { ChatComponent, Chat } from "~/components/ChatComponent";
import { User } from "../provider.complete-profile/route";

export const API_BASE_URL = "http://localhost:8090";


type EncounterType = "in-person" | "telehealth"

type Encounter = {
    id: string;
    providerId: string;
    patientId: string;
    reason: string;
    start: string;
    end?: string | null;
    type?: EncounterType; 
    status: string;
    notes?: string | null;
    createdAt: string;
    patient: User
    provider: User
}


export const  loader: LoaderFunction = async ({request, params}) => {
    const user =  await requireAuthCookie(request);
    const { encounterId } = params; 
    try {
        const response = await axios.get(`${API_BASE_URL}/encounter/${encounterId}`);
        return response.data;
    } catch (error) {
        if (axios.isAxiosError(error)) {
            if (error.response?.status === 404) {
                return []; // User not found, return the user data to complete profile
            } else {
                return Response.json({ error: "Failed to fetch practitioner data" }, { status: error.response?.status || 500 });
            }
        } else {
            return Response.json({ error: "An unexpected error occurred" }, { status: 500 });
        }
    }
}

export default function EncountersPage() {

    const encounters = useLoaderData<Encounter>() || {};
    const navigate = useNavigate();
    const location = useLocation();


    return (
        <div className="min-h-screen bg-gray-50 flex flex-col">
            <div className="flex border-b bg-white">
  <Link
    to="chat"
    className={`px-6 py-3 -mb-px border-b-2 font-medium text-sm transition-colors duration-200 ${
      location.pathname.includes('/chat/')
        ? 'border-blue-600 text-blue-600'
        : 'border-transparent text-gray-500 hover:text-blue-600 hover:border-blue-300'
    }`}
  >
    Chat
  </Link>
  <Link
    to="qa"
    className={`px-6 py-3 -mb-px border-b-2 font-medium text-sm transition-colors duration-200 ${
      location.pathname.includes('/qa/')
        ? 'border-blue-600 text-blue-600'
        : 'border-transparent text-gray-500 hover:text-blue-600 hover:border-blue-300'
    }`}
  >
    Q&amp;A
  </Link>
</div>

            <div className="w3-container city">
                <Outlet />
            </div>
        </div>
    )
}