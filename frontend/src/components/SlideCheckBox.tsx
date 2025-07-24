import React from "react";

interface SlideCheckboxProps {
    id: string;
    checked: boolean;
    onChange: (event: React.ChangeEvent<HTMLInputElement>) => void;
    label?: string;
}

const SlideCheckbox: React.FC<SlideCheckboxProps> = ({
    id,
    checked,
    onChange,
    label,
}) => {
    return (
        <div className="flex items-center">
            <input
                id={id}
                type="checkbox"
                checked={checked}
                onChange={onChange}
                className="rounded-full transition-all duration-300 ease-in-out after:rounded-full after:shadow-md after:transition-transform after:duration-300 after:ease-in-out checked:after:translate-x-[18px] h-5 w-9 cursor-pointer appearance-none border border-solid border-gray-300 bg-gray-200 bg-left bg-no-repeat align-top relative after:absolute after:top-[2px]  after:h-4 after:w-4 after:bg-white after:content-[''] checked:border-violet-600 checked:bg-violet-600"
            />
            {label && (
                <label
                    htmlFor={id}
                    className="ml-2 font-normal cursor-pointer select-none text-sm text-slate-700"
                >
                    {label}
                </label>
            )}
        </div>
    );
};

export default SlideCheckbox;
