import React from "react";
import { Doughnut } from "react-chartjs-2";

const DountChart = ({ data }) => {
  const options = {
    maintainAspectRatio: true,
  };
  return <Doughnut data={data} options={options} />;
};

export default DountChart;
