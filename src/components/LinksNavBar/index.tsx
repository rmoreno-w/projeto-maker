import { roles } from '@/contexts/loginContext';
import Link from 'next/link';

interface LinksNavBarProps {
    currentRoute: string;
    role: roles;
}

export function LinksNavBar({ currentRoute, role }: LinksNavBarProps) {
    return (
        <nav className='flex'>
            {role == 'admin' ? (
                <AdminLinks currentRoute={currentRoute} />
            ) : role == 'member' ? (
                <MemberLinks currentRoute={currentRoute} />
            ) : (
                role == 'customer' && <CustomerLinks currentRoute={currentRoute} />
            )}
        </nav>
    );
}

interface LinksProps {
    currentRoute: string;
}
function AdminLinks({ currentRoute }: LinksProps) {
    return (
        <>
            <Link
                href='/manageUsers'
                className={`relative mx-4 hover:underline decoration-2 underline-offset-4 decoration-makerLinkDecoration
                    ${currentRoute == '/manageUsers' ? 'border-b-2 border-b-makerYellow hover:no-underline' : ''}`}
            >
                Gerenciar Usuários
            </Link>

            <span className='h-4 w-[2px] bg-makerYellow self-center'></span>

            <Link
                href='/materials'
                className={`relative mx-4 hover:underline decoration-2 underline-offset-4 decoration-makerLinkDecoration
                    ${currentRoute == '/materials' ? 'border-b-2 border-b-makerYellow hover:no-underline' : ''}`}
            >
                Materiais
            </Link>

            <span className='h-4 w-[2px] bg-makerYellow self-center'></span>

            <Link
                href='/reports'
                className={`relative mx-4 hover:underline decoration-2 underline-offset-4 decoration-makerLinkDecoration
                    ${currentRoute == '/reports' ? 'border-b-2 border-b-makerYellow hover:no-underline' : ''}`}
            >
                Relatorios
            </Link>

            <span className='h-4 w-[2px] bg-makerYellow self-center'></span>

            <Link
                href='/services'
                className={`relative mx-4 hover:underline decoration-2 underline-offset-4 decoration-makerLinkDecoration
                    ${currentRoute == '/services' ? 'border-b-2 border-b-makerYellow hover:no-underline' : ''}`}
            >
                Serviços
            </Link>

            <span className='h-4 w-[2px] bg-makerYellow self-center'></span>

            <Link
                href='/profile'
                className={`relative mx-4 hover:underline decoration-2 underline-offset-4 decoration-makerLinkDecoration
                    ${currentRoute == '/profile' ? 'border-b-2 border-b-makerYellow hover:no-underline' : ''}`}
            >
                Perfil
            </Link>
        </>
    );
}
function MemberLinks({ currentRoute }: LinksProps) {
    return (
        <>
            <Link
                href='/materials'
                className={`relative mx-4 hover:underline decoration-2 underline-offset-4 decoration-makerLinkDecoration
                    ${currentRoute == '/materials' ? 'border-b-2 border-b-makerYellow hover:no-underline' : ''}`}
            >
                Materiais
            </Link>

            <span className='h-4 w-[2px] bg-makerYellow self-center'></span>

            <Link
                href='/services'
                className={`relative mx-4 hover:underline decoration-2 underline-offset-4 decoration-makerLinkDecoration
                    ${currentRoute == '/services' ? 'border-b-2 border-b-makerYellow hover:no-underline' : ''}`}
            >
                Serviços
            </Link>

            <span className='h-4 w-[2px] bg-makerYellow self-center'></span>

            <Link
                href='/profile'
                className={`relative mx-4 hover:underline decoration-2 underline-offset-4 decoration-makerLinkDecoration
                    ${currentRoute == '/profile' ? 'border-b-2 border-b-makerYellow hover:no-underline' : ''}`}
            >
                Perfil
            </Link>
        </>
    );
}

function CustomerLinks({ currentRoute }: LinksProps) {
    return (
        <>
            <Link
                href='/services'
                className={`relative mx-4 hover:underline decoration-2 underline-offset-4 decoration-makerLinkDecoration
                    ${currentRoute == '/services' ? 'border-b-2 border-b-makerYellow hover:no-underline' : ''}`}
            >
                Serviços
            </Link>

            <span className='h-4 w-[2px] bg-makerYellow self-center'></span>

            <Link
                href='/profile'
                className={`relative mx-4 hover:underline decoration-2 underline-offset-4 decoration-makerLinkDecoration
                    ${currentRoute == '/profile' ? 'border-b-2 border-b-makerYellow hover:no-underline' : ''}`}
            >
                Perfil
            </Link>
        </>
    );
}
