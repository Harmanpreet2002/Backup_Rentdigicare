import React, { useState, useEffect } from "react";
import MetaTags from "react-meta-tags";
import Select from "react-select";
import { Link } from "react-router-dom";
import axios from "../api/axios";
import ManagerList from "./ManagerList";
import jwt_decode from "jwt-decode";
import { AvCheckbox } from "availity-reactstrap-validation";
import { BUCKET_URL, SERVER_URL } from "../ServerLink";
import moment from "moment";

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
  ModalFooter,
  ModalBody,
  Button,
  ModalHeader,
} from "reactstrap";
import Dropzone from "react-dropzone";

//Import Breadcrumb
import Breadcrumbs from "../../components/Common/Breadcrumb";
import { toast } from "react-toastify";

const PropertyManager = () => {
  // form states
  const [managerFirstName, setManagerFirstName] = useState("");
  const [save, setSave] = useState(0);
  const [nextpageno, setnextpageno] = useState(2);
  const [previouspageno, setpreviouspageno] = useState(1);
  const [currentpageno, setcurrentpageno] = useState(1);
  const [managerLastName, setManagerLastName] = useState("");
  const [managerPhone, setManagerPhone] = useState("");
  const [managerEmail, setManagerEmail] = useState("");
  const [managerTimezone, setManagerTimezone] = useState("");
  const [managerStatus, setManagerStatus] = useState("");
  const [totalpropertymanager, settotalpropertymanager] = useState(0);

  const [companyList, setCompanyList] = useState([]);
  const [propertyList, setPropertyList] = useState([]);
  const [filteredProperties, setFilteredProperties] = useState([]);

  const [propertyID, setPropertyID] = useState("");
  const [propertyType, setPropertyType] = useState("");
  const [companyAssigned, setCompanyAssigned] = useState("");
  const [Propertys, setPropertys] = useState([]);
  // TODO documents
  const [managerDocuments, setManagerDocuments] = useState("");
  console.log(Propertys, "setPropertys");
  const [pages, setPages] = useState([]);
  const [currentPage, setCurrentPage] = useState(1);
  const [pageLimit, setPageLimit] = useState(10);

  const [ticketPrivilege, setTicketPrivilege] = useState(false);
  const [applicationPrivilege, setApplicationPrivilege] = useState(false);
  const [calendarPrivilege, setcalendarPrivilege] = useState(false);
  const [managerName, setManagerName] = useState([]);
  const [check_first, setcheck_first] = useState(true);
  const [check_last, setcheck_last] = useState(true);
  const [check_name, setcheck_name] = useState(true);
  const [check_email, setcheck_email] = useState(true);
  const [check_mobile, setcheck_mobile] = useState(true);
  const [check_status, setcheck_status] = useState(true);
  const [check_time, setcheck_time] = useState(true);
  const [check_document, setcheck_document] = useState(true);
  const [check_privilege, setcheck_privilege] = useState(true);
  const [msg_error, setmsg_error] = useState("");
  const [msg_error1, setmsg_error1] = useState("");
  const [msg_error3, setmsg_error3] = useState("");
  const [msg_error4, setmsg_error4] = useState("");
  const [msg_error5, setmsg_error5] = useState("");
  const [msg_error6, setmsg_error6] = useState("");
  const [msg_error7, setmsg_error7] = useState("");
  const [msg_error8, setmsg_error8] = useState("");
  const [filterData, setFilterData] = useState(null);
  const [editData, setEditData] = useState(false);
  const [editManagerId, setEditManagerId] = useState("");
  const [managersList, setManagersList] = useState([]);

  const ADD_MANAGER_URL = "/property_manager/add";
  const UPDATE_MANAGER_URL = `/property_manager/update/${editManagerId}`;
  const GET_COMPANIES_URL = "/company";
  const GET_PROPERTY_URL = "/property/getCompanyProperties";
  const GET_MANAGERS = "/company/get_managers";
  const GET_MANAGERS_URL = `/property_manager/list?page=${currentPage}&limit=10`;
  const [managers, setManagers] = useState([]);
  const [toalmanagaers, settoalmanagaers] = useState(0);
  const decode1 = jwt_decode(window.localStorage.getItem("accessToken"));
  const [showDeleteDialoge, setShowDeleteDialoge] = useState(false);
  const [startPage, setStartPage] = useState(1);
  const pageTotal = Math.ceil(totalpropertymanager / pageLimit);

  console.log(check_privilege, "check_privilege");

  const handlePageChange = (page) => {
    setCurrentPage(page);

    if (page > startPage + pageLimit - 1 || page < startPage) {
      setStartPage(Math.max(1, page - pageLimit / 2));
    }
  };

  const getManagers = async (sorting) => {
    // if (filterData !== null) {
    //   setCurrentPage(1);
    // }
    const response = await axios.post(GET_MANAGERS_URL, {
      role: decode1.role,
      domain: decode1.domain,
      filter: filterData,
      sort: sorting,
    });
    if (response.data.results.managers) {
      const temp = response.data.results.managers;
      console.log(temp, "tempdatatatatatatat");
      settotalpropertymanager(response.data.totalManagers);
      setManagers(temp);
      // settoalmanagaers(response.data.totalManagers)
      console.log(response.data);
    }
  };

  const getManagersList = async () => {
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
        setManagersList(managersList);
        // console.log(managersList , "managersList")
        // console.log(companyManagers , "companyManagers")
      }
    } catch (error) {
      console.log(error); // TODO proper error
    }
  };

  const handleSorting = (e) => {
    // console.log(e.target.value);
    let value = [1, -1];
    let newData = {};
    if (e.target.value == 1) {
      newData["firstname"] = value[0];
      // console.log(e.target.value, "value1");
    } else if (e.target.value == 2) {
      newData["firstname"] = value[1];
      // console.log(e.target.value, "value2");
    } else if (e.target.value == 3) {
      newData["createdAt"] = value[1];
      // console.log(e.target.value, "value2");
    } else if (e.target.value == 4) {
      newData["createdAt"] = value[0];
      // console.log(e.target.value, "value2");
    }
    //  else if (e.target.value == 5) {
    //   newData["modifiedAt"] = value[1];
    //   // console.log(e.target.value, "value2");
    // }else if (e.target.value == 6) {
    //   newData["modifiedAt"] = value[0];
    //   // console.log(e.target.value, "value2");
    // }
    else {
      newData[" "] = " ";
      console.log(e.target.value, "valueelse");
    }

    getManagers(newData);

    console.log(newData, "newData");
  };
  console.log("curr", currentPage, pages);
  function goToNextPage() {
    if (currentPage > 0 && pages.length > currentPage) {
      setCurrentPage((page) => page + 1);
      console.log(currentPage);
    }
  }

  useEffect(() => {
    getManagers();
    getManagersList();
    let total_pages = totalpropertymanager / pageLimit;
    if (totalpropertymanager % pageLimit == 0) {
      setPages(Array.from(Array(Math.round(total_pages)).keys()));
    } else {
      setPages(Array.from(Array(parseInt(total_pages) + 1).keys()));
    }
    console.log(
      "totalpropertymanager / pageLimit",
      totalpropertymanager,
      pageLimit
    );
    console.log(
      Array.from(Array(Math.round(totalpropertymanager / pageLimit)).keys())
    );
  }, [totalpropertymanager, currentPage]);

  function goToPreviousPage() {
    if (currentPage > 1) {
      setCurrentPage((page) => page - 1);
    }
  }

  function changePage(event) {
    setCurrentPage(event);
  }

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

  async function deletePropertyManager() {
    try {
      const response = await axios.delete(
        `/property_manager/delete?userID=${decode.id}&managerID=${editManagerId}`
      );
      if (response.data.status === 200) {
        toast.success(response.data.message);
        setEditManagerId("");
        setShowDeleteDialoge(false);
        getManagers();
      } else {
        toast.warning(response.data.message);
      }
    } catch (error) {
      console.log(error.message);
    }
  }

  // Getting Properties for options
  async function getProperties(companyDomain) {
    try {
      const response = await axios.post(GET_PROPERTY_URL, {
        domain: companyDomain,
      });

      const list = response.data.properties?.map((element) => {
        return { label: element.title, value: element._id };
      });
      setPropertyList(list);
    } catch (error) {
      console.log("Unable to fetch");
    }
  }

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

  // Add property Manager
  // TODO add validation before axios call
  async function addPropertyManager(event) {
    event.preventDefault();

    if (managerFirstName === "") {
      setcheck_first(false);
      setmsg_error("First Name is required!");
    } else {
      setcheck_first(true);
    }

    if (managerFirstName) {
      if (!managerFirstName.match(/^[A-Za-z]+$/)) {
        setcheck_first(false);
        setmsg_error("Only letters are allowed!");
      } else {
        setcheck_first(true);
      }
    }

    if (managerLastName === "") {
      setcheck_last(false);
      setmsg_error1("Last Name is required!");
    } else {
      setcheck_last(true);
    }

    if (managerLastName) {
      if (!managerLastName.match(/^[A-Za-z]+$/)) {
        setcheck_last(false);
        setmsg_error1("Only letters are allowed!");
      } else {
        setcheck_last(true);
      }
    }

    if (!managerEmail) {
      setcheck_email(false);
      setmsg_error4("Email is required!");
    } else {
      setcheck_email(true);
    }

    if (managerEmail) {
      if (!managerEmail.match(/\S+@\S+\.\S+/)) {
        setcheck_email(false);
        setmsg_error4("Please enter valid email!");
      } else {
        setcheck_email(true);
      }
    }

    if (!managerPhone) {
      setcheck_mobile(false);
      setmsg_error5("Mobile number is required!");
    } else {
      setcheck_mobile(true);
    }
    if (managerPhone) {
      if (managerPhone.length !== 10) {
        setcheck_mobile(false);
        setmsg_error5("Please enter valid mobile number!");
      } else {
        setcheck_mobile(true);
      }
    }

    if (!managerStatus) {
      setcheck_status(false);
      setmsg_error6("Please select a Status!");
    } else {
      setcheck_status(true);
    }

    if (!managerTimezone) {
      setcheck_time(false);
      setmsg_error7("Please select a Timezone!");
    } else {
      setcheck_time(true);
    }

    if (Propertys.length <= 0) {
      setcheck_name(false);
      setmsg_error3("Please select a property");
    } else {
      setcheck_name(true);
    }

    if (
      [ticketPrivilege, applicationPrivilege, calendarPrivilege].includes(true)
    ) {
      setcheck_privilege(true);
    } else {
      setcheck_privilege(false);
      setmsg_error8("Please select a Privilege");
    }

    // if (!editData && selectedFiles.length <= 0) {
    //   setcheck_document(false);
    //   setmsg_error8("Documents required!");
    // } else {
    //   setcheck_document(true);
    // }ticketPrivilege

    const saveSpinner = document.getElementById("saveSpinner");
    const failedSaveErrorIcon = document.getElementById("failedSaveErrorIcon");
    const managerSaveBtn = document.getElementById("managerSaveBtn");
    const errorSpan = document.getElementById("errorSpan");
    const domain = decode.domain;

    managerSaveBtn.disabled = true;
    saveSpinner.style.display = "inline-block";
    failedSaveErrorIcon.style.display = "none";
    errorSpan.style.display = "none";

    if (!editData) {
      if (
        managerFirstName &&
        check_first &&
        managerLastName &&
        check_last &&
        Propertys &&
        check_name &&
        managerEmail &&
        check_email &&
        managerPhone &&
        check_mobile &&
        managerStatus &&
        check_status &&
        managerTimezone &&
        check_time &&
        [ticketPrivilege, applicationPrivilege, calendarPrivilege].includes(
          true
        )
      ) {
        try {
          const response = await axios.post(ADD_MANAGER_URL, {
            firstname: managerFirstName,
            lastname: managerLastName,
            email: managerEmail,
            mobile: managerPhone,
            status: managerStatus,
            timezone: managerTimezone,
            properties: Propertys?.map((property) => property.value),
            ticketPrivilege: ticketPrivilege,
            applicationPrivilege: applicationPrivilege,
            calendarPrivilege: calendarPrivilege,
            companyAssigned: domain,
            companyID: decode.id,
            documents: [], // TODO documents
          });

          if (response.data.status === 201) {
            await uploadDocuments(response.data.id);
            toast.success(response.data.message);
            handleCloseModal();
            getManagers();
          } else if (response.data.status === 400) {
            errorSpan.innerText = response.data.message;
            saveSpinner.style.display = "none";
            managerSaveBtn.disabled = false;
            failedSaveErrorIcon.style.display = "inline-block";
            errorSpan.style.display = "inline-block";
          } else {
            errorSpan.innerText = response.data.message;
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
    } else {
      try {
        if (
          [ticketPrivilege, applicationPrivilege, calendarPrivilege].includes(
            true
          )
        ) {
          const response = await axios.put(UPDATE_MANAGER_URL, {
            firstname: managerFirstName,
            lastname: managerLastName,
            email: managerEmail,
            mobile: managerPhone,
            status: managerStatus,
            timezone: managerTimezone,
            properties: Propertys?.map((property) => property.value),
            ticketPrivilege: ticketPrivilege,
            applicationPrivilege: applicationPrivilege,
            calendarPrivilege: calendarPrivilege,
            companyAssigned: domain,
            companyID: decode.id,
            documents: [], // TODO documents
          });

          if (response.data.status === 201) {
            selectedFiles?.length > 0 &&
              (await uploadDocuments(response.data.id));
            toast.success(response.data.message);
            handleCloseModal();
            getManagers();
          } else if (response.data.status === 400) {
            errorSpan.innerText = response.data.message;
            saveSpinner.style.display = "none";
            managerSaveBtn.disabled = false;
            failedSaveErrorIcon.style.display = "inline-block";
            errorSpan.style.display = "inline-block";
          } else {
            errorSpan.innerText = response.data.message;
            saveSpinner.style.display = "none";
            managerSaveBtn.disabled = false;
            failedSaveErrorIcon.style.display = "inline-block";
            errorSpan.style.display = "inline-block";
          }

          console.log(response.data.status);
        }
      } catch (error) {
        saveSpinner.style.display = "none";
        managerSaveBtn.disabled = false;
        failedSaveErrorIcon.display = "inline-block";
      }
    }

    saveSpinner.style.display = "none";
    managerSaveBtn.disabled = false;
    errorSpan.style.display = "inline-block";
  }

  const filter = async () => {
    const response = await axios.get(
      SERVER_URL +
        `/property_manager/filter?role=${decode1.role}&domain=${decode1.domain}`
    );
    setManagerName(response.data.properties);
    console.log(response.data.properties, "response");
  };

  const filterDataHandle = (e, name, data) => {
    // console.log(name ,"dsgfdsfvgjbndfkj" , data)
    console.log(e, name, data, "SDDDDDDD");
    let newData = { ...filterData };
    if (name == "firstname") {
      newData[name] = data;
    } else if (name == "status") {
      newData[name] = data;
    } else {
      newData[name] = " ";
    }
    setFilterData(newData);
  };

  const onchangetext = (e, name) => {
    console.log(name, "dsgfdsfvgjbndfkj", e.target.value);
    let newData = { ...filterData };
    if (name === "email") {
      newData[name] = e.target.value;
    } else if (name === "ID") {
      newData[name] = e.target.value;
    } else if (name === "phone") {
      newData[name] = e.target.value;
    } else {
      newData[name] = "";
    }
    setFilterData(newData);
    console.log(filterData, "filterData");
    console.log(newData, "newData");
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

  const deleteDocument = (index) => {
    setselectedFiles(selectedFiles.filter((_, i) => i !== index));
    // console.log(selectedFiles)
  };

  const handleCloseModal = () => {
    tog_large();

    setcheck_first(true);
    setcheck_last(true);
    setcheck_name(true);
    setcheck_email(true);
    setcheck_mobile(true);
    setcheck_status(true);
    setcheck_time(true);
    setcheck_document(true);
    setcheck_privilege(true);
    setEditData(false);
    setManagerFirstName("");
    setManagerLastName("");
    setManagerStatus("");
    setManagerEmail("");
    setManagerTimezone("");
    setManagerPhone("");
    setApplicationPrivilege(false);
    setcalendarPrivilege(false);
    setTicketPrivilege(false);
    setPropertys([]);
    setEditManagerId("");
  };

  if (decode.role !== "manager") {
    return (
      <React.Fragment>
        <div className="page-content">
          <MetaTags>
            <title> Rentdigicare | Property Manager</title>
          </MetaTags>
          <div className="container-fluid">
            <Breadcrumbs title="Home" breadcrumbItem="Property Manager" />
            <Row>
              <Col xl={12}>
                <Card>
                  <CardHeader>
                    <div className="row align-items-center">
                      <div className="col-md-6">
                        <div className="mb">
                          <h5 className="card-title">
                            Total
                            <span className="text-muted fw-normal ms-2">
                              ({totalpropertymanager})
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
                              }}
                              className="btn btn-light "
                              data-toggle="modal"
                              data-target=".bs-example-modal-lg"
                            >
                              <i className="bx bx-plus me-1"></i>Add Manager
                            </button>
                          ) : (
                            <></>
                          )}
                          <Modal
                            size="lg"
                            isOpen={modal_large}
                            toggle={() => {
                              handleCloseModal();
                            }}
                          >
                            <div className="modal-header">
                              <h5
                                className="modal-title mt-0"
                                id="myLargeModalLabel"
                              >
                                {editData ? "Edit " : "Add"} Property Manager
                              </h5>
                              <button
                                onClick={() => {
                                  handleCloseModal();
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
                              <Form onSubmit={addPropertyManager}>
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
                                        placeholder="Enter first name"
                                        value={managerFirstName}
                                        onBlur={(e) => {
                                          const value = e.target.value;
                                          if (!value) {
                                            setcheck_first(false);
                                            setmsg_error(
                                              "First Name is required!"
                                            );
                                          } else {
                                            setcheck_first(true);
                                          }

                                          const test =
                                            value.match(/^[A-Za-z]+$/);
                                          if (!test) {
                                            setcheck_first(false);
                                            setmsg_error(
                                              "Only letters are allowed!"
                                            );
                                          } else {
                                            setcheck_first(true);
                                          }
                                        }}
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
                                        placeholder="Enter last name"
                                        value={managerLastName}
                                        onBlur={(e) => {
                                          const value = e.target.value;
                                          if (!value) {
                                            setcheck_last(false);
                                            setmsg_error1(
                                              "Last Name is required!"
                                            );
                                          } else {
                                            setcheck_last(true);
                                          }
                                          const test =
                                            value.match(/^[A-Za-z]+$/);
                                          if (!test) {
                                            setcheck_last(false);
                                            setmsg_error1(
                                              "Only letters are allowed!"
                                            );
                                          } else {
                                            setcheck_last(true);
                                          }
                                        }}
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
                                        htmlFor="formrow-facility-input"
                                      >
                                        Property Name *
                                      </Label>
                                      <Select
                                        isMulti
                                        value={Propertys}
                                        onBlur={(e) => {
                                          if (!Propertys?.length > 0) {
                                            setcheck_name(false);
                                            setmsg_error3(
                                              "Please select a Property!"
                                            );
                                          } else {
                                            setcheck_name(true);
                                          }
                                        }}
                                        onChange={(selectedOption) => {
                                          const propertys = [];
                                          selectedOption.map((property) => {
                                            propertys.push(property);
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
                                      {/* <select
                                        className="form-select"
                                        onChange={(e) => {
                                          setPropertyID(e.target.value);
                                          console.log(e.target.value);
                                          const filteredProperties =
                                            propertyList.filter(
                                              (property) =>
                                                property._id == e.target.value
                                            );
                                          setFilteredProperties(
                                            filteredProperties
                                          );
                                        }}
                                      >
                                        <option>Select</option>
                                        {propertyList.map((property) => (
                                          <option value={property._id}>
                                            {property.title}
                                          </option>
                                        ))}
                                      </select> */}
                                    </div>
                                  </div>
                                  {/* <div className="col-md-6">
                                    <div className="mb-3">
                                      <Label
                                        className="form-label"
                                        htmlFor="formrow-facility-input"
                                      >
                                        Property Type
                                      </Label>
                                      <select
                                        onChange={(e) => {
                                          setPropertyType(e.target.value);
                                        }}
                                        className="form-select"
                                      >
                                        <option>Select</option>
                                        {filteredProperties.map((property) =>
                                          property.category.map((cata) => (
                                            <option value={cata}>{cata}</option>
                                          ))
                                        )}
                                      </select>
                                    </div>
                                  </div> */}

                                  <div className="col-md-6">
                                    <div className="mb-3">
                                      <Label
                                        className="form-label"
                                        htmlFor="formrow-email-input"
                                      >
                                        Email *
                                      </Label>
                                      <Input
                                        placeholder="Enter email address"
                                        value={managerEmail}
                                        onBlur={(e) => {
                                          const value = e.target.value;
                                          if (!value) {
                                            setcheck_email(false);
                                            setmsg_error4("Email is required!");
                                          } else {
                                            setcheck_email(true);
                                          }
                                          const test =
                                            value.match(/\S+@\S+\.\S+/);
                                          if (!test) {
                                            setcheck_email(false);
                                            setmsg_error4(
                                              "Please enter valid email!"
                                            );
                                          } else {
                                            setcheck_email(true);
                                          }
                                        }}
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
                                        placeholder="Enter mobile number"
                                        value={managerPhone}
                                        onBlur={(e) => {
                                          const value = e.target.value;
                                          if (!value) {
                                            setcheck_mobile(false);
                                            setmsg_error5(
                                              "Mobile number is required!"
                                            );
                                          } else {
                                            setcheck_mobile(true);
                                          }
                                          const test =
                                            value.match(/^[0-9]{10}$/);
                                          if (!test) {
                                            setcheck_mobile(false);
                                            setmsg_error5(
                                              "Please enter valid mobile number!"
                                            );
                                          } else {
                                            setcheck_mobile(true);
                                          }
                                        }}
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
                                      <Label className="form-Label">
                                        Status *
                                      </Label>
                                      <select
                                        value={managerStatus}
                                        onBlur={(e) => {
                                          const value = e.target.value;
                                          if (!value) {
                                            setcheck_status(false);
                                            setmsg_error6(
                                              "Please select a Status!"
                                            );
                                          } else {
                                            setcheck_status(true);
                                          }
                                        }}
                                        onChange={(e) => {
                                          setManagerStatus(e.target.value);
                                        }}
                                        className="form-select"
                                      >
                                        <option value="">Select</option>
                                        <option value="Active">Active</option>
                                        <option value="Inactive">
                                          In-active
                                        </option>
                                      </select>
                                      {check_status ? (
                                        ""
                                      ) : (
                                        <Label style={{ color: "red" }}>
                                          {msg_error6}
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
                                        Time Zone *
                                      </Label>
                                      <select
                                        value={managerTimezone}
                                        onBlur={(e) => {
                                          const value = e.target.value;
                                          if (!value) {
                                            setcheck_time(false);
                                            setmsg_error7(
                                              "Please select a Timezone!"
                                            );
                                          } else {
                                            setcheck_time(true);
                                          }
                                        }}
                                        onChange={(e) => {
                                          setManagerTimezone(e.target.value);
                                        }}
                                        className="form-select"
                                      >
                                        <option value="">Select</option>
                                        <option value="CA/Newfoundland">
                                          CA/Newfoundland
                                        </option>
                                        <option value="CA/Atlantic">
                                          CA/Atlantic
                                        </option>
                                        <option value="CA/Central">
                                          CA/Central
                                        </option>
                                        <option value="CA/Eastern">
                                          CA/Eastern
                                        </option>
                                        <option value="CA/Mountain">
                                          CA/Mountain
                                        </option>
                                        <option value="CA/Pacific">
                                          CA/Pacific
                                        </option>
                                      </select>
                                      {check_time ? (
                                        ""
                                      ) : (
                                        <Label style={{ color: "red" }}>
                                          {msg_error7}
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
                                        Privilege *
                                      </Label>
                                      <br />
                                      <Input
                                        type="checkbox"
                                        checked={applicationPrivilege}
                                        onChange={(e) => {
                                          if (e.target.checked) {
                                            setApplicationPrivilege(
                                              e.target.checked
                                            );
                                            setcheck_privilege(true);
                                          } else {
                                            setApplicationPrivilege(
                                              e.target.checked
                                            );
                                            if (!editData) {
                                              setcheck_privilege(false);
                                              setmsg_error8(
                                                "Please select a Privilege"
                                              );
                                            }
                                          }
                                        }}
                                      />{" "}
                                      Applications{" "}
                                      <Input
                                        type="checkbox"
                                        checked={ticketPrivilege}
                                        onChange={(e) => {
                                          setTicketPrivilege(!ticketPrivilege);
                                        }}
                                      />{" "}
                                      Maintenance Request{`  `}
                                      <Input
                                        type="checkbox"
                                        checked={calendarPrivilege}
                                        onChange={(e) => {
                                          setcalendarPrivilege(
                                            !calendarPrivilege
                                          );
                                        }}
                                      />{" "}
                                      {}
                                      Calendar
                                    </div>
                                    {check_privilege ? (
                                      ""
                                    ) : (
                                      <Label style={{ color: "red" }}>
                                        {msg_error8}
                                      </Label>
                                    )}
                                    {/* <AvCheckbox label={"Ticket"} />
                                      <AvCheckbox label={"Application"} /> */}
                                  </div>
                                  <div className="col-md-12">
                                    <div className="mb-3">
                                      <Label
                                        className="form-label"
                                        htmlFor="formrow-firstname-input"
                                      >
                                        Documents
                                      </Label>
                                      <Dropzone
                                        onDrop={(acceptedFiles) => {
                                          handleAcceptedFiles(acceptedFiles);
                                        }}
                                      >
                                        {({ getRootProps, getInputProps }) => (
                                          <div className="dropzone">
                                            <div
                                              className="dz-message needsclick mt-2"
                                              {...getRootProps()}
                                            >
                                              <input {...getInputProps()} />
                                              <div className="mb-3">
                                                <i className="display-4 text-muted bx bxs-cloud-upload" />
                                              </div>
                                              <h4>
                                                Drop files here or click to
                                                upload.
                                              </h4>
                                            </div>
                                          </div>
                                        )}
                                      </Dropzone>
                                      <div
                                        className="dropzone-previews mt-3"
                                        id="file-previews"
                                      >
                                        {selectedFiles.map((f, i) => {
                                          return (
                                            <Card
                                              className="mt-1 mb-0 shadow-none border dz-processing dz-image-preview dz-success dz-complete"
                                              key={i + "-file"}
                                            >
                                              <div className="p-2">
                                                <Row className="align-items-center">
                                                  <Col className="col-auto">
                                                    <img
                                                      data-dz-thumbnail=""
                                                      height="80"
                                                      className="avatar-sm rounded bg-light"
                                                      alt={f.name}
                                                      src={f.preview}
                                                    />
                                                  </Col>
                                                  <Col>
                                                    <Link
                                                      to="#"
                                                      className="text-muted font-weight-bold"
                                                    >
                                                      {f.name}
                                                    </Link>
                                                    <p className="mb-0">
                                                      <strong>
                                                        {f.formattedSize}
                                                      </strong>
                                                    </p>
                                                  </Col>
                                                  <Col className="trash-btn">
                                                    <button
                                                      type="button"
                                                      className="btn btn-soft-danger waves-effect waves-light"
                                                      href="javascript:void(0)"
                                                      onClick={() =>
                                                        deleteDocument(i)
                                                      }
                                                    >
                                                      <i className="bx bx-trash-alt"></i>
                                                    </button>
                                                  </Col>
                                                </Row>
                                              </div>
                                            </Card>
                                          );
                                        })}
                                        {check_document ? (
                                          ""
                                        ) : (
                                          <Label style={{ color: "red" }}>
                                            {msg_error8}
                                          </Label>
                                        )}
                                      </div>
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
                                        disabled={[
                                          check_document,
                                          check_email,
                                          check_first,
                                          check_last,
                                          check_mobile,
                                          check_name,
                                          check_status,
                                          check_time,
                                          check_privilege,
                                        ].includes(false)}
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
                                <Form
                                  onSubmit={(e) => {
                                    e.preventDefault();
                                    getManagers();
                                  }}
                                >
                                  <div class="row align-items-center">
                                    {/*<div className="col-md-3">*/}
                                    {/*    <div className="mb-3">*/}
                                    {/*        <Label className="form-Label">Property Type</Label>*/}
                                    {/*        <select className="form-select">*/}
                                    {/*            <option>Select One</option>*/}
                                    {/*            <option>Type 1</option>*/}
                                    {/*            <option>Type 2</option>*/}
                                    {/*            <option>Type 3</option>*/}
                                    {/*            <option>Type 4</option>*/}
                                    {/*        </select>*/}
                                    {/*    </div>*/}
                                    {/*</div>*/}
                                    {/*<div className="col-md-3">*/}
                                    {/*    <div className="mb-3">*/}
                                    {/*        <Label className="form-label" htmlFor="formrow-facility-input">Property Name</Label>*/}
                                    {/*        <select className="form-select">*/}
                                    {/*            <option>Select</option>*/}
                                    {/*            <option>Property Name 1</option>*/}
                                    {/*            <option>Property Name 2</option>*/}
                                    {/*            <option>Property Name 3</option>*/}
                                    {/*            <option>Property Name 4</option>*/}
                                    {/*            <option>Property Name 5</option>*/}
                                    {/*            <option>Property Name 6</option>*/}
                                    {/*        </select>*/}
                                    {/*    </div>*/}
                                    {/*</div>*/}
                                    <div className="col-md-3">
                                      <div className="mb-3">
                                        <Label
                                          className="form-label"
                                          htmlFor="formrow-task-input"
                                        >
                                          Manager Name
                                        </Label>
                                        <Select
                                          options={managersList?.map((item) => {
                                            return {
                                              value: `${item.label}`,
                                              label: `${item.label}`,
                                            };
                                          })}
                                          placeholder="Search By Name"
                                          onChange={(e) => {
                                            filterDataHandle(
                                              e,
                                              "firstname",
                                              e.value.split(" ")[0]
                                            );
                                          }}
                                        />
                                        {/* <select
                                          className="form-select"
                                          onChange={(e) =>
                                            filterDataHandle(
                                              e,
                                              "firstname",
                                              e.target.value
                                            )
                                          }
                                        >
                                          <option value="">Select One</option>
                                          {managerName &&
                                            managerName.map((item) => {
                                              return (
                                                <>
                                                  <option value={item.Name}>
                                                    {item.Name}
                                                  </option>
                                                </>
                                              );
                                            })}
                                        </select> */}
                                      </div>
                                    </div>
                                    <div className="col-md-3">
                                      <div className="mb-3">
                                        <Label
                                          className="form-label"
                                          htmlFor="formrow-task-input"
                                        >
                                          Email
                                        </Label>
                                        <Input
                                          placeholder="Enter email address"
                                          type="text"
                                          className="form-control"
                                          onChange={(e) =>
                                            onchangetext(e, "email")
                                          }
                                          id="formrow-task-input"
                                        />
                                      </div>
                                    </div>
                                    <div className="col-md-3">
                                      <div className="mb-3">
                                        <Label
                                          className="form-label"
                                          htmlFor="formrow-task-input"
                                        >
                                          ID
                                        </Label>
                                        <Input
                                          placeholder="Enter manager ID"
                                          type="text"
                                          className="form-control"
                                          onChange={(e) =>
                                            onchangetext(e, "ID")
                                          }
                                          id="formrow-task-input"
                                        />
                                      </div>
                                    </div>
                                    <div className="col-md-3">
                                      <div className="mb-3">
                                        <Label
                                          className="form-label"
                                          htmlFor="formrow-task-input"
                                        >
                                          Phone
                                        </Label>
                                        <Input
                                          placeholder="Enter phone number"
                                          type="text"
                                          className="form-control"
                                          onChange={(e) =>
                                            onchangetext(e, "phone")
                                          }
                                          id="formrow-task-input"
                                        />
                                      </div>
                                    </div>

                                    {/*<div className="col-md-3">*/}
                                    {/*    <div className="mb-3">*/}
                                    {/*        <Label htmlFor="example-date-input" className="form-Label">Created on</Label>*/}
                                    {/*        <Input className="form-control" type="date" defaultValue="2019-08-19" id="example-date-input" />*/}
                                    {/*    </div>*/}
                                    {/*</div>*/}
                                    <div className="col-md-3">
                                      <div className="mb-3">
                                        <Label className="form-Label">
                                          Status
                                        </Label>
                                        <select
                                          className="form-select"
                                          onChange={(e) =>
                                            filterDataHandle(
                                              e,
                                              "status",
                                              e.target.value
                                            )
                                          }
                                        >
                                          <option value="">Select One</option>
                                          <option value="Active">Active</option>
                                          <option value="Inactive">
                                            Inactive
                                          </option>
                                        </select>
                                      </div>
                                    </div>
                                    <div className="col-md-12 searchClear-btns justify-content-end d-flex">
                                      <div className="srch-btn">
                                        <button
                                          type="submit"
                                          className="btn btn-primary"
                                        >
                                          Search
                                        </button>
                                      </div>
                                      <div className="srch-btn">
                                        <button
                                          type="submit"
                                          className="btn btn-primary"
                                          onClick={() =>
                                            window.location.reload()
                                          }
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
                      <div>
                        <select
                          onChange={(e) => handleSorting(e)}
                          style={{
                            borderRadius: "4px",
                            marginBottom: "10px",
                            borderColor: "#d1d1d5",
                          }}
                        >
                          <option>Sorting </option>
                          <option value={1}>A-Z</option>
                          <option value={2}>Z-A</option>
                          <option value={3}>Created Latest</option>
                          <option value={4}>Created Oldest</option>
                          {/* <option value={5}>Modified Latest</option>
                          <option value={6}>Modified Oldest</option> */}
                        </select>
                      </div>
                      <Table className="table-striped table-bordered mb-0">
                        <thead>
                          <tr>
                            <th scope="col">#</th>
                            <th scope="col">Manager</th>
                            {/* <th scope="col">Name</th> */}
                            {/*<th scope="col">Properties</th>*/}
                            <th scope="col">Email</th>
                            <th scope="col">Mobile</th>

                            <th scope="col">Created By</th>
                            <th scope="col">Docs</th>
                            {/* <th scope="col">Age</th> */}
                            <th scope="col">Status</th>
                            <th scope="col">No. Of Properties</th>
                            {decode.role === "company" && (
                              <th scope="col">Action</th>
                            )}
                          </tr>
                        </thead>
                        <tbody>
                          {/* <ManagerList setotalpm={settotalpropertymanager} pageno={currentPage} setpreviouspage={setpreviouspageno} setnextpage={setnextpageno} /> */}
                          {managers &&
                            managers.map((item, index) => {
                              return (
                                <>
                                  <tr>
                                    <td>{index + 1}</td>
                                    <td>
                                      <strong className="text-muted">
                                        {item.firstname + " " + item.lastname}
                                      </strong>

                                      <br />
                                      <small className="text-primary">
                                        {item.primaryID}
                                      </small>
                                    </td>
                                    {/*<td>20</td> */}
                                    <td>{item.email}</td>
                                    <td>{item.mobile}</td>
                                    <td>
                                      {moment(item.createdAt).format(
                                        "YYYY-MM-DD"
                                      )}
                                    </td>
                                    <td>
                                      {item.documents?.length > 0 &&
                                      !item?.documents[0]?.includes(
                                        BUCKET_URL
                                      ) ? (
                                        <div>
                                          <a
                                            href={`${SERVER_URL}/property_manager/download-document?ID=${item._id}`}
                                            download={`${
                                              item.firstname +
                                              " " +
                                              item.lastname
                                                ? item.firstname +
                                                  " " +
                                                  item.lastname
                                                : "propertyManager"
                                            }.zip`}
                                          >
                                            <button
                                              type="button"
                                              className="btn @btn-soft-light btn-md w-xs waves-effect btn-label waves-light  doc-download-btn"
                                            >
                                              <i className="bx bx-download label-icon"></i>
                                            </button>
                                          </a>
                                        </div>
                                      ) : item.documents?.length > 0 &&
                                        item?.documents[0]?.includes(
                                          BUCKET_URL
                                        ) ? (
                                        <button
                                          onClick={async () => {
                                            item.documents.map((file) => {
                                              window.location.href = file;
                                            });
                                          }}
                                          type="button"
                                          className="btn btn-soft-light btn-sm w-xs waves-effect "
                                        >
                                          <i className="bx bx-download label-icon"></i>
                                        </button>
                                      ) : (
                                        "NA"
                                      )}
                                    </td>
                                    {/* <td>56</td> */}
                                    <td>{item.status}</td>

                                    <td>
                                      <Link
                                        title="View Property"
                                        to={{
                                          pathname: "/property",
                                          state: { name: item._id },
                                        }}
                                      >
                                        {item.properties?.length}
                                      </Link>
                                    </td>
                                    {decode.role === "company" && (
                                      <td>
                                        <div className="d-flex gap-3">
                                          {/* <Link className="text-success" to="#">
          <i
            className="mdi mdi-pencil font-size-18"
            id="edittooltip"
            onClick={() => {
               // tog_large()
            }}
            data-toggle="modal"
            data-target=".bs-example-modal-lg"
          ></i>
        </Link> */}
                                          <Link className="text-danger" to="#">
                                            <i
                                              className="mdi mdi-delete font-size-18"
                                              id="deletetooltip"
                                              onClick={(e) => {
                                                e.preventDefault();
                                                setEditManagerId(item._id);
                                                setShowDeleteDialoge(
                                                  !showDeleteDialoge
                                                );
                                              }}
                                            ></i>
                                            <Modal
                                              isOpen={showDeleteDialoge}
                                              toggle={() => {
                                                setEditManagerId("");
                                                setShowDeleteDialoge(
                                                  !showDeleteDialoge
                                                );
                                              }}
                                            >
                                              <ModalHeader
                                                toggle={() => {
                                                  setEditManagerId("");
                                                  setShowDeleteDialoge(
                                                    !showDeleteDialoge
                                                  );
                                                }}
                                              >
                                                Confirm
                                              </ModalHeader>
                                              <ModalBody>
                                                Are you sure you want to delete
                                                this?
                                              </ModalBody>
                                              <ModalFooter>
                                                <Button
                                                  color="secondary"
                                                  onClick={() => {
                                                    setEditManagerId("");
                                                    setShowDeleteDialoge(
                                                      !showDeleteDialoge
                                                    );
                                                  }}
                                                >
                                                  Cancel
                                                </Button>
                                                <Button
                                                  color="danger"
                                                  onClick={async () =>
                                                    await deletePropertyManager()
                                                  }
                                                >
                                                  Delete
                                                </Button>
                                              </ModalFooter>
                                            </Modal>
                                            <i
                                              className="mdi mdi-border-color font-size-18"
                                              // id="deletetooltip"
                                              style={{ color: "black" }}
                                              onClick={async () => {
                                                console.log("itesm", item);
                                                await getCompanies();
                                                await getProperties(
                                                  decode.domain
                                                );
                                                setEditManagerId(item?._id);
                                                setEditData(true);
                                                setManagerFirstName(
                                                  item.firstname
                                                );
                                                setManagerLastName(
                                                  item.lastname
                                                );
                                                setManagerStatus(item.status);
                                                setManagerEmail(item.email);
                                                setManagerTimezone(
                                                  item.timezone
                                                );
                                                setManagerPhone(item.mobile);
                                                setApplicationPrivilege(
                                                  item.applicationPrivilege
                                                );
                                                setTicketPrivilege(
                                                  item.ticketPrivilege
                                                );
                                                setcalendarPrivilege(
                                                  item.calendarPrivilege
                                                );
                                                const prop =
                                                  item?.propertyList?.map(
                                                    (p) => {
                                                      return {
                                                        label: p.title,
                                                        value: p._id,
                                                      };
                                                    }
                                                  );
                                                setPropertys(prop);
                                                tog_large();
                                                // await getCompanies();
                                              }}
                                            ></i>
                                          </Link>
                                        </div>
                                      </td>
                                    )}
                                  </tr>
                                </>
                              );
                            })}
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

export default PropertyManager;
