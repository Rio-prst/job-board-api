import { QueryNotificationDto } from '../dtos/query-notification.dto';

export type NotificationType =
  'new_job' | 'new_application' | 'application_update' | 'new_message';
export type JsonValue =
  string | number | boolean | null | { [key: string]: JsonValue } | JsonValue[];

export interface Notification {
  id: string;
  type: string;
  title: string;
  message: string;
  read: boolean;
  data: JsonValue;
  createdAt: Date;
}

export interface NotificationListResult {
  data: Notification[];
  meta: {
    page: number;
    limit: number;
    total: number;
    unreadCount: number;
  };
}

export const INotificationsService = Symbol('INotificationsService');

export interface INotificationsService {
  findAll(
    userId: string,
    query: QueryNotificationDto,
  ): Promise<NotificationListResult>;
  markAsRead(id: string, currentUserId: string): Promise<Notification>;
  createAndEmit(
    userId: string,
    type: NotificationType,
    title: string,
    message: string,
    data: Record<string, unknown>,
  ): Promise<Notification>;
}
