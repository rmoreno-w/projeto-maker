'use client';
import { Input } from '@/components/Input';
import { useAuth } from '@/contexts/loginContext';
import { useRouter } from 'next/navigation';
import { useState } from 'react';

export default function Home() {
    const { authData, signIn } = useAuth();

    const [email, setEmail] = useState('');
    const [errorMessage, setErrorMessage] = useState('');
    const [password, setPassword] = useState('');
    const router = useRouter();

    async function handleLoginClick() {
        // console.log(`Emeiu ${email} senha ${password}`);
        if (email && password) {
            const result = await signIn({ email, password });
            setErrorMessage(result);
            console.log(result);

            if (result == '') router.push('/profile');
        }
    }

    async function handleRegisterClick() {
        router.push('/register');
    }

    return (
        <>
            <main className='bg-makerBg border-4 border-makerYellow mx-[120px] my-[60px] py-24 px-20 grid grid-cols-12 gap-5 rounded-3xl'>
                <div className='flex flex-col gap-6 col-start-4 col-span-6'>
                    <Input label='Login' currentValue={email} onChangeValue={setEmail} />

                    <Input label='Senha' currentValue={password} onChangeValue={setPassword} type='password' />

                    <p className={`text-red-900 text-center ${errorMessage ? 'block' : 'hidden'}`}>{errorMessage}</p>
                    <button
                        className='flex justify-center align-middle border bg-makerYellow p-2 font-medium rounded-xl w-full text-black text-2xl disabled:opacity-40'
                        onClick={handleLoginClick}
                        disabled={!email || !password}
                    >
                        Acessar Serviços
                    </button>

                    <div className='flex flex-col gap-2'>
                        <p className='text-center'>Ainda não possui cadastro?</p>
                        <button
                            className='border border-makerYellow p-2 font-medium rounded-xl w-full text-black text-2xl'
                            onClick={handleRegisterClick}
                        >
                            Criar Conta
                        </button>
                    </div>
                </div>
            </main>
        </>
    );
}
