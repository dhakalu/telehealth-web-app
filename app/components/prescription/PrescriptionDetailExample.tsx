/**
 * PrescriptionDetail Component Usage Example
 * 
 * This example demonstrates how to use the PrescriptionDetail component
 * to display comprehensive prescription information.
 */

import React from 'react';
import type { PrescriptionWithDetails } from '~/api/prescription';
import { PrescriptionDetail } from './PrescriptionDetail';

// Example usage of PrescriptionDetail component
export const PrescriptionDetailExample: React.FC = () => {
    // Sample prescription data
    const samplePrescription: PrescriptionWithDetails = {
        id: "123e4567-e89b-12d3-a456-426614174000",
        prescription_number: "RX-1234567890",
        patient_id: "patient-123",
        practitioner_id: "practitioner-456",
        pharmacy_id: "pharmacy-789",
        medication_name: "Lisinopril",
        generic_name: "Lisinopril",
        strength: "10mg",
        dosage_form: "Tablet",
        quantity: 30,
        days_supply: 30,
        directions_for_use: "Take 1 tablet by mouth once daily",
        frequency: "Once daily",
        prescription_type: "new",
        status: "filled",
        refills_authorized: 5,
        refills_remaining: 4,
        prescribed_date: "2024-01-15T10:30:00Z",
        expiry_date: "2025-01-15T10:30:00Z",
        last_filled_date: "2024-01-20T14:00:00Z",
        is_controlled_substance: false,
        indication: "Hypertension",
        notes: "Monitor blood pressure regularly",
        created_at: "2024-01-15T10:30:00Z",
        updated_at: "2024-01-20T14:00:00Z",
        // Extended details
        patient_name: "John Doe",
        practitioner_name: "Dr. Sarah Smith",
        pharmacy_name: "City Pharmacy",
        fulfillments: [
            {
                id: "fulfillment-1",
                prescription_id: "123e4567-e89b-12d3-a456-426614174000",
                pharmacy_id: "pharmacy-789",
                filled_quantity: 30,
                unit_price: 0.50,
                total_price: 15.00,
                insurance_covered: 10.00,
                patient_copay: 5.00,
                dispensed_medication_name: "Lisinopril",
                dispensed_generic_name: "Lisinopril",
                manufacturer: "Generic Pharma Co.",
                lot_number: "LOT123456",
                filled_date: "2024-01-20T14:00:00Z",
                pickup_date: "2024-01-20T16:30:00Z",
                created_at: "2024-01-20T14:00:00Z"
            }
        ]
    };

    const handleEdit = (prescription: PrescriptionWithDetails) => {
        console.log('Edit prescription:', prescription.id);
        // Navigate to edit form or open modal
    };

    const handleCancel = (prescription: PrescriptionWithDetails) => {
        console.log('Cancel prescription:', prescription.id);
        // Show confirmation dialog and cancel prescription
    };

    return (
        <div className="container mx-auto py-6">
            <h1 className="text-3xl font-bold mb-6">Prescription Detail Example</h1>

            {/* Full featured prescription detail */}
            <PrescriptionDetail
                prescription={samplePrescription}
                showFulfillments={true}
                onEdit={handleEdit}
                onCancel={handleCancel}
                canEdit={true}
                canCancel={true}
                className="mb-8"
            />

            {/* Read-only prescription detail */}
            <div className="mt-8">
                <h2 className="text-xl font-semibold mb-4">Read-Only View</h2>
                <PrescriptionDetail
                    prescription={samplePrescription}
                    showFulfillments={false}
                    canEdit={false}
                    canCancel={false}
                />
            </div>
        </div>
    );
};

export default PrescriptionDetailExample;
