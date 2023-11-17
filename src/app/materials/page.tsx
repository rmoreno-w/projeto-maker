'use client';

import { Input } from '@/components/Input';
import { useAuth } from '@/contexts/loginContext';
import { apiClient } from '@/services/axios';
import { useEffect, useRef, useState } from 'react';

interface Material {
    id: number;
    name: string;
    description: string;
    quantity: number;
    unit: string;
}

export default function Materials() {
    const { authData } = useAuth();
    const [materials, setMaterials] = useState<Material[]>([]);

    const [dialogMaterialId, setDialogMaterialId] = useState(0);
    const [dialogMaterialName, setDialogMaterialName] = useState('');
    const [dialogMaterialDescription, setDialogMaterialDescription] = useState('');
    const [dialogMaterialQuantity, setDialogMaterialQuantity] = useState('');
    const [dialogMaterialUnit, setDialogMaterialUnit] = useState('');
    const [isDialogEditing, setIsDialogEditing] = useState(false);
    const [isAnyFieldEdited, setIsAnyFieldEdited] = useState(false);
    const [editedFields, setEditFields] = useState({});

    const editDialogRef = useRef<HTMLDialogElement>(null);

    useEffect(() => {
        if (isDialogEditing == true) {
            let originalObject = materials.find((material) => material.id == dialogMaterialId);

            const newEditingObject = {
                name: dialogMaterialName !== originalObject?.name && dialogMaterialName,
                description: dialogMaterialDescription !== originalObject?.description && dialogMaterialDescription,
                quantity: Number(dialogMaterialQuantity) !== originalObject?.quantity && Number(dialogMaterialQuantity),
                unit: dialogMaterialUnit !== originalObject?.unit && dialogMaterialUnit,
            };

            let currentlyEditedFields: Partial<Material> = {};
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
    }, [dialogMaterialDescription, dialogMaterialName, dialogMaterialQuantity, dialogMaterialUnit]);

    useEffect(() => {
        apiClient
            .get<Material[]>('/materials', {
                headers: {
                    Authorization: `Bearer ${authData.access_token}`,
                    // authData.access_token !== ''
                    //     ? `Bearer ${authData.access_token}`
                    //     : `Bearer ${alternativeTokenLocalStorage}`,
                },
            })
            .then((response) => {
                console.log(response.data);
                setMaterials(response.data);
            })
            .catch((e) => {
                console.log(e);
            });
    }, []);

    function openCreateMaterialModal() {
        setDialogMaterialId(0);
        setDialogMaterialName('');
        setDialogMaterialDescription('');
        setDialogMaterialQuantity('');
        setDialogMaterialUnit('');
        editDialogRef.current?.showModal();
    }

    function showMaterialDetails(id: number) {
        const foundMaterial = materials.find((material) => material.id == id);

        setDialogMaterialName(foundMaterial!.name);
        setDialogMaterialDescription(foundMaterial!.description);
        setDialogMaterialQuantity(String(foundMaterial!.quantity));
        setDialogMaterialUnit(foundMaterial!.unit);
        setDialogMaterialId(foundMaterial!.id);

        editDialogRef.current?.showModal();
        setIsDialogEditing(true);
    }

    async function updateMaterial() {
        apiClient
            .patch(`/materials/${dialogMaterialId}`, editedFields, {
                headers: { Authorization: `Bearer ${authData.access_token}` },
            })
            .then((data) => {
                setEditFields(false);
                setIsDialogEditing(false);

                const updatedMaterials = materials.map((material) => {
                    return material.id == dialogMaterialId ? { ...material, ...editedFields } : material;
                });

                setMaterials(updatedMaterials);
                // console.log(updatedMaterials);

                editDialogRef.current?.close();
            })
            .catch((e) => console.log(e));
    }

    async function createNewMaterial() {
        const newMaterial = {
            name: dialogMaterialName,
            description: dialogMaterialDescription,
            quantity: Number(dialogMaterialQuantity),
            unit: dialogMaterialUnit,
        };
        apiClient
            .post(`/materials/`, newMaterial, {
                headers: { Authorization: `Bearer ${authData.access_token}` },
            })
            .then((data) => {
                setEditFields(false);

                const newMaterialToInsert = { ...newMaterial, id: data.id };
                const updatedMaterials = [...materials, newMaterialToInsert];
                setMaterials(updatedMaterials);

                // console.log(newMaterial);
                editDialogRef.current?.close();
            })
            .catch((e) => console.log(e));
    }

    return (
        <main className=' bg-makerBg border-4 border-makerYellow mx-[120px] my-[60px] rounded-3xl overflow-hidden'>
            <div className='py-10 px-24 flex flex-col justify-center gap-3'>
                <div>
                    <h1 className='text-[24px] font-bold'>Materiais</h1>{' '}
                    {authData.role === 'admin' && (
                        <button
                            onClick={openCreateMaterialModal}
                            className='hover:underline no-underline hover:decoration-2 hover:underline-offset-4 decoration-makerYellow transition-all'
                        >
                            + Criar
                        </button>
                    )}
                </div>

                {materials.length != 0 ? (
                    <div className='flex flex-col gap-4'>
                        <div className='grid grid-cols-2 w-full gap-2 text-center'>
                            <p className='border-b-2 py-2 border-makerGray font-bold'>Nome</p>
                            <p className='border-b-2 py-2 border-makerGray font-bold'>Descrição</p>

                            {materials.map((material) => (
                                <>
                                    <p
                                        key={material.id + material.name}
                                        className='border-b border-makerLightGray py-2 hover:cursor-pointer'
                                        onClick={() => showMaterialDetails(material.id)}
                                    >
                                        {material.name}
                                    </p>
                                    <p
                                        key={material.id + material.description}
                                        className='border-b border-makerLightGray py-2 hover:cursor-pointer truncate'
                                        onClick={() => showMaterialDetails(material.id)}
                                    >
                                        {material.description}
                                    </p>
                                </>
                            ))}
                        </div>
                    </div>
                ) : (
                    <p>Ainda não há materiais cadastrados</p>
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
                    Detalhes do material
                </strong>

                <div className='flex flex-col gap-4 text-ellipsis'>
                    <Input currentValue={dialogMaterialName} label='Nome:' onChangeValue={setDialogMaterialName} />
                    <Input
                        currentValue={dialogMaterialDescription}
                        label='Descrição:'
                        onChangeValue={setDialogMaterialDescription}
                    />
                    <Input
                        currentValue={dialogMaterialQuantity}
                        type='number'
                        label='Quantidade:'
                        onChangeValue={setDialogMaterialQuantity}
                    />
                    <Input currentValue={dialogMaterialUnit} label='Unidade:' onChangeValue={setDialogMaterialUnit} />
                </div>

                <div className='flex gap-4'>
                    {!isDialogEditing && (
                        <button
                            className='px-4 py-2 bg-makerYellow rounded-lg w-[50%] text-makerBg disabled:bg-makerGray disabled:text-makerBg transition-all duration-150'
                            disabled={
                                !dialogMaterialName ||
                                !dialogMaterialDescription ||
                                !dialogMaterialQuantity ||
                                !dialogMaterialUnit
                            }
                            onClick={() => createNewMaterial()}
                        >
                            Criar Material
                        </button>
                    )}
                    {isDialogEditing && (
                        <>
                            <button
                                className='px-4 py-2 bg-makerYellow rounded-lg w-[50%] text-makerBg disabled:bg-makerGray disabled:text-makerBg transition-all duration-150'
                                disabled={!isAnyFieldEdited}
                                onClick={() => updateMaterial()}
                            >
                                Salvar Edição
                            </button>

                            {authData.role === 'admin' && (
                                <button className='px-4 py-2 bg-[#BC2119] rounded-lg w-[50%] text-makerBg'>
                                    Remover Material
                                </button>
                            )}
                        </>
                    )}
                    <button
                        onClick={() => {
                            editDialogRef.current?.close();
                            setIsDialogEditing(false);
                        }}
                        className='px-4 py-2 border-2 border-makerYellow rounded-lg w-[50%]'
                    >
                        Retornar
                    </button>
                </div>
            </dialog>
        </main>
    );
}
