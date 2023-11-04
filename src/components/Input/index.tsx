interface InputProps {
    label: string;
}

export function Input({ label }: InputProps) {
    return (
        <label className='flex flex-col gap-2'>
            {label}
            <input
                type={label == 'Email' ? 'email' : 'text'}
                className='border-2 bg-transparent border-gray-300 rounded-lg h-12 transition-all duration-300 focus:outline-none focus:ring focus:ring-makerYellow focus:ring-offset-2 focus:ring-offset-makerBg focus:border-makerYellow p-2'
            />
        </label>
    );
}
