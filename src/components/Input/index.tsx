import { Dispatch, SetStateAction } from 'react';

interface InputProps {
    label: string;
    currentValue: string;
    onChangeValue: Dispatch<SetStateAction<string>>;
    disabled?: boolean;
}

export function Input({ label, currentValue, onChangeValue, disabled = false }: InputProps) {
    return (
        <label className='flex flex-col gap-2'>
            {label}
            <input
                disabled={disabled}
                type={label == 'Senha' ? 'password' : 'text'}
                value={currentValue}
                onChange={(event) => onChangeValue(event.target.value)}
                className='border-2 bg-transparent border-gray-300 rounded-lg h-12 transition-all duration-300 focus:outline-none focus:ring focus:ring-makerYellow focus:ring-offset-2 focus:ring-offset-makerBg focus:border-makerYellow p-2'
            />
        </label>
    );
}
