/**
 * Notification API Types
 * 
 * This file contains all TypeScript types and interfaces for notification-related data structures.
 * These types correspond to the Go backend notification models.
 */

// Notification Type - matches Go NotificationType
export type NotificationType =
    | "prescription"
    | "appointment"
    | "medical"
    | "system"
    | "communication"
    | "billing";

export const NOTIFICATION_TYPE: Record<string, NotificationType> = {
    PRESCRIPTION: "prescription",
    APPOINTMENT: "appointment",
    MEDICAL: "medical",
    SYSTEM: "system",
    COMMUNICATION: "communication",
    BILLING: "billing",
} as const;

// Notification Priority - matches Go NotificationPriority
export type NotificationPriority =
    | "low"
    | "normal"
    | "high"
    | "urgent";

export const NOTIFICATION_PRIORITY: Record<string, NotificationPriority> = {
    LOW: "low",
    NORMAL: "normal",
    HIGH: "high",
    URGENT: "urgent",
} as const;

// Notification Status - matches Go NotificationStatus
export type NotificationStatus =
    | "pending"
    | "sent"
    | "delivered"
    | "read"
    | "failed";

export const NOTIFICATION_STATUS: Record<string, NotificationStatus> = {
    PENDING: "pending",
    SENT: "sent",
    DELIVERED: "delivered",
    READ: "read",
    FAILED: "failed",
} as const;

// Delivery Channel - matches Go DeliveryChannel
export type DeliveryChannel =
    | "in_app"
    | "email"
    | "sms"
    | "push";

export const DELIVERY_CHANNEL: Record<string, DeliveryChannel> = {
    IN_APP: "in_app",
    EMAIL: "email",
    SMS: "sms",
    PUSH: "push",
} as const;

// Delivery Status - matches Go DeliveryStatus
export type DeliveryStatus =
    | "pending"
    | "sent"
    | "delivered"
    | "failed"
    | "bounced";

export const DELIVERY_STATUS: Record<string, DeliveryStatus> = {
    PENDING: "pending",
    SENT: "sent",
    DELIVERED: "delivered",
    FAILED: "failed",
    BOUNCED: "bounced",
} as const;

// Variables type for template variables and metadata
export type Variables = Record<string, string | number | boolean | null>;

// Base Notification interface - matches Go Notification struct
export interface Notification {
    /** Unique identifier for the notification */
    id: string;
    /** User ID the notification belongs to */
    user_id: string;
    /** Template ID if created from template */
    template_id: string | null;
    /** Type of notification */
    type: NotificationType;
    /** Notification title */
    title: string;
    /** Notification content/body */
    content: string;
    /** Priority level */
    priority: NotificationPriority;
    /** Current status */
    status: NotificationStatus;
    /** When the notification is scheduled to be sent */
    scheduled_at: string;
    /** When the notification was sent */
    sent_at: string | null;
    /** When the notification was read */
    read_at: string | null;
    /** Additional metadata */
    metadata: Variables | null;
    /** When the notification was created */
    created_at: string;
    /** When the notification was last updated */
    updated_at: string;
}

// Notification Template interface - matches Go NotificationTemplate struct
export interface NotificationTemplate {
    /** Unique identifier for the template */
    id: string;
    /** Template name */
    name: string;
    /** Type of notification this template is for */
    type: NotificationType;
    /** Subject line for the notification */
    subject: string;
    /** Template content with variable placeholders */
    content_template: string;
    /** Available variables for this template */
    variables: Variables | null;
    /** Whether the template is active */
    is_active: boolean;
    /** When the template was created */
    created_at: string;
    /** When the template was last updated */
    updated_at: string;
}

// Notification Preference interface - matches Go NotificationPreference struct
export interface NotificationPreference {
    /** Unique identifier for the preference */
    id: string;
    /** User ID the preference belongs to */
    user_id: string;
    /** Type of notification this preference applies to */
    type: NotificationType;
    /** Enabled delivery channels */
    channels: DeliveryChannel[];
    /** Whether notifications of this type are enabled */
    enabled: boolean;
    /** Start of quiet hours (no notifications) */
    quiet_hours_start: string | null;
    /** End of quiet hours */
    quiet_hours_end: string | null;
    /** User's timezone */
    timezone: string;
    /** When the preference was created */
    created_at: string;
    /** When the preference was last updated */
    updated_at: string;
}

// Notification Delivery interface - matches Go NotificationDelivery struct
export interface NotificationDelivery {
    /** Unique identifier for the delivery */
    id: string;
    /** Notification ID this delivery belongs to */
    notification_id: string;
    /** Delivery channel used */
    channel: DeliveryChannel;
    /** Recipient address (email, phone, etc.) */
    recipient: string;
    /** Delivery status */
    status: DeliveryStatus;
    /** When the delivery was sent */
    sent_at: string | null;
    /** When the delivery was confirmed delivered */
    delivered_at: string | null;
    /** When the delivery failed */
    failed_at: string | null;
    /** Error message if delivery failed */
    error_message: string | null;
    /** Number of delivery attempts */
    attempts: number;
    /** Additional metadata for the delivery */
    metadata: Variables | null;
    /** When the delivery record was created */
    created_at: string;
    /** When the delivery record was last updated */
    updated_at: string;
}

// Request types for API calls

// Create Notification Request - matches Go CreateNotificationRequest struct
export interface CreateNotificationRequest {
    /** User ID to send notification to */
    user_id: string;
    /** Type of notification */
    type: NotificationType;
    /** Notification title */
    title: string;
    /** Notification body/content */
    body: string;
    /** Priority level (defaults to "normal") */
    priority?: NotificationPriority;
    /** When to schedule the notification */
    scheduled_at?: string;
    /** Template variables if using a template */
    variables?: Variables;
    /** Additional metadata */
    metadata?: Variables;
}

// Bulk Notification Request - matches Go BulkNotificationRequest struct
export interface BulkNotificationRequest {
    /** Array of user IDs to send notification to */
    user_ids: string[];
    /** Type of notification */
    type: NotificationType;
    /** Notification title */
    title: string;
    /** Notification body/content */
    body: string;
    /** Priority level (defaults to "normal") */
    priority?: NotificationPriority;
    /** When to schedule the notification */
    scheduled_at?: string;
    /** Template variables */
    variables?: Variables;
    /** Additional metadata */
    metadata?: Variables;
}

// Send Notification Request - matches Go SendNotificationRequest struct
export interface SendNotificationRequest {
    /** User ID to send notification to */
    user_id: string;
    /** Template name to use */
    template_name: string;
    /** Template variables */
    variables?: Variables;
    /** Priority level */
    priority?: NotificationPriority;
    /** When to schedule the notification */
    scheduled_at?: string;
    /** Additional metadata */
    metadata?: Variables;
}

// Update Preference Request - matches Go UpdatePreferenceRequest struct
export interface UpdatePreferenceRequest {
    /** Type of notification to update preference for */
    type: NotificationType;
    /** Enabled delivery channels */
    channels?: DeliveryChannel[];
    /** Whether notifications of this type are enabled */
    enabled?: boolean;
    /** Start of quiet hours */
    quiet_hours_start?: string;
    /** End of quiet hours */
    quiet_hours_end?: string;
    /** User's timezone */
    timezone?: string;
}

// Response types

// Notification Response - matches Go NotificationResponse struct
export interface NotificationResponse {
    /** ID of the created notification */
    notification_id: string;
    /** Status of the operation */
    status: string;
    /** Optional message */
    message?: string;
}

// Bulk Notification Result - response from bulk notification endpoint
export interface BulkNotificationResult {
    /** Number of notifications successfully created */
    successful_count: number;
    /** Number of notifications that failed */
    failed_count: number;
    /** Array of notification IDs that were created */
    notification_ids: string[];
    /** Array of any errors that occurred */
    errors?: string[];
}

// Get Notifications Response - paginated list of notifications
export interface GetNotificationsResponse {
    /** Array of notifications */
    notifications: Notification[];
    /** Pagination information */
    pagination: {
        /** Current limit */
        limit: number;
        /** Current offset */
        offset: number;
        /** Total count of notifications */
        total_count: number;
        /** Whether there are more notifications */
        has_more: boolean;
    };
}

// Get Templates Response - list of templates
export interface GetTemplatesResponse {
    /** Array of notification templates */
    templates: NotificationTemplate[];
}

// Get Preferences Response - user's notification preferences
export interface GetPreferencesResponse {
    /** Array of notification preferences */
    preferences: NotificationPreference[];
}

// Unread Count Response - count of unread notifications
export interface UnreadCountResponse {
    /** Number of unread notifications */
    unread_count: number;
}

// Query parameters for getting notifications
export interface GetNotificationsParams {
    /** User ID to get notifications for */
    user_id: string;
    /** Limit number of results (max 100, default 20) */
    limit?: number;
    /** Offset for pagination */
    offset?: number;
    /** Filter by unread notifications only */
    unread_only?: boolean;
    /** Filter by notification type */
    type?: NotificationType;
    /** Filter by notification status */
    status?: NotificationStatus;
    /** Filter by priority */
    priority?: NotificationPriority;
}

// Query parameters for getting templates
export interface GetTemplatesParams {
    /** Filter templates by type */
    type?: NotificationType;
}
