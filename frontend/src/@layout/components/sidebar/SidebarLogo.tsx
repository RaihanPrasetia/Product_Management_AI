// components/SidebarLogo.tsx
type SidebarLogoProps = {
    isOpen: boolean;
};

export default function SidebarLogo({ isOpen }: SidebarLogoProps) {
    return (
        <div className="py-4 text-base font-bold tracking-wide text-center flex items-center justify-center space-x-4">
            {isOpen ? (
                <>
                    <img
                        src="/img/profile.png"
                        alt="Logo"
                        className="w-10 h-10 rounded-full"
                    />
                    <div className="text-center text-nowrap">POS-Ecommerce</div>
                </>
            ) : (
                <img
                    src="/img/profile.png"
                    alt="Logo"
                    className="w-10 h-10 rounded-full"
                />
            )}
        </div>
    );
}