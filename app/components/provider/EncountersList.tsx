import axios from "axios";
import { useState } from "react";
import { useToast } from "~/hooks";
import { Avatar } from "../common/Avatar";
import Button from "../common/Button";

export type EncounterSummary = {
    id: string;
    providerId: string;
    patientId: string;
    patientFirstName: string;
    patientLastName: string;
    patientMiddleName?: string | null;
}

export type EstablishmentListProps = {
    encounterSummaries: EncounterSummary[],
    onSelect: (item: EncounterSummary) => void,
    selectedEncounterId: string | null,
    baseUrl: string,
    onComplete?: (completedEncounterId: string) => void
}

const getNames = (encounterSummary: EncounterSummary) => {
    const { patientFirstName, patientLastName } = encounterSummary;
    return [`${patientFirstName} ${patientLastName}`, `${patientFirstName?.[0]}${patientLastName?.[0]}`]
}

export default function EstablishmentList({ encounterSummaries: establishments, onSelect, selectedEncounterId, baseUrl, onComplete }: EstablishmentListProps) {
    const [completingIds, setCompletingIds] = useState<Set<string>>(new Set());
    const toast = useToast();

    const handleComplete = async (e: React.MouseEvent, encounterId: string) => {
        e.stopPropagation();

        if (completingIds.has(encounterId)) {
            return; // Already in progress
        }

        setCompletingIds(prev => new Set(prev).add(encounterId));

        try {
            await axios.patch(`${baseUrl}/encounter/${encounterId}/status`, {
                status: 'completed'
            });
            // Call the callback to refresh data or handle success
            onComplete?.(encounterId);
            toast.success("Encounter marked as completed successfully!");
        } catch (error) {
            const errorMessage = error instanceof Error ? error.message : "An unexpected error occurred while completing the encounter";
            toast.error(errorMessage);
        } finally {
            setCompletingIds(prev => {
                const newSet = new Set(prev);
                newSet.delete(encounterId);
                return newSet;
            });
        }
    };
    return (
        <div>
            <h2 className="text-lg font-bold p-4">Current Patients</h2>
            {establishments && establishments.length > 0 ? (
                <ul className="list">
                    {establishments.map((establishment) => {
                        const [name, initials] = getNames(establishment)
                        return (
                            <li
                                key={establishment.id}
                                className={`list-row rounded-none cursor-pointer items-center ${selectedEncounterId === establishment.id ? "bg-base-100" : "hover:bg-base-100"}`}
                                onClick={() => onSelect(establishment)}
                            >
                                <Avatar initials={initials} src={""} />
                                <div>{name}</div>
                                <Button
                                    size="sm"
                                    soft
                                    title="Mark as completed"
                                    isLoading={completingIds.has(establishment.id)}
                                    onClick={e => handleComplete(e, establishment.id)}
                                >
                                    <svg
                                        xmlns="http://www.w3.org/2000/svg"
                                        width="16"
                                        height="16"
                                        fill="none"
                                        viewBox="0 0 16 16"
                                        aria-label="Completed"
                                    >
                                        <path
                                            d="M4 8.5l3 3 5-5"
                                            stroke="currentColor"
                                            strokeWidth="2"
                                            strokeLinecap="round"
                                            strokeLinejoin="round"
                                            fill="none"
                                        />
                                    </svg>
                                </Button>
                            </li>
                        )
                    })}
                </ul>
            ) : (
                <div className="mt-8 text-center opacity-60">No active patients</div>
            )}
        </div>
    )
}