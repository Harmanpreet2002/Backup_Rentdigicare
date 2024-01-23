import React from 'react'
import Manager from './Manager'
import axios from '../api/axios'
import { useState } from "react";
import jwt_decode from "jwt-decode"
import moment from "moment";

export default function CompanyList(props) {

  const GET_MANAGERS_URL = `/property_manager/list?page=${props.pageno}&limit=10`
  const [managers, setManagers] = useState([]);
  const [toalmanagaers, settoalmanagaers] = useState(0);
  const decode = jwt_decode(window.localStorage.getItem("accessToken"));


  React.useEffect(() => {
    getManagers(GET_MANAGERS_URL, {
      role: decode.role,
      domain: decode.domain
    })
  }, [props.pageno]);



  // API Call
  const getManagers = async (url, data) => {

    const response = await axios.post(url, data);
    if (response.data.results.managers) {
      const temp = (response.data.results.managers)
      setManagers(temp)
      settoalmanagaers(response.data.totalManagers)
      console.log(response.data)
      
    }
  }

  useState(async () => {

    if (decode.role === "company") {
      await getManagers(GET_MANAGERS_URL, {
        role: decode.role,
        domain: decode.domain
      })
    }

    if (decode.role === "admin") {
      await getManagers(GET_MANAGERS_URL, {
        role: decode.role,
      })
    }

  })


  let number = 0;
  let number1 = props.pageno > 1 ? (props.pageno - 1)* 10 : 0 ;
  props.setotalpm(toalmanagaers)

  return (
    managers.map(manager => {
      number++
      const date = new Date(manager.createdAt)
      const createdAt = date.getDate() + "-" + date.getMonth() + "-" + date.getFullYear()
      return (<Manager
        number={number+number1}
        userID={decode.id}
        id={manager._id}
        name={manager.firstname + " " + manager.lastname}
        email={manager.email}
        mobile={manager.mobile}
        status={manager.status}
        properties ={manager.properties}
        createdAt={moment(manager.createdAt).format("YYYY-MM-DD")}
      />)


    })
  )
}
