'use client';

import { useAuth } from '@/contexts/loginContext';
import { apiClient } from '@/services/axios';
import { useRouter } from 'next/navigation';
import { useEffect, useRef, useState } from 'react';
import { setTimeout } from 'timers';

export default function NewOrder() {
    const dialogRef = useRef<HTMLDialogElement>(null);
    const [currentNewServiceType, setCurrentNewServiceType] = useState('');
    const [newServices, setNewServices] = useState<{}[]>([]);
    const { authData } = useAuth();
    const router = useRouter();

    useEffect(() => {
        console.log(newServices);
    }, [newServices]);

    function addNewService(service: {}) {
        let updatedServices = [...newServices, service];
        // console.log(updatedServices);
        setNewServices(updatedServices);
        dialogRef.current?.close();
    }

    function createNewOrder() {
        apiClient
            .post('/orders', newServices, {
                headers: {
                    Authorization: `Bearer ${authData.access_token}`,
                },
            })
            .then(() =>
                setTimeout(() => {
                    router.replace('/orders');
                }, 2500)
            );
    }

    return (
        <main className=' bg-makerBg border-4 border-makerYellow mx-[120px] my-[60px] rounded-3xl overflow-hidden'>
            <div className='py-10 px-24 flex flex-col justify-center gap-6'>
                <h1 className='text-[24px] font-bold'>Novo pedido</h1>

                <p className='decoration-makerLinkDecoration underline decoration-2 underline-offset-4'>
                    Qual serviço você gostaria de adicionar ao pedido?
                </p>

                <div className='flex gap-5'>
                    <button
                        className='p-4 w-32 h-32 border-2 border-makerYellow rounded-xl flex items-center justify-center text-center hover:opacity-60 hover:poin'
                        onClick={() => {
                            setCurrentNewServiceType('laser_cut');
                            dialogRef.current?.showModal();
                        }}
                    >
                        Corte a Laser
                    </button>
                    {/* <button
                        className='p-4 w-32 h-32 border-2 border-makerYellow rounded-xl flex items-center justify-center text-center hover:opacity-60 hover:poin'
                        onClick={() => {
                            setCurrentNewServiceType('cnc');
                            dialogRef.current?.showModal();
                        }}
                        >
                        Router CNC
                    </button> */}
                    <button
                        className='p-4 w-32 h-32 border-2 border-makerYellow rounded-xl flex items-center justify-center text-center hover:opacity-60 hover:poin'
                        onClick={() => {
                            setCurrentNewServiceType('3dprint');
                            dialogRef.current?.showModal();
                        }}
                    >
                        Impressão 3D
                    </button>
                </div>
                <div className='flex flex-col gap-5'>
                    <p className='decoration-makerLinkDecoration underline decoration-2 underline-offset-4'>
                        Itens no pedido:
                    </p>

                    <ul className='flex flex-col gap-2 text-center items-start list-outside list-disc marker:text-makerYellow'>
                        {newServices.length > 0 &&
                            newServices.map((service, index) => (
                                <li
                                    key={index + 1}
                                    className='border-b border-makerLightGray py-2 hover:cursor-pointer'
                                    // onClick={() => showServiceDetails(service.id)}
                                >
                                    {service.service_id == 7 ? 'Impressão 3D' : 'Corte a Laser'}
                                </li>
                            ))}
                    </ul>
                    {newServices.length > 0 && (
                        <button
                            className='px-4 py-2 bg-makerYellow rounded-lg w-[50%] text-makerBg disabled:bg-makerGray disabled:text-makerBg transition-all duration-150 max-w-[400px]'
                            onClick={createNewOrder}
                        >
                            Finalizar pedido
                        </button>
                    )}
                </div>
            </div>

            <dialog
                onClose={() => dialogRef.current?.close()}
                ref={dialogRef}
                className='backdrop:bg-slate-900/60 p-10 bg-makerBg rounded-lg open:flex open:flex-col open:gap-8 open:justify-start'
            >
                {currentNewServiceType == '3dprint' && <D3PrintForm addNewService={addNewService} />}
                {currentNewServiceType == 'laser_cut' && <LaserCut addNewService={addNewService} />}
            </dialog>
        </main>
    );
}

interface D3PrintFormProps {
    addNewService: (service: Object) => void;
}
function D3PrintForm({ addNewService }: D3PrintFormProps) {
    const [plasticColor, setPlasticColor] = useState('');
    const [layerHeight, setLayerHeight] = useState(0);
    const [scale, setScale] = useState(0);
    const [usesSupport, setUsesSupport] = useState(false);
    const [infillPercentage, setInfillPercentage] = useState(0);
    const [otherParameters, setOtherParameters] = useState('');

    function setNew3DPrintService() {
        const newService = {
            service_price: 0,
            service_data: {
                plastic_color: plasticColor,
                layer_height: layerHeight,
                scale,
                uses_support: usesSupport,
                infill_percentage: infillPercentage,
                other_parameters: otherParameters,
            },
            service_id: 7,
        };
        addNewService(newService);
        setPlasticColor('');
        setLayerHeight(0);
        setScale(0);
        setUsesSupport(false);
        setInfillPercentage(0);
        setOtherParameters('');
    }

    return (
        <>
            <h1 className='text-[24px] font-bold'>Nova Impressão 3D</h1>

            <label className='flex flex-col gap-2'>
                Cor do plástico
                <input
                    value={plasticColor}
                    onChange={(e) => setPlasticColor(e.target.value)}
                    className='border-2 bg-transparent border-gray-300 rounded-lg h-12 transition-all duration-300 focus:outline-none focus:ring focus:ring-makerYellow focus:ring-offset-2 focus:ring-offset-makerBg focus:border-makerYellow p-2'
                />
            </label>

            <label className='flex flex-col gap-2'>
                Altura da camada
                <input
                    value={layerHeight}
                    type='number'
                    min={0}
                    onChange={(e) => setLayerHeight(Number(e.target.value))}
                    className='border-2 bg-transparent border-gray-300 rounded-lg h-12 transition-all duration-300 focus:outline-none focus:ring focus:ring-makerYellow focus:ring-offset-2 focus:ring-offset-makerBg focus:border-makerYellow p-2'
                />
            </label>

            <label className='flex flex-col gap-2'>
                Escala
                <input
                    value={scale}
                    type='number'
                    onChange={(e) => setScale(Number(e.target.value))}
                    className='border-2 bg-transparent border-gray-300 rounded-lg h-12 transition-all duration-300 focus:outline-none focus:ring focus:ring-makerYellow focus:ring-offset-2 focus:ring-offset-makerBg focus:border-makerYellow p-2'
                />
            </label>

            <label className='flex gap-2 items-center text-left'>
                Uso de suporte?
                <input
                    value='true'
                    type='checkbox'
                    checked={usesSupport}
                    onChange={() => setUsesSupport(!usesSupport)}
                    className='w-4 h-4 cursor-pointer accent-makerYellow/50'
                />
            </label>

            <label className='flex flex-col gap-2'>
                Porcentagem de preenchimento (número inteiro)
                <input
                    value={infillPercentage}
                    type='number'
                    step={1}
                    min={0}
                    max={100}
                    onChange={(e) => setInfillPercentage(Number(e.target.value))}
                    className='border-2 bg-transparent border-gray-300 rounded-lg h-12 transition-all duration-300 focus:outline-none focus:ring focus:ring-makerYellow focus:ring-offset-2 focus:ring-offset-makerBg focus:border-makerYellow p-2'
                />
            </label>

            <label className='flex flex-col gap-2'>
                Outros parâmetros (descreva em forma de texto):
                <textarea
                    value={otherParameters}
                    rows={2}
                    onChange={(e) => setOtherParameters(e.target.value)}
                    className='border-2 bg-transparent border-gray-300 rounded-lg transition-all duration-300 focus:outline-none focus:ring focus:ring-makerYellow focus:ring-offset-2 focus:ring-offset-makerBg focus:border-makerYellow p-2'
                />
            </label>

            <button
                className='px-4 py-2 bg-makerYellow rounded-lg w-[50%] text-makerBg disabled:bg-makerGray disabled:text-makerBg transition-all duration-150'
                onClick={setNew3DPrintService}
            >
                Adicionar
            </button>
        </>
    );
}

interface LaserCutProps {
    addNewService: (service: Object) => void;
}
function LaserCut({ addNewService }: LaserCutProps) {
    const [operationType, setOperationType] = useState('');
    const [scale, setScale] = useState(0);

    function setNew3DPrintService() {
        const newService = {
            service_price: 0,
            service_data: {
                operation_type: operationType,
                scale,
            },
            service_id: 1,
        };
        addNewService(newService);
        setOperationType('');
        setScale(0);
    }

    return (
        <>
            <h1 className='text-[24px] font-bold'>Novo Corte à Laser</h1>
            <label className='flex flex-col gap-2' htmlFor='operation_type'>
                Tipo da operação
                <select
                    name='operation_type'
                    id='operation_type'
                    value={operationType}
                    onChange={(e) => setOperationType(e.target.value)}
                    className='border-2 bg-transparent border-gray-300 rounded-lg h-12 transition-all duration-300 focus:outline-none focus:ring focus:ring-makerYellow focus:ring-offset-2 focus:ring-offset-makerBg focus:border-makerYellow p-2'
                >
                    <option value='engrave'>Gravar</option>
                    <option value='cut'>Corte</option>
                    <option value='dotted'>Pontilhado</option>
                </select>
            </label>

            <label className='flex flex-col gap-2'>
                Escala
                <input
                    value={scale}
                    type='number'
                    onChange={(e) => setScale(Number(e.target.value))}
                    className='border-2 bg-transparent border-gray-300 rounded-lg h-12 transition-all duration-300 focus:outline-none focus:ring focus:ring-makerYellow focus:ring-offset-2 focus:ring-offset-makerBg focus:border-makerYellow p-2'
                />
            </label>
            <button
                className='px-4 py-2 bg-makerYellow rounded-lg w-[50%] text-makerBg disabled:bg-makerGray disabled:text-makerBg transition-all duration-150'
                onClick={setNew3DPrintService}
            >
                Adicionar
            </button>
        </>
    );
}
