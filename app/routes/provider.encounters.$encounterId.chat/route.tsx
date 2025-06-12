import { ActionFunctionArgs, LoaderFunction } from "@remix-run/node";
import { Form, Link, Outlet, redirect, useLoaderData, useNavigate } from "@remix-run/react"
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

    return (
        <div className="min-h-screen bg-gray-50 flex flex-col">
            <div className="w3-bar w3-black">
                <Link to="chat" className="w3-bar-item w3-button">
                chat
                </Link>
                <Link to="/tabs/b" className="w3-bar-item w3-button">
                Q&A
                </Link>
            </div>

            <div className="w3-container city">
                <Outlet />
            </div>
        </div>
    )
}