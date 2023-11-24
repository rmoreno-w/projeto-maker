'use client';

import { Input } from '@/components/Input';
import { useAuth } from '@/contexts/loginContext';
import { apiClient } from '@/services/axios';
import { useEffect, useRef, useState } from 'react';

interface Team {
    id: number;
    area: string;
    description: string;
}

export default function Materials() {
    const { authData } = useAuth();
    const [teams, setTeams] = useState<Team[]>([]);

    const [dialogTeamId, setDialogTeamId] = useState(0);
    const [dialogTeamArea, setDialogTeamArea] = useState('');
    const [dialogTeamDescription, setDialogTeamDescription] = useState('');
    const [isDialogEditing, setIsDialogEditing] = useState(false);
    const [isAnyFieldEdited, setIsAnyFieldEdited] = useState(false);
    const [editedFields, setEditFields] = useState({});

    const editDialogRef = useRef<HTMLDialogElement>(null);

    useEffect(() => {
        if (isDialogEditing == true) {
            let originalObject = teams.find((team) => team.id == dialogTeamId);

            const newEditingObject = {
                area: dialogTeamArea !== originalObject?.area && dialogTeamArea,
                description: dialogTeamDescription !== originalObject?.description && dialogTeamDescription,
            };

            let currentlyEditedFields: Partial<Team> = {};
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
    }, [dialogTeamArea, dialogTeamDescription]);

    useEffect(() => {
        apiClient
            .get<Team[]>('/teams', {
                headers: {
                    Authorization: `Bearer ${authData.access_token}`,
                    // authData.access_token !== ''
                    //     ? `Bearer ${authData.access_token}`
                    //     : `Bearer ${alternativeTokenLocalStorage}`,
                },
            })
            .then((response) => {
                console.log(response.data);
                setTeams(response.data);
            })
            .catch((e) => {
                console.log(e);
            });
    }, []);

    function openCreateMaterialModal() {
        setDialogTeamId(0);
        setDialogTeamArea('');
        setDialogTeamDescription('');
        editDialogRef.current?.showModal();
    }

    function showTeamDetails(id: number) {
        const foundTeam = teams.find((team) => team.id == id);

        setDialogTeamArea(foundTeam!.area);
        setDialogTeamDescription(foundTeam!.description);
        setDialogTeamId(foundTeam!.id);

        editDialogRef.current?.showModal();
        setIsDialogEditing(true);
    }

    // async function updateTeam() {
    //     apiClient
    //         .patch(`/teams/${dialogTeamId}`, editedFields, {
    //             headers: { Authorization: `Bearer ${authData.access_token}` },
    //         })
    //         .then((data) => {
    //             setEditFields(false);
    //             setIsDialogEditing(false);

    //             const updatedTeams = teams.map((team) => {
    //                 return team.id == dialogTeamId ? { ...teams, ...editedFields } : team;
    //             });

    //             setTeams(updatedTeams);
    //             // console.log(updatedMaterials);

    //             editDialogRef.current?.close();
    //         })
    //         .catch((e) => console.log(e));
    // }

    async function createNewTeam() {
        const newTeam = {
            area: dialogTeamArea,
            description: dialogTeamDescription,
        };
        apiClient
            .post(`/teams/`, newTeam, {
                headers: { Authorization: `Bearer ${authData.access_token}` },
            })
            .then((data) => {
                setEditFields(false);

                const newTeamToInsert = { ...newTeam, id: data.id };
                const updatedTeams = [...teams, newTeamToInsert];
                setTeams(updatedTeams);

                // console.log(newMaterial);
                editDialogRef.current?.close();
            })
            .catch((e) => console.log(e));
    }

    function removeTeam() {
        // console.log(`id: ${userId}, type: ${userType}`);
        apiClient
            .delete(`/teams/${dialogTeamId}`, {
                headers: {
                    Authorization: `Bearer ${authData.access_token}`,
                },
            })
            .then((result) => {
                console.log(result);

                const updatedTeamsList = teams.filter((team) => team.id != dialogTeamId);
                // console.log(typeof updatedCustomersList);
                setTeams(updatedTeamsList);
                // setAreFieldsEdited(false);}
                editDialogRef.current?.close();
            })
            .catch((e) => {
                console.log(e);
            });
    }

    return (
        <main className=' bg-makerBg border-4 border-makerYellow mx-[120px] my-[60px] rounded-3xl overflow-hidden'>
            <div className='py-10 px-24 flex flex-col justify-center gap-3'>
                <div>
                    <h1 className='text-[24px] font-bold'>Equipes</h1>{' '}
                    {authData.role === 'admin' && (
                        <button
                            onClick={openCreateMaterialModal}
                            className='hover:underline no-underline hover:decoration-2 hover:underline-offset-4 decoration-makerYellow transition-all'
                        >
                            + Criar
                        </button>
                    )}
                </div>

                {teams.length != 0 ? (
                    <div className='flex flex-col gap-4'>
                        <div className='grid grid-cols-2 w-full gap-2 text-center'>
                            <p className='border-b-2 py-2 border-makerGray font-bold'>Área</p>
                            <p className='border-b-2 py-2 border-makerGray font-bold'>Descrição</p>

                            {teams.map((team) => (
                                <>
                                    <p
                                        key={team.id + team.area}
                                        className='border-b border-makerLightGray py-2 hover:cursor-pointer'
                                        onClick={() => showTeamDetails(team.id)}
                                    >
                                        {team.area}
                                    </p>
                                    <p
                                        key={team.id + team.description}
                                        className='border-b border-makerLightGray py-2 hover:cursor-pointer truncate'
                                        onClick={() => showTeamDetails(team.id)}
                                    >
                                        {team.description}
                                    </p>
                                </>
                            ))}
                        </div>
                    </div>
                ) : (
                    <p>Ainda não há equipes cadastradas</p>
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
                    Detalhes da Equipe
                </strong>

                <div className='flex flex-col gap-4 text-ellipsis'>
                    <Input currentValue={dialogTeamArea} label='Área:' onChangeValue={setDialogTeamArea} />
                    <Input
                        currentValue={dialogTeamDescription}
                        label='Descrição:'
                        onChangeValue={setDialogTeamDescription}
                    />
                </div>

                <div className='flex gap-4'>
                    {!isDialogEditing && (
                        <button
                            className='px-4 py-2 bg-makerYellow rounded-lg w-[50%] text-makerBg disabled:bg-makerGray disabled:text-makerBg transition-all duration-150'
                            disabled={!dialogTeamArea || !dialogTeamDescription}
                            onClick={() => createNewTeam()}
                        >
                            Criar Equipe
                        </button>
                    )}
                    {isDialogEditing && (
                        <>
                            <button
                                className='px-4 py-2 bg-makerYellow rounded-lg w-[50%] text-makerBg disabled:bg-makerGray disabled:text-makerBg transition-all duration-150'
                                disabled={!isAnyFieldEdited}
                                // onClick={() => updateTeam()}
                            >
                                Salvar Edição
                            </button>

                            {authData.role === 'admin' && (
                                <button
                                    className='px-4 py-2 bg-[#BC2119] rounded-lg w-[50%] text-makerBg'
                                    onClick={removeTeam}
                                >
                                    Remover Equipe
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
