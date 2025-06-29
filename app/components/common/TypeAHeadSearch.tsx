import React, { useEffect, useRef, useState } from "react";
import { Input } from "./Input";

interface TypeAHeadSearchProps {
    suggestions: string[];
    placeholder?: string;
    label: string;
    error?: string;
    onSelect?: (value: string) => void;
}

const TypeAHeadSearch: React.FC<TypeAHeadSearchProps> = ({
    suggestions,
    placeholder = "Search...",
    label,
    error,
    onSelect,
}) => {
    const [query, setQuery] = useState("");
    const [filtered, setFiltered] = useState<string[]>([]);
    const [showDropdown, setShowDropdown] = useState(false);
    const [highlighted, setHighlighted] = useState(-1);
    const inputRef = useRef<HTMLInputElement>(null);

    useEffect(() => {
        if (query.trim() === "") {
            setFiltered([]);
            setShowDropdown(false);
            return;
        }
        const filteredSuggestions = suggestions.filter((s) =>
            s.toLowerCase().includes(query.toLowerCase())
        );
        setFiltered(filteredSuggestions);
        setShowDropdown(filteredSuggestions.length > 0);
        setHighlighted(-1);
    }, [query, suggestions]);

    const handleSelect = (value: string) => {
        setQuery(value);
        setShowDropdown(false);
        if (onSelect) onSelect(value);
    };

    const handleKeyDown = (e: React.KeyboardEvent<HTMLInputElement>) => {
        if (!showDropdown) return;
        if (e.key === "ArrowDown") {
            setHighlighted((prev) => Math.min(prev + 1, filtered.length - 1));
        } else if (e.key === "ArrowUp") {
            setHighlighted((prev) => Math.max(prev - 1, 0));
        } else if (e.key === "Enter" && highlighted >= 0) {
            handleSelect(filtered[highlighted]);
        } else if (e.key === "Escape") {
            setShowDropdown(false);
        }
    };

    const handleBlur = () => {
        setTimeout(() => setShowDropdown(false), 100);
    };

    return (
        <div className="relative w-full max-w-xs">
            <Input
                ref={inputRef}
                type="text"
                label={label}
                error={error}
                placeholder={placeholder}
                value={query}
                onChange={(e) => setQuery(e.target.value)}
                onFocus={() => setShowDropdown(filtered.length > 0)}
                onKeyDown={handleKeyDown}
                onBlur={handleBlur}
                autoComplete="off"
                wrapperClass="mb-0"
            />
            {showDropdown && (
                <ul className="absolute left-0 right-0 mt-1 z-10 menu menu-compact shadow rounded-box">
                    {filtered.map((item, idx) => (
                        <li
                            key={item}
                            className={`cursor-pointer ${highlighted === idx ? "outline outline-2 outline-primary" : ""}`}
                            onMouseDown={() => handleSelect(item)}
                            onMouseEnter={() => setHighlighted(idx)}
                        >
                            {item}
                        </li>
                    ))}
                </ul>
            )}
        </div>
    );
};

export default TypeAHeadSearch;