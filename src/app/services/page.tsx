'use client';

import { Input } from '@/components/Input';
import { useAuth } from '@/contexts/loginContext';
import { apiClient } from '@/services/axios';
import { useEffect, useRef, useState } from 'react';

interface Service {
    id: number;
    name: string;
    description: string;
    base_price: number;
}

export default function Services() {
    const { authData } = useAuth();
    const [services, setServices] = useState<Service[]>([]);

    const [dialogServiceId, setDialogServiceId] = useState(0);
    const [dialogServiceName, setDialogServiceName] = useState('');
    const [dialogServiceDescription, setDialogServiceDescription] = useState('');
    const [dialogServiceBasePrice, setDialogServiceBasePrice] = useState('');
    const [isDialogEditing, setIsDialogEditing] = useState(false);
    const [isAnyFieldEdited, setIsAnyFieldEdited] = useState(false);
    const [editedFields, setEditFields] = useState({});

    const editDialogRef = useRef<HTMLDialogElement>(null);

    useEffect(() => {
        if (isDialogEditing == true) {
            let originalObject = services.find((service) => service.id == dialogServiceId);

            const newEditingObject = {
                name: dialogServiceName !== originalObject?.name && dialogServiceName,
                description: dialogServiceDescription !== originalObject?.description && dialogServiceDescription,
                base_price:
                    Number(dialogServiceBasePrice) !== Number(originalObject?.base_price) / 100 &&
                    Number(dialogServiceBasePrice),
            };

            let currentlyEditedFields: Partial<Service> = {};
            for (let [key, value] of Object.entries(newEditingObject)) {
                // console.log(value);
                if (value !== false) {
                    currentlyEditedFields[key] = value;
                } else {
                    continue;
                }
            }

            if (Object.keys(currentlyEditedFields).length !== 0) {
                setIsAnyFieldEdited(true);
                setEditFields(currentlyEditedFields);
            } else {
                setIsAnyFieldEdited(false);
            }
        }
    }, [dialogServiceName, dialogServiceDescription, dialogServiceBasePrice]);

    useEffect(() => {
        apiClient
            .get<Service[]>('/services', {
                headers: {
                    Authorization: `Bearer ${authData.access_token}`,
                    // authData.access_token !== ''
                    //     ? `Bearer ${authData.access_token}`
                    //     : `Bearer ${alternativeTokenLocalStorage}`,
                },
            })
            .then((response) => {
                console.log(response.data);
                setServices(response.data);
            })
            .catch((e) => {
                console.log(e);
            });
    }, []);

    function openCreateServiceModal() {
        setDialogServiceId(0);
        setDialogServiceName('');
        setDialogServiceDescription('');
        setDialogServiceBasePrice('');
        editDialogRef.current?.showModal();
    }

    function removeService() {
        // console.log(`id: ${userId}, type: ${userType}`);
        apiClient
            .delete(`/services/${dialogServiceId}`, {
                headers: {
                    Authorization: `Bearer ${authData.access_token}`,
                },
            })
            .then((result) => {
                console.log(result);

                const updatedMaterialsList = services.filter((service) => service.id != dialogServiceId);
                // console.log(typeof updatedCustomersList);
                setServices(updatedMaterialsList);
                // setAreFieldsEdited(false);}
                editDialogRef.current?.close();
            })
            .catch((e) => {
                console.log(e);
            });
    }

    function showServiceDetails(id: number) {
        console.log(services);
        console.log(id);
        const foundService = services.find((service) => service.id == id);

        setDialogServiceName(foundService!.name);
        setDialogServiceDescription(foundService!.description);
        setDialogServiceBasePrice(String(foundService!.base_price / 100));
        setDialogServiceId(foundService!.id);

        editDialogRef.current?.showModal();
        setIsDialogEditing(true);
    }

    async function updateService() {
        apiClient
            .patch(`/services/${dialogServiceId}`, editedFields, {
                headers: { Authorization: `Bearer ${authData.access_token}` },
            })
            .then((data) => {
                setEditFields(false);
                setIsDialogEditing(false);

                const updatedServices = services.map((service) => {
                    // if (service.id == dialogServiceId) console.log(editedFields!['base_price']);
                    return service.id == dialogServiceId
                        ? { ...service, ...editedFields, base_price: editedFields!['base_price'] * 100 }
                        : service;
                });

                setServices(updatedServices);
                // console.log(updatedMaterials);

                editDialogRef.current?.close();
            })
            .catch((e) => console.log(e));
    }

    async function createNewService() {
        const newService = {
            name: dialogServiceName,
            description: dialogServiceDescription,
            base_price: Number(dialogServiceBasePrice),
        };
        apiClient
            .post(`/services/`, newService, {
                headers: { Authorization: `Bearer ${authData.access_token}` },
            })
            .then((data) => {
                setEditFields(false);

                const newServiceToInsert = { ...newService, id: data.id };
                const updatedServices = [...services, newServiceToInsert];
                setServices(updatedServices);

                // console.log(newMaterial);
                editDialogRef.current?.close();
            })
            .catch((e) => console.log(e));
    }

    return (
        <main className='bg-makerBg border-4 border-makerYellow mx-[120px] my-[60px] rounded-3xl overflow-hidden'>
            <div className='py-10 px-24 flex flex-col justify-center gap-3'>
                <div>
                    <h1 className='text-[24px] font-bold'>Serviços</h1>{' '}
                    {authData.role === 'admin' && (
                        <button
                            onClick={openCreateServiceModal}
                            className='hover:underline no-underline hover:decoration-2 hover:underline-offset-4 decoration-makerYellow transition-all'
                        >
                            + Criar
                        </button>
                    )}
                </div>

                {services.length != 0 ? (
                    <div className='flex flex-col gap-4'>
                        <div className='grid grid-cols-2 w-full gap-2 text-center'>
                            <p className='border-b-2 py-2 border-makerGray font-bold'>Nome</p>
                            <p className='border-b-2 py-2 border-makerGray font-bold'>Descrição</p>

                            {services.map((service) => (
                                <>
                                    <p
                                        key={service.id + service.name}
                                        className='border-b border-makerLightGray py-2 hover:cursor-pointer'
                                        onClick={() => showServiceDetails(service.id)}
                                    >
                                        {service.name}
                                    </p>
                                    <p
                                        key={service.id + service.description}
                                        className='border-b border-makerLightGray py-2 hover:cursor-pointer truncate'
                                        onClick={() => showServiceDetails(service.id)}
                                    >
                                        {service.description}
                                    </p>
                                </>
                            ))}
                        </div>
                    </div>
                ) : (
                    <p>Ainda não há serviços cadastrados</p>
                )}
            </div>

            <dialog
                onClose={() => {
                    editDialogRef.current?.close();
                    setIsDialogEditing(false);
                    setIsAnyFieldEdited(false);
                }}
                ref={editDialogRef}
                className='backdrop:bg-slate-900/80 p-10 bg-makerBg rounded-lg open:flex open:flex-col open:gap-8'
            >
                <strong className='text-lg text-center decoration-2 underline-offset-8 decoration-makerYellow underline'>
                    Detalhes do serviço
                </strong>

                <div className='flex flex-col gap-4 text-ellipsis'>
                    <Input
                        currentValue={dialogServiceName}
                        label='Nome:'
                        onChangeValue={setDialogServiceName}
                        disabled={authData.role == 'customer'}
                    />
                    <Input
                        currentValue={dialogServiceDescription}
                        label='Descrição:'
                        onChangeValue={setDialogServiceDescription}
                        disabled={authData.role == 'customer'}
                    />
                    <Input
                        currentValue={dialogServiceBasePrice}
                        type='number'
                        label='Preço base:'
                        onChangeValue={setDialogServiceBasePrice}
                        disabled={authData.role == 'customer'}
                    />
                </div>

                <div className='flex gap-4'>
                    {!isDialogEditing && (
                        <button
                            className='px-4 py-2 bg-makerYellow rounded-lg w-[50%] text-makerBg disabled:bg-makerGray disabled:text-makerBg transition-all duration-150'
                            disabled={!dialogServiceName || !dialogServiceDescription || !dialogServiceBasePrice}
                            onClick={() => createNewService()}
                        >
                            Criar Serviço
                        </button>
                    )}
                    {isDialogEditing && authData.role != 'customer' && (
                        <>
                            <button
                                className='px-4 py-2 bg-makerYellow rounded-lg w-[50%] text-makerBg disabled:bg-makerGray disabled:text-makerBg transition-all duration-150'
                                disabled={!isAnyFieldEdited}
                                onClick={() => updateService()}
                            >
                                Salvar Edição
                            </button>

                            {authData.role === 'admin' && (
                                <button
                                    className='px-4 py-2 bg-[#BC2119] rounded-lg w-[50%] text-makerBg'
                                    onClick={removeService}
                                >
                                    Remover Serviço
                                </button>
                            )}
                        </>
                    )}
                    <button
                        onClick={() => {
                            editDialogRef.current?.close();
                            setIsDialogEditing(false);
                        }}
                        className='px-4 py-2 border-2 border-makerYellow rounded-lg w-[50%] flex-1'
                    >
                        Retornar
                    </button>
                </div>
            </dialog>
        </main>
    );
}
