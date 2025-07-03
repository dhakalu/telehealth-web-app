/**
 * Notification API Module
 * 
 * This module exports the notification API client and related types.
 * It provides a centralized access point for all notification-related API operations.
 * 
 * @example
 * ```typescript
 * import { notificationApi } from '~/api/notification';
 * 
 * // Get user notifications
 * const notifications = await notificationApi.getUserNotifications('user-123');
 * 
 * // Mark notification as read
 * await notificationApi.markAsRead('notification-456', 'user-123');
 * 
 * // Get unread count
 * const { unread_count } = await notificationApi.getUnreadCount('user-123');
 * 
 * // Create a notification (admin)
 * const notification = await notificationApi.createNotification({
 *   user_id: 'user-123',
 *   type: 'system',
 *   title: 'Welcome',
 *   body: 'Welcome to the platform!'
 * });
 * ```
 */

export { notificationApi } from './requests';

export type {
    BulkNotificationRequest, BulkNotificationResult,
    // Request types
    CreateNotificationRequest, DeliveryChannel,
    DeliveryStatus,
    // Query parameter types
    GetNotificationsParams, GetNotificationsResponse, GetPreferencesResponse, GetTemplatesParams, GetTemplatesResponse,
    // Core interfaces
    Notification, NotificationDelivery, NotificationPreference, NotificationPriority,
    // Response types
    NotificationResponse, NotificationStatus, NotificationTemplate,
    // Type enums
    NotificationType, SendNotificationRequest, UnreadCountResponse, UpdatePreferenceRequest, Variables
} from './types';

export {
    DELIVERY_CHANNEL,
    DELIVERY_STATUS, NOTIFICATION_PRIORITY,
    NOTIFICATION_STATUS,
    // Constants for type checking and validation
    NOTIFICATION_TYPE
} from './types';

// Default export for convenience
export { default } from './requests';

