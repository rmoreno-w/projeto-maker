import { useState } from 'react';
import { BalanceChartTab } from '../BalanceChartTab';

export function ChartsTab() {
    const [activeTab, setActiveTab] = useState<'financial' | 'material'>('financial');
    return (
        <>
            <ul className='flex w-[80%] gap-2'>
                <li
                    className={`flex items-center justify-center px-4 py-2 w-28 ${
                        activeTab == 'financial' ? 'border-b-2 border-makerYellow ' : ''
                    }`}
                    onClick={() => setActiveTab('financial')}
                >
                    Financeiro
                </li>
                <li
                    className={`flex items-center justify-center px-4 py-2 w-28 ${
                        activeTab == 'material' ? 'border-b-2  border-makerYellow' : ''
                    }`}
                    onClick={() => setActiveTab('material')}
                >
                    Materiais
                </li>
            </ul>

            {activeTab == 'financial' ? <BalanceChartTab /> : <h1>Materiais</h1>}
        </>
    );
}
