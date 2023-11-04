import Image from 'next/image';
import Link from 'next/link';

export function Header() {
    return (
        <header className='bg-makerBg h-32 border border-b-2 border-b-[#F3B700] flex justify-between px-[120px] items-center rounded-b-3xl'>
            <Image src='/maker_logo.svg' alt='logo' width={100} height={100} />
            <Link
                href='/login'
                className='flex justify-center align-middle border border-makerYellow p-2 h-11 w-20 rounded-xl text-black text-lg'
            >
                Login
            </Link>
        </header>
    );
}
