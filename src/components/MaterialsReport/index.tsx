type MaterialData = {
    name: string;
    unit: string;
    values: {
        [month: string]: number;
    };
};
interface MaterialsChartProps {
    data: MaterialData[];
}
export function MaterialsReport({ data }: MaterialsChartProps) {
    // console.log(data);
    return data.length > 0 ? (
        data.map((material) => (
            <article className='flex flex-col gap-6 border-l-2 border-makerYellow pl-6 py-4 max-w-[50%]'>
                <div className='flex flex-col gap-3'>
                    <p className='border-b border-makerYellow/80 pb-1 max-w-fit font-semibold text-lg'>
                        {material.name} - (Unidade: {material.unit})
                    </p>

                    <p>Quantidades consumidas (Mês - Quantidade)</p>

                    <ul className='list-disc list-inside marker:text-makerYellow'>
                        {Object.entries(material.values).map(([month, value]) => (
                            <li>
                                {`${month}`} <span className='pl-4'>{`${value} ${material.unit}(s)`}</span>
                            </li>
                        ))}
                    </ul>
                </div>
            </article>
        ))
    ) : (
        <p className='border-l-2 border-makerYellow px-4 max-w-fit'>Nenhum material foi consumido neste período</p>
    );
}
