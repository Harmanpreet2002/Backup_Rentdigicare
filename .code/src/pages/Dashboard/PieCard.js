import React from "react";
import { Card } from "reactstrap";
import PieChart from "../AllCharts/chartjs/piechart.js";

const PieCard = ({ title, data }) => {
  return (
    <Card className="shadow p-2 bg-white rounded">
      <div className="row align-items-center ">
          <h5 className="card-title">
            {title}
            <span className="text-muted fw-normal ms-2"></span>
          </h5>
        </div>
        <div className="">
          <PieChart data={data} />
        </div>
    </Card>
  );
};

export default PieCard;
