import { ReactNode } from "react";

export default function Card({ children, size = "md", hasBorder = false, additionalClassName = "" }: { children: ReactNode, size?: "sm" | "md" | "lg", hasBorder?: boolean, additionalClassName?: string }) {

    return (<div className={`card bg-base-100  card-${size} ${hasBorder ? "card-border border-base-300" : ""} ${additionalClassName}`}>
        <div className="card-body gap-4">
            {children}
        </div>
    </div>)
}