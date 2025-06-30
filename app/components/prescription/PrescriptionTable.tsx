import { useState } from "react";
import Button from "../common/Button";
import DeleteConfirmationModal from "../common/DeleteConfirmationModal";
import {
    Prescription,
    PrescriptionStatus,
    PrescriptionType,
    PrescriptionWithDetails
} from "./types";

interface PrescriptionTableProps {
    prescriptions: PrescriptionWithDetails[];
    onEdit?: (prescription: Prescription) => void;
    onDelete?: (prescriptionId: string) => void;
    loading?: boolean;
}

const statusColorMap: Record<PrescriptionStatus, string> = {
    pending: "bg-yellow-100 text-yellow-800",
    sent: "bg-blue-100 text-blue-800",
    filled: "bg-green-100 text-green-800",
    cancelled: "bg-red-100 text-red-800",
    rejected: "bg-red-100 text-red-800",
    expired: "bg-gray-100 text-gray-800",
};

const prescriptionTypeMap: Record<PrescriptionType, string> = {
    new: "New",
    refill: "Refill",
    renewal: "Renewal",
    substitution: "Substitution",
};

export default function PrescriptionTable({
    prescriptions,
    onEdit,
    onDelete,
    loading = false,
}: PrescriptionTableProps) {
    const [sortField, setSortField] = useState<string>("prescribed_date");
    const [sortDirection, setSortDirection] = useState<"asc" | "desc">("desc");
    const [prescriptionToDelete, setPrescriptionToDelete] = useState<Prescription | null>(null);

    const handleSort = (field: string) => {
        if (sortField === field) {
            setSortDirection(sortDirection === "asc" ? "desc" : "asc");
        } else {
            setSortField(field);
            setSortDirection("asc");
        }
    };

    const sortedPrescriptions = [...prescriptions].sort((a, b) => {
        const aValue = a[sortField as keyof PrescriptionWithDetails];
        const bValue = b[sortField as keyof PrescriptionWithDetails];

        if (aValue === null || aValue === undefined) return 1;
        if (bValue === null || bValue === undefined) return -1;

        if (typeof aValue === "string" && typeof bValue === "string") {
            return sortDirection === "asc"
                ? aValue.localeCompare(bValue)
                : bValue.localeCompare(aValue);
        }

        if (typeof aValue === "number" && typeof bValue === "number") {
            return sortDirection === "asc" ? aValue - bValue : bValue - aValue;
        }

        return 0;
    });

    const formatDate = (dateString: string) => {
        return new Date(dateString).toLocaleDateString();
    };

    const handleCancelClick = (prescription: Prescription) => {
        setPrescriptionToDelete(prescription);
    }

    const showDeleteConfirmationModal = prescriptionToDelete !== null;

    const SortableHeader = ({ field, children }: { field: string; children: React.ReactNode }) => (
        <th
            className="px-6 py-3 text-left text-xs font-medium opacity-50 uppercase tracking-wider cursor-pointer hover:bg-gray-50"
            onClick={() => handleSort(field)}
        >
            <div className="flex items-center space-x-1">
                <span>{children}</span>
                {sortField === field && (
                    <span className="text-gray-400">
                        {sortDirection === "asc" ? "↑" : "↓"}
                    </span>
                )}
            </div>
        </th>
    );

    if (loading) {
        return (
            <div className="flex justify-center items-center py-8">
                <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600"></div>
            </div>
        );
    }

    if (prescriptions.length === 0) {
        return (
            <div className="text-center py-8">
                <p className="opacity-50">No prescriptions found.</p>
            </div>
        );
    }


    return (
        <div className="overflow-x-auto">
            <table className="min-w-full divide-y divide-gray-200">
                <thead>
                    <tr>
                        <SortableHeader field="prescription_number">Prescription #</SortableHeader>
                        <SortableHeader field="medication_name">Medication</SortableHeader>
                        <SortableHeader field="patient_name">Patient</SortableHeader>
                        <SortableHeader field="practitioner_name">Practitioner</SortableHeader>
                        <SortableHeader field="prescription_type">Type</SortableHeader>
                        <SortableHeader field="status">Status</SortableHeader>
                        <SortableHeader field="quantity">Quantity</SortableHeader>
                        <SortableHeader field="refills_remaining">Refills Left</SortableHeader>
                        <SortableHeader field="prescribed_date">Prescribed Date</SortableHeader>
                        <th className="px-6 py-3 text-left text-xs font-medium opacity-50 uppercase tracking-wider">
                            Actions
                        </th>
                    </tr>
                </thead>
                <tbody className="divide-y divide-gray-200">
                    {sortedPrescriptions.map((prescription) => (
                        <tr key={prescription.id} className="hover:bg-gray-50">
                            <td className="px-6 py-4 whitespace-nowrap text-sm font-medium opacity-90">
                                {prescription.prescription_number}
                            </td>
                            <td className="px-6 py-4 whitespace-nowrap">
                                <div className="text-sm opacity-90">
                                    {prescription.medication_name}
                                </div>
                                {prescription.generic_name && (
                                    <div className="text-sm opacity-50">
                                        Generic: {prescription.generic_name}
                                    </div>
                                )}
                                {prescription.strength && (
                                    <div className="text-sm opacity-50">
                                        {prescription.strength}
                                    </div>
                                )}
                            </td>
                            <td className="px-6 py-4 whitespace-nowrap text-sm opacity-90">
                                {prescription.patient_name || prescription.patient_id}
                            </td>
                            <td className="px-6 py-4 whitespace-nowrap text-sm opacity-90">
                                {prescription.practitioner_name || prescription.practitioner_id}
                            </td>
                            <td className="px-6 py-4 whitespace-nowrap text-sm opacity-90">
                                {prescriptionTypeMap[prescription.prescription_type]}
                            </td>
                            <td className="px-6 py-4 whitespace-nowrap">
                                <span className={`inline-flex px-2 py-1 text-xs font-semibold rounded-full ${statusColorMap[prescription.status]}`}>
                                    {prescription.status}
                                </span>
                            </td>
                            <td className="px-6 py-4 whitespace-nowrap text-sm opacity-90">
                                {prescription.quantity}
                                {prescription.dosage_form && ` ${prescription.dosage_form}`}
                            </td>
                            <td className="px-6 py-4 whitespace-nowrap text-sm opacity-90">
                                {prescription.refills_remaining} / {prescription.refills_authorized}
                            </td>
                            <td className="px-6 py-4 whitespace-nowrap text-sm opacity-90">
                                {formatDate(prescription.prescribed_date)}
                            </td>
                            <td className="px-6 py-4 whitespace-nowrap text-sm font-medium">
                                <div className="flex space-x-2">
                                    {onEdit && (
                                        <Button
                                            size="sm"
                                            soft
                                            onClick={() => onEdit(prescription)}
                                        >
                                            Edit
                                        </Button>
                                    )}
                                    {onDelete && prescription.status === "pending" && (
                                        <Button
                                            size="sm"
                                            soft
                                            buttonType="error"
                                            onClick={() => handleCancelClick(prescription)}
                                        >
                                            Cancel
                                        </Button>
                                    )}
                                </div>
                            </td>
                        </tr>
                    ))}
                </tbody>
            </table>
            {
                showDeleteConfirmationModal && (
                    <DeleteConfirmationModal
                        isOpen={showDeleteConfirmationModal}
                        onClose={() => setPrescriptionToDelete(null)}
                        onConfirm={() => {
                            if (prescriptionToDelete && onDelete) {
                                onDelete(prescriptionToDelete.id);
                            }
                            setPrescriptionToDelete(null);
                        }}

                    />
                )}
        </div>
    );
}
