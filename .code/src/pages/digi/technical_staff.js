import React, { useState, useEffect } from "react";
import MetaTags from "react-meta-tags";
import Select from "react-select";
import { Link } from "react-router-dom";
import axios from "../api/axios";
import TechnicalStaffList from "./TechnicalStaffList";
import jwt_decode from "jwt-decode";

import {
  Table,
  Row,
  Col,
  Card,
  CardBody,
  Modal,
  CardHeader,
  Label,
  Form,
  Pagination,
  PaginationItem,
  Collapse,
  PaginationLink,
  Input,
} from "reactstrap";
import Dropzone from "react-dropzone";

//Import Breadcrumb
import Breadcrumbs from "../../components/Common/Breadcrumb";

const TechnicalStaff = () => {
  // form states
  const [managerFirstName, setManagerFirstName] = useState("");
  const [save, setSave] = useState(0);
  const [nextpageno, setnextpageno] = useState(2);
  const [previouspageno, setpreviouspageno] = useState(1);
  const [currentpageno, setcurrentpageno] = useState(1);
  const [managerLastName, setManagerLastName] = useState("");
  const [managerPhone, setManagerPhone] = useState("");
  const [managerEmail, setManagerEmail] = useState("");
  const [skills, setSkills] = useState();
  const [managers, setManagers] = useState([]);
  const [managerTimezone, setManagerTimezone] = useState("");
  const [managerStatus, setManagerStatus] = useState("");
  const [totalpropertymanager, settotalpropertymanager] = useState(0);

  const [companyList, setCompanyList] = useState([]);
  const [propertyList, setPropertyList] = useState([]);
  const [filteredProperties, setFilteredProperties] = useState([]);

  const [specialitiesList, setSpecialitiesList] = useState([]);
  const [selectedSpecialities, setSelectedSpecialities] = useState([]);

  const [propertyID, setPropertyID] = useState("");
  const [propertyType, setPropertyType] = useState("");
  const [companyAssigned, setCompanyAssigned] = useState("");
  const [Propertys, setPropertys] = useState([]);
  // TODO documents
  const [managerDocuments, setManagerDocuments] = useState("");
  const [stats, setStats] = useState({
    total: 0,
    pending: 0,
    verified: 0,
    rejected: 0,
    suspended: 0,
  });
  const [pages, setPages] = useState([]);
  const [currentPage, setCurrentPage] = useState(1);
  const [pageLimit, setPageLimit] = useState(10);

  const [check_first, setcheck_first] = useState(true);
  const [check_last, setcheck_last] = useState(true);
  const [check_name, setcheck_name] = useState(true);
  const [check_email, setcheck_email] = useState(true);
  const [check_mobile, setcheck_mobile] = useState(true);
  const [check_skills, setCheck_skills] = useState(true);
  const [check_specialities, setCheck_specialities] = useState(true);

  const [check_status, setcheck_status] = useState(true);
  const [check_time, setcheck_time] = useState(true);
  const [check_document, setcheck_document] = useState(true);

  const [msg_error, setmsg_error] = useState("");
  const [msg_error1, setmsg_error1] = useState("");
  const [msg_error3, setmsg_error3] = useState("");
  const [msg_error4, setmsg_error4] = useState("");
  const [msg_error5, setmsg_error5] = useState("");
  const [msg_error6, setmsg_error6] = useState("");
  const [msg_error7, setmsg_error7] = useState("");
  const [msg_error8, setmsg_error8] = useState("");
  const [name, setName] = useState("");
  const [speciality, setSpeciality] = useState("");
  const [filterContact, setFilterContact] = useState("");
  const [filterRating, setFilterRating] = useState("");
  const [filterStatus, setFilterStatus] = useState("");
  const [primaryID, setPrimaryID] = useState("");
  const [property, setProperty] = useState([]);
  const [propertySelect, setPropertySelect] = useState([]);

  const [startPage, setStartPage] = useState(1);
  const [paginationTotal, setPaginationTotal] = useState(0);
  const pageTotal = Math.ceil(paginationTotal / pageLimit);

  const GET_TECHNICAL_STAFF_URL = `/technicalStaff/get_technical_staff?page=${currentPage}&limit=10`;
  const ADD_TECHNICAL_STAFF = "/technicalStaff/register";
  const GET_COMPANIES_URL = "/company";
  const GET_PROPERTY_URL = "/property/list";
  const GET_TECHNICAL_SPECIALITY = "/technicalStaff/get_speciality";

  const handlePageChange = (page) => {
    setCurrentPage(page);

    if (page > startPage + pageLimit - 1 || page < startPage) {
      setStartPage(Math.max(1, page - pageLimit / 2));
    }
  };

  function goToNextPage() {
    if (currentPage > 0 && pages.length > currentPage) {
      setCurrentPage((page) => page + 1);
      console.log(currentPage);
    }
  }

  useEffect(() => {
    let total_pages = totalpropertymanager / pageLimit;
    if (totalpropertymanager % pageLimit == 0) {
      setPages(Array.from(Array(Math.round(total_pages)).keys()));
    } else {
      setPages(Array.from(Array(parseInt(total_pages) + 1).keys()));
    }
    console.log(
      "totalpropertymanager/pageLimit",
      totalpropertymanager,
      pageLimit
    );
    console.log(
      Array.from(Array(Math.round(totalpropertymanager / pageLimit)).keys())
    );
  }, [totalpropertymanager]);

  useEffect(() => {
    //setPages(Array.from(Array(Math.round(totalpropertymanager / pageLimit)).keys()))
    let total_pages = totalpropertymanager / pageLimit;
    if (totalpropertymanager % pageLimit == 0) {
      setPages(Array.from(Array(Math.round(total_pages)).keys()));
    } else {
      setPages(Array.from(Array(parseInt(total_pages) + 1).keys()));
    }
  }, [currentPage]);

  function goToPreviousPage() {
    if (currentPage > 1) {
      setCurrentPage((page) => page - 1);
    }
  }

  function changePage(event) {
    setCurrentPage(event);
  }

  const ClearTicket = (e) => {
    e.preventDefault();
    setFilterStatus("");
    setSpeciality("");
    setPrimaryID("");
    setName("");
    setFilterContact("");
    setFilterRating("");
    setProperty("");
    setTimeout(() => {
      document.getElementById("ticketfilter").click();
    }, 1000);
  };

  const getPaginationGroup = () => {
    let start = Math.floor((currentPage - 1) / pageLimit) * pageLimit;
    return new Array(pageLimit).fill().map((_, idx) => start + idx + 1);
  };

  const decode = jwt_decode(window.localStorage.getItem("accessToken"));
  async function getCompanies() {
    try {
      const response = await axios.get(GET_COMPANIES_URL);
      setCompanyList(response.data.companies);
    } catch (error) {
      // TODO proper error message
      console.log(error);
    }
  }

  // Getting Properties for options
  async function getProperties(companyDomain) {
    try {
      const response = await axios.post(GET_PROPERTY_URL, {
        domain: companyDomain,
        role: "company",
      });
      //setPropertyList(response.data.properties);
      console.log(response.data);

      setPropertyList([]);
      response.data.results.properties.forEach((element) => {
        setPropertyList((current) => [
          ...current,
          { label: element.title, value: element._id },
        ]);
      });
    } catch (error) {
      console.log(error);
      console.log("Unable to fetch");
    }
  }

  const getSpeciality = async (e) => {
    try {
      const response = await axios.post(GET_TECHNICAL_SPECIALITY, {
        companyId: decode.id,
      });

      if (response.data?.success) {
        setSpecialitiesList([]);
        response.data.specialties.forEach((element) => {
          setSpecialitiesList((current) => [
            ...current,
            { label: element.speciality, value: element._id },
          ]);
        });
      } else {
        // setVendorError(response.data?.errorMessage)
      }
    } catch (error) {
      // setVendorError("Something went wrong")

      console.log(error); // TODO proper error
    }
  };

  useEffect(() => {
    getSpeciality();
  }, []);
  const optionMulti = [
    // companies
  ];

  const [col5, setcol5] = useState(false);
  const t_col5 = () => {
    setcol5(!col5);
  };
  const [modal_large, setmodal_large] = useState(false);

  function removeBodyCss() {
    document.body.classList.add("no_padding");
  }

  function tog_large() {
    if (modal_large) {
      console.log("Excecuted");
      setcheck_first(true);
      setcheck_last(true);
      setcheck_name(true);
      setcheck_email(true);
      setcheck_mobile(true);
      setCheck_skills(true);
      setCheck_specialities(true);
    }

    setmodal_large(!modal_large);
    removeBodyCss();
  }
  const [selectedFiles, setselectedFiles] = useState([]);
  function handleAcceptedFiles(files) {
    files.map((file) =>
      Object.assign(file, {
        preview: URL.createObjectURL(file),
        formattedSize: formatBytes(file.size),
      })
    );
    setselectedFiles(files);
  }
  /**Formats the size**/
  function formatBytes(bytes, decimals = 2) {
    if (bytes === 0) return "0 Bytes";
    const k = 1024;
    const dm = decimals < 0 ? 0 : decimals;
    const sizes = ["Bytes", "KB", "MB", "GB", "TB", "PB", "EB", "ZB", "YB"];

    const i = Math.floor(Math.log(bytes) / Math.log(k));
    return parseFloat((bytes / Math.pow(k, i)).toFixed(dm)) + " " + sizes[i];
  }

  // Add Technical Staff
  // TODO add validation before axios call
  async function addTechnicalStaff(event) {
    event.preventDefault();

    if (!managerFirstName) {
      setcheck_first(false);
      return setmsg_error("Cannot be empty");
    } else {
      setcheck_first(true);
    }

    if (managerFirstName) {
      if (!managerFirstName.match(/^[A-Za-z]+$/)) {
        setcheck_first(false);
        return setmsg_error("Only Letters Are Allowed");
      } else {
        setcheck_first(true);
      }
    }

    if (!managerLastName) {
      setcheck_last(false);
      return setmsg_error1("Cannot be empty");
    } else {
      setcheck_last(true);
    }

    if (managerLastName) {
      if (!managerLastName.match(/^[A-Za-z]+$/)) {
        setcheck_last(false);
        return setmsg_error1("Only Letters are Allowed");
      } else {
        setcheck_last(true);
      }
    }

    if (!managerEmail) {
      setcheck_email(false);
      return setmsg_error4("Cannot be empty");
    } else {
      setcheck_email(true);
    }

    if (managerEmail) {
      if (!managerEmail.match(/\S+@\S+\.\S+/)) {
        setcheck_email(false);
        return setmsg_error4("Enter Valid Email Address");
      } else {
        setcheck_email(true);
      }
    }

    if (!managerPhone) {
      setcheck_mobile(false);
      return setmsg_error5("Cannot be empty");
    } else {
      setcheck_mobile(true);
    }

    if (managerPhone) {
      if (managerPhone.length !== 10) {
        setcheck_mobile(false);
        return setmsg_error5("Invalid Phone Number");
      } else {
        setcheck_mobile(true);
      }
    }

    // if (Propertys.length <= 0) {
    //   setcheck_name(false);
    //   return setmsg_error3("Cannot be empty");
    // } else {
    //   setcheck_name(true);
    // }

    if (selectedSpecialities.length <= 0) {
      setCheck_specialities(false);
      return setmsg_error7("Cannot be empty");
    } else {
      setCheck_specialities(true);
    }

    // if (!skills) {
    //   setCheck_skills(false);
    //   return setmsg_error6("Cannot be empty");
    // } else {
    //   setCheck_skills(true);
    // }

    // if (selectedFiles.length <= 0) {
    //     setcheck_document(false)
    //     setmsg_error8("Cannot be empty")
    // }
    // else {
    //     setcheck_document(true)
    // }

    if (
      managerFirstName &&
      check_first &&
      managerLastName &&
      check_last &&
      // Propertys &&
      check_name &&
      managerEmail &&
      check_email &&
      managerPhone &&
      check_mobile &&
      selectedSpecialities &&
      check_specialities
      // skills
      // check_skills
    ) {
      const saveSpinner = document.getElementById("saveSpinner");
      const failedSaveErrorIcon = document.getElementById(
        "failedSaveErrorIcon"
      );
      const managerSaveBtn = document.getElementById("managerSaveBtn");
      const errorSpan = document.getElementById("errorSpan");
      const domain = decode.domain;

      managerSaveBtn.disabled = true;
      saveSpinner.style.display = "inline-block";
      failedSaveErrorIcon.style.display = "none";
      errorSpan.style.display = "none";

      try {
        const response = await axios.post(ADD_TECHNICAL_STAFF, {
          first_name: managerFirstName,
          last_name: managerLastName,
          email: managerEmail,
          contact_no: managerPhone,
          assigned_properties: Propertys,
          specialties: selectedSpecialities,
          companyAssigned: domain,
          assigned_companies: [decode.id],
          skills: skills,
        });

        if (response.data.status === 200) {
          window.location.replace("/technical_staff");
        } else if (response.data.status === 201) {
          errorSpan.innerText =
            response.data.errorMessage || "Something went wrong";
          saveSpinner.style.display = "none";
          managerSaveBtn.disabled = false;
          failedSaveErrorIcon.style.display = "inline-block";
          errorSpan.style.display = "inline-block";
        } else {
          errorSpan.innerText =
            response.data.errorMessage || "Something went wrong";
          saveSpinner.style.display = "none";
          managerSaveBtn.disabled = false;
          failedSaveErrorIcon.style.display = "inline-block";
          errorSpan.style.display = "inline-block";
        }
      } catch (error) {
        saveSpinner.style.display = "none";
        managerSaveBtn.disabled = false;
        failedSaveErrorIcon.display = "inline-block";
      }
    }
  }

  const FilterSearch = async () => {
    try {
      console.log(property, "propddddd");
      const response = await axios.post(
        `${GET_TECHNICAL_STAFF_URL}&first_name=${name}&contact=${filterContact}&property=${property?.value}&rating=${filterRating}&specialties=${speciality}&primaryID=${primaryID}`,
        {
          companyID: decode.id,
        }
      );
      if (response.data?.success) {
        setStats(response?.data?.stats);
        setPaginationTotal(response?.data?.stats?.total);
        setManagers(response?.data?.technicalStaff);
        const uniqueEntriesSet = new Set();
        response?.data?.uniqueProperties.forEach((entry) => {
          const entryString = JSON.stringify(entry);
          uniqueEntriesSet.add(entryString);
        });
        const uniqueEntriesArray = Array.from(uniqueEntriesSet).map(
          (entryString) => JSON.parse(entryString)
        );
        setPropertySelect(uniqueEntriesArray);
      }
    } catch (error) {
      // TODO proper message
      console.log("Unable to fetch");
    }
  };
  async function uploadDocuments(managerID) {
    const formData = new FormData();
    var i = 0;
    while (i < selectedFiles.length) {
      formData.append(`file`, selectedFiles[i]);
      i++;
    }

    const config = {
      headers: {
        "content-type": "multipart/form-data",
        id: `${managerID}`,
      },
    };

    try {
      const response = await axios.post(
        "/property_manager/upload-documents",
        formData,
        config
      );
    } catch (error) {
      console.log(error);
    }
  }

  console.log(specialitiesList, "specialitiesList");

  const deleteDocument = (index) => {
    setselectedFiles(selectedFiles.filter((_, i) => i !== index));
    // console.log(selectedFiles)
  };

  if (["admin", "company", "manager"].includes(decode.role)) {
    return (
      <React.Fragment>
        <div className="page-content">
          <MetaTags>
            <title> Rentdigicare | Maintenance Team</title>
          </MetaTags>
          <div className="container-fluid">
            <Breadcrumbs title="Home" breadcrumbItem="Maintenance Team" />
            <Row>
              <Col xl={12}>
                <Card>
                  <CardHeader>
                    <div className="row align-items-center">
                      <div className="col-md-6 d-flex">
                        <div className="mb mx-2">
                          <h5 className="card-title">
                            Total
                            <span className="text-muted fw-normal ms-1">
                              ({stats?.total})
                            </span>
                          </h5>
                        </div>
                        {/* <div className="mx-2">
                          <h5 className="card-title">
                            Pending
                            <span className="text-muted fw-normal ms-1">
                              ({stats?.pending})
                            </span>
                          </h5>
                        </div> */}
                        <div className="mx-2">
                          <h5 className="card-title">
                            Verified
                            <span className="text-muted fw-normal ms-1">
                              ({stats?.verified})
                            </span>
                          </h5>
                        </div>
                        <div className="mx-2">
                          <h5 className="card-title">
                            Rejected
                            <span className="text-muted fw-normal ms-1">
                              ({stats?.rejected})
                            </span>
                          </h5>
                        </div>
                        <div className="mx-2">
                          <h5 className="card-title">
                            Suspended
                            <span className="text-muted fw-normal ms-1">
                              ({stats?.suspended})
                            </span>
                          </h5>
                        </div>
                      </div>
                      <div className="col-md-6 d-flex flex-wrap align-items-center justify-content-end">
                        <div className="mb">
                          <button
                            onClick={t_col5}
                            className="btn btn-primary mo-mb-2 mr-10"
                            type="button"
                            style={{ cursor: "pointer" }}
                          >
                            Filters
                          </button>
                          {!(
                            decode.role === "manager" || decode.role === "admin"
                          ) ? (
                            <button
                              type="button"
                              onClick={async () => {
                                tog_large();
                                await getCompanies();
                                await getProperties(decode.domain);
                                await getSpeciality();
                              }}
                              className="btn btn-light "
                              data-toggle="modal"
                              data-target=".bs-example-modal-lg"
                            >
                              <i className="bx bx-plus me-1"></i>Add Maintenance
                              Team
                            </button>
                          ) : (
                            <></>
                          )}
                          <Modal
                            size="lg"
                            isOpen={modal_large}
                            toggle={() => {
                              tog_large();
                            }}
                          >
                            <div className="modal-header">
                              <h5
                                className="modal-title mt-0"
                                id="myLargeModalLabel"
                              >
                                Add Maintenance Team
                              </h5>
                              <button
                                onClick={() => {
                                  tog_large();
                                }}
                                type="button"
                                className="close"
                                data-dismiss="modal"
                                aria-label="Close"
                              >
                                <span aria-hidden="true">&times;</span>
                              </button>
                            </div>
                            <div className="modal-body">
                              <Form onSubmit={addTechnicalStaff}>
                                <div className="row">
                                  <div className="col-md-6">
                                    <div className="mb-3">
                                      <Label
                                        className="form-label"
                                        htmlFor="formrow-facility-input"
                                      >
                                        First Name *
                                      </Label>
                                      <Input
                                        onChange={(e) => {
                                          setManagerFirstName(e.target.value);
                                        }}
                                        type="text"
                                        className="form-control"
                                        id="formrow-phone-input"
                                      />
                                      {check_first ? (
                                        ""
                                      ) : (
                                        <Label style={{ color: "red" }}>
                                          {msg_error}
                                        </Label>
                                      )}
                                    </div>
                                  </div>
                                  <div className="col-md-6">
                                    <div className="mb-3">
                                      <Label
                                        className="form-label"
                                        htmlFor="formrow-facility-input"
                                      >
                                        Last Name *
                                      </Label>
                                      <Input
                                        onChange={(e) => {
                                          setManagerLastName(e.target.value);
                                        }}
                                        type="text"
                                        className="form-control"
                                        id="formrow-phone-input"
                                      />
                                      {check_last ? (
                                        ""
                                      ) : (
                                        <Label style={{ color: "red" }}>
                                          {msg_error1}
                                        </Label>
                                      )}
                                    </div>
                                  </div>
                                  <div className="col-md-6">
                                    <div className="mb-3">
                                      <Label
                                        className="form-label"
                                        htmlFor="formrow-email-input"
                                      >
                                        Email *
                                      </Label>
                                      <Input
                                        onChange={(e) => {
                                          setManagerEmail(e.target.value);
                                        }}
                                        type="text"
                                        className="form-control"
                                        id="formrow-email-input"
                                      />
                                      {check_email ? (
                                        ""
                                      ) : (
                                        <Label style={{ color: "red" }}>
                                          {msg_error4}
                                        </Label>
                                      )}
                                    </div>
                                  </div>
                                  <div className="col-md-6">
                                    <div className="mb-3">
                                      <Label
                                        className="form-label"
                                        htmlFor="formrow-phone-input"
                                      >
                                        Mobile *
                                      </Label>
                                      <Input
                                        onChange={(e) => {
                                          setManagerPhone(e.target.value);
                                        }}
                                        type="number"
                                        onWheel={(e) => e.target.blur()}
                                        className="form-control"
                                        id="formrow-phone-input"
                                      />
                                      {check_mobile ? (
                                        ""
                                      ) : (
                                        <Label style={{ color: "red" }}>
                                          {msg_error5}
                                        </Label>
                                      )}
                                    </div>
                                  </div>

                                  <div className="col-md-6">
                                    <div className="mb-3">
                                      <Label
                                        className="form-label"
                                        htmlFor="formrow-facility-input"
                                      >
                                        Properties *
                                      </Label>
                                      <Select
                                        isMulti
                                        onChange={(selectedOption) => {
                                          const propertys = [];
                                          selectedOption.map((property) => {
                                            propertys.push(property.value);
                                          });
                                          setPropertys(propertys);
                                        }}
                                        options={propertyList}
                                        className="basic-multi-select"
                                        classNamePrefix="select"
                                      />
                                      {check_name ? (
                                        ""
                                      ) : (
                                        <Label style={{ color: "red" }}>
                                          {msg_error3}
                                        </Label>
                                      )}
                                    </div>
                                  </div>
                                  <div className="col-md-6">
                                    <div className="mb-3">
                                      <Label
                                        className="form-label"
                                        htmlFor="formrow-facility-input"
                                      >
                                        Category
                                      </Label>
                                      <Select
                                        isMulti
                                        onChange={(selectedOption) => {
                                          const speciality = [];
                                          selectedOption.map((property) => {
                                            speciality.push(property.value);
                                          });
                                          setSelectedSpecialities(speciality);
                                        }}
                                        options={specialitiesList}
                                        className="basic-multi-select"
                                        classNamePrefix="Select"
                                      />
                                      {check_specialities ? (
                                        ""
                                      ) : (
                                        <Label style={{ color: "red" }}>
                                          {msg_error7}
                                        </Label>
                                      )}
                                    </div>
                                  </div>

                                  <div className="col-md-12">
                                    <div className="mb-3">
                                      <Label
                                        className="form-label"
                                        htmlFor="formrow-firstname-input"
                                      >
                                        Skill
                                      </Label>
                                      <Input
                                        value={skills}
                                        onChange={(e) => {
                                          setSkills(e.target.value);
                                        }}
                                        type="textarea"
                                        className="form-control"
                                        id="formrow-phone-input"
                                      />
                                      {/* {check_skills ? (
                                        ""
                                      ) : (
                                        <Label style={{ color: "red" }}>
                                          {msg_error6}
                                        </Label>
                                      )} */}
                                    </div>
                                  </div>
                                  <div className="col-md-12">
                                    <div className="text-end">
                                      <span
                                        id="errorSpan"
                                        style={{
                                          color: "red",
                                          fontWeight: "bolder",
                                          marginRight: "10px",
                                          display: "none",
                                        }}
                                      ></span>
                                      <button
                                        id="managerSaveBtn"
                                        type="submit"
                                        className="btn btn-success save-user"
                                      >
                                        Save
                                        <div
                                          id="saveSpinner"
                                          style={{
                                            display: "none",
                                            height: "15px",
                                            width: "15px",
                                            marginLeft: "5px",
                                          }}
                                          className="spinner-border"
                                          role="status"
                                        ></div>
                                        <i
                                          id="failedSaveErrorIcon"
                                          style={{
                                            display: "none",
                                            marginLeft: "5px",
                                          }}
                                          className="fa fa-exclamation-triangle"
                                          aria-hidden="true"
                                        ></i>
                                      </button>
                                    </div>
                                  </div>
                                </div>
                              </Form>
                            </div>
                          </Modal>
                        </div>
                      </div>
                    </div>
                    <div className="row">
                      <div className="col-lg-12">
                        <Collapse className="mt-4" isOpen={col5}>
                          <Card>
                            <CardBody>
                              <div className="filter-sec">
                                <Form>
                                  <div class="row align-items-center">
                                    <div className="col-md-3">
                                      <div className="mb-3">
                                        <Label className="form-Label">
                                          Category
                                        </Label>
                                        <select
                                          value={speciality}
                                          onChange={(e) => {
                                            setSpeciality(e.target.value);
                                          }}
                                          className="form-select"
                                        >
                                          <option value="" selected>
                                            Select
                                          </option>
                                          {specialitiesList?.map((items) => {
                                            return (
                                              <option value={items.value}>
                                                {items.label}
                                              </option>
                                            );
                                          })}
                                        </select>
                                      </div>
                                    </div>
                                    <div className="col-md-3">
                                      <div className="mb-3">
                                        <Label
                                          className="form-label"
                                          htmlFor="formrow-code-input"
                                        >
                                          Maintenance Team Id
                                        </Label>
                                        <Input
                                          placeholder="Enter Maintenance Team id"
                                          onChange={(e) => {
                                            setPrimaryID(e.target.value);
                                          }}
                                          type="text"
                                          className="form-control"
                                          id="formrow-code-input"
                                          value={primaryID}
                                        />
                                      </div>
                                    </div>
                                    <div className="col-md-3">
                                      <div className="mb-3">
                                        <Label
                                          className="form-label"
                                          htmlFor="formrow-name-input"
                                        >
                                          Name
                                        </Label>
                                        <Input
                                          placeholder="Enter staff name"
                                          onChange={(e) => {
                                            setName(e.target.value);
                                          }}
                                          className="form-control"
                                          id="formrow-name-input"
                                          value={name}
                                        />
                                      </div>
                                    </div>
                                    <div className="col-md-3">
                                      <div className="mb-3">
                                        <Label
                                          className="form-label"
                                          htmlFor="formrow-code-input"
                                        >
                                          Contact
                                        </Label>
                                        <Input
                                          placeholder="Enter staff contact number"
                                          onChange={(e) => {
                                            setFilterContact(e.target.value);
                                          }}
                                          type="text"
                                          className="form-control"
                                          id="formrow-code-input"
                                          value={filterContact}
                                        />
                                      </div>
                                    </div>

                                    <div className="col-md-3">
                                      <div className="mb-3">
                                        <Label className="form-Label">
                                          Property
                                        </Label>
                                        <Select
                                          value={property}
                                          onChange={(e) => {
                                            setProperty(e);
                                          }}
                                          options={propertySelect?.map((p) => {
                                            return {
                                              value: p._id,
                                              label: p.title,
                                            };
                                          })}
                                        />
                                      </div>
                                    </div>
                                    {/* <div className="col-md-3">
                                      <div className="mb-3">
                                        <Label className="form-Label">
                                          Rating
                                        </Label>
                                        <select
                                          className="form-select"
                                          onChange={(e) => {
                                            setFilterRating(e.target.value);
                                          }}
                                          value={filterRating}
                                        >
                                          <option value="" selected>
                                            Select
                                          </option>
                                          {[1, 2, 3, 4, 5]?.map((v) => (
                                            <option key={v} value={v}>
                                              {v}
                                            </option>
                                          ))}
                                        </select>
                                      </div>
                                    </div> */}
                                    <div className="col-md-12 btn-group d-flex justify-content-end">
                                      <div className="srch-btn">
                                        <button
                                          type="submit"
                                          id="ticketfilter"
                                          onClick={(e) => {
                                            e.preventDefault();
                                            FilterSearch();
                                          }}
                                          className="btn btn-primary"
                                        >
                                          Search
                                        </button>
                                      </div>
                                      <div
                                        className="srch-btn"
                                        style={{ marginLeft: "10px" }}
                                      >
                                        <button
                                          onClick={(e) => {
                                            ClearTicket(e);
                                          }}
                                          className="btn btn-primary"
                                        >
                                          Clear
                                        </button>
                                      </div>
                                    </div>
                                  </div>
                                </Form>
                              </div>
                            </CardBody>
                          </Card>
                        </Collapse>
                      </div>
                    </div>
                  </CardHeader>
                  <CardBody>
                    <div className="table-responsive">
                      <Table className="table-striped table-bordered mb-0">
                        <thead>
                          <tr>
                            <th scope="col">#</th>
                            <th scope="col">Maintenance Team Id</th>
                            <th scope="col">User</th>
                            {/*<th scope="col">Properties</th>*/}
                            {/* <th scope="col">Email</th>
                            <th scope="col">Contact</th> */}

                            {/*<th scope="col">Created By</th>*/}
                            <th scope="col">Properties</th>
                            <th scope="col">Category</th>
                            {/* <th scope="col">Status</th> */}
                            {/* <th scope="col">Rating</th> */}
                            <th scope="col">Completed/Total Jobs</th>
                            {/* <th scope="col">Age</th> */}
                            {decode.role == "company" && (
                              <th scope="col">Action</th>
                            )}
                          </tr>
                        </thead>
                        <tbody>
                          <TechnicalStaffList
                            managers={managers}
                            setManagers={setManagers}
                            FilterSearch={FilterSearch}
                            setStats={setStats}
                            currentPage={currentPage}
                            setotalpm={settotalpropertymanager}
                            pageno={currentPage}
                            setpreviouspage={setpreviouspageno}
                            setnextpage={setnextpageno}
                            setPropertySelect={setPropertySelect}
                          />
                        </tbody>
                      </Table>
                    </div>
                    <Row className="proress-style mt-3">
                      <Col xl={3}></Col>
                      <Col xl={9}>
                        <div className="pagination-bar">
                          <Pagination>
                            <PaginationItem disabled={currentPage === 1}>
                              <PaginationLink
                                first
                                onClick={() => handlePageChange(1)}
                              />
                            </PaginationItem>
                            <PaginationItem disabled={currentPage === 1}>
                              <PaginationLink
                                previous
                                onClick={() =>
                                  handlePageChange(currentPage - 1)
                                }
                              />
                            </PaginationItem>
                            {Array.from(
                              { length: pageLimit },
                              (_, i) => i + startPage
                            ).map((page) => {
                              if (page > pageTotal) return null;
                              return (
                                <PaginationItem
                                  key={page}
                                  active={currentPage === page}
                                >
                                  <PaginationLink
                                    onClick={() => handlePageChange(page)}
                                  >
                                    {page}
                                  </PaginationLink>
                                </PaginationItem>
                              );
                            })}
                            <PaginationItem
                              disabled={currentPage === pageTotal}
                            >
                              <PaginationLink
                                next
                                onClick={() =>
                                  handlePageChange(currentPage + 1)
                                }
                              />
                            </PaginationItem>
                            <PaginationItem
                              disabled={currentPage === pageTotal}
                            >
                              <PaginationLink
                                last
                                onClick={() => handlePageChange(pageTotal)}
                              />
                            </PaginationItem>
                          </Pagination>
                        </div>
                      </Col>
                    </Row>
                  </CardBody>
                </Card>
              </Col>
            </Row>
          </div>
        </div>
      </React.Fragment>
    );
  } else {
    window.location.replace("/Property");
  }
};

export default TechnicalStaff;
