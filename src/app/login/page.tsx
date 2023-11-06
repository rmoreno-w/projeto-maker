import { Input } from '@/components/Input';
import Link from 'next/link';

export default function Home() {
    return (
        <>
            <main className='bg-makerBg border-4 border-makerYellow mx-[120px] my-[60px] py-24 px-20 grid grid-cols-12 gap-5 rounded-3xl'>
                <div className='flex flex-col gap-6 col-start-4 col-span-6'>
                    <Input label='Login' />

                    <Input label='Senha' />

                    <Link
                        href='/profile'
                        className='flex justify-center align-middle border bg-makerYellow p-2 font-medium rounded-xl w-full text-black text-2xl'
                    >
                        Acessar Serviços
                    </Link>

                    <div className='flex flex-col gap-2'>
                        <p className='text-center'>Ainda não possui cadastro?</p>
                        <button className='border border-makerYellow p-2 font-medium rounded-xl w-full text-black text-2xl'>
                            Criar Conta
                        </button>
                    </div>
                </div>
            </main>
        </>
    );
}