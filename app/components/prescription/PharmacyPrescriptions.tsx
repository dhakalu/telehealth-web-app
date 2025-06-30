import { useCallback, useEffect, useState } from "react";
import { Link } from "react-router";
import Button from "../common/Button";
import Card from "../common/Card";
import { Input } from "../common/Input";
import {
    PrescriptionFilter,
    PrescriptionStatus,
    PrescriptionType,
    PrescriptionWithDetails,
} from "./types";

interface PharmacyPrescriptionsProps {
    pharmacyId: string;
    baseUrl: string;
    className?: string;
}

interface PrescriptionResponse {
    prescriptions: PrescriptionWithDetails[];
    total_count: number;
    limit: number;
    offset: number;
}

const prescriptionTypeLabels: Record<PrescriptionType, string> = {
    new: "New",
    refill: "Refill",
    renewal: "Renewal",
    substitution: "Substitution",
};

export default function PharmacyPrescriptions({
    pharmacyId,
    baseUrl,
    className = "",
}: PharmacyPrescriptionsProps) {
    const [prescriptions, setPrescriptions] = useState<PrescriptionWithDetails[]>([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);
    const [totalCount, setTotalCount] = useState(0);
    const [currentPage, setCurrentPage] = useState(1);
    const [filters, setFilters] = useState<PrescriptionFilter>({
        pharmacy_id: pharmacyId,
    });
    const [searchTerm, setSearchTerm] = useState("");

    const limit = 12; // Number of prescriptions per page

    const fetchPrescriptions = useCallback(async (page = 1, currentFilters = filters) => {
        setLoading(true);
        setError(null);

        try {
            const offset = (page - 1) * limit;
            const queryParams = new URLSearchParams({
                limit: limit.toString(),
                offset: offset.toString(),
                ...Object.fromEntries(
                    Object.entries(currentFilters).filter(([, value]) =>
                        value !== undefined && value !== null && value !== ""
                    )
                ),
            });

            const response = await fetch(`${baseUrl}/prescriptions?${queryParams}`);

            if (!response.ok) {
                throw new Error("Failed to fetch prescriptions");
            }

            const data: PrescriptionResponse = await response.json();
            setPrescriptions(data.prescriptions || []);
            setTotalCount(data.total_count || 0);
        } catch (err) {
            setError(err instanceof Error ? err.message : "Failed to fetch prescriptions");
            setPrescriptions([]);
        } finally {
            setLoading(false);
        }
    }, [baseUrl, filters]);

    useEffect(() => {
        fetchPrescriptions(currentPage, filters);
    }, [currentPage, filters, pharmacyId, fetchPrescriptions]);

    const handleFilterChange = (newFilters: Partial<PrescriptionFilter>) => {
        const updatedFilters = {
            ...filters,
            ...newFilters,
            pharmacy_id: pharmacyId, // Always include pharmacy_id
        };
        setFilters(updatedFilters);
        setCurrentPage(1);
    };

    const handleSearch = () => {
        handleFilterChange({
            medication_name: searchTerm || undefined,
        });
    };

    const clearFilters = () => {
        setFilters({ pharmacy_id: pharmacyId });
        setSearchTerm("");
        setCurrentPage(1);
    };

    const getStatusColor = (status: PrescriptionStatus): string => {
        switch (status) {
            case "pending":
                return "badge-warning";
            case "sent":
                return "badge-info";
            case "filled":
                return "badge-success";
            case "cancelled":
            case "rejected":
                return "badge-error";
            case "expired":
                return "badge-neutral";
            default:
                return "badge-neutral";
        }
    };

    const getPriorityBadge = (prescription: PrescriptionWithDetails) => {
        if (prescription.is_controlled_substance) {
            return (
                <div className="badge badge-error badge-sm">
                    <svg className="w-3 h-3 mr-1" fill="currentColor" viewBox="0 0 20 20">
                        <path fillRule="evenodd" d="M8.257 3.099c.765-1.36 2.722-1.36 3.486 0l5.58 9.92c.75 1.334-.213 2.98-1.742 2.98H4.42c-1.53 0-2.493-1.646-1.743-2.98l5.58-9.92zM11 13a1 1 0 11-2 0 1 1 0 012 0zm-1-8a1 1 0 00-1 1v3a1 1 0 002 0V6a1 1 0 00-1-1z" clipRule="evenodd" />
                    </svg>
                    Controlled
                </div>
            );
        }

        const expiry = prescription.expiry_date ? new Date(prescription.expiry_date) : null;
        const now = new Date();
        const daysUntilExpiry = expiry ? Math.ceil((expiry.getTime() - now.getTime()) / (1000 * 60 * 60 * 24)) : null;

        if (daysUntilExpiry !== null && daysUntilExpiry <= 7 && daysUntilExpiry > 0) {
            return (
                <div className="badge badge-warning badge-sm">
                    <svg className="w-3 h-3 mr-1" fill="currentColor" viewBox="0 0 20 20">
                        <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm1-12a1 1 0 10-2 0v4a1 1 0 00.293.707l2.828 2.829a1 1 0 101.415-1.415L11 9.586V6z" clipRule="evenodd" />
                    </svg>
                    Expires Soon
                </div>
            );
        }

        return null;
    };

    const formatDate = (dateString: string) => {
        return new Date(dateString).toLocaleDateString('en-US', {
            month: 'short',
            day: 'numeric',
            year: 'numeric',
        });
    };

    const handleSearchChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        setSearchTerm(e.target.value);
        // Debounce search - trigger search after 2 seconds of no typing
        const debounceTimer = setTimeout(() => {
            handleSearch();
        }, 2000);

        return () => clearTimeout(debounceTimer);
    }

    const totalPages = Math.ceil(totalCount / limit);


    return (
        <div className={`space-y-6 ${className}`}>
            {/* Header */}
            <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
                <div>
                    <h1 className="text-2xl font-bold text-base-content">Pharmacy Prescriptions</h1>
                    <p className="text-base-content/70 mt-1">
                        {totalCount} prescription{totalCount !== 1 ? 's' : ''} found
                    </p>
                </div>
            </div>

            {/* Filters */}
            <Card>
                <div className="space-y-4">
                    <h3 className="text-lg font-semibold text-base-content">Filters</h3>

                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
                        {/* Search by medication */}
                        <div className="flex gap-2 items-center justify-center">
                            <Input
                                label="Medication Name"
                                value={searchTerm}
                                onChange={handleSearchChange}
                                placeholder="Search medications..."
                                onKeyPress={(e: React.KeyboardEvent) => e.key === 'Enter' && handleSearch()}
                            />
                        </div>

                        {/* Status filter */}
                        <div className="mb-2">
                            <label className="block mb-1 font-medium">Status</label>
                            <select
                                className="select w-full"
                                value={filters.status || ""}
                                onChange={(e: React.ChangeEvent<HTMLSelectElement>) => handleFilterChange({
                                    status: e.target.value as PrescriptionStatus || undefined
                                })}
                            >
                                <option value="">All Statuses</option>
                                <option value="pending">Pending</option>
                                <option value="sent">Sent</option>
                                <option value="filled">Filled</option>
                                <option value="cancelled">Cancelled</option>
                                <option value="rejected">Rejected</option>
                                <option value="expired">Expired</option>
                            </select>
                        </div>

                        {/* Date from */}
                        <Input
                            label="Date From"
                            type="date"
                            value={filters.date_from || ""}
                            onChange={(e: React.ChangeEvent<HTMLInputElement>) => handleFilterChange({ date_from: e.target.value || undefined })}
                        />

                        {/* Date to */}
                        <Input
                            label="Date To"
                            type="date"
                            value={filters.date_to || ""}
                            onChange={(e: React.ChangeEvent<HTMLInputElement>) => handleFilterChange({ date_to: e.target.value || undefined })}
                        />
                    </div>

                    <div className="flex justify-end">
                        <Button
                            buttonType="neutral"
                            ghost
                            size="sm"
                            onClick={clearFilters}
                        >
                            Clear Filters
                        </Button>
                    </div>
                </div>
            </Card>

            {/* Error Message */}
            {error && (
                <div className="alert alert-error">
                    <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-2.5L13.732 4c-.77-.833-1.964-.833-2.732 0L3.732 16.5c-.77.833.192 2.5 1.732 2.5z" />
                    </svg>
                    <span>{error}</span>
                </div>
            )}

            {/* Prescription Cards */}
            {prescriptions.length > 0 ? (
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                    {prescriptions.map((prescription) => (
                        <Card
                            key={prescription.id}
                            size="md"
                            hasBorder
                            additionalClassName="hover:shadow-lg transition-shadow duration-200"
                        >
                            <div className="space-y-4">
                                {/* Header */}
                                <div className="flex justify-between items-start">
                                    <div className="flex-1">
                                        <h3 className="font-semibold text-base-content line-clamp-2">
                                            {prescription.medication_name}
                                            {prescription.strength && (
                                                <span className="text-base-content/70 ml-2">
                                                    {prescription.strength}
                                                </span>
                                            )}
                                        </h3>
                                        <p className="text-sm text-base-content/70">
                                            Rx# {prescription.prescription_number}
                                        </p>
                                    </div>
                                    <div className="flex flex-col gap-1">
                                        <div className={`badge ${getStatusColor(prescription.status)} badge-sm`}>
                                            {prescription.status}
                                        </div>
                                        {getPriorityBadge(prescription)}
                                    </div>
                                </div>

                                {/* Patient & Practitioner Info */}
                                <div className="space-y-2">
                                    <div className="flex items-center gap-2">
                                        <svg className="w-4 h-4 text-base-content/70" fill="currentColor" viewBox="0 0 20 20">
                                            <path fillRule="evenodd" d="M10 9a3 3 0 100-6 3 3 0 000 6zm-7 9a7 7 0 1114 0H3z" clipRule="evenodd" />
                                        </svg>
                                        <span className="text-sm text-base-content/70">
                                            Patient: {prescription.patient_name || "Unknown"}
                                        </span>
                                    </div>
                                    <div className="flex items-center gap-2">
                                        <svg className="w-4 h-4 text-base-content/70" fill="currentColor" viewBox="0 0 20 20">
                                            <path d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
                                        </svg>
                                        <span className="text-sm text-base-content/70">
                                            Dr. {prescription.practitioner_name || "Unknown"}
                                        </span>
                                    </div>
                                </div>

                                {/* Prescription Details */}
                                <div className="bg-base-200 rounded-lg p-3 space-y-2">
                                    <div className="flex justify-between text-sm">
                                        <span className="text-base-content/70">Type:</span>
                                        <span className="font-medium text-base-content">
                                            {prescriptionTypeLabels[prescription.prescription_type]}
                                        </span>
                                    </div>
                                    <div className="flex justify-between text-sm">
                                        <span className="text-base-content/70">Quantity:</span>
                                        <span className="font-medium text-base-content">
                                            {prescription.quantity} {prescription.dosage_form || "units"}
                                        </span>
                                    </div>
                                    <div className="flex justify-between text-sm">
                                        <span className="text-base-content/70">Refills:</span>
                                        <span className="font-medium text-base-content">
                                            {prescription.refills_remaining}/{prescription.refills_authorized}
                                        </span>
                                    </div>
                                    {prescription.days_supply && (
                                        <div className="flex justify-between text-sm">
                                            <span className="text-base-content/70">Days Supply:</span>
                                            <span className="font-medium text-base-content">
                                                {prescription.days_supply} days
                                            </span>
                                        </div>
                                    )}
                                </div>

                                {/* Directions */}
                                {prescription.directions_for_use && (
                                    <div className="space-y-1">
                                        <span className="text-sm font-medium text-base-content">Directions:</span>
                                        <p className="text-sm text-base-content/70 line-clamp-2">
                                            {prescription.directions_for_use}
                                        </p>
                                    </div>
                                )}

                                {/* Dates */}
                                <div className="flex justify-between text-xs text-base-content/60 pt-2 border-t border-base-300">
                                    <span>Prescribed: {formatDate(prescription.prescribed_date)}</span>
                                    {prescription.expiry_date && (
                                        <span>Expires: {formatDate(prescription.expiry_date)}</span>
                                    )}
                                </div>

                                {/* Actions */}
                                <div className="flex gap-2 pt-2">
                                    <Link
                                        to={`/prescriptions/${prescription.id}`}
                                        className="btn btn-primary btn-sm flex-1"
                                    >
                                        View Details
                                    </Link>
                                    {prescription.status === "sent" && (
                                        <Link
                                            to={`/prescriptions/${prescription.id}/fulfill`}
                                            className="btn btn-success btn-sm flex-1"
                                        >
                                            Fill Prescription
                                        </Link>
                                    )}
                                </div>
                            </div>
                        </Card>
                    ))}
                </div>
            ) : !loading ? (
                <Card>
                    <div className="text-center py-12">
                        <svg className="w-16 h-16 text-base-content/30 mx-auto mb-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
                        </svg>
                        <h3 className="text-lg font-medium text-base-content mb-2">No prescriptions found</h3>
                        <p className="text-base-content/70">
                            No prescriptions match your current filters. Try adjusting your search criteria.
                        </p>
                    </div>
                </Card>
            ) : null}

            {/* Pagination */}
            {totalPages > 1 && (
                <div className="flex justify-center">
                    <div className="join">
                        <Button
                            buttonType="neutral"
                            ghost
                            size="sm"
                            onClick={() => setCurrentPage(currentPage - 1)}
                            disabled={currentPage === 1}
                            className="join-item"
                        >
                            Previous
                        </Button>

                        {Array.from({ length: Math.min(5, totalPages) }, (_, i) => {
                            const page = i + 1;
                            return (
                                <Button
                                    key={page}
                                    buttonType={currentPage === page ? "primary" : "neutral"}
                                    ghost={currentPage !== page}
                                    size="sm"
                                    onClick={() => setCurrentPage(page)}
                                    className="join-item"
                                >
                                    {page}
                                </Button>
                            );
                        })}

                        <Button
                            buttonType="neutral"
                            ghost
                            size="sm"
                            onClick={() => setCurrentPage(currentPage + 1)}
                            disabled={currentPage === totalPages}
                            className="join-item"
                        >
                            Next
                        </Button>
                    </div>
                </div>
            )}

            {/* Loading overlay for subsequent loads */}
            {loading && prescriptions.length > 0 && (
                <div className="fixed inset-0 bg-black/20 backdrop-blur-sm flex items-center justify-center z-50">
                    <div className="bg-base-100 rounded-lg p-6 shadow-xl">
                        <span className="loading loading-spinner loading-lg text-primary"></span>
                        <p className="mt-2 text-base-content">Loading prescriptions...</p>
                    </div>
                </div>
            )}
        </div>
    );
}
