import React, { useCallback } from "react";
import AsyncSelect from 'react-select/async';

interface TypeAHeadSearchProps {
    url: string;
    placeholder?: string;
    label: string;
    value?: string; // Current value of the input
    error?: string;
    onSelect?: (value: string) => void;
    resultKey?: string; // Key to extract from API response (e.g., 'name', 'title')
    labelKey?: string; // Key to display in the dropdown (e.g., 'name', 'title')
    minQueryLength?: number; // Minimum characters before making API call
}

const TypeAHeadSearch: React.FC<TypeAHeadSearchProps> = ({
    url,
    label,
    error,
    onSelect,
    value = '',
    labelKey,
    resultKey = "name",
    minQueryLength = 2,
}) => {

    const [isLoading, setIsLoading] = React.useState(false);
    // Debounced API call function
    const fetchSuggestions = useCallback(async (searchQuery: string) => {
        if (searchQuery.trim().length < minQueryLength) {
            return [];
        }
        setIsLoading(true);

        try {
            const searchUrl = `${url}?q=${encodeURIComponent(searchQuery)}`;
            const response = await fetch(searchUrl);

            if (!response.ok) {
                return []
            }

            const data = await response.json();

            // Extract suggestions from response
            let newSuggestions: {
                label: string;
                value: string;
            }[] = [];
            if (Array.isArray(data)) {
                newSuggestions = data.map((item: unknown) =>
                    typeof item === 'string' ? {
                        label: item,
                        value: item
                    } : {
                        label: (item as Record<string, unknown>)[labelKey || resultKey] as string || '',
                        value: (item as Record<string, unknown>)[resultKey] as string || ''
                    }
                ).filter(Boolean);
            } else if (data.results && Array.isArray(data.results)) {
                newSuggestions = data.results.map((item: unknown) =>
                    typeof item === 'string' ? {
                        label: item,
                        value: item
                    } : {
                        label: (item as Record<string, unknown>)[labelKey || resultKey] as string || '',
                        value: (item as Record<string, unknown>)[resultKey] as string || ''
                    }
                ).filter(Boolean);
            }

            return newSuggestions;
        } catch (error) {
            console.error('Error fetching suggestions:', error);
            return []
        } finally {
            setIsLoading(false);
        }
    }, [minQueryLength, url, labelKey, resultKey]);

    const loadOptions = (
        inputValue: string,
        callback: (options: { label: string; value: string; }[]) => void
    ) => {
        setTimeout(async () => {
            const suggestions = await fetchSuggestions(inputValue);
            callback(suggestions || []);
        }, 1000);
    };

    return (
        <div className="w-full max-w-xs">
            <label className="block mb-1 font-medium">
                <span>{label}</span>
                {error && <span className="label-text-alt text-error">{error}</span>}
            </label>
            <AsyncSelect
                cacheOptions
                isLoading={isLoading}
                loadOptions={loadOptions}
                defaultOptions
                isClearable
                onChange={(selectedOption) => onSelect?.(selectedOption?.value || '')}
                value={value ? { label: value, value } : null}
            />
        </div>
    );
};

export default TypeAHeadSearch;