'use client';
import { Input } from '@/components/Input';
import { roles, useAuth } from '@/contexts/loginContext';
import { apiClient } from '@/services/axios';
import Image from 'next/image';
import { useEffect, useState } from 'react';

export default function Profile() {
    const [name, setName] = useState('');
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
    const [role, setRole] = useState<roles>('');
    const { authData } = useAuth();
    const [areFieldsEdited, setAreFieldsEdited] = useState(false);
    const [editedData, setEditedData] = useState({});

    useEffect(() => {
        const alternativeTokenLocalStorage = localStorage.getItem('authToken');

        apiClient
            .get('/users/find/info', {
                headers: {
                    Authorization:
                        authData.access_token !== ''
                            ? `Bearer ${authData.access_token}`
                            : `Bearer ${alternativeTokenLocalStorage}`,
                },
            })
            .then((response) => {
                setName(response.data.name);
                setEmail(response.data.email);
                setRole(response.data.role[0]);
                setPhoneNumber(response.data.phone_number);
                setCEP(response.data.cep);
                setStreet(response.data.street);
                setHouseNumber(response.data.house_number);
                setDistrict(response.data.district);
                setCity(response.data.city);
                setState(response.data.state);
                setComplement(response.data.complement || '');
            })
            .catch((e) => {
                console.log(e);
            });
    }, []);

    const translatedRole = {
        admin: 'Administrador',
        customer: 'Cliente',
        member: 'Membro',
        '': '________',
    };

    async function updateUser() {
        // for (let key in retrievedData) {
        //     if(retrievedData[key] !== )
        //     console.log(key);
        // }
        console.log(editedData);
        const alternativeTokenLocalStorage = localStorage.getItem('authToken');

        apiClient
            .patch('/users', editedData, {
                headers: {
                    Authorization:
                        authData.access_token !== ''
                            ? `Bearer ${authData.access_token}`
                            : `Bearer ${alternativeTokenLocalStorage}`,
                },
            })
            .then((result) => {
                console.log(result);
                setAreFieldsEdited(false);
            })
            .catch((e) => console.log(e));
    }

    return (
        <>
            <main className=' bg-makerYellow border-4 border-makerYellow mx-[120px] my-[60px] rounded-3xl overflow-hidden'>
                <div className='grid grid-cols-12'>
                    <div className='col-span-4 py-10 px-24 flex flex-col justify-center items-center gap-3'>
                        <p className='font-semibold text-2xl'>{name || '_________'}</p>
                        <p className='font-medium text-xl'>{translatedRole[role]}</p>

                        <div className='rounded-[50%] h-28 w-28 overflow-hidden relative border-2 border-makerBg'>
                            <Image src='/profile.jpg' fill className='object-fill' alt='Sua foto de perfil.' />
                        </div>

                        <a className=''>Alterar foto</a>
                    </div>

                    <div className='col-span-4 py-10 px-20 bg-makerBg flex flex-col gap-4'>
                        <h2 className='text-[20px] font-semibold'>Dados Pessoais</h2>
                        <Input
                            label='Email'
                            currentValue={email || 'x3pt0@gmail.com'}
                            onChangeValue={(e) => {
                                setName(e);
                                setAreFieldsEdited(true);
                                setEditedData({ ...editedData, name: e });
                            }}
                        />

                        <Input
                            label='Telefone'
                            currentValue={phoneNumber || '________'}
                            onChangeValue={(e) => {
                                setPhoneNumber(e);
                                setAreFieldsEdited(true);
                                setEditedData({ ...editedData, phone_number: e });
                            }}
                        />
                    </div>
                    <div className='col-span-4 py-10 px-20 bg-makerBg flex flex-col gap-4'>
                        <h2 className='text-[20px] font-semibold'>Endereço</h2>
                        <Input
                            label='CEP'
                            currentValue={cep || '________'}
                            onChangeValue={(e) => {
                                setCEP(e);
                                setAreFieldsEdited(true);
                                setEditedData({ ...editedData, cep: e });
                            }}
                        />

                        <Input
                            label='Rua'
                            currentValue={street || '________'}
                            onChangeValue={(e) => {
                                setStreet(e);
                                setAreFieldsEdited(true);
                                setEditedData({ ...editedData, street: e });
                            }}
                        />

                        <Input
                            label='Número do Imóvel'
                            currentValue={houseNumber || '________'}
                            onChangeValue={(e) => {
                                setHouseNumber(e);
                                setAreFieldsEdited(true);
                                setEditedData({ ...editedData, house_number: e });
                            }}
                        />

                        <Input
                            label='Bairro'
                            currentValue={district}
                            onChangeValue={(e) => {
                                setDistrict(e);
                                setAreFieldsEdited(true);
                                setEditedData({ ...editedData, district: e });
                            }}
                        />

                        <Input
                            label='Cidade'
                            currentValue={city}
                            onChangeValue={(e) => {
                                setCity(e);
                                setAreFieldsEdited(true);
                                setEditedData({ ...editedData, city: e });
                            }}
                        />

                        <Input
                            label='Estado'
                            currentValue={state}
                            onChangeValue={(e) => {
                                setState(e);
                                setAreFieldsEdited(true);
                                setEditedData({ ...editedData, state: e });
                            }}
                        />

                        <Input
                            label='Complemento (Opcional)'
                            currentValue={complement}
                            onChangeValue={(e) => {
                                setComplement(e);
                                setAreFieldsEdited(true);
                                setEditedData({ ...editedData, complement: e });
                            }}
                        />
                        <button
                            className='border-2 border-makerYellow p-2 font-medium rounded-xl w-full text-black text-2xl disabled:opacity-30'
                            disabled={!areFieldsEdited}
                            onClick={updateUser}
                        >
                            Salvar Mudanças
                        </button>
                    </div>
                </div>
            </main>
        </>
    );
}
