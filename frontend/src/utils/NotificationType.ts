export type NotificationType = "success" | "error" | "warning" | "info";

export interface Notification {
  id: number;
  message: string;
  type: NotificationType;
}

export interface NotificationContextType {
  showNotification: (message: string, type?: NotificationType) => void;
}
