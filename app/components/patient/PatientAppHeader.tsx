import { User } from "~/routes/provider/complete-profile";
import AppHeader from "../common/AppHeader";

export type PatientAppHeaderProps = {
    user?: User;
}

export const PatientAppHeader = ({ user }: PatientAppHeaderProps) => {
    return (
        <AppHeader links={[

            {
                label: "My Health",
                href: `/patient/my-health`,
            },
            {
                label: "My Providers",
                href: "/patient/providers"
            },
            {
                label: "Find Doctors",
                href: "/patient/find-doctors"
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