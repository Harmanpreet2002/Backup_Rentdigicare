import React, { useEffect, useState } from "react";
import MetaTags from "react-meta-tags";
import { Link } from "react-router-dom";
import classnames from "classnames";
import jwt_decode from "jwt-decode";
import { Rating } from "react-simple-star-rating";

import {
  Table,
  Row,
  Col,
  Card,
  CardBody,
  Modal,
  CardHeader,
  Label,
  Input,
  Pagination,
  PaginationItem,
  Collapse,
  PaginationLink,
  DropdownItem,
  DropdownMenu,
  DropdownToggle,
  Dropdown,
  Form,
  Nav,
  NavItem,
  NavLink,
  TabContent,
  TabPane,
} from "reactstrap";

//Import Breadcrumb
import Breadcrumbs from "../../components/Common/Breadcrumb";
import axios from "../api/axios";
const VendorTickets = () => {
  const decode = jwt_decode(window.localStorage.getItem("accessToken"));

  const VENDOR_PORTAL_TICKETS = `/ticket/technicalstaff/${decode.id}`;
  const TOTAL_TICKETS_URL = `/ticket/total`;
  const [modal_large, setmodal_large] = useState(false);
  const [btnsuccess1, setBtnsuccess1] = useState(false);
  const [modal_large2, setmodal_large2] = useState(false);
  const [portalTikets, setportalTikets] = useState([]);
  const [customActiveTab, setcustomActiveTab] = useState("1");
  const [modal_view, setmodal_view] = useState(false);
  const [startDate, setStartDate] = useState(Date.now());
  const [startTime, setStartTime] = useState("");
  const [status, setStatus] = useState("");
  const [endDate, setEndDate] = useState(Date.now());
  const [endTime, setEndTime] = useState("");
  const [notes, setNotes] = useState("");
  const [estimatedAmount, setestimatedAmount] = useState("");

  const [selectedTicket, setSelectedTicket] = useState("");
  const [quoteError, setQuoteError] = useState("");

  const [propertyID, setPropertyID] = useState("");
  const [priority, setPriority] = useState("");
  const [pageNumber, setPageNumber] = useState(1);
  const [totalTickets, setTotalTickets] = useState(0);
  const [propertyList, setPropertyList] = useState([]);
  const [property, setProperty] = useState("");

  const [loading, setLoading] = useState(false);

  const [stats, setStats] = useState({
    total: 0,
    open: 0,
    inprogress: 0,
    completed: 0,
  });

  function removeBodyCss() {
    document.body.classList.add("no_padding");
  }

  function tog_large() {
    setmodal_large(!modal_large);
    removeBodyCss();
  }

  async function quoteTicket() {
    // if (!startDate || !startTime || !endDate || !endTime || !notes || !estimatedAmount) {
    //     return setQuoteError("Please enter all the fields")
    // }

    setLoading(true);

    try { 
      let Details = {
        vendorID: decode.id,
        ticketID: selectedTicket._id,
        startDate: startDate,
        startTime: startTime,
        endDate: endDate,
        endTime: endTime,
        notes: notes,
        estimatedAmount: estimatedAmount,
        owner: selectedTicket.name,
        applicantName: selectedTicket.name,
        applicantEmail: selectedTicket.email,
        propertyName: selectedTicket.property,
        propertyLayout: selectedTicket.suite,
        companyName: selectedTicket.companyDomain,
        status: status,
      };

      const response = await axios.post(
        "/ticket/update_technical_staff_ticket",
        Details
      );

      console.log("response", response);

      if (response.data?.success) {
        getTechnicalStaffTickets(1);
        tog_view();
        //setVendor(response?.data?.vendors)
      } else {
        setQuoteError(response.data?.errorMessage || "Something went wrong");
        //setVendorError(response.data?.errorMessage)
      }

      setLoading(false);
    } catch (error) {
      setQuoteError("Something went wrong");
      setLoading(false);
    }
  }

  function tog_view() {
    setmodal_view(!modal_view);
    removeBodyCss();
  }
  const [col5, setcol5] = useState(false);
  const t_col5 = () => {
    setcol5(!col5);
  };
  function tog_large2() {
    setmodal_large2(!modal_large2);
    removeBodyCss();
  }

  const toggleCustom = (tab) => {
    if (customActiveTab !== tab) {
      setcustomActiveTab(tab);
    }
  };

  async function TotalTicket(url, data) {
    try {
      const response = await axios.post(url, data);
      if (response.status === 200) {
        // if (response.data.results.applications) {
        //     const temp = (response.data.results.applications).reverse();
        //     setApplicantsList(temp)
        // }
        setStats(response.data.totalTickets);
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
  const getTechnicalStaffTickets = async (pgNum, type) => {
    try {
      const response = await axios.post(VENDOR_PORTAL_TICKETS, {
        propertyID: type == "clear" ? "" : propertyID,
        priority: type == "clear" ? "" : priority,
        pageNumber: pgNum,
      });

      console.log("response", response);

      if (response.data.status == 200) {
        setportalTikets(response.data.tickets);

        setTotalTickets(response.data.totalCount);

        if (type == "next") setPageNumber(pageNumber + 1);
        if (type == "previous") setPageNumber(pageNumber - 1);
        if (type == "search") setPageNumber(pgNum);

        //console.log("responessssssssssssssssssssssssssss",response.data)
      } else {
        setportalTikets([]);
      }
    } catch (error) {
      setportalTikets([]);

      console.log(error); // TODO proper error
    }
  };

  const clearFunc = () => {
    setPropertyID("");
    setProperty("");
    setPriority("");
    setPageNumber(1);
    getTechnicalStaffTickets(1, "clear");
  };

  const EditTickets = (item) => {
    setSelectedTicket(item);
    console.log(item.notes, item);
    setStartDate(item?.startDate?.split("T")[0]);
    setStartTime(item.startTime);
    setEndDate(item?.estimatedEndDate?.split("T")[0]);
    setEndTime(item?.estimatedETime);
    setestimatedAmount(item.estimatedAmount);
    setStatus(item.status);
    setNotes(item.notes);
    tog_view();
  };

  const getProperties = async (pgNum, type) => {
    try {
      const response = await axios.get("/property/getproperties");

      console.log(response);

      setPropertyList(response.data.properties);
    } catch (error) {
      // setportalTikets("Something went wrong")

      console.log(error); // TODO proper error
    }
  };

  useEffect(async () => {
    getTechnicalStaffTickets(1);
    getProperties();
    // const getSpeciality = async (e) => {
    // }
  }, []);
  console.log("portalTicketssssssssssssss", portalTikets);

  return (
    <React.Fragment>
      <div className="page-content">
        <MetaTags>
          <title>Rentdigicare | Maintenance Request</title>
        </MetaTags>
        <div className="container-fluid">
          <Breadcrumbs title="Home" breadcrumbItem="Maintenance Request" />
          <Row>
            <Col xl={12}>
              <Card>
                <CardHeader>
                  <div className="row">
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
                    </div>
                    <div className="col-md-6 d-flex flex-wrap align-items-center justify-content-end">
                      <div className="mb d-flex flex-wrap">
                        {/* <button
                                                    onClick={t_col5}
                                                    className="btn btn-primary mo-mb-2 mr-10"
                                                    type="button"
                                                    style={{ cursor: "pointer" }}
                                                >
                                                    Filters
                                                </button> */}

                        {/* <Dropdown
                                                    isOpen={btnsuccess1}
                                                    toggle={() => setBtnsuccess1(!btnsuccess1)}
                                                >
                                                    <DropdownToggle tag="button" className="btn btn-success mr-10">
                                                        Show Items <i className="mdi mdi-chevron-down" />
                                                    </DropdownToggle>
                                                    <DropdownMenu>
                                                        <DropdownItem>Active</DropdownItem>
                                                        <DropdownItem>Inactive</DropdownItem>
                                                    </DropdownMenu>
                                                </Dropdown> */}
                        {/* <button
                                                    type="button"
                                                    onClick={() => {
                                                        tog_large()
                                                    }}
                                                    className="btn btn-light "
                                                    data-toggle="modal"
                                                    data-target=".bs-example-modal-lg"
                                                >
                                                    <i className="bx bx-plus me-1"></i> Add Staff
                                                </button> */}
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
                            <Form>
                              <div className="row align-items-center">
                                <div className="col-md-6">
                                  <div className="mb-3">
                                    <Label
                                      className="form-label"
                                      htmlFor="formrow-name-input"
                                    >
                                      Vendor Name
                                    </Label>
                                    <Input
                                      type="text"
                                      className="form-control"
                                      id="formrow-name-input"
                                    />
                                  </div>
                                </div>
                                <div className="col-md-6">
                                  <div className="mb-3">
                                    <Label
                                      className="form-label"
                                      htmlFor="formrow-code-input"
                                    >
                                      Vendor Code
                                    </Label>
                                    <Input
                                      type="text"
                                      className="form-control"
                                      id="formrow-code-input"
                                    />
                                  </div>
                                </div>
                                <div className="col-md-6">
                                  <div className="mb-3">
                                    <Label className="form-Label">
                                      Category
                                    </Label>
                                    <select className="form-select">
                                      <option>Select One</option>
                                      <option>Category 1</option>
                                      <option>Category 2</option>
                                      <option>Category 3</option>
                                      <option>Category 4</option>
                                    </select>
                                  </div>
                                </div>
                                <div className="col-md-6">
                                  <div className="mb-3">
                                    <Label className="form-Label">Active</Label>
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
                                      Rate/Term
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
                                            <option>Hour</option>
                                            <option>Week</option>
                                            <option>Month</option>
                                          </select>
                                        </div>
                                      </div>
                                    </div>
                                  </div>
                                </div>
                                <div className="col-md-12">
                                  <Card>
                                    <CardBody>
                                      <h4 className="card-title mb-4">
                                        Details
                                      </h4>
                                      <div className="row">
                                        <div className="col-md-6">
                                          <div className="mb-3">
                                            <Label
                                              className="form-label"
                                              htmlFor="formrow-address-input"
                                            >
                                              Address1
                                            </Label>
                                            <Input
                                              type="text"
                                              className="form-control"
                                              id="formrow-address-input"
                                            />
                                          </div>
                                        </div>
                                        <div className="col-md-6">
                                          <div className="mb-3">
                                            <Label
                                              className="form-label"
                                              htmlFor="formrow-address-input"
                                            >
                                              Address2
                                            </Label>
                                            <Input
                                              type="text"
                                              className="form-control"
                                              id="formrow-address-input"
                                            />
                                          </div>
                                        </div>
                                        <div className="col-md-6">
                                          <div className="mb-3">
                                            <Label
                                              className="form-label"
                                              htmlFor="formrow-city-input"
                                            >
                                              City
                                            </Label>
                                            <Input
                                              type="text"
                                              className="form-control"
                                              id="formrow-city-input"
                                            />
                                          </div>
                                        </div>
                                        <div className="col-md-6">
                                          <div className="mb-3">
                                            <Label
                                              className="form-label"
                                              htmlFor="formrow-state-input"
                                            >
                                              State/Province
                                            </Label>
                                            <Input
                                              type="text"
                                              className="form-control"
                                              id="formrow-state-input"
                                            />
                                          </div>
                                        </div>
                                        <div className="col-md-6">
                                          <div className="mb-3">
                                            <Label
                                              className="form-label"
                                              htmlFor="formrow-postal-input"
                                            >
                                              Postal/Zip Code
                                            </Label>
                                            <Input
                                              type="text"
                                              className="form-control"
                                              id="formrow-postal-input"
                                            />
                                          </div>
                                        </div>
                                        <div className="col-md-6">
                                          <div className="mb-3">
                                            <Label
                                              className="form-label"
                                              htmlFor="formrow-contact-input"
                                            >
                                              Telephone 1
                                            </Label>
                                            <Input
                                              type="text"
                                              className="form-control"
                                              id="formrow-contact-input"
                                            />
                                          </div>
                                        </div>
                                        <div className="col-md-6">
                                          <div className="mb-3">
                                            <Label
                                              className="form-label"
                                              htmlFor="formrow-contact-input"
                                            >
                                              Telephone 2
                                            </Label>
                                            <Input
                                              type="text"
                                              className="form-control"
                                              id="formrow-contact-input"
                                            />
                                          </div>
                                        </div>
                                        <div className="col-md-6">
                                          <div className="mb-3">
                                            <Label
                                              className="form-label"
                                              htmlFor="formrow-fax-input"
                                            >
                                              Fax
                                            </Label>
                                            <Input
                                              type="text"
                                              className="form-control"
                                              id="formrow-fax-input"
                                            />
                                          </div>
                                        </div>
                                        <div className="col-md-6">
                                          <div className="mb-3">
                                            <Label
                                              className="form-label"
                                              htmlFor="formrow-contact-input"
                                            >
                                              Contact
                                            </Label>
                                            <Input
                                              type="text"
                                              className="form-control"
                                              id="formrow-contact-input"
                                            />
                                          </div>
                                        </div>
                                        <div className="col-md-6">
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
                                      </div>
                                    </CardBody>
                                  </Card>
                                </div>
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
                                  <div className="col-md-4">
                                    <div className="mb-3">
                                      <Label className="form-Label">
                                        Property
                                      </Label>
                                      <select
                                        className="form-select"
                                        value={property}
                                        onChange={(e) => {
                                          const propertyData = JSON.parse(
                                            e.target.value
                                          );
                                          setPropertyID(propertyData.ID);
                                          setProperty(e.target.value);
                                          console.log(propertyData);
                                          // domain = this.state.propertyList.find(o => o._id === propertyData.ID);
                                          // domain = domain.companyDomain
                                          // console.log(domain)
                                        }}
                                      >
                                        <option>Select</option>

                                        {propertyList &&
                                          propertyList.map((property) => (
                                            <option
                                              value={`{"title": "${property.title}", "ID": "${property._id}"}`}
                                            >
                                              {property.title}
                                            </option>
                                          ))}
                                      </select>
                                    </div>
                                  </div>

                                  <div className="col-md-2 text-end">
                                    <button
                                      type="submit"
                                      className="btn btn-primary"
                                      onClick={(e) => {
                                        e.preventDefault();
                                        getTechnicalStaffTickets(1);
                                      }}
                                    >
                                      Search
                                    </button>
                                  </div>
                                  <div className="col-md-1">
                                    <button
                                      type="submit"
                                      className="btn btn-light"
                                      onClick={(e) => {
                                        e.preventDefault();
                                        clearFunc();
                                      }}
                                    >
                                      Clear
                                    </button>
                                  </div>
                                  <div className="col-md-12 d-flex flex-wrap align-items-center justify-content-end">
                                    <div className="mb d-flex flex-wrap justify-content-end"></div>
                                  </div>
                                  <div className="col-md-12">
                                    <div className="col-md-4"></div>
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
                          {/* <th scope="col">Category</th>
                                                    <th scope="col">Code</th>
                                                    <th scope="col">Name</th>
                                                    <th scope="col">Address</th>
                                                    <th scope="col">City</th>
                                                    <th scope="col">Contact</th>
                                                    <th scope="col">Attachment</th>
                                                    <th scope="col">Active</th>
                                                    <th scope="col">Action</th> */}
                          <th scope="col">Company</th>
                          <th scope="col">Property</th>
                          <th scope="col">Suite</th>
                          <th scope="col">Details</th>
                          <th scope="col">Status</th>
                          <th scope="col">Action</th>
                        </tr>
                      </thead>
                      <tbody>
                        <tr>
                          {/* <td>1</td>
                                                    <td>
                                                        <a href="#!"
                                                            onClick={() => {
                                                                tog_large2()
                                                            }}
                                                            data-toggle="modal"
                                                            data-target=".bs-example-modal-lg"
                                                        >
                                                            Painting 
                                                        </a>*/}
                          <Modal
                            size="lg"
                            isOpen={modal_large2}
                            toggle={() => {
                              tog_large2();
                            }}
                          >
                            <div className="modal-header">
                              <h5
                                className="modal-title mt-0"
                                id="myLargeModalLabel"
                              >
                                View Vendors
                              </h5>
                              <button
                                onClick={() => {
                                  setmodal_large2(false);
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
                              <Form>
                                <div className="row align-items-center">
                                  <div className="col-md-6">
                                    <div className="mb-3">
                                      <Label
                                        className="form-label"
                                        htmlFor="formrow-name-input"
                                      >
                                        Vendor Name
                                      </Label>
                                      <Input
                                        type="text"
                                        className="form-control"
                                        value="Danish"
                                        id="formrow-name-input"
                                        readonly
                                      />
                                    </div>
                                  </div>
                                  <div className="col-md-6">
                                    <div className="mb-3">
                                      <Label
                                        className="form-label"
                                        htmlFor="formrow-code-input"
                                      >
                                        Vendor Code
                                      </Label>
                                      <Input
                                        type="text"
                                        className="form-control"
                                        value="12345"
                                        id="formrow-code-input"
                                        readonly
                                      />
                                    </div>
                                  </div>
                                  <div className="col-md-6">
                                    <div className="mb-3">
                                      <Label className="form-Label">
                                        Category
                                      </Label>
                                      <Input
                                        type="text"
                                        className="form-control"
                                        value="Category 1"
                                        id="formrow-cat-input"
                                        readonly
                                      />
                                    </div>
                                  </div>
                                  <div className="col-md-6">
                                    <div className="mb-3">
                                      <Label className="form-Label">
                                        Active
                                      </Label>
                                      <Input
                                        type="text"
                                        className="form-control"
                                        value="Yes"
                                        id="formrow-stat-input"
                                        readonly
                                      />
                                    </div>
                                  </div>
                                  <div className="col-md-6">
                                    <div className="mb-3">
                                      <Label className="form-Label">
                                        Rate/Term
                                      </Label>
                                      <div class="row">
                                        <div class="col-md-8">
                                          <div className="mb-3">
                                            <Input
                                              type="text"
                                              className="form-control"
                                              value="100"
                                              id="formrow-code-input"
                                              readonly
                                            />
                                          </div>
                                        </div>
                                        <div class="col-md-4">
                                          <div className="mb-3">
                                            <Input
                                              type="text"
                                              className="form-control"
                                              value="Hours"
                                              id="formrow-code-input"
                                              readonly
                                            />
                                          </div>
                                        </div>
                                      </div>
                                    </div>
                                  </div>
                                  <div className="col-md-12">
                                    <Card>
                                      <CardBody>
                                        <h4 className="card-title mb-4">
                                          Details
                                        </h4>
                                        <div className="row">
                                          <div className="col-md-6">
                                            <div className="mb-3">
                                              <Label
                                                className="form-label"
                                                htmlFor="formrow-address-input"
                                              >
                                                Address1
                                              </Label>
                                              <Input
                                                type="text"
                                                className="form-control"
                                                value="#9, Industrial Area, near Rajdeep Nagar"
                                                id="formrow-address-input"
                                                readonly
                                              />
                                            </div>
                                          </div>
                                          <div className="col-md-6">
                                            <div className="mb-3">
                                              <Label
                                                className="form-label"
                                                htmlFor="formrow-address-input"
                                              >
                                                Address2
                                              </Label>
                                              <Input
                                                type="text"
                                                className="form-control"
                                                value="#9, Industrial Area, near Rajdeep Nagar"
                                                id="formrow-address-input"
                                                readonly
                                              />
                                            </div>
                                          </div>
                                          <div className="col-md-6">
                                            <div className="mb-3">
                                              <Label
                                                className="form-label"
                                                htmlFor="formrow-city-input"
                                              >
                                                City
                                              </Label>
                                              <Input
                                                type="text"
                                                className="form-control"
                                                value="Toronto"
                                                id="formrow-city-input"
                                                readonly
                                              />
                                            </div>
                                          </div>
                                          <div className="col-md-6">
                                            <div className="mb-3">
                                              <Label
                                                className="form-label"
                                                htmlFor="formrow-state-input"
                                              >
                                                State/Province
                                              </Label>
                                              <Input
                                                type="text"
                                                className="form-control"
                                                value="Brampton"
                                                id="formrow-state-input"
                                                readonly
                                              />
                                            </div>
                                          </div>
                                          <div className="col-md-6">
                                            <div className="mb-3">
                                              <Label
                                                className="form-label"
                                                htmlFor="formrow-postal-input"
                                              >
                                                Postal/Zip Code
                                              </Label>
                                              <Input
                                                type="text"
                                                className="form-control"
                                                value="143416"
                                                id="formrow-postal-input"
                                                readonly
                                              />
                                            </div>
                                          </div>
                                          <div className="col-md-6">
                                            <div className="mb-3">
                                              <Label
                                                className="form-label"
                                                htmlFor="formrow-contact-input"
                                              >
                                                Telephone 1
                                              </Label>
                                              <Input
                                                type="text"
                                                className="form-control"
                                                value="143416"
                                                id="formrow-contact-input"
                                                readonly
                                              />
                                            </div>
                                          </div>
                                          <div className="col-md-6">
                                            <div className="mb-3">
                                              <Label
                                                className="form-label"
                                                htmlFor="formrow-contact-input"
                                              >
                                                Telephone 2
                                              </Label>
                                              <Input
                                                type="text"
                                                className="form-control"
                                                value="143416"
                                                id="formrow-contact-input"
                                                readonly
                                              />
                                            </div>
                                          </div>
                                          <div className="col-md-6">
                                            <div className="mb-3">
                                              <Label
                                                className="form-label"
                                                htmlFor="formrow-fax-input"
                                              >
                                                Fax
                                              </Label>
                                              <Input
                                                type="text"
                                                className="form-control"
                                                value="243416"
                                                id="formrow-fax-input"
                                                readonly
                                              />
                                            </div>
                                          </div>
                                          <div className="col-md-6">
                                            <div className="mb-3">
                                              <Label
                                                className="form-label"
                                                htmlFor="formrow-contact-input"
                                              >
                                                Contact
                                              </Label>
                                              <Input
                                                type="text"
                                                className="form-control"
                                                value="143416"
                                                id="formrow-contact-input"
                                                readonly
                                              />
                                            </div>
                                          </div>
                                          <div className="col-md-6">
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
                                                value="abc@gmail.com"
                                                id="formrow-email-input"
                                                readonly
                                              />
                                            </div>
                                          </div>
                                        </div>
                                      </CardBody>
                                    </Card>
                                  </div>
                                </div>
                              </Form>
                            </div>
                          </Modal>
                        </tr>
                        {portalTikets.map((item, index) => {
                          return (
                            <tr key={item._id}>
                              <td>{index + 1}</td>
                              <td>
                                <a
                                  href="#!"
                                  onClick={() => {
                                    tog_large2();
                                  }}
                                  data-toggle="modal"
                                  data-target=".bs-example-modal-lg"
                                >
                                  {item.companyDomain}
                                </a>
                              </td>

                              <td>{item.property}</td>
                              <td>{item.suite}</td>
                              <td>{item.details}</td>
                              <td>{item?.status}</td>
                              <td>
                                <div>
                                
                                    <button
                                      className={
                                        item.status === "Completed"
                                          ? `btn btn-outline-primary mr-5`
                                          : `btn btn-success mr-5`
                                      }
                                      type="button"
                                      style={{ cursor: "pointer" }}
                                      onClick={(e) => {
                                        EditTickets(item);
                                      }}
                                    >
                                      {item?.status === "Completed"
                                        ? "View"
                                        : "Edit"}
                                    </button>
                             
                                </div>
                              </td>

                              <Modal
                                size="lg"
                                isOpen={modal_view}
                                toggle={() => {
                                  tog_view();
                                }}
                              >
                                <div className="modal-header">
                                  <h5
                                    className="modal-title mt-0"
                                    id="myLargeModalLabel"
                                  >
                                    View Ticket list Details
                                  </h5>
                                  <button
                                    onClick={() => {
                                      tog_view();
                                      // setmodal_large2(false)
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
                                  <Nav
                                    tabs
                                    className="nav-tabs-custom nav-justified"
                                  >
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
                                          Ticket Detail
                                        </span>
                                      </NavLink>
                                    </NavItem>
                                    {selectedTicket?.status !== "Completed" && (
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
                                            Work Details
                                          </span>
                                        </NavLink>
                                      </NavItem>
                                    )}
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
                                                Company Name
                                              </Label>
                                              <Input
                                                type="text"
                                                value={
                                                  selectedTicket.companyDomain
                                                }
                                                className="form-control"
                                                id="formrow-room-input"
                                                readOnly
                                              />
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

                                              <Input
                                                type="text"
                                                value={selectedTicket.status}
                                                className="form-control"
                                                id="formrow-room-input"
                                                readOnly
                                              />
                                            </div>
                                          </div>

                                          <div className="col-md-4">
                                            <div className="mb-3">
                                              <Label className="form-Label">
                                                Property Name
                                              </Label>
                                              <Input
                                                type="text"
                                                value={selectedTicket.property}
                                                className="form-control"
                                                id="formrow-room-input"
                                                readOnly
                                              />
                                            </div>
                                          </div>
                                          <div className="col-md-4">
                                            <div className="mb-3">
                                              <Label className="form-Label">
                                                Suite
                                              </Label>
                                              <Input
                                                type="text"
                                                value={selectedTicket.suite}
                                                className="form-control"
                                                id="formrow-room-input"
                                                readOnly
                                              />
                                            </div>
                                          </div>

                                          <div className="col-md-4">
                                            <div className="mb-3">
                                              <Label
                                                className="form-label"
                                                htmlFor="formrow-room-input"
                                              >
                                                requestType
                                              </Label>
                                              <Input
                                                type="text"
                                                value={
                                                  selectedTicket.requestType
                                                }
                                                className="form-control"
                                                id="formrow-room-input"
                                                readOnly
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
                                                value={selectedTicket.phone}
                                                className="form-control"
                                                id="formrow-room-input"
                                                readOnly
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
                                                value={selectedTicket.email}
                                                className="form-control"
                                                id="formrow-room-input"
                                                readOnly
                                              />
                                            </div>
                                          </div>

                                          <div className="col-md-4">
                                            <div className="mb-3">
                                              <Label
                                                className="form-label"
                                                htmlFor="formrow-email-input"
                                              >
                                                Name
                                              </Label>
                                              <Input
                                                type="text"
                                                value={selectedTicket.name}
                                                className="form-control"
                                                id="formrow-room-input"
                                                readOnly
                                              />
                                            </div>
                                          </div>
                                          <div className="col-md-4">
                                            <div className="mb-3">
                                              <Label
                                                className="form-label"
                                                htmlFor="formrow-phone-input"
                                              >
                                                Rating
                                              </Label>
                                              <div>
                                                <td>
                                                  <Rating
                                                    initialValue={
                                                      selectedTicket.ratings
                                                    }
                                                    readonly={true}
                                                    size={20}
                                                  />
                                                </td>
                                              </div>
                                            </div>
                                          </div>

                                          {/* <div className="col-md-4">
                                            <div className="mb-3">
                                                <Label className="form-label" htmlFor="formrow-phone-input">Documents</Label>
                                                <div>
                                                    <button
                                                        type="button"
                                                        className="btn btn-soft-light btn-sm w-xs waves-effect btn-label waves-light"
                                                    >
                                                        <i className="bx bx-download label-icon"></i> Pdf
                                                    </button>
                                                </div>
                                            </div>
                                        </div> */}

                                          <div className="col-md-12">
                                            <div className="mb-3">
                                              <label
                                                htmlFor="basicpill-address-input"
                                                className="form-label"
                                              >
                                                Details
                                              </label>
                                              <textarea
                                                id="basicpill-address-input"
                                                className="form-control"
                                                rows="3"
                                                readOnly
                                                placeholder={
                                                  selectedTicket.details
                                                }
                                              ></textarea>
                                            </div>
                                          </div>

                                          <div className="col-md-12">
                                            <div className="mb-3">
                                              <label
                                                htmlFor="basicpill-address-input"
                                                className="form-label"
                                              >
                                                Customer Feedback
                                              </label>
                                              <textarea
                                                id="basicpill-address-input"
                                                className="form-control"
                                                rows="3"
                                                readOnly
                                                placeholder={
                                                  selectedTicket?.reviews
                                                }
                                              ></textarea>
                                            </div>
                                          </div>
                                        </div>
                                      </Form>
                                    </TabPane>

                                    <TabPane tabId="2">
                                      <div className="row">
                                        {quoteError && (
                                          <p style={{ color: "red" }}>
                                            {quoteError}
                                          </p>
                                        )}
                                        {/* <div className="col-md-3">
                                                                                    <div className="mb-3">
                                                                                        <Label className="form-Label">Estimated Amount</Label>
                                                                                        <Input type="text" value={estimatedAmount} onChange={(e) => { setestimatedAmount(e.target.value) }} className="form-control" id="formrow-room-input" />
                                                                                    </div>
                                                                                </div> */}
                                        <div className="col-md-6">
                                          <div className="mb-3">
                                            <Label className="form-Label">
                                              Status
                                            </Label>
                                            <select
                                              value={status}
                                              onChange={(e) => {
                                                setStatus(e.target.value);
                                              }}
                                              className="form-select"
                                            >
                                              <option value={"Select"}>
                                                Select
                                              </option>
                                              {/* <option value={"open"}>Open</option>
                                                                                            <option value={"vendorAssigned"}>Vendor Assigned</option> */}
                                              <option value={"Inprogress"}>
                                                Inprogress
                                              </option>
                                              <option value={"Completed"}>
                                                Completed
                                              </option>
                                            </select>
                                          </div>
                                        </div>
                                        {/* </div> */}
                                        <div className="col-md-3">
                                          <div className="mb-3">
                                            <Label
                                              htmlFor="example-date-input"
                                              className="form-Label"
                                            >
                                              Start Date
                                            </Label>
                                            <Input
                                              className="form-control"
                                              value={startDate}
                                              onChange={(e) => {
                                                setStartDate(e.target.value);
                                              }}
                                              type="date"
                                              id="example-date-input"
                                            />
                                          </div>
                                        </div>
                                        <div className="col-md-3">
                                          <div className="mb-3">
                                            <Label
                                              htmlFor="example-time-input"
                                              className="form-Label"
                                            >
                                              Start Time
                                            </Label>
                                            <Input
                                              className="form-control"
                                              value={startTime}
                                              onChange={(e) => {
                                                setStartTime(e.target.value);
                                                console.log(e.target.value);
                                              }}
                                              type="time"
                                              id="example-time-input"
                                            />
                                          </div>
                                        </div>

                                        <div className="col-md-6">
                                          <div className="mb-3">
                                            <Label
                                              htmlFor="example-date-input"
                                              className="form-Label"
                                            >
                                              Estimated Completion Date
                                            </Label>
                                            <Input
                                              className="form-control"
                                              type="date"
                                              value={endDate}
                                              onChange={(e) => {
                                                setEndDate(e.target.value);
                                              }}
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
                                              Estimated Completion Time
                                            </Label>
                                            <Input
                                              className="form-control"
                                              type="time"
                                              value={endTime}
                                              onChange={(e) => {
                                                setEndTime(e.target.value);
                                              }}
                                              id="example-time-input"
                                            />
                                          </div>
                                        </div>
                                        <div className="col-md-12">
                                          <div className="mb-3">
                                            <Label className="form-Label">
                                              Notes
                                            </Label>
                                            <textarea
                                              id="basicpill-address-input"
                                              className="form-control"
                                              rows="3"
                                              value={notes}
                                              onChange={(e) => {
                                                setNotes(e.target.value);
                                              }}
                                              // readOnly={role == "customer" ? true : false}
                                              placeholder=""
                                            ></textarea>
                                          </div>
                                        </div>
                                        <div className="col-md-12 d-flex flex-wrap align-items-center justify-content-center">
                                          <button
                                            className="btn btn-primary mo-mb-2 mr-10"
                                            disabled={loading}
                                            onClick={(e) => {
                                              // confirmTicket(e)
                                              // tog_view()
                                              quoteTicket();
                                            }}
                                          >
                                            {loading && (
                                              <div
                                                id="saveSpinner"
                                                style={{
                                                  height: "15px",
                                                  width: "15px",
                                                  marginLeft: "5px",
                                                }}
                                                class="spinner-border"
                                                role="status"
                                              ></div>
                                            )}
                                            Confirm
                                          </button>
                                          <button
                                            className="btn btn-light"
                                            onClick={(e) => {
                                              tog_view();
                                            }}
                                          >
                                            cancel
                                          </button>
                                        </div>
                                      </div>
                                    </TabPane>
                                  </TabContent>
                                </div>
                              </Modal>
                            </tr>
                          );
                        })}
                      </tbody>
                    </Table>
                  </div>
                  <Row className="proress-style mt-3">
                    <Col xl={3}></Col>
                    <Col xl={9}>
                      <div className="pagination-bar">
                        <Pagination aria-label="Page navigation example">
                          <PaginationItem disabled={pageNumber == 1}>
                            <PaginationLink
                              onClick={(e) => {
                                e.preventDefault();
                                getTechnicalStaffTickets(
                                  pageNumber - 1,
                                  "previous"
                                );
                              }}
                              tabIndex="-1"
                            >
                              Previous
                            </PaginationLink>
                          </PaginationItem>

                          <PaginationItem active>
                            <PaginationLink href="#">
                              {pageNumber}{" "}
                              <span className="sr-only">(current)</span>
                            </PaginationLink>
                          </PaginationItem>
                          <PaginationItem
                            disabled={
                              Math.ceil(totalTickets / 10) == pageNumber ||
                              Math.ceil(totalTickets / 10) == 0
                            }
                          >
                            <PaginationLink
                              onClick={(e) => {
                                e.preventDefault();
                                getTechnicalStaffTickets(
                                  pageNumber + 1,
                                  "next"
                                );
                              }}
                            >
                              Next
                            </PaginationLink>
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
export default VendorTickets;
