import { QueryNotificationDto } from '../dto/query-notification.dto';
import {
  Notification,
  NotificationType,
} from './notifications.repository.interface';

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
