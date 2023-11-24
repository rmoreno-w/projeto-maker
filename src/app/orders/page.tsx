'use client';

import { useAuth } from '@/contexts/loginContext';
import { apiClient } from '@/services/axios';
import { useRouter } from 'next/navigation';
import { useEffect, useRef, useState } from 'react';

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
    services: Array<any>;
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
    const [currentOrderType, setCurrentOrderType] = useState('');

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

    function showOrderDetails(orderId: number) {
        dialogRef.current?.showModal();
        let pickedUpOrder = orders.find((order) => order.id == orderId);

        setPickedUpOrder(pickedUpOrder);
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
                className='backdrop:bg-slate-900/60 p-10 bg-makerBg rounded-lg open:flex open:flex-col open:gap-4 open:justify-start'
            >
                <p className='text-[24px] font-bold'>Detalhes do pedido</p>
                {
                    <>
                        <p>
                            Status do Pedido: <span>{pickedUpOrder?.order_status}</span>
                        </p>
                        <p>
                            Status do Pagamento: <span>{pickedUpOrder?.payment_status}</span>
                        </p>
                        <p>
                            Preço do Pedido: <span>{pickedUpOrder?.payment_status}</span>
                        </p>
                        <p>Serviços no pedido:</p>
                    </>
                }
                <ServiceDetails order={pickedUpOrder!} />
            </dialog>
        </main>
    );
}

interface serviceDetailsProps {
    order: Order;
}
function ServiceDetails({ order }: serviceDetailsProps) {
    return order?.services.map((service, index) => (
        <div className='border-l border-makerLinkDecoration pl-4'>
            <p className='font-bold'>Serviço {index + 1}</p>
            <p>Preço inicial: {service.service_price}</p>
            <p>Preço cotado: {service.service_price}</p>

            {service.service_id.id == 1 ? (
                <>
                    <p>Tipo de operação: {service.service_data.operation_type}</p>
                    <p>Escala: {service.service_data.scale}</p>
                </>
            ) : (
                <>
                    <p>Cor do plástico: {service.service_data.plastic_color}</p>
                    <p>Altura da camada: {service.service_data.layer_height}</p>
                    <p>Porcentagem de preenchimento: {service.service_data.infill_percentage}</p>
                    <p>Escala: {service.service_data.scale}</p>
                    <p>Usa suporte? {service.service_data.uses_support}</p>
                    <p>Outros Parametros {service.service_data.other_parameters}</p>
                </>
            )}
        </div>
    ));
}
