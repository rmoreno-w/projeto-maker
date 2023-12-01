import * as d3 from 'd3';
import { useEffect, useRef } from 'react';

interface FinancialData {
    month: string;
    value: number;
}

interface BalanceChartProps {
    data: FinancialData[];
}

export function BalanceChart({ data }: BalanceChartProps) {
    // const [data, setData] = useState({
    //     '10/2023': 2025,
    //     '11/2023': 550,
    // });

    const width = 400;
    const height = 300;

    const svgRef = useRef<SVGSVGElement>(null);

    // const dummyData = [
    //     { month: '10/2023', value: 125.0 },
    //     { month: '11/2023', value: 135.9 },
    // ];

    const margins = {
        top: 20,
        bottom: 20,
        right: 20,
        left: 20,
    };

    console.log(data.map((d) => d.value));

    const yScale = d3
        .scaleLinear()
        .domain([0, d3.max(data.map((d) => d.value)) as number]) // d3.extent pega os minimos e maximos
        .range([height - margins.bottom, margins.top]);

    useEffect(() => {
        // Setting up SVG
        const svg = d3.select(svgRef?.current);
        // Setting up scale
        // const xScale = d3.scaleLinear().domain([0, 20]).range([0, 400]);
        // Setting up axis
        // Setting up data

        const xScale = d3
            .scaleBand()
            // .domain(d3.extent(dummyData.map((d) => d[0]))) // d3.extent pega os minimos e maximos
            // .domain([0, d3.max((d) => d.month)]) // d3.extent pega os minimos e maximos
            .domain(data.map((d) => d.month)) // d3.extent pega os minimos e maximos
            .range([margins.left, width - margins.right])
            .padding(0.2);

        svg.append('g')
            .call(d3.axisBottom(xScale).tickSize(0).tickPadding(5))
            .attr('transform', `translate(0, ${height - margins.bottom})`)
            .attr('stroke-width', '1.5px')
            .attr('class', 'text-gray-400');

        svg.selectAll('.bar')
            .data(data)
            .enter()
            .append('rect')
            .attr('class', 'bar')
            // .attr('class', 'hover:opacity-85')
            .attr('x', (d) => xScale(d.month) as number)
            .attr('y', (d) => yScale(d.value))
            .attr('height', (d) => yScale(0) - yScale(d.value))
            .attr('width', xScale.bandwidth())
            .attr('fill', '#F3B70095');

        // svg.append('text').text('Total vendido no mês').attr('x', margins.right).attr('y', margins.top);
    }, [data]);

    // const line = d3
    //     .line()
    //     .x((d) => xScale(d[0]))
    //     .y((d) => yScale(d[1]));

    const xScale = d3
        .scaleBand()
        // .domain(d3.extent(dummyData.map((d) => d[0]))) // d3.extent pega os minimos e maximos
        // .domain([0, d3.max((d) => d.month)]) // d3.extent pega os minimos e maximos
        .domain(data.map((d) => d.month)) // d3.extent pega os minimos e maximos
        .range([margins.left, width - margins.right])
        .padding(0.2);

    // const bars = d3.area();
    // const result = data;
    return (
        <svg ref={svgRef} viewBox={`0 0 ${width} ${height}`}>
            {/* <path d={result} fill='none' stroke='currentColor' /> */}
            {yScale.ticks(10).map((max) => (
                <g transform={`translate(0, ${yScale(max)})`} className='text-gray-400' key={max}>
                    <line x1={margins.left} x2={width - margins.right} stroke='currentColor' strokeDasharray='1,3' />
                    <text alignmentBaseline='middle' className='text-[10px]' fill='currentColor'>
                        {max}
                    </text>
                </g>
            ))}
            {/* {xScale.ticks().map((max) => (
                <g transform={`translate(0, ${yScale(max)})`} className='text-gray-400' key={max}>
                    <line x1={margins.left} x2={width - margins.right} stroke='currentColor' strokeDasharray='1,3' />
                    <text alignmentBaseline='middle' className='text-[10px]' fill='currentColor'>
                        {max}
                    </text>
                </g>
            ))} */}
            {/* {axisBottom(xScale)} */}
        </svg>
    );
}
