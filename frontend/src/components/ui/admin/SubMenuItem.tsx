// components/SubMenuItem.tsx
import { SubMenuItemType } from "@/utils/types/MenuTypes";
import { NavigateFunction } from "react-router-dom";

type SubMenuItemProps = {
    subItem: SubMenuItemType;
    pathname: string;
    isOpen: boolean;
    navigate: NavigateFunction;
};

export default function SubMenuItem({
    subItem,
    pathname,
    isOpen,
    navigate
}: SubMenuItemProps) {
    const isSubActive = pathname === subItem.href;

    return (
        <li>
            <button
                onClick={() => navigate(subItem.href)}
                className={`flex items-center w-full px-3 py-2 space-x-2 rounded-md text-sm font-medium ${isSubActive
                    ? "bg-pink-100 text-pink-600"
                    : "hover:bg-gray-50 text-gray-600"
                    }`}
            >
                <div
                    className={`p-1 rounded-full ${isSubActive
                        ? "bg-gradient-to-br from-pink-500 to-purple-700 text-white"
                        : "bg-gray-200 text-gray-500"
                        }`}
                >
                    <subItem.icon className="w-4 h-4" />
                </div>
                {isOpen && <span>{subItem.name}</span>}
            </button>
        </li>
    );
}