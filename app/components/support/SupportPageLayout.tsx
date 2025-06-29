import { ReactNode } from "react";

interface BreadcrumbItem {
    label: string;
    href?: string;
    icon?: ReactNode;
}

interface SupportPageLayoutProps {
    title: string;
    subtitle?: string;
    children: ReactNode;
    headerActions?: ReactNode;
    breadcrumbs?: BreadcrumbItem[];
    error?: string | null;
    onErrorDismiss?: () => void;
    loading?: boolean;
    loadingMessage?: string;
}

export default function SupportPageLayout({
    title,
    subtitle,
    children,
    headerActions,
    breadcrumbs,
    error,
    onErrorDismiss,
    loading = false,
    loadingMessage = "Loading..."
}: SupportPageLayoutProps) {
    if (loading) {
        return (
            <div className="min-h-screen bg-gray-50 flex items-center justify-center">
                <div className="text-center">
                    <div className="animate-spin rounded-full h-32 w-32 border-b-2 border-blue-600 mx-auto"></div>
                    <p className="mt-4 text-gray-600">{loadingMessage}</p>
                </div>
            </div>
        );
    }

    return (
        <div className="min-h-screen bg-gray-50">
            {/* Header */}
            <header className="bg-white shadow">
                <div className="max-w-7xl mx-auto py-6 px-4 sm:px-6 lg:px-8">
                    <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between">
                        <div className="flex-1 min-w-0">
                            <h1 className="text-3xl font-bold text-gray-900">{title}</h1>
                            {subtitle && (
                                <p className="mt-1 text-sm text-gray-500">{subtitle}</p>
                            )}
                        </div>
                        {(headerActions || breadcrumbs) && (
                            <div className="mt-4 lg:mt-0 lg:ml-4">
                                {breadcrumbs && (
                                    <nav className="flex mb-4 lg:mb-0" aria-label="Breadcrumb">
                                        <ol className="flex items-center space-x-4">
                                            {breadcrumbs.map((item, index) => (
                                                <li key={index}>
                                                    {index === 0 ? (
                                                        <div>
                                                            {item.href ? (
                                                                <a href={item.href} className="text-gray-400 hover:text-gray-500">
                                                                    {item.icon || (
                                                                        <svg className="flex-shrink-0 h-5 w-5" xmlns="http://www.w3.org/2000/svg" fill="currentColor" viewBox="0 0 20 20" aria-hidden="true">
                                                                            <path d="M10.707 2.293a1 1 0 00-1.414 0l-9 9a1 1 0 001.414 1.414L10 4.414l8.293 8.293a1 1 0 001.414-1.414l-9-9z" />
                                                                        </svg>
                                                                    )}
                                                                    <span className="sr-only">{item.label}</span>
                                                                </a>
                                                            ) : (
                                                                <span className="text-gray-400">
                                                                    {item.icon}
                                                                    <span className="sr-only">{item.label}</span>
                                                                </span>
                                                            )}
                                                        </div>
                                                    ) : (
                                                        <div className="flex items-center">
                                                            <svg className="flex-shrink-0 h-5 w-5 text-gray-300" xmlns="http://www.w3.org/2000/svg" fill="currentColor" viewBox="0 0 20 20" aria-hidden="true">
                                                                <path d="M5.555 17.776l8-16 .894.448-8 16-.894-.448z" />
                                                            </svg>
                                                            {item.href ? (
                                                                <a href={item.href} className="ml-4 text-sm font-medium text-gray-500 hover:text-gray-700">
                                                                    {item.label}
                                                                </a>
                                                            ) : (
                                                                <span className="ml-4 text-sm font-medium text-gray-500" aria-current="page">
                                                                    {item.label}
                                                                </span>
                                                            )}
                                                        </div>
                                                    )}
                                                </li>
                                            ))}
                                        </ol>
                                    </nav>
                                )}
                                {headerActions && (
                                    <div className="flex items-center space-x-3">
                                        {headerActions}
                                    </div>
                                )}
                            </div>
                        )}
                    </div>
                </div>
            </header>

            {/* Main content */}
            <main className="max-w-7xl mx-auto py-6 sm:px-6 lg:px-8">
                <div className="px-4 py-6 sm:px-0">
                    {/* Error Banner */}
                    {error && (
                        <div className="mb-6 bg-red-50 border border-red-200 rounded-md p-4">
                            <div className="flex">
                                <div className="flex-shrink-0">
                                    <svg className="h-5 w-5 text-red-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                                    </svg>
                                </div>
                                <div className="ml-3">
                                    <h3 className="text-sm font-medium text-red-800">Error</h3>
                                    <p className="mt-1 text-sm text-red-700">{error}</p>
                                </div>
                                {onErrorDismiss && (
                                    <div className="ml-auto pl-3">
                                        <button
                                            onClick={onErrorDismiss}
                                            className="inline-flex text-red-400 hover:text-red-600"
                                        >
                                            <svg className="h-4 w-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M6 18L18 6M6 6l12 12" />
                                            </svg>
                                        </button>
                                    </div>
                                )}
                            </div>
                        </div>
                    )}

                    {/* Page Content */}
                    {children}
                </div>
            </main>
        </div>
    );
}
