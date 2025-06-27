/**
 * Utility functions for date formatting and manipulation
 */

/**
 * Format a date string for display - basic formatter for general usage
 * @param date Optional date string or null
 * @returns Formatted date string or "-" if no date provided
 */
export function formatDate(date?: string | null) {
  if (!date) return "-";
  return new Date(date).toLocaleDateString();
}

/**
 * Format a date to display the day of week, month, and day
 * @param date The date to format (string or Date object)
 * @param format 'long' for full weekday and month names, 'short' for abbreviated
 * @returns Formatted date string (e.g., "Monday, June 26" or "Mon, Jun 26")
 */
export function formatDateToLongDay(date: string | Date, format: 'long' | 'short' = 'long'): string {
  const dateObj = typeof date === 'string' ? new Date(date) : date;

  if (format === 'short') {
    return dateObj.toLocaleDateString('en-US', {
      weekday: 'short',
      month: 'short',
      day: 'numeric',
      timeZone: 'UTC'
    });
  }

  return dateObj.toLocaleDateString('en-US', {
    weekday: 'long',
    month: 'long',
    day: 'numeric',
    timeZone: 'UTC'
  });
}

/**
 * Format a time to display hours and minutes with AM/PM
 * @param date The date to format
 * @returns Formatted time string (e.g., "3:30 PM")
 */
export function formatTimeToAmPm(date: Date): string {
  return date.toLocaleTimeString('en-US', {
    hour: 'numeric',
    minute: '2-digit',
    hour12: true,
  });
}

/**
 * Create a new Date object that is 30 minutes after the given date
 * @param date The starting date
 * @returns A new Date object 30 minutes later
 */
export function getDatePlus30Minutes(date: Date): Date {
  const endDate = new Date(date);
  endDate.setMinutes(endDate.getMinutes() + 30);
  return endDate;
}

/**
 * Parse a date string from the API and ensure it's treated as a proper date with timezone
 * @param dateStr The date string to parse
 * @returns A Date object representing the parsed date
 */
export function parseApiDate(dateStr: string): Date {
  return new Date(dateStr);
}

/**
 * Format a date to ISO string format for API requests
 * @param date The date to format
 * @returns ISO string representation of the date
 */
export function formatDateForApi(date: Date): string {
  return date.toISOString();
}

/**
 * Create a date object from separate date and time strings
 * @param dateStr Date in ISO format (YYYY-MM-DD)
 * @param timeStr Time in 24-hour format (HH:MM)
 * @returns A Date object representing the combined date and time
 */
export function createDateTimeFromStrings(dateStr: string, timeStr: string): Date {
  return new Date(`${dateStr.split('T')[0]}T${timeStr}:00Z`);
}
