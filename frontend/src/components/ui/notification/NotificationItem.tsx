import { Notification } from '@/utils/NotificationType';
import React from 'react';
import CheckCircleIcon from '@mui/icons-material/CheckCircle';
import ErrorIcon from '@mui/icons-material/Error';
import WarningIcon from '@mui/icons-material/Warning';
import InfoIcon from '@mui/icons-material/Info';

interface NotificationItemProps {
    notification: Notification;
}

export const NotificationItem: React.FC<NotificationItemProps> = ({ notification }) => {
    const { message, type } = notification;

    const backgroundColor = {
        success: 'bg-utama',
        error: 'bg-red-500',
        warning: 'bg-yellow-500',
        info: 'bg-blue-500',
    }[type];

    const Icon = {
        success: CheckCircleIcon,
        error: ErrorIcon,
        warning: WarningIcon,
        info: InfoIcon,
    }[type];

    return (
        <div className={`flex items-center gap-3 px-4 py-3 rounded-lg shadow-md text-white ${backgroundColor}`}>
            <Icon fontSize="small" className="text-white" />
            <span>{message}</span>
        </div>
    );
};
