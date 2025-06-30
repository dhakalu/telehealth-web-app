import clsx from "clsx";
import { ReactNode } from "react";

export default function Card({ children, size = "md", hasBorder = false, additionalClassName = "" }: { children: ReactNode, size?: "sm" | "md" | "lg", hasBorder?: boolean, additionalClassName?: string }) {


    const className = clsx({
        "card": true,
        [`card-${size}`]: true,
        "card-border": hasBorder,
        [`${additionalClassName}`]: additionalClassName,
    });


    return (<div className={className}>
        <div className="card-body gap-4">
            {children}
        </div>
    </div>)
}