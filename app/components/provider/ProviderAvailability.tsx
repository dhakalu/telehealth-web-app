import axios from 'axios';
import { useEffect, useState } from 'react';
import { createDateTimeFromStrings, formatDateToLongDay, formatTimeToAmPm } from '../../utils/dateUtils';

// Define types
interface AvailabilitySlot {
    date: string;
    times: string[];
}

interface ProviderAvailabilityProps {
    providerId: string;
    baseUrl: string;
    onSelectTimeSlot?: (date: Date) => void;
}

export function ProviderAvailability({ providerId, onSelectTimeSlot, baseUrl }: ProviderAvailabilityProps) {
    const [availabilityData, setAvailabilityData] = useState<AvailabilitySlot[]>([]);
    const [loading, setLoading] = useState<boolean>(true);
    const [error, setError] = useState<string | null>(null);
    const [visibleDates, setVisibleDates] = useState<number>(3); // Number of dates to show initially

    useEffect(() => {
        const fetchAvailability = async () => {
            try {
                setLoading(true);
                const response = await axios.get(
                    `${baseUrl}/appointments/provider/${providerId}/availability`
                );
                setAvailabilityData(response.data);
                setError(null);
            } catch (err) {
                console.error('Error fetching provider availability:', err);
                setError('Failed to load availability. Please try again later.');
            } finally {
                setLoading(false);
            }
        };

        if (providerId) {
            fetchAvailability();
        }
    }, [baseUrl, providerId]);

    // Handle time selection
    const handleTimeClick = (dateTime: Date) => {
        if (onSelectTimeSlot) {
            onSelectTimeSlot(dateTime);
        }
    };

    // Show more dates
    const handleShowMore = () => {
        setVisibleDates(prevValue => prevValue + 3);
    };

    // These functions are now imported from dateUtils.ts

    if (loading) {
        return (
            <div className="flex justify-center items-center h-40">
                <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-info"></div>
            </div>
        );
    }

    if (error) {
        return (
            <div className="border border-error/30 text-error rounded-md p-4 mt-4">
                <p>{error}</p>
            </div>
        );
    }

    if (availabilityData.length === 0) {
        return (
            <div className="border border-warning/30 text-warning rounded-md p-4 mt-4">
                <p>No availability found for this provider in the next month.</p>
            </div>
        );
    }

    // Get the visible subset of availability data
    const visibleAvailabilityData = availabilityData.slice(0, visibleDates);

    return (
        <div className="rounded-lg my-4">
            {/* Calendar View */}
            <div className="space-y-6">
                {visibleAvailabilityData.map((slot) => {
                    const [date] = slot.date.split('T');
                    return (
                        <div key={slot.date} className="border border-base/20 rounded-lg p-4">
                            <h3 className="text-lg font-medium text-base mb-3">
                                {formatDateToLongDay(slot.date)}
                            </h3>

                            {slot.times.length === 0 ? (
                                <p className="text-base/60 italic">No available time slots for this date.</p>
                            ) : (
                                <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-6 gap-2">
                                    {slot.times.map((time) => {
                                        const dateTime = createDateTimeFromStrings(date, time);
                                        return (
                                            <button
                                                key={`${slot.date}-${time}`}
                                                onClick={() => handleTimeClick(dateTime)}
                                                className="border border-base/20 hover:opacity-80 text-info py-2 px-3 rounded-md text-sm transition-colors"
                                            >
                                                {formatTimeToAmPm(dateTime)}
                                            </button>
                                        )
                                    })}
                                </div>
                            )}
                        </div>
                    );
                })}
            </div>

            {/* Show more button */}
            {visibleDates < availabilityData.length && (
                <div className="mt-6 flex justify-center">
                    <button
                        onClick={handleShowMore}
                        className="border border-base/20 hover:opacity-80 text-base font-medium py-2 px-4 rounded-md transition-colors"
                    >
                        Show More Dates
                    </button>
                </div>
            )}
        </div>
    );
}
