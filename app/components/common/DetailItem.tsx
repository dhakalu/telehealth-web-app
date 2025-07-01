import React from "react";

export interface DetailItemProps {
    /** The label to display */
    label: string;
    /** The value to display */
    value: string;
    /** Maximum number of lines for text overflow (default: 1) */
    maxLines?: number;
    /** Additional CSS classes for the container */
    className?: string;
}

/**
 * Reusable component for displaying label-value pairs with consistent styling.
 * Used across patient resource components for uniform data presentation.
 */
export const DetailItem: React.FC<DetailItemProps> = ({
    label,
    value,
    maxLines = 1,
    className = ""
}) => (
    <div className={className}>
        <span className="text-xs font-medium text-base-content/60 uppercase tracking-wide">
            {label}
        </span>
        <p
            className="text-sm text-base-content opacity-80 mt-1 overflow-hidden"
            style={maxLines > 1 ? {
                display: '-webkit-box',
                WebkitLineClamp: maxLines,
                WebkitBoxOrient: 'vertical'
            } : undefined}
        >
            {value}
        </p>
    </div>
);

export default DetailItem;
