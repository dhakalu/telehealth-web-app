import { User } from "~/routes/provider/complete-profile";
import AppHeader from "../common/AppHeader";

export type ProviderHeaderProps = {
    user?: User;
}

export const ProviderHeader = ({ user }: ProviderHeaderProps) => {
    return (
        <AppHeader links={[
            {
                label: "Patient",
                href: "/provider/patients"
            },
            {
                label: "Calendar",
                href: "/provider/calendar"
            },
            {
                label: "Help & Support",
                href: "/help"
            }
        ]}
            user={user}
        />
    )
}