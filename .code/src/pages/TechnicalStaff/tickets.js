import React, { useEffect, useState } from "react";
import MetaTags from "react-meta-tags";
import { Link } from "react-router-dom";
import classnames from "classnames";
import jwt_decode from "jwt-decode";
import { Rating } from "react-simple-star-rating";
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
  Badge,
} from "reactstrap";
import Select from "react-select";

//Import Breadcrumb
import Breadcrumbs from "../../components/Common/Breadcrumb";
import axios from "../api/axios";
import { BUCKET_URL, SERVER_URL } from "../ServerLink";

const TechnicalStaffTickets = () => {
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
  const [showlogs, setShowLogs] = useState({
    data: [],
    value: false,
  });

  const [loading, setLoading] = useState(false);

  const [stats, setStats] = useState({
    total: 0,
    open: 0,
    inprogress: 0,
    completed: 0,
    unresolved: 0,
  });

  const [model_open, setModel_open] = useState(false);
  const [moveTo, setMoveTo] = useState("");
  const [checked, setchecked] = useState(false);
  const [selectedName, setSelectedName] = useState([]);
  const [vendor, setVendor] = useState([]);
  const [specialties, setSpecialities] = useState([]);
  const [vendorError, setVendorError] = useState("");
  const [selectedCategories, setSelectedCategories] = useState([]);
  const [selectedRating, setSelectedRating] = useState([]);
  const [selectedContact, setSelectedContact] = useState([]);
  const [tableCheck, setTableCheck] = useState(false);
  const [tableContent, setTableContent] = useState("");
  const [selectedEmail, setSelectedEmail] = useState([]);
  const [technicalStaff, setTechnicalStaff] = useState([]);
  const [originalStaff, setOriginalStaff] = useState([]);
  const [myticket, setMyTicket] = useState("");

  const [filterFromDate, setFilterFromDate] = useState();
  const [filterToDate, setFilterToDate] = useState();
  const [filterStatus, setFilterStatus] = useState("");
  const [requestTypes, setRequestTypes] = useState([]);
  const [requestTypeFilter, setRequestTypeFilter] = useState({
    label: "",
    value: "",
  });
  const [ticketIDs, setTicketIDs] = useState([]);
  const [filterID, setFiletrID] = useState("");
  const [showModal, setShowModal] = useState(false);
  const [showNotes, setShowNotes] = useState([]);
  const [ticketID, setticketID] = useState("");
  const [notesInput, setNotesInput] = useState("");
  const [notesCount, setNotesCount] = useState([]);

  const openModal = () => {
    setShowModal(true);
  };

  const closeModal = () => {
    getTechnicalStaffTickets();
    setShowModal(false);
  };

  const ADD_VENDOR = "/vendor/get_vendors";
  const NOTES = "ticket/add_notes";
  const GET_NOTES = "ticket/get_notes";
  const PDF_DOWNLOAD_URL = "/ticket/view_ticket_documents";

  function tog_open_view() {
    setModel_open(!model_open);
  }
  const getVendor = async (companyID, ticket) => {
    try {
      setMyTicket(ticket);
      let response;
      console.log("decode: ", decode);
      if (decode.role === "manager") {
        response = await axios.get(ADD_VENDOR + "/" + decode.companyId);
      } else if (decode.role === "company") {
        response = await axios.get(ADD_VENDOR + "/" + decode.id);
      } else response = await axios.get(ADD_VENDOR + "/" + companyID);

      if (response.data?.success) {
        getTechnicalStaff(companyID);
        setVendor(response?.data?.vendors);
        response?.data?.vendors?.map((vendorItem, index) => {
          setSpecialities((prevSpecialities) => {
            const newSpecialitiesSet = new Set(prevSpecialities);
            newSpecialitiesSet.add(vendorItem.specialties[0]?.specialty);
            return Array.from(newSpecialitiesSet);
          });
        });
      } else {
        setVendorError(response.data?.errorMessage);
      }
    } catch (error) {
      setVendorError("Something went wrong");

      console.log(error); // TODO proper error
    }
  };

  const getTechnicalStaff = async (companyID) => {
    try {
      let body = {
        from: "vendor",
        companyId: companyID,
      };
      const response = await axios.post(
        `/technicalStaff/get_technical_staff?page=${1}&limit=1000`,
        {
          body: body,
        }
      );
      if (response.data.technicalStaff) {
        // console.log(response.data);

        const temp = response.data.technicalStaff;
        setTechnicalStaff(temp);
        setOriginalStaff(temp);
      }
    } catch (e) {
      console.log(e);
    }
  };

  const specificVendorSearch = async () => {
    try {
      const response = await axios.get();
    } catch {}
    let filterList = vendor;

    if (selectedName.length > 0) {
      filterList = vendor.filter((item) => {
        if (selectedName.includes(item.first_name)) {
          return item;
        }
      });
    }

    if (selectedRating.length > 0) {
      filterList = filterList.filter((item) => {
        if (selectedRating.includes(item.rating)) {
          return item;
        }
      });
    }

    if (selectedCategories.length > 0) {
      filterList = filterList.filter((item) => {
        if (selectedCategories.includes(item.specialties[0].specialty)) {
          return item;
        }
      });
    }

    if (selectedContact.length > 0) {
      filterList = filterList.filter((item) => {
        if (selectedContact.includes(item.contact_no)) {
          return item;
        }
      });
    }

    if (selectedContact.length > 0) {
      filterList = filterList.filter((item) => {
        if (selectedContact.includes(item.contact_no)) {
          return item;
        }
      });
    }

    setVendor(filterList);
  };

  const clear = () => {
    setSelectedName([]);
    setSelectedRating([]);
    setSelectedEmail([]);
    setSelectedContact([]);
    setSelectedCategories([]);
    setTechnicalStaff(originalStaff);
    getVendor();
  };

  const technicalStaffSearch = () => {
    let filterList = originalStaff;

    if (selectedName.length > 0) {
      filterList = originalStaff.filter((item) => {
        if (selectedName.includes(item.first_name)) {
          return item;
        }
      });
    }

    if (selectedRating.length > 0) {
      filterList = filterList.filter((item) => {
        if (selectedRating.includes(item.rating)) {
          return item;
        }
      });
    }

    if (selectedEmail.length > 0) {
      filterList = filterList.filter((item) => {
        if (selectedEmail.includes(item.email)) {
          return item;
        }
      });
    }

    if (selectedContact.length > 0) {
      filterList = filterList.filter((item) => {
        if (selectedContact.includes(item.contact_no)) {
          return item;
        }
      });
    }

    setTechnicalStaff(filterList);
  };

  const moveToSpecificVendor = async (id, staff_id) => {
    setLoading(true);
    try {
      let response;

      if (moveTo == "specific vendors") {
        response = await axios.post("ticket/move_to_specific_vendor", {
          ticketID: myticket,
          vendorID: staff_id,
        });
      } else {
        response = await axios.post("ticket/move_to_technicalStaff", {
          ticketID: myticket,
          assignedStaff: staff_id,
        });
      }

      setLoading(false);
      // props.getTicket();
      // console.log(response, "hello00");
      console.log(response.data);
      if (response.data.sucess) {
        window.location.reload();
        // props.getTicket();
      }
      window.location.reload();
    } catch (error) {
      // TODO proper message
      console.log("Unable to fetch");
      setLoading(false);
    }
  };

  const moveToAllVendor = async (id) => {
    setLoading(true);
    try {
      const response = await axios.post("/ticket/move_to_vendor_portal", {
        ticketID: myticket,
      });
      if (response.data.sucess) {
        window.location.reload();
        // props.getTicket();
      }
      setLoading(false);
      // props.getTicket();
    } catch (error) {
      // TODO proper message
      console.log("Unable to fetch");
      setLoading(false);
    }
  };

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
        getTotalTickets();
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
        // setStats(response.data.totalTickets);
        // props.totalap(response.data.totalApplications)
      } else {
        console.log("Unable to fetch the resoureces");
      }
    } catch (error) {
      console.log("unable to get applicants", error);
    }
  }
  const getTotalTickets = async () => {
    await TotalTicket(TOTAL_TICKETS_URL, {
      role: decode.role,
      domain: decode.domain,
      customerId: decode.id,
    });
  };

  useState(async () => {
    getTotalTickets();
  });
  const getTechnicalStaffTickets = async (pgNum, type) => {
    try {
      let response;
      let query = {
        pageNumber: pgNum,
        startDate: filterFromDate,
        endDate: filterToDate,
        status: filterStatus,
        propertyID: propertyID,
        filterID: filterID?.value,
        requestType: requestTypeFilter.value,
      };

      response = await axios.post(VENDOR_PORTAL_TICKETS, query);

      console.log("response", response);

      if (response.data.status == 200) {
        setportalTikets(response.data.tickets);
        setTotalTickets(response.data.totalCount);
        setPropertyList(response.data.propertyList);
        setTicketIDs(response.data.tickets.map((t) => t._id));
        setRequestTypes(response.data.requestTypes);
        setNotesCount(response.data.notesCount);
        setStats({
          total: response.data.total?.Total,
          open: response.data.total?.Open,
          inprogress: response.data.total?.Inprogress,
          completed: response.data.total?.Completed,
          unresolved: response.data.total?.Unresolved,
        });
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
    setFiletrID("");
    setFilterFromDate("");
    setFilterToDate("");
    setFilterStatus("");
    setRequestTypeFilter("");
    getTechnicalStaffTickets();
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

  const getNotes = async (ticketID) => {
    setShowNotes([]);
    setticketID(ticketID);
    const payload = {
      id: decode.id,
      user: decode.role,
      ticketId: ticketID,
    };
    console.log(payload, "payloadfdfdf");
    const response = await axios.post(GET_NOTES, payload);
    if (response.data.status === 200) {
      console.log(response.data.notes, "nptoes");
      setShowNotes(response.data.notes);
    }
  };

  const sendNotes = async (ticketId) => {
    if (notesInput.length > 0) {
      try {
        const payload = {
          user: decode.role,
          id: decode.id,
          notes: notesInput,
          ticketId,
          name: decode.firstname,
        };
        console.log(payload, "payload");
        const response = await axios.post(NOTES, payload);

        if (response.status === 200) {
          setNotesInput("");
          getNotes(ticketID);
        }
      } catch {}
    } else {
      return;
    }
  };

  // const getProperties = async (pgNum, type) => {
  //   try {
  //     const response = await axios.get("/property/getproperties");

  //     console.log(response);

  //     setPropertyList(response.data.properties);
  //   } catch (error) {
  //     // setportalTikets("Something went wrong")

  //     console.log(error); // TODO proper error
  //   }
  // };

  useEffect(async () => {
    getTechnicalStaffTickets();
    // getProperties();
    // const getSpeciality = async (e) => {
    // }
  }, []);
  console.log("portalTicketssssssssssssss", portalTikets);
  const handlePrint = (data) => {
    const printContent = `
    <div class="print-template">
      <table style="border-collapse: collapse; width: 100%;">
        <tr>
          <td colspan="2" style="text-align: center; padding: 10px; border: 1px solid #ccc;">
            <h2>Ticket Details</h2>
            <p>ID : ${data._id.substring(data._id.length - 6)}</p>
          </td>
        </tr>
        <tr>
          <td style="padding: 10px; border: 1px solid #ccc;">Property Name:</td>
          <td style="padding: 10px; border: 1px solid #ccc;">${
            data.property
          }</td>
        </tr>
        <tr>
          <td style="padding: 10px; border: 1px solid #ccc;">Company Name:</td>
          <td style="padding: 10px; border: 1px solid #ccc;">${
            data.companyDomain
          }</td>
        </tr>
        <tr>
          <td style="padding: 10px; border: 1px solid #ccc;">Name:</td>
          <td style="padding: 10px; border: 1px solid #ccc;">${data.name}</td>
        </tr>
        <tr>
          <td style="padding: 10px; border: 1px solid #ccc;">Email:</td>
          <td style="padding: 10px; border: 1px solid #ccc;">${data.email}</td>
        </tr>
        <tr>
          <td style="padding: 10px; border: 1px solid #ccc;">Phone:</td>
          <td style="padding: 10px; border: 1px solid #ccc;">${data.phone}</td>
        </tr>
        <tr>
          <td style="padding: 10px; border: 1px solid #ccc;">Suite:</td>
          <td style="padding: 10px; border: 1px solid #ccc;">${data.suite}</td>
        </tr>
        <tr>
          <td style="padding: 10px; border: 1px solid #ccc;">Request Type:</td>
          <td style="padding: 10px; border: 1px solid #ccc;">${
            data.requestType
          }</td>
        </tr>
        <tr>
          <td style="padding: 10px; border: 1px solid #ccc;">Details:</td>
          <td style="padding: 10px; border: 1px solid #ccc;">${
            data.details
          }</td>
        </tr>
      <tr>
          <td style="padding: 10px; border: 1px solid #ccc;">Status :</td>
          <td style="padding: 10px; border: 1px solid #ccc;">${status}</td>
        </tr>
      </table>
    </div>
`;
    const printWindow = window.open("", "_blank");
    printWindow.document.write(`
  <html>
    <head>
      <title>Ticket Details</title>
    </head>
    <body>${printContent}</body>
  </html>
`);
    printWindow.document.close();
    printWindow.print();
  };

  const customHumanize = (createdAt) => {
    const momentDate = moment(createdAt);
    const duration = moment.duration(moment().diff(momentDate));

    if (duration.asMinutes() < 60) {
      const minutes = Math.floor(duration.asMinutes());
      return minutes === 1 ? "1 min" : `${minutes} mins`;
    } else if (duration.asHours() < 24) {
      const hours = Math.floor(duration.asHours());
      return hours === 1 ? "1 hr" : `${hours} hrs`;
    } else if (duration.asDays() < 30) {
      const days = Math.floor(duration.asDays());
      return days === 1 ? "1 day" : `${days} days`;
    } else {
      const months = Math.floor(duration.asMonths());
      return months === 1 ? "1 mo" : `${months} mos`;
    }
  };

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
                      <div className="mb d-flex flex-wrap">
                        <button
                          onClick={t_col5}
                          className="btn btn-primary mo-mb-2 mr-10"
                          type="button"
                          style={{ cursor: "pointer" }}
                        >
                          Filters
                        </button>

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
                                        options={ticketIDs.map((id) => {
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
                                        value={property}
                                        onChange={(e) => {
                                          // const propertyData = JSON.parse(e.target.value)
                                          setPropertyID(e.value);
                                          setProperty(e);
                                          console.log(e);
                                          // domain = this.state.propertyList.find(o => o._id === propertyData.ID);
                                          // domain = domain.companyDomain
                                          // console.log(domain)
                                        }}
                                        options={propertyList?.map((p) => {
                                          return {
                                            value: p._id,
                                            label: p.title,
                                          };
                                        })}
                                      />
                                    </div>
                                  </div>
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

                                  <div className="col-md-2 text-end">
                                    <button
                                      type="submit"
                                      className="btn btn-primary"
                                      onClick={(e) => {
                                        e.preventDefault();
                                        getTechnicalStaffTickets();
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
                        {/* <tr>
                          <th scope="col">#</th>
                          <th scope="col">Company</th>
                          <th scope="col">Property</th>
                          <th scope="col">Suite</th>
                          <th scope="col">Details</th>
                          <th scope="col">Status</th>
                          <th scope="col">Action</th>
                          <th scope="col">Assign to</th>
                        </tr> */}
                        <tr>
                          <th scope="col">#</th>
                          <th scope="col">ID</th>
                          <th scope="col">Type</th>
                          <th scope="col" style={{ minWidth: "5rem" }}>
                            Property
                          </th>
                          <th scope="col" style={{ minWidth: "7rem" }}>
                            Submited By
                          </th>
                          <th scope="col" style={{ minWidth: "6rem" }}>
                            Created
                          </th>
                          <th scope="col" style={{ minWidth: "4rem" }}>
                            Age
                          </th>
                          <th scope="col">Status</th>
                          <th scope="col">Download</th>
                          <th scope="col">Action</th>
                          <th scope="col">Assign to</th>
                          <th scope="col">History</th>
                          <th scope="col">Memo</th>
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
                            <>
                              <tr key={item._id}>
                                <td>{index + 1}</td>
                                <td>
                                  {item._id.substring(item._id.length - 6)}
                                </td>
                                <td>{item.requestType}</td>
                                <td>{item.property}</td>
                                <td>
                                  {item.name}
                                  <br></br>
                                  {/* {item.email}
                                  <br></br>
                                  {item.suite} */}
                                </td>
                                <td>
                                  {moment(item.createdAt).format("DD-MM-YY")}
                                </td>
                                <td>{customHumanize(item.createdAt)}</td>
                                <td className="text-capitalize text-center">
                                  <button
                                    className={`btn ${
                                      item.status === "Completed"
                                        ? "btn-success"
                                        : item.status === "Inprogress"
                                        ? "btn-warning"
                                        : item.status === "Unresolved"
                                        ? "btn-danger"
                                        : "btn-primary"
                                    }`}
                                  >
                                    {item.status}
                                  </button>
                                </td>
                                <td>
                                  <div>
                                    {console.log("Documents:", item.documents)}
                                    {item?.documents?.length > 0 &&
                                    item?.documents[0]?.includes(BUCKET_URL) ? (
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
                                    ) : item?.documents?.length > 0 &&
                                      !item?.documents[0]?.includes(
                                        BUCKET_URL
                                      ) ? (
                                      <button
                                        onClick={async () => {
                                          const response = await axios.post(
                                            PDF_DOWNLOAD_URL,
                                            {
                                              id: item._id,
                                            }
                                          );

                                          for (
                                            let i = 0;
                                            i < response.data.documents.length;
                                            i++
                                          ) {
                                            const url = `${SERVER_URL}${response.data.documents[i]}`;
                                            const filePath =
                                              response.data.documents[i];
                                            const extension =
                                              filePath.substring(
                                                filePath.lastIndexOf(".") + 1
                                              );
                                            console.log(extension);
                                            console.log(url);
                                            fetch(url, {
                                              method: "GET",
                                              headers: {},
                                            })
                                              .then((response) => {
                                                response
                                                  .arrayBuffer()
                                                  .then(function (buffer) {
                                                    const url =
                                                      window.URL.createObjectURL(
                                                        new Blob([buffer])
                                                      );
                                                    const link =
                                                      document.createElement(
                                                        "a"
                                                      );
                                                    link.href = url;
                                                    link.setAttribute(
                                                      "download",
                                                      `ticket.${extension}`
                                                    ); //or any other extension
                                                    document.body.appendChild(
                                                      link
                                                    );
                                                    link.click();
                                                  });
                                              })
                                              .catch((err) => {
                                                console.log(err);
                                              });
                                          }
                                        }}
                                        type="button"
                                        className="btn btn-soft-light btn-sm w-xs waves-effect "
                                      >
                                        <i className="bx bx-download label-icon"></i>
                                      </button>
                                    ) : (
                                      <div className="d-flex flex-wrap align-items-center justify-content-center">
                                        NA
                                      </div>
                                    )}
                                  </div>
                                </td>
                                <td>
                                  <div>
                                    {item.quotedVendorTickets.length === 0 ? (
                                      <button
                                        className={
                                          item.status === "Completed"
                                            ? `btn btn-outline-primary btn-sm mr-5`
                                            : `btn btn-secondary btn-sm mr-5`
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
                                    ) : (
                                      <div style={{ color: "green" }}>
                                        Quoted
                                      </div>
                                    )}
                                  </div>
                                </td>
                                <td>
                                  {decode.id == item.assignedTo?._id &&
                                  item.status !== "Completed" &&
                                  item.assignSpecificVendors.length == 0 ? (
                                    <button
                                      className="btn btn-danger btn-sm"
                                      onClick={() => {
                                        tog_open_view();
                                        getVendor(item.companyID, item._id);
                                      }}
                                    >
                                      Assign
                                    </button>
                                  ) : !item.isMovedToVendorPortal &&
                                    item.status !== "Completed" ? (
                                    <button
                                      className="btn btn-danger btn-sm"
                                      onClick={() => {
                                        tog_open_view();
                                        getVendor(item.companyID, item._id);
                                      }}
                                    >
                                      Assign
                                    </button>
                                  ) : (
                                    <button className="btn btn-success btn-sm">
                                      Assigned
                                    </button>
                                  )}
                                </td>
                                <td>
                                  <button
                                    className="btn btn-outline-info btn-sm"
                                    onClick={(e) => {
                                      setShowLogs((prev) => ({
                                        ...prev,
                                        data: item?.history,
                                        value: true,
                                      }));
                                    }}
                                  >
                                    View Log
                                  </button>
                                </td>
                                <td className="text-capitalize">
                                  <div style={{ position: "relative" }}>
                                    {notesCount[item._id] ? (
                                      <Badge
                                        style={{
                                          background: "#fd625e",
                                          position: "absolute",
                                          right: 0,
                                          top: "-7px",
                                        }}
                                      >
                                        {notesCount[item._id]}
                                      </Badge>
                                    ) : (
                                      ""
                                    )}
                                    <button
                                      className="btn btn-outline-info btn-sm"
                                      // onClick={openModal}
                                      onClick={() => {
                                        getNotes(item._id);
                                        openModal();
                                      }}
                                    >
                                      View Memo
                                    </button>
                                  </div>
                                </td>
                                <Modal
                                  size="lg"
                                  isOpen={model_open}
                                  toggle={() => {
                                    tog_open_view();
                                  }}
                                >
                                  <div className="modal-header">
                                    <h5
                                      className="modal-title mt-0"
                                      id="myLargeModalLabel"
                                    >
                                      Assign
                                    </h5>
                                    <button
                                      onClick={() => {
                                        tog_open_view();
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
                                    <div
                                      style={{
                                        display: "flex",
                                        justifyContent: "center",
                                        alignItems: "center",
                                        marginTop: "15px",
                                        padding: "5px",
                                      }}
                                    >
                                      <div
                                        style={{ marginRight: "15px" }}
                                        class="form-check"
                                      >
                                        <input
                                          class="form-check-input"
                                          type="radio"
                                          name="flexRadioDefault"
                                          id="flexRadioDefault1"
                                          checked={moveTo == "all vendors"}
                                          onClick={() => {
                                            setchecked(true);
                                            setMoveTo("all vendors");
                                          }}
                                        />
                                        <label
                                          class="form-check-label"
                                          for="flexRadioDefault1"
                                        >
                                          Assign to All Vendors
                                        </label>
                                      </div>
                                      <div
                                        style={{ marginRight: "10px" }}
                                        class="form-check"
                                      >
                                        <input
                                          class="form-check-input"
                                          type="radio"
                                          name="flexRadioDefault"
                                          id="flexRadioDefault2"
                                          checked={moveTo == "specific vendors"}
                                          onClick={() => {
                                            setchecked(false);
                                            setMoveTo("specific vendors");
                                          }}
                                        />
                                        <label
                                          class="form-check-label"
                                          for="flexRadioDefault2"
                                        >
                                          Assign to Specified Vendors
                                        </label>
                                      </div>

                                      <div
                                        style={{ marginRight: "10px" }}
                                        class="form-check"
                                      >
                                        <input
                                          class="form-check-input"
                                          type="radio"
                                          name="flexRadioDefault"
                                          id="flexRadioDefault3"
                                          checked={
                                            moveTo == "specific technical staff"
                                          }
                                          onClick={() => {
                                            setMoveTo(
                                              "specific technical staff"
                                            );
                                          }}
                                        />
                                        <label
                                          class="form-check-label"
                                          for="flexRadioDefault3"
                                        >
                                          {/* Assign to Specified Technical Staff */}
                                          Assign to Maintenance Team
                                        </label>
                                      </div>
                                    </div>

                                    {moveTo == "specific vendors" && (
                                      <>
                                        <Card>
                                          <CardBody>
                                            <div className="filter-sec">
                                              <Form>
                                                <div class="row align-items-center">
                                                  <div className="col-md-4">
                                                    <div className="mb-3">
                                                      <Label className="form-Label">
                                                        Names
                                                      </Label>
                                                      <Select
                                                        isMulti
                                                        onChange={(
                                                          selectedOption
                                                        ) => {
                                                          const names = [];
                                                          selectedOption.map(
                                                            (property) => {
                                                              names.push(
                                                                property.value
                                                              );
                                                            }
                                                          );
                                                          setSelectedName(
                                                            names
                                                          );
                                                        }}
                                                        value={selectedName.map(
                                                          (item) => {
                                                            return {
                                                              label: item,
                                                              value: item,
                                                            };
                                                          }
                                                        )}
                                                        options={vendor.map(
                                                          (item) => {
                                                            return {
                                                              label:
                                                                item.first_name,
                                                              value:
                                                                item.first_name,
                                                            };
                                                          }
                                                        )}
                                                        className="basic-multi-select"
                                                        classNamePrefix="select"
                                                      />

                                                      {/* {propertyList && propertyList.map((property) => <option value={`{"title": "${property.title}", "ID": "${property._id}"}`}>{property.title}</option>)} */}
                                                    </div>
                                                  </div>
                                                  {/* <div className="col-md-4">
                            <div className="mb-3">
                              <Label className="form-Label">Rating</Label>
                              <Select
                                isMulti
                                value={selectedRating.map((item) => {
                                  return { label: item, value: item };
                                })}
                                onChange={(selectedOption) => {
                                  const ratings = [];
                                  selectedOption.map((property) => {
                                    ratings.push(property.value);
                                  });
                                  setSelectedRating(ratings);
                                }}
                                options={originalStaff.map((item) => {
                                  return {
                                    label: item.rating,
                                    value: item.rating,
                                  };
                                })}
                                className="basic-multi-select"
                                classNamePrefix="select"
                              />
                            </div>
                          </div> */}
                                                  <div className="col-md-4">
                                                    <div className="mb-3">
                                                      <Label className="form-Label">
                                                        Category
                                                      </Label>
                                                      <Select
                                                        isMulti
                                                        value={selectedCategories.map(
                                                          (item) => {
                                                            return {
                                                              label: item,
                                                              value: item,
                                                            };
                                                          }
                                                        )}
                                                        onChange={(
                                                          selectedOption
                                                        ) => {
                                                          const category = [];
                                                          selectedOption.map(
                                                            (property) => {
                                                              category.push(
                                                                property.value
                                                              );
                                                            }
                                                          );
                                                          setSelectedCategories(
                                                            category
                                                          );
                                                        }}
                                                        options={specialties.map(
                                                          (item) => {
                                                            return {
                                                              label: item,
                                                              value: item,
                                                            };
                                                          }
                                                        )}
                                                        className="basic-multi-select"
                                                        classNamePrefix="select"
                                                      />
                                                    </div>
                                                  </div>

                                                  <div className="col-md-4">
                                                    <div className="mb-3">
                                                      <Label className="form-Label">
                                                        Contact No
                                                      </Label>
                                                      <Select
                                                        isMulti
                                                        value={selectedContact.map(
                                                          (item) => {
                                                            return {
                                                              label: item,
                                                              value: item,
                                                            };
                                                          }
                                                        )}
                                                        onChange={(
                                                          selectedOption
                                                        ) => {
                                                          const contact_no = [];
                                                          selectedOption.map(
                                                            (property) => {
                                                              contact_no.push(
                                                                property.value
                                                              );
                                                            }
                                                          );
                                                          setSelectedContact(
                                                            contact_no
                                                          );
                                                        }}
                                                        options={vendor.map(
                                                          (item) => {
                                                            return {
                                                              label:
                                                                item.contact_no,
                                                              value:
                                                                item.contact_no,
                                                            };
                                                          }
                                                        )}
                                                        className="basic-multi-select"
                                                        classNamePrefix="select"
                                                      />
                                                    </div>
                                                  </div>

                                                  <div className="col-md-2 text-end">
                                                    <button
                                                      type="submit"
                                                      className="btn btn-primary"
                                                      onClick={(e) => {
                                                        e.preventDefault();
                                                        // technicalStaffSearch();
                                                        specificVendorSearch();
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
                                                        clear();
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
                                        <div
                                          style={{
                                            marginTop: "15px",
                                            display: "flex",
                                            alignItems: "center",
                                          }}
                                          className="table-responsive"
                                        >
                                          <Table className="table-striped table-bordered mb-0">
                                            <thead>
                                              <tr>
                                                <th></th>
                                                <th scope="col">#1</th>
                                                <th scope="col">Category</th>
                                                {/* <th scope="col">Code</th> */}
                                                <th scope="col">Name</th>
                                                <th scope="col">Address</th>
                                                <th scope="col">Agency Name</th>
                                                <th scope="col">Contact</th>

                                                {/* <th scope="col">Attachment</th> */}
                                              </tr>
                                            </thead>
                                            {console.log(vendor)}

                                            {vendor.map((item, i) => {
                                              return (
                                                <tbody>
                                                  <tr>
                                                    <div
                                                      style={{
                                                        marginLeft: "15px",
                                                      }}
                                                      class="form-check"
                                                    >
                                                      <input
                                                        class="form-check-input"
                                                        type="radio"
                                                        name="flexTableRadioDefault"
                                                        onClick={() => {
                                                          setTableCheck(true);
                                                          setTableContent(
                                                            item._id
                                                          );
                                                        }}
                                                      />
                                                    </div>
                                                    <td>{i + 1}</td>
                                                    <td>
                                                      {item.specialties.length >
                                                      0
                                                        ? item.specialties
                                                            .map(
                                                              (a) => a.specialty
                                                            )
                                                            .join()
                                                        : "No Category found"}
                                                    </td>
                                                    {/* <td>18</td> */}
                                                    <td>{item.first_name}</td>
                                                    <td>{item.address}</td>
                                                    <td>{item.agency_name}</td>
                                                    <td>{item.contact_no}</td>
                                                  </tr>
                                                </tbody>
                                              );
                                            })}
                                          </Table>
                                        </div>
                                      </>
                                    )}

                                    {moveTo == "specific technical staff" && (
                                      <Card>
                                        <CardBody>
                                          <div className="filter-sec">
                                            <Form>
                                              <div class="row align-items-center">
                                                <div className="col-md-4">
                                                  <div className="mb-3">
                                                    <Label className="form-Label">
                                                      Name
                                                    </Label>
                                                    <Select
                                                      isMulti
                                                      onChange={(
                                                        selectedOption
                                                      ) => {
                                                        const names = [];
                                                        selectedOption.map(
                                                          (property) => {
                                                            names.push(
                                                              property.value
                                                            );
                                                          }
                                                        );
                                                        setSelectedName(names);
                                                      }}
                                                      value={selectedName.map(
                                                        (item) => {
                                                          return {
                                                            label: item,
                                                            value: item,
                                                          };
                                                        }
                                                      )}
                                                      options={originalStaff.map(
                                                        (item) => {
                                                          return {
                                                            label:
                                                              item.first_name,
                                                            value:
                                                              item.first_name,
                                                          };
                                                        }
                                                      )}
                                                      className="basic-multi-select"
                                                      classNamePrefix="select"
                                                    />

                                                    {/* {propertyList && propertyList.map((property) => <option value={`{"title": "${property.title}", "ID": "${property._id}"}`}>{property.title}</option>)} */}
                                                  </div>
                                                </div>
                                                {/* <div className="col-md-4">
                            <div className="mb-3">
                              <Label className="form-Label">Rating</Label>
                              <Select
                                isMulti
                                value={selectedRating.map((item) => {
                                  return { label: item, value: item };
                                })}
                                onChange={(selectedOption) => {
                                  const ratings = [];
                                  selectedOption.map((property) => {
                                    ratings.push(property.value);
                                  });
                                  setSelectedRating(ratings);
                                }}
                                options={originalStaff.map((item) => {
                                  return {
                                    label: item.rating,
                                    value: item.rating,
                                  };
                                })}
                                className="basic-multi-select"
                                classNamePrefix="select"
                              />
                            </div>
                          </div> */}
                                                <div className="col-md-4">
                                                  <div className="mb-3">
                                                    <Label className="form-Label">
                                                      Email
                                                    </Label>
                                                    <Select
                                                      isMulti
                                                      value={selectedEmail.map(
                                                        (item) => {
                                                          return {
                                                            label: item,
                                                            value: item,
                                                          };
                                                        }
                                                      )}
                                                      onChange={(
                                                        selectedOption
                                                      ) => {
                                                        const emails = [];
                                                        selectedOption.map(
                                                          (property) => {
                                                            emails.push(
                                                              property.value
                                                            );
                                                          }
                                                        );
                                                        setSelectedEmail(
                                                          emails
                                                        );
                                                      }}
                                                      options={originalStaff.map(
                                                        (item) => {
                                                          return {
                                                            label: item.email,
                                                            value: item.email,
                                                          };
                                                        }
                                                      )}
                                                      className="basic-multi-select"
                                                      classNamePrefix="select"
                                                    />
                                                  </div>
                                                </div>

                                                <div className="col-md-4">
                                                  <div className="mb-3">
                                                    <Label className="form-Label">
                                                      Contact No
                                                    </Label>
                                                    <Select
                                                      isMulti
                                                      value={selectedContact.map(
                                                        (item) => {
                                                          return {
                                                            label: item,
                                                            value: item,
                                                          };
                                                        }
                                                      )}
                                                      onChange={(
                                                        selectedOption
                                                      ) => {
                                                        const contact_no = [];
                                                        selectedOption.map(
                                                          (property) => {
                                                            contact_no.push(
                                                              property.value
                                                            );
                                                          }
                                                        );
                                                        setSelectedContact(
                                                          contact_no
                                                        );
                                                      }}
                                                      options={originalStaff.map(
                                                        (item) => {
                                                          return {
                                                            label:
                                                              item.contact_no,
                                                            value:
                                                              item.contact_no,
                                                          };
                                                        }
                                                      )}
                                                      className="basic-multi-select"
                                                      classNamePrefix="select"
                                                    />
                                                  </div>
                                                </div>

                                                <div className="col-md-2 text-end">
                                                  <button
                                                    type="submit"
                                                    className="btn btn-primary"
                                                    onClick={(e) => {
                                                      e.preventDefault();
                                                      technicalStaffSearch();
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
                                                      clear();
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
                                    )}

                                    {moveTo == "specific technical staff" && (
                                      <div
                                        style={{
                                          marginTop: "15px",
                                          display: "flex",
                                          alignItems: "center",
                                        }}
                                        className="table-responsive"
                                      >
                                        <Table className="table-striped table-bordered mb-0">
                                          <thead>
                                            <tr>
                                              <th></th>
                                              <th scope="col">#</th>
                                              <th scope="col">Category</th>
                                              {/* <th scope="col">Code</th> */}
                                              <th scope="col">Name</th>
                                              <th scope="col">Address</th>
                                              <th scope="col">Contact</th>
                                              <th scope="col">Rating</th>

                                              {/* <th scope="col">Attachment</th> */}
                                            </tr>
                                          </thead>
                                          {console.log(vendor)}

                                          {technicalStaff.map((item, i) => {
                                            return (
                                              <tbody>
                                                <tr>
                                                  <div
                                                    style={{
                                                      marginLeft: "15px",
                                                    }}
                                                    class="form-check"
                                                  >
                                                    <input
                                                      class="form-check-input"
                                                      type="radio"
                                                      name="flexTableRadioDefault"
                                                      onClick={() => {
                                                        setTableCheck(true);
                                                        setTableContent(
                                                          item._id
                                                        );
                                                      }}
                                                    />
                                                  </div>
                                                  <td>{i + 1}</td>
                                                  <td>
                                                    {item.specialties.length > 0
                                                      ? item.specialties
                                                          .map(
                                                            (a) => a.speciality
                                                          )
                                                          .join()
                                                      : "No Category found"}
                                                  </td>
                                                  {/* <td>18</td> */}
                                                  <td>{item.first_name}</td>
                                                  <td>{item.email}</td>
                                                  <td>{item.contact_no}</td>
                                                  <td>
                                                    <Rating
                                                      ratingValue={
                                                        item.rating * 20
                                                      }
                                                      readonly={true}
                                                      size={20}
                                                    />
                                                  </td>
                                                </tr>
                                              </tbody>
                                            );
                                          })}
                                        </Table>
                                      </div>
                                    )}
                                  </div>
                                  {moveTo == "specific vendors" || //here is the change
                                  moveTo == "specific technical staff" ? (
                                    <div
                                      style={{
                                        display: "flex",
                                        justifyContent: "center",
                                        marginTop: "15px",
                                        padding: "5px",
                                      }}
                                    >
                                      <button
                                        onClick={() => {
                                          moveToSpecificVendor(
                                            item._id,
                                            tableContent
                                          );
                                          setModel_open(!model_open);
                                        }}
                                        style={{ marginRight: "10px" }}
                                        className="btn btn-primary"
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
                                        {/* <i
                                    id="failedSaveErrorIcon"
                                    style={{
                                        marginLeft: "5px",
                                    }}
                                    class="fa fa-exclamation-triangle"
                                    aria-hidden="true"
                                ></i> */}
                                        Submit
                                      </button>
                                      <button
                                        className="btn btn-light"
                                        onClick={(e) => {
                                          tog_open_view();
                                        }}
                                      >
                                        Cancel
                                      </button>
                                    </div>
                                  ) : (
                                    <div
                                      style={{
                                        display: "flex",
                                        justifyContent: "center",
                                        marginTop: "15px",
                                        padding: "5px",
                                      }}
                                    >
                                      {moveTo == "all vendors" && (
                                        <button
                                          style={{ marginRight: "10px" }}
                                          onClick={() => {
                                            moveToAllVendor(item._id);
                                            setModel_open(!model_open);
                                          }}
                                          className="btn btn-primary"
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
                                          Submit
                                        </button>
                                      )}
                                      <button
                                        className="btn btn-light"
                                        onClick={(e) => {
                                          tog_open_view();
                                        }}
                                      >
                                        Cancel
                                      </button>
                                    </div>
                                  )}
                                </Modal>

                                <Modal
                                  size="lg"
                                  isOpen={modal_view}
                                  toggle={() => {
                                    tog_view();
                                  }}
                                  style={{
                                    background: "transparent !important",
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
                                      className="nav-tabs-custom nav-justified d-flex position-static p-0"
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
                                      {selectedTicket?.status !==
                                        "Completed" && (
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
                                                  value={
                                                    selectedTicket.property
                                                  }
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
                                                  Permission to enter
                                                </Label>
                                                <Input
                                                  type="text"
                                                  value={
                                                    selectedTicket.permission
                                                  }
                                                  className="form-control"
                                                  id="formrow-room-input"
                                                  readOnly
                                                />
                                              </div>
                                            </div>
                                            {item.building && (
                                              <div className="col-md-4">
                                                <div className="mb-3">
                                                  <Label
                                                    className="form-label"
                                                    htmlFor="formrow-phone-input"
                                                  >
                                                    Building Name
                                                  </Label>
                                                  <Input
                                                    type="text"
                                                    value={item.building}
                                                    className="form-control"
                                                    id="formrow-room-input"
                                                    readOnly
                                                  />
                                                </div>
                                              </div>
                                            )}

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
                                              Cancel
                                            </button>
                                          </div>
                                        </div>
                                      </TabPane>
                                      <div className="d-flex justify-content-end">
                                        <div className="mb-3">
                                          <button
                                            className="btn btn-primary"
                                            onClick={() =>
                                              handlePrint(selectedTicket)
                                            }
                                          >
                                            Print
                                          </button>
                                        </div>
                                      </div>
                                    </TabContent>
                                  </div>
                                </Modal>
                              </tr>
                            </>
                          );
                        })}
                        <Modal
                          size="md"
                          // isOpen={showlogs?.value}
                          // toggle={() => {
                          //   setShowLogs((prev) => ({ ...prev, data: [], value: false }));
                          // }}
                          isOpen={showModal}
                          toggle={closeModal}
                        >
                          <div className="modal-header">
                            <h5
                              className="modal-title mt-0"
                              id="myLargeModalLabel"
                            >
                              Notes
                            </h5>
                            <button
                              onClick={closeModal}
                              type="button"
                              className="close"
                              data-dismiss="modal"
                              aria-label="Close"
                            >
                              <span aria-hidden="true">&times;</span>
                            </button>
                          </div>
                          <div className="modal-body">
                            <div
                              className=" d-flex flex-column ml-2 "
                              style={{ overflow: "auto", maxHeight: "70vh" }}
                            >
                              <Card className="mb-2 w-100 w-fit-content border-0">
                                <CardBody className="p-0 border-0">
                                  {showNotes?.map((log, i) => (
                                    <div
                                      key={log?._id}
                                      className="chatBox mb-2 pt-1"
                                    >
                                      <div className="d-flex justify-content-between align-items-center ">
                                        {/* {log.user} */}
                                        <h5 className="">{log?.userName}</h5>
                                        <div>
                                          <div className="rounded-pill px-1  bg-primary text-white text-center">
                                            {log?.user}
                                          </div>
                                          <small
                                            className="text-muted mx-2 "
                                            style={{ fontStyle: "italic" }}
                                          >
                                            {moment(log?.createdAt).calendar()}
                                          </small>
                                        </div>
                                      </div>

                                      {/* <div className={`${i + 1 !== showlogs?.data?.length ? "line h-100" : ""}`}></div> */}

                                      <div className="">
                                        <p className="lead mb-0 p-0">
                                          <span className="text-black mx-2">
                                            <strong>{log?.note}</strong>
                                          </span>
                                          {/* {log?.action}.{" "}kjk kjk */}
                                        </p>
                                      </div>
                                    </div>
                                  ))}
                                </CardBody>
                              </Card>
                            </div>
                            <div className=" d-flex flex  ml-2">
                              <div className="divider"></div>
                              <input
                                className="w-100 me-2 px-2"
                                onChange={(event) => {
                                  setNotesInput(event.target.value);
                                }}
                                value={notesInput}
                                type="text"
                              ></input>
                              <button
                                onClick={() => sendNotes(ticketID)}
                                className="btn btn-primary btn-m ml-15"
                              >
                                Send
                              </button>
                            </div>
                          </div>
                        </Modal>
                      </tbody>
                    </Table>
                    <Modal
                      size="lg"
                      isOpen={showlogs?.value}
                      toggle={() => {
                        setShowLogs((prev) => ({
                          ...prev,
                          data: [],
                          value: false,
                        }));
                      }}
                    >
                      <div className="modal-header">
                        <h5 className="modal-title mt-0" id="myLargeModalLabel">
                          History Log
                        </h5>
                        <button
                          onClick={() => {
                            setShowLogs((prev) => ({
                              ...prev,
                              data: [],
                              value: false,
                            }));
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
                        <div className=" d-flex flex-column  ml-2">
                          {showlogs?.data?.map((log, i) => (
                            <div key={log?._id} className="d-flex mb-1">
                              <div className="d-flex flex-column pr-4 align-items-center">
                                <div className="rounded-circle py-2 px-3 bg-primary text-white mb-1">
                                  {i + 1}
                                </div>
                                <div
                                  className={`${
                                    i + 1 !== showlogs?.data?.length
                                      ? "line h-100"
                                      : ""
                                  }`}
                                ></div>
                              </div>
                              <div>
                                <p className="lead  pb-3">
                                  <span className="text-black mx-2">
                                    <strong>
                                      {log?.userName} ({log.actionBy})
                                    </strong>
                                  </span>
                                  {log?.action}.{" "}
                                  <small className="text-muted mx-2">
                                    {" "}
                                    {moment(log?.createdAt).calendar()}
                                  </small>
                                </p>
                              </div>
                            </div>
                          ))}
                        </div>
                      </div>
                    </Modal>
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
export default TechnicalStaffTickets;
