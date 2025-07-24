import React, { useState, useRef, useEffect } from 'react';
import { BiChevronDown } from 'react-icons/bi';

interface SelectInputProps {
    label: string;
    name: string;
    value: string;
    onChange: (e: React.ChangeEvent<HTMLSelectElement>) => void;
    options: string[];
    required?: boolean;
    px?: number; // Padding horizontal
    py?: number; // Padding vertical
}

const SelectInput: React.FC<SelectInputProps> = ({
    label,
    name,
    value,
    onChange,
    options,
    required,
    px = 3, // Default padding-x
    py = 4, // Default padding-y
}) => {
    const [isOpen, setIsOpen] = useState(false);
    const dropdownRef = useRef<HTMLDivElement>(null);

    // Toggle visibility of dropdown
    const toggleDropdown = () => setIsOpen(!isOpen);

    // Handle clicking outside to close the dropdown
    useEffect(() => {
        const handleClickOutside = (event: MouseEvent) => {
            if (dropdownRef.current && !dropdownRef.current.contains(event.target as Node)) {
                setIsOpen(false);
            }
        };

        document.addEventListener('mousedown', handleClickOutside);
        return () => document.removeEventListener('mousedown', handleClickOutside);
    }, []);

    const handleOptionSelect = (option: string) => {
        onChange({
            target: { name, value: option },
        } as React.ChangeEvent<HTMLSelectElement>);
        setIsOpen(false); // Close dropdown after selecting
    };

    return (
        <div className="relative w-full" ref={dropdownRef}>
            {/* Custom Dropdown Button */}
            <div
                onClick={toggleDropdown}
                className={`w-full px-${px} py-${py} border rounded-md text-gray-800 cursor-pointer flex items-center justify-between transition-colors 
                ${isOpen ? 'border-blue-500' : 'border-gray-300'}`}
            >
                <span>{value}</span>
                <BiChevronDown className="h-5 w-5 text-gray-500" />
            </div>

            {/* Dropdown Menu (list of options) */}
            {isOpen && (
                <ul className="absolute w-full bg-white shadow-lg rounded-md mt-1 z-10 max-h-60 overflow-auto">
                    {options.map((option, index) => (
                        <li
                            key={index}
                            onClick={() => handleOptionSelect(option)}
                            className="text-[15px] px-3 py-2 hover:bg-gray-200 hover:text-gray-800 cursor-pointer"
                        >
                            {option}
                        </li>
                    ))}
                </ul>
            )}

            {/* Label Position */}
            <label
                htmlFor={name}
                className={`absolute left-3 text-[15px] transition-all duration-200 ${value
                    ? '-top-3 text-slate-500 bg-white px-1'
                    : 'top-1/2 transform -translate-y-1/2 text-gray-500'
                    }`}
            >
                {label}
            </label>

            {/* Using required prop */}
            <select
                id={name}
                name={name}
                value={value}
                onChange={onChange}
                className="hidden" // Keep hidden but required
                required={required} // Apply required attribute here
            >
                <option value="" disabled className="text-sm hidden"></option>
                {options.map((option, index) => (
                    <option key={index} value={option} className="text-sm">
                        {option}
                    </option>
                ))}
            </select>
        </div>
    );
};

export default SelectInput;
