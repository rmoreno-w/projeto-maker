'use client';
import { ChartsTab } from '@/components/ChartsTab';
import { useAuth } from '@/contexts/loginContext';
import { useEffect, useState } from 'react';

export default function Reports() {
    const [initialDate, setInitialDate] = useState('');
    const [finalDate, setFinalDate] = useState('');
    const { authData } = useAuth();
    const [reportType, setReportType] = useState<'financial' | 'material'>('financial');

    useEffect(() => {
        console.log(initialDate);
    }, [initialDate]);

    return (
        <main className=' bg-makerBg border-4 border-makerYellow mx-[120px] my-[60px] rounded-3xl overflow-hidden'>
            <div className='py-10 px-24 flex flex-col justify-center gap-6'>
                <h1 className='text-[24px] font-bold'>Relatórios</h1>

                <ChartsTab />
            </div>
        </main>
    );
}
