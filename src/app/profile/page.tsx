'use client';
import { Input } from '@/components/Input';
import Image from 'next/image';
import { useState } from 'react';

export default function Profile() {
    const [x, setX] = useState('');

    return (
        <>
            <main className=' bg-makerYellow border-4 border-makerYellow mx-[120px] my-[60px] rounded-3xl overflow-hidden'>
                <div className='grid grid-cols-12'>
                    <div className='col-span-3 py-10 px-24 flex flex-col justify-center items-center gap-3'>
                        <p className='font-semibold text-2xl'>Alexzander</p>

                        <div className='rounded-[50%] h-28 w-28 overflow-hidden relative border-2 border-makerBg'>
                            <Image src='/profile.jpg' fill className='object-fill' alt='Sua foto de perfil.' />
                        </div>

                        <a className=''>Alterar foto</a>
                    </div>

                    <div className='col-span-7 py-10 px-20 bg-makerBg flex flex-col gap-4'>
                        <Input label='Nome' currentValue='Alexzander' onChangeValue={setX} disabled />

                        <Input label='CPF' currentValue='123.123.123-22' onChangeValue={setX} disabled />

                        <Input label='Email' currentValue='x3pt0@gmail.com' onChangeValue={setX} disabled />
                    </div>

                    <div className='col-span-2 bg-makerBg'></div>
                </div>
            </main>
        </>
    );
}
