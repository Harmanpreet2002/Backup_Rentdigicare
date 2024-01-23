import React, { useState, useEffect } from 'react';
import axios from '../api/axios';
import ResidentApplicant from './resident_applicant';

// TODO resident Applicant
const GET_APPLICANT_URL = "/applicant/getOne"
export default function ApplicantInformation() {
  const [applicant, setApplicant] = useState([])
  const [isLoading, setLoading] = useState(true);

  useEffect(() => {
    getTheApplicant()
  }, []);

  const getTheApplicant = () => {
    const location = window.location.href
    const position = location.search("qapp")
    const subStr = location.substring(position)

    // geting position of domain and domain it self
    const idPosition = subStr.search("=")
    const applicantId = subStr.substring(idPosition + 1)
    axios.post(GET_APPLICANT_URL, {
      id: applicantId,
    }).then((response) => {
      setApplicant(response.data.applicant);
      setLoading(false);
    });
  };

  if (isLoading) {
    return <div>Loading...</div>;
  }

  const date = new Date(applicant.createdAt)
  const createdAt = date.getDate() + "-" + date.getMonth() + "-" + date.getFullYear()

  return (
    <ResidentApplicant applicant={applicant} date={createdAt} />
  );
}
