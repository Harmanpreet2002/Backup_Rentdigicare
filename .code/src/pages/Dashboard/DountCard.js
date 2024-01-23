import axios from "../api/axios";
import moment from "moment";
import React, { useEffect, useState } from "react";
import { Card } from "reactstrap";
import DountChart from "../AllCharts/chartjs/dountchart";

const DountCard = ({ selectedStartDate, selectedEndDate, type }) => {
  const [selectedPropMan, setSelectedPropMan] = useState("");
  const [selectedPropID, setSelectedPropID] = useState("");
  const [propertyManagerList, setPropertyManagerList] = useState([]);
  const [propertyList, setPropertyList] = useState([]);
  const [applicantData, setApplicantData] = useState([]);
  const [ticketData, setTicketData] = useState([]);
  const [loading, setLoading] = useState(true);

  const getMonthFilteredData = async (val) => {
    try {
      const startDate =
        selectedStartDate !== ""
          ? moment(selectedStartDate).format("YYYY-MM-DD")
          : "";
      const endDate =
        selectedEndDate !== ""
          ? moment(selectedEndDate).format("YYYY-MM-DD")
          : "";
      const proManId =
        selectedPropMan?.id !== undefined ? selectedPropMan?.id : "";
      if (startDate === "" && endDate !== "") {
        return setLoading(false);
      } else {
        await axios
          .get(
            `/${val}/dashboardfilter?filterBy=pieChart&startDate=${startDate}&endDate=${endDate}&propertyManagerID=${proManId}&propertyID=${selectedPropID}`,
            {}
          )
          .then(function (response) {
            setLoading(false);
            if (val === "applicant") {
              setApplicantData(response?.data?.data?.[0].applicant);
            } else {
              setTicketData(response?.data?.data?.[0].ticket);
            }
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

  const totalsApplicant = applicantData?.reduce(
    (acc, item) => {
      return {
        totalPending: acc.totalPending + item.totalPending,
        totalNew: acc.totalNew + item.totalNew,
        totalClosed: acc.totalClosed + item.totalClosed,
      };
    },
    { totalPending: 0, totalNew: 0, totalClosed: 0 }
  );

  const totalsTicket = ticketData?.reduce(
    (acc, item) => {
      return {
        totalElectrical: acc.totalElectrical + item.totalElectrical,
        totalPlumbing: acc.totalPlumbing + item.totalPlumbing,
        totalCarpenter: acc.totalCarpenter + item.totalCarpenter,
        totalSecurity: acc.totalSecurity + item.totalSecurity,
      };
    },
    {
      totalElectrical: 0,
      totalPlumbing: 0,
      totalCarpenter: 0,
      totalSecurity: 0,
    }
  );

  const applicantCartData = {
    labels: ["Pending", "New", "Closed"],
    datasets: [
      {
        data: Object.values(totalsApplicant),
        backgroundColor: [
          "rgb(255, 191, 0)",
          "rgb(0, 163, 108)",
          "rgb(182, 208, 226)",
        ],
        hoverBackgroundColor: [
          "rgb(255, 191, 0)",
          "rgb(0, 163, 108)",
          "rgb(182, 208, 226)",
        ],
        hoverBorderColor: "#fff",
      },
    ],
  };

  const ticketCartData = {
    labels: ["Electrical", "Plumbing", "Carpenter", "Security"],
    datasets: [
      {
        data: Object.values(totalsTicket),
        backgroundColor: [
          "#144c6c",
          "#f4ac34",
          "#ec7176",
          "rgb(0, 163, 108)",
        ],
        hoverBackgroundColor: [
          "#144c6c",
          "#f4ac34",
          "#ec7176",
          "rgb(0, 163, 108)",
        ],
        hoverBorderColor: "#fff",
      },
    ],
  };

  const finalData = type === "applicant" ? applicantCartData : ticketCartData;
  const getPropertyList = async (val) => {
    try {
      const propertyId = val?.split(",");
      await Promise.all(propertyId.map((v) => axios.get(`/property/${v}`, {})))
        .then((res) => {
          if (res?.length > 0) {
            const a = res?.map(
              (d) => d?.data?.properties.length > 0 && d?.data?.properties
            );
            setPropertyList(a?.flat());
          }
        })
        .catch((error) => console.log(error?.message));
    } catch (error) {
      console.log(error?.message);
    }
  };
  useEffect(() => {
    if (selectedPropMan?.properties) {
      getPropertyList(selectedPropMan?.properties);
    }
  }, [selectedPropMan?.properties]);

  const getPropertyManagerList = async () => {
    try {
      await axios
        .post(`/property_manager/admin`, {})
        .then(function (response) {
          if (response?.data?.managers) {
            setPropertyManagerList(response.data.managers);
          }
        })
        .catch(function (error) {
          console.log(error);
        });
    } catch (error) {
      console.log(error?.message);
    }
  };

  useEffect(() => {
    getPropertyManagerList();
  }, []);

  useEffect(() => {
      getMonthFilteredData(type);
  }, [
    selectedEndDate,
    selectedStartDate,
    type,
    selectedPropMan?.id,
    selectedPropID,
  ]);
  return (
    <Card className="w-100 shadow p-2 bg-white rounded align-items-stretch h-100 ">
      {Object.keys(finalData).length === 0 &&
      finalData.constructor === Object ? (
        <div>No Record Found</div>
      ) : (
        <>
          <div className="d-flex align-items-center justify-content-end  my-2 ">
            <div className="mx-2">
              <select
                className="form-select"
                aria-label="Default select example"
                onChange={(e) => {
                  setPropertyList([]);
                  setSelectedPropMan({
                    id: e.target.value?.split("_")[0],
                    properties: e.target.value?.split("_")[1],
                  });
                }}
                value={selectedPropMan?._id}
              >
                <option value="" selected>
                  All Manager
                </option>
                {propertyManagerList?.length > 0 &&
                  propertyManagerList?.map((item, index) => (
                    <option
                      key={item?._id}
                      value={`${item?._id}_${item?.properties}`}
                    >
                      {item?.firstname} {item?.lastname}
                    </option>
                  ))}
              </select>
            </div>
            <div>
              <select
                className="form-select"
                aria-label="Default select example"
                onChange={(e) => setSelectedPropID(e?.target?.value)}
                value={selectedPropID}
              >
                <option selected>All Property</option>
                {propertyList?.length > 0 &&
                  propertyList?.map((item, index) => (
                    <option key={item?._id} value={item?._id}>
                      {item?.title}
                    </option>
                  ))}
              </select>
            </div>
          </div>
          <div className="">
            {loading ? (
              <div className="d-flex justify-content-center align-items-center w-100">
                <div className="spinner-border m-5 " role="status">
                  <span className="sr-only">Loading...</span>
                </div>
              </div>
            ) : (
              <DountChart value="" data={finalData} />
            )}
          </div>
        </>
      )}
    </Card>
  );
};

export default DountCard;
