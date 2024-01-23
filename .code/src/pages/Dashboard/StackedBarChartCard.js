import moment from "moment";
import React from "react";
import { useState } from "react";
import { useEffect } from "react";
import { Card ,Container } from "reactstrap";
import jwt_decode from "jwt-decode";
import HorizontalBarCard from "../AllCharts/chartjs/horizontalBarChart.js";
import axios from "../api/axios.js";
import { colorArray } from "../../helpers/helper.js";
const StackedBarChartCard = ({
  selectedStartDate,
  selectedEndDate,
  type,
  title,
  selectedProperty,
  propertyManagerID,
}) => {
  const [applicationData, setApplicationData] = useState([]);
  const decode = jwt_decode(window.localStorage.getItem("accessToken"));
  const [loading, setLoading] = useState(false);
  const getApplicantData = async (val) => {
    try {
      const startDate =
        selectedStartDate !== ""
          ? moment(selectedStartDate).format("YYYY-MM-DD")
          : "";
      const endDate =
        selectedEndDate !== ""
          ? moment(selectedEndDate).format("YYYY-MM-DD")
          : "";
      if (startDate === "" && endDate !== "") {
        return false;
      } else {
        setLoading(true);
        await axios
          .get(
            `/${val}/dashboardfilter?filterBy=barChart&startDate=${startDate}&endDate=${endDate}&propertyManagerID=${propertyManagerID}&role=${decode?.role
            }&domain=${decode?.domain ? decode.domain : ""}&propertyId=${selectedProperty.value ? selectedProperty?.value : ""}`,
            {
              headers: {
                Authorization: `Bearer ${window.localStorage.getItem("accessToken")}`,
              }
            }
          )
          .then(function (response) {
            setLoading(false);
            setApplicationData(response.data.data);
          })
          .catch(function (error) {
            setLoading(false);
            console.log(error);
          });
      }
    } catch (error) {
      setLoading(false);
      console.log(error?.message);
    }
  };

  const rentData = [
    {
      _id: {
        month: "2022-12",
      },
      collected: 12,
      pending: 10,
    },
    {
      _id: {
        month: "2022-08",
      },
      collected: 12,
      pending: 5,
    },
  ];

  const applicantChartData = [
    {
      label: "Pending",
      backgroundColor: "#FFBF0098",
      borderColor: "#FFBF0098",
      borderWidth: 1,
      hoverBackgroundColor: "#FFBF0098",
      hoverBorderColor: "#FFBF0098",
      data: applicationData?.map((v) => v?.pending),
    },
    {
      label: "Approved",
      backgroundColor: "#00A36C98 ",
      borderColor: "#00A36C98 ",
      borderWidth: 1,
      hoverBackgroundColor: "#00A36C98",
      hoverBorderColor: "#00A36C98",
      data: applicationData?.map((v) => v?.approved),
    },
    {
      label: "Denied",
      backgroundColor: "#D0312D98",
      borderColor: "#D0312D98 ",
      borderWidth: 1,
      hoverBackgroundColor: "#D0312D98",
      hoverBorderColor: "#D0312D98",
      data: applicationData?.map((v) => v?.denied),
    },
  ];
  const appointmentChartData = [
    {
      label: "Booked",
      backgroundColor: "#1f77b498",
      borderColor: "#1f77b498",
      borderWidth: 1,
      hoverBackgroundColor: "#1f77b498",
      hoverBorderColor: "#1f77b498",
      data: applicationData?.map((v) => v?.booked),
    },
    {
      label: "Pending",
      backgroundColor: "#FFBF0098",
      borderColor: "#FFBF0098",
      borderWidth: 1,
      hoverBackgroundColor: "#FFBF0098",
      hoverBorderColor: "#FFBF0098",
      data: applicationData?.map((v) => v?.pending),
    },
    {
      label: "Rejected",
      backgroundColor: "#00A36C98 ",
      borderColor: "#00A36C98 ",
      borderWidth: 1,
      hoverBackgroundColor: "#00A36C98",
      hoverBorderColor: "#00A36C98",
      data: applicationData?.map((v) => v?.rejected),
    },
    {
      label: "Canceled",
      backgroundColor: "#D0312D98",
      borderColor: "#D0312D98 ",
      borderWidth: 1,
      hoverBackgroundColor: "#D0312D98",
      hoverBorderColor: "#D0312D98",
      data: applicationData?.map((v) => v?.canceled),
    },
  ];

  // const ticketsChartData = [
  //   {
  //     label: "Electrical",
  //     backgroundColor: "#144c6c",
  //     borderColor: "#144c6c",
  //     borderWidth: 1,
  //     hoverBackgroundColor: "#144c6c",
  //     hoverBorderColor: "#144c6c",
  //     data: applicationData?.map((v) => v?.electrical),
  //   },
  //   {
  //     label: "Plumbing",
  //     backgroundColor: "#f4ac34",
  //     borderColor: "#f4ac34",
  //     borderWidth: 1,
  //     hoverBackgroundColor: "#f4ac34",
  //     hoverBorderColor: "#f4ac34",
  //     data: applicationData?.map((v) => v?.plumbing),
  //   },
  //   {
  //     label: "Carpenter",
  //     backgroundColor: "#ec7176",
  //     borderColor: "#ec7176",
  //     borderWidth: 1,
  //     hoverBackgroundColor: "#ec7176",
  //     hoverBorderColor: "#ec7176",
  //     data: applicationData?.map((v) => v?.carpenter),
  //   },
  //   {
  //     label: "Security",
  //     backgroundColor: "rgb(0, 163, 108)",
  //     borderColor: "rgb(0, 163, 108)",
  //     borderWidth: 1,
  //     hoverBackgroundColor: "rgb(0, 163, 108)",
  //     hoverBorderColor: "rgb(0, 163, 108)",
  //     data: applicationData?.map((v) => v?.security),
  //   },
  // ];
  const unique = applicationData?.length > 0 && [
    ...new Set(Object.keys(applicationData[0]).filter((key) => key !== "_id")),
  ];
  const dynamicChartData =
    unique?.length > 0 &&
    unique?.map((label, colorIndex) => {
      return {
        label: label,
        backgroundColor: colorArray[colorIndex % colorArray?.length],
        data: applicationData.map((item) => item[label]),
      };
    });

  const ticketsChartData = dynamicChartData;
  // console.log(flatData,"flat")

  const propertyChartData = [
    {
      label: "Active",
      backgroundColor: "#00A36C98",
      borderColor: "#00A36C98",
      borderWidth: 1,
      hoverBackgroundColor: "#00A36C98",
      hoverBorderColor: "#00A36C98",
      data: applicationData?.map((v) => v?.active),
    },
    {
      label: "Inactive",
      backgroundColor: "#D0312D98",
      borderColor: "#D0312D98",
      borderWidth: 1,
      hoverBackgroundColor: "#D0312D98",
      hoverBorderColor: "#D0312D98",
      data: applicationData?.map((v) => v?.inactive),
    },
  ];

  const ManagerChartData = [
    {
      label: "Active",
      backgroundColor: "#00A36C98",
      borderColor: "#00A36C98",
      borderWidth: 1,
      hoverBackgroundColor: "#00A36C98",
      hoverBorderColor: "#00A36C98",
      data: applicationData?.map((v) => v?.active),
    },
    {
      label: "Inactive",
      backgroundColor: "#D0312D98",
      borderColor: "#D0312D98",
      borderWidth: 1,
      hoverBackgroundColor: "#D0312D98",
      hoverBorderColor: "#D0312D98",
      data: applicationData?.map((v) => v?.inactive),
    },
  ];


  const leadsChartData = [
    {
      label: "Pending",
      backgroundColor: "#ff7f0e98",
      borderColor: "#ff7f0e98",
      borderWidth: 1,
      hoverBackgroundColor: "#ff7f0e98",
      hoverBorderColor: "#ff7f0e98",
      data: applicationData?.map((v) => v?.pending),
    },
    {
      label: "Closed",
      backgroundColor: "#1f77b498",
      borderColor: "#1f77b498",
      borderWidth: 1,
      hoverBackgroundColor: "#1f77b498",
      hoverBorderColor: "#1f77b498",
      data: applicationData?.map((v) => v?.closed),
    },
    {
      label: "Cancelled",
      backgroundColor: "#d6272898",
      borderColor: "#d6272898",
      borderWidth: 1,
      hoverBackgroundColor: "#d6272898",
      hoverBorderColor: "#d6272898",
      data: applicationData?.map((v) => v?.cancelled),
    },
    {
      label: "Follow Up",
      backgroundColor: "#2ca02c98",
      borderColor: "#2ca02c98",
      borderWidth: 1,
      hoverBackgroundColor: "#2ca02c98",
      hoverBorderColor: "#2ca02c98",
      data: applicationData?.map((v) => v?.follow_up),
    },
  ];


  const tempRentChartData = [
    {
      label: "Collected",
      backgroundColor: "#86295e98",
      borderColor: "#86295e98",
      borderWidth: 1,
      hoverBackgroundColor: "#86295e98",
      hoverBorderColor: "#86295e98",
      data: rentData?.map((v) => v?.collected),
    },
    {
      label: "Pending",
      backgroundColor: "#c9854098",
      borderColor: "#c9854098",
      borderWidth: 1,
      hoverBackgroundColor: "#c9854098",
      hoverBorderColor: "#c9854098",
      data: rentData?.map((v) => v?.pending),
    },
  ];

  useEffect(() => {
    if (type !== "rent") {
      getApplicantData(type);
    }
  }, [selectedEndDate, selectedStartDate, type, propertyManagerID, selectedProperty]);

  const getFinalData = (val) => {
    switch (val) {
      case "applicant":
        return applicantChartData;
      case "ticket":
        return ticketsChartData;
      case "property":
        return propertyChartData;
      case "leads":
        return leadsChartData;
      case "rent":
        return tempRentChartData;
      case "property_manager":
        return ManagerChartData; 
        case "user_appointment":
          return appointmentChartData; 
      default:
        return applicantChartData;
    }
  };

  const horiData = {
    labels:
      type === "rent"
        ? rentData?.map((v) =>
          moment(v?._id?.month, "YYYY/MM")?.format("MMM-YYYY")
        )
        : applicationData?.map((v) =>
          moment(v?._id?.month, "YYYY/MM")?.format("MMM-YYYY")
        ),
    datasets: getFinalData(type),
  };
  const customStyle = {
    textAlign: 'center',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center', 
    height: '100%',
    maxHeight: '100%',
    boxSizing: 'border-box'
  };

  // if (window.matchMedia('(min-width: 768px)').matches) {
  //   customStyle.height = '290px'; // set the height to 290 pixels for medium and large screens
  // }


  return (
    <Card className="shadow p-2 bg-white rounded h-100 w-100 ">
      <div className="row align-items-center ">
        {Object.keys(horiData)?.length === 0 &&
          horiData.constructor === Object ? (
          <div>No Records Found</div>
        ) : (
          <div className="">
            {loading ? (
              <div className="d-flex justify-content-center align-items-center w-100">
                <div className="spinner-border m-5 " role="status">
                  <span className="sr-only">Loading...</span>
                </div>
              </div>
            ) : (
              <div className="">
                <h5 className="card-title">
                  {title}
                  <span className="text-muted fw-normal ms-2"></span>
                </h5>
                <div>
                  {title === "Rent" ? (
                   <Container>
                   <div style={customStyle}>
                     <h4>Coming soon</h4>
                   </div>
                 </Container>
                  ) : (
                    <HorizontalBarCard data={horiData} />
                  )}
                </div>
              </div>
            )}
          </div>
        )}
      </div>
    </Card>
  );
};

export default StackedBarChartCard;
