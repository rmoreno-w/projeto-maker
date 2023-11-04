import Image from 'next/image';

export default function Profile() {
    return (
        <>
            <main className=' bg-makerYellow border-4 border-makerYellow mx-[120px] my-[60px] rounded-3xl overflow-hidden'>
                <div className='grid grid-cols-12'>
                    <div className='col-span-3 py-10 px-20 flex flex-col justify-center items-center gap-3'>
                        <p className='font-semibold text-2xl'>Alexzander</p>

                        <div className='rounded-[50%] h-28 w-28 overflow-hidden relative border-2 border-makerBg'>
                            <Image src='/profile.jpg' fill className='object-fill' alt='Sua foto de perfil.' />
                        </div>

                        <a className=''>Alterar foto</a>
                    </div>

                    <div className='col-span-7 py-10 px-20 bg-makerBg flex flex-col gap-4'>
                        <label className='flex flex-col gap-2'>
                            Nome
                            <input className='border-2 bg-transparent border-gray-300 rounded-lg h-12' />
                        </label>

                        <label className='flex flex-col gap-2'>
                            CPF
                            <input className='border-2 bg-transparent border-gray-300 rounded-lg h-12' />
                        </label>

                        <label className='flex flex-col gap-2'>
                            Email
                            <input type='email' className='border-2 bg-transparent border-gray-300 rounded-lg h-12' />
                        </label>
                    </div>

                    <div className='col-span-2 bg-makerBg'></div>
                </div>
            </main>
        </>
    );
}
