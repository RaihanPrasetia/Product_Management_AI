// components/CartButton.tsx
import { FaShoppingCart } from "react-icons/fa";

type CartButtonProps = {
    count: number;
};

export default function CartButton({ count }: CartButtonProps) {
    return (
        <div className="relative">
            <button className="p-2.5 transition rounded-full text-slate-600 hover:bg-white hover:shadow-lg hover:text-gray-900 relative">
                <FaShoppingCart size={20} />
                {count > 0 && (
                    <span className="absolute -top-1 -right-1 bg-red-500 text-white text-xs rounded-full px-1.5">
                        {count}
                    </span>
                )}
            </button>
        </div>
    );
}