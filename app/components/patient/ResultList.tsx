import React, { useEffect, useState } from "react";
import type { Result } from "~/api/patient";
import { patientApi, patientUtils } from "~/api/patient";
import Card from "~/components/common/Card";
import { ResultItem } from "./ResultItem";
import {
    EmptyState,
    ErrorState,
    LoadingState,
    ResourceListHeader,
    ShowMoreSection,
    type BasePatientResourceListProps
} from "./shared/PatientResourceList";

export interface ResultListProps extends BasePatientResourceListProps {
    /** Callback when a result is clicked */
    onResultClick?: (result: Result) => void;
}

export const ResultList: React.FC<ResultListProps> = ({
    patientId,
    maxItems = 10,
    showHeader = true,
    title = "Test Results",
    className = "",
    showDetails = true,
    onViewAll,
    onResultClick
}) => {
    const [results, setResults] = useState<Result[]>([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);

    // Fetch results for the patient
    useEffect(() => {
        const fetchResults = async () => {
            if (!patientId) return;

            try {
                setLoading(true);
                const resultData = await patientApi.getResults(patientId);

                // Filter out deleted results and sort by test date
                const activeResults = patientUtils.filterActive(resultData);
                const sortedResults = patientUtils.sortResultsByDate(activeResults);

                setResults(sortedResults);
                setError(null);
            } catch (err) {
                console.error('Error fetching results:', err);
                setError('Failed to load test results');
            } finally {
                setLoading(false);
            }
        };

        fetchResults();
    }, [patientId]);

    // Group results by type and status for better organization
    const groupedResults = patientUtils.groupResultsByType(results);
    const statusGroups = patientUtils.groupResultsByStatus(results);
    const displayedResults = results.slice(0, maxItems);
    const hasMoreResults = results.length > maxItems;

    // Statistics
    const totalResults = results.length;
    const abnormalResults = (statusGroups.abnormal?.length || 0) + (statusGroups.high?.length || 0) + (statusGroups.low?.length || 0);

    const handleRetry = () => {
        window.location.reload();
    };

    return (
        <div className={`mt-6 ${className}`}>
            {/* Header with title and statistics */}
            {showHeader && (
                <ResourceListHeader
                    title={title}
                    totalCount={totalResults}
                    activeCount={abnormalResults}
                    hasMore={hasMoreResults}
                    onViewAll={onViewAll}
                />
            )}

            {/* Loading state */}
            {loading && <LoadingState message="Loading test results..." />}

            {/* Error state */}
            {error && <ErrorState error={error} onRetry={handleRetry} />}

            {/* Empty state */}
            {!loading && !error && results.length === 0 && (
                <EmptyState
                    title="No Test Results Found"
                    description="No test results have been recorded for this patient yet."
                />
            )}

            {/* Results grid */}
            {!loading && !error && results.length > 0 && (
                <div className="space-y-4">
                    {/* Responsive grid layout with uniform heights */}
                    <div className="grid grid-cols-1 md:grid-cols-2 h-full lg:grid-cols-3 gap-4 items-start">
                        {displayedResults.map((result) => (
                            <ResultItem
                                key={result.id}
                                result={result}
                                showDetails={showDetails}
                                onClick={onResultClick}
                                className="h-full"
                            />
                        ))}
                    </div>

                    {/* Show more button */}
                    {hasMoreResults && onViewAll && (
                        <ShowMoreSection
                            currentCount={maxItems}
                            totalCount={results.length}
                            onViewAll={onViewAll}
                        />
                    )}

                    {/* Test type breakdown */}
                    {showHeader && Object.keys(groupedResults).length > 1 && (
                        <Card additionalClassName="mt-6">
                            <div className="p-4">
                                <h3 className="text-sm font-medium text-base-content/70 mb-3">
                                    Test Types Breakdown
                                </h3>
                                <div className="flex flex-wrap gap-2">
                                    {Object.entries(groupedResults).map(([type, resultList]) => (
                                        <div
                                            key={type}
                                            className="flex items-center gap-2 text-sm"
                                        >
                                            <div className={`w-3 h-3 rounded-full ${patientUtils.getResultTypeColor(type).replace('text-', 'bg-')}`}></div>
                                            <span className="capitalize">{type.replace('_', ' ')}: {resultList.length}</span>
                                        </div>
                                    ))}
                                </div>
                            </div>
                        </Card>
                    )}

                    {/* Status breakdown */}
                    {showHeader && Object.keys(statusGroups).length > 1 && (
                        <Card additionalClassName="mt-6">
                            <div className="p-4">
                                <h3 className="text-sm font-medium text-base-content/70 mb-3">
                                    Results Status Summary
                                </h3>
                                <div className="flex flex-wrap gap-2">
                                    {Object.entries(statusGroups).map(([status, resultList]) => (
                                        <div
                                            key={status}
                                            className="flex items-center gap-2 text-sm"
                                        >
                                            <div className={`w-3 h-3 rounded-full ${patientUtils.getResultStatusColor(status as 'normal' | 'high' | 'low' | 'abnormal' | 'unknown').replace('text-', 'bg-')}`}></div>
                                            <span className="capitalize">{status}: {resultList.length}</span>
                                        </div>
                                    ))}
                                </div>
                            </div>
                        </Card>
                    )}

                    {/* Latest results by category */}
                    {showHeader && results.length > 0 && (
                        <Card additionalClassName="mt-6">
                            <div className="p-4">
                                <h3 className="text-sm font-medium text-base-content/70 mb-3">
                                    Latest Results by Category
                                </h3>
                                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                                    {Object.entries(groupedResults).slice(0, 6).map(([type, resultList]) => {
                                        const latestResult = resultList[0]; // Already sorted by date
                                        const status = patientUtils.getResultStatus(latestResult.value, latestResult.reference_range);
                                        const statusColor = patientUtils.getResultStatusColor(status);

                                        return (
                                            <div key={type} className="text-center">
                                                <p className="text-xs font-medium text-base-content/60 uppercase tracking-wide">
                                                    {type.replace('_', ' ')}
                                                </p>
                                                <p className={`text-lg font-semibold mt-1 ${statusColor}`}>
                                                    {latestResult.value} {latestResult.unit}
                                                </p>
                                                <p className="text-xs text-base-content/50">
                                                    {latestResult.reference_range && `Normal: ${latestResult.reference_range}`}
                                                </p>
                                                <p className="text-xs text-base-content/50">
                                                    {patientUtils.formatDate(latestResult.result_date || latestResult.created_at || '')}
                                                </p>
                                            </div>
                                        );
                                    })}
                                </div>
                            </div>
                        </Card>
                    )}
                </div>
            )}
        </div>
    );
};

export default ResultList;
