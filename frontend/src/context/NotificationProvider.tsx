import { NotificationContainer } from '@/components/ui/notification/NotificationContainer';
import { Notification, NotificationType } from '@/utils/NotificationType';
import React, { useCallback, useState } from 'react';
import NotificationContext from './NotifContext';

let idCounter = 0;

export const NotificationProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
    const [notifications, setNotifications] = useState<Notification[]>([]);

    const showNotification = useCallback((message: string, type: NotificationType = 'info') => {
        const id = idCounter++;
        setNotifications((prev) => [...prev, { id, message, type }]);

        setTimeout(() => {
            setNotifications((prev) => prev.filter((notif) => notif.id !== id));
        }, 3000);
    }, []);

    return (
        <NotificationContext.Provider value={{ showNotification }}>
            {children}
            <NotificationContainer notifications={notifications} />
        </NotificationContext.Provider>
    );
};
