/**
 * Notification API Client
 * 
 * This module provides a comprehensive API client for notification-related operations.
 * It includes functions for managing notifications, preferences, and templates.
 * 
 * Features:
 * - Full TypeScript support with proper types
 * - Axios-based HTTP client
 * - Support for all notification endpoints
 * - User and admin endpoints
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
 * // Create a notification (admin)
 * const notification = await notificationApi.createNotification({
 *   user_id: 'user-123',
 *   type: 'system',
 *   title: 'Welcome',
 *   body: 'Welcome to the platform!'
 * });
 * ```
 */

import axios, { AxiosResponse } from 'axios';
import { API_BASE_URL } from "../../api";
import type {
    BulkNotificationRequest,
    BulkNotificationResult,
    CreateNotificationRequest,
    GetNotificationsParams,
    GetNotificationsResponse,
    GetPreferencesResponse,
    GetTemplatesParams,
    GetTemplatesResponse,
    Notification,
    NotificationPreference,
    NotificationTemplate,
    UnreadCountResponse,
    UpdatePreferenceRequest,
} from './types';

/**
 * Notification API client with methods for all notification operations
 */
export const notificationApi = {
    // User Notification Endpoints

    /**
     * Get notifications for a user
     * @param userId - User ID to get notifications for
     * @param params - Query parameters for filtering and pagination
     * @returns Promise resolving to paginated notifications response
     */
    async getUserNotifications(
        userId: string,
        params: Omit<GetNotificationsParams, 'user_id'> = {}
    ): Promise<GetNotificationsResponse> {
        const queryParams = new URLSearchParams({
            user_id: userId,
            ...(params.limit && { limit: params.limit.toString() }),
            ...(params.offset && { offset: params.offset.toString() }),
            ...(params.unread_only && { unread_only: params.unread_only.toString() }),
            ...(params.type && { type: params.type }),
            ...(params.status && { status: params.status }),
            ...(params.priority && { priority: params.priority }),
        });

        const response: AxiosResponse<GetNotificationsResponse> = await axios.get(
            `${API_BASE_URL}/notifications?${queryParams.toString()}`
        );
        return response.data;
    },

    /**
     * Get a specific notification by ID
     * @param notificationId - Notification ID
     * @param userId - User ID (for ownership verification)
     * @returns Promise resolving to the notification
     */
    async getNotification(notificationId: string, userId: string): Promise<Notification> {
        const response: AxiosResponse<Notification> = await axios.get(
            `${API_BASE_URL}/notifications/${encodeURIComponent(notificationId)}?user_id=${userId}`
        );
        return response.data;
    },

    /**
     * Mark a notification as read
     * @param notificationId - Notification ID to mark as read
     * @param userId - User ID (for ownership verification)
     * @returns Promise resolving to success response
     */
    async markAsRead(notificationId: string, userId: string): Promise<{ status: string }> {
        const response: AxiosResponse<{ status: string }> = await axios.patch(
            `${API_BASE_URL}/notifications/${encodeURIComponent(notificationId)}/read?user_id=${userId}`
        );
        return response.data;
    },

    /**
     * Mark all notifications as read for a user
     * @param userId - User ID
     * @returns Promise resolving to success response
     */
    async markAllAsRead(userId: string): Promise<{ status: string }> {
        const response: AxiosResponse<{ status: string }> = await axios.patch(
            `${API_BASE_URL}/notifications/read-all?user_id=${userId}`
        );
        return response.data;
    },

    /**
     * Delete a notification
     * @param notificationId - Notification ID to delete
     * @param userId - User ID (for ownership verification)
     * @returns Promise resolving to success response
     */
    async deleteNotification(notificationId: string, userId: string): Promise<{ status: string }> {
        const response: AxiosResponse<{ status: string }> = await axios.delete(
            `${API_BASE_URL}/notifications/${encodeURIComponent(notificationId)}?user_id=${userId}`
        );
        return response.data;
    },

    /**
     * Get count of unread notifications for a user
     * @param userId - User ID
     * @returns Promise resolving to unread count
     */
    async getUnreadCount(userId: string): Promise<UnreadCountResponse> {
        const response: AxiosResponse<UnreadCountResponse> = await axios.get(
            `${API_BASE_URL}/notifications/unread-count?user_id=${userId}`
        );
        return response.data;
    },

    // User Preference Endpoints

    /**
     * Get notification preferences for a user
     * @param userId - User ID
     * @returns Promise resolving to user preferences
     */
    async getUserPreferences(userId: string): Promise<GetPreferencesResponse> {
        const response: AxiosResponse<GetPreferencesResponse> = await axios.get(
            `${API_BASE_URL}/notifications/preferences?user_id=${userId}`
        );
        return response.data;
    },

    /**
     * Update a notification preference for a user
     * @param userId - User ID
     * @param request - Preference update request
     * @returns Promise resolving to updated preference
     */
    async updateUserPreference(
        userId: string,
        request: UpdatePreferenceRequest
    ): Promise<NotificationPreference> {
        const response: AxiosResponse<NotificationPreference> = await axios.put(
            `${API_BASE_URL}/notifications/preferences?user_id=${userId}`,
            request
        );
        return response.data;
    },

    // Admin Notification Endpoints

    /**
     * Create a notification (admin endpoint)
     * @param request - Create notification request
     * @returns Promise resolving to created notification
     */
    async createNotification(request: CreateNotificationRequest): Promise<Notification> {
        const response: AxiosResponse<Notification> = await axios.post(
            `${API_BASE_URL}/admin/notifications`,
            request
        );
        return response.data;
    },

    /**
     * Send a bulk notification to multiple users (admin endpoint)
     * @param request - Bulk notification request
     * @returns Promise resolving to bulk operation result
     */
    async sendBulkNotification(request: BulkNotificationRequest): Promise<BulkNotificationResult> {
        const response: AxiosResponse<BulkNotificationResult> = await axios.post(
            `${API_BASE_URL}/admin/notifications/bulk`,
            request
        );
        return response.data;
    },

    // Admin Template Endpoints

    /**
     * Get notification templates (admin endpoint)
     * @param params - Query parameters for filtering templates
     * @returns Promise resolving to templates response
     */
    async getTemplates(params: GetTemplatesParams = {}): Promise<GetTemplatesResponse> {
        const queryParams = new URLSearchParams({
            ...(params.type && { type: params.type }),
        });

        const url = queryParams.toString()
            ? `${API_BASE_URL}/admin/notifications/templates?${queryParams.toString()}`
            : `${API_BASE_URL}/admin/notifications/templates`;

        const response: AxiosResponse<GetTemplatesResponse> = await axios.get(url);
        return response.data;
    },

    /**
     * Get a specific notification template (admin endpoint)
     * @param templateName - Template name
     * @returns Promise resolving to the template
     */
    async getTemplate(templateName: string): Promise<NotificationTemplate> {
        const response: AxiosResponse<NotificationTemplate> = await axios.get(
            `${API_BASE_URL}/admin/notifications/templates/${encodeURIComponent(templateName)}`
        );
        return response.data;
    },

    /**
     * Create a new notification template (admin endpoint)
     * @param templateData - Template data to create
     * @returns Promise resolving to the created template
     */
    async createTemplate(templateData: Omit<NotificationTemplate, 'id' | 'created_at' | 'updated_at'>): Promise<NotificationTemplate> {
        const response: AxiosResponse<NotificationTemplate> = await axios.post(
            `${API_BASE_URL}/admin/notifications/templates`,
            templateData
        );
        return response.data;
    },

    /**
     * Update a notification template (admin endpoint)
     * @param templateId - Template ID to update
     * @param templateData - Template data to update
     * @returns Promise resolving to the updated template
     */
    async updateTemplate(templateId: string, templateData: Omit<NotificationTemplate, 'id' | 'created_at' | 'updated_at'>): Promise<NotificationTemplate> {
        const response: AxiosResponse<NotificationTemplate> = await axios.put(
            `${API_BASE_URL}/admin/notifications/templates/${encodeURIComponent(templateId)}`,
            templateData
        );
        return response.data;
    },

    /**
     * Delete a notification template (admin endpoint)
     * @param templateId - Template ID to delete
     * @returns Promise resolving when template is deleted
     */
    async deleteTemplate(templateId: string): Promise<void> {
        await axios.delete(
            `${API_BASE_URL}/admin/notifications/templates/${encodeURIComponent(templateId)}`
        );
    },
};

/**
 * Default export for convenience
 */
export default notificationApi;
