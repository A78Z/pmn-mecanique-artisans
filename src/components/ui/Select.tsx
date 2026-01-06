import React from 'react';
import { Label } from './Label';

interface SelectProps extends React.SelectHTMLAttributes<HTMLSelectElement> {
    label?: string;
    error?: string;
    options: string[];
    placeholder?: string;
}

export const Select: React.FC<SelectProps> = ({ label, id, error, options, className = '', required, placeholder, ...props }) => {
    return (
        <div className="w-full">
            {label && <Label htmlFor={id} required={required}>{label}</Label>}
            <div className="relative">
                <select
                    id={id}
                    className={`w-full px-4 py-3 sm:py-2.5 border rounded-lg 
                        focus:ring-2 focus:ring-green-500 focus:border-transparent 
                        outline-none transition-all appearance-none bg-white
                        text-base sm:text-[15px]
                        min-h-[48px] sm:min-h-[44px]
                        ${error ? 'border-red-500' : 'border-gray-300'}
                        ${props.disabled ? 'bg-gray-50 text-gray-500 cursor-not-allowed' : ''}
                        ${className}`}
                    {...props}
                >
                    {placeholder && <option value="" disabled>{placeholder}</option>}
                    {options.map((option) => (
                        <option key={option} value={option}>
                            {option}
                        </option>
                    ))}
                </select>
                <div className="absolute inset-y-0 right-0 flex items-center px-3 pointer-events-none">
                    <svg className="w-5 h-5 sm:w-4 sm:h-4 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M19 9l-7 7-7-7" />
                    </svg>
                </div>
            </div>
            {error && <p className="text-xs text-red-500 mt-1">{error}</p>}
        </div>
    );
};
