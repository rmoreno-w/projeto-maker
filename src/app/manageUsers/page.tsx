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
    const [users, setUsers] = useState<User[]>([]);

    useEffect(() => {
        apiClient
            .get<User[]>('/users', {
                headers: {
                    Authorization: `Bearer ${authData.access_token}`,
                },
            })
            .then((response) => {
                console.log(response.data);
                setUsers(response.data);
            })
            .catch((e) => {
                console.log(e);
            });
    }, []);

    async function removeUser(userId: number) {
        apiClient
            .delete(`/users/${userId}`, {
                headers: {
                    Authorization: `Bearer ${authData.access_token}`,
                },
            })
            .then((result) => {
                console.log(result);
                const updatedUsersList = users.filter((user) => user.id != userId);
                setUsers(updatedUsersList);
                // setAreFieldsEdited(false);
            })
            .catch((e) => console.log(e));
    }

    return (
        <>
            <main className=' bg-makerBg border-4 border-makerYellow mx-[120px] my-[60px] rounded-3xl overflow-hidden'>
                <div className='py-10 px-24 flex flex-col justify-center items-center gap-3'>
                    {users ? (
                        <div className='flex flex-col gap-4'>
                            {users.map((user) => (
                                <ul key={user.id} className='flex gap-2 pl-4 h-10 items-center'>
                                    <div className='bg-makerYellow h-2 w-2 rounded' />
                                    <li>Nome: {user.name}</li>
                                    <li>Email: {user.email}</li>
                                    <button
                                        className='bg-makerYellow px-2 py-1 rounded'
                                        onClick={() => removeUser(user.id)}
                                    >
                                        Remover Usuário
                                    </button>
                                </ul>
                            ))}
                        </div>
                    ) : (
                        <p>Ainda não há usuários cadastrados</p>
                    )}
                </div>
            </main>
        </>
    );
}
