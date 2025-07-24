// components/SidebarNavigation.tsx
import { useNavigate } from "react-router-dom";
import MenuItem from "./MenuItem";
import { MenuItemType } from "@/utils/types/MenuTypes";

type SidebarNavigationProps = {
    menuItems: MenuItemType[];
    pathname: string;
    isOpen: boolean;
    activeDropdown: string | null;
    toggleDropdown: (name: string) => void;
};

export default function SidebarNavigation({
    menuItems,
    pathname,
    isOpen,
    activeDropdown,
    toggleDropdown
}: SidebarNavigationProps) {
    const navigate = useNavigate();

    return (
        <nav className={`flex-grow overflow-hidden ${isOpen ? "px-3" : "px-2"} transition-all duration-300`}>
            <ul className="space-y-3">
                {menuItems.map((item) => (
                    <MenuItem
                        key={item.name}
                        item={item}
                        pathname={pathname}
                        isOpen={isOpen}
                        activeDropdown={activeDropdown}
                        toggleDropdown={toggleDropdown}
                        navigate={navigate}
                    />
                ))}
            </ul>
        </nav>
    );
}