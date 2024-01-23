import React from "react";
import { Bar } from "react-chartjs-2";

const BarChart = ({data}) => {

  const option = {
    scales: {
      dataset: [
        {
          barPercentage: 0.4,
        },
      ],
    },
  };

  return <Bar height={200}   data={data} options={option} />;
};

export default BarChart;
