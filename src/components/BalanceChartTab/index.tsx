import { useAuth } from '@/contexts/loginContext';
import { apiClient } from '@/services/axios';
import dayjs from 'dayjs';
import { useState } from 'react';
import { BalanceChart } from '../BalanceChart';

interface FinancialData {
    [key: string]: number;
}
export function BalanceChartTab() {
    const [initialDate, setInitialDate] = useState('');
    const [finalDate, setFinalDate] = useState('');
    const [chartData, setChartData] = useState();
    const { authData } = useAuth();

    return (
        <section className='flex flex-col gap-3'>
            <h3>Informe datas de início e de fim do período para calcular o relatório</h3>
            <div className='flex gap-3'>
                <label className='flex gap-2 justify-center items-center'>
                    Início:
                    <input
                        type='date'
                        value={initialDate}
                        onChange={(e) => setInitialDate(dayjs(e.target.value).format('YYYY-MM-DD'))}
                        className='bg-transparent px-4 py-2 border-b border-makerYellow'
                    />
                </label>

                <label className='flex gap-2 justify-center items-center'>
                    Fim:
                    <input
                        type='date'
                        value={finalDate}
                        onChange={(e) => setFinalDate(dayjs(e.target.value).format('YYYY-MM-DD'))}
                        className='bg-transparent px-4 py-2 border-b border-makerYellow'
                        max={dayjs().format('YYYY-MM-DD')}
                    />
                </label>

                <button
                    className='border-2 border-makerYellow px-6 py-2 rounded-xl'
                    onClick={() =>
                        apiClient
                            .post(
                                '/reports/balance',
                                {
                                    initial_date: dayjs(initialDate + 'T20:59').toISOString(),
                                    final_date: dayjs(
                                        finalDate || dayjs().format('YYYY-MM-DD') + 'T20:59'
                                    ).toISOString(),
                                },
                                {
                                    headers: { Authorization: `Bearer ${authData.access_token}` },
                                }
                            )
                            .then((response) => {
                                console.log(response.data);
                                setChartData(response.data);
                            })
                            .catch((error) => console.log(error))
                    }
                >
                    Mandar
                </button>
            </div>

            {chartData && (
                <>
                    <p>{JSON.stringify(chartData)}</p>
                    <div className='h-[400px] flex justify-center mb-6 px-5 overflow-hidden text-makerYellow border border-makerYellow'>
                        <BalanceChart />
                    </div>
                </>
            )}
        </section>
    );
}
