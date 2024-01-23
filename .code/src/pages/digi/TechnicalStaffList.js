import React from "react";
import TechnicalStaff from "./TechnicalStaff";
import axios from "../api/axios";
import { useState } from "react";
import jwt_decode from "jwt-decode";

export default function CompanyList(props) {
  const GET_TECHNICAL_STAFF_URL = `/technicalStaff/get_technical_staff?page=${props.currentPage}&limit=10`;
  const [toalmanagaers, settoalmanagaers] = useState(0);
  const decode = jwt_decode(window.localStorage.getItem("accessToken"));

  React.useEffect(() => {
    getManagers(GET_TECHNICAL_STAFF_URL, {
      // role: decode.role,
      // domain: decode.domain
    });
  }, [props.pageno]);

  // API Call
  const getManagers = async (url, data) => {
    const response = await axios.post(url, { companyID: decode.id });
    console.log("New Excecution");
    if (response.data.technicalStaff) {
      console.log(response.data);

      const temp = response.data.technicalStaff;
      props.setManagers(temp);
      props.setStats(response.data.stats);
      settoalmanagaers(response.data.technicalStaff?.length);
    }
    if (response.data.uniqueProperty) {
      const uniqueEntriesSet = new Set();
      response?.data?.uniqueProperties.forEach((entry) => {
        const entryString = JSON.stringify(entry);
        uniqueEntriesSet.add(entryString);
      });
      const uniqueEntriesArray = Array.from(uniqueEntriesSet).map(
        (entryString) => JSON.parse(entryString)
      );
      props.setPropertySelect(uniqueEntriesArray);
    }
  };

  useState(async () => {
    if (decode.role === "company") {
      await getManagers(GET_TECHNICAL_STAFF_URL, {
        // role: decode.role,
        // domain: decode.domain
      });
    }

    if (decode.role === "admin") {
      await getManagers(GET_TECHNICAL_STAFF_URL, {
        // role: decode.role,
      });
    }

    if (decode.role === "manager") {
      await getManagers(GET_TECHNICAL_STAFF_URL, {
        // role: decode.role,
      });
    }
  });

  let number = 0;
  let number1 = props.pageno > 1 ? (props.pageno - 1) * 10 : 0;
  props.setotalpm(toalmanagaers);

  return props.managers?.map((manager) => {
    number++;
    const date = new Date(manager.createdAt);
    const createdAt =
      date.getDate() + "-" + date.getMonth() + "-" + date.getFullYear();
    return (
      <TechnicalStaff
        number={number + number1}
        primaryID={manager.primaryID}
        userID={decode.id}
        id={manager._id}
        FilterSearch={props.FilterSearch}
        name={manager.first_name + " " + manager.last_name}
        firstname={manager.first_name}
        lastname={manager.last_name}
        email={manager.email}
        rating={manager.rating}
        status={manager.status}
        mobile={manager.contact_no}
        specialities={manager.specialties}
        skills={manager.skills}
        tickets={manager.tickets}
        assignedProperties={manager.assigned_properties}
        properties={manager.propertiesTitle}
      />
    );
  });
}
