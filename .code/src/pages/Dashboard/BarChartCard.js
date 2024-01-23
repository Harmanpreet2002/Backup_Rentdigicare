import React from "react";
import { Card } from "reactstrap";
import BarChart from "../AllCharts/chartjs/barchart.js";
const BarChartCard = ({ title, data }) => {
  return (
    <Card className="shadow p-2  bg-white rounded">
      <div className="row align-items-stretch ">
        <div className="mb">
          <h5 className="card-title">
            {title}
            <span className="text-muted fw-normal ms-2"></span>
          </h5>
        </div>
        <div className="">
          <BarChart  data={data} />
        </div>
      </div>
    </Card>
  );
};

export default BarChartCard;
