import {
  Notification,
  NotificationType,
} from './notifications.service.interface';

export interface NotificationOwnerCheck {
  id: string;
  userId: string;
  read: boolean;
}

export interface CreateNotificationInput {
  id: string;
  userId: string;
  type: NotificationType;
  title: string;
  message: string;
  data: string;
}

export const INotificationsRepository = Symbol('INotificationsRepository');

export interface INotificationsRepository {
  create(input: CreateNotificationInput): Promise<Notification>;
  listByUserId(
    userId: string,
    unread: boolean | null,
    limit: number,
    offset: number,
  ): Promise<Notification[]>;
  countByUserId(userId: string, unread: boolean | null): Promise<number>;
  countUnreadByUserId(userId: string): Promise<number>;
  findById(id: string): Promise<NotificationOwnerCheck | null>;
  markAsRead(id: string): Promise<Notification>;
}
