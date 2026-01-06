import React from 'react';
import { Label } from './Label';

interface RadioOption {
    label: string;
    value: string;
}

interface RadioGroupProps {
    label: string;
    options: RadioOption[];
    value: string;
    onChange: (value: string) => void;
    name: string;
    error?: string;
    required?: boolean;
    horizontal?: boolean;
}

export const RadioGroup: React.FC<RadioGroupProps> = ({ label, options, value, onChange, name, error, required, horizontal = false }) => {
    return (
        <div className="w-full">
            <Label required={required}>{label}</Label>
            {/* Horizontal stacks on larger screens, optional stack on mobile for horizontal mode */}
            <div className={`mt-2 flex flex-wrap ${horizontal ? 'flex-row gap-4 sm:gap-6' : 'flex-col gap-2 sm:gap-3'}`}>
                {options.map((option) => (
                    <label
                        key={option.value}
                        className="flex items-center gap-3 cursor-pointer p-2 sm:p-1.5 rounded-lg hover:bg-gray-50 active:bg-gray-100 transition-colors min-h-[44px] sm:min-h-0"
                    >
                        <input
                            type="radio"
                            name={name}
                            value={option.value}
                            checked={value === option.value}
                            onChange={(e) => onChange(e.target.value)}
                            className="w-5 h-5 sm:w-[18px] sm:h-[18px] text-green-600 border-gray-300 focus:ring-green-500 cursor-pointer"
                        />
                        <span className="text-sm sm:text-sm text-gray-700">{option.label}</span>
                    </label>
                ))}
            </div>
            {error && <p className="text-xs text-red-500 mt-1">{error}</p>}
        </div>
    );
};
