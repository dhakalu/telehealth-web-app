import { useNotifications } from "../context/NotificationContext";

// A simple hook to easily show notifications in components
export function useToast() {
    const { showNotification } = useNotifications();

    return {
        /**
         * Show a success notification that auto-dismisses
         */
        success: (message: string, duration: number = 5000) =>
            showNotification(message, 'success', true, duration),

        /**
         * Show an error notification that requires manual dismissal
         */
        error: (message: string) =>
            showNotification(message, 'error', false),

        /**
         * Show an info notification
         */
        info: (message: string, autoClose: boolean = false, duration: number = 5000) =>
            showNotification(message, 'info', autoClose, duration),

        /**
         * Show a warning notification
         */
        warning: (message: string, autoClose: boolean = false, duration: number = 5000) =>
            showNotification(message, 'warning', autoClose, duration),
    };
}
