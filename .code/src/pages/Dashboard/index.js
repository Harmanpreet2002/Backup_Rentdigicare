import React, { useEffect } from "react";
import MetaTags from "react-meta-tags";
import jwt_decode from "jwt-decode";
import axios from "../api/axios";
import { useState } from "react";
import ReactApexChart from "react-apexcharts";
import moment from "moment";
import Select from "react-select";
//import Breadcrumbs
import Breadcrumbs from "../../components/Common/Breadcrumb";

import {
  Card,
  CardBody,
  Col,
  Container,
  Row,
  CardHeader,
  Button,
  Table,
} from "reactstrap";

import CountUp from "react-countup";

/** import Mini Widget data */
import { WidgetsData } from "../../common/data/dashboard";
import WalletBalance from "./WalletBalance";
import InvestedOverview from "./InvestedOverview";
import MarketOverview from "./MarketOverview";
import Locations from "./Locations";
import Trading from "./Trading";
import Transactions from "./Transactions";
import RecentActivity from "./RecentActivity";
import NewSlider from "./NewSlider";
import StackedBarChartCard from "./StackedBarChartCard";
import DountCard from "./DountCard";

// import AddDashboard from '../digi/add_Dashboard';

const options = {
  chart: {
    height: 50,
    type: "line",
    toolbar: { show: false },
  },
  colors: ["#5156be"],
  stroke: {
    curve: "smooth",
    width: 2,
  },
  xaxis: {
    labels: {
      show: false,
    },
    axisTicks: {
      show: false,
    },
    axisBorder: {
      show: false,
    },
  },
  yaxis: {
    labels: {
      show: false,
    },
  },
  tooltip: {
    fixed: {
      enabled: false,
    },
    x: {
      show: false,
    },
    y: {
      title: {
        formatter: function (seriesName) {
          return "";
        },
      },
    },
    marker: {
      show: false,
    },
  },
};

const Dashboard = () => {
  const role = window.localStorage.getItem("role");
  const { userData } = JSON.parse(window.localStorage.getItem("authUser"));
  var propertyManagerID = role === "manager" ? {label:"" ,value:userData?.id} :{label:"" ,value:""};
  const decode = jwt_decode(window.localStorage.getItem("accessToken"));
  const [managerID, setManagerID] = useState(propertyManagerID);
  console.log(managerID, "dsssssss")

  const COMPANY_DASHBOARD_URL = "/dashboard/company_stat";
  const MANAGER_DASHBOARD_URL = "/dashboard/manager_stat";
  const GET_MANAGERS = "/company/get_managers";
  const [companyData, setCompanyData] = useState();
  const [loading, setLoading] = useState(false);
  const [selectedEndDate, setSelectedEndDate] = useState("");
  const [selectedStartDate, setSelectedStartDate] = useState("");
  const [companyManagers, setCompanyManagers] = useState([]);
  const [selectedProperty, setSelectedProperty] = useState("");
  const [propertyList, setPropertyList] = useState([]);

  const getDashboardData = async (url, option) => {
    setLoading(true);
    try {
      const response = await axios.post(url, option);
      console.log("Response:", response);

      if (response.data.success) {
        setPropertyList(response.data.propertyList)
        console.log("newwww", response.data);
        setCompanyData(response.data);
        setLoading(false);
      }
    } catch (error) {
      console.log(error); // TODO proper error
    }
  };

  const getManagers = async () => {
    try {
      const response = await axios.post(GET_MANAGERS, {
        company_id: decode.id,
      });

      if (response.data.status == 200) {
        let managersList = response?.data?.managers.map((item) => {
          var obj = {};
          obj["label"] = item.firstname + " " + item.lastname;
          obj["value"] = item._id;
          return obj;
        });
        setCompanyManagers(managersList);
        // console.log(managersList , "managersList")
        // console.log(companyManagers , "companyManagers")
      }
    } catch (error) {
      console.log(error); // TODO proper error
    }
  };


  useEffect(() => {
    if (role === "company" || role === "admin") {

      getDashboardData(COMPANY_DASHBOARD_URL, {
        companyId: decode.id,
        companyDomain: decode.domain,
      });
      getManagers();
    } else if (role === "manager") {
   
      getDashboardData(MANAGER_DASHBOARD_URL, {
        managerId: decode.id,
      });
    } else if (role === "admin") {
      getDashboardData(MANAGER_DASHBOARD_URL, {});
    }
  }, []);

  const changedata = (data) => {
    setManagerID(data);
  };

  if (role === "admin" || role === "company" || role === "manager") {
    // return <AddDashboard />
    // return <div></div>
    return (
      <React.Fragment>
        <div className="page-content">
          <MetaTags>
            <title> Rentdigicare | Dashboard</title>
          </MetaTags>
          <div className="container-fluid">
            <Breadcrumbs title="Home" breadcrumbItem="Dashboard" />
            {loading ? (
              <div class="d-flex justify-content-center">
                <div class="spinner-border" role="status">
                  <span class="sr-only">Loading...</span>
                </div>
              </div>
            ) : (
              <div>
                <div className="row d-flex align-items-end">
                  {decode.role === "company" && (
                  
                     <div className="col-md-3 col-sm-3  mb-3">
                      <label className="">Select Manager :</label>
                      <Select
                        placeholder="Select a manager"

                        value={managerID.value ? managerID:""}
                        className="appsCalender-filter-select"
                        options={companyManagers}
                        onChange={(e) => changedata(e)}
                      />
                    </div>
                    
                   
                  )}

                  <div className="col-md-3 col-sm-3  mb-3">
                      <label className="">Select Property :</label>
                      <Select
                        placeholder="Select a property"
                        value={selectedProperty.value ? selectedProperty:""}
                        className="appsCalender-filter-select"
                        options={propertyList}
                        onChange={(e) => setSelectedProperty(e)}
                      />
                    </div>
                  <div className="col-md-3 col-sm-3 mb-3 ">
                    <label className="mx-2">Start Date :</label>
                    <input
                      type="date"
                      className="form-control"
                      placeholder="Username"
                      value={selectedStartDate}
                      aria-describedby="addon-wrapping"
                      aria-label="Username"
                      onBlur={() => {
                        if (selectedEndDate === "") {
                          setSelectedEndDate(moment().format("YYYY-MM-DD"));
                        }
                      }}
                      onChange={(e) => {
                        setSelectedStartDate(e?.target.value);
                      }}
                    />
                  </div>
                  <div className="col-md-3 col-sm-3 mb-3 ">
                    <label className="mx-2">End Date :</label>
                    <input
                      type="date"
                      className="form-control"
                      placeholder="Username"
                      value={selectedEndDate}
                      aria-describedby="addon-wrapping"
                      aria-label="Username"
                      onChange={(e) => {
                        setSelectedEndDate(e?.target.value);
                      }}
                    />
                  </div>
                  <div className="col-md-3 col-sm-3 mb-3">
                    <button
                      type="submit"
                      className="btn btn-primary"
                      onClick={() => {
                        setManagerID({label:"",value:""})
                        setSelectedStartDate("")
                        setSelectedEndDate("")
                        setSelectedProperty("")
                      }}
                    >
                      Clear
                    </button>
                  </div>
                </div>

                <Card className=" p-4 bg-white rounded h-100 ">
                  <div className=" border-bottom py-2">
                    <div className="">
                      <h5 className="card-title">
                        Reports
                        <span className="text-muted fw-normal ms-2"></span>
                      </h5>
                    </div>
                  </div>
                  <Row className="my-4">
                    {decode.role === "manager" &&
                    !decode.applicationPrivilege ? (
                      ""
                    ) : (
                      <Col xs="6 " className="mb-4">
                        <Row>
                          <Col>
                            <StackedBarChartCard
                              type="applicant"
                              title="Applications"
                              propertyManagerID={managerID.value}
                              selectedStartDate={selectedStartDate}
                              selectedEndDate={selectedEndDate}
                              selectedProperty={selectedProperty}
                            />
                          </Col>
                        </Row>
                      </Col>
                    )}
                    {decode.role === "manager" && !decode.ticketPrivilege ? (
                      ""
                    ) : (
                      <Col xs="6" className="mb-4">
                        <StackedBarChartCard
                          type="ticket"
                          title="Maintenance Request"
                          propertyManagerID={managerID.value}
                          selectedStartDate={selectedStartDate}
                          selectedEndDate={selectedEndDate}
                          selectedProperty={selectedProperty}
                        />

                        {/* <DountCard
                        type="applicant"
                        selectedStartDate={selectedStartDate}
                        selectedEndDate={selectedEndDate}
                      /> */}
                      </Col>
                    )}
                    {
                      decode.role === 'company' && decode.domain === 'https://www.gskproperties.ca/' &&
                      <Col xs="6" className="mb-4">
                      <Row>
                        <Col>
                          <StackedBarChartCard
                            type="leads"
                            title="Leads"
                            propertyManagerID={managerID.value}
                            selectedStartDate={selectedStartDate}
                            selectedEndDate={selectedEndDate}
                              selectedProperty={selectedProperty}
                          />
                        </Col>
                      </Row>
                    </Col>
                    }
                    {decode.role === "company" || decode.role === "manager" ? (
                      <Col xs="6 " className="mb-4">
                      <Row>
                        <Col>
                          <StackedBarChartCard
                            type="property"
                            title="Properties"
                            propertyManagerID={managerID.value}
                            selectedStartDate={selectedStartDate}
                            selectedEndDate={selectedEndDate}
                            selectedProperty={selectedProperty}
                          />
                        </Col>
                      </Row>
                    </Col>
                    ) : (
                      ""
                    )}
                    {decode.role === "company"? (
                      <Col xs="6 " className="mb-4">
                      <Row>
                        <Col>
                          <StackedBarChartCard
                            type="property_manager"
                            title="Property Managers"
                            propertyManagerID={managerID.value}
                            selectedStartDate={selectedStartDate}
                            selectedEndDate={selectedEndDate}
                            selectedProperty={selectedProperty}
                          />
                        </Col>
                      </Row>
                    </Col>
                    ) : (
                      ""
                    )}
                    {decode.role === "manager" && !decode.calendarPrivilege || decode.role == 'admin'? (
                      ""
                    ) : (
                      <Col xs="6" className="mb-4">
                        <StackedBarChartCard
                          type="user_appointment"
                          title="Appointments"
                          propertyManagerID={managerID.value}
                          selectedStartDate={selectedStartDate}
                          selectedEndDate={selectedEndDate}
                          selectedProperty={selectedProperty}
                        />

                        {/* <DountCard
                        type="applicant"
                        selectedStartDate={selectedStartDate}
                        selectedEndDate={selectedEndDate}
                      /> */}
                      </Col>
                    )}
                    <Col xs="6" className="mb-4">
                      <Row>
                        <Col>
                          <StackedBarChartCard
                            type="rent"
                            title="Rent"
                            propertyManagerID={propertyManagerID}
                            selectedStartDate={selectedStartDate}
                            selectedEndDate={selectedEndDate}
                              selectedProperty={selectedProperty}
                          />
                        </Col>
                      </Row>
                    </Col>
                  </Row>
              
               
                  
                </Card>
              </div>
            )}
          </div>
        </div>
      </React.Fragment>
    );

    // window.location.replace("/Dashboard_layout")
  } else if (role === "customer") {
    window.location.replace("/tickets_list");
  } else if (role === "vendor") {
    window.location.replace("/working-tickets");
  } else if (role === "technical staff") {
    window.location.replace("/technical_staff_tickets");
  }
};

export default Dashboard;
