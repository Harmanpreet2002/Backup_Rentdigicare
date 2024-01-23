import React from "react";
import LayoutMain from "./LayoutMain";
import axios from "../api/axios";
import { useState,useEffect } from "react";
import jwt_decode from "jwt-decode";
import { indexOf } from "leaflet/src/core/Util";

export default function LayoutList(props) {
  const COMPANY_PROPERTIES_URL = `/layout/all?page=${props.currentPage}&limit=10`;
  const ADMIN_LIST_PROPERTY_URL = "/property/admin";
  const MANAGER_PROPERTIES_URL = "/property/manager-property";
  const [properties, setProperties] = useState([]);
  const decode = jwt_decode(window.localStorage.getItem("accessToken"));
  const [page, setPage] = useState();
  // API Call
  const getProperties = async (url, data) => {
    try {
      const response = await axios.post(url, data);
      console.log(response.data.layouts);
      if (response.data.layouts) {
        const temp = response.data.layouts.reverse();
        console.log("manish", temp);
        
      }
    } catch (error) {
      console.log(error);
    }
  };
  const company_property = async (url, data) => {
    const response = await axios.post(url, data);
    if (response.status === 200) {
      const temp = response.data.layouts.reverse();
      setProperties(temp);
      props.toall(response.data.total)
      setPage(
        response.data.results.previous
          ? response.data.results.previous.page + 1
          : 1
      );
    }
  };

  const refresh=async()=>{
    if (decode.role === "company") {
      await company_property(COMPANY_PROPERTIES_URL, {
        companyID: decode.id,
      });
    }

    if (decode.role === "manager") {
      await getProperties(MANAGER_PROPERTIES_URL, {
        managerID: decode.id,
      });
    }

    if (decode.role === "admin") {
      await getProperties(ADMIN_LIST_PROPERTY_URL, {});
    }
  }

  useEffect( () => {
    refresh()
  },[]);


  useEffect(() => {
    refresh();

  }, [props.currentPage]);


  let number = 0;
  let number1 = page > 1 ? (page - 1) * 10 : 0;
  return properties.map((property,index) => {
    number++;
    return (
      <LayoutMain
        number={number+number1}
        id={property._id}
         refresh={()=> refresh()}
        title={property.layoutName}
      /> //TODO ADD Documents
    );
  });
}
