'use client';

import React from 'react';
import Highcharts from 'highcharts';
import HighchartsReact from 'highcharts-react-official';
import HighchartsMore from 'highcharts/highcharts-more';

// Load the required modules
if (typeof Highcharts === 'object') {
HighchartsMore(Highcharts);
}
// Define the type for props
interface SpeedometerProps {
  value: string;
}

const Speedometer: React.FC<SpeedometerProps> = ({ value }) => {
  
  const options: Highcharts.Options = {
    chart: {
     // type: 'gauge',
      plotBackgroundColor: '#FFFFFF',
     // plotBackgroundImage: null,
      plotBorderWidth: 0,
      plotShadow: false,
      height: '35%'
    },
    title: {
      text: ''
    },
    pane: {
      startAngle: -90,
      endAngle: 89.9,
      background: undefined,
      center: ['50%', '75%'],
      size: '110%'
    },
    yAxis: {
        min: 0,
        max: 100,
        //tickPixelInterval: 70,
        tickPosition: 'inside',
        tickColor: '#FFFFFF',
        tickLength: 40,
        tickWidth: 2,
        labels: {
          distance: 10, // Center labels on the gauge
          style: {
            fontSize: '14px'
          },
        },
        lineWidth: 0,
        plotBands: [{
          from: 0,
          to: 20,
          color: '#DF5353', // red
          thickness: 40,
         // borderRadius: '50%'
        }, {
          from: 20,
          to: 40,
          color: '#DDDF0D', // yellow
          thickness: 40
        }, {
          from: 40,
          to: 60,
          color: '#55BF3B', // green
          thickness: 40
        }, {
          from: 60,
          to: 80,
          color: '#55BF3B', // green
          thickness: 40
        }, {
          from: 80,
          to: 100,
          color: '#55BF3B', // green
          thickness: 40,
          
        }]
      },
    series: [{
        type: 'gauge', // Added type property
        name: 'Productivity',
        data: [Number(value) || 0],
        tooltip: {
          valueSuffix: '%'
        },
        dial: {
          radius: '80%',
          backgroundColor: 'gray',
          baseWidth: 12,
          baseLength: '0%',
          rearLength: '0%'
        },
        pivot: {
          backgroundColor: 'gray',
          radius: 6
        }
      }]
  };

  return <HighchartsReact highcharts={Highcharts} options={options} />;
};

export default Speedometer;