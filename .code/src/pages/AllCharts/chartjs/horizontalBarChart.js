import React from "react";
// import { Chart as ChartJS} from 'chart.js';
import { Bar } from "react-chartjs-2";
// import  dataLabels  from 'chartjs-plugin-datalabels';
// // Register the plugin to all charts:
// ChartJS.register(dataLabels);


const HorizontalBarChart = ({ data }) => {
  const options = {
    animation: {
      duration: 0,
    },

    scales: {
      xAxes: [
        {
          stacked: true,
        },
      ],
      yAxes: [{ stacked: true }],
    },
    responsive: true,
    legend: {
      labels: {
        boxWidth: 12,
      },
    },
    maintainAspectRatio: true,
    tooltips: {
      mode: 'index',
      intersect: false
    },
    tooltips: {
      displayColors: true,
      callbacks: {
        mode: "single",
        labelColor: function (tooltipItem, chart) {
          return {
            borderColor: "transparent",
            backgroundColor:
              data.datasets[tooltipItem.datasetIndex].backgroundColor,
          };
        },
        label: function (tooltipItem, data) {
          var type = data.datasets[tooltipItem.datasetIndex].label;
          var value = data.datasets[tooltipItem.datasetIndex].data[tooltipItem.index];
          var total = 0;
       
          for (var i = 0; i < data.datasets.length; i++)
              total += data.datasets[i].data[tooltipItem.index] || 0;
          if (tooltipItem.datasetIndex !== data.datasets.length - 1) {
              return type + " : " + value.toFixed(0).replace(/(\d)(?=(\d{3})+\.)/g, '1,') + ` (${Math.ceil((value/total)*100)}%)`
          } else {
              return [type + " : " + value.toFixed(0).replace(/(\d)(?=(\d{3})+\.)/g, '1,') + ` (${Math.ceil((value/total)*100)}%)`];
          }
      }
      },
      backgroundColor: "#fff",
      titleFontSize: 10,
      titleFontColor: "#000",
      bodyFontSize: 10,
      bodyFontColor: "#000",
      shadowOffsetX: 1,
      shadowOffsetY: 1,
      shadowBlur: 6,
      shadowColor: "rgba(0,0,0,0.4)",
      bodySpacing: 8,
      xPadding: 10,
      yPadding: 10,
      caretSize: 0,
    },
    plugins: {
      datalabels: {
          formatter: function(value, context) {
 
          if(context.chart.data.datasets[context.datasetIndex] != null){
                  var barTotal = context.chart.data.datasets.map(function(x){return x.data[context.dataIndex]}).reduce((a, b) => a + b, 0);
                  return (value * 100 /  barTotal).toFixed(2);
              }
          }
      }
  }
  };
  return <Bar height={200} data={data} options={options} />;
};

export default HorizontalBarChart;
