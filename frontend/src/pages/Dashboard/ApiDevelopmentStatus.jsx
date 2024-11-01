import { ResponsiveRadialBar } from '@nivo/radial-bar'


const DashboardCompletedPie = ({data, maxValue, title}) => {

    return (
        <div className='w-128 flex flex-col items-center'>
        <div className="text-2xl font-bold mr-10">{title}</div>
        <div className="w-full h-64">
        <ResponsiveRadialBar
            data={data}
            maxValue={maxValue}
            valueFormat=" >-.2f"
            endAngle={360}
            innerRadius={0.2}
            padding={0.25}
            margin={{ top: 10, right: 15, bottom: 40, left: -30 }}
            colors={['#96DAFF']}
            borderWidth={1} 
            borderColor="#FFFFFF"
            label="value"
            enableRadialGrid={false}
            enableCircularGrid={false}
            radialAxisStart={null}
            circularAxisOuter={null}
            tracksColor="#F3F3F3"  
            trackBorderWidth={0.5}
            labelsSkipAngle={13}
            enableLabels={true}
            labelsTextColor="#092A3C"
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
                                itemTextColor: '#000'
                            }
                        }
                    ]
                }
            ]}
            theme={{
                labels: {
                    text: {
                        fontSize: 18,
                        fill: "#000000", 
                    },
                },
            }}
        />
        </div>
        </div>
    );

}

export default DashboardCompletedPie;