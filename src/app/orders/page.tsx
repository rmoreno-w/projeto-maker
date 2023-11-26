'use client';

import { useAuth } from '@/contexts/loginContext';
import { apiClient } from '@/services/axios';
import cloneDeep from 'lodash/cloneDeep';
import { useRouter } from 'next/navigation';
import { useEffect, useRef, useState } from 'react';

interface D3PrintServiceData {
    plastic_color: string;
    layer_height: number;
    scale: number;
    uses_support: boolean;
    infill_percentage: number;
    other_parameters: string;
}

interface LaserCutServiceData {
    operation_type: 'engrave' | 'cut' | 'dotted';
    scale: number;
}

interface ServiceInOrder {
    id: number;
    order_id: number;
    service_id: { id: number };
    service_base_price: number;
    service_price: number;
    service_data: D3PrintServiceData | LaserCutServiceData;
}

interface Order {
    id: number;
    payment_status: string;
    price: number;
    order_status: string;
    solicited_at: Date;
    paid_at: Date | null;
    started_at: Date | null;
    finished_at: Date | null;
    delivered_at: Date | null;
    customer_id: Object;
    services: Array<ServiceInOrder>;
}

const orderStatusTranslation = {
    'In analysis': 'Em análise',
    'Awaiting for approval': 'Aguardando Aprovação',
    'Not approved': 'Não aprovado',
    Approved: 'Aprovado',
    'To do': 'A fazer',
    'In progress': 'Em progresso',
    Done: 'Concluído',
    Delivered: 'Entregue',
};

const paymentStatusTranslation = {
    Unpaid: 'Não pago',
    'In analysis': 'Em análise',
    Paid: 'Pago',
};

export default function Orders() {
    const { authData } = useAuth();
    const router = useRouter();
    const dialogRef = useRef<HTMLDialogElement>(null);
    const [orders, setOrders] = useState<Order[]>([]);
    const [pickedUpOrder, setPickedUpOrder] = useState<Order>();
    const [editedFields, setEditedFields] = useState({});

    useEffect(() => {
        apiClient
            .get<Order[]>(`${authData.role == 'customer' ? '/orders/my_orders' : '/orders'}`, {
                headers: {
                    Authorization: `Bearer ${authData.access_token}`,
                },
            })
            .then((response) => {
                console.log(response.data);
                setOrders(response.data);
            })
            .catch((e) => console.log(e));
    }, []);

    useEffect(() => {
        // console.log(pickedUpOrder);
        // console.log(orders);

        const originalOrder = orders.find((order) => order.id == pickedUpOrder?.id);
        let detectedChangedFields = {};
        originalOrder &&
            Object.entries(originalOrder).forEach(([key, value]) => {
                if (key !== 'services' && key !== 'customer_id' && originalOrder[key] !== pickedUpOrder[key])
                    detectedChangedFields[key] = pickedUpOrder[key];
                if (key == 'services') {
                    const stringifiedOriginalOrder = JSON.stringify(originalOrder[key]);
                    const stringifiedPickedUpOrder = JSON.stringify(pickedUpOrder[key]);
                    if (stringifiedOriginalOrder !== stringifiedPickedUpOrder) {
                        detectedChangedFields[key] = pickedUpOrder[key];
                    }
                }
            });
        console.log(detectedChangedFields);
        setEditedFields(detectedChangedFields);
    }, [pickedUpOrder]);

    useEffect(() => {
        console.log(editedFields);
    }, [editedFields]);

    function showOrderDetails(orderId: number) {
        dialogRef.current?.showModal();
        let pickedUpOrder = orders.find((order) => order.id == orderId);
        let newPickedOrderObject = cloneDeep(pickedUpOrder);

        setPickedUpOrder(newPickedOrderObject);
    }

    async function alterOrder() {
        apiClient
            .patch(`/orders/${pickedUpOrder?.id}`, editedFields, {
                headers: {
                    Authorization: `Bearer ${authData.access_token}`,
                },
            })
            .then(() => dialogRef.current?.close())
            .catch((e) => console.log(e));
    }

    return (
        <main className=' bg-makerBg border-4 border-makerYellow mx-[120px] my-[60px] rounded-3xl overflow-hidden'>
            <div className='py-10 px-24 flex flex-col justify-center gap-3'>
                <div>
                    <h1 className='text-[24px] font-bold'>Pedidos</h1>
                    {authData.role == 'customer' && (
                        <button
                            onClick={() => router.push('/newOrder')}
                            className='hover:underline no-underline hover:decoration-2 hover:underline-offset-4 decoration-makerYellow transition-all'
                        >
                            + Criar
                        </button>
                    )}
                </div>

                <div className='flex flex-col gap-4'>
                    <div className='grid grid-cols-3 w-full gap-2 text-center'>
                        <p className='border-b-2 py-2 border-makerGray font-bold'>Status do Pagamento</p>
                        <p className='border-b-2 py-2 border-makerGray font-bold'>Status do Pedido</p>
                        <p className='border-b-2 py-2 border-makerGray font-bold'>Valor</p>
                        {orders.length > 0 ? (
                            orders.map((order) => (
                                <>
                                    <p
                                        key={order.id + order.payment_status}
                                        className='border-b border-makerLightGray py-2 hover:cursor-pointer'
                                        onClick={() => showOrderDetails(order.id)}
                                    >
                                        {paymentStatusTranslation[order.payment_status]}
                                    </p>
                                    <p
                                        key={order.id + order.order_status}
                                        className='border-b border-makerLightGray py-2 hover:cursor-pointer'
                                        onClick={() => showOrderDetails(order.id)}
                                    >
                                        {orderStatusTranslation[order.order_status]}
                                    </p>
                                    <p
                                        key={order.id + order.price}
                                        className='border-b border-makerLightGray py-2 hover:cursor-pointer'
                                        onClick={() => showOrderDetails(order.id)}
                                    >
                                        {order.price}
                                    </p>
                                </>
                            ))
                        ) : (
                            <p className='col-span-3 py-4 border-b border-makerLightGray'>
                                Ainda não há pedidos cadastrados
                            </p>
                        )}
                    </div>
                </div>
            </div>

            <dialog
                onClose={() => dialogRef.current?.close()}
                ref={dialogRef}
                className='backdrop:bg-slate-900/60 p-10 bg-makerBg rounded-lg open:flex open:flex-col open:justify-start'
            >
                <p className='text-[28px] font-bold mb-8'>Detalhes do pedido</p>
                {
                    <section className='flex flex-col gap-3 mb-6'>
                        <label className='flex flex-col gap-2 font-bold'>
                            Valor total do pedido:
                            <input
                                disabled
                                type='number'
                                value={pickedUpOrder?.price}
                                className='border-2 font-normal bg-transparent border-gray-300 rounded-lg h-12 transition-all duration-300 focus:outline-none focus:ring focus:ring-makerYellow focus:ring-offset-2 focus:ring-offset-makerBg focus:border-makerYellow p-2'
                            />
                        </label>

                        <label className='flex flex-col gap-2 font-bold' htmlFor='order_status'>
                            Status do Pedido:
                            <select
                                name='order_status'
                                id='order_status'
                                value={pickedUpOrder?.order_status}
                                disabled={authData.role == 'customer'}
                                onChange={(e) => {
                                    const updatedOrder = { ...pickedUpOrder, order_status: e.target.value };
                                    setPickedUpOrder(updatedOrder);
                                }}
                                className='border-2 font-normal bg-transparent border-gray-300 rounded-lg h-12 transition-all duration-300 focus:outline-none focus:ring focus:ring-makerYellow focus:ring-offset-2 focus:ring-offset-makerBg focus:border-makerYellow p-2'
                            >
                                <option value='In analysis'>Em análise</option>
                                <option value='Awaiting for approval'>Aguardando Aprovação</option>
                                <option value='Not approved'>Não Aprovado</option>
                                <option value='Approved'>Aprovado</option>
                                <option value='To do'>A fazer</option>
                                <option value='In progress'>Em progresso</option>
                                <option value='Done'>Concluído</option>
                                <option value='Delivered'>Entregue</option>
                            </select>
                        </label>
                        <label className='flex flex-col gap-2 font-bold' htmlFor='payment_status'>
                            Status do Pagamento:
                            <select
                                name='payment_status'
                                id='payment_status'
                                value={pickedUpOrder?.payment_status}
                                disabled={authData.role == 'customer'}
                                onChange={(e) => {
                                    const updatedOrder = { ...pickedUpOrder, payment_status: e.target.value };
                                    setPickedUpOrder(updatedOrder);
                                }}
                                className='border-2 font-normal bg-transparent border-gray-300 rounded-lg h-12 transition-all duration-300 focus:outline-none focus:ring focus:ring-makerYellow focus:ring-offset-2 focus:ring-offset-makerBg focus:border-makerYellow p-2'
                            >
                                <option value='Unpaid'>Não Pago</option>
                                <option value='In analysis'>Em análise</option>
                                <option value='Paid'>Pago</option>
                            </select>
                        </label>
                    </section>
                }
                <p className='font-bold text-[24px] mb-6'>Serviços no pedido:</p>
                <section className='flex flex-col gap-6'>
                    {pickedUpOrder?.services.map((service, index) => (
                        <article key={service.id} className='border-l border-makerYellow pl-4 flex flex-col gap-3'>
                            <p className='font-bold'>
                                {index + 1} - {service.service_id.id == 1 ? 'Corte a Laser' : 'Impressão 3D'}
                            </p>

                            <label className='flex flex-col gap-2 font-bold'>
                                Preço base do serviço
                                <input
                                    disabled
                                    type='number'
                                    value={service.service_base_price}
                                    onChange={(event) => {
                                        const updatedOrder = { ...pickedUpOrder };
                                        updatedOrder['services'][index]['service_price'] = Number(event.target.value);
                                        setPickedUpOrder(updatedOrder);
                                    }}
                                    className='border-2 font-normal bg-transparent border-gray-300 rounded-lg h-12 transition-all duration-300 focus:outline-none focus:ring focus:ring-makerYellow focus:ring-offset-2 focus:ring-offset-makerBg focus:border-makerYellow p-2'
                                />
                            </label>

                            <label className='flex flex-col gap-2 font-bold'>
                                Preço cotado para o serviço
                                <input
                                    disabled={authData.role == 'customer'}
                                    type='number'
                                    value={service.service_price}
                                    onChange={(event) => {
                                        const updatedOrder = { ...pickedUpOrder };
                                        updatedOrder['services'][index]['service_price'] = Number(event.target.value);
                                        setPickedUpOrder(updatedOrder);
                                    }}
                                    className='border-2 font-normal bg-transparent border-gray-300 rounded-lg h-12 transition-all duration-300 focus:outline-none focus:ring focus:ring-makerYellow focus:ring-offset-2 focus:ring-offset-makerBg focus:border-makerYellow p-2'
                                />
                            </label>

                            {service.service_id.id == 1 ? (
                                <>
                                    <label className='flex flex-col gap-2 font-bold'>
                                        Tipo de Operação
                                        <select
                                            disabled={authData.role == 'customer'}
                                            value={service.service_data.operation_type}
                                            onChange={(event) => {
                                                const updatedOrder = { ...pickedUpOrder };
                                                updatedOrder['services'][index]['service_data']['operation_type'] =
                                                    event.target.value;
                                                setPickedUpOrder(updatedOrder);
                                            }}
                                            className='border-2 font-normal bg-transparent border-gray-300 rounded-lg h-12 transition-all duration-300 focus:outline-none focus:ring focus:ring-makerYellow focus:ring-offset-2 focus:ring-offset-makerBg focus:border-makerYellow p-2'
                                        >
                                            <option value='engrave'>Gravar</option>
                                            <option value='cut'>Corte</option>
                                            <option value='dotted'>Pontilhado</option>
                                        </select>
                                    </label>

                                    <label className='flex flex-col gap-2 font-bold'>
                                        Escala
                                        <input
                                            disabled={authData.role == 'customer'}
                                            type='number'
                                            value={service.service_data.scale}
                                            min={0}
                                            onChange={(event) => {
                                                const updatedOrder = { ...pickedUpOrder };
                                                updatedOrder['services'][index]['service_data']['scale'] = Number(
                                                    event.target.value
                                                );
                                                setPickedUpOrder(updatedOrder);
                                            }}
                                            className='border-2 font-normal bg-transparent border-gray-300 rounded-lg h-12 transition-all duration-300 focus:outline-none focus:ring focus:ring-makerYellow focus:ring-offset-2 focus:ring-offset-makerBg focus:border-makerYellow p-2'
                                        />
                                    </label>
                                </>
                            ) : (
                                <>
                                    <label className='flex flex-col gap-2 font-bold'>
                                        Cor do Plástico
                                        <input
                                            disabled={authData.role == 'customer'}
                                            value={service.service_data.plastic_color}
                                            onChange={(event) => {
                                                const updatedOrder = { ...pickedUpOrder };
                                                updatedOrder['services'][index]['service_data']['plastic_color'] =
                                                    event.target.value;
                                                setPickedUpOrder(updatedOrder);
                                            }}
                                            className='border-2 font-normal bg-transparent border-gray-300 rounded-lg h-12 transition-all duration-300 focus:outline-none focus:ring focus:ring-makerYellow focus:ring-offset-2 focus:ring-offset-makerBg focus:border-makerYellow p-2'
                                        />
                                    </label>

                                    <label className='flex flex-col gap-2 font-bold'>
                                        Altura da Camada
                                        <input
                                            disabled={authData.role == 'customer'}
                                            value={service.service_data.layer_height}
                                            type='number'
                                            onChange={(event) => {
                                                const updatedOrder = { ...pickedUpOrder };
                                                updatedOrder['services'][index]['service_data']['layer_height'] =
                                                    Number(event.target.value);
                                                setPickedUpOrder(updatedOrder);
                                            }}
                                            className='border-2 font-normal bg-transparent border-gray-300 rounded-lg h-12 transition-all duration-300 focus:outline-none focus:ring focus:ring-makerYellow focus:ring-offset-2 focus:ring-offset-makerBg focus:border-makerYellow p-2'
                                        />
                                    </label>

                                    <label className='flex flex-col gap-2 font-bold'>
                                        Escala
                                        <input
                                            disabled={authData.role == 'customer'}
                                            value={service.service_data.scale}
                                            type='number'
                                            onChange={(event) => {
                                                const updatedOrder = { ...pickedUpOrder };
                                                updatedOrder['services'][index]['service_data']['scale'] = Number(
                                                    event.target.value
                                                );
                                                setPickedUpOrder(updatedOrder);
                                            }}
                                            className='border-2 font-normal bg-transparent border-gray-300 rounded-lg h-12 transition-all duration-300 focus:outline-none focus:ring focus:ring-makerYellow focus:ring-offset-2 focus:ring-offset-makerBg focus:border-makerYellow p-2'
                                        />
                                    </label>

                                    <label className='flex gap-2 items-center text-left font-bold'>
                                        Uso de suporte?
                                        <input
                                            type='checkbox'
                                            checked={service.service_data.uses_support}
                                            onChange={(event) => {
                                                const negated = !service.service_data.uses_support;
                                                const updatedOrder = { ...pickedUpOrder };
                                                updatedOrder['services'][index]['service_data']['uses_support'] =
                                                    negated;
                                                setPickedUpOrder(updatedOrder);
                                            }}
                                            className='w-4 h-4 cursor-pointer accent-makerYellow/50'
                                        />
                                    </label>

                                    <label className='flex flex-col gap-2 font-bold'>
                                        Porcentagem de preenchimento (número inteiro)
                                        <input
                                            disabled={authData.role == 'customer'}
                                            value={service.service_data.infill_percentage}
                                            type='number'
                                            step={1}
                                            min={0}
                                            max={100}
                                            onChange={(event) => {
                                                const updatedOrder = { ...pickedUpOrder };
                                                updatedOrder['services'][index]['service_data']['infill_percentage'] =
                                                    Number(event.target.value);
                                                setPickedUpOrder(updatedOrder);
                                            }}
                                            className='border-2 font-normal bg-transparent border-gray-300 rounded-lg h-12 transition-all duration-300 focus:outline-none focus:ring focus:ring-makerYellow focus:ring-offset-2 focus:ring-offset-makerBg focus:border-makerYellow p-2'
                                        />
                                    </label>

                                    <label className='flex flex-col gap-2 font-bold'>
                                        Outros Parâmetros:
                                        <input
                                            disabled={authData.role == 'customer'}
                                            value={service.service_data.other_parameters}
                                            onChange={(event) => {
                                                const updatedOrder = { ...pickedUpOrder };
                                                updatedOrder['services'][index]['service_data']['other_parameters'] =
                                                    event.target.value;
                                                setPickedUpOrder(updatedOrder);
                                            }}
                                            className='border-2 font-normal bg-transparent border-gray-300 rounded-lg h-12 transition-all duration-300 focus:outline-none focus:ring focus:ring-makerYellow focus:ring-offset-2 focus:ring-offset-makerBg focus:border-makerYellow p-2'
                                        />
                                    </label>
                                </>
                            )}
                        </article>
                    ))}
                </section>
                {Object.keys(editedFields).length > 0 && authData.role !== 'customer' && (
                    <button
                        className='px-4 py-2 mt-6 bg-makerYellow rounded-lg w-[50%] text-makerBg disabled:bg-makerGray disabled:text-makerBg transition-all duration-150'
                        onClick={alterOrder}
                    >
                        Salvar alterações
                    </button>
                )}
                {/* <ServiceDetails editPickedUpOrder={setPickedUpOrder} order={pickedUpOrder!} /> */}
            </dialog>
        </main>
    );
}
