import { DashboardCardConfig } from "~/components/common/dahboard-card/SupportDashboardCard";

// Helper function to create link content
export const createLinkContent = (text: string, href: string) => (
    <a href={href} className="text-blue-600 hover:text-blue-800">
        {text}
    </a>
);

// Predefined icon components for patient health dashboard
export const PatientHealthIcons = {
    prescription: (
        <svg fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
        </svg>
    ),
    healthCondition: (
        <svg fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M4.318 6.318a4.5 4.5 0 000 6.364L12 20.364l7.682-7.682a4.5 4.5 0 00-6.364-6.364L12 7.636l-1.318-1.318a4.5 4.5 0 00-6.364 0z" />
        </svg>
    ),
    procedure: (
        <svg fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M19.428 15.428a2 2 0 00-1.022-.547l-2.387-.477a6 6 0 00-3.86.517l-.318.158a6 6 0 01-3.86.517L6.05 15.21a2 2 0 00-1.806.547M8 4h8l-1 1v5.172a2 2 0 00.586 1.414l5 5c1.26 1.26.367 3.414-1.415 3.414H4.828c-1.782 0-2.674-2.154-1.414-3.414l5-5A2 2 0 009 10.172V5L8 4z" />
        </svg>
    ),
    medication: (
        <svg fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M19.428 15.428a2 2 0 00-1.022-.547l-2.387-.477a6 6 0 00-3.86.517l-.318.158a6 6 0 01-3.86.517L6.05 15.21a2 2 0 00-1.806.547M8 4h8l-1 1v5.172a2 2 0 00.586 1.414l5 5c1.26 1.26.367 3.414-1.415 3.414H4.828c-1.782 0-2.674-2.154-1.414-3.414l5-5A2 2 0 009 10.172V5L8 4z" />
        </svg>
    ),
    allergy: (
        <svg fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z" />
        </svg>
    ),
    immunization: (
        <svg fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M7 12l3-3 3 3 4-4M8 21l4-4 4 4M3 4h18M4 4h16v12a1 1 0 01-1 1H5a1 1 0 01-1-1V4z" />
        </svg>
    ),
    familyHealth: (
        <svg fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0zm6 3a2 2 0 11-4 0 2 2 0 014 0zM7 10a2 2 0 11-4 0 2 2 0 014 0z" />
        </svg>
    ),
    vital: (
        <svg fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M4.318 6.318a4.5 4.5 0 000 6.364L12 20.364l7.682-7.682a4.5 4.5 0 00-6.364-6.364L12 7.636l-1.318-1.318a4.5 4.5 0 00-6.364 0z" />
        </svg>
    ),
    result: (
        <svg fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z" />
        </svg>
    ),
};

// Predefined card configurations for patient health dashboard
export const patientHealthCards: DashboardCardConfig[] = [
    {
        title: "Prescriptions",
        href: "/patient/my-health/prescriptions",
        linkText: "View Prescriptions",
        iconBgColor: "bg-blue-100",
        iconColor: "text-blue-600",
        icon: PatientHealthIcons.prescription,
    },
    {
        title: "Health Conditions",
        href: "/patient/my-health/health-conditions",
        linkText: "View Conditions",
        iconBgColor: "bg-red-100",
        iconColor: "text-red-600",
        icon: PatientHealthIcons.healthCondition,
    },
    {
        title: "Procedures",
        href: "/patient/my-health/procedures",
        linkText: "View Procedures",
        iconBgColor: "bg-purple-100",
        iconColor: "text-purple-600",
        icon: PatientHealthIcons.procedure,
    },
    {
        title: "Medications",
        href: "/patient/my-health/medication",
        linkText: "View Medications",
        iconBgColor: "bg-green-100",
        iconColor: "text-green-600",
        icon: PatientHealthIcons.medication,
    },
    {
        title: "Allergies",
        href: "/patient/my-health/allergies",
        linkText: "View Allergies",
        iconBgColor: "bg-yellow-100",
        iconColor: "text-yellow-600",
        icon: PatientHealthIcons.allergy,
    },
    {
        title: "Immunizations",
        href: "/patient/my-health/immunizations",
        linkText: "View Immunizations",
        iconBgColor: "bg-teal-100",
        iconColor: "text-teal-600",
        icon: PatientHealthIcons.immunization,
    },
    {
        title: "Family Health",
        href: "/patient/my-health/family-health-conditions",
        linkText: "View Family History",
        iconBgColor: "bg-indigo-100",
        iconColor: "text-indigo-600",
        icon: PatientHealthIcons.familyHealth,
    },
    {
        title: "Vitals",
        href: "/patient/my-health/vitals",
        linkText: "View Vitals",
        iconBgColor: "bg-pink-100",
        iconColor: "text-pink-600",
        icon: PatientHealthIcons.vital,
    },
    {
        title: "Results",
        href: "/patient/my-health/results",
        linkText: "View Results",
        iconBgColor: "bg-orange-100",
        iconColor: "text-orange-600",
        icon: PatientHealthIcons.result,
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
