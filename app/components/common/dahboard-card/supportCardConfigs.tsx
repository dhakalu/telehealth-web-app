import { DashboardCardConfig } from "./SupportDashboardCard";

// Helper function to create link content
export const createLinkContent = (text: string, href: string) => (
    <a href={href} className="text-blue-600 hover:text-blue-800">
        {text}
    </a>
);

// Predefined icon components for consistency
export const SupportIcons = {
    tickets: (
        <svg fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M20 13V6a2 2 0 00-2-2H6a2 2 0 00-2 2v7m16 0v5a2 2 0 01-2 2H6a2 2 0 01-2 2v-5m16 0h-2M4 13h2m13-8V4a1 1 0 00-1-1h-4" />
        </svg>
    ),
    team: (
        <svg fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 4.354a4 4 0 110 5.292M15 21H3v-1a6 6 0 0112 0v1zm0 0h6v-1a6 6 0 00-9-5.197m13.5-9a2.5 2.5 0 11-5 0 2.5 2.5 0 015 0z" />
        </svg>
    ),
    organizations: (
        <svg fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M19 21V5a2 2 0 00-2-2H7a2 2 0 00-2 2v16m14 0h2m-2 0h-5m-9 0H3m2 0h5M9 7h1m-1 4h1m4-4h1m-1 4h1m-5 10v-5a1 1 0 011-1h2a1 1 0 011 1v5m-4 0h4" />
        </svg>
    ),
    analytics: (
        <svg fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z" />
        </svg>
    ),
    notifications: (
        <svg fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M15 17h5l-5 5v-5zM4 8a8 8 0 1116 0c0 7-3 9-8 9s-8-2-8-9zM9 21a3 3 0 006 0" />
        </svg>
    ),
    settings: (
        <svg fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M10.325 4.317c.426-1.756 2.924-1.756 3.35 0a1.724 1.724 0 002.573 1.066c1.543-.94 3.31.826 2.37 2.37a1.724 1.724 0 001.065 2.572c1.756.426 1.756 2.924 0 3.35a1.724 1.724 0 00-1.066 2.573c.94 1.543-.826 3.31-2.37 2.37a1.724 1.724 0 00-2.572 1.065c-.426 1.756-2.924 1.756-3.35 0a1.724 1.724 0 00-2.573-1.066c-1.543.94-3.31-.826-2.37-2.37a1.724 1.724 0 00-1.065-2.572c-1.756-.426-1.756-2.924 0-3.35a1.724 1.724 0 001.066-2.573c-.94-1.543.826-3.31 2.37-2.37.996.608 2.296.07 2.572-1.065z" />
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
        </svg>
    ),
};

// Predefined card configurations
export const supportCards: DashboardCardConfig[] = [
    {
        title: "Support Tickets",
        content: "Coming Soon",
        iconBgColor: "bg-blue-100",
        iconColor: "text-blue-600",
        icon: SupportIcons.tickets,
    },
    {
        title: "Team Management",
        href: "/support/team-management",
        linkText: "View Team",
        iconBgColor: "bg-green-100",
        iconColor: "text-green-600",
        icon: SupportIcons.team,
    },
    {
        title: "Organizations",
        href: "/support/manage-organizations",
        linkText: "Manage Organizations",
        iconBgColor: "bg-purple-100",
        iconColor: "text-purple-600",
        icon: SupportIcons.organizations,
    },
    {
        title: "Notification Templates",
        href: "/support/notification-templates",
        linkText: "Manage Templates",
        iconBgColor: "bg-indigo-100",
        iconColor: "text-indigo-600",
        icon: SupportIcons.notifications,
    },
    {
        title: "Reports & Analytics",
        content: "Coming Soon",
        iconBgColor: "bg-yellow-100",
        iconColor: "text-yellow-600",
        icon: SupportIcons.analytics,
    },
];

// Example of how easy it is to add a new card:
// Just add to the array above:
// {
//     title: "System Settings",
//     href: "/support/settings",
//     linkText: "Configure System",
//     iconBgColor: "bg-gray-100",
//     iconColor: "opacity-60",
//     icon: SupportIcons.settings,
// },

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
