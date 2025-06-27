import axios from 'axios';
import React, { useState } from 'react';
import { useToast } from '../../hooks/useToast';
import { formatDateForApi, formatDateToLongDay, formatTimeToAmPm, getDatePlus30Minutes } from '../../utils/dateUtils';
import Button from '../common/Button';
import { ProviderAvailability } from './ProviderAvailability';

interface BookAppointmentProps {
    providerId: string;
    patientId: string;
    onAppointmentBooked?: (appointmentId: string) => void;
    baseUrl: string;
}

export function BookAppointment({ providerId, patientId, onAppointmentBooked, baseUrl }: BookAppointmentProps) {
    const [selectedDate, setSelectedDate] = useState<Date | null>(null);
    const [title, setTitle] = useState<string>('');
    const [description, setDescription] = useState<string>('');
    const [loading, setLoading] = useState<boolean>(false);
    const [error, setError] = useState<string | null>(null);
    const toast = useToast();

    const handleTimeSlotSelect = (dateTime: Date) => {
        setSelectedDate(dateTime);
        setError(null); // Clear any existing errors when a date is selected
    };

    const clearSelectedDate = () => {
        setSelectedDate(null);
        setTitle('');
        setDescription('');
        setError(null); // Clear any existing errors
    }

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();

        if (!selectedDate) {
            setError('Please select a date and time for your appointment');
            return;
        }

        if (!title.trim()) {
            setError('Please provide a reason for your appointment');
            return;
        }

        // Clear any existing errors when proceeding with submission
        setError(null);

        try {
            setLoading(true);
            // Create end date (30 minutes later)
            const endDate = getDatePlus30Minutes(selectedDate);

            const appointmentData = {
                patient_id: patientId,
                provider_id: providerId,
                title,
                description,
                time_range: [formatDateForApi(selectedDate), formatDateForApi(endDate)],
                status: "booked"
            };

            const response = await axios.post(
                `${baseUrl}/appointments`,
                appointmentData
            );

            toast.success('Appointment scheduled successfully!');

            if (onAppointmentBooked && response.data && response.data.id) {
                onAppointmentBooked(response.data.id);
            }

            clearSelectedDate();

        } catch (err) {
            console.error('Error booking appointment:', err);
            const errorMessage = axios.isAxiosError(err) && err.response?.data?.error
                ? err.response.data.error
                : 'Failed to book appointment. Please try again.';
            setError(errorMessage);
        } finally {
            setLoading(false);
        }
    };

    return (
        <div>
            {!selectedDate ? (
                // Show availability selection when no time slot is selected
                <ProviderAvailability
                    providerId={providerId}
                    baseUrl={baseUrl}
                    onSelectTimeSlot={handleTimeSlotSelect}
                />
            ) : (
                // Show booking form when a time slot is selected
                <form onSubmit={handleSubmit} className="space-y-4">
                    <div className="flex justify-between items-center mb-4">
                        <h3 className="text-lg font-medium">
                            Book appointment for: {formatDateToLongDay(selectedDate as Date)} at {formatTimeToAmPm(selectedDate as Date)}
                        </h3>

                    </div>

                    <div>
                        <label htmlFor="title" className="block text-sm font-medium text-base mb-1">
                            Appointment Reason
                        </label>
                        <input
                            type="text"
                            id="title"
                            value={title}
                            onChange={(e) => setTitle(e.target.value)}
                            className="w-full p-2 border border-base/20 rounded-md"
                            placeholder="e.g. Annual check-up, Flu symptoms"
                            required
                        />
                    </div>

                    <div>
                        <label htmlFor="description" className="block text-sm font-medium text-base mb-1">
                            Additional Notes (optional)
                        </label>
                        <textarea
                            id="description"
                            value={description}
                            onChange={(e) => setDescription(e.target.value)}
                            className="w-full p-2 border border-base/20 rounded-md"
                            rows={3}
                            placeholder="Please provide any additional information that may be helpful"
                        />
                    </div>

                    {error && (
                        <div className="bg-error text-error-content p-3">
                            {error}
                        </div>
                    )}

                    <div className="flex gap-4 mt-6">
                        <Button
                            buttonType='secondary'
                            soft
                            type="button"
                            onClick={clearSelectedDate}
                        >
                            Pick Another Time
                        </Button>
                        <Button
                            type="submit"
                            disabled={loading}
                            isLoading={loading}
                        >
                            Book Appointment
                        </Button>
                    </div>
                </form>
            )}
        </div>
    );
}
