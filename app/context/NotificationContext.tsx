import React, { createContext, ReactNode, useCallback, useContext, useState } from 'react';

export type NotificationType = 'success' | 'error' | 'info' | 'warning';

export interface Notification {
    id: string;
    message: string;
    type: NotificationType;
    autoClose?: boolean;
    duration?: number; // Duration in ms
}

interface NotificationContextType {
    notifications: Notification[];
    showNotification: (message: string, type: NotificationType, autoClose?: boolean, duration?: number) => void;
    removeNotification: (id: string) => void;
}

const NotificationContext = createContext<NotificationContextType | undefined>(undefined);

export const useNotifications = () => {
    const context = useContext(NotificationContext);
    if (!context) {
        throw new Error('useNotifications must be used within a NotificationProvider');
    }
    return context;
};

interface NotificationProviderProps {
    children: ReactNode;
}

export const NotificationProvider: React.FC<NotificationProviderProps> = ({ children }) => {
    const [notifications, setNotifications] = useState<Notification[]>([]);

    // Function to generate a unique ID
    const generateId = () => {
        return Date.now().toString() + Math.random().toString(36).substr(2, 9);
    };

    // Add a new notification
    const showNotification = useCallback((
        message: string,
        type: NotificationType = 'info',
        autoClose: boolean = type === 'success',
        duration: number = 5000
    ) => {
        const id = generateId();

        setNotifications(prev => [...prev, { id, message, type, autoClose, duration }]);

        // Auto-close notification if enabled
        if (autoClose) {
            setTimeout(() => {
                setNotifications(prev => prev.filter(notification => notification.id !== id));
            }, duration);
        }
    }, []);

    // Remove a notification by ID
    const removeNotification = useCallback((id: string) => {
        setNotifications(prev => prev.filter(notification => notification.id !== id));
    }, []);

    const value = {
        notifications,
        showNotification,
        removeNotification,
    };

    return (
        <NotificationContext.Provider value={value}>
            {children}
        </NotificationContext.Provider>
    );
};
