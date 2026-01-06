import React from 'react';
import { Label } from './Label';

interface CheckboxGroupProps {
    label: string;
    options: string[];
    values: string[];
    onChange: (values: string[]) => void;
    error?: string;
    required?: boolean;
}

export const CheckboxGroup: React.FC<CheckboxGroupProps> = ({ label, options, values, onChange, error, required }) => {
    const handleToggle = (option: string) => {
        if (values.includes(option)) {
            onChange(values.filter((v) => v !== option));
        } else {
            onChange([...values, option]);
        }
    };

    // Generate unique IDs for accessibility
    const groupId = React.useId();

    return (
        <div className="w-full">
            <Label required={required}>{label}</Label>

            {/* Grid: 1 col mobile → 2 cols tablet+ with consistent spacing */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 sm:gap-3 mt-3">
                {options.map((option, index) => {
                    const optionId = `${groupId}-option-${index}`;
                    return (
                        <label
                            key={option}
                            htmlFor={optionId}
                            className="
                                flex flex-row items-center gap-4
                                cursor-pointer 
                                py-2.5 px-3 sm:py-2 sm:px-2.5
                                rounded-lg 
                                hover:bg-gray-50 active:bg-gray-100 
                                transition-colors 
                                min-h-[48px] sm:min-h-[44px]
                                border border-transparent
                                hover:border-gray-200
                                select-none
                            "
                        >
                            {/* Checkbox container - fixed width for alignment */}
                            <span className="inline-flex items-center justify-center flex-shrink-0 w-5 h-5 sm:w-[18px] sm:h-[18px]">
                                <input
                                    type="checkbox"
                                    id={optionId}
                                    className="
                                        w-5 h-5 sm:w-[18px] sm:h-[18px] 
                                        text-green-600 
                                        border-gray-300 
                                        rounded 
                                        focus:ring-2 focus:ring-green-500 focus:ring-offset-1
                                        cursor-pointer
                                        accent-green-600
                                    "
                                    checked={values.includes(option)}
                                    onChange={() => handleToggle(option)}
                                />
                            </span>

                            {/* Label text - with explicit left margin for spacing */}
                            <span className="text-sm text-gray-700 leading-snug flex-grow ml-3">
                                {option}
                            </span>
                        </label>
                    );
                })}
            </div>

            {/* Error message */}
            {error && (
                <p className="text-xs text-red-500 mt-2 flex items-center gap-1">
                    <svg className="w-3.5 h-3.5 flex-shrink-0" fill="currentColor" viewBox="0 0 20 20">
                        <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zM8.707 7.293a1 1 0 00-1.414 1.414L8.586 10l-1.293 1.293a1 1 0 101.414 1.414L10 11.414l1.293 1.293a1 1 0 001.414-1.414L11.414 10l1.293-1.293a1 1 0 00-1.414-1.414L10 8.586 8.707 7.293z" clipRule="evenodd" />
                    </svg>
                    {error}
                </p>
            )}
        </div>
    );
};
