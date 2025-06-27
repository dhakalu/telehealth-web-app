import React from 'react';
import { Notification, useNotifications } from '../../context/NotificationContext';
import Button from './Button';

// Individual notification component
const NotificationItem: React.FC<{ notification: Notification }> = ({ notification }) => {
    const { removeNotification } = useNotifications();

    const getBgColor = () => {
        switch (notification.type) {
            case 'success':
                return 'bg-success text-success-content';
            case 'error':
                return 'bg-error text-error-content';
            case 'warning':
                return 'bg-warning text-warning-content';
            case 'info':
            default:
                return 'bg-info text-info-content';
        }
    };

    return (
        <div
            className={`flex items-center justify-between p-4 mb-3 rounded-lg shadow-lg min-w-[300px] max-w-md ${getBgColor()} transition-all transform animate-slideIn`}
            role="alert"
        >
            <div className="flex-1 mr-2">
                {notification.message}
            </div>
            <Button
                ghost
                buttonType="default"
                onClick={() => removeNotification(notification.id)}
                aria-label="Close notification"
            >
                x
            </Button>
        </div>
    );
};

// Container for all notifications
export const NotificationsContainer: React.FC = () => {
    const { notifications } = useNotifications();

    if (notifications.length === 0) return null;

    return (
        <div
            aria-live="assertive"
            className="fixed bottom-4 right-4 z-50 flex flex-col items-end space-y-2"
        >
            {notifications.map(notification => (
                <NotificationItem key={notification.id} notification={notification} />
            ))}
        </div>
    );
};
