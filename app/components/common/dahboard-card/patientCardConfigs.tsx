import { DashboardCardConfig } from "./SupportDashboardCard";

// Helper function to create link content
export const createLinkContent = (text: string, href: string) => (
    <a href={href} className="text-blue-600 hover:text-blue-800">
        {text}
    </a>
);

// Predefined icon components for patient dashboard
export const PatientIcons = {
    health: (
        <svg fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M4.318 6.318a4.5 4.5 0 000 6.364L12 20.364l7.682-7.682a4.5 4.5 0 00-6.364-6.364L12 7.636l-1.318-1.318a4.5 4.5 0 00-6.364 0z" />
        </svg>
    ),
    findDoctors: (
        <svg fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
        </svg>
    ),
    myDoctors: (
        <svg fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
        </svg>
    ),
    institution: (
        <svg fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M19 21V5a2 2 0 00-2-2H7a2 2 0 00-2 2v16m14 0h2m-2 0h-5m-9 0H3m2 0h5M9 7h1m-1 4h1m4-4h1m-1 4h1m-5 10v-5a1 1 0 011-1h2a1 1 0 011 1v5m-4 0h4" />
        </svg>
    ),
    appointment: (
        <svg fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
        </svg>
    ),
};

// Predefined card configurations for patient dashboard
export const patientCards: DashboardCardConfig[] = [
    {
        title: "My Health",
        href: "/patient/my-health",
        linkText: "View Health Records",
        iconBgColor: "bg-red-100",
        iconColor: "text-red-600",
        icon: PatientIcons.health,
    },
    {
        title: "Find Doctors",
        href: "/patient/find-doctors",
        linkText: "Search Providers",
        iconBgColor: "bg-blue-100",
        iconColor: "text-blue-600",
        icon: PatientIcons.findDoctors,
    },
    {
        title: "My Doctors",
        href: "/patient/providers",
        linkText: "View My Providers",
        iconBgColor: "bg-green-100",
        iconColor: "text-green-600",
        icon: PatientIcons.myDoctors,
    },
    {
        title: "Appointments",
        linkText: "View Appointments",
        iconBgColor: "bg-purple-100",
        iconColor: "text-purple-600",
        icon: PatientIcons.appointment,
    },
    {
        title: "Institutions",
        linkText: "View Institutions",
        iconBgColor: "bg-yellow-100",
        iconColor: "text-yellow-600",
        icon: PatientIcons.institution,
    },
];

// Helper function to convert config to card props
export const configToCardProps = (config: DashboardCardConfig) => ({
    title: config.title,
    content: config.href && config.linkText
        ? createLinkContent(config.linkText, config.href)
        : config.content || "Coming Soon",
    icon: config.icon,
    iconBgColor: config.iconBgColor,
    iconColor: config.iconColor,
    href: config.href,
});
