import axios from "axios";
import { useEffect, useState } from "react";
import prescriptionApi from "~/api/prescription";
import {
    CreatePrescriptionRequest,
    DrugDatabase,
    Prescription,
    PrescriptionStatus,
    PrescriptionType,
    UpdatePrescriptionRequest
} from "~/api/prescription/types";
import { Input } from "~/components/common/Input";
import { Select } from "~/components/common/Select";
import TypeAHeadSearch from "~/components/common/TypeAHeadSearch";
import { useToast } from "~/hooks/useToast";

interface PrescriptionFormProps {
    baseUrl: string;
    patientId: string;
    practitionerId: string;
    prescriptionId?: string; // Optional, if editing an existing prescription
    onPrescriptionCreated?: (prescription: Prescription) => void;
    onPrescriptionUpdated?: (prescription: Prescription) => void;
    onCancel?: () => void;
}

const prescriptionTypeOptions = [
    { value: "new", label: "New Prescription" },
    { value: "refill", label: "Refill" },
    { value: "renewal", label: "Renewal" },
    { value: "substitution", label: "Substitution" },
];

const statusOptions = [
    { value: "pending", label: "Pending" },
    { value: "sent", label: "Sent" },
    { value: "filled", label: "Filled" },
    { value: "cancelled", label: "Cancelled" },
    { value: "rejected", label: "Rejected" },
    { value: "expired", label: "Expired" },
];

const scheduleClassOptions = [
    { value: "I", label: "Schedule I" },
    { value: "II", label: "Schedule II" },
    { value: "III", label: "Schedule III" },
    { value: "IV", label: "Schedule IV" },
    { value: "V", label: "Schedule V" },
];

const dosageFormOptions = [
    { value: "tablet", label: "Tablet" },
    { value: "capsule", label: "Capsule" },
    { value: "liquid", label: "Liquid" },
    { value: "injection", label: "Injection" },
    { value: "cream", label: "Cream" },
    { value: "ointment", label: "Ointment" },
    { value: "patch", label: "Patch" },
    { value: "inhaler", label: "Inhaler" },
    { value: "drops", label: "Drops" },
];

const frequencyOptions = [
    { value: "once daily", label: "Once daily" },
    { value: "twice daily", label: "Twice daily" },
    { value: "three times daily", label: "Three times daily" },
    { value: "four times daily", label: "Four times daily" },
    { value: "every 4 hours", label: "Every 4 hours" },
    { value: "every 6 hours", label: "Every 6 hours" },
    { value: "every 8 hours", label: "Every 8 hours" },
    { value: "every 12 hours", label: "Every 12 hours" },
    { value: "as needed", label: "As needed" },
    { value: "before meals", label: "Before meals" },
    { value: "after meals", label: "After meals" },
];

export default function PrescriptionForm({
    baseUrl,
    patientId,
    practitionerId,
    prescriptionId,
    onPrescriptionCreated,
    onPrescriptionUpdated,
    onCancel,
}: PrescriptionFormProps) {
    const toast = useToast();
    const [loading, setLoading] = useState(false);
    const [isEditing, setIsEditing] = useState(!!prescriptionId);
    const [drugOptions, setDrugOptions] = useState<DrugDatabase[]>([]);

    const [prescription, setPrescription] = useState<Partial<Prescription & CreatePrescriptionRequest>>({
        patient_id: patientId,
        practitioner_id: practitionerId,
        medication_name: "",
        generic_name: "",
        strength: "",
        dosage_form: "",
        quantity: 1,
        days_supply: 30,
        directions_for_use: "",
        frequency: "",
        prescription_type: "new" as PrescriptionType,
        status: "pending" as PrescriptionStatus,
        refills_authorized: 0,
        is_controlled_substance: false,
        schedule_class: "",
        indication: "",
        notes: "",
        pharmacy_id: "",
    });

    // Fetch prescription details when prescriptionId is provided
    useEffect(() => {
        if (prescriptionId) {
            fetchPrescriptionDetails();
        }
    }, [prescriptionId]); // eslint-disable-line react-hooks/exhaustive-deps

    // Fetch drug database for medication suggestions
    useEffect(() => {
        fetchDrugDatabase();
    }, []);

    const fetchPrescriptionDetails = async () => {
        if (!prescriptionId) return;

        setLoading(true);
        try {
            const data = await prescriptionApi.getPrescription(prescriptionId);
            setPrescription(data);
            setIsEditing(true);
        } catch (error) {
            console.error("Failed to fetch prescription details:", error);
            toast.error("Failed to load prescription details. Please try again.");
        } finally {
            setLoading(false);
        }
    };

    const fetchDrugDatabase = async () => {
        try {
            const data = await prescriptionApi.getAllDrugs();
            setDrugOptions(data || []);
        } catch (error) {
            console.error("Failed to fetch drug database:", error);
        }
    };

    const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement>) => {
        const { name, value, type } = e.target;
        setPrescription(prev => ({
            ...prev,
            [name]: type === "checkbox"
                ? (e.target as HTMLInputElement).checked
                : type === "number"
                    ? value === "" ? undefined : parseInt(value, 10)
                    : value === "" ? undefined : value
        }));
    };

    const handleMedicationChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
        const selectedDrug = drugOptions.find(drug => drug.generic_name === e.target.value);
        if (selectedDrug) {
            setPrescription(prev => ({
                ...prev,
                medication_name: selectedDrug.generic_name,
                generic_name: selectedDrug.generic_name,
                is_controlled_substance: selectedDrug.is_controlled_substance,
                schedule_class: selectedDrug.schedule_class || "",
            }));
        } else {
            setPrescription(prev => ({
                ...prev,
                medication_name: e.target.value,
                generic_name: e.target.value,
            }));
        }
    };

    const handlePharmacySelect = (pharmacyId: string) => {
        alert(`Selected Pharmacy ID: ${pharmacyId}`);
        setPrescription(prev => ({
            ...prev,
            pharmacy_id: pharmacyId,
        }));
    };

    const savePrescription = async () => {
        try {
            setLoading(true);

            let response;
            if (isEditing && prescriptionId) {
                // Update existing prescription
                const updateData: UpdatePrescriptionRequest = {
                    pharmacy_id: prescription.pharmacy_id,
                    medication_name: prescription.medication_name,
                    generic_name: prescription.generic_name,
                    strength: prescription.strength,
                    dosage_form: prescription.dosage_form,
                    quantity: prescription.quantity,
                    days_supply: prescription.days_supply,
                    directions_for_use: prescription.directions_for_use,
                    frequency: prescription.frequency,
                    status: prescription.status,
                    refills_authorized: prescription.refills_authorized,
                    is_controlled_substance: prescription.is_controlled_substance,
                    schedule_class: prescription.schedule_class,
                    indication: prescription.indication,
                    notes: prescription.notes,
                };
                const savedPrescription = await prescriptionApi.updatePrescription(prescriptionId, updateData, practitionerId);
                toast.success("Prescription updated successfully!");
                if (onPrescriptionUpdated) {
                    onPrescriptionUpdated(savedPrescription);
                }
            } else {
                // Create new prescription
                const createData: CreatePrescriptionRequest = {
                    patient_id: patientId,
                    pharmacy_id: prescription.pharmacy_id,
                    medication_name: prescription.medication_name!,
                    generic_name: prescription.generic_name,
                    strength: prescription.strength,
                    dosage_form: prescription.dosage_form,
                    quantity: prescription.quantity!,
                    days_supply: prescription.days_supply,
                    directions_for_use: prescription.directions_for_use!,
                    frequency: prescription.frequency,
                    prescription_type: prescription.prescription_type!,
                    refills_authorized: prescription.refills_authorized!,
                    is_controlled_substance: prescription.is_controlled_substance!,
                    schedule_class: prescription.schedule_class,
                    indication: prescription.indication,
                    notes: prescription.notes,
                };
                response = await axios.post(`${baseUrl}/prescriptions`, createData, {
                    headers: {
                        "Content-Type": "application/json",
                        "X-Practitioner-ID": practitionerId, // Include practitioner ID in headers
                    }
                });
                toast.success("Prescription created successfully!");
                if (onPrescriptionCreated) {
                    onPrescriptionCreated(response.data);
                }
            }
        } catch (error) {
            console.error("Failed to save prescription:", error);
            toast.error("Failed to save prescription. Please try again.");
        } finally {
            setLoading(false);
        }
    };

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        savePrescription();
    };

    if (loading && !prescription.medication_name) {
        return (
            <div className="flex justify-center items-center py-8">
                <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600"></div>
            </div>
        );
    }

    return (
        <div className="mx-auto">
            <form onSubmit={handleSubmit} className="space-y-6">
                {/* Medication Information */}
                <div className="p-6 rounded-lg border">
                    <h3 className="text-lg font-semibold mb-4">Medication Information</h3>

                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        <div>
                            <label htmlFor="medication_name" className="block mb-1 font-medium">
                                Medication Name <span className="text-red-500">*</span>
                            </label>
                            <select
                                id="medication_name"
                                name="medication_name"
                                value={prescription.medication_name || ""}
                                onChange={handleMedicationChange}
                                className="select w-full border px-4 py-2 rounded"
                                required
                            >
                                <option value="">Select medication...</option>
                                {drugOptions.map((drug) => (
                                    <option key={drug.id} value={drug.generic_name}>
                                        {drug.generic_name}
                                    </option>
                                ))}
                            </select>
                        </div>

                        <Input
                            label="Generic Name"
                            type="text"
                            name="generic_name"
                            value={prescription.generic_name || ""}
                            onChange={handleInputChange}
                            placeholder="Generic name"
                        />
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        <Input
                            label="Strength"
                            type="text"
                            name="strength"
                            value={prescription.strength || ""}
                            onChange={handleInputChange}
                            placeholder="e.g., 10mg, 500mg"
                        />

                        <Select
                            label="Dosage Form"
                            name="dosage_form"
                            value={prescription.dosage_form || ""}
                            onChange={handleInputChange}
                            options={dosageFormOptions}
                        />

                        <Select
                            label="Prescription Type"
                            name="prescription_type"
                            value={prescription.prescription_type || ""}
                            onChange={handleInputChange}
                            options={prescriptionTypeOptions}
                            required
                        />
                    </div>
                </div>

                {/* Dosage and Instructions */}
                <div className="p-6 rounded-lg border">
                    <h3 className="text-lg font-semibold mb-4">Dosage and Instructions</h3>

                    <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                        <Input
                            label="Quantity"
                            type="number"
                            name="quantity"
                            value={prescription.quantity || ""}
                            onChange={handleInputChange}
                            placeholder="Number of units"
                            min="1"
                            required
                        />

                        <Input
                            label="Days Supply"
                            type="number"
                            name="days_supply"
                            value={prescription.days_supply || ""}
                            onChange={handleInputChange}
                            placeholder="Number of days"
                            min="1"
                        />

                        <Select
                            label="Frequency"
                            name="frequency"
                            value={prescription.frequency || ""}
                            onChange={handleInputChange}
                            options={frequencyOptions}
                        />
                    </div>

                    <Input
                        label="Directions for Use"
                        name="directions_for_use"
                        value={prescription.directions_for_use || ""}
                        onChange={handleInputChange}
                        placeholder="e.g., Take 1 tablet by mouth twice daily with food"
                        textarea
                        required
                    />
                </div>

                {/* Refills and Status */}
                <div className="p-6 rounded-lg border">
                    <h3 className="text-lg font-semibold mb-4">Pharmacy and Status</h3>

                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        <div>
                            <TypeAHeadSearch
                                url={`${baseUrl}/organizations?type=pharmacy`}
                                label="Pharmacy"
                                placeholder="Search for pharmacy..."
                                value={prescription.pharmacy_id || ""}
                                resultKey="id"
                                labelKey="name"
                                minQueryLength={2}
                                onSelect={handlePharmacySelect}
                            />
                        </div>

                        <Input
                            label="Refills Authorized"
                            type="number"
                            name="refills_authorized"
                            value={prescription.refills_authorized || ""}
                            onChange={handleInputChange}
                            min="0"
                            max="5"
                            required
                        />
                    </div>

                    {isEditing && (
                        <div className="mt-4">
                            <Select
                                label="Status"
                                name="status"
                                value={prescription.status || ""}
                                onChange={handleInputChange}
                                options={statusOptions}
                            />
                        </div>
                    )}
                </div>

                {/* Controlled Substance Information */}
                <div className="p-6 rounded-lg border">
                    <h3 className="text-lg font-semibold mb-4">Controlled Substance Information</h3>

                    <div className="mb-4 flex items-center">
                        <label htmlFor="is_controlled_substance" className="font-medium flex-grow cursor-pointer">
                            Controlled Substance
                        </label>
                        <input
                            id="is_controlled_substance"
                            type="checkbox"
                            name="is_controlled_substance"
                            checked={prescription.is_controlled_substance || false}
                            onChange={handleInputChange}
                            className="checkbox"
                        />
                    </div>

                    {prescription.is_controlled_substance && (
                        <Select
                            label="Schedule Class"
                            name="schedule_class"
                            value={prescription.schedule_class || ""}
                            onChange={handleInputChange}
                            options={scheduleClassOptions}
                        />
                    )}
                </div>

                {/* Additional Information */}
                <div className="p-6 rounded-lg border">
                    <h3 className="text-lg font-semibold mb-4">Additional Information</h3>

                    <Input
                        label="Indication"
                        name="indication"
                        value={prescription.indication || ""}
                        onChange={handleInputChange}
                        placeholder="Medical condition or reason for prescription"
                        textarea
                    />

                    <Input
                        label="Notes"
                        name="notes"
                        value={prescription.notes || ""}
                        onChange={handleInputChange}
                        placeholder="Additional notes or instructions"
                        textarea
                    />
                </div>

                {/* Submit buttons */}
                <div className="flex gap-2 pt-4">
                    <button
                        type="submit"
                        className={`btn btn-primary ${loading ? "loading" : ""}`}
                        disabled={loading}
                    >
                        {isEditing ? "Update Prescription" : "Create Prescription"}
                    </button>
                    {onCancel && (
                        <button
                            type="button"
                            onClick={onCancel}
                            className="btn btn-secondary"
                            disabled={loading}
                        >
                            Cancel
                        </button>
                    )}
                </div>
            </form>
        </div>
    );
}
