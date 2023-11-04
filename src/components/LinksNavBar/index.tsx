import Link from 'next/link';

interface LinksNavBarProps {
    currentRoute: string;
}

export function LinksNavBar({ currentRoute }: LinksNavBarProps) {
    return (
        <nav className='flex'>
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
                href='/stock'
                className={`relative mx-4 hover:underline decoration-2 underline-offset-4 decoration-makerLinkDecoration
                    ${currentRoute == '/stock' ? 'border-b-2 border-b-makerYellow hover:no-underline' : ''}`}
            >
                Estoque
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
        </nav>
    );
}
