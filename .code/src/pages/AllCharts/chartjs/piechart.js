import React from "react";

import { Pie } from "react-chartjs-2";

const PieChart = ({ data }) => {
  const options = {
    maintainAspectRatio: true,
  };
  return <Pie  data={data} options={options} />;
};

export default PieChart;
