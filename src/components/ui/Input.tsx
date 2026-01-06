import React from 'react';
import { Label } from './Label';

interface InputProps extends React.InputHTMLAttributes<HTMLInputElement> {
    label?: string;
    error?: string;
    icon?: React.ReactNode;
}

export const Input: React.FC<InputProps> = ({ label, id, error, className = '', required, icon, ...props }) => {
    return (
        <div className="w-full">
            {label && <Label htmlFor={id} required={required}>{label}</Label>}
            <div className="relative">
                <input
                    id={id}
                    className={`w-full px-4 py-3 sm:py-2.5 border rounded-lg 
                        focus:ring-2 focus:ring-green-500 focus:border-transparent 
                        outline-none transition-all
                        text-base sm:text-[15px]
                        min-h-[48px] sm:min-h-[44px]
                        ${error ? 'border-red-500' : 'border-gray-300'}
                        ${icon ? 'pl-10 sm:pl-10' : ''}
                        ${className}`}
                    {...props}
                />
                {icon && (
                    <div className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400">
                        {icon}
                    </div>
                )}
            </div>
            {error && <p className="text-xs text-red-500 mt-1">{error}</p>}
        </div>
    );
};
