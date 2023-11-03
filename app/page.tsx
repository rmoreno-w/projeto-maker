import Image from 'next/image';

export default function Home() {
    return (
        <>
            <header className='bg-makerBg h-32 border border-b-2 border-b-[#F3B700] flex justify-between px-[120px] items-center rounded-b-3xl'>
                <Image src='/maker_logo.svg' alt='logo' width={100} height={100} />
                <button className='border border-makerYellow p-2 h-11 w-20 rounded-xl text-black'>Login</button>
            </header>

            <main className='bg-makerBg border-4 border-makerYellow mx-[120px] my-[120px] py-10 px-20 flex justify-between rounded-3xl'>
                <div className='flex flex-col justify-between max-w-md'>
                    <p className='text-black text-2xl'>
                        Aqui você encontra serviços como{' '}
                        <span className='text-makerYellow font-bold'> Impressão 3D </span>,{' '}
                        <span className='text-makerYellow font-bold'>cortes a laser</span>,{' '}
                        <span className='text-makerYellow font-bold'>cursos de DYI</span> e muito mais!
                    </p>
                    <p className='text-2xl'>Crie ou acesse sua conta e tenha acesso aos nossos serviços agora mesmo!</p>
                    <button className='border bg-makerYellow p-2 rounded-xl w-full text-black text-2xl'>
                        Acessar Serviços
                    </button>
                </div>
                <Image src='/hero_image.svg' alt='logo' width={450} height={450} />
            </main>
        </>
    );
}
