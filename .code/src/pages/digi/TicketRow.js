import React, { useState, useEffect, useRef } from "react";
import { Link } from "react-router-dom";
import axios from "../api/axios";
import { Rating } from "react-simple-star-rating";

import moment from "moment";

import jwt_decode from "jwt-decode";
import { BUCKET_URL, SERVER_URL } from "../ServerLink";

import {
  Modal,
  ModalHeader,
  ModalBody,
  ModalFooter,
  Label,
  Form,
  Nav,
  NavItem,
  NavLink,
  TabContent,
  TabPane,
  Input,
  Badge,
  Table,
  Card,
  CardBody,
} from "reactstrap";
import Select from "react-select";
import { toast } from "react-toastify";
import classnames from "classnames";
import { tab } from "@testing-library/user-event/dist/tab";
import { currencyFormat } from "../../helpers/helper";

export default function TicketRow(props) {
  const decode = jwt_decode(window.localStorage.getItem("accessToken"));
  const [modal_view, setmodal_view] = useState(false);
  const [ratingModel, setRatingModel] = useState(false);
  const [review, setReview] = useState("");
  const [ratings, setRating] = useState("");
  const [model_open, setModel_open] = useState(false);
  // const contentRef = useRef(null);
  const [customActiveTab, setcustomActiveTab] = useState(
    props.isConfirmationSet ? "2" : "1"
  );
  const [showModal, setShowModal] = useState(false);

  const openModal = () => {
    getNotes();
    setShowModal(true);
  };

  const closeModal = () => {
    setShowModal(false);
    props.searchTicket();
    // window.location.reload()
  };
  const [checked, setchecked] = useState(false);
  const [assignedVendor, setAssignedVendor] = useState(
    props?.assignedTo
      ? props.assignedTo?.first_name
      : props.assignSpecificVendors?.[0]?.first_name
  );
  const [assignedRole, setAssignedRole] = useState(
    props?.assignedTo
      ? props.assignedTo?.role
      : props.assignSpecificVendors?.[0]?.role
  );

  const [status, setStatus] = useState(props.status ? props.status : "select");
  const [startDate, setStartDate] = useState(
    props.startDate ? props.startDate.split("T")[0] : Date.now()
  );
  const [startTime, setStartTime] = useState(
    props.startTime ? props.startTime : ""
  );
  const [endDate, setEndDate] = useState(
    props.estimatedEndDate ? props.estimatedEndDate.split("T")[0] : Date.now()
  );
  const [endTime, setEndTime] = useState(props.endTime ? props.endTime : "");
  const [notes, setNotes] = useState(props.notes ? props.notes : "");
  const [moveTo, setMoveTo] = useState("");
  const [vendor, setVendor] = useState([]);
  const [vendorError, setVendorError] = useState("");
  const [modal_large, setmodal_large] = useState(false);
  const [modal_large2, setmodal_large2] = useState(false);
  const [loading, setLoading] = useState(false);
  const [tableCheck, setTableCheck] = useState(false);
  const [tableContent, setTableContent] = useState("");

  const [technicalStaff, setTechnicalStaff] = useState([]);
  const [originalStaff, setOriginalStaff] = useState([]);
  const [vendorStaff, setVendorStaff] = useState([]);
  const [specialties, setSpecialities] = useState([]);

  const [selectedName, setSelectedName] = useState([]);
  const [selectedRating, setSelectedRating] = useState([]);
  const [selectedEmail, setSelectedEmail] = useState([]);
  const [selectedContact, setSelectedContact] = useState([]);
  const [selectedCategories, setSelectedCategories] = useState([]);

  const [showNote, setShowNote] = useState(false);

  const [quoteModal, setQuoteModal] = useState(false);
  const [assignLoader, setAssignLoader] = useState(false);
  const [Confirm_model, setConfirm_model] = useState(false);
  const [ticketID, setTicketID] = useState("");
  const [ticketStatus, setStatusofTicket] = useState("");
  const [notesInput, setNotesInput] = useState("");
  const [showlogs, setShowLogs] = useState({
    data: [],
    value: false,
  });
  // const [showNotes, setShowNotes] = useState({
  //   data: [],
  //   value: false,
  // });
  const [showNotes, setShowNotes] = useState([]);

  const [checkboxes, setCheckboxes] = useState({ yes: false, no: false });
  function removeBodyCss() {
    document.body.classList.add("no_padding");
  }

  function tog_view() {
    setmodal_view(!modal_view);
    removeBodyCss();
  }

  function tog_rating_view() {
    setRatingModel(!ratingModel);
  }
  function tog_open_view() {
    setModel_open(!model_open);
  }

  const toggleCustom = (tab) => {
    if (customActiveTab !== tab) {
      setcustomActiveTab(tab);
    }
  };

  const PDF_DOWNLOAD_URL = "/ticket/view_ticket_documents";
  const UPDATE_TICKET = "ticket/update_ticket";
  const REASIGN_TICKET = "ticket/reasign";
  const CONFIRM_TICKET = "ticket/confirm_ticket";
  const RATING_TICKET = "ticket/update_rating";
  const ADD_VENDOR = "/vendor/get_vendors";
  const CHANGE_STATUS = "/ticket/update_status";
  const PAY_URL = "/payment/vendor_pay";
  const NOTES = "ticket/add_notes";
  const GET_NOTES = "ticket/get_notes";

  const submitReview = async (e) => {
    e.preventDefault();
    var submited = false;
    try {
      const body = {
        ticketID: props.id,
        customerSatisfaction: checkboxes.yes ? true : false,
        ratings: ratings !== "" ? ratings : 0,
        reviews: review,
      };

      const response = await axios.post(RATING_TICKET, body);

      if (response.data.status === 200) {
        submited = true;
        setReview("");
        setRating("");
        setCheckboxes({ yes: false, no: false });
        props.searchTicket();
        toast("Review Submitted!");
      }
    } catch (error) {
      console.log(error); // TODO proper error
    } finally {
      if (submited) {
        tog_rating_view();
        // window.location.reload();
        return (
          <div class="alert alert-primary" role="alert">
            This is a primary alert—check it out!
          </div>
        );
      }
    }
  };

  const sendNotes = async (ticketId) => {
    if (notesInput.length) {
      try {
        let response;
        if (decode.role === "manager") {
          const payload = {
            user: "manager",
            id: decode.id,
            notes: notesInput,
            ticketId,
            name: decode.firstname,
          };
          response = await axios.post(NOTES, payload);
        } else if (decode.role === "company") {
          const payload = {
            user: "company",
            id: decode.id,
            notes: notesInput,
            ticketId,
            name: decode.firstname,
          };
          response = await axios.post(NOTES, payload);
        } else if (decode.role === "customer") {
          const payload = {
            user: "customer",
            id: decode.id,
            notes: notesInput,
            ticketId,
            name: decode.firstname,
          };
          response = await axios.post(NOTES, payload);
        }
        if (response.status === 200) {
          setNotesInput("");
          getNotes();
        }
      } catch {}
    } else {
      return;
    }
  };

  const getNotes = async () => {
    const payload = {
      id: decode.id,
      user: decode.role,
      ticketId: props.id,
    };
    const response = await axios.post(GET_NOTES, payload);
    if (response.data.status === 200) {
      console.log(response.data.notes, "nptoes");
      setShowNotes(response.data.notes);
    }
  };
  const getVendor = async (e) => {
    try {
      let response;
      console.log("decode: ", decode);
      if (decode.role === "manager") {
        response = await axios.get(ADD_VENDOR + "/" + decode.companyId);
      } else if (decode.role === "company") {
        response = await axios.get(ADD_VENDOR + "/" + decode.id);
      } else response = await axios.get(ADD_VENDOR);

      if (response.data?.success) {
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

  const payVendor = async (ticketID, vendorID) => {
    try {
      console.log(decode.id, ticketID);
      const response = await axios.post(PAY_URL, {
        vendorID: vendorID,
        ticketID: ticketID,
        managerId: decode.id,
      });

      if (response.data.status == 200) {
        window.location.href = response.data.checkout.url;
      }
    } catch (error) {
      console.log(error); // TODO proper error
    }
  };

  function tog_large() {
    setmodal_large(!modal_large);
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

  const submitFunction = async (event) => {
    event.preventDefault();
    var submited = false;
    try {
      const response = await axios.post(UPDATE_TICKET, {
        ticketID: props.id,
        isConfirmationSet: true,
        assignVendor: assignedVendor,
        status: status,
        startDate: startDate,
        endDate: endDate,
        startTime: startTime,
        endTime: endTime,
        notes: notes,
        name: props.name,
        email: props.email,
        property: props.property,
        suite: props.suite,
        companyDomain: props.companyDomain,
      });
      if (response.data.status === 201) {
        submited = true;
      }
    } catch (error) {
      console.log(error); // TODO proper error
    } finally {
      if (submited) {
        tog_view();
        return (
          <div class="alert alert-primary" role="alert">
            This is a primary alert—check it out!
          </div>
        );
      }
    }
  };

  const ResignTicket = async () => {
    try {
      const response = await axios.post(REASIGN_TICKET, {
        ticketID: props.id,
      });

      if (response.data.success) {
        tog_view();
        tog_open_view();
      } else {
        //TODO ERROR HANDLING
      }
    } catch (e) {
      //TODO ERROR HANDLING
    }
  };

  const moveToAllVendor = async (id) => {
    setLoading(true);
    try {
      const response = await axios.post("/ticket/move_to_vendor_portal", {
        ticketID: id,
      });
      if (response.data.sucess) {
        props.getTicket();
      }
      setLoading(false);
      props.getTicket();
    } catch (error) {
      // TODO proper message
      console.log("Unable to fetch");
      setLoading(false);
    }
  };
  const moveToSpecificVendor = async (id, staff_id) => {
    setLoading(true);
    try {
      let response;

      if (moveTo == "specific vendors") {
        response = await axios.post("ticket/move_to_specific_vendor", {
          ticketID: id,
          vendorID: staff_id,
        });
      } else {
        response = await axios.post("ticket/move_to_technicalStaff", {
          ticketID: id,
          assignedStaff: staff_id,
        });
      }

      setLoading(false);
      props.getTicket();
      // console.log(response, "hello00");
      if (response.data.sucess) {
        props.getTicket();
      }
    } catch (error) {
      // TODO proper message
      console.log("Unable to fetch");
      setLoading(false);
    }
  };

  const handleAssign = async (ticketID, vendorID) => {
    try {
      setAssignLoader(true);
      const response = await axios.post("ticket/move_to_specific_vendor", {
        ticketID,
        vendorID,
      });
      if (response.data.success) {
        setAssignLoader(false);
      } else {
        setAssignLoader(false);
      }
    } catch (e) {
      setAssignLoader(false);
      console.log("Error: ", e.message);
    }
  };
  const ChangeStatus = async () => {
    setLoading(true);
    try {
      const response = await axios.post(CHANGE_STATUS, {
        ticketID: ticketID,
        status: ticketStatus,
      });
      setLoading(false);
      if (response.data.success) {
        // props.getTicket();
        props.searchTicket();
        // window.location.reload()
        // tog_rating_view();
        // getWorkingTickets()
      }
    } catch (error) {
      // TODO proper message
      console.log("Unable to fetch");
      setLoading(false);
    }
  };
  // API Call
  const getTechnicalStaff = async (url, data) => {
    try {
      const response = await axios.post(
        `/technicalStaff/get_technical_staff?page=${
          props.currentPage || 1
        }&limit=1000`,
        {
          companyID: decode.companyId,
        }
      );
      if (response.data.technicalStaff) {
        // console.log(response.data);

        const temp = response.data.technicalStaff;
        setTechnicalStaff(temp);
        setOriginalStaff(temp);
      }
    } catch (e) {}
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

  console.log(props.notesCount, "myocoud");

  const getColor = (val) => {
    switch (val) {
      case "Completed":
        return "btn btn-success";
      case "Unresolved":
        return "btn btn-danger";
      case "Inprogress":
        return "btn btn-warning";
      default:
        return "btn btn-primary";
    }
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
  // const showNotes = () => {
  //   setShowNote(!showNote)
  // }
  // contentRef.current.scrollTop = contentRef.current.scrollHeight;

  useEffect(() => {
    // dispatch(onGetInvoices());
    getVendor();
    getTechnicalStaff();
    clear();
  }, []);

  let priority = "warning";
  if (props.priority === "High") {
    priority = "danger";
  } else if (props.priority === "Medium") {
    priority = "warning";
  } else if (props.priority === "Low") {
    priority = "info";
  }

  const Confirm_view = (id, status) => {
    setTicketID(id);
    setStatusofTicket(status);
    setConfirm_model(!Confirm_model);
  };
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
    const printWindow = window.open("", "maintenance_tickets");
    printWindow.document.write(printContent);
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
    <tr key={props._key}>
      <td>{props.number}</td>
      <td>{props.id.substring(props.id.length - 6)}</td>
      <td>
        {props.type}

        <Modal
          size="lg"
          isOpen={modal_view}
          toggle={() => {
            tog_view();
          }}
        >
          <div className="modal-header pb-0">
            <h5 className="modal-title mt-0" id="myLargeModalLabel">
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
              className="nav-tabs-custom nav-justified ViewTicketListDetail"
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
                  <span className="d-none d-sm-block">Ticket Detail</span>
                </NavLink>
              </NavItem>
              {decode.role != "customer" && (
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
                    <span className="d-none d-sm-block">Assign</span>
                  </NavLink>
                </NavItem>
              )}
            </Nav>
            <TabContent activeTab={customActiveTab} className="p-3 text-muted">
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
                          value={props.companyDomain}
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
                          value={props.status}
                          className="form-control"
                          id="formrow-room-input"
                          readOnly
                        />
                      </div>
                    </div>
                    {/* <div className="col-md-4">
                                            <div className="mb-3">
                                                <Label className="form-Label">Priority</Label>
                                                <Input type="text" value={props.priority} className="form-control" id="formrow-room-input" readOnly />
                                            </div>
                                        </div> */}
                    <div className="col-md-4">
                      <div className="mb-3">
                        <Label className="form-Label">Property Name</Label>
                        <Input
                          type="text"
                          value={props.property}
                          className="form-control"
                          id="formrow-room-input"
                          readOnly
                        />
                      </div>
                    </div>
                    <div className="col-md-4">
                      <div className="mb-3">
                        <Label className="form-Label">Suite</Label>
                        <Input
                          type="text"
                          value={props.suite}
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
                          value={props.requestType}
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
                          value={props.phone}
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
                          value={props.email}
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
                          value={props.name}
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
                          Permission for Entering
                        </Label>
                        <Input
                          type="text"
                          value={props.permission}
                          className="form-control"
                          id="formrow-room-input"
                          readOnly
                        />
                      </div>
                    </div>
                    {props.building && (
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
                            value={props.building}
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
                              initialValue={props.rating}
                              readonly={true}
                              size={20}
                            />
                          </td>
                        </div>
                      </div>
                    </div>

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
                          placeholder={props.details}
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
                          placeholder={props?.ticket?.reviews}
                        ></textarea>
                      </div>
                    </div>
                  </div>
                </Form>
              </TabPane>
              <TabPane tabId="2">
                <div className="row">
                  <div
                    className={`${
                      assignedRole === "vendor" ? "col-md-4" : "col-md-12"
                    }`}
                  >
                    <div className="mb-4">
                      <Label className="form-Label">Assigned To</Label>
                      <Input
                        type="text"
                        value={
                          assignedVendor
                            ? assignedVendor + " ( " + assignedRole + " ) "
                            : ""
                        }
                        onChange={(e) => {
                          setAssignedVendor(e.target.value);
                        }}
                        className="form-control"
                        id="formrow-room-input"
                        readOnly={true}
                      />
                    </div>
                  </div>
                  {assignedRole === "vendor" && (
                    <div className="col-md-4">
                      <div className="mb-3">
                        <Label className="form-Label">Estimated Amount</Label>
                        <Input
                          type="text"
                          value={currencyFormat(Number(props.estimatedAmount))}
                          className="form-control"
                          id="formrow-room-input"
                          readOnly={true}
                        />
                      </div>
                    </div>
                  )}
                  <div
                    className={`${
                      assignedRole === "vendor" ? "col-md-4" : "col-md-3"
                    }`}
                  >
                    <div className="mb-3">
                      <Label className="form-Label">Status</Label>
                      <select
                        value={status}
                        onChange={(e) => {
                          setStatus(e.target.value);
                        }}
                        className="form-select"
                        disabled={true}
                      >
                        <option value={"Select"}>Select</option>
                        <option value={"Open"}>Open</option>
                        <option value={"Inprogress"}>Inprogress</option>
                        <option value={"Completed"}>Completed</option>
                        <option value={"Unresolved"}>Unresolved</option>
                      </select>
                      {/* <Input type="text" value={status} onChange={(e) => { setStatus(e.target.value) }} className="form-control" id="formrow-room-input" readOnly={ true } /> */}
                    </div>
                  </div>
                  <div
                    className={`${
                      assignedRole === "vendor" ? "col-md-6" : "col-md-3"
                    }`}
                  >
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
                        defaultValue="2019-08-19"
                        id="example-date-input"
                        readOnly={true}
                      />
                    </div>
                  </div>
                  <div className="col-md-6">
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
                          // console.log(e.target.value);
                        }}
                        type="time"
                        defaultValue="13:45:00"
                        id="example-time-input"
                        readOnly={true}
                      />
                    </div>
                  </div>
                  <div className="col-md-6">
                    <div className="mb-3">
                      <Label
                        htmlFor="example-date-input"
                        className="form-Label"
                      >
                        Completion Date
                      </Label>
                      <Input
                        className="form-control"
                        type="date"
                        value={endDate}
                        onChange={(e) => {
                          setEndDate(e.target.value);
                        }}
                        defaultValue="2019-08-19"
                        id="example-date-input"
                        readOnly={true}
                      />
                    </div>
                  </div>
                  <div className="col-md-6">
                    <div className="mb-3">
                      <Label
                        htmlFor="example-time-input"
                        className="form-Label"
                      >
                        Completion Time
                      </Label>
                      <Input
                        className="form-control"
                        type="time"
                        value={endTime}
                        onChange={(e) => {
                          setEndTime(e.target.value);
                        }}
                        defaultValue="13:45:00"
                        id="example-time-input"
                        readOnly={true}
                      />
                    </div>
                  </div>
                  <div className="col-md-12">
                    <div className="mb-3">
                      <Label className="form-Label">Notes</Label>
                      <textarea
                        id="basicpill-address-input"
                        className="form-control"
                        rows="3"
                        value={notes}
                        onChange={(e) => {
                          setNotes(e.target.value);
                        }}
                        readOnly={true}
                        placeholder=""
                      ></textarea>
                    </div>
                  </div>

                  {
                    props.role == "manager" && props.status != "Completed" && (
                      <div className="col-md-12 d-flex flex-wrap align-items-center justify-content-center">
                        <button
                          className="btn btn-primary mo-mb-2 mr-10"
                          onClick={(e) => {
                            ResignTicket(e);
                            // tog_view()
                          }}
                        >
                          Reassign
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
                    )
                    // :
                    // props.isConfirmationSet &&
                    // <div className="col-md-12 d-flex flex-wrap align-items-center justify-content-center">
                    //     <button className="btn btn-primary mo-mb-2 mr-10"
                    //         onClick={(e) => {
                    //             confirmTicket(e)
                    //             tog_view()
                    //         }}
                    //     >Confirm</button>
                    //     <button className='btn btn-light' onClick={(e) => { tog_view() }}>cancel</button>

                    // </div>
                  }
                </div>
              </TabPane>
              <div className="d-flex justify-content-end">
                <div className="mb-3">
                  <button
                    className="btn btn-primary"
                    onClick={() => handlePrint(props?.ticket)}
                  >
                    Print
                  </button>
                </div>
              </div>
            </TabContent>
          </div>
        </Modal>

        <Modal
          isOpen={Confirm_model}
          toggle={() => {
            Confirm_view();
          }}
          aria-labelledby="contained-modal-title-vcenter"
          centered
        >
          <ModalHeader
            toggle={() => {
              Confirm_view();
            }}
          >
            <h3> Change Status!</h3>
          </ModalHeader>
          {/* <div className="modal-header"> */}
          <button
            onClick={() => {
              Confirm_view();
              // setmodal_large2(false)
            }}
            type="button"
            className="close"
            data-dismiss="modal"
            aria-label="Close"
          >
            <span aria-hidden="true">&times;</span>
          </button>
          {/* </div> */}
          <ModalBody>
            <div className="modal-body">
              {/* <h3>Are You Sure !</h3> */}
              <h5>Are You Sure?</h5>
            </div>
          </ModalBody>
          <ModalFooter>
            <button
              onClick={() => {
                console.log("confirm ");
                ChangeStatus();
                Confirm_view();
              }}
              className="btn btn-primary mr-10"
              type="button"
            >
              <span aria-hidden="true">Yes</span>
            </button>
            <button
              onClick={() => {
                Confirm_view();
                // setmodal_large2(false)
              }}
              className="btn btn-light"
              type="button"
            >
              <span aria-hidden="true">No</span>
            </button>
          </ModalFooter>
        </Modal>

        <Modal
          size="md"
          isOpen={ratingModel}
          toggle={() => {
            tog_rating_view();
          }}
        >
          <div className="modal-header">
            <h5 className="modal-title mt-0" id="myLargeModalLabel">
              Ratings And Reviews
            </h5>
            <button
              onClick={() => {
                tog_rating_view();
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
          <div className=" modal-body">
            <div className="col-md-12">
              <div className="mb-3">
                <Label className="form-Label">
                  Was the issue resolved to your satisfaction?
                </Label>
                <br />
                <div className="d-flex gap-3">
                  <div class="form-check form-check-inline">
                    <input
                      class="form-check-input"
                      type="radio"
                      name="inlineRadioOptions"
                      id="inlineRadio1"
                      value={checkboxes.yes}
                      onChange={(e) => {
                        setCheckboxes((prev) => ({
                          ...prev,
                          no: !e.target.checked,
                          yes: e.target.checked,
                        }));
                      }}
                    />
                    <label class="form-check-label" for="inlineRadio1">
                      Yes
                    </label>
                  </div>

                  <div class="form-check form-check-inline">
                    <input
                      class="form-check-input"
                      type="radio"
                      name="inlineRadioOptions"
                      id="inlineRadio2"
                      value={checkboxes.no}
                      onChange={(e) => {
                        setCheckboxes((prev) => ({
                          ...prev,
                          yes: !e.target.checked,
                          no: e.target.checked,
                        }));
                      }}
                    />
                    <label class="form-check-label" for="inlineRadio2">
                      No
                    </label>
                  </div>
                </div>
              </div>
            </div>
            {checkboxes.yes && (
              <div className="col-md-12">
                <div className="mb-3">
                  <Label className="form-Label">Ratings</Label>
                  <br />
                  <Rating
                    onClick={(rate) => {
                      setRating(rate);
                    }}
                  />
                </div>
              </div>
            )}
            <div className="col-md-12">
              <div className="mb-3">
                <Label className="form-Label">Reviews</Label>
                <textarea
                  id="basicpill-address-input text-capitalize"
                  className="form-control"
                  rows="3"
                  value={review}
                  onChange={(e) => {
                    setReview(e.target.value);
                  }}
                  placeholder=""
                ></textarea>
              </div>
            </div>
            <br />

            <div className="col-md-12 d-flex flex-wrap align-items-center justify-content-center">
              <button
                className="btn btn-primary mo-mb-2 mr-10"
                onClick={(e) => {
                  submitReview(e);
                  tog_rating_view();
                }}
              >
                Submit
              </button>
              <button
                className="btn btn-light"
                onClick={(e) => {
                  tog_rating_view();
                }}
              >
                Cancel
              </button>
              <br />
            </div>
          </div>
        </Modal>
      </td>
      {decode.role !== "customer" ? (
        <>
          {/* <td>{props.property}</td> */}
          <td>{props.propertySignature}</td>
          <td>
            {props.name}
            {/* <br></br> */}
            {/* {props.email} */}
            {/* <br></br> */}
            {/* {props.suite} */}
          </td>
        </>
      ) : (
        <td>{props.suite}</td>
      )}
      <td style={{ minWidth: "max-content" }}>
        {moment(props.createdAt).format("DD-MM-YY")}
      </td>
      <td style={{ minWidth: "max-content" }}>
        {customHumanize(props.createdAt)}
      </td>
      <td>{props.permission}</td>
      {decode.role !== "customer" ? (
        <>
          <td>
            <select
              className={`form-select applicant-status btn-sm ${getColor(
                props?.status
              )}`}
              style={{ width: "120px" }}
              value={props.status}
              onChange={(event) => {
                Confirm_view(props.id, event.target.value);
              }}
            >
              <option className="btn btn-light" value={"Open"}>
                Open
              </option>
              <option className="btn btn-light" value={"Inprogress"}>
                Inprogress
              </option>
              <option className="btn btn-light " value="Completed">
                Completed
              </option>
              <option className="btn btn-light " value="Unresolved">
                Unresolved
              </option>
            </select>
          </td>
        </>
      ) : (
        <td className="text-capitalize text-center">
          <button
            className={`btn ${
              props.status === "Completed"
                ? "btn-success"
                : props.status === "Inprogress"
                ? "btn-warning"
                : props.status === "Unresolved"
                ? "btn-danger"
                : "btn-primary"
            }`}
          >
            {props.status}
          </button>
        </td>
      )}
      <td>
        <div>
          {console.log("Documents:", typeof props?.documents)}
          {props?.documents?.length > 0 &&
          props?.documents[0]?.includes(BUCKET_URL) ? (
            <button
              onClick={async () => {
                props.documents.map((file) => {
                  window.location.href = file;
                });
              }}
              type="button"
              className="btn btn-soft-light btn-sm w-xs waves-effect "
            >
              <i className="bx bx-download label-icon"></i>
            </button>
          ) : props?.documents?.length > 0 &&
            !props?.documents[0]?.includes(BUCKET_URL) ? (
            <button
              onClick={async () => {
                const response = await axios.post(PDF_DOWNLOAD_URL, {
                  id: props.id,
                });

                for (let i = 0; i < response.data.documents.length; i++) {
                  const url = `${SERVER_URL}${response.data.documents[i]}`;
                  const filePath = response.data.documents[i];
                  const extension = filePath.substring(
                    filePath.lastIndexOf(".") + 1
                  );
                  console.log(extension);
                  console.log(url);
                  fetch(url, {
                    method: "GET",
                    headers: {},
                  })
                    .then((response) => {
                      response.arrayBuffer().then(function (buffer) {
                        const url = window.URL.createObjectURL(
                          new Blob([buffer])
                        );
                        const link = document.createElement("a");
                        link.href = url;
                        link.setAttribute("download", `ticket.${extension}`); //or any other extension
                        document.body.appendChild(link);
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
      {decode.role !== "customer" && (
        <td>
          <button
            className="btn btn-primary btn-sm"
            onClick={() => {
              tog_view();
            }}
          >
            view
          </button>
        </td>
      )}

      {decode.role == "customer" ? (
        props.internalStatus == "Completed" ? (
          <td>
            <button
              className="btn btn-primary btn-sm"
              onClick={() => {
                tog_rating_view();
              }}
            >
              Review
            </button>
          </td>
        ) : (
          <td>
            <button
              className="btn btn-primary btn-sm"
              onClick={() => {
                tog_view();
              }}
            >
              View
            </button>
          </td>
        )
      ) : decode.role === "manager" && !props.isMovedToVendorPortal ? (
        <td>
          <button
            className="btn btn-danger btn-sm"
            onClick={() => {
              tog_open_view();
            }}
          >
            Assign
          </button>
        </td>
      ) : (
        decode.role !== "company" && (
          <td>
            <button className="btn btn-success btn-sm">Assigned</button>
          </td>
        )
      )}

      <Modal
        size="lg"
        isOpen={quoteModal}
        toggle={() => {
          setQuoteModal(!quoteModal);
        }}
      >
        <div className="modal-header">
          <h5 className="modal-title mt-0" id="myLargeModalLabel">
            Quotes
          </h5>
          <button
            onClick={() => {
              setQuoteModal(!quoteModal);
            }}
            type="button"
            className="close"
            data-dismiss="modal"
            aria-label="Close"
          >
            <span aria-hidden="true">&times;</span>
          </button>
        </div>
        <div className="modal-body" style={{ overflowX: "scroll" }}>
          <Table className="table-striped table-bordered mb-0">
            <thead>
              <tr>
                <th scope="col">#</th>
                <th scope="col">Vendor Id</th>
                <th scope="col">Name</th>
                <th scope="col">Agency Name</th>
                <th scope="col">Estimated Amount</th>
                <th scope="col">Start Date & Time</th>
                <th scope="col">End Date & Time</th>
                <th scope="col">Notes</th>
                <th scope="col">Action</th>

                {/* <th scope="col">Attachment</th> */}
              </tr>
            </thead>
            {props?.quotedVendorTickets.map((item, i) => {
              return (
                <tbody>
                  <tr>
                    <td>{i + 1}</td>
                    <td>{item?.vendorID?.primaryID}</td>
                    <td>{`${item?.vendorID?.first_name} ${item?.vendorID?.last_name}`}</td>
                    <td>{item?.vendorID?.agency_name}</td>
                    <td>{item?.estimatedAmount}</td>
                    <td>{`${moment(item?.startDate).format("L")} ${
                      item.startTime
                    }`}</td>
                    <td>{`${moment(item?.estimatedEndDate).format("L")} ${
                      item.estimatedETime
                    }`}</td>
                    <td>{item?.notes}</td>
                    <td>
                      {" "}
                      <button
                        className="btn btn-outline-primary"
                        disabled={
                          props?.ticket?.assignSpecificVendors?.length > 0
                            ? true
                            : false
                        }
                        onClick={() => {
                          handleAssign(item?.ticketID, item?.vendorID?._id);
                        }}
                      >
                        Assign
                      </button>
                    </td>
                  </tr>
                </tbody>
              );
            })}
          </Table>
        </div>
      </Modal>
      <Modal
        size="lg"
        isOpen={model_open}
        toggle={() => {
          tog_open_view();
        }}
      >
        <div className="modal-header">
          <h5 className="modal-title mt-0" id="myLargeModalLabel">
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
            <div style={{ marginRight: "15px" }} class="form-check">
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
              <label class="form-check-label" for="flexRadioDefault1">
                Assign to All Vendors
              </label>
            </div>
            <div style={{ marginRight: "10px" }} class="form-check">
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
              <label class="form-check-label" for="flexRadioDefault2">
                Assign to Specified Vendors
              </label>
            </div>

            <div style={{ marginRight: "10px" }} class="form-check">
              <input
                class="form-check-input"
                type="radio"
                name="flexRadioDefault"
                id="flexRadioDefault3"
                checked={moveTo == "specific technical staff"}
                onClick={() => {
                  setMoveTo("specific technical staff");
                }}
              />
              <label class="form-check-label" for="flexRadioDefault3">
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
                            <Label className="form-Label">Names</Label>
                            <Select
                              isMulti
                              onChange={(selectedOption) => {
                                const names = [];
                                selectedOption.map((property) => {
                                  names.push(property.value);
                                });
                                setSelectedName(names);
                              }}
                              value={selectedName.map((item) => {
                                return { label: item, value: item };
                              })}
                              options={vendor.map((item) => {
                                return {
                                  label: item.first_name,
                                  value: item.first_name,
                                };
                              })}
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
                            <Label className="form-Label">Category</Label>
                            <Select
                              isMulti
                              value={selectedCategories.map((item) => {
                                return { label: item, value: item };
                              })}
                              onChange={(selectedOption) => {
                                const category = [];
                                selectedOption.map((property) => {
                                  category.push(property.value);
                                });
                                setSelectedCategories(category);
                              }}
                              options={specialties.map((item) => {
                                return {
                                  label: item,
                                  value: item,
                                };
                              })}
                              className="basic-multi-select"
                              classNamePrefix="select"
                            />
                          </div>
                        </div>

                        <div className="col-md-4">
                          <div className="mb-3">
                            <Label className="form-Label">Contact No</Label>
                            <Select
                              isMulti
                              value={selectedContact.map((item) => {
                                return { label: item, value: item };
                              })}
                              onChange={(selectedOption) => {
                                const contact_no = [];
                                selectedOption.map((property) => {
                                  contact_no.push(property.value);
                                });
                                setSelectedContact(contact_no);
                              }}
                              options={vendor.map((item) => {
                                return {
                                  label: item.contact_no,
                                  value: item.contact_no,
                                };
                              })}
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
                            style={{ marginLeft: "15px" }}
                            class="form-check"
                          >
                            <input
                              class="form-check-input"
                              type="radio"
                              name="flexTableRadioDefault"
                              onClick={() => {
                                setTableCheck(true);
                                setTableContent(item._id);
                              }}
                            />
                          </div>
                          <td>{i + 1}</td>
                          <td>
                            {item.specialties.length > 0
                              ? item.specialties.map((a) => a.specialty).join()
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
                          <Label className="form-Label">Name</Label>
                          <Select
                            isMulti
                            onChange={(selectedOption) => {
                              const names = [];
                              selectedOption.map((property) => {
                                names.push(property.value);
                              });
                              setSelectedName(names);
                            }}
                            value={selectedName.map((item) => {
                              return { label: item, value: item };
                            })}
                            options={originalStaff.map((item) => {
                              return {
                                label: item.first_name,
                                value: item.first_name,
                              };
                            })}
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
                          <Label className="form-Label">Email</Label>
                          <Select
                            isMulti
                            value={selectedEmail.map((item) => {
                              return { label: item, value: item };
                            })}
                            onChange={(selectedOption) => {
                              const emails = [];
                              selectedOption.map((property) => {
                                emails.push(property.value);
                              });
                              setSelectedEmail(emails);
                            }}
                            options={originalStaff.map((item) => {
                              return {
                                label: item.email,
                                value: item.email,
                              };
                            })}
                            className="basic-multi-select"
                            classNamePrefix="select"
                          />
                        </div>
                      </div>

                      <div className="col-md-4">
                        <div className="mb-3">
                          <Label className="form-Label">Contact No</Label>
                          <Select
                            isMulti
                            value={selectedContact.map((item) => {
                              return { label: item, value: item };
                            })}
                            onChange={(selectedOption) => {
                              const contact_no = [];
                              selectedOption.map((property) => {
                                contact_no.push(property.value);
                              });
                              setSelectedContact(contact_no);
                            }}
                            options={originalStaff.map((item) => {
                              return {
                                label: item.contact_no,
                                value: item.contact_no,
                              };
                            })}
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
                        <div style={{ marginLeft: "15px" }} class="form-check">
                          <input
                            class="form-check-input"
                            type="radio"
                            name="flexTableRadioDefault"
                            onClick={() => {
                              setTableCheck(true);
                              setTableContent(item._id);
                            }}
                          />
                        </div>
                        <td>{i + 1}</td>
                        <td>
                          {item.specialties.length > 0
                            ? item.specialties.map((a) => a.speciality).join()
                            : "No Category found"}
                        </td>
                        {/* <td>18</td> */}
                        <td>{item.first_name}</td>
                        <td>{item.email}</td>
                        <td>{item.contact_no}</td>
                        <td>
                          <Rating
                            ratingValue={item.rating * 20}
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
                moveToSpecificVendor(props.id, tableContent);
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
                  moveToAllVendor(props.id);
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
                    </Link>
                    <Link className="text-danger" to="#">
                        <i
                            className="mdi mdi-delete font-size-18"
                            id="deletetooltip"
                            onClick={() => {
                                // setmodal_large(false)
                            }}
                        ></i>
                    </Link> */}

      {decode.role == "company" && props.isMovedToVendorPortal ? (
        <td>
          <div className="d-flex align-items-center">
            <button
              className="btn btn-success btn-sm"
              // onClick={() => {
              //   tog_open_view();
              // }}
            >
              Assigned
            </button>
          </div>
        </td>
      ) : (
        decode.role == "company" && (
          <td>
            <button
              className="btn btn-danger btn-sm"
              onClick={() => {
                tog_open_view();
              }}
            >
              Assign
            </button>
          </td>
        )
      )}
      {decode.role !== "customer" && (
        <td>
          <button
            className="btn btn-outline-info btn-sm"
            onClick={(e) => {
              setShowLogs((prev) => ({
                ...prev,
                data: props?.ticket?.history,
                value: true,
              }));
            }}
          >
            View Log
          </button>
        </td>
      )}
      <td>
        <div style={{ position: "relative" }}>
          {props.notesCount[props.id] ? (
            <Badge
              style={{
                background: "#fd625e",
                position: "absolute",
                right: 0,
                top: "-7px",
              }}
            >
              {props.notesCount[props.id]}
            </Badge>
          ) : (
            ""
          )}
          <button
            className="btn btn-outline-primary btn-sm"
            // onClick={(e) => {
            //   setShowLogs((prev) => ({
            //     ...prev,
            //     data: props?.ticket?.history,
            //     value: true,
            //   }));
            // }}
            onClick={openModal}
          >
            View Memo
          </button>
        </div>
      </td>

      <Modal
        size="lg"
        isOpen={showlogs?.value}
        toggle={() => {
          setShowLogs((prev) => ({ ...prev, data: [], value: false }));
        }}
      >
        <div className="modal-header">
          <h5 className="modal-title mt-0" id="myLargeModalLabel">
            History Log
          </h5>
          <button
            onClick={() => {
              setShowLogs((prev) => ({ ...prev, data: [], value: false }));
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
                      i + 1 !== showlogs?.data?.length ? "line h-100" : ""
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
      {/* modal for notes */}
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
          <h5 className="modal-title mt-0" id="myLargeModalLabel">
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
                  <div key={log?._id} className="chatBox mb-2 pt-1">
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
              onClick={() => sendNotes(props.id)}
              className="btn btn-primary btn-m ml-15"
            >
              Send
            </button>
          </div>
        </div>
      </Modal>

      <Modal size="lg" isOpen={showNote} toggle={() => setShowNote(!showNotes)}>
        <div className="modal-header">
          <h5 className="modal-title mt-0" id="myLargeModalLabel">
            Notes
          </h5>
          <button
            onClick={() => setShowNote(!showNote)}
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
                      i + 1 !== showlogs?.data?.length ? "line h-100" : ""
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
    </tr>
  );
}
