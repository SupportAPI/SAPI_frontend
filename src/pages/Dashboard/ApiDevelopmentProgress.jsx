import { ResponsiveLine } from '@nivo/line';
import { useMemo } from 'react';

const DashboardCompletedProgress = () => {

    const data = [
        {
            "id": "norway",
            "color": "hsl(263, 70%, 50%)",
            "data": [
                { "x": 1, "y": 295 },
                { "x": 2, "y": 108 },
                { "x": 3, "y": 291 },
                { "x": 4, "y": 75 },
                { "x": 5, "y": 254 },
                { "x": 6, "y": 135 },
                { "x": 7, "y": 14 },
                { "x": 8, "y": 184 },
                { "x": 9, "y": 83 },
                { "x": 10, "y": 142 },
                { "x": 11, "y": 29 },
                { "x": 12, "y": 241 },
                { "x": 13, "y": 295 },
                { "x": 14, "y": 108 },
                { "x": 15, "y": 291 },
                { "x": 16, "y": 75 },
                { "x": 17, "y": 254 },
                { "x": 18, "y": 135 },
                { "x": 19, "y": 14 },
                { "x": 20, "y": 184 },
                { "x": 21, "y": 83 },
                { "x": 22, "y": 142 },
                { "x": 23, "y": 29 },
                { "x": 24, "y": 241 },
                { "x": 25, "y": 295 },
                { "x": 26, "y": 250 },
                { "x": 27, "y": 210 },
                { "x": 28, "y": 200 },
                { "x": 29, "y": 180 },
                { "x": 30, "y": 130 },
            ]
        }
    ];

    const tickValues = useMemo(() => {
        const allYValues = data.flatMap(series => series.data.map(point => point.y));
        const minY = Math.floor(Math.min(...allYValues)/10)*10;
        const maxY = Math.ceil(Math.max(...allYValues)/10)*10;

        const tickCount = 10;
        const step = Math.ceil((maxY - minY) / tickCount / 10) * 10;

        return Array.from({ length: tickCount }, (_, i) => minY + i * step);
    }, [data]);

    return (
        <div className="w-full h-full mb-24 bg-white border border-solid rounded-md border-black p-2">
            <div className="w-full h-80">
                <ResponsiveLine
                    data={data}
                    margin={{ top: 50, right: 85, bottom: 30, left: 70 }}
                    xScale={{ type: 'point' }}
                    yScale={{
                        type: 'linear',
                        min: 'auto',
                        max: 'auto',
                        stacked: true,
                        reverse: false
                    }}
                    yFormat=" >-.2f"
                    curve="natural"
                    axisTop={null}
                    axisRight={null}
                    axisBottom={{
                        tickSize: 5,
                        tickPadding: 5,
                        tickRotation: 0,
                        legend: 'transportation',
                        legendOffset: 36,
                        legendPosition: 'middle',
                        truncateTickAt: 0
                    }}
                    axisLeft={{
                        tickSize: 4,
                        tickPadding: 3,
                        tickRotation: 0,
                        tickValues: tickValues, 
                        legend: 'count',
                        legendOffset: -40,
                        legendPosition: 'middle',
                        truncateTickAt: 0
                    }}
                    enableGridY={false}
                    colors={['#15ADFF']} 
                    lineWidth={3}
                    pointSize={3}
                    pointColor={{ theme: 'background' }}
                    pointBorderWidth={1}
                    pointBorderColor={{ from: 'serieColor', modifiers: [] }}
                    pointLabel="data.yFormatted"
                    pointLabelYOffset={-12}
                    enableArea={true}
                    areaOpacity={0.35} 
                    areaBaselineValue={0} 
                    defs={[
                        {
                            id: 'customAreaColor', 
                            type: 'linearGradient',
                            colors: [
                                { offset: 0, color: '#96DAFF' }, 
                                { offset: 100, color: '#96DAFF' },
                            ],
                        },
                    ]}
                    fill={[{ match: '*', id: 'customAreaColor' }]} // 영역에 적용할 패턴 설정
                    enableTouchCrosshair={true}
                    useMesh={true}
                    legends={[
                        {
                            anchor: 'bottom-right',
                            direction: 'column',
                            justify: false,
                            translateX: 100,
                            translateY: 0,
                            itemsSpacing: 0,
                            itemDirection: 'left-to-right',
                            itemWidth: 80,
                            itemHeight: 20,
                            itemOpacity: 0.75,
                            symbolSize: 12,
                            symbolShape: 'circle',
                            symbolBorderColor: 'rgba(0, 0, 0, .5)',
                            effects: [
                                {
                                    on: 'hover',
                                    style: {
                                        itemBackground: 'rgba(0, 0, 0, .03)',
                                        itemOpacity: 1
                                    }
                                }
                            ]
                        }
                    ]}
                />
            </div>
        </div>
    );
};

export default DashboardCompletedProgress;