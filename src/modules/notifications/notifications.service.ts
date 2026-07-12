import {
  Injectable,
  Inject,
  NotFoundException,
  ForbiddenException,
} from '@nestjs/common';
import crypto from 'crypto';
import {
  INotificationsService,
  NotificationListResult,
} from './interfaces/notifications.service.interface';
import {
  INotificationsRepository,
  Notification,
  NotificationType,
} from './interfaces/notifications.repository.interface';
import { QueryNotificationDto } from './dto/query-notification.dto';
import { NotificationPubSubService } from './notification-pubsub.service';

@Injectable()
export class NotificationsService implements INotificationsService {
  constructor(
    @Inject(INotificationsRepository)
    private readonly repository: INotificationsRepository,
    private readonly pubSubService: NotificationPubSubService,
  ) {}

  async findAll(
    userId: string,
    query: QueryNotificationDto,
  ): Promise<NotificationListResult> {
    const { page, limit, unread } = query;
    const skip = (page - 1) * limit;

    const [notifications, total, unreadCount] = await Promise.all([
      this.repository.listByUserId(userId, unread ?? null, limit, skip),
      this.repository.countByUserId(userId, unread ?? null),
      this.repository.countUnreadByUserId(userId),
    ]);

    return {
      data: notifications,
      meta: { page, limit, total, unreadCount },
    };
  }

  async markAsRead(id: string, currentUserId: string): Promise<Notification> {
    const notification = await this.repository.findById(id);
    if (!notification) {
      throw new NotFoundException('Notification not found');
    }

    if (notification.userId !== currentUserId) {
      throw new ForbiddenException(
        'You are not authorized to access this notification',
      );
    }

    return this.repository.markAsRead(id);
  }

  async createAndEmit(
    userId: string,
    type: NotificationType,
    title: string,
    message: string,
    data: Record<string, unknown>,
  ): Promise<Notification> {
    const id = crypto.randomUUID();
    const stringifiedData = JSON.stringify(data);

    const newNotification = await this.repository.create({
      id,
      userId,
      type,
      title,
      message,
      data: stringifiedData,
    });

    await this.pubSubService.publish(userId, {
      type,
      title,
      message,
      data,
      createdAt: newNotification.createdAt.toISOString(),
    });

    return newNotification;
  }
}
