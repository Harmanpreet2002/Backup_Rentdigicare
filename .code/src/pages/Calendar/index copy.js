import React, { useEffect, useState } from "react";
import MetaTags from "react-meta-tags";
import PropTypes from "prop-types";
import { isEmpty } from "lodash";
import Select from "react-select";
import { CopyToClipboard } from "react-copy-to-clipboard";
import {
  Button,
  Card,
  CardBody,
  Col,
  Container,
  Modal,
  ModalBody,
  ModalHeader,
  Row,
  Label,
  Form,
  Nav,
  NavItem,
  NavLink,
  TabContent,
  TabPane,
  Input,
  Alert,
} from "reactstrap";
import { toast } from "react-toastify";
import classnames from "classnames";

import { AvField, AvForm } from "availity-reactstrap-validation";

import FullCalendar from "@fullcalendar/react";

import dayGridPlugin from "@fullcalendar/daygrid";
import timeGridPlugin from "@fullcalendar/timegrid";
import interactionPlugin from "@fullcalendar/interaction";
import multiMonthPlugin from "@fullcalendar/multimonth";
import BootstrapTheme from "@fullcalendar/bootstrap";
import "bootstrap/dist/css/bootstrap.css";

//import images
import calendar from "../../assets/images/undraw-calendar.svg";

//moment
import moment from "moment";

//Import Breadcrumb
import Breadcrumbs from "../../components/Common/Breadcrumb";

import {
  addNewEvent as onAddNewEvent,
  deleteEvent as onDeleteEvent,
  getCategories as onGetCategories,
  getEvents as onGetEvents,
  updateEvent as onUpdateEvent,
} from "../../store/actions";

import DeleteModal from "./DeleteModal";

//css
import "../../assets/css/rentdigicare.css";

//redux
import { useSelector, useDispatch } from "react-redux";

import { SERVER_URL } from "../ServerLink";
import jwt_decode from "jwt-decode";
import axios from "../api/axios";
import { useHistory } from "react-router-dom";
import { useRef } from "react";
import { saveAs } from "file-saver";
import XlsxPopulate from "xlsx-populate";
import { colorArray } from "../../helpers/helper";
import BookAppointmentModal from "./BookAppointmentModal";

const Calender = (props) => {
  const dispatch = useDispatch();
  const calendarRef = useRef();
  const [selectedEndDate, setSelectedEndDate] = useState("");
  const [selectedStartDate, setSelectedStartDate] = useState("");
  const decode = jwt_decode(window.localStorage.getItem("accessToken"));

  const GET_TICKETS = "/calender/";
  const GET_AVAILABILITY = "/calender/get-availability";
  const ADD_EVENT = "/calender/add-event";
  const GET_MANAGERS = "/company/get_managers";
  const GET_MANAGERS_SLOTS =
    "/user_appointment/get-company-projectmanager-slot";
  const GET_TECHNICAL_STAFF = "/technicalStaff/get_technical_staff";
  const GET_PROPERTIES_COMPANY = "/property/getAllCompanyProperties";
  const GET_PROPERTIES_MANAGER = "/property/getManagerProperties";
  const GET_MANAGERS_OF_PROPERTIES = "/property/getManagersOfProperties";
  const GET_EVENTS_OF_DATE = "/calender/get-todays-event";

  const GET_VENDORS = "/vendor/get_vendors/" + decode.id;
  const DELETE_EVENT = "/calender/delete-event";
  const GET_CUSTOMER_TICKETS = "/calender/customer_tickets";
  const GET_CUSTOMER_Properties = "/ticket/getdata";
  const [monthViews, setMonthViews] = useState({
    year: { type: "multiMonthYear" },
    week: {
      type: "timeGridWeek",
      // duration: { days: 7 }
    },
  });
  const [initialView, setInitialView] = useState("dayGridMonth");
  const [newData, setNewData] = useState([]);
  const [reasonTypes, setReasonTypes] = useState([]);
  const [selectedReasonTypes, setSelectedReasonTypes] = useState([]);
  const [selectedProperty, setSelectedProperty] = useState([]);
  const [properties, setProperties] = useState([]);
  const [slotsAvailability, setSlotsAvailability] = useState(false);
  const history = useHistory();

  let addMoment;
  let splitedTime = [];
  let newSlot = false;

  const { categories } = useSelector((state) => ({
    events: state.calendar.events,
    categories: state.calendar.categories,
  }));
  const [modal, setModal] = useState(false);
  const [deleteModal, setDeleteModal] = useState(false);
  const [modalcategory, setModalcategory] = useState(false);
  const [copied, setcopied] = useState(false);
  const [totalEvents, setTotalEvents] = useState([]);

  const [events, setEvents] = useState([]);

  const [event, setEvent] = useState({});
  const [selectedDay, setSelectedDay] = useState(0);
  const [isEdit, setIsEdit] = useState(false);
  const [daysAvailability, setDayAvailability] = useState([]);
  const [splitTimes, setSplitTimes] = useState([]);
  const [day, setDay] = useState("");

  const [companyManagers, setCompanyManagers] = useState([]);
  const [managerData, setmanagerData] = useState({});
  const [comapnyTechnicalStaff, setComapnyTechnicalStaff] = useState([]);
  const [comapnyVendors, setComapnyVendors] = useState([]);
  const [companyProperties, setCompanyProperties] = useState([]);
  const [customerProperty, setCustomerProperty] = useState([]);
  const [selectedManagerID, setSelectedManagerID] = useState("");
  const [selectedManagerID1, setSelectedManagerID1] = useState("");
  const [selectedDate, setSelectedDate] = useState("");

  const [managerError, setManagerError] = useState("");
  const [managerProperties, setManagerProperties] = useState([]);
  const [managersOfProperty, setManagersOfProperty] = useState([]);

  const [selectedManager, setSelectedManager] = useState("");
  const [selectedPropertyId, setSelectedPropertyId] = useState("");
  const [selectedPropertyName, setSelectedPropertyName] = useState("");
  const [selectedEventId, setSelectedEventId] = useState("");
  const [daysOfWeek, setDaysOfWeek] = useState([0, 1, 2, 3, 4, 5, 6]);

  const [addEventError, setAddEventError] = useState("");

  const [modal_view, setmodal_view] = useState(false);
  const [customActiveTab, setcustomActiveTab] = useState("1");
  const [selectedTicket, setSelectedTicket] = useState({});
  const [totalTickets, setTotalTickets] = useState([]);

  const [assignedVendor, setAssignedVendor] = useState(decode.firstname);
  const [status, setStatus] = useState(props.status ? props.status : "select");
  const [startDate, setStartDate] = useState(
    props.confirmedQuote
      ? props.confirmedQuote.startDate.split("T")[0]
      : Date.now()
  );
  const [startTime, setStartTime] = useState(
    props.confirmedQuote ? props.confirmedQuote.startTime : ""
  );
  const [endDate, setEndDate] = useState(
    props.confirmedQuote
      ? props.confirmedQuote.estimatedEndDate.split("T")[0]
      : Date.now()
  );
  const [endTime, setEndTime] = useState(
    props.confirmedQuote ? props.confirmedQuote.estimatedETime : ""
  );
  const [notes, setNotes] = useState(
    props.confirmedQuote ? props.confirmedQuote.notes : ""
  );
  const [url, setUrl] = useState("");
  const [confirm_Modal, setConfirm_Modal] = useState(false);
  const [appointmentModal, setAppoinmentModal] = useState(false);
  const [loading, setLoading] = useState(false);
  const [idToCancel, setIdToCancel] = useState("");
  const [reason, setReason] = useState("");
  const [reason_err, setReasonErr] = useState("");
  const [calendarId, setCalendarId] = useState("");
  const [defaultDate, setDefaultDate] = useState("");
  const tog_view = () => {
    setmodal_view(!modal_view);
  };

  const toggleCustom = (tab) => {
    if (customActiveTab !== tab) {
      setcustomActiveTab(tab);
    }
  };
  function confirm_view() {
    setConfirm_Modal(!confirm_Modal);
  }
  // function bookAppoinment_view(e) {
  //   const today = new Date();
  //   const isDefaultDateValid = e.date > today;

  //   if (isDefaultDateValid) {
  //     setAppoinmentModal(!appointmentModal);
  //   }
  // }
  function bookAppoinment_view(e) {
    const isDefaultDateValid = e.date > new Date();

    if (isDefaultDateValid) {
      const selectedDay = e.date.toLocaleDateString("en-US", {
        weekday: "short",
      });

      // Find the object in daysAvailability corresponding to the selected day
      const selectedDayAvailability = daysAvailability.find(
        (dayObj) => dayObj.day === selectedDay && dayObj.available === true
      );

      if (selectedDayAvailability) {
        setAppoinmentModal(!appointmentModal);
      } else {
        // Handle the case when the selected day is not available
        // You can show a message or take any other action here
      }
    }
  }
  const getCustomerTickets = async () => {
    const response = await axios.post(GET_CUSTOMER_TICKETS, {
      customer_id: decode.id,
    });
    if (response.data.status === 200) {
      setTotalTickets(response?.data?.ticketList);
      let ticketEvent = response?.data?.ticketList.map((ticket) => {
        return {
          id: ticket?._id,
          start: new Date(ticket?.createdAt),
          end: new Date(ticket?.createdAt),
          className: "bg-soft-success text-success",
          type: "tickets",
        };
      });
      //   console.log(ticketEvent)
      setEvents(ticketEvent);
      setTotalEvents(ticketEvent);
    }
  };
  const getCustomerProperties = async () => {
    const response = await axios.post(GET_CUSTOMER_Properties, {
      propertyID: decode.properties,
    });
    if (response.data.status == 200) {
      setCustomerProperty(response?.data?.property);
    }
  };

  const getTickets = async (id, propertyId, type) => {
    const avail = await axios.get(
      SERVER_URL +
        `/calender/get-availability/?manager_id=${id ? id : decode.id}`
    );
    const checkAvail =
      avail?.data.ManagerAvailability !== null &&
      avail.data.ManagerAvailability.daysOfWeekAvailability;
    if (
      avail?.data.ManagerAvailability != null &&
      checkAvail.some((a) => a.available === true)
    ) {
      setSlotsAvailability(true);
    } else {
      setSlotsAvailability(false);
    }
    const response = await axios.post(GET_TICKETS, {
      manager_id: id ? id : decode.id,
      role: type ? type : decode.role,
      propertyID: propertyId,
    });
    const res = await axios.get(
      SERVER_URL +
        `/user_appointment/get-booked-slot/?manager_id=${
          id ? id : decode.id
        }&reasonType=${
          selectedReasonTypes.value ? selectedReasonTypes.value : ""
        }&propertyId=${selectedProperty.value || ""}`
    );
    if (response.data.status === 200) {
      // setTotalTickets(response?.data?.ticketList);
      // const ticketFilter = response?.data?.ticketList
      //   ?.filter((v) => v.propertyID === selectedProperty.value)
      //   .filter((v) => v.reasonType === selectedReasonTypes.value);
      // let ticketEvent = ticketFilter.map((ticket) => {
      //   // const date = new Date(ticket.createdAt)
      //   // const day = date.getDate();
      //   // const month = date.getMonth();
      //   // const year = date.getFullYear();

      //   // const currentHour = date.getHours();
      //   // const currentMin = date.getMinutes();
      //   // const currentSec = date.getSeconds();

      //   // console.log(day, month, year, currentHour, currentMin, currentSec)
      //   return {
      //     id: ticket?._id,
      //     start: new Date(ticket?.createdAt),
      //     end: new Date(ticket?.createdAt),
      //     className: "bg-soft-success text-success",
      //     type: "tickets",
      //   };
      // });
      // console.log(res.data.bookedSlot,'mylogg');
      let eventArray = res?.data?.bookedSlot.map((evt) => {
        let splitDate = evt?.date.split("-");
        let startTime = moment(evt?.startTime, ["h:mm A"])
          .format("HH:mm")
          .split(":");
        let endTime = moment(evt?.endTime, ["h:mm A"])
          .format("HH:mm")
          .split(":");

        // console.log(splitDate[0], splitDate[1] - 1, splitDate[2], startTime[0], startTime[1], 0, 0)

        return {
          id: evt._id,
          start: new Date(
            splitDate[0],
            splitDate[1] - 1,
            splitDate[2].split("T")[0],
            startTime[0],
            startTime[1],
            0,
            0
          ),
          end: new Date(
            splitDate[0],
            splitDate[1] - 1,
            splitDate[2].split("T")[0],
            endTime[0],
            endTime[1],
            0,
            0
          ),
          className:
            evt.status == "booked"
              ? "bg-soft-success text-success border border-success rounded"
              : "bg-soft-warning text-warning border border-warning rounded",
          name: evt.name,
          phone: evt.phone,
          phone1: evt.phone1 ? evt.phone1 : "",
          email: evt.email,
          eventDate: evt.date,
          slot: `${evt.startTime} - ${evt.endTime}`,
          description: evt.description,
          status: evt.status,
          reasonType:
            evt.reasonType?.length > 0 ? evt.reasonType[0].reasonType : "",
          layoutType: evt.layout?.length > 0 ? evt.layout[0].layoutName : "",
          property: evt.property?.length > 0 ? evt.property[0].title : "",
        };
      });
      const reasonTypes =
        res?.data?.reasonTypes?.length > 0
          ? res?.data?.reasonTypes?.map((evt) => ({
              label: evt.reasonType,
              value: evt._id,
            }))
          : [];
      setReasonTypes(reasonTypes);
      const properties =
        res?.data?.properties?.length > 0
          ? res?.data?.properties?.map((evt) => ({
              label: evt.property,
              value: evt._id,
            }))
          : [];
      setProperties(properties);
      // let totalEvents = [...ticketEvent, ...eventArray];
      let totalEvents = [...eventArray];
      setEvents(totalEvents);
      setTotalEvents(totalEvents);
    }
  };
  useEffect(() => {
    dispatch(onGetCategories());
    // dispatch(onGetEvents());

    if (["manager", "technical staff", "vendor"].includes(decode.role)) {
      getManagerProperties();
      getManagerAvailability(decode.id);
      getTickets();
      getCalenderUrl();
    } else if (["company"].includes(decode.role)) {
      getManagers();
      getTickets();
      getCalenderUrl();
      getTechnicalStaff();
      getVendors();
      getProperties();
      getManagerAvailability(decode.id);
    } else if (decode.role === "customer") {
      getCustomerTickets();
      getCustomerProperties();
    }
    if (selectedReasonTypes.value !== "" || selectedProperty.value !== "") {
      getManagersSlots();
    }
    // new Draggable(document.getElementById("external-events"), {
    //     itemSelector: ".external-event",
    // });
  }, [dispatch, selectedReasonTypes, selectedProperty]);

  /**
   * Handling the modal state
   */
  const toggle = () => {
    setModal(!modal);
    if (!modal && !isEmpty(event) && !!isEdit) {
      setTimeout(() => {
        setEvent({});
        setIsEdit(false);
      }, 500);
    }
  };

  const toggleCategory = () => {
    // setSelectedEventId("")
    setIsEdit(false);
    setAddEventError("");
    setModalcategory(!modalcategory);
  };

  /**
   * Handling date click on calendar
   */
  // const handleDateClick = arg => {
  //     setSelectedEventId("")

  //     if (decode.role == "company") {
  //         // if (!selectedManagerID) {
  //         //     setManagerError(true)

  //         //     return
  //         // }
  //         // setManagerError(false)
  //     }

  //     const date = arg["date"];
  //     let selectedDate = new Date(date)
  //     setEvent({
  //         event_date: `${selectedDate.getFullYear()}-${(selectedDate.getMonth() + 1) < 10 ? `0${(selectedDate.getMonth() + 1)}` : (selectedDate.getMonth() + 1)}-${(selectedDate.getDate()) < 10 ? `0${(selectedDate.getDate())}` : (selectedDate.getDate())}`,
  //     });

  //     setSelectedDate(selectedDate)

  //     if (selectedManagerID) {
  //         //setCalenderSlots(selectedDate)
  //     }

  //     toggleCategory()

  //     // toggle();
  // };

  /**
   * Handling click on event on calendar
   */
  const handleEventClick = (arg) => {
    setSelectedEventId("");

    const event = arg.event;

    let filteredEvent = events.filter((ele) => ele.id === event.id);
    // console.log(filteredEvent, "FILTERD");
    if (filteredEvent[0]?.type === "tickets") {
      let filterTickets = totalTickets.filter((ele) => ele._id === event.id);
      setSelectedTicket(filterTickets[0]);

      tog_view();
      return;
    }

    //setSlots(filteredEvent[0].eventDate.split("T")[0])

    if (decode.role === "company") {
      getManagersOfProperty(filteredEvent[0]?.propertyId);
    }

    setEvent({
      id: event.id,
      name: filteredEvent[0]?.name,
      phone: filteredEvent[0]?.phone,
      phone1: filteredEvent[0]?.phone1 ? filteredEvent[0]?.phone1 : "",
      email: filteredEvent[0]?.email,
      description: filteredEvent[0]?.description,
      // start: event.start.split("T")[0],
      date: filteredEvent[0]?.eventDate.split("T")[0],
      slot: filteredEvent[0]?.slot,
      property: filteredEvent[0]?.property,
      propertyManager: filteredEvent[0]?.propertyManager,
      layoutType: filteredEvent[0]?.layoutType,
      reasonType: filteredEvent[0]?.reasonType,
    });
    setSelectedEventId(event.id);
    setIsEdit(true);
    toggleCategory();
    // toggle();
  };
  // console.log("SIngle Evet", event);

  const getProperties = async () => {
    try {
      const response = await axios.post(GET_PROPERTIES_COMPANY, {
        companyID: decode.id,
      });

      if (response.data.success) {
        // console.log(response.data.ManagerAvailability.daysOfWeekAvailability)
        setCompanyProperties(response.data.properties);
      }
    } catch (error) {
      console.log(error); // TODO proper error
    }
  };

  const getManagerProperties = async (id) => {
    try {
      const response = await axios.post(GET_PROPERTIES_MANAGER, {
        managerID: id ? id : decode.id,
      });

      if (response.data.success) {
        // console.log(response.data.ManagerAvailability.daysOfWeekAvailability)
        setManagerProperties(response.data.properties);
      }
    } catch (error) {
      console.log(error); // TODO proper error
    }
  };

  /**
   * Handling submit event on event form
   */
  const handleValidEventSubmit = (e, values) => {
    if (isEdit) {
      const updateEvent = {
        id: event.id,
        title: values.title,
        classNames: values.category + " text-white",
        start: event.start,
      };
      // update event
      dispatch(onUpdateEvent(updateEvent));
    } else {
      const newEvent = {
        id: Math.floor(Math.random() * 100),
        title: values["title"],
        start: selectedDay ? selectedDay.date : new Date(),
        className: values.category + " text-white",
      };
      // save new event
      dispatch(onAddNewEvent(newEvent));
    }
    setSelectedDay(null);
    toggleCategory();
    // toggle();
  };

  const handleValidEventSubmitcategory = async (event, values) => {
    console.log("HandleValidEventSubmitcategory get called:", values.date);
    setAddEventError("");

    let role = decode.role;

    if (role == "manager" || role == "company") {
      role = "PropertyManager";
    } else if (role == "technical staff") {
      role = "technicalStaff";
    }

    // let slots = values.event_slot.split(" - ");
    let slots = values.time.split(" - ");
    let reqDate = {
      manager_id: values.manager ? values.manager : decode.id,
      day: moment(values.date).format("ddd"),
      // eventDate: values.event_date,
      eventDate: values.date,
      StartTime: slots[0],
      endTime: slots[1],
      createdBy: decode.id,
      // type: values.event_type,
      type: values.reasonType,
      propertyId: values.property,
      companyDomain: decode?.managerOf ? decode?.managerOf : decode?.domain,
      title: values.event_title,
      description: values.event_description,
      event_id: selectedEventId,
      role: role,
    };

    console.log("Request Date:", reqDate);

    try {
      const response = await axios.post(ADD_EVENT, reqDate);

      if (response.data.status == 200) {

        let updatedEvent = response.data.updatedEvent;

        if (response.data.message == "Successfully Updated") {
          let removeEvent = totalEvents.filter(
            (ele) => ele.id != updatedEvent._id
          );

          let splitDate = values.event_date.split("-");
          let startTime = moment(slots[0], ["h:mm A"])
            .format("HH:mm")
            .split(":");
          let endTime = moment(slots[1], ["h:mm A"]).format("HH:mm").split(":");

          let newEvent = {
            id: updatedEvent._id,
            start: new Date(
              splitDate[0],
              splitDate[1] - 1,
              splitDate[2],
              startTime[0],
              startTime[1],
              0,
              0
            ),
            end: new Date(
              splitDate[0],
              splitDate[1] - 1,
              splitDate[2],
              endTime[0],
              endTime[1],
              0,
              0
            ),
            className:
              updatedEvent.type == "task"
                ? "bg-soft-primary text-primary border border-primary rounded"
                : "bg-soft-warning text-warning  border border-warning rounded",
            type: updatedEvent.type,
            title: updatedEvent.title,
            eventDate: updatedEvent.eventDate,
            slot: `${updatedEvent.startTime} - ${updatedEvent.endTime}`,
            description: updatedEvent.description,
            propertyId: updatedEvent.propertyId,
            manager: updatedEvent.eventAssignedTo,
          };

          removeEvent.push(newEvent);

          setEvents(removeEvent);
          setTotalEvents(removeEvent);

          toggleCategory();
          return;
        }
        let addedEvent = response.data.event;

        let splitDate = values.event_date.split("-");
        let startTime = moment(slots[0], ["h:mm A"]).format("HH:mm").split(":");
        let endTime = moment(slots[1], ["h:mm A"]).format("HH:mm").split(":");

        // console.log("task:", addedEvent);

        let newEvent = {
          id: addedEvent._id,
          start: new Date(
            splitDate[0],
            splitDate[1] - 1,
            splitDate[2],
            startTime[0],
            startTime[1],
            0,
            0
          ),
          end: new Date(
            splitDate[0],
            splitDate[1] - 1,
            splitDate[2],
            endTime[0],
            endTime[1],
            0,
            0
          ),
          className:
            addedEvent.type == "task"
              ? "bg-soft-primary text-primary border border-primary rounded"
              : "bg-soft-warning text-warning  border border-warning rounded",
          type: addedEvent.type,
          title: addedEvent.title,
          eventDate: addedEvent.eventDate,
          slot: `${addedEvent.startTime} - ${addedEvent.endTime}`,
          description: addedEvent.description,
          propertyId: addedEvent.propertyId,
          manager: addedEvent.eventAssignedTo,
        };

        // console.log("newEvent:", newEvent);

        setEvents((current) => [...current, newEvent]);
        setTotalEvents((current) => [...current, newEvent]);

        toggleCategory();
      } else {
        setAddEventError(response.data.message);
      }
    } catch (error) {
      console.log(error); // TODO proper error
    }
  };

  const getManagerAvailability = async (id) => {
    try {
      const response = await axios.get(
        `${GET_AVAILABILITY}/?manager_id=${id ? id : decode.id}`
      );

      if (response.data.status == 200) {
        setDayAvailability(
          response.data.ManagerAvailability.daysOfWeekAvailability
        );

        let availabilityArray = [];
        response.data.ManagerAvailability.daysOfWeekAvailability.map(
          (day, i) => {
            if (day.available) {
              availabilityArray.push(i);
            }
          }
        );

        setDaysOfWeek(availabilityArray);

        return response.data.ManagerAvailability.daysOfWeekAvailability;
      }
    } catch (error) {
      console.log(error); // TODO proper error
    }
  };

  const getManagers = async () => {
    try {
      const response = await axios.post(GET_MANAGERS, {
        company_id: decode.id,
      });

      if (response.data.status == 200) {
        let managersList = response?.data?.managers.map((item, index) => {
          var obj = {};
          obj["label"] = item.firstname + " " + item.lastname;
          obj["value"] = item._id;
          obj.color = index + 1;
          return obj;
        });
        setCompanyManagers(managersList);
        // console.log(managersList , "managersList")
        // console.log(companyManagers , "companyManagers")
      }
    } catch (error) {
      console.log(error); // TODO proper error
    }
  };

  const getManagersSlots = async (val) => {
    try {
      const ids = val?.map((item) => item.value);
      const response = await axios.post(GET_MANAGERS_SLOTS, {
        manager_id: ids,
        reasonType: selectedReasonTypes.value ? selectedReasonTypes.value : "",
        propertyId: selectedProperty.value ? selectedProperty.value : "",
      });
      // if (response.data.status == 200) {
      let managerEvent = response?.data?.bookedSlot.map((ticket) => {
        return {
          id: ticket?._id,
          start: new Date(ticket?.createdAt),
          end: new Date(ticket?.createdAt),
          className: "bg-soft-success text-success",
          type: "tickets",
        };
      });

      let eventArray = response?.data?.bookedSlot?.map((evt) => {
        // console.log(evt.propertyManager.firstname,'mylog');
        let splitDate = evt?.date?.split("-");
        let startTime = moment(evt?.startTime, ["h:mm A"])
          .format("HH:mm")
          .split(":");
        let endTime = moment(evt?.endTime, ["h:mm A"])
          .format("HH:mm")
          .split(":");

        // console.log(splitDate[0], splitDate[1] - 1, splitDate[2], startTime[0], startTime[1], 0, 0)
        const color = val?.filter(
          (item) => item.value === evt.eventAssignedTo
        )[0].color;
        return {
          id: evt._id,
          start: new Date(
            splitDate[0],
            splitDate[1] - 1,
            splitDate[2]?.split("T")[0],
            startTime[0],
            startTime[1],
            0,
            0
          ),
          end: new Date(
            splitDate[0],
            splitDate[1] - 1,
            splitDate[2].split("T")[0],
            endTime[0],
            endTime[1],
            0,
            0
          ),
          className:
            evt.status == "booked"
              ? `bg-soft-${color} text-primary border border-${color} rounded`
              : "bg-soft-warning text-warning border border-warning rounded",
          name: evt.name,
          phone: evt.phone,
          phone1: evt.phone1 ? evt.phone1 : "",
          email: evt.email,
          eventDate: evt.date,
          slot: `${evt.startTime} - ${evt.endTime}`,
          description: evt.description,
          status: evt.status,
          managerId: evt.eventAssignedTo,
          property: evt.property[0].title || "NA",
          propertyManager:
            evt.propertyManager.firstname +
              " " +
              evt.propertyManager.lastname || "",
          layoutType: evt.layoutType[0].layoutName || "NA",
          reasonType: evt.reasonType[0].reasonType || "NA",
          reasonColor: evt.reasonType[0].reasonType || "NA",
        };
      });

      // console.log(eventArray, "TYUI");

      function pushIfNotPresent(array, obj) {
        const index = array.findIndex((item) => item.id === obj.id);
        if (index === -1) {
          array.push(obj);
        }
      }
      const newEvents = [...events];
      eventArray.map((v) => pushIfNotPresent(newEvents, v));
      setEvents(newEvents);
      // console.log(companyManagers , "companyManagers")
      // }
    } catch (error) {
      console.log(error?.message); // TODO proper error
    }
  };
  useEffect(() => {
    if (newData.length > 0) {
      getManagersSlots(newData);
    }
  }, [newData, selectedReasonTypes, selectedProperty]);

  const changedata = (data) => {
    // console.log(data, "data");
    setNewData((prev) => [...prev, data]);
    getManagersSlots();
  };

  const getTechnicalStaff = async () => {
    try {
      const response = await axios.post(GET_TECHNICAL_STAFF, {
        companyID: decode.id,
      });

      if (response.data.success) {
        // console.log(response.data.ManagerAvailability.daysOfWeekAvailability)
        setComapnyTechnicalStaff(response.data.technicalStaff);
      }
    } catch (error) {
      console.log(error); // TODO proper error
    }
  };

  const getVendors = async () => {
    try {
      const response = await axios.get(GET_VENDORS);

      if (response.data.success) {
        // console.log(response.data.ManagerAvailability.daysOfWeekAvailability)
        setComapnyVendors(response.data.vendors);
      }
    } catch (error) {
      console.log(error); // TODO proper error
    }
  };

  const getManagersOfProperty = async (id) => {
    try {
      const response = await axios.post(GET_MANAGERS_OF_PROPERTIES, {
        propertyID: id,
      });

      // console.log("response:", response);

      if (response.data.success) {
        // console.log(response.data.ManagerAvailability.daysOfWeekAvailability)
        setManagersOfProperty(response.data.Managers);

        if (response?.data?.Managers?.length > 0) {
          setSelectedManagerID(response.data.Managers[0]._id);

          let availabilityArray = await getManagerAvailability(
            response.data.Managers[0]._id
          );

          // console.log("availabilityArray", availabilityArray);

          if (selectedDate) {
            //setCalenderSlots(selectedDate, availabilityArray)
          }

          //document.getElementById("managerselect").value = response.data.Managers[0]
        }
      }
    } catch (error) {
      console.log(error); // TODO proper error
    }
  };

  const getCalenderUrl = async () => {
    try {
      let response = await axios.get(
        SERVER_URL +
          `/user_appointment/get-url-key/?manager_id=${decode.id}&role=${decode.role}`
      );
      // console.log("response:", response);
      if (response.data.status == 200) {
        const url =
          window.location.protocol +
          "//" +
          window.location.host +
          "/calendar/" +
          response.data.url_key.primaryID;
        setUrl(url);
        setCalendarId(response.data.url_key.primaryID);
      }
    } catch (error) {
      console.log(error); // TODO proper error
    }
  };

  const renderEvent = (info) => {
    let startTime = info.event.start;
    let endTime = info.event.end;
    startTime = startTime?.toLocaleTimeString([], {
      hour: "2-digit",
      minute: "2-digit",
    });
    endTime = endTime?.toLocaleTimeString([], {
      hour: "2-digit",
      minute: "2-digit",
    });
    // console.log(info.event, "SDD");

    return (
      <div className="d-flex flex-column justify-content-start align-items-start overflow-auto">
        <small className="text-muted">
          {startTime} - {endTime}
        </small>
        <p className="text-dark font-weight-bold">
          {info.event.extendedProps?.reasonType
            ? info.event.extendedProps?.reasonType
            : "Booked Event"}
        </p>
        {/* <p className="text-muted">{info.event.extendedProps.description}</p> */}
      </div>
    );
  };

  const setVisibleRange = () => {
    return { start: selectedStartDate, end: selectedEndDate };
  };
  const cancelAppointment = async (appointmentId) => {
    try {
      if (reason.length > 0) {
        setLoading(true);
        setReasonErr("");
        let body = {
          appointmentId: appointmentId,
          reason: reason,
        };
        let response = await axios.patch(
          SERVER_URL + `/user_appointment/cancel-appointment`,
          body
        );
        setLoading(false);
        confirm_view();
        toggleCategory();
        window.location.reload();
      } else {
        setReasonErr("Enter a reason");
      }
    } catch (err) {
      console.log(err);
    }
  };
  useEffect(() => {
    if (selectedEndDate) {
      if (selectedEndDate < selectedStartDate) {
        toast.warning("End date cannot be earlier than start date");
      } else {
        const startDate = new Date(selectedStartDate);
        const endDate = new Date(selectedEndDate);

        //Difference in number of days
        const days = moment(selectedStartDate)?.diff(
          moment(selectedEndDate),
          "days"
        );

        const month =
          (endDate.getFullYear() - startDate.getFullYear()) * 12 +
          (endDate.getMonth() - startDate.getMonth());

        calendarRef.current.getApi().gotoDate(startDate);
        calendarRef.current.getApi().setOption("end", endDate);

        if (Math.abs(month)) {
          calendarRef.current.getApi().changeView("year");
          setMonthViews((prev) => ({
            ...prev,
            year: { type: "multiMonth", duration: { months: month + 1 } },
          }));
        } else if (days) {
          if (days < 0) {
            if (days * -1 > 8) {
              calendarRef.current.getApi().changeView("dayGridMonth");
              // setMonthViews((prev) => ({
              //   ...prev,
              //   month: { type: "dayGridMonth" },
              // }));
            } else {
              calendarRef.current.getApi().changeView("week");
              setMonthViews((prev) => ({
                ...prev,
                week: { type: "timeGrid", duration: { days: days * -1 + 1 } },
              }));
            }
          } else {
            if (days > 8) {
              calendarRef.current.getApi().changeView("dayGridMonth");
              // setMonthViews((prev) => ({
              //   ...prev,
              //   month: { type: "dayGridMonth" },
              // }));
            } else {
              calendarRef.current.getApi().changeView("week");
              setMonthViews((prev) => ({
                ...prev,
                week: { type: "timeGrid", duration: { days: days + 1 } },
              }));
            }
          }
        } else {
          calendarRef.current.getApi().changeView("timeGridDay");
        }
      }
    }
  }, [selectedEndDate, selectedStartDate]);

  async function getSheetData(data, header) {
    var fields = Object.keys(data[0]);
    var sheetData = data?.map(function (row) {
      return fields?.map(function (fieldName) {
        return row[fieldName] ? row[fieldName] : "";
      });
    });
    sheetData?.unshift(header);
    return sheetData;
  }
  try {
    return (
      <React.Fragment>
        <DeleteModal
          show={deleteModal}
          onDeleteClick={() => console.log("close")}
          onCloseClick={() => setDeleteModal(false)}
        />
        <div className="page-content">
          <MetaTags>
            <title>Rentdigicare | Calendar View </title>
          </MetaTags>
          <Container fluid={true}>
            {/* Render Breadcrumb */}
            <Breadcrumbs title="Calendar" breadcrumbItem="Calendar View" />
            <div className="appsCalender-filter d-flex justify-content-between align-items-center@ py-2">
              {/* <h3>{url}</h3> */}

              <div className="row">
                <div className="col-md-12  mb-3">
                  {!["vendor", "technical staff"].includes(decode.role) && (
                    <CopyToClipboard
                      text={url}
                      onCopy={() => {
                        if (slotsAvailability) {
                          setcopied(true);
                        } else {
                          setcopied(false);
                        }
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
                          if (slotsAvailability) {
                            navigator.clipboard.writeText(url);
                          } else {
                            toast.warning(
                              "Please set your slots availability first"
                            );
                          }
                        }}
                      >
                        Copy Calendar Link
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
                {["manager", "company"].includes(decode.role) && (
                  <>
                    <div className="col-md-4 col-sm-3 mb-3 ">
                      <label className="">Start Date :</label>
                      <input
                        type="date"
                        className="form-control"
                        placeholder="Username"
                        value={selectedStartDate}
                        aria-describedby="addon-wrapping"
                        aria-label="Username"
                        onChange={(e) => {
                          if (selectedEndDate === "") {
                            setSelectedEndDate(e?.target.value);
                            setSelectedStartDate(e?.target.value);
                          } else {
                            setSelectedStartDate(e?.target.value);
                          }
                        }}
                      />
                    </div>
                    <div className="col-md-4 col-sm-3 mb-3 ">
                      <label className="mx-2">End Date :</label>
                      <input
                        type="date"
                        className="form-control"
                        placeholder="Username"
                        value={selectedEndDate}
                        aria-describedby="addon-wrapping"
                        aria-label="Username"
                        onChange={(e) => {
                          if (selectedStartDate === "") {
                            setSelectedStartDate(e?.target.value);
                            setSelectedEndDate(e?.target.value);
                          } else {
                            setSelectedEndDate(e?.target.value);
                          }
                        }}
                      />
                    </div>
                    <div className="col-md-4 col-sm-4  mb-3">
                      <label className="">Select Property :</label>
                      <Select
                        className="appsCalender-filter-select"
                        value={selectedProperty}
                        options={properties}
                        onChange={(e) => {
                          setSelectedProperty(e);
                          setNewData([]);
                        }}
                      />
                    </div>

                    <div className="col-md-4 col-sm-4  mb-3">
                      <label className="">Select Reason Type :</label>
                      <Select
                        className="appsCalender-filter-select"
                        value={selectedReasonTypes}
                        options={reasonTypes}
                        onChange={(e) => {
                          setSelectedReasonTypes(e);
                          setNewData([]);
                        }}
                      />
                    </div>
                  </>
                )}
                {decode.role === "company" && (
                  <div className="col-md-4 col-sm-3  mb-3">
                    <label className="">Select Manager :</label>
                    <Select
                      isClearable={false}
                      className="appsCalender-filter-select"
                      value={newData}
                      options={companyManagers}
                      isMulti={true}
                      onChange={(e) => {
                        changedata(e);
                      }}
                      components={{
                        Option: ({ data }) => (
                          <div
                            onClick={(e) => {
                              e.preventDefault();
                              changedata(data);
                            }}
                            className={`multipleOpts bg-${data.color} `}
                            style={{
                              color: "#FFF",
                            }}
                          >
                            {data.label}
                          </div>
                        ),
                        MultiValue: ({ data }) => (
                          <div className="d-flex align-items-center mt-1">
                            <div className={`multiselectOpt bg-${data.color}`}>
                              {data.label}
                            </div>
                            <div
                              className="multiselectOptClose"
                              onClick={() => {
                                const newOpts = [...newData]?.filter(
                                  (v) => v.value !== data.value
                                );
                                const newEvents = [...events]?.filter(
                                  (e) => e.managerId !== data.value
                                );
                                setEvents(newEvents);
                                setNewData(newOpts);
                              }}
                            >
                              x
                            </div>
                          </div>
                        ),
                      }}
                      styles={{
                        option: (base, state) => ({
                          ...base,
                          backgroundColor: state.isFocused ? "#f0f0f0" : "",
                          ":hover": {
                            backgroundColor: "#f0f0f0",
                          },
                        }),
                      }}
                    />
                  </div>
                )}
                {(selectedEndDate ||
                  selectedStartDate ||
                  selectedReasonTypes.length !== 0 ||
                  selectedProperty.length !== 0 ||
                  newData.length > 0) && (
                  <div className="col-md-8 col-sm-3 d-flex justify-content-end align-items-center">
                    <div className="srch-btn">
                      <button
                        type="submit"
                        className="btn btn-primary"
                        onClick={() => {
                          setSelectedEndDate("");
                          setSelectedStartDate("");
                          setNewData([]);
                          getTickets();
                          setSelectedReasonTypes([]);
                          setSelectedProperty([]);
                          calendarRef.current.getApi().gotoDate(new Date());
                          calendarRef.current
                            .getApi()
                            .setOption("end", new Date());
                        }}
                      >
                        Clear
                      </button>
                    </div>
                  </div>
                )}
              </div>
            </div>

            <Row>
              <Col xs={12}>
                <Row>
                  <Col xl={12} lg={12}>
                    <Card>
                      <CardBody>
                        {/* fullcalendar control */}
                        <FullCalendar
                          ref={calendarRef}
                          // plugins={[
                          //   BootstrapTheme,
                          //   dayGridPlugin,
                          //   interactionPlugin,
                          //   // timeGridPlugin,
                          // ]}
                          plugins={[
                            dayGridPlugin,
                            timeGridPlugin,
                            multiMonthPlugin,
                            interactionPlugin,
                            BootstrapTheme,
                          ]}
                          // contentHeight={"auto"}
                          themeSystem="bootstrap"
                          headerToolbar={{
                            left: "prev,next today excel",
                            center: "title",
                            right: "year,dayGridMonth,week,timeGridDay",
                          }}
                          initialView={initialView}
                          // initialDate={
                          //   selectedStartDate || new Date().toISOString()
                          // }
                          views={monthViews}
                          now={new Date().toISOString()}
                          nowIndicator={true}
                          navLinks={true}
                          // visibleRange={setVisibleRange}
                          customButtons={{
                            excel: {
                              text: "Export Excel",
                              click: async function () {
                                try {
                                  const filteredEvents = selectedEndDate
                                    ? events?.filter((e) => {
                                        const eventDate = moment(
                                          e.eventDate
                                        ).format("YYYY-MM-DD");

                                        return (
                                          eventDate >= selectedStartDate &&
                                          eventDate <= selectedEndDate
                                        );
                                      })
                                    : events;

                                  const eventsArray = filteredEvents
                                    ?.map((event) => {
                                      // console.log(event, "EVENT");
                                      const body = {
                                        Name: event?.name,
                                        Email: event?.email,
                                        Phone: event?.phone,
                                        Description: event?.description || "NA",
                                        Property: event?.property || "NA",
                                        "Property Manager":
                                          event?.propertyManager,
                                        "Layout Type":
                                          event?.layoutType || "NA",
                                        "Reason Type":
                                          event?.reasonType || "NA",
                                        "Event Date": moment(
                                          event?.eventDate
                                        ).format("DD-MM-YYYY"),
                                        "Event Time": event?.slot,
                                        Status: event?.status || "NA",
                                      };
                                      // console.log(body, "BODY");
                                      return body;
                                    })
                                    .sort((a, b) => {
                                      const aDate = new Date(
                                        moment(
                                          a["Event Date"],
                                          "DD-MM-YYYY"
                                        ).format()
                                      );
                                      const bDate = new Date(
                                        moment(
                                          b["Event Date"],
                                          "DD-MM-YYYY"
                                        ).format()
                                      );
                                      const dateComparison = bDate - aDate;
                                      if (dateComparison === 0) {
                                        const aTime = moment(
                                          a["Event Time"],
                                          "hh:mm a"
                                        ).format("HH:mm:ss");
                                        const bTime = moment(
                                          b["Event Time"],
                                          "hh:mm a"
                                        ).format("HH:mm:ss");
                                        return bTime.localeCompare(aTime);
                                      }
                                      return dateComparison;
                                    });

                                  if (eventsArray?.length > 0) {
                                    let header = Object.keys(eventsArray[0]);

                                    const workbook =
                                      await XlsxPopulate.fromBlankAsync();
                                    if (workbook) {
                                      const sheet1 = workbook?.sheet(0);
                                      const sheetData = await getSheetData(
                                        eventsArray,
                                        header
                                      );

                                      const totalColumns = sheetData[0]?.length;
                                      // console.log(sheet1, `sdaaaaaaaaaaaaaa`);

                                      sheet1?.cell("A1")?.value(sheetData);
                                      const range = sheet1?.usedRange();
                                      const endColumn = String.fromCharCode(
                                        64 + totalColumns
                                      );
                                      sheet1?.row(1).style("bold", true);
                                      sheet1
                                        ?.range("A1:" + endColumn + "1")
                                        ?.style("fill", "BFBFBF");
                                      range?.style("border", true);
                                      return workbook
                                        .outputAsync()
                                        .then((res) => {
                                          saveAs(res, "events.xlsx");
                                        });
                                    }
                                  } else {
                                    toast.warning("No Events found");
                                  }
                                } catch (err) {
                                  console.log("ERROR", err.message);
                                }
                              },
                            },
                          }}
                          visibleRange={setVisibleRange}
                          slotDuration={"00:15:00"}
                          handleWindowResize={true}
                          // headerToolbar={{
                          //   left: "prev,next today",
                          //   center: "title",
                          //   right: "dayGridMonth,dayGridWeek,dayGridDay",
                          // }}
                          // businessHours={{
                          //     daysOfWeek: daysOfWeek, // Monday - Thursday

                          // }}

                          events={events}
                          eventContent={renderEvent}
                          editable={false}
                          droppable={false}
                          draggable={false}
                          selectable={false}
                          dateClick={(e) => {
                            bookAppoinment_view(e);
                            setDefaultDate(e.dateStr);
                          }}
                          dayMaxEvents={true}
                          showNonCurrentDates={false}
                          eventClick={handleEventClick}
                          // eventDragStart={(e) => { e.preventDefault() }}
                          // eventDragStop={(e) => { e.preventDefault() }}
                          drop={() => console.log("drop")}
                        />
                      </CardBody>
                    </Card>
                  </Col>
                </Row>
                <div style={{ clear: "both" }}></div>
                {/* New/Edit event modal */}
                <Modal isOpen={modal} className={props.className}>
                  <ModalHeader toggle={toggle} tag="h4">
                    {!!isEdit ? "Edit Event" : "Add Event"}
                  </ModalHeader>
                  <ModalBody>
                    <AvForm onValidSubmit={handleValidEventSubmit}>
                      <Row form>
                        <Col className="col-12 mb-3">
                          <AvField
                            name="title"
                            label="Event Name"
                            type="text"
                            errorMessage="Invalid name"
                            validate={{
                              required: { value: true },
                            }}
                            value={event ? event.title : ""}
                          />
                        </Col>
                        <Col className="col-12 mb-3">
                          <AvField
                            type="select"
                            name="category"
                            label="Select Category"
                            validate={{
                              required: { value: true },
                            }}
                            value={event ? event.category : "bg-primary"}
                          >
                            <option value="bg-danger">Danger</option>
                            <option value="bg-success">Success</option>
                            <option value="bg-primary">Primary</option>
                            <option value="bg-info">Info</option>
                            <option value="bg-dark">Dark</option>
                            <option value="bg-warning">Warning</option>
                          </AvField>
                        </Col>
                      </Row>
                      <Row>
                        <Col>
                          <div className="text-end">
                            <button
                              type="button"
                              className="btn btn-light me-2"
                              onClick={toggle}
                            >
                              Close
                            </button>
                            {!!isEdit && (
                              <button
                                type="button"
                                className="btn btn-danger me-2"
                                onClick={() => setDeleteModal(true)}
                              >
                                Delete
                              </button>
                            )}
                            <button
                              type="submit"
                              className="btn btn-success save-event"
                            >
                              Save
                            </button>
                          </div>
                        </Col>
                      </Row>
                    </AvForm>
                  </ModalBody>
                </Modal>

                <Modal
                  isOpen={modalcategory}
                  toggle={toggleCategory}
                  className={props.className}
                >
                  <ModalHeader toggle={toggleCategory} tag="h4">
                    Appointment Detail
                  </ModalHeader>
                  <ModalBody>
                    <AvForm onValidSubmit={handleValidEventSubmitcategory}>
                      {addEventError && (
                        <p style={{ color: "red" }}>{addEventError}</p>
                      )}
                      <Row form>
                        <Col className="col-12 mb-3">
                          <AvField
                            name="event_title"
                            label="Request From"
                            type="text"
                            errorMessage="Please Enter the title"
                            validate={{
                              required: { value: true },
                            }}
                            value={event.name ? event.name : ""}
                            disabled={true}
                          />
                        </Col>
                        <Col className="col-12 mb-3">
                          <AvField
                            name="reasonType"
                            label="Reason Type"
                            type="text"
                            errorMessage="Please Enter the description"
                            validate={{
                              required: { value: true },
                            }}
                            value={event.reasonType ? event.reasonType : ""}
                            disabled={true}
                          />
                        </Col>
                        <Col className="col-12 mb-3">
                          <AvField
                            name="property"
                            label="Property"
                            type="text"
                            errorMessage="Please Enter the description"
                            validate={{
                              required: { value: true },
                            }}
                            value={event.property ? event.property : ""}
                            disabled={true}
                          />
                        </Col>
                        {/* <Col className="col-12 mb-3">
                          <AvField
                            name="property"
                            label="Property Manager"
                            type="text"
                            errorMessage="Please Enter the description"
                            validate={{
                              required: { value: true },
                            }}
                            value={event.propertyManager ? event.propertyManager : ""}
                            disabled={true}
                          />
                        </Col> */}
                        <Col className="col-12 mb-3">
                          <AvField
                            name="layoutType"
                            label="Layout Type"
                            type="text"
                            // errorMessage="Please Enter the description"
                            validate={{
                              required: { value: true },
                            }}
                            value={event.layoutType ? event.layoutType : ""}
                            disabled={true}
                          />
                        </Col>
                        <Col className="col-12 mb-3">
                          <AvField
                            name="phone"
                            label="Phone"
                            type="text"
                            errorMessage="Please Enter the description"
                            validate={{
                              required: { value: true },
                            }}
                            value={event.phone ? event.phone : ""}
                            disabled={true}
                          />
                        </Col>
                        {event?.phone1 ? (
                          <Col className="col-12 mb-3">
                            <AvField
                              name="phone"
                              label="Other Phone"
                              type="text"
                              errorMessage="Please Enter the description"
                              validate={{
                                required: { value: true },
                              }}
                              value={event.phone1 ? event.phone1 : ""}
                              disabled={true}
                            />
                          </Col>
                        ) : (
                          ""
                        )}

                        <Col className="col-12 mb-3">
                          <AvField
                            name="email"
                            label="Email"
                            type="text"
                            errorMessage="Please Enter the description"
                            validate={{
                              required: { value: true },
                            }}
                            value={event.email ? event.email : ""}
                            disabled={true}
                          />
                        </Col>

                        <Col className="col-12 mb-3">
                          <AvField
                            name="event_description"
                            label="Comment"
                            type="text"
                            errorMessage="Please Enter the description"
                            validate={{
                              required: { value: true },
                            }}
                            value={event.description ? event.description : ""}
                            disabled={true}
                          />
                        </Col>
                        <Col className="col-12 mb-3">
                          <AvField
                            name="date"
                            label="Appointment Date"
                            type="text"
                            errorMessage="Please Enter the description"
                            validate={{
                              required: { value: true },
                            }}
                            value={event.date ? event.date : ""}
                            disabled={true}
                          />
                        </Col>

                        <Col className="col-12 mb-3">
                          <AvField
                            name="time"
                            label="Slot Time"
                            type="text"
                            errorMessage="Please Enter the description"
                            validate={{
                              required: { value: true },
                            }}
                            value={event.slot ? event.slot : ""}
                            disabled={true}
                          />
                        </Col>
                      </Row>
                      <Row>
                        <Col>
                          <div className="text-end">
                            <button
                              type="button"
                              className="btn btn-light me-2"
                              onClick={() => {
                                setEvent({});
                                setSplitTimes([]);
                                toggleCategory();
                              }}
                            >
                              Close
                            </button>
                            {/* <button
                              type="submit"
                              className="btn btn-success save-event me-2"
                            >
                              Save
                            </button> */}

                            <button
                              type="button"
                              className="btn btn-danger "
                              onClick={() => {
                                confirm_view();
                                setIdToCancel(event.id);
                              }}
                            >
                              Cancel
                            </button>
                          </div>
                        </Col>
                      </Row>
                    </AvForm>
                  </ModalBody>
                </Modal>
                <Modal
                  size="lg"
                  isOpen={modal_view}
                  toggle={() => {
                    tog_view();
                  }}
                >
                  <div className="modal-header">
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
                            Ticket Detail
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
                            Work Details
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
                                  Company Name
                                </Label>
                                <Input
                                  type="text"
                                  value={selectedTicket?.companyDomain}
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
                                  value={selectedTicket?.status}
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
                                  value={selectedTicket?.property}
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
                                  value={selectedTicket?.suite}
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
                                  value={selectedTicket?.requestType}
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
                                  value={selectedTicket?.phone}
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
                                  value={selectedTicket?.email}
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
                                  value={selectedTicket?.name}
                                  className="form-control"
                                  id="formrow-room-input"
                                  readOnly
                                />
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
                                  placeholder={selectedTicket?.details}
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
                                  placeholder={selectedTicket?.reviews}
                                ></textarea>
                              </div>
                            </div>
                          </div>
                        </Form>
                      </TabPane>
                      <TabPane tabId="2">
                        <div className="row">
                          <div className="col-md-12">
                            <div className="mb-3">
                              <Label className="form-Label">Assigned To</Label>
                              <Input
                                type="text"
                                value={assignedVendor}
                                className="form-control"
                                id="formrow-room-input"
                                readOnly={true}
                              />
                            </div>
                          </div>
                          <div className="col-md-3">
                            <div className="mb-3">
                              <Label className="form-Label">Status</Label>
                              <select
                                value={selectedTicket?.status}
                                className="form-select"
                                disabled={true}
                              >
                                <option value={"Select"}>Select</option>
                                <option value={"open"}>Open</option>
                                <option value={"vendorAssigned"}>
                                  Vendor Assigned
                                </option>
                                <option value={"inprogress"}>Inprogress</option>
                                <option value={"done"}>Done</option>
                                <option value={"verified"}>Verified</option>
                              </select>
                              {/* <Input type="text" value={status} onChange={(e) => { setStatus(e.target.value) }} className="form-control" id="formrow-room-input" readOnly={ true } /> */}
                            </div>
                          </div>
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
                                value={
                                  selectedTicket?.confirmedQuote
                                    ? selectedTicket?.confirmedQuote?.startDate.split(
                                        "T"
                                      )[0]
                                    : selectedTicket?.startDate?.split("T")[0]
                                }
                                type="date"
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
                                value={
                                  selectedTicket?.confirmedQuote
                                    ? selectedTicket?.confirmedQuote?.startTime
                                    : selectedTicket?.startTime
                                }
                                type="time"
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
                                value={
                                  selectedTicket?.confirmedQuote
                                    ? selectedTicket?.estimatedEndDate.split(
                                        "T"
                                      )[0]
                                    : selectedTicket?.estimatedEndDate?.split(
                                        "T"
                                      )[0]
                                }
                                onChange={(e) => {
                                  setEndDate(e.target.value);
                                }}
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
                                value={
                                  selectedTicket?.confirmedQuote
                                    ? selectedTicket?.confirmedQuote
                                        ?.estimatedETime
                                    : selectedTicket?.estimatedETime
                                }
                                onChange={(e) => {
                                  setEndTime(e.target.value);
                                }}
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
                                value={
                                  selectedTicket?.confirmedQuote
                                    ? selectedTicket?.confirmedQuote?.notes
                                    : selectedTicket?.notes
                                }
                                readOnly={true}
                                placeholder=""
                              ></textarea>
                            </div>
                          </div>
                          {/* {props.role !== "customer"
                                        ?
                                        <div className="col-md-12 d-flex flex-wrap align-items-center justify-content-center">
                                            <button className="btn btn-primary mo-mb-2 mr-10"
                                                onClick={(e) => {
                                                    submitFunction(e)
                                                    tog_view()
                                                }}
                                            >Submit</button>
                                            <button className='btn btn-light' onClick={(e) => { tog_view() }}>cancel</button>

                                        </div>
                                        :
                                        props.isConfirmationSet &&
                                        <div className="col-md-12 d-flex flex-wrap align-items-center justify-content-center">
                                            <button className="btn btn-primary mo-mb-2 mr-10"
                                                onClick={(e) => {
                                                    confirmTicket(e)
                                                    tog_view()
                                                }}
                                            >Confirm</button>
                                            <button className='btn btn-light' onClick={(e) => { tog_view() }}>cancel</button>

                                        </div>
                                    } */}
                        </div>
                      </TabPane>
                    </TabContent>
                  </div>
                </Modal>
                <Modal
                  size="md"
                  isOpen={confirm_Modal}
                  toggle={() => {
                    confirm_view();
                  }}
                >
                  <div className="modal-header">
                    <h5 className="modal-title mt-0" id="myLargeModalLabel">
                      Are you sure ?
                    </h5>
                    <button
                      onClick={() => {
                        confirm_view();
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
                    <div className="col-md-12">
                      <div className="mb-3">
                        <label
                          htmlFor="basicpill-address-input"
                          className="form-label"
                        >
                          Reason
                        </label>
                        <textarea
                          id="basicpill-address-input"
                          className="form-control"
                          rows="3"
                          placeholder="Enter reason for cancelation"
                          onChange={(e) => setReason(e.target.value)}
                        ></textarea>
                        {reason_err && (
                          <p className="text-danger">{reason_err}</p>
                        )}
                      </div>
                    </div>
                    <div className="col-md-12 d-flex flex-wrap align-items-center justify-content-center">
                      <button
                        className="btn btn-success mo-mb-2 mr-10"
                        disabled={loading}
                        onClick={(e) => {
                          //addSpeciality(e)
                          // tog_rating_view()
                          cancelAppointment(idToCancel);
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
                        Yes
                      </button>
                      <button
                        className="btn btn-danger"
                        onClick={(e) => {
                          confirm_view();
                        }}
                      >
                        No
                      </button>
                      <br />
                    </div>
                  </div>
                </Modal>
                <BookAppointmentModal
                  open={appointmentModal}
                  setOpen={setAppoinmentModal}
                  id={calendarId}
                  defaultDate={defaultDate}
                />
              </Col>
            </Row>
          </Container>
        </div>
      </React.Fragment>
    );
  } catch (err) {
    console.log(err.message, "errr");
  }
};

Calender.propTypes = {
  events: PropTypes.array,
  categories: PropTypes.array,
  className: PropTypes.string,
  onGetEvents: PropTypes.func,
  onAddNewEvent: PropTypes.func,
  onUpdateEvent: PropTypes.func,
  onDeleteEvent: PropTypes.func,
  onGetCategories: PropTypes.func,
};

export default Calender;
