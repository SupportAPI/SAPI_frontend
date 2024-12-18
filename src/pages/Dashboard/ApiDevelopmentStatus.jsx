import { ResponsiveRadialBar } from '@nivo/radial-bar';

const DashboardCompletedPie = ({ data = [], maxValue, title }) => {
  const radialData = Array.isArray(data) ? data : [];

  return (
    <div className='flex flex-col items-center'>
      <div className='text-[1.6vw] font-bold mr-10'>{title}</div>
      <div className='w-full h-64'>
        <ResponsiveRadialBar
          data={radialData} // 수정된 data 사용
          maxValue={maxValue}
          valueFormat=' >-.2f'
          endAngle={360}
          innerRadius={0.2}
          padding={0.25}
          margin={{ top: 10, right: 0, bottom: 40, left: 0 }}
          colors={['#CCE3F1']}
          borderWidth={1}
          borderColor='#FFFFFF'
          label='value'
          enableRadialGrid={false}
          enableCircularGrid={false}
          radialAxisStart={null}
          circularAxisOuter={null}
          tracksColor='#F3F3F3'
          trackBorderWidth={0.5}
          labelsSkipAngle={13}
          enableLabels={true}
          labelsTextColor='#092A3C'
          legends={[
            {
              anchor: 'right',
              direction: 'column',
              justify: false,
              translateX: 200,
              translateY: 100,
              itemsSpacing: 6,
              itemDirection: 'left-to-right',
              itemWidth: 300,
              itemHeight: 18,
              itemTextColor: '#092A3C',
              symbolSize: 20,
              symbolShape: 'square',
              effects: [
                {
                  on: 'hover',
                  style: {
                    itemTextColor: '#000',
                  },
                },
              ],
            },
          ]}
          theme={{
            labels: {
              text: {
                fontSize: 18,
                fill: '#000000',
              },
            },
          }}
        />
      </div>
    </div>
  );
};

export default DashboardCompletedPie;
