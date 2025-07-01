import React, { useEffect } from "react";
import { useNavigate } from "react-router";
import type { Prescription, PrescriptionFulfillment, PrescriptionWithDetails } from "~/api/prescription";
import prescriptionApi, { prescriptionUtils } from "~/api/prescription";
import Card from "~/components/common/Card";
import { useToast } from "~/hooks";
import { Button } from "../common";

export interface PrescriptionDetailProps {
    /** Prescription data */
    prescription: Prescription | PrescriptionWithDetails;
    /** Additional CSS classes */
    className?: string;
    /** Whether to show fulfillment history */
    showFulfillments?: boolean;
    /** Callback when prescription is edited */
    onEdit?: (prescription: Prescription) => void;
    /** Callback when prescription is cancelled */
    onCancel?: (prescription: Prescription) => void;
    /** Whether the prescription can be edited */
    canEdit?: boolean;
    /** Whether the prescription can be cancelled */
    canCancel?: boolean;
}

export const PrescriptionDetail: React.FC<PrescriptionDetailProps> = ({
    prescription,
    className = "",
    showFulfillments = true,
    onCancel,
    canCancel = false
}) => {
    const toast = useToast();
    const navigate = useNavigate();
    const [fulfillments, setFFulfillments] = React.useState<PrescriptionFulfillment[] | undefined>();
    const statusColor = prescriptionUtils.getStatusColor(prescription.status);
    const prescriptionTypeLabel = prescriptionUtils.formatPrescriptionType(prescription.prescription_type);
    const prescribedDate = prescriptionUtils.formatDate(prescription.prescribed_date);
    const expiryDate = prescription.expiry_date ? prescriptionUtils.formatDate(prescription.expiry_date) : null;
    const lastFilledDate = prescription.last_filled_date ? prescriptionUtils.formatDate(prescription.last_filled_date) : null;
    const createdAt = prescription.created_at ? prescriptionUtils.formatDate(prescription.created_at) : null;
    const updatedAt = prescription.updated_at ? prescriptionUtils.formatDate(prescription.updated_at) : null;

    const isExpired = prescriptionUtils.isExpired(prescription);
    const canRefill = prescriptionUtils.canRefill(prescription);
    const daysUntilExpiry = prescriptionUtils.getDaysUntilExpiry(prescription);

    const patientName = 'patient_name' in prescription ? prescription.patient_name : undefined;
    const practitionerName = 'practitioner_name' in prescription ? prescription.practitioner_name : undefined;
    const pharmacyName = 'pharmacy_name' in prescription ? prescription.pharmacy_name : undefined;

    useEffect(() => {
        prescriptionApi.getPrescriptionFulfillments(prescription.id).then((fulfillments) => {
            setFFulfillments(fulfillments || []);
        }).catch(() => {
            toast.error("Failed to load prescription fulfillments");
            setFFulfillments([]);
        });
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [prescription.id]);

    const handleCancel = () => {
        if (onCancel) {
            onCancel(prescription);
        }
    };

    return (
        <div className={className}>
            <Card additionalClassName="w-full" hasBorder>
                <div className="p-6">
                    {/* Header Section */}
                    <div className="flex items-start justify-between mb-6">
                        <div className="flex-1">
                            <h1 className="text-2xl font-bold text-base-content mb-2">
                                {prescription.medication_name}
                            </h1>
                            <div className="flex items-center gap-4">
                                <span className="text-lg font-medium text-base-content/70">
                                    Rx #{prescription.prescription_number}
                                </span>
                                <span className={`badge badge-lg ${statusColor} border-current`}>
                                    {prescription.status.toUpperCase()}
                                </span>
                                <span className="badge badge-outline">
                                    {prescriptionTypeLabel}
                                </span>
                                {prescription.is_controlled_substance && (
                                    <span className="badge badge-warning">
                                        Controlled Substance
                                    </span>
                                )}
                            </div>
                        </div>

                        {/* Action Buttons */}
                        <div className="flex gap-2">
                            <Button
                                buttonType="neutral"
                                onClick={() => window.history.back()}
                            >
                                Back to list
                            </Button>
                            <Button
                                buttonType="primary"
                                disabled={prescription.refills_remaining <= 0 || prescription.status === 'cancelled'}
                                onClick={() => navigate(`/pharmacist/prescriptions/${prescription.id}/fulfill`)}
                            >
                                {fulfillments ? 'Refill' : 'Fill Prescription'}
                            </Button>
                            {canCancel && (
                                <Button
                                    disabled={prescription.status === 'cancelled'}
                                    buttonType="error"
                                    onClick={handleCancel}
                                >
                                    Cancel
                                </Button>
                            )}
                        </div>
                    </div>

                    {/* Prescription Information Grid */}
                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 mb-6">
                        {/* Medication Details */}
                        <div className="space-y-4">
                            <h3 className="text-lg font-semibold text-base-content border-b border-base-300 pb-2">
                                Medication Details
                            </h3>

                            <div>
                                <label className="text-sm font-medium text-base-content/60 uppercase tracking-wide">
                                    Medication Name
                                </label>
                                <p className="text-base text-base-content mt-1">
                                    {prescription.medication_name}
                                </p>
                            </div>

                            {prescription.generic_name && (
                                <div>
                                    <label className="text-sm font-medium text-base-content/60 uppercase tracking-wide">
                                        Generic Name
                                    </label>
                                    <p className="text-base text-base-content mt-1">
                                        {prescription.generic_name}
                                    </p>
                                </div>
                            )}

                            {prescription.strength && (
                                <div>
                                    <label className="text-sm font-medium text-base-content/60 uppercase tracking-wide">
                                        Strength
                                    </label>
                                    <p className="text-base text-base-content mt-1">
                                        {prescription.strength}
                                    </p>
                                </div>
                            )}

                            {prescription.dosage_form && (
                                <div>
                                    <label className="text-sm font-medium text-base-content/60 uppercase tracking-wide">
                                        Dosage Form
                                    </label>
                                    <p className="text-base text-base-content mt-1">
                                        {prescription.dosage_form}
                                    </p>
                                </div>
                            )}
                        </div>

                        {/* Dosage and Instructions */}
                        <div className="space-y-4">
                            <h3 className="text-lg font-semibold text-base-content border-b border-base-300 pb-2">
                                Dosage & Instructions
                            </h3>

                            <div>
                                <label className="text-sm font-medium text-base-content/60 uppercase tracking-wide">
                                    Directions for Use
                                </label>
                                <p className="text-base text-base-content mt-1">
                                    {prescription.directions_for_use}
                                </p>
                            </div>

                            <div>
                                <label className="text-sm font-medium text-base-content/60 uppercase tracking-wide">
                                    Quantity
                                </label>
                                <p className="text-base text-base-content mt-1">
                                    {prescription.quantity}
                                </p>
                            </div>

                            {prescription.frequency && (
                                <div>
                                    <label className="text-sm font-medium text-base-content/60 uppercase tracking-wide">
                                        Frequency
                                    </label>
                                    <p className="text-base text-base-content mt-1">
                                        {prescription.frequency}
                                    </p>
                                </div>
                            )}

                            {prescription.days_supply && (
                                <div>
                                    <label className="text-sm font-medium text-base-content/60 uppercase tracking-wide">
                                        Days Supply
                                    </label>
                                    <p className="text-base text-base-content mt-1">
                                        {prescription.days_supply} days
                                    </p>
                                </div>
                            )}
                        </div>

                        {/* Prescription Status */}
                        <div className="space-y-4">
                            <h3 className="text-lg font-semibold text-base-content border-b border-base-300 pb-2">
                                Status & Refills
                            </h3>

                            <div>
                                <label className="text-sm font-medium text-base-content/60 uppercase tracking-wide">
                                    Status
                                </label>
                                <p className={`text-base mt-1 font-medium ${statusColor}`}>
                                    {prescription.status.charAt(0).toUpperCase() + prescription.status.slice(1)}
                                </p>
                            </div>

                            <div>
                                <label className="text-sm font-medium text-base-content/60 uppercase tracking-wide">
                                    Refills Authorized
                                </label>
                                <p className="text-base text-base-content mt-1">
                                    {prescription.refills_authorized}
                                </p>
                            </div>

                            <div>
                                <label className="text-sm font-medium text-base-content/60 uppercase tracking-wide">
                                    Refills Remaining
                                </label>
                                <p className="text-base text-base-content mt-1">
                                    {prescription.refills_remaining}
                                </p>
                            </div>

                            {canRefill && (
                                <div className="alert alert-success alert-sm">
                                    <span>Can be refilled</span>
                                </div>
                            )}

                            {isExpired && (
                                <div className="alert alert-error alert-sm">
                                    <span>Prescription expired</span>
                                </div>
                            )}

                            {daysUntilExpiry !== null && daysUntilExpiry > 0 && daysUntilExpiry <= 30 && (
                                <div className="alert alert-warning alert-sm">
                                    <span>Expires in {daysUntilExpiry} days</span>
                                </div>
                            )}
                        </div>
                    </div>

                    {/* People Involved */}
                    {(patientName || practitionerName || pharmacyName) && (
                        <div className="mb-6">
                            <h3 className="text-lg font-semibold text-base-content border-b border-base-300 pb-2 mb-4">
                                People Involved
                            </h3>
                            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                                {patientName && (
                                    <div>
                                        <label className="text-sm font-medium text-base-content/60 uppercase tracking-wide">
                                            Patient
                                        </label>
                                        <p className="text-base text-base-content mt-1">{patientName}</p>
                                    </div>
                                )}
                                {practitionerName && (
                                    <div>
                                        <label className="text-sm font-medium text-base-content/60 uppercase tracking-wide">
                                            Prescribed By
                                        </label>
                                        <p className="text-base text-base-content mt-1">{practitionerName}</p>
                                    </div>
                                )}
                                {pharmacyName && (
                                    <div>
                                        <label className="text-sm font-medium text-base-content/60 uppercase tracking-wide">
                                            Pharmacy
                                        </label>
                                        <p className="text-base text-base-content mt-1">{pharmacyName}</p>
                                    </div>
                                )}
                            </div>
                        </div>
                    )}

                    {/* Important Dates */}
                    <div className="mb-6">
                        <h3 className="text-lg font-semibold text-base-content border-b border-base-300 pb-2 mb-4">
                            Important Dates
                        </h3>
                        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
                            <div>
                                <label className="text-sm font-medium text-base-content/60 uppercase tracking-wide">
                                    Prescribed Date
                                </label>
                                <p className="text-base text-base-content mt-1">
                                    {prescribedDate}
                                </p>
                            </div>

                            {expiryDate && (
                                <div>
                                    <label className="text-sm font-medium text-base-content/60 uppercase tracking-wide">
                                        Expiry Date
                                    </label>
                                    <p className={`text-base mt-1 ${isExpired ? 'text-red-600' : 'text-base-content'}`}>
                                        {expiryDate}
                                    </p>
                                </div>
                            )}

                            {lastFilledDate && (
                                <div>
                                    <label className="text-sm font-medium text-base-content/60 uppercase tracking-wide">
                                        Last Filled
                                    </label>
                                    <p className="text-base text-base-content mt-1">
                                        {lastFilledDate}
                                    </p>
                                </div>
                            )}

                            {createdAt && (
                                <div>
                                    <label className="text-sm font-medium text-base-content/60 uppercase tracking-wide">
                                        Created
                                    </label>
                                    <p className="text-base text-base-content mt-1">
                                        {createdAt}
                                    </p>
                                </div>
                            )}
                        </div>
                    </div>

                    {/* Additional Information */}
                    {(prescription.indication || prescription.notes || prescription.dea_number || prescription.schedule_class) && (
                        <div className="mb-6">
                            <h3 className="text-lg font-semibold text-base-content border-b border-base-300 pb-2 mb-4">
                                Additional Information
                            </h3>
                            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                {prescription.indication && (
                                    <div>
                                        <label className="text-sm font-medium text-base-content/60 uppercase tracking-wide">
                                            Indication
                                        </label>
                                        <p className="text-base text-base-content mt-1">
                                            {prescription.indication}
                                        </p>
                                    </div>
                                )}

                                {prescription.notes && (
                                    <div>
                                        <label className="text-sm font-medium text-base-content/60 uppercase tracking-wide">
                                            Notes
                                        </label>
                                        <p className="text-base text-base-content mt-1">
                                            {prescription.notes}
                                        </p>
                                    </div>
                                )}

                                {prescription.dea_number && (
                                    <div>
                                        <label className="text-sm font-medium text-base-content/60 uppercase tracking-wide">
                                            DEA Number
                                        </label>
                                        <p className="text-base text-base-content mt-1">
                                            {prescription.dea_number}
                                        </p>
                                    </div>
                                )}

                                {prescription.schedule_class && (
                                    <div>
                                        <label className="text-sm font-medium text-base-content/60 uppercase tracking-wide">
                                            Schedule Class
                                        </label>
                                        <p className="text-base text-base-content mt-1">
                                            {prescription.schedule_class}
                                        </p>
                                    </div>
                                )}
                            </div>
                        </div>
                    )}

                    {/* Fulfillment History */}
                    {showFulfillments && fulfillments && fulfillments.length > 0 && (
                        <div>
                            <h3 className="text-lg font-semibold text-base-content border-b border-base-300 pb-2 mb-4">
                                Fulfillment History
                            </h3>
                            <div className="space-y-4">
                                {fulfillments.map((fulfillment) => (
                                    <FulfillmentItem
                                        key={fulfillment.id}
                                        fulfillment={fulfillment}
                                    />
                                ))}
                            </div>
                        </div>
                    )}

                    {/* System Information */}
                    {updatedAt && (
                        <div className="mt-6 pt-4 border-t border-base-300">
                            <p className="text-sm text-base-content/50">
                                Last updated: {updatedAt}
                            </p>
                        </div>
                    )}
                </div>
            </Card >
        </div >
    );
};

// Sub-component for fulfillment items
interface FulfillmentItemProps {
    fulfillment: PrescriptionFulfillment;
}

const FulfillmentItem: React.FC<FulfillmentItemProps> = ({ fulfillment }) => {
    const filledDate = prescriptionUtils.formatDate(fulfillment.filled_date);
    const pickupDate = fulfillment.pickup_date ? prescriptionUtils.formatDate(fulfillment.pickup_date) : null;

    return (
        <Card additionalClassName="bg-base-200">
            <div className="p-4">
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
                    <div>
                        <label className="text-xs font-medium text-base-content/60 uppercase tracking-wide">
                            Filled Date
                        </label>
                        <p className="text-sm text-base-content mt-1">{filledDate}</p>
                    </div>

                    <div>
                        <label className="text-xs font-medium text-base-content/60 uppercase tracking-wide">
                            Quantity Filled
                        </label>
                        <p className="text-sm text-base-content mt-1">{fulfillment.filled_quantity}</p>
                    </div>

                    {fulfillment.total_price && (
                        <div>
                            <label className="text-xs font-medium text-base-content/60 uppercase tracking-wide">
                                Total Price
                            </label>
                            <p className="text-sm text-base-content mt-1">${fulfillment.total_price.toFixed(2)}</p>
                        </div>
                    )}

                    {pickupDate && (
                        <div>
                            <label className="text-xs font-medium text-base-content/60 uppercase tracking-wide">
                                Pickup Date
                            </label>
                            <p className="text-sm text-base-content mt-1">{pickupDate}</p>
                        </div>
                    )}
                </div>

                {(fulfillment.dispensed_medication_name || fulfillment.manufacturer || fulfillment.lot_number) && (
                    <div className="mt-3 pt-3 border-t border-base-300">
                        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                            {fulfillment.dispensed_medication_name && (
                                <div>
                                    <label className="text-xs font-medium text-base-content/60 uppercase tracking-wide">
                                        Dispensed Medication
                                    </label>
                                    <p className="text-sm text-base-content mt-1">{fulfillment.dispensed_medication_name}</p>
                                </div>
                            )}

                            {fulfillment.manufacturer && (
                                <div>
                                    <label className="text-xs font-medium text-base-content/60 uppercase tracking-wide">
                                        Manufacturer
                                    </label>
                                    <p className="text-sm text-base-content mt-1">{fulfillment.manufacturer}</p>
                                </div>
                            )}

                            {fulfillment.lot_number && (
                                <div>
                                    <label className="text-xs font-medium text-base-content/60 uppercase tracking-wide">
                                        Lot Number
                                    </label>
                                    <p className="text-sm text-base-content mt-1">{fulfillment.lot_number}</p>
                                </div>
                            )}
                        </div>
                    </div>
                )}
            </div>
        </Card>
    );
};

export default PrescriptionDetail;
