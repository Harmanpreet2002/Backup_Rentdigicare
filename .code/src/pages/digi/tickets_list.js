import React, { useEffect, useState } from "react";
import MetaTags from "react-meta-tags";
import Select from "react-select";
import { Link, useHistory } from "react-router-dom";
import { CopyToClipboard } from "react-copy-to-clipboard";

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
  Nav,
  NavItem,
  NavLink,
  TabContent,
  TabPane,
  Pagination,
  PaginationItem,
  Collapse,
  PaginationLink,
  Input,
} from "reactstrap";

import TicketListRow from "./TicketList";
import Dropzone from "react-dropzone";
// Form Editor
import { Editor } from "react-draft-wysiwyg";
import "react-draft-wysiwyg/dist/react-draft-wysiwyg.css";

// Form Mask
import InputMask from "react-input-mask";

//Import Breadcrumb
import Breadcrumbs from "../../components/Common/Breadcrumb";
import classnames from "classnames";
import jwt_decode from "jwt-decode";
import axios from "../api/axios";

const TicketList = () => {
  const decode = jwt_decode(window.localStorage.getItem("accessToken"));
  const GET_PROPERTY_URL = "/property/applicant-option";
  const GET_PROPERTY_DATA = "/ticket/getdata";
  const CUSTOMER_SEARCH_URL = "/ticket/filter_tickets_customer";
  const MANAGER_SEARCH_URL = "/ticket/filter_tickets_manager";
  const COMPNAY_SEARCH_URL = "/ticket/filter_tickets_company";
  const EXCEL_DOWNLOAD_URL = "/ticket/download_excel";
  const TOTAL_TICKETS_URL = `/ticket/total`;
  var userRole = JSON.parse(window.localStorage.getItem("authUser")).role;

  const DUR = (props) => (
    <InputMask
      mask="99.99"
      value={props.value}
      className="form-control input-color"
      onChange={props.onChange}
    ></InputMask>
  );

  const optionMulti = [
    { label: "Choice 1", value: "choice-1" },
    { label: "Choice 2", value: "choice-2" },
    { label: "Choice 3", value: "choice-3" },
  ];

  const [col5, setcol5] = useState(false);
  const t_col5 = () => {
    setcol5(!col5);
  };

  const history = useHistory();

  const [modal_large, setmodal_large] = useState(false);
  const [modal_large2, setmodal_large2] = useState(false);
  const [customActiveTab, setcustomActiveTab] = useState("1");

  const [propertyList, setPropertyList] = useState([]);
  const [property, setProperty] = useState("");

  const [filterFromDate, setFilterFromDate] = useState();
  const [filterToDate, setFilterToDate] = useState();

  const [filterStatus, setFilterStatus] = useState("");
  const [filterTicketId, setFilterTicketId] = useState("");
  const [page, setPage] = useState(0);

  const [filtername, setFiltername] = useState("");
  const [filteredTickets, setFilteredTickets] = useState([]);
  const [notesCount, setNotesCount] = useState([]);
  const [totalTickets, setTotalTickets] = useState(0);
  const [pageNumber, setPageNumber] = useState(1);
  const [propertyManagerList, setPropertyManagerList] = useState([]);
  const [filterPropertyManager, setFilterPropertyManager] = useState("");
  const [selectPropertyName, setSelectPropertyName] = useState(null);
  const [pages, setPages] = useState([]);
  const [pageLimit, setPageLimit] = useState(10);
  const [requestTypes, setRequestTypes] = useState([]);
  const [requestTypeFilter, setRequestTypeFilter] = useState({
    label: "",
    value: "",
  });
  const [selectProperty, setSelectProperty] = useState({
    label: "",
    value: "",
  });
  const [stats, setStats] = useState({
    total: 0,
    open: 0,
    inprogress: 0,
    completed: 0,
    unresolved: 0,
  });
  const [ticketPropertyList, setTicketPropertyList] = useState([]);

  const [startPage, setStartPage] = useState(1);
  const pageTotal = Math.ceil(stats.total / pageLimit);
  const [ticketIDs, setTicketIDs] = useState([]);
  const [filterID, setFiletrID] = useState("");

  const [url, setUrl] = useState("");
  const [copied, setcopied] = useState(false);

  const handlePageChange = (page) => {
    setPageNumber(page);

    if (page > startPage + pageLimit - 1 || page < startPage) {
      setStartPage(Math.max(1, page - pageLimit / 2));
    }
  };

  const getPropertyManagerList = async () => {
    try {
      await axios
        .post(`/property_manager/admin`, { company: decode.id })
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
    if (decode.role === "company") {
      getPropertyManagerList();
    }
  }, []);

  function removeBodyCss() {
    document.body.classList.add("no_padding");
  }

  function tog_large() {
    setmodal_large(!modal_large);
    removeBodyCss();
  }

  function tog_large2() {
    setmodal_large2(!modal_large2);
    removeBodyCss();
  }

  const toggleCustom = (tab) => {
    if (customActiveTab !== tab) {
      setcustomActiveTab(tab);
    }
  };

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
  const ClearTicket = (e) => {
    e.preventDefault();
    setSelectPropertyName(null);
    setFilterFromDate("");
    setFilterToDate("");
    setFilterStatus("");
    setFilterTicketId("");
    setProperty("");
    setSelectProperty({ value: "", label: "" });
    setFiltername("");
    setFilterPropertyManager("");
    setRequestTypeFilter({ value: "", label: "" });
    setFiletrID("");
    setcol5(!col5);
    setTimeout(() => {
      document.getElementById("ticketfilter").click();
    }, 1000);
  };
  const searchTicket = async (type) => {
    var submited = false;
    try {
      let query = {};
      let response;
      if (type === "filter") {
        setPageNumber(1);
      }
      if (decode.role == "customer") {
        query = {
          customerID: decode.id,
          pageNumber: pageNumber,
          startDate: filterFromDate,
          endDate: filterToDate,
          status: filterStatus,
          propertyID: selectProperty.value,
          ticketID: filterID,
          suite: filtername,
          requestType: requestTypeFilter.value,
        };

        response = await axios.post(CUSTOMER_SEARCH_URL, query);
        console.log(response);
      } else if (decode.role == "manager") {
        query = {
          pageNumber: pageNumber,
          startDate: filterFromDate,
          endDate: filterToDate,
          status: filterStatus,
          propertyID: selectProperty.value,
          ticketID: filterID.value,
          suite: filtername,
          managerID: decode.id,
          requestType: requestTypeFilter.value,
        };

        response = await axios.post(MANAGER_SEARCH_URL, query);
      } else {
        query = {
          pageNumber: pageNumber,
          startDate: filterFromDate,
          endDate: filterToDate,
          status: filterStatus,
          propertyID: selectProperty.value,
          ticketID: filterID.value,
          propertyManagerID: filterPropertyManager,
          suite: filtername,
          companyDomain: decode.domain,
          requestType: requestTypeFilter.value,
        };
        response = await axios.post(COMPNAY_SEARCH_URL, query);
      }

      if (response.status === 200) {
        submited = true;
        setFilteredTickets(response.data.tickets);
        setNotesCount(response.data.notesCount);
        setTotalTickets(response.data.totalCount);
        setTicketPropertyList(response.data.propertyList);
        setTicketIDs(response.data.tickets.map((t) => t._id));
        setStats((prev) => ({
          ...prev,
          total: response.data.total?.Total || 0,
          open: response.data.total?.Open || 0,
          completed: response.data.total?.Completed || 0,
          inprogress: response.data.total?.Inprogress || 0,
          unresolved: response.data.total?.Unresolved || 0,
        }));
        setRequestTypes(response.data.requestTypes);
        setPage(
          response.data.results.previous
            ? response.data.results.previous.page + 1
            : 1
        );
      }
    } catch (error) {
      console.log(error); // TODO proper error
    } finally {
      if (submited) {
        return (
          <div class="alert alert-primary" role="alert">
            This is a primary alert—check it out!
          </div>
        );
      }
    }
  };

  /**
   * Formats the size
   */
  function formatBytes(bytes, decimals = 2) {
    if (bytes === 0) return "0 Bytes";
    const k = 1024;
    const dm = decimals < 0 ? 0 : decimals;
    const sizes = ["Bytes", "KB", "MB", "GB", "TB", "PB", "EB", "ZB", "YB"];

    const i = Math.floor(Math.log(bytes) / Math.log(k));
    return parseFloat((bytes / Math.pow(k, i)).toFixed(dm)) + " " + sizes[i];
  }

  const getTicket = async () => {
    if (decode.role === "manager") {
      const response = await axios.post(GET_PROPERTY_URL, {
        domain: decode.managerOf,
      });
      setPropertyList(response.data.properties);
    } else if (decode.role === "customer") {
      console.log("innnn");
      const response = await axios.post(GET_PROPERTY_DATA, {
        propertyID: decode.properties,
      });
      console.log("properties", response);
      setPropertyList(response.data.property);
    }
  };

  const getCompanyUrl = async () => {
    try {
      let response = await axios.get(
        `company/get-url/?company_id=${decode.id}&role=${decode.role}`
      );
      console.log(response.data, "datata");

      if (response.data.status == 200) {
        console.log(requestTypes);

        const url =
          window.location.protocol +
          "//" +
          window.location.host +
          "/maintenance-request/" +
          response.data.data;
        setUrl(url);
      }
    } catch (error) {
      console.log(error); // TODO proper error
    }
  };

  useEffect(async () => {
    getTicket();
    getCompanyUrl();
  }, []);

  useEffect(() => {
    let total_pages = stats.total / pageLimit;
    if (stats.total % pageLimit == 0) {
      setPages(Array.from(Array(Math.round(total_pages)).keys()));
    } else {
      setPages(Array.from(Array(parseInt(total_pages) + 1).keys()));
    }
    // console.log('totalapp / pageLimit',totalapp , pageLimit)
    // console.log(Array.from(Array(Math.round(totalapp / pageLimit)).keys()))
  }, [stats, pageLimit]);

  useEffect(async () => {
    searchTicket();
    //setPages(Array.from(Array(Math.round(totalapp / pageLimit)).keys()))
    let total_pages = stats.total / pageLimit;
    if (stats.total % pageLimit == 0) {
      setPages(Array.from(Array(Math.round(total_pages)).keys()));
    } else {
      setPages(Array.from(Array(parseInt(total_pages) + 1).keys()));
    }
  }, [pageNumber]);

  async function TotalTicket(url, data) {
    try {
      const response = await axios.post(url, data);
      if (response.status === 200) {
        // if (response.data.results.applications) {
        //     const temp = (response.data.results.applications).reverse();
        //     setApplicantsList(temp)
        // }
        // props.totalap(response.data.totalApplications)
      } else {
        console.log("Unable to fetch the resoureces");
      }
    } catch (error) {
      console.log("unable to get applicants", error);
    }
  }
  useState(async () => {
    await TotalTicket(TOTAL_TICKETS_URL, {
      role: decode.role,
      domain: decode.domain,
      customerId: decode.id,
    });
  });

  useEffect(() => {
    console.log("DATA" + requestTypes);
  }, [requestTypes]);

  const downloadExcel = async () => {
    try {
      const query = {
        role: decode.role,
        id: decode.id,
      };

      const response = await axios.post(EXCEL_DOWNLOAD_URL, query, {
        responseType: "blob",
      });
      const blob = new Blob([response.data], {
        type: "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet",
      });
      const url = window.URL.createObjectURL(blob);
      const link = document.createElement("a");
      link.href = url;
      link.setAttribute("download", "ticket.xlsx");
      document.body.appendChild(link);
      link.click();
      link.parentNode.removeChild(link);
    } catch (error) {
      console.error("Error:", error);
    }
  };

  return (
    <React.Fragment>
      <div className="page-content">
        <MetaTags>
          <title>Rentdigicare | Maintenance Request</title>
        </MetaTags>
        <div className="col-md-12  mb-3">
          {!["vendor", "technical staff"].includes(decode.role) &&
            decode.role !== "manager" &&
            decode.role !== "customer" && (
              <CopyToClipboard
                text={url}
                onCopy={() => {
                  setcopied(true);
                }}
              >
                <button
                  style={{
                    border: "0px",
                    borderRadius: "4px",
                    color: "white",
                    backgroundColor: "#0e578e",
                  }}
                  onClick={(e) => {
                    e.preventDefault();
                    navigator.clipboard.writeText(url);
                  }}
                >
                  Copy Maintenance Link
                </button>
              </CopyToClipboard>
            )}
          {copied ? (
            <span
              style={{
                color: "white",
                backgroundColor: "black",
                marginLeft: "4px",
                borderRadius: "5px",
              }}
            >
              Copied.
            </span>
          ) : null}
        </div>
        <div className="container-fluid">
          <Breadcrumbs title="Home" breadcrumbItem="Maintenance Request" />
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
                      <div className="mx-2">
                        <h5 className="card-title">
                          Open
                          <span className="text-muted fw-normal ms-1">
                            ({stats?.open})
                          </span>
                        </h5>
                      </div>

                      <div className="mx-2">
                        <h5 className="card-title">
                          Inprogress
                          <span className="text-muted fw-normal ms-1">
                            ({stats?.inprogress})
                          </span>
                        </h5>
                      </div>
                      <div className="mx-2">
                        <h5 className="card-title">
                          Completed
                          <span className="text-muted fw-normal ms-1">
                            ({stats?.completed})
                          </span>
                        </h5>
                      </div>
                      <div className="mx-2">
                        <h5 className="card-title">
                          Unresolved
                          <span className="text-muted fw-normal ms-1">
                            ({stats?.unresolved})
                          </span>
                        </h5>
                      </div>
                    </div>
                    <div className="col-md-6 d-flex flex-wrap align-items-center justify-content-end">
                      {decode.role !== "customer" && (
                        <div className="mb">
                          <button
                            onClick={() => downloadExcel()}
                            className="btn btn-primary mo-mb-2 mr-10"
                            type="button"
                            style={{ cursor: "pointer" }}
                          >
                            Export Excel
                          </button>
                        </div>
                      )}
                      <div className="mb">
                        <button
                          onClick={t_col5}
                          className="btn btn-primary mo-mb-2 mr-10"
                          type="button"
                          style={{ cursor: "pointer" }}
                        >
                          Filters
                        </button>

                        {decode.role == "manager" ||
                          (decode.role == "customer" && (
                            <button
                              type="button"
                              onClick={() => {
                                history.push("/ticket_manager");
                              }}
                              className="btn btn-light "
                              data-toggle="modal"
                              data-target=".bs-example-modal-lg"
                            >
                              <i className="bx bx-plus me-1"></i>Add Maintenance
                              Request
                            </button>
                          ))}
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
                              Add Maintenance Request
                            </h5>
                            <button
                              onClick={() => {
                                setmodal_large(false);
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
                            <Nav tabs className="nav-tabs-custom nav-justified">
                              <NavItem>
                                <NavLink
                                  style={{ cursor: "pointer" }}
                                  className={classnames({
                                    active: customActiveTab === "1",
                                  })}
                                  onClick={() => {
                                    toggleCustom("1");
                                  }}
                                >
                                  <span className="d-block d-sm-none">
                                    <i className="fas fa-home"></i>
                                  </span>
                                  <span className="d-none d-sm-block">
                                    Ticket Details
                                  </span>
                                </NavLink>
                              </NavItem>
                              <NavItem>
                                <NavLink
                                  style={{ cursor: "pointer" }}
                                  className={classnames({
                                    active: customActiveTab === "2",
                                  })}
                                  onClick={() => {
                                    toggleCustom("2");
                                  }}
                                >
                                  <span className="d-block d-sm-none">
                                    <i className="fas fa-home"></i>
                                  </span>
                                  <span className="d-none d-sm-block">
                                    Assign
                                  </span>
                                </NavLink>
                              </NavItem>
                            </Nav>
                            <TabContent
                              activeTab={customActiveTab}
                              className="p-3 text-muted"
                            >
                              <TabPane tabId="1">
                                <Form>
                                  <div className="row align-items-center">
                                    <div className="col-md-4">
                                      <div className="mb-3">
                                        <Label
                                          className="form-label"
                                          htmlFor="formrow-facility-input"
                                        >
                                          Company
                                        </Label>
                                        <select className="form-select">
                                          <option>Select</option>
                                          <option>Company 1</option>
                                          <option>Company 2</option>
                                          <option>Company 3</option>
                                          <option>Company 4</option>
                                          <option>Company 5</option>
                                        </select>
                                      </div>
                                    </div>
                                    <div className="col-md-4">
                                      <div className="mb-3">
                                        <Label
                                          className="form-label"
                                          htmlFor="formrow-facility-input"
                                        >
                                          Status
                                        </Label>
                                        <select className="form-select">
                                          <option>Select</option>
                                          <option>New</option>
                                          <option>Closed</option>
                                          <option>Re-Opened</option>
                                          <option>Pending</option>
                                          <option>Delayed</option>
                                          <option>Excluded</option>
                                        </select>
                                      </div>
                                    </div>
                                    <div className="col-md-4">
                                      <div className="mb-3">
                                        <Label className="form-Label">
                                          Type
                                        </Label>
                                        <select className="form-select">
                                          <option>Select</option>
                                          <option>Type 1</option>
                                          <option>Type 2</option>
                                          <option>Type 3</option>
                                          <option>Type 4</option>
                                          <option>Type 5</option>
                                          <option>Type 6</option>
                                        </select>
                                      </div>
                                    </div>
                                    <div className="col-md-4">
                                      <div className="mb-3">
                                        <Label className="form-Label">
                                          Class
                                        </Label>
                                        <select className="form-select">
                                          <option>Select</option>
                                          <option>Class 1</option>
                                          <option>Class 2</option>
                                          <option>Class 3</option>
                                          <option>Class 4</option>
                                          <option>Class 5</option>
                                          <option>Class 6</option>
                                        </select>
                                      </div>
                                    </div>
                                    <div className="col-md-4">
                                      <div className="mb-3">
                                        <Label className="form-Label">
                                          Area
                                        </Label>
                                        <select className="form-select">
                                          <option>Select</option>
                                          <option>Area 1</option>
                                          <option>Area 2</option>
                                          <option>Area 3</option>
                                          <option>Area 4</option>
                                          <option>Area 5</option>
                                          <option>Area 6</option>
                                        </select>
                                      </div>
                                    </div>

                                    <div className="col-md-4">
                                      <div className="mb-3">
                                        <Label
                                          className="form-label"
                                          htmlFor="formrow-room-input"
                                        >
                                          Room
                                        </Label>
                                        <Input
                                          type="text"
                                          className="form-control"
                                          id="formrow-room-input"
                                        />
                                      </div>
                                    </div>
                                    <div className="col-md-4">
                                      <div className="mb-3">
                                        <Label
                                          className="form-label"
                                          htmlFor="formrow-phone-input"
                                        >
                                          Phone
                                        </Label>
                                        <Input
                                          type="text"
                                          className="form-control"
                                          id="formrow-phone-input"
                                        />
                                      </div>
                                    </div>
                                    <div className="col-md-4">
                                      <div className="mb-3">
                                        <Label
                                          className="form-label"
                                          htmlFor="formrow-email-input"
                                        >
                                          Email
                                        </Label>
                                        <Input
                                          type="text"
                                          className="form-control"
                                          id="formrow-email-input"
                                        />
                                      </div>
                                    </div>

                                    <div className="col-md-4">
                                      <div className="mb-3">
                                        <Label className="form-Label"></Label>
                                        <div className="form-check">
                                          <input
                                            className="form-check-input"
                                            type="checkbox"
                                            id="formCheck22"
                                            defaultChecked
                                          />
                                          <label
                                            className="form-check-label"
                                            htmlFor="formCheck22"
                                          >
                                            Disable Email
                                          </label>
                                        </div>
                                      </div>
                                    </div>

                                    <div className="col-md-12">
                                      <div className="mb-3">
                                        <label
                                          htmlFor="basicpill-address-input"
                                          className="form-label"
                                        >
                                          Comments
                                        </label>
                                        <textarea
                                          id="basicpill-address-input"
                                          className="form-control"
                                          rows="3"
                                        ></textarea>
                                      </div>
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
                                          {({
                                            getRootProps,
                                            getInputProps,
                                          }) => (
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
                                                      >
                                                        <i className="bx bx-trash-alt"></i>
                                                      </button>
                                                    </Col>
                                                  </Row>
                                                </div>
                                              </Card>
                                            );
                                          })}
                                        </div>
                                      </div>
                                    </div>
                                  </div>
                                </Form>
                              </TabPane>
                              <TabPane tabId="2">
                                <div className="row">
                                  <div className="col-md-12">
                                    <div className="mb-3">
                                      <label
                                        htmlFor="choices-multiple-default"
                                        className="form-label font-size-13 text-muted"
                                      >
                                        Assign Vendor
                                      </label>
                                      <Select
                                        defaultValue={[optionMulti[1]]}
                                        isMulti
                                        options={optionMulti}
                                        className="basic-multi-select"
                                        classNamePrefix="select"
                                      />
                                    </div>
                                  </div>
                                  <div className="col-md-6">
                                    <div className="mb-3">
                                      <Label className="form-Label">
                                        Priority
                                      </Label>
                                      <select className="form-select">
                                        <option>Select</option>
                                        <option>Yes</option>
                                        <option>No</option>
                                      </select>
                                    </div>
                                  </div>
                                  <div className="col-md-6">
                                    <div className="mb-3">
                                      <Label className="form-Label">
                                        Duration (H/m)
                                      </Label>
                                      <div class="row">
                                        <div class="col-md-8">
                                          <div className="mb-3">
                                            <Input
                                              type="text"
                                              className="form-control"
                                              id="formrow-code-input"
                                            />
                                          </div>
                                        </div>
                                        <div class="col-md-4">
                                          <div className="mb-3">
                                            <select className="form-select">
                                              <option>Select</option>
                                              <option>00</option>
                                              <option>01</option>
                                              <option>02</option>
                                              <option>03</option>
                                              <option>04</option>
                                              <option>05</option>
                                              <option>06</option>
                                              <option>07</option>
                                              <option>08</option>
                                              <option>09</option>
                                              <option>10</option>
                                              <option>11</option>
                                              <option>12</option>
                                              <option>13</option>
                                              <option>14</option>
                                              <option>15</option>
                                              <option>16</option>
                                              <option>17</option>
                                              <option>18</option>
                                              <option>19</option>
                                              <option>20</option>
                                              <option>21</option>
                                              <option>22</option>
                                              <option>23</option>
                                              <option>24</option>
                                              <option>25</option>
                                              <option>26</option>
                                              <option>27</option>
                                              <option>28</option>
                                              <option>29</option>
                                              <option>30</option>
                                              <option>31</option>
                                              <option>32</option>
                                              <option>33</option>
                                              <option>34</option>
                                              <option>35</option>
                                              <option>36</option>
                                              <option>37</option>
                                              <option>38</option>
                                              <option>39</option>
                                              <option>40</option>
                                              <option>41</option>
                                              <option>35</option>
                                              <option>36</option>
                                              <option>37</option>
                                              <option>38</option>
                                              <option>39</option>
                                              <option>40</option>
                                              <option>41</option>
                                              <option>35</option>
                                              <option>36</option>
                                              <option>37</option>
                                              <option>38</option>
                                              <option>39</option>
                                              <option>40</option>
                                              <option>41</option>
                                              <option>42</option>
                                              <option>43</option>
                                              <option>44</option>
                                              <option>45</option>
                                              <option>46</option>
                                              <option>47</option>
                                              <option>48</option>
                                              <option>49</option>
                                              <option>50</option>
                                              <option>51</option>
                                              <option>52</option>
                                              <option>53</option>
                                              <option>54</option>
                                              <option>55</option>
                                              <option>56</option>
                                              <option>57</option>
                                              <option>58</option>
                                              <option>59</option>
                                            </select>
                                          </div>
                                        </div>
                                      </div>
                                    </div>
                                  </div>
                                  <div className="col-md-6">
                                    <div className="mb-3">
                                      <Label
                                        htmlFor="example-date-input"
                                        className="form-Label"
                                      >
                                        Calender Date
                                      </Label>
                                      <Input
                                        className="form-control"
                                        type="date"
                                        defaultValue="2019-08-19"
                                        id="example-date-input"
                                      />
                                    </div>
                                  </div>
                                  <div className="col-md-6">
                                    <div className="mb-3">
                                      <Label
                                        htmlFor="example-time-input"
                                        className="form-Label"
                                      >
                                        Calender Time
                                      </Label>
                                      <Input
                                        className="form-control"
                                        type="time"
                                        defaultValue="13:45:00"
                                        id="example-time-input"
                                      />
                                    </div>
                                  </div>
                                  <div className="col-md-12">
                                    <div className="mb-3">
                                      <Label className="form-Label">
                                        Notes
                                      </Label>
                                      <Editor
                                        toolbarClassName="toolbarClassName"
                                        wrapperClassName="wrapperClassName"
                                        editorClassName="editorClassName"
                                      />
                                    </div>
                                  </div>
                                </div>
                              </TabPane>
                            </TabContent>

                            <div className="col-md-12">
                              <div className="text-end">
                                <button
                                  type="submit"
                                  className="btn btn-success save-user"
                                >
                                  Save
                                </button>
                              </div>
                            </div>
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
                                  {/* <div className="col-md-3">
                                    <div className="mb-3">
                                      <Label className="form-Label">Company</Label>
                                      <select className="form-select">
                                        <option>Select One</option>
                                        <option>Company 1</option>
                                        <option>Company 2</option>
                                        <option>Company 3</option>
                                        <option>Company 4</option>
                                      </select>
                                    </div>
                                  </div> */}
                                  <div className="col-md-3">
                                    <div className="mb-3">
                                      <Label
                                        htmlFor="example-date-input"
                                        className="form-Label"
                                      >
                                        From
                                      </Label>
                                      <Input
                                        className="form-control"
                                        onChange={(e) => {
                                          setFilterFromDate(e.target.value);
                                        }}
                                        value={filterFromDate}
                                        type="date"
                                        defaultValue={Date.now()}
                                        id="example-date-input"
                                      />
                                    </div>
                                  </div>
                                  <div className="col-md-3">
                                    <div className="mb-3">
                                      <Label
                                        htmlFor="example-date-input"
                                        className="form-Label"
                                      >
                                        To
                                      </Label>
                                      <Input
                                        className="form-control"
                                        type="date"
                                        value={filterToDate}
                                        onChange={(e) => {
                                          setFilterToDate(e.target.value);
                                        }}
                                        defaultValue={Date.now()}
                                        id="example-date-input"
                                      />
                                    </div>
                                  </div>
                                  <div className="col-md-3">
                                    <div className="mb-3">
                                      <Label className="form-Label">
                                        Request Id
                                      </Label>
                                      <Select
                                        value={filterID}
                                        onChange={(e) => {
                                          setFiletrID(e);
                                        }}
                                        options={ticketIDs?.map((id) => {
                                          return {
                                            value: id,
                                            label: id.substring(id.length - 6),
                                          };
                                        })}
                                      />
                                    </div>
                                  </div>
                                  <div className="col-md-3">
                                    <div className="mb-3">
                                      <Label className="form-Label">
                                        Status
                                      </Label>
                                      <select
                                        className="form-select"
                                        onChange={(e) => {
                                          setFilterStatus(e.target.value);
                                        }}
                                        value={filterStatus}
                                      >
                                        <option selected>Select</option>
                                        <option value={"Open"}>Open</option>
                                        <option value={"Inprogress"}>
                                          Inprogress
                                        </option>
                                        <option value={"Completed"}>
                                          Completed
                                        </option>
                                        <option value={"Unresolved"}>
                                          Unresolved
                                        </option>
                                      </select>
                                    </div>
                                  </div>

                                  <div className="col-md-3">
                                    <div className="mb-3">
                                      <Label className="form-Label">
                                        Property
                                      </Label>
                                      <Select
                                        value={
                                          selectProperty?.value
                                            ? selectProperty
                                            : ""
                                        }
                                        options={ticketPropertyList?.map(
                                          (item) => {
                                            return {
                                              value: item._id,
                                              label: item.title,
                                            };
                                          }
                                        )}
                                        placeholder="Search property"
                                        onChange={(e) => {
                                          {
                                            setSelectProperty(e);
                                          }
                                        }}
                                      />
                                    </div>
                                  </div>

                                  {userRole === "company" && (
                                    <div className="col-md-3">
                                      <div className="mb-3">
                                        <Label className="form-Label">
                                          Property Manager
                                        </Label>
                                        <Select
                                          value={selectPropertyName}
                                          options={propertyManagerList?.map(
                                            (item) => {
                                              return {
                                                value: item._id,
                                                label:
                                                  item.firstname +
                                                  " " +
                                                  item.lastname,
                                              };
                                            }
                                          )}
                                          placeholder="Search By Name"
                                          onChange={(e) => {
                                            {
                                              setSelectPropertyName(e);
                                              setFilterPropertyManager(e.value);
                                            }
                                          }}
                                        />
                                        {/* <select
                                          className="form-select"
                                          onChange={(e) => {
                                            setFilterPropertyManager(
                                              e.target.value
                                            );
                                          }}
                                          value={filterPropertyManager}
                                        >
                                          <option selected>Select</option>
                                          {propertyManagerList?.length > 0 &&
                                            propertyManagerList?.map(
                                              (item, index) => (
                                                <option
                                                  key={item?._id}
                                                  value={item?._id}
                                                >
                                                  {item?.firstname}{" "}
                                                  {item?.lastname}
                                                </option>
                                              )
                                            )}
                                        </select> */}
                                      </div>
                                    </div>
                                  )}
                                  <div className="col-md-3">
                                    <div className="mb-3">
                                      <Label
                                        className="form-label"
                                        htmlFor="formrow-submitted-input"
                                      >
                                        Request Type
                                      </Label>
                                      <Select
                                        value={
                                          requestTypeFilter?.value
                                            ? requestTypeFilter
                                            : ""
                                        }
                                        placeholder="Select type"
                                        options={requestTypes?.map((item) => {
                                          return {
                                            value: item,
                                            label: item,
                                          };
                                        })}
                                        onChange={(e) => {
                                          console.log(e);
                                          setRequestTypeFilter(e);
                                        }}
                                      />
                                    </div>
                                  </div>

                                  <div className="col-md-3">
                                    <div className="mb-3">
                                      <Label
                                        className="form-label"
                                        htmlFor="formrow-submitted-input"
                                      >
                                        Suite
                                      </Label>
                                      <Input
                                        type="text"
                                        className="form-control"
                                        id="formrow-submitted-input"
                                        value={filtername}
                                        placeholder="Enter a suite name"
                                        onChange={(e) => {
                                          console.log(
                                            filtername,
                                            e.target.value
                                          );
                                          setFiltername(e.target.value);
                                        }}
                                      />
                                    </div>
                                  </div>

                                  {/* <div className="col-md-3">
                                    <div className="mb-3">
                                      <Label className="form-Label">Assign To</Label>
                                      <select className="form-select">
                                        <option>Select One</option>
                                        <option>Assign 1</option>
                                        <option>Assign 2</option>
                                        <option>Assign 3</option>
                                        <option>Assign 4</option>
                                        <option>Assign 5</option>
                                      </select>
                                    </div>
                                  </div>
                                  <div className="col-md-3">
                                    <div className="mb-3">
                                      <Label className="form-label" htmlFor="formrow-comment-input">Comments</Label>
                                      <Input type="text" className="form-control" id="formrow-comment-input" />
                                    </div>
                                  </div>
                                  <div className="col-md-1">
                                    <div className="mb-3">
                                      <Label className="form-Label"></Label>
                                      <div className="form-check">
                                        <input className="form-check-input" type="checkbox" id="formCheck22" />
                                        <label className="form-check-label" htmlFor="formCheck22">
                                          Scheduled
                                        </label>
                                      </div>
                                    </div>
                                  </div>
                                  <div className="col-md-1">
                                    <div className="mb-3">
                                      <Label className="form-Label"></Label>
                                      <div className="form-check">
                                        <input className="form-check-input" type="checkbox" id="formCheck22" defaultChecked />
                                        <label className="form-check-label" htmlFor="formCheck22">
                                          Priority
                                        </label>
                                      </div>
                                    </div>
                                  </div> */}
                                  <div className="col-md-12 btn-group d-flex justify-content-end">
                                    <div className="srch-btn">
                                      <button
                                        type="submit"
                                        id="ticketfilter"
                                        onClick={(e) => {
                                          e.preventDefault();

                                          searchTicket("filter");
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
                          <th scope="col">ID</th>
                          <th scope="col">Type</th>
                          {decode.role !== "customer" ? (
                            <>
                              <th>Property</th>
                              <th style={{ minWidth: "110px" }}>
                                Submitted By
                              </th>
                            </>
                          ) : (
                            <th>Suit</th>
                          )}
                          <th scope="col" style={{ minWidth: "80px" }}>
                            Created
                          </th>
                          <th scope="col" style={{ minWidth: "80px" }}>
                            Age
                          </th>
                          <th scope="col" style={{ minWidth: "50px" }}>
                            Permission
                          </th>
                          <th scope="col" style={{ minWidth: "50px" }}>
                            Status
                          </th>
                          <th scope="col">Download</th>
                          <th scope="col">Action</th>
                          {decode.role == "company" && (
                            <th scope="col">Assign To</th>
                          )}
                          {decode.role == "manager" && (
                            <th scope="col">Assign To</th>
                          )}
                          {decode.role !== "customer" && (
                            <th scope="col">History</th>
                          )}
                          <th scope="col">Memo</th>
                        </tr>
                      </thead>
                      <tbody>
                        <TicketListRow
                          page={page}
                          getTicket={getTicket}
                          totalTickets={totalTickets}
                          searchTicket={() => searchTicket()}
                          setTotalTickets={setTotalTickets}
                          filteredTickets={filteredTickets}
                          notesCount={notesCount}
                        />
                      </tbody>
                    </Table>
                  </div>
                  <Row className="proress-style mt-3">
                    <Col xl={3}></Col>
                    <Col xl={9}>
                      <div className="pagination-bar">
                        <Pagination>
                          <PaginationItem disabled={pageNumber === 1}>
                            <PaginationLink
                              first
                              onClick={() => handlePageChange(1)}
                            />
                          </PaginationItem>
                          <PaginationItem disabled={pageNumber === 1}>
                            <PaginationLink
                              previous
                              onClick={() => handlePageChange(pageNumber - 1)}
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
                                active={pageNumber === page}
                              >
                                <PaginationLink
                                  onClick={() => handlePageChange(page)}
                                >
                                  {page}
                                </PaginationLink>
                              </PaginationItem>
                            );
                          })}
                          <PaginationItem disabled={pageNumber === pageTotal}>
                            <PaginationLink
                              next
                              onClick={() => handlePageChange(pageNumber + 1)}
                            />
                          </PaginationItem>
                          <PaginationItem disabled={pageNumber === pageTotal}>
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
};

export default TicketList;
