import { useState, useRef, useEffect } from "react";
import { FaBell } from "react-icons/fa6";

export default function NotificationButton() {
    const [isNotificationOpen, setNotificationOpen] = useState(false);
    const notificationRef = useRef<HTMLDivElement>(null);

    const handleToggleNotification = () => setNotificationOpen((prev) => !prev);

    useEffect(() => {
        const handleClickOutside = (event: MouseEvent) => {
            if (notificationRef.current && !notificationRef.current.contains(event.target as Node)) {
                setNotificationOpen(false);
            }
        };

        document.addEventListener("mousedown", handleClickOutside);
        return () => {
            document.removeEventListener("mousedown", handleClickOutside);
        };
    }, []);

    return (
        <div ref={notificationRef} className="relative">
            <button
                onClick={handleToggleNotification}
                className={`relative p-2 transition rounded-full ${isNotificationOpen
                    ? "bg-gradient-to-br from-pink-500 to-purple-700 text-white shadow-lg"
                    : "text-slate-600 hover:bg-white hover:shadow-lg hover:text-gray-900"
                    }`}
            >
                <FaBell size={24} />
                <span className="absolute -top-1 -right-1 bg-red-500 text-white text-xs rounded-full px-1.5">3</span>
            </button>
            {isNotificationOpen && (
                <div className="absolute z-50 right-0 mt-2 w-64 bg-white border border-gray-200 rounded-sm shadow-xl">
                    <ul className="text-sm text-gray-500 font-medium">
                        <li className="px-4 py-3 hover:bg-gray-100 cursor-pointer">New product added!</li>
                        <li className="px-4 py-3 hover:bg-gray-100 cursor-pointer">Order #12345 shipped!</li>
                        <li className="px-4 py-3 hover:bg-gray-100 cursor-pointer">You have 2 unread messages</li>
                        <li className="px-4 py-3 bg-gradient-to-br from-pink-500 to-purple-700 text-white hover:brightness-110 cursor-pointer text-center rounded-b-sm shadow-md transition-all duration-300 ease-in-out">View all notifications</li>
                    </ul>
                </div>
            )}
        </div>
    );
}