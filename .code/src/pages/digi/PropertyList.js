import React from "react";
import Property from "./Property";
import axios from "../api/axios";
import { useState } from "react";
import jwt_decode from "jwt-decode";
import { indexOf } from "leaflet/src/core/Util";
import moment from "moment";

export default function PropertyList(props) {

  const PROPERTIES_URL = `/property/list?page=${props.pageno}&limit=10`;

  const [properties, setProperties] = useState(props.callApi?props.callApi : []);
  const [toalp, settoalp] = useState(0);

  const decode = jwt_decode(window.localStorage.getItem("accessToken"));

  React.useEffect(() => {
    getProperties(PROPERTIES_URL, {
      role: decode.role,
      domain: decode.domain,
      "filter" : props.filter
    })
    console.log(props.callApi, "callApi")
    console.log(props, "pageno")
    // props.callApi(getProperties)
  }, [props.pageno]);
  // props.filter
  // API Call
  const getProperties = async (url, data) => {
    try {
      const response = await axios.post(url, data);
     
      if (response.data.results.properties) {
        const temp = response.data.results.properties;
        setProperties(temp);
        console.log(props, "pageno")
       settoalp(response.data.totalProperties)
      }
    } catch (error) {
      console.log(error);
    }
  };

  useState(async () => {
    if (decode.role === "company") {
      await getProperties(PROPERTIES_URL, {
        domain: decode.domain,
        role: decode.role
      });
    }

    if (decode.role === "manager") {
      await getProperties(PROPERTIES_URL, {
        managerID: decode.id,
        role: decode.role
      });
    }

    if (decode.role === "admin") {
      await getProperties(PROPERTIES_URL, {
        role: decode.role
      });
    }
  });


  let number = 0;
  let number1 = props.pageno > 1 ? (props.pageno - 1)* 10 : 0 ;
  props.totalc(toalp)
  return properties.map((property) => {
   
    number++;

    return (
      
      <Property
        number={number + number1}
        userID={decode.id}
        id={property.primaryID}
        title={property.title}
        createdDate = {moment(property.createdAt).format("YYYY-MM-DD")}
        companyName={property.company}
        category={property.category}
        owner={property.owner}
        manager={property.manager}
        location={property.location}
        status={property.status}
        layout={property.layouts}
        managerlist={property.managersList}
      /> //TODO ADD Documents
    );
  });
}
