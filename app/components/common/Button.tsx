import { ReactNode, Ref } from "react";

export type ButtonType = "primary" | "secondary" | "danger" | "secondaryReversed" | "parimaryReversed" | "accent" | "accentReversed";

export interface ButtonProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
    children: ReactNode;
    buttonType?: ButtonType;
    ref?: Ref<HTMLButtonElement>
}

export default function Button({ children, buttonType = "primary", ...props }: ButtonProps) {

    const buttonClass = {

        "primary": "btn btn-primary",
        "secondary": "btn btn-secondary",
        "secondaryReversed": "btn btn-soft btn-secondary",
        "parimaryReversed": "btn btn-soft btn-primary",
        "accent": "btn btn-accent",
        "accentReversed": "btn soft btn-accent",
        "danger": "btn btn-error"
    };

    return (
        <button className={buttonClass[buttonType]} {...props} >{children}</button>
    )
}