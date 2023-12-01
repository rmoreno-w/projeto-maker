import { useState } from 'react';
import { BalanceChartTab } from '../BalanceChartTab';
import { MaterialsReportTab } from '../MaterialsReportTab';

export function ChartsTab() {
    const [activeTab, setActiveTab] = useState<'financial' | 'material'>('financial');
    return (
        <>
            <ul className='flex w-fit gap-2 border-b-2 border-makerLinkDecoration'>
                <li
                    className={`flex items-center justify-center px-4 py-2 w-28 hover:cursor-pointer border-t-2 border-x-2  ${
                        activeTab == 'financial' ? 'border-makerYellow rounded-t-lg' : 'border-makerBg'
                    }`}
                    onClick={() => setActiveTab('financial')}
                >
                    Financeiro
                </li>
                <li
                    className={`flex items-center justify-center px-4 py-2 w-28 hover:cursor-pointer border-t-2 border-x-2 ${
                        activeTab == 'material' ? 'border-makerYellow rounded-t-lg' : 'border-makerBg'
                    }`}
                    onClick={() => setActiveTab('material')}
                >
                    Materiais
                </li>
            </ul>

            {activeTab == 'financial' ? <BalanceChartTab /> : <MaterialsReportTab />}
        </>
    );
}
