import { Dispatch, SetStateAction } from 'react';

type useStatePossibleTypes = number | string;

interface InputProps {
    label: string;
    currentValue: string | number;
    onChangeValue: Dispatch<SetStateAction<string>>;
    disabled?: boolean;
    type?: string;
}

export function Input({ label, currentValue, onChangeValue, disabled = false, type }: InputProps) {
    return (
        <label className='flex flex-col gap-2'>
            {label}
            <input
                disabled={disabled}
                type={type}
                value={currentValue}
                onChange={(event) => onChangeValue(event.target.value)}
                className='border-2 bg-transparent border-gray-300 rounded-lg h-12 transition-all duration-300 focus:outline-none focus:ring focus:ring-makerYellow focus:ring-offset-2 focus:ring-offset-makerBg focus:border-makerYellow p-2'
            />
        </label>
    );
}
