import { ResponsiveLine } from '@nivo/line';
import { useMemo } from 'react';

const DashboardCompletedProgress = ({ recentStatistics = [] }) => {
  const filteredStatistics = useMemo(() => {
    const sortedStats = recentStatistics
      .sort((a, b) => new Date(a.date) - new Date(b.date))
      .slice(-14)
      .filter((item) => !isNaN(item.successCount) && item.successCount !== null);
    return sortedStats;
  }, [recentStatistics]);

  const data = [
    {
      id: 'progress',
      color: 'hsl(263, 70%, 50%)',
      data: filteredStatistics.map((item) => ({
        x: item.date,
        y: item.successCount,
      })),
    },
  ];

  const maxYValue = useMemo(() => {
    const allYValues = data.flatMap((series) => series.data.map((point) => point.y));
    return Math.ceil(Math.max(...allYValues) * 1.1);
  }, [data]);

  const tickValues = useMemo(() => {
    const allYValues = data.flatMap((series) => series.data.map((point) => point.y));
    const minY = Math.floor(Math.min(...allYValues) / 10) * 10;
    const maxY = Math.ceil(Math.max(...allYValues) / 10) * 10;

    const tickCount = 10;
    const step = Math.ceil((maxY - minY) / tickCount / 10) * 10;

    return Array.from({ length: tickCount }, (_, i) => minY + i * step);
  }, [data]);

  return (
    <div className='w-full mt-4 bg-white border border-solid rounded-sm border-black p-2'>
      <div className='w-full h-60 relative'>
        {/* 차트 이름 추가 */}
        <div
          style={{
            position: 'absolute',
            top: 10,
            left: 20,
            fontSize: '14px',
            fontWeight: 'bold',
            zIndex: 10,
          }}
        >
          API Completion Count
        </div>

        <ResponsiveLine
          data={data}
          margin={{ top: 50, right: 85, bottom: 30, left: 70 }}
          xScale={{ type: 'point' }}
          yScale={{
            type: 'linear',
            min: 0,
            max: maxYValue > 0 ? maxYValue : 10,
            stacked: false,
            reverse: false,
          }}
          yFormat=' >-.2f'
          curve='natural'
          axisTop={null}
          axisRight={null}
          axisBottom={{
            tickSize: 5,
            tickPadding: 5,
            tickRotation: 0,
            legend: 'Date',
            legendOffset: 36,
            legendPosition: 'middle',
          }}
          axisLeft={{
            tickSize: 4,
            tickPadding: 3,
            tickRotation: 0,
            tickValues: tickValues,
            legend: 'Count',
            legendOffset: -40,
            legendPosition: 'middle',
          }}
          enableGridY={false}
          colors={['#BCDDF1']}
          lineWidth={3}
          pointSize={3}
          pointColor={{ theme: 'background' }}
          pointBorderWidth={1}
          pointBorderColor={{ from: 'serieColor', modifiers: [] }}
          pointLabelYOffset={-12}
          enableArea={true}
          areaOpacity={0.35}
          areaBaselineValue={0}
          defs={[
            {
              id: 'customAreaColor',
              type: 'linearGradient',
              colors: [
                { offset: 0, color: '#97CAE8' },
                { offset: 100, color: '#97CAE8' },
              ],
            },
          ]}
          fill={[{ match: '*', id: 'customAreaColor' }]}
          enableTouchCrosshair={true}
          useMesh={true}
          tooltip={({ point }) => (
            <div
              style={{
                background: '#fff',
                padding: '5px 10px',
                border: '1px solid #ddd',
                borderRadius: '4px',
                fontSize: '12px',
              }}
            >
              Count: {point.data.y}
            </div>
          )}
        />
      </div>
    </div>
  );
};

export default DashboardCompletedProgress;
