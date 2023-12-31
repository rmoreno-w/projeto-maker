'use client';
import { Input } from '@/components/Input';
import { useAuth } from '@/contexts/loginContext';
import { apiClient } from '@/services/axios';
import { useRouter } from 'next/navigation';
import { useRef, useState } from 'react';

export default function Home() {
    const { authData, signIn } = useAuth();

    const [name, setName] = useState('');
    const [cpf, setCPF] = useState('');
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [phoneNumber, setPhoneNumber] = useState('');
    const [street, setStreet] = useState('');
    const [cep, setCEP] = useState('');
    const [houseNumber, setHouseNumber] = useState('');
    const [district, setDistrict] = useState('');
    const [city, setCity] = useState('');
    const [state, setState] = useState('');
    const [complement, setComplement] = useState('');
    const router = useRouter();
    const [accountCreationMessage, setAccountCreationMessage] = useState('');
    const [isLoading, setIsLoading] = useState(false);
    const dialogRef = useRef<HTMLDialogElement>(null);

    async function handleSignonClick() {
        setIsLoading(true);
        // console.log(`Nome ${name}`);
        // console.log(`cpf ${cpf}`);
        // console.log(`email ${email}`);
        // console.log(`password ${password}`);
        // console.log(`phoneNumber ${phoneNumber}`);
        // console.log(`cep ${cep}`);
        // console.log(`street ${street}`);
        // console.log(`houseNumber ${houseNumber}`);
        // console.log(`district ${district}`);
        // console.log(`city ${city}`);
        // console.log(`state ${state}`);
        // console.log(`complement ${complement}`);
        apiClient
            .post('/users', {
                name,
                cpf,
                email,
                password,
                phone_number: phoneNumber
                    .replaceAll(' ', '')
                    .replaceAll('(', '')
                    .replaceAll(')', '')
                    .replaceAll('-', ''),
                street,
                cep,
                house_number: Number(houseNumber),
                district,
                city,
                state,
                complement,
            })
            .then(() => {
                setAccountCreationMessage('Conta criada com sucesso! Redirecionando para pagina de login');
                dialogRef.current?.showModal();
                setTimeout(() => {
                    router.push('/login');
                }, 3000);
            })
            .catch((e) => {
                console.log(e);
                setAccountCreationMessage(`Oops, erro ao criar sua conta :( Descrição do erro: ${e}`);
                dialogRef.current?.showModal();
            });
    }

    return (
        <>
            <main className='bg-makerBg border-4 border-makerYellow mx-[120px] my-[60px] py-24 px-20 grid grid-cols-12 gap-5 rounded-3xl'>
                <div className='flex flex-col gap-6 col-start-4 col-span-6'>
                    <h1 className='text-[26px] text-base[40px] font-bold'>
                        Preencha seus dados para realizar o cadastro!
                    </h1>
                    <h2 className='text-[20px] font-semibold'>Dados Pessoais</h2>
                    <Input label='Nome completo' currentValue={name} onChangeValue={setName} />

                    <Input label='CPF (formato xxx.xxx.xxx-xx)' currentValue={cpf} onChangeValue={setCPF} />

                    <Input label='Email' currentValue={email} onChangeValue={setEmail} />

                    <Input label='Senha' currentValue={password} onChangeValue={setPassword} />

                    <Input
                        label='Número de telefone (formato xx xxxxx xxxx)'
                        currentValue={phoneNumber}
                        onChangeValue={setPhoneNumber}
                    />

                    <h2 className='text-[20px] font-semibold'>Endereço</h2>
                    <Input label='CEP' currentValue={cep} onChangeValue={setCEP} />

                    <Input label='Rua' currentValue={street} onChangeValue={setStreet} />

                    <Input label='Número do imóvel' currentValue={houseNumber} onChangeValue={setHouseNumber} />

                    <Input label='Bairro' currentValue={district} onChangeValue={setDistrict} />

                    <Input label='Cidade' currentValue={city} onChangeValue={setCity} />

                    <Input label='Estado (formato - Sigla de 2 letas)' currentValue={state} onChangeValue={setState} />

                    <Input label='Complemento (Opcional)' currentValue={complement} onChangeValue={setComplement} />

                    <button
                        className='flex justify-center align-middle border bg-makerYellow p-2 font-medium rounded-xl w-full text-black text-2xl disabled:opacity-40'
                        onClick={handleSignonClick}
                        // disabled={
                        //     !email ||
                        //     !password ||
                        //     !name ||
                        //     !cpf ||
                        //     !phoneNumber ||
                        //     !cep ||
                        //     !street ||
                        //     !houseNumber ||
                        //     !street ||
                        //     !district ||
                        //     !city ||
                        //     !state
                        // }
                        disabled={isLoading}
                    >
                        Criar minha conta
                    </button>
                    <dialog
                        onClose={() => dialogRef.current?.close()}
                        ref={dialogRef}
                        className='backdrop:bg-slate-900/60 p-10 bg-makerBg rounded-lg open:flex open:flex-col open:gap-8 open:items-center'
                        // open
                        // https://blog.logrocket.com/creating-reusable-pop-up-modal-react/
                    >
                        <h1 className='text-lg'>{accountCreationMessage}</h1>

                        <button
                            onClick={() => {
                                accountCreationMessage.includes('sucesso')
                                    ? router.push('/login')
                                    : dialogRef.current?.close();
                            }}
                            className='px-4 py-2 bg-makerYellow rounded-lg w-[50%]'
                        >
                            Ok
                        </button>
                    </dialog>
                </div>
            </main>
        </>
    );
}
