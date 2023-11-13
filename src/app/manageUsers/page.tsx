'use client';
import { useAuth } from '@/contexts/loginContext';
import { apiClient } from '@/services/axios';
import { useEffect, useState } from 'react';

type userTypes = 'member' | 'admin' | 'customer';

interface User {
    id: number;
    name: string;
    street: string;
    email: string;
    cep: string;
    district: string;
    house_number: number;
    phone_number: string;
    city: string;
    state: string;
    complement?: string;
    role: Array<userTypes>;
    activation_state: boolean;
    unifei_registration_number: string;
}
export default function ManageUsers() {
    const { authData } = useAuth();
    const [customers, setCustomers] = useState<User[]>([]);
    const [members, setMembers] = useState<User[]>([]);
    const alternativeTokenLocalStorage = authData.access_token == '' && localStorage.getItem('authToken');

    useEffect(() => {
        apiClient
            .get<User[]>('/users', {
                headers: {
                    Authorization:
                        authData.access_token !== ''
                            ? `Bearer ${authData.access_token}`
                            : `Bearer ${alternativeTokenLocalStorage}`,
                },
            })
            .then((response) => {
                console.log(response.data);
                let customers = response.data.filter((customer) => customer.role.includes('customer'));
                let members = response.data.filter((customer) => customer.role.includes('member'));
                setCustomers(customers);
                setMembers(members);
            })
            .catch((e) => {
                console.log(e);
            });
    }, []);

    async function removeUser(userId: number, userType: string) {
        console.log(`id: ${userId}, type: ${userType}`);
        apiClient
            .delete(`/users/${userId}`, {
                headers: {
                    Authorization: `Bearer ${authData.access_token}`,
                },
            })
            .then((result) => {
                console.log(result);

                if (userType == 'member') {
                    const updatedMembersList = members.filter((member) => member.id != userId);
                    console.log(typeof updatedMembersList);
                    setMembers(updatedMembersList);
                    // setAreFieldsEdited(false);}
                } else if (userType == 'customer') {
                    const updatedCustomersList = customers.filter((customer) => customer.id != userId);
                    console.log(typeof updatedCustomersList);
                    setCustomers(updatedCustomersList);
                    // setAreFieldsEdited(false);}
                }
            })
            .catch((e) => console.log(e));
    }

    const translatedRoles = {
        member: 'Membro',
        admin: 'Administrador',
        customer: 'Cliente',
    };

    return (
        <>
            <main className=' bg-makerBg border-4 border-makerYellow mx-[120px] my-[60px] rounded-3xl overflow-hidden'>
                <div className='py-10 px-24 flex flex-col justify-center gap-3'>
                    {members.length != 0 ? (
                        <div className='flex flex-col gap-4'>
                            <h2 className='text-[24px] font-bold'>Membros</h2>
                            <div className='grid grid-cols-4 w-full gap-2 text-center'>
                                <p className='border-b-2 py-2 border-makerGray font-bold'>Nome</p>
                                <p className='border-b-2 py-2 border-makerGray font-bold'>Email</p>
                                <p className='border-b-2 py-2 border-makerGray font-bold'>Função</p>
                                <p className='border-b-2 py-2 border-makerGray font-bold'>Deletar Membro</p>

                                {members.map((member) => (
                                    <>
                                        <p className='border-b border-makerLightGray py-2'>{member.name}</p>
                                        <p className='border-b border-makerLightGray py-2'>{member.email}</p>
                                        <p className='border-b border-makerLightGray py-2'>
                                            {translatedRoles[member.role[0]]}
                                        </p>
                                        <button
                                            className='border-b border-makerLightGray py-2 flex justify-center'
                                            onClick={() => removeUser(member.id, 'member')}
                                        >
                                            <span className='bg-[#BC2119] h-8 w-8 font-bold rounded-xl text-makerBg flex items-center justify-center text-center'>
                                                x
                                            </span>
                                        </button>
                                    </>
                                ))}
                            </div>
                        </div>
                    ) : (
                        <p>Ainda não há membros cadastrados</p>
                    )}
                </div>

                <div className='py-10 px-24 flex flex-col justify-center gap-3'>
                    {customers.length != 0 ? (
                        <div className='flex flex-col gap-4'>
                            <h2 className='text-[24px] font-bold'>Clientes</h2>
                            <div className='grid grid-cols-4 w-full gap-2 text-center'>
                                <p className='border-b-2 py-2 border-makerGray font-bold'>Nome</p>
                                <p className='border-b-2 py-2 border-makerGray font-bold'>Email</p>
                                <p className='border-b-2 py-2 border-makerGray font-bold'>Função</p>
                                <p className='border-b-2 py-2 border-makerGray font-bold'>Deletar Cliente</p>

                                {customers.map((customer) => (
                                    <>
                                        <p className='border-b border-makerLightGray py-2'>{customer.name}</p>
                                        <p className='border-b border-makerLightGray py-2'>{customer.email}</p>
                                        <p className='border-b border-makerLightGray py-2'>
                                            {translatedRoles[customer.role[0]]}
                                        </p>
                                        <button
                                            className='border-b border-makerLightGray py-2 flex justify-center'
                                            onClick={() => removeUser(customer.id, 'customer')}
                                        >
                                            <span className='bg-[#BC2119] h-8 w-8 font-bold rounded-xl text-makerBg flex items-center justify-center text-center'>
                                                x
                                            </span>
                                        </button>
                                    </>
                                ))}
                            </div>
                        </div>
                    ) : (
                        <p>Ainda não há clientes cadastrados</p>
                    )}
                </div>
            </main>
        </>
    );
}
