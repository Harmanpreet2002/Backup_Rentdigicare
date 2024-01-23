import React, { useState } from "react";
import axios from "../api/axios";
import Applicant from "./Applicants";
import jwt_decode from "jwt-decode";

export default function ApplicantList(props) {
  const COMPANY_APPLICANTS_URL = `/applicant/list?page=${props.pageno}&limit=10`;

  const FROM_URL = `/applicant/first-application-date`;

  const [applicantsList, setApplicantsList] = useState([]);
  const [statusUpdate, setStatusUpdate] = useState(false);
  // const [toalapp, settoalapp] = useState("");
  const [fromm, setFrom] = useState("");
  const [page, setPage] = useState();
  const [filters, setfilters] = useState(props.filter);

  const decode = jwt_decode(window.localStorage.getItem("accessToken"));
  const From = async () => {
    const response = await axios.get(FROM_URL);
    var today = new Date(response.data.fromDate);
    var dd = String(today.getDate()).padStart(2, "0");
    var mm = String(today.getMonth() + 1).padStart(2, "0");
    var yyyy = today.getFullYear();
    today = yyyy + "-" + mm + "-" + dd;
    setFrom(today);
  };

  React.useEffect(async () => {
    if (decode.role === "manager") {
      await getApplicants(COMPANY_APPLICANTS_URL, {
        role: decode.role,
        domain: decode.domain,
        filter: props.filter.filterstaus,
        propertyName: props.filter.propertyname,
        applicantName: props.filter.name,
        managerID: decode.id,
        applicantPhone: props.filter.phone,
        applicationStatus: props.filter.status,
        fromDate: props.filter.fromfilter,
        toDate: props.filter.tofilter,
        sorting: props.sorting,
        source: props.filter.source,

        // fomDate: "2022-07-07T10:50:53.552Z",
        // toDate: "2022-07-07T10:50:53.552Z"
      });
    } else {
      await getApplicants(COMPANY_APPLICANTS_URL, {
        role: decode.role,
        domain: decode.domain,
        filter: props.filter.filterstaus,
        propertyName: props.filter.propertyname,
        applicantName: props.filter.name,
        applicantPhone: props.filter.phone,
        applicationStatus: props.filter.status,
        fromDate: props.filter.fromfilter,
        toDate: props.filter.tofilter,
        sorting: props.sorting,
        source: props.filter.source,

        // fomDate: "2022-07-07T10s:50:53.552Z",
        // toDate: "2022-07-07T10:50:53.552Z"
      });
    }

  }, [props.pageno, props.one, statusUpdate, props.sorting]);

  async function getApplicants(url, data) {
    try {
      const response = await axios.post(url, data);
      if (response.status === 200) {
        if (response.data.results.applications) {
          const temp = response.data.results.applications;
          setPage(
            response.data.results.previous
              ? response.data.results.previous.page + 1
              : 1
          );
          console.log("aniket", response.data);
          setApplicantsList(temp);
          setStatusUpdate(false);
          props.totalap((prev) => ({
            ...prev,
            Total: response.data.total.Total ||0,
            Pending: response.data.total.Pending ||0,
            Approved: response.data.total.Approved ||0,
            Denied: response.data.total.Denied||0,
          }));
        }
      } else {
        console.log("Unable to fetch the resoureces");
      }
    } catch (error) {
      console.log("unable to get applicants", error);
    }
  }


  useState(async () => {
    await From();

    if (decode.role === "company") {
      await getApplicants(COMPANY_APPLICANTS_URL, {
        role: decode.role,
        domain: decode.domain,
        // console.log('aniekt')
      });
    }

    if (decode.role === "manager") {
      await getApplicants(COMPANY_APPLICANTS_URL, {
        role: decode.role,
        managerID: decode.id,
      });
    }

    if (decode.role === "admin") {
      await getApplicants(COMPANY_APPLICANTS_URL, {
        role: decode.role,
      });
    }
  });


  let number = 0;
  let number1 = page > 1 ? (page - 1) * 10 : 0;
  // props.totalap(toalapp);
  props.filtrfrom(fromm);

  console.log(applicantsList, "SDDDDDD");
  return applicantsList?.map((applicant) => {
    console.log(applicant);
    number++;
    var today = new Date(applicant.createdAt);
    var dd = String(today.getDate()).padStart(2, "0");
    var mm = String(today.getMonth() + 1).padStart(2, "0");
    var yyyy = today.getFullYear();
    today = dd + "-" + mm + "-" + yyyy;

    return (
      <Applicant
        number={number + number1}
        totalDocuments={applicant.totalDocuments}
        userID={decode.id}
        setStatusUpdate={setStatusUpdate}
        id={applicant._id}
        sources={applicant.main.source}
        status={applicant.status}
        propertyName={applicant.main.property}
        name={
          applicant.applicants[0].firstname +
          " " +
          applicant.applicants[0].lastname
        }
        email={applicant.applicants[0].email}
        mobile={applicant.applicants[0].phone}
        address={applicant.applicants[0].currentAddress}
        createdAt={today}
        getApplicants={() => getApplicants()}
        role={decode.role}
        documents={applicant?.documents}
      />
    );
  });
}
