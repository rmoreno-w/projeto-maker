'use client';
import { useAuth } from '@/contexts/loginContext';
import { apiClient } from '@/services/axios';
import { useEffect, useRef, useState } from 'react';

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
    const [pickedUser, setPickedUser] = useState<User>();
    const [pickedUserCurrentRole, setPickedUserCurrentRole] = useState<userTypes | ''>('');
    const [resultingMessage, setResultingMessage] = useState('');
    // const alternativeTokenLocalStorage = authData.access_token == '' && localStorage.getItem('authToken');
    const dialogRef = useRef<HTMLDialogElement>(null);
    const confirmationDialogRef = useRef<HTMLDialogElement>(null);

    useEffect(() => {
        apiClient
            .get<User[]>('/users', {
                headers: {
                    Authorization: `Bearer ${authData.access_token}`,
                    // authData.access_token !== ''
                    //     ? `Bearer ${authData.access_token}`
                    //     : `Bearer ${alternativeTokenLocalStorage}`,
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
                setResultingMessage(e);
            });
    }, []);

    // useEffect(() => {
    //     console.log(pickedUserCurrentRole);
    // }, [pickedUserCurrentRole]);

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
                confirmationDialogRef.current?.close();
                dialogRef.current?.close();
                setResultingMessage('Usuário removido com sucesso.');
            })
            .catch((e) => {
                setResultingMessage(e);
                console.log(e);
            });
    }

    async function updateUserRole(userId: number, userType: string) {
        console.log(`id: ${userId}, type: ${userType}, token: ${authData.access_token}`);
        apiClient
            .post(
                `/users/${userId}/role/${pickedUserCurrentRole}`,
                {},
                {
                    headers: {
                        Authorization: `Bearer ${authData.access_token}`,
                    },
                }
            )
            .then((result) => {
                // console.log(result);
                // console.log(result.data);
                // console.log(typeof result.data);
                // console.log(Object.fromEntries(result.data));

                if (userType == 'member') {
                    const updatedMembersList = members.filter((member) => member.id != userId);
                    setMembers(updatedMembersList);
                    // console.log(typeof updatedMembersList);
                    let obj = result.data;
                    const updatedCustomerList = [...customers, obj];
                    setCustomers(updatedCustomerList);
                    dialogRef.current?.close();
                    // setAreFieldsEdited(false);}
                } else if (userType == 'customer') {
                    const updatedCustomersList = customers.filter((customer) => customer.id != userId);
                    setCustomers(updatedCustomersList);
                    // console.log(typeof updatedCustomersList);
                    let obj = result.data;
                    const updatedMemberList = [...members, obj];
                    // console.log(updatedMemberList);
                    // console.log(updatedCustomersList);
                    setMembers(updatedMemberList);
                    dialogRef.current?.close();
                    // setAreFieldsEdited(false);}
                }
            })
            .catch((e) => {
                setResultingMessage(e);
                console.log(e);
            });
    }

    function showUserDetails(userType: string, userId: number) {
        if (userType == 'member') {
            const pickedUserInfo = members.find((member) => member.id == userId);
            // console.log(typeof pickedUserInfo);
            setPickedUser(pickedUserInfo);
        } else if (userType == 'customer') {
            const pickedUserInfo = customers.find((customer) => customer.id == userId);
            // console.log(typeof pickedUserInfo);
            setPickedUser(pickedUserInfo);
        }

        dialogRef.current?.showModal();
    }

    return (
        <main className=' bg-makerBg border-4 border-makerYellow mx-[120px] my-[60px] rounded-3xl overflow-hidden'>
            <div className='py-10 px-24 flex flex-col justify-center gap-3'>
                {members.length != 0 ? (
                    <div className='flex flex-col gap-4'>
                        <h2 className='text-[24px] font-bold'>Membros</h2>
                        <div className='grid grid-cols-2 w-full gap-2 text-center'>
                            <p className='border-b-2 py-2 border-makerGray font-bold'>Nome</p>
                            <p className='border-b-2 py-2 border-makerGray font-bold'>Email</p>

                            {members.map((member) => (
                                <>
                                    <p
                                        key={member.id + member.name}
                                        className='border-b border-makerLightGray py-2 hover:cursor-pointer'
                                        onClick={() => showUserDetails('member', member.id)}
                                    >
                                        {member.name}
                                    </p>
                                    <p
                                        key={member.id + member.email}
                                        className='border-b border-makerLightGray py-2 hover:cursor-pointer'
                                        onClick={() => showUserDetails('member', member.id)}
                                    >
                                        {member.email}
                                    </p>
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
                        <div className='grid grid-cols-2 w-full gap-2 text-center'>
                            <p className='border-b-2 py-2 border-makerGray font-bold'>Nome</p>
                            <p className='border-b-2 py-2 border-makerGray font-bold'>Email</p>

                            {customers.map((customer) => (
                                <>
                                    <p
                                        key={customer.id + customer.name}
                                        className='border-b border-makerLightGray py-2 hover:cursor-pointer'
                                        onClick={() => showUserDetails('customer', customer.id)}
                                    >
                                        {customer.name}
                                    </p>
                                    <p
                                        key={customer.id + customer.email}
                                        className='border-b border-makerLightGray py-2 hover:cursor-pointer'
                                        onClick={() => showUserDetails('customer', customer.id)}
                                    >
                                        {customer.email}
                                    </p>
                                    {/* <button
                                            className='border-b border-makerLightGray py-2 flex justify-center'
                                            onClick={() => removeUser(customer.id, 'customer')}
                                        >
                                            <span className='bg-[#BC2119] h-8 w-8 font-bold rounded-xl text-makerBg flex items-center justify-center text-center'>
                                                x
                                            </span>
                                        </button> */}
                                </>
                            ))}
                        </div>
                    </div>
                ) : (
                    <p>Ainda não há clientes cadastrados</p>
                )}
            </div>
            <dialog
                onClose={() => dialogRef.current?.close()}
                ref={dialogRef}
                className='backdrop:bg-slate-900/60 p-10 bg-makerBg rounded-lg open:flex open:flex-col open:gap-8'
                // open
                // https://blog.logrocket.com/creating-reusable-pop-up-modal-react/
            >
                <strong className='text-lg text-center decoration-2 underline-offset-8 decoration-makerYellow underline'>
                    Detalhes do usuário
                </strong>

                <div className='flex flex-col gap-4'>
                    <p>
                        <span className='font-bold mr-1'>Nome:</span> {pickedUser?.name}
                    </p>
                    <p>
                        <span className='font-bold mr-1'>Email:</span> {pickedUser?.email}
                    </p>
                </div>

                <div className='flex flex-col gap-4'>
                    <strong className='mb-2 decoration-2 underline-offset-8 decoration-makerYellow underline'>
                        Endereço
                    </strong>
                    <p>
                        <span className='font-bold mr-1'>Rua:</span> {pickedUser?.street}
                    </p>
                    <p>
                        <span className='font-bold mr-1'>Bairro:</span> {pickedUser?.district}
                    </p>
                    <p>
                        <span className='font-bold mr-1'>Número:</span> {pickedUser?.house_number}
                    </p>
                    <p>
                        <span className='font-bold mr-1'>CEP:</span> {pickedUser?.cep}
                    </p>
                    <p>
                        <span className='font-bold mr-1'>Cidade:</span> {pickedUser?.city}
                    </p>
                    <p>
                        <span className='font-bold mr-1'>Estado:</span> {pickedUser?.state}
                    </p>
                    {pickedUser?.complement && (
                        <p>
                            <span className='font-bold mr-1'>Complemento:</span> {pickedUser?.complement}
                        </p>
                    )}

                    <div className='flex justify-center items-center gap-2'>
                        <label className='font-bold' htmlFor='role-select'>
                            Função:
                        </label>
                        <select
                            value={pickedUserCurrentRole == '' ? pickedUser?.role[0] : pickedUserCurrentRole}
                            id='role-select'
                            className='font-normal bg-transparent px-4 py-1 flex-1 rounded-lg border-0 focus:ring-0'
                            onChange={(e) => setPickedUserCurrentRole(e.target.value as userTypes)}
                        >
                            <option value='customer'>Cliente</option>
                            <option value='member'>Membro</option>
                            <option value='admin'>Administrador</option>
                        </select>
                        {pickedUserCurrentRole !== pickedUser?.role[0] && pickedUserCurrentRole !== '' && (
                            <button
                                onClick={() => updateUserRole(pickedUser!.id, pickedUser!.role[0])}
                                className='border-2 px-4 py-1 border-makerYellow rounded-md'
                            >
                                Salvar
                            </button>
                        )}
                    </div>
                </div>

                <div className='flex gap-4'>
                    <button
                        onClick={() => confirmationDialogRef.current?.showModal()}
                        className='px-4 py-2 bg-[#BC2119] rounded-lg w-[50%] text-makerBg'
                    >
                        Remover Usuário
                    </button>
                    <button
                        onClick={() => dialogRef.current?.close()}
                        className='px-4 py-2 border-2 border-makerYellow rounded-lg w-[50%]'
                    >
                        Retornar
                    </button>
                </div>
            </dialog>

            <dialog
                onClose={() => confirmationDialogRef.current?.close()}
                ref={confirmationDialogRef}
                className='backdrop:bg-slate-900/80 p-10 bg-makerBg rounded-lg open:flex open:flex-col open:gap-8'
            >
                <p className='font-bold text-lg'>Tem certeza que deseja remover este usuário?</p>

                <div className='flex gap-4'>
                    <button
                        onClick={() => removeUser(pickedUser!.id, pickedUser!.role[0])}
                        className='px-4 py-2 bg-[#BC2119] rounded-lg w-[50%] text-makerBg'
                    >
                        Remover
                    </button>
                    <button
                        onClick={() => confirmationDialogRef.current?.close()}
                        className='px-4 py-2 border-2 border-makerYellow rounded-lg w-[50%]'
                    >
                        Cancelar
                    </button>
                    {resultingMessage && <p className=''>{resultingMessage}</p>}
                </div>
            </dialog>
        </main>
    );
}
