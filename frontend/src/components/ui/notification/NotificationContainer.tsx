import React from 'react';
import { NotificationItem } from './NotificationItem';
import { Notification } from '@/utils/NotificationType';


interface NotificationContainerProps {
    notifications: Notification[];
}

export const NotificationContainer: React.FC<NotificationContainerProps> = ({ notifications }) => {
    return (
        <div className="fixed left-4 top-4 space-y-2 z-50">
            {notifications.map((notif) => (
                <NotificationItem key={notif.id} notification={notif} />
            ))}
        </div>
    );
};
