import Image from 'next/image';
import Link from 'next/link';

export default function Home() {
    return (
        <>
            <main className='bg-makerBg border-4 border-makerYellow mx-[120px] my-[60px] py-24 px-20 flex justify-between rounded-3xl'>
                <div className='flex flex-col justify-between max-w-md'>
                    <p className='text-black text-2xl'>
                        Aqui você encontra serviços como{' '}
                        <span className='text-makerYellow font-bold'> Impressão 3D </span>,{' '}
                        <span className='text-makerYellow font-bold'>cortes a laser</span>,{' '}
                        <span className='text-makerYellow font-bold'>cursos de DYI</span> e muito mais!
                    </p>

                    <p className='text-2xl'>Crie ou acesse sua conta e tenha acesso aos nossos serviços agora mesmo!</p>

                    <Link
                        href='/login'
                        className='flex justify-center align-middle border bg-makerYellow p-2 rounded-xl w-full text-black text-2xl'
                    >
                        Acessar Serviços
                    </Link>
                </div>
                <Image src='/hero_image.svg' alt='logo' width={390} height={320} />
            </main>
        </>
    );
}
