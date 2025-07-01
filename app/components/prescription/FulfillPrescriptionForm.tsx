import React, { useState } from "react";
import { CreateFulfillmentRequest, Prescription, prescriptionApi, PrescriptionFulfillment } from "~/api/prescription";
import { useToast } from "~/hooks/useToast";
import Button from "../common/Button";
import { Input } from "../common/Input";

interface FulfillPrescriptionFormProps {
    /** Prescription to fulfill */
    prescription: Prescription;
    /** Pharmacy ID (current pharmacist's pharmacy) */
    pharmacyId: string;
    /** Pharmacist ID (current pharmacist) */
    pharmacistId?: string;
    /** Pharmacist license number */
    pharmacistLicenseNumber?: string;
    /** Called when fulfillment is successfully created */
    onFulfillmentCreated?: (fulfillment: PrescriptionFulfillment) => void;
    /** Called when form is cancelled */
    onCancel?: () => void;
}

interface FulfillmentFormData {
    filled_quantity: number;
    unit_price?: number;
    total_price?: number;
    insurance_covered?: number;
    patient_copay?: number;
    dispensed_medication_name?: string;
    dispensed_generic_name?: string;
    lot_number?: string;
    expiry_date?: string;
    manufacturer?: string;
    pickup_date?: string;
}

export const FulfillPrescriptionForm: React.FC<FulfillPrescriptionFormProps> = ({
    prescription,
    pharmacyId,
    pharmacistId,
    pharmacistLicenseNumber,
    onFulfillmentCreated,
    onCancel,
}) => {
    const toast = useToast();
    const [isSubmitting, setIsSubmitting] = useState(false);
    const [error, setError] = useState<string | null>(null);

    // Initialize form with some default values from prescription
    const [formData, setFormData] = useState<FulfillmentFormData>({
        filled_quantity: prescription.quantity || 0,
        dispensed_medication_name: prescription.medication_name,
        dispensed_generic_name: prescription.generic_name,
    });

    // Handle input changes
    const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
        const { name, value, type } = e.target;

        setFormData(prev => ({
            ...prev,
            [name]: type === "number" ? (value === "" ? undefined : parseFloat(value)) : value
        }));
    };

    // Calculate total price when unit price or quantity changes
    React.useEffect(() => {
        if (formData.unit_price && formData.filled_quantity) {
            const total = formData.unit_price * formData.filled_quantity;
            setFormData(prev => ({ ...prev, total_price: total }));
        }
    }, [formData.unit_price, formData.filled_quantity]);

    // Calculate patient copay when total price and insurance coverage changes
    React.useEffect(() => {
        if (formData.total_price && formData.insurance_covered !== undefined) {
            const copay = Math.max(0, formData.total_price - formData.insurance_covered);
            setFormData(prev => ({ ...prev, patient_copay: copay }));
        }
    }, [formData.total_price, formData.insurance_covered]);

    // Validate the form
    const validateForm = (): string[] => {
        const errors: string[] = [];

        if (!formData.filled_quantity || formData.filled_quantity <= 0) {
            errors.push("Filled quantity must be greater than 0");
        }

        if (formData.filled_quantity > prescription.quantity) {
            errors.push(`Filled quantity cannot exceed prescribed quantity (${prescription.quantity})`);
        }

        if (formData.unit_price !== undefined && formData.unit_price < 0) {
            errors.push("Unit price cannot be negative");
        }

        if (formData.insurance_covered !== undefined && formData.insurance_covered < 0) {
            errors.push("Insurance coverage cannot be negative");
        }

        if (formData.total_price !== undefined && formData.insurance_covered !== undefined) {
            if (formData.insurance_covered > formData.total_price) {
                errors.push("Insurance coverage cannot exceed total price");
            }
        }

        if (formData.expiry_date) {
            const expiryDate = new Date(formData.expiry_date);
            const today = new Date();
            if (expiryDate <= today) {
                errors.push("Medication expiry date must be in the future");
            }
        }

        return errors;
    };

    // Handle form submission
    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setError(null);

        // Validate form
        const validationErrors = validateForm();
        if (validationErrors.length > 0) {
            setError(validationErrors.join(", "));
            return;
        }

        setIsSubmitting(true);

        try {
            // Prepare fulfillment request
            const fulfillmentRequest: CreateFulfillmentRequest = {
                prescription_id: prescription.id,
                pharmacy_id: pharmacyId,
                filled_quantity: formData.filled_quantity,
                unit_price: formData.unit_price,
                total_price: formData.total_price,
                insurance_covered: formData.insurance_covered,
                patient_copay: formData.patient_copay,
                dispensed_medication_name: formData.dispensed_medication_name,
                dispensed_generic_name: formData.dispensed_generic_name,
                lot_number: formData.lot_number,
                expiry_date: formData.expiry_date,
                manufacturer: formData.manufacturer,
                dispensed_by_pharmacist_id: pharmacistId,
                pharmacist_license_number: pharmacistLicenseNumber,
                pickup_date: formData.pickup_date,
            };

            // Create fulfillment
            const fulfillment = await prescriptionApi.fillPrescription(fulfillmentRequest);

            toast.success("Prescription fulfilled successfully!");
            onFulfillmentCreated?.(fulfillment);

        } catch (error) {
            console.error("Failed to fulfill prescription:", error);
            const errorMessage = error instanceof Error ? error.message : "Failed to fulfill prescription. Please try again.";
            setError(errorMessage);
            toast.error(errorMessage);
        } finally {
            setIsSubmitting(false);
        }
    };

    return (
        <div className="card bg-base-100 shadow-xl">
            <div className="card-body">
                <h2 className="card-title">Fulfill Prescription</h2>

                {/* Prescription Info Summary */}
                <div className="bg-base-200 p-4 rounded-lg mb-4">
                    <h3 className="font-semibold mb-2">Prescription Details</h3>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-2 text-sm">
                        <div><span className="font-medium">Number:</span> {prescription.prescription_number}</div>
                        <div><span className="font-medium">Medication:</span> {prescription.medication_name}</div>
                        <div><span className="font-medium">Strength:</span> {prescription.strength || "N/A"}</div>
                        <div><span className="font-medium">Quantity:</span> {prescription.quantity}</div>
                        <div><span className="font-medium">Directions:</span> {prescription.directions_for_use}</div>
                        <div><span className="font-medium">Refills Remaining:</span> {prescription.refills_remaining}</div>
                    </div>
                </div>

                <form onSubmit={handleSubmit} className="space-y-4">
                    {/* Dispensing Information */}
                    <div className="space-y-4">
                        <h3 className="text-lg font-semibold">Dispensing Information</h3>

                        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                            <Input
                                label="Filled Quantity"
                                name="filled_quantity"
                                type="number"
                                value={formData.filled_quantity || ""}
                                onChange={handleInputChange}
                                placeholder="Enter filled quantity"
                                min="1"
                                max={prescription.quantity}
                                required
                            />

                            <Input
                                label="Dispensed Medication Name"
                                name="dispensed_medication_name"
                                value={formData.dispensed_medication_name || ""}
                                onChange={handleInputChange}
                                placeholder="Actual medication dispensed"
                            />

                            <Input
                                label="Dispensed Generic Name"
                                name="dispensed_generic_name"
                                value={formData.dispensed_generic_name || ""}
                                onChange={handleInputChange}
                                placeholder="Generic name if different"
                            />

                            <Input
                                label="Lot Number"
                                name="lot_number"
                                value={formData.lot_number || ""}
                                onChange={handleInputChange}
                                placeholder="Medication lot number"
                            />

                            <Input
                                label="Manufacturer"
                                name="manufacturer"
                                value={formData.manufacturer || ""}
                                onChange={handleInputChange}
                                placeholder="Manufacturer name"
                            />

                            <Input
                                label="Medication Expiry Date"
                                name="expiry_date"
                                type="date"
                                value={formData.expiry_date || ""}
                                onChange={handleInputChange}
                            />
                        </div>
                    </div>

                    {/* Pricing Information */}
                    <div className="space-y-4">
                        <h3 className="text-lg font-semibold">Pricing Information</h3>

                        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                            <Input
                                label="Unit Price ($)"
                                name="unit_price"
                                type="number"
                                step="0.01"
                                min="0"
                                value={formData.unit_price || ""}
                                onChange={handleInputChange}
                                placeholder="Price per unit"
                            />

                            <Input
                                label="Total Price ($)"
                                name="total_price"
                                type="number"
                                step="0.01"
                                min="0"
                                value={formData.total_price || ""}
                                onChange={handleInputChange}
                                placeholder="Total price (auto-calculated)"
                                disabled={!!(formData.unit_price && formData.filled_quantity)}
                            />

                            <Input
                                label="Insurance Covered ($)"
                                name="insurance_covered"
                                type="number"
                                step="0.01"
                                min="0"
                                value={formData.insurance_covered || ""}
                                onChange={handleInputChange}
                                placeholder="Amount covered by insurance"
                            />

                            <Input
                                label="Patient Copay ($)"
                                name="patient_copay"
                                type="number"
                                step="0.01"
                                min="0"
                                value={formData.patient_copay || ""}
                                onChange={handleInputChange}
                                placeholder="Patient copay (auto-calculated)"
                                disabled={!!(formData.total_price && formData.insurance_covered !== undefined)}
                            />
                        </div>
                    </div>

                    {/* Pickup Information */}
                    <div className="space-y-4">
                        <h3 className="text-lg font-semibold">Pickup Information</h3>

                        <Input
                            label="Pickup Date"
                            name="pickup_date"
                            type="date"
                            value={formData.pickup_date || ""}
                            onChange={handleInputChange}
                            wrapperClass="max-w-md"
                        />
                    </div>

                    {/* Error Display */}
                    {error && (
                        <div className="alert alert-error">
                            <span>{error}</span>
                        </div>
                    )}

                    {/* Form Actions */}
                    <div className="card-actions justify-end">
                        {onCancel && (
                            <Button
                                type="button"
                                buttonType="neutral"
                                onClick={onCancel}
                                disabled={isSubmitting}
                            >
                                Go Back
                            </Button>
                        )}

                        <Button
                            type="submit"
                            isLoading={isSubmitting}
                            disabled={isSubmitting}
                        >
                            {isSubmitting ? "Fulfilling..." : "Fulfill Prescription"}
                        </Button>
                    </div>
                </form>
            </div>
        </div>
    );
};

export default FulfillPrescriptionForm;
