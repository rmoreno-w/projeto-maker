'use client';
import { useAuth } from '@/contexts/loginContext';
import Image from 'next/image';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { LinksNavBar } from '../LinksNavBar';

export function Header() {
    const currentRoute = usePathname();
    const { authData } = useAuth();

    return (
        <header className='bg-makerBg h-32 border border-b-2 border-b-makerYellow flex justify-between px-[120px] items-center rounded-b-3xl sticky top-0'>
            <Link href='/'>
                <Image src='/maker_logo.svg' alt='logo' width={100} height={100} />
            </Link>

            {authData.role == '' ? (
                <Link
                    href='/login'
                    className='flex justify-center align-middle border border-makerYellow p-2 h-11 w-20 rounded-xl text-black text-lg'
                >
                    Login
                </Link>
            ) : (
                <LinksNavBar currentRoute={currentRoute} role={authData.role} />
            )}
        </header>
    );
}
