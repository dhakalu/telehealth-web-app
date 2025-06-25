import { User } from "~/routes/provider/complete-profile";
import { Avatar } from "../common/Avatar";

export type Establishment = {
    id: string;
    providerId: string;
    patientId: string;
    patient: User,
    provider: User,
}

export type EstablishmentListProps = {
    establishments: Establishment[],
    onSelect: (item: Establishment) => void,
    selectedEstablishmentId: string | null
}

const getNames = (establishment: Establishment) => {
    const { family_name, given_name } = establishment.patient;
    return [`${given_name} ${family_name}`, `${given_name?.[0]}${family_name?.[0]}`]
}

export default function EstablishmentList({ establishments, onSelect, selectedEstablishmentId }: EstablishmentListProps) {
    return (
        <div>
            <h2 className="text-lg font-bold p-4">Current Patients</h2>
            {establishments && establishments.length > 0 ? (
                <ul className="list">
                    {establishments.map((establishment) => {
                        const [name, initials] = getNames(establishment)
                        return (
                            <li
                                key={establishment.id}
                                className={`list-row rounded-none cursor-pointer items-center ${selectedEstablishmentId === establishment.id ? "bg-base-100" : "hover:bg-base-100"}`}
                                onClick={() => onSelect(establishment)}
                            >
                                <Avatar initials={initials} src={""} />
                                <div>{name}</div>
                            </li>
                        )
                    })}
                </ul>
            ) : (
                <div className="mt-8 text-center opacity-60">No active patients</div>
            )}
        </div>
    )
}