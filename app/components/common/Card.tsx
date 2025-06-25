import { ReactNode } from "react";

export default function Card({ children }: { children: ReactNode }) {
    return (<div className="card bg-base-100 card-border border-base-300 card-sm">
        <div className="card-body gap-4">
            {children}
        </div>
    </div>)
}