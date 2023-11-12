'use client';
import { useAuth } from '@/contexts/loginContext';
import { apiClient } from '@/services/axios';
import { useEffect, useState } from 'react';

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
    role: Array<string>;
    activation_state: boolean;
    unifei_registration_number: string;
}
export default function ManageUsers() {
    const { authData } = useAuth();
    const [customers, setCustomers] = useState<User[]>([]);
    const [members, setMembers] = useState<User[]>([]);

    useEffect(() => {
        apiClient
            .get<User[]>('/users', {
                headers: {
                    Authorization: `Bearer ${authData.access_token}`,
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

    return (
        <>
            <main className=' bg-makerBg border-4 border-makerYellow mx-[120px] my-[60px] rounded-3xl overflow-hidden'>
                <div className='py-10 px-24 flex flex-col justify-center gap-3'>
                    {members.length != 0 ? (
                        <div className='flex flex-col gap-4'>
                            <h2 className='text-[20px] font-semibold'>Membros</h2>
                            {members.map((member) => (
                                <ul key={member.id} className='flex gap-2 pl-4 h-10 items-center'>
                                    <div className='bg-makerYellow h-2 w-2 rounded' />
                                    <li>Nome: {member.name}</li>
                                    <li>Email: {member.email}</li>
                                    <button
                                        className='bg-[#BC2119] px-2 py-1 rounded text-makerBg'
                                        onClick={() => removeUser(member.id, 'member')}
                                    >
                                        Deletar Membro
                                    </button>
                                </ul>
                            ))}
                        </div>
                    ) : (
                        <p>Ainda não há membros cadastrados</p>
                    )}
                </div>
                <div className='py-10 px-24 flex flex-col justify-center gap-3'>
                    {customers.length != 0 ? (
                        <div className='flex flex-col gap-4'>
                            <h2 className='text-[20px] font-semibold'>Clientes</h2>
                            {customers.map((customer) => (
                                <ul key={customer.id} className='flex gap-2 pl-4 h-10 items-center'>
                                    <div className='bg-makerYellow h-2 w-2 rounded' />
                                    <li>Nome: {customer.name}</li>
                                    <li>Email: {customer.email}</li>
                                    <button
                                        className='bg-[#BC2119] px-2 py-1 rounded text-makerBg'
                                        onClick={() => removeUser(customer.id, 'customer')}
                                    >
                                        Deletar Cliente
                                    </button>
                                </ul>
                            ))}
                        </div>
                    ) : (
                        <p>Ainda não há clientes cadastrados</p>
                    )}
                </div>
            </main>
        </>
    );
}
