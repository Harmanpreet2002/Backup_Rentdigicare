import PropTypes from "prop-types";
import React, { useState, useEffect, useRef, useCallback } from "react";

//Import Icons
import FeatherIcon from "feather-icons-react";

// //Import Scrollbar
import SimpleBar from "simplebar-react";

// MetisMenu
import MetisMenu from "metismenujs";
import { withRouter } from "react-router-dom";
import { Link } from "react-router-dom";

//i18n
import { withTranslation } from "react-i18next";
import jwt_decode from "jwt-decode";
import axios from "../../pages/api/axios";
const SidebarContent = (props) => {
  const [dashboarddata, setDashboardData] = useState("");
  const [residentApplicationInfo, setResidentApplicationInfo] = useState({
    Total: 0,
    Pending: 0,
    Approved: 0,
    Denied: 0,
  });
  const [viewLeadsInfo, setViewLeadsInfo] = useState({
    total: 0,
    closed: 0,
    pending: 0,
    cancelled: 0,
    follow_up: 0,
  });
  const [appointmentsInfo, setAppointmentsInfo] = useState({
    total: 0,
    booked: 0,
    rejected: 0,
    rejected: 0,
  });
  const [maintenanceRequestInfo, setMaintenanceRequestInfo] = useState({
    total: 0,
    open: 0,
    inprogress: 0,
    completed: 0,
    unresolved: 0,
  });

  const decode = jwt_decode(window.localStorage.getItem("accessToken"));

  useEffect(() => {
    console.log(dashboarddata);
  }, [dashboarddata]);

  useEffect(() => {
    const fetchData = async () => {
      try {
        // Request 1: Fetch navdata
        const navdataResponse = await axios.post(
          "/navdata/maintenancerequests",
          {
            companyDomain: decode.domain,
            managerID: decode.id,
          }
        );
        // Handle navdataResponse as needed

        // Request 2: Fetch resident applications
        const residentApplicationsResponse = await axios.post(
          "/navdata/residentapplications?page=1&limit=10",
          {
            role: decode.role,
            domain: decode.domain,
          }
        );

        // Handle residentApplicationsResponse as needed

        // Request 3: Fetch pending slots
        const pendingSlotsResponse = await axios.post(
          "/user_appointment/get-pending-slot",
          {
            manager_id: decode.id,
          }
        );

        // Handle pendingSlotsResponse as needed

        // Update the state with fetched data
        setDashboardData({
          maintenanceTickets: navdataResponse.data?.openTicketsCount,
          residentApplications:
            residentApplicationsResponse.data.total?.Pending || 0,
          pendingSlots: pendingSlotsResponse.data,
        });
        console.log(dashboarddata);
      } catch (error) {
        console.error("Error fetching data:", error);
      }
    };

    fetchData();
  }, []);

  // * Get Manager Pending slots start

  const getApplicants = async (url, data) => {
    try {
      const response = await axios.post(url, data);
      if (response.status === 200) {
        if (response.data.results.applications) {
          const temp = response.data.results.applications;
          setResidentApplicationInfo((prev) => ({
            ...prev,
            Total: response.data.total.Total || 0,
            Pending: response.data.total.Pending || 0,
            Approved: response.data.total.Approved || 0,
            Denied: response.data.total.Denied || 0,
          }));
        }
      } else {
        console.log("Unable to fetch the resources");
      }
    } catch (error) {
      console.error("Unable to get applicants", error);
    }
  };

  const getLeads = async (e) => {
    try {
      const response = await axios.get(
        `/leads/getLeadsManager?page=1&limit=10`
      );

      if (response.data?.success && response?.data?.leads?.length > 0) {
        setViewLeadsInfo((prev) => ({
          ...prev,
          total: response.data.total.Total || 0,
          pending: response.data.total.Pending || 0,
          closed: response.data.total.Closed || 0,
          cancelled: response.data.total.Cancelled || 0,
          follow_up: response.data.total["Follow Up"] || 0,
        }));
      }
    } catch (error) {
      console.log("Error", error); // TODO proper error
    }
  };

  const searchTicket = async (decode) => {
    try {
      let query = {};
      let response;
      if (decode.role == "manager") {
        query = {
          managerID: decode.id,
        };

        response = await axios.post("/ticket/filter_tickets_manager", query);
      }
      if (response.status === 200) {
        setMaintenanceRequestInfo((prev) => ({
          ...prev,
          total: response.data.total?.Total || 0,
          open: response.data.total?.Open || 0,
          completed: response.data.total?.Completed || 0,
          inprogress: response.data.total?.Inprogress || 0,
          unresolved: response.data.total?.Unresolved || 0,
        }));
      }
    } catch (error) {
      console.log(error); // TODO proper error
    }
  };

  const getAppointments = async (decode) => {
    let query = {
      manager_id: decode.id,
    };

    let res = await axios.post(
      "/user_appointment/get-pending-slot",
      JSON.stringify(query),
      {
        headers: {
          "Content-Type": "application/json",
        },
      }
    );
    const data = res.data;
    setAppointmentsInfo((prev) => ({
      ...prev,
      total: data?.total?.Total || 0,
      booked: data?.total?.booked || 0,
      pending: data?.total?.pending || 0,
      rejected: data?.total?.rejected || 0,
    }));
  };

  useEffect(() => {
    const fetchData = async () => {
      const decode = jwt_decode(window.localStorage.getItem("accessToken"));

      await getApplicants(`/applicant/list?page=1&limit=10`, {
        role: decode.role,
        managerID: decode.id,
      });

      await getLeads();
      await searchTicket(decode);
      await getAppointments(decode);
    };

    fetchData();
  }, []);

  // * Get Manager Pending slots end

  const ref = useRef();
  const activateParentDropdown = useCallback((item) => {
    item.classList.add("active");
    const parent = item.parentElement;
    const parent2El = parent.childNodes[1];
    if (parent2El && parent2El.id !== "side-menu") {
      parent2El.classList.add("mm-show");
    }

    if (parent) {
      parent.classList.add("mm-active");
      const parent2 = parent.parentElement;

      if (parent2) {
        parent2.classList.add("mm-show"); // ul tag

        const parent3 = parent2.parentElement; // li tag

        if (parent3) {
          parent3.classList.add("mm-active"); // li
          parent3.childNodes[0].classList.add("mm-active"); //a
          const parent4 = parent3.parentElement; // ul
          if (parent4) {
            parent4.classList.add("mm-show"); // ul
            const parent5 = parent4.parentElement;
            if (parent5) {
              parent5.classList.add("mm-show"); // li
              parent5.childNodes[0].classList.add("mm-active"); // a tag
            }
          }
        }
      }
      scrollElement(item);
      return false;
    }
    scrollElement(item);
    return false;
  }, []);

  // Use ComponentDidMount and ComponentDidUpdate method symultaniously
  useEffect(() => {
    const pathName = props.location.pathname;

    const initMenu = () => {
      new MetisMenu("#side-menu");
      let matchingMenuItem = null;
      const ul = document.getElementById("side-menu");
      const items = ul.getElementsByTagName("a");
      for (let i = 0; i < items.length; ++i) {
        if (pathName === items[i].pathname) {
          matchingMenuItem = items[i];
          break;
        }
      }
      if (matchingMenuItem) {
        activateParentDropdown(matchingMenuItem);
      }
    };
    initMenu();
  }, [props.location.pathname, activateParentDropdown]);

  useEffect(() => {
    ref.current.recalculate();
  });

  function scrollElement(item) {
    if (item) {
      const currentPosition = item.offsetTop;
      if (currentPosition > window.innerHeight) {
        ref.current.getScrollElement().scrollTop = currentPosition - 300;
      }
    }
  }

  if (window.localStorage.getItem("accessToken")) {
    // Checking for the token for expire
    const decode = jwt_decode(window.localStorage.getItem("accessToken"));
    const expDate = new Date(decode.exp * 1000);
    if (Date.now() > expDate) {
      // remove old localstorage data
      window.localStorage.removeItem("role");
      window.localStorage.removeItem("accessToken");
      // redirect to login
      window.location.replace("/login");
    }

    const role = window.localStorage.getItem("role");
    const user =
      JSON.parse(window.localStorage.getItem("authUser"))?.userData?.company ||
      "GSK";
    if (role === "admin") {
      return (
        <React.Fragment>
          <SimpleBar style={{ maxHeight: "100%" }} ref={ref}>
            <div id="sidebar-menu">
              <ul
                className={` list-unstyled metismenu-${props.companyClass}`}
                id="side-menu"
              >
                {/* <li className="facilities-li">
                  <Link to="/dashboard" className="">
                    <FeatherIcon icon="grid" />
                    <span>{props.t("Dashboard")}</span>
                  </Link>
                </li> */}

                <li className="facilities-li">
                  <Link to="/company" className="">
                    <FeatherIcon icon="briefcase" />
                    <span>{props.t("Companies")}</span>
                  </Link>
                </li>
                {/* <li>
                  <Link to="/#" className="has-arrow ">
                    <FeatherIcon icon="home" />
                    <span>{props.t("Properties")}</span>
                  </Link>
                  <ul className="sub-menu">
                    <li>
                      <Link to="/property">{props.t("Property")}</Link>
                    </li>

                    <li>
                      <Link to="/property_manager">
                        {props.t("Property Manager")}
                      </Link>
                    </li>
                  </ul>
                </li> */}

                {/* <li>
                  <Link to="/#" className="has-arrow ">
                    <FeatherIcon icon="edit" />
                    <span>{props.t("Resident Applications")}</span>
                  </Link>
                  <ul className="sub-menu">
                    <li>
                      <Link to="/resident_application">
                        {props.t("Resident Applications")}
                      </Link>
                    </li>
                  </ul>
                </li> */}
                <li>
                  <Link to="/#" className="has-arrow ">
                    <FeatherIcon icon="briefcase" />
                    <span>{props.t("RDCare Leads")}</span>
                  </Link>
                  <ul className="sub-menu">
                    <li>
                      <Link to="/viewRentdigiLeads">
                        {props.t("View Leads")}
                      </Link>
                    </li>
                  </ul>
                </li>
                <li>
                  <Link to="/#" className="has-arrow ">
                    <FeatherIcon icon="file-text" />
                    <span>{props.t("RDCare Blogs")}</span>
                  </Link>
                  <ul className="sub-menu">
                    <li>
                      <Link to="/addblog">{props.t("Add Blogs")}</Link>
                    </li>
                    <li>
                      <Link to="/blog">{props.t("Blog List")}</Link>
                    </li>
                    <li>
                      <Link to="/editblog">{props.t("Edit Blog")}</Link>
                    </li>
                  </ul>
                </li>

                <li>
                  <Link to="/#" className="has-arrow ">
                    <FeatherIcon icon="file-text" />
                    <span>{props.t("RDCare Newsletters")}</span>
                  </Link>
                  <ul className="sub-menu">
                    <li>
                      <Link to="/newsletters">
                        {props.t("View Newsletters")}
                      </Link>
                    </li>
                  </ul>
                </li>

                <li>
                  <ul className="sub-menu">
                    <li>
                      <Link to="/vendor-specialty">
                        {props.t("Vendor Speciality")}
                      </Link>
                    </li>
                  </ul>
                </li>
                <li className="facilities-li">
                  <a
                    target="_blank"
                    href="http://sms.rentdigicare.com/admin"
                    className=""
                    rel="noreferrer"
                  >
                    <FeatherIcon icon="message-square" />
                    <span>{props.t("RDCare SMS")}</span>
                  </a>
                </li>
              </ul>
            </div>
          </SimpleBar>
        </React.Fragment>
      );
    } else if (role === "company") {
      return (
        <React.Fragment>
          <SimpleBar style={{ maxHeight: "100%" }} ref={ref}>
            <div id="sidebar-menu">
              <ul
                className={` list-unstyled metismenu-${props.companyClass}`}
                id="side-menu"
              >
                {/* <li className="menu-title">{props.t("Dashboard")} </li> */}
                <li>
                  <Link to="/dashboard" className="">
                    <FeatherIcon icon="grid" />
                    <span>{props.t("Dashboard")}</span>
                  </Link>
                </li>

                <li className="facilities-li">
                  <Link to="/#" className="has-arrow ">
                    <FeatherIcon icon="home" />
                    <span>{props.t("Properties")}</span>
                  </Link>
                  <ul className="sub-menu">
                    {/* <li>
                        <Link to="/facilities">{props.t("Company")}</Link>
                      </li> */}

                    <li>
                      <Link to="/property_layout">
                        {props.t("Property Layout")}
                      </Link>
                    </li>
                    <li>
                      <Link to="/property">{props.t("Property")}</Link>
                    </li>

                    <li>
                      <Link to="/property_manager">
                        {props.t("Property Manager")}
                      </Link>
                    </li>
                    {/* <li>
                        <Link to="/manager_profile">{props.t("Manager Profile")}</Link>
                      </li> */}
                    {/* <li>
                        <Link to="/resident_applicant">{props.t("Resident Applicant")}</Link>
                      </li> */}
                  </ul>
                </li>

                <li>
                  <Link to="/#" className="has-arrow ">
                    <FeatherIcon icon="calendar" />
                    <span>{props.t("Calendar")}</span>
                  </Link>
                  <ul className="sub-menu">
                    {/* <li>
                        <Link to="/manager_profile">{props.t("Manager Profile")}</Link>
                      </li> */}
                    <li>
                      <Link to="/calendar_reasons">
                        {props.t("Reason Types")}
                      </Link>
                    </li>
                    <li>
                      <Link to="/calender_availabilty">
                        {props.t("Availability")}
                      </Link>
                    </li>
                    <li>
                      <Link to="/appointments">
                        {props.t("Approve Appointments")}
                        {dashboarddata.pendingSlots
                          ? ` ( ${
                              dashboarddata.pendingSlots.totalCount ?? 0
                            } Pending )`
                          : null}
                      </Link>
                    </li>
                    <li>
                      <Link to="/apps-calendar">
                        {props.t("Calendar View")}
                      </Link>
                    </li>
                    {decode.company == "GSK Properties" && (
                      <li>
                        <Link to="/calendar-reports">Management Reports</Link>
                      </li>
                    )}
                  </ul>
                </li>

                <li>
                  <Link to="/#" className="has-arrow ">
                    <FeatherIcon icon="file-text" />
                    <span>{props.t("Maintenance Request")} </span>
                  </Link>
                  <ul className="sub-menu">
                    {/* <li>
                        <Link to="/manager_profile">{props.t("Manager Profile")}</Link>
                      </li> */}
                    <li>
                      <Link to="/tickets_list">
                        {props.t("View Request")}
                        {dashboarddata.maintenanceTickets
                          ? ` ( ${dashboarddata.maintenanceTickets} Open )`
                          : null}
                      </Link>
                    </li>
                    <li>
                      <Link to="/request_type">{props.t("Request Types")}</Link>
                    </li>
                    <li>
                      <Link to="/permissions">
                        {props.t("Entry Permissions")}
                      </Link>
                    </li>
                    <li>
                      <Link to="/emailnotification">
                        {props.t("Email Notification")}
                      </Link>
                    </li>
                  </ul>
                </li>

                <li>
                  <Link to="/#" className="has-arrow ">
                    <FeatherIcon icon="monitor" />
                    <span>{props.t("Maintenance Team")}</span>
                  </Link>
                  <ul className="sub-menu">
                    {/* <li>
                        <Link to="/manager_profile">{props.t("Manager Profile")}</Link>
                      </li> */}
                    <li>
                      <Link to="/technical_staff">
                        {props.t("View Maintenance Team")}
                      </Link>
                    </li>
                    <li>
                      <Link to="/add_specialities">
                        {props.t("Add Category")}
                      </Link>
                    </li>
                  </ul>
                </li>

                <li>
                  <Link to="/#" className="has-arrow ">
                    <FeatherIcon icon="users" />
                    <span>{props.t("Vendors")}</span>
                  </Link>
                  <ul className="sub-menu">
                    <li>
                      <Link to="/vendor-specialty">
                        {props.t("Add Category")}
                      </Link>
                    </li>
                    <li>
                      <Link to="/viewvendor">{props.t("View Vendors")}</Link>
                    </li>
                    <li>
                      <Link to="/vendors">{props.t("Approve Vendors")}</Link>
                    </li>
                  </ul>
                </li>
                {decode.company == "GSK Properties" && (
                  <li>
                    <Link to="/#" className="has-arrow ">
                      <FeatherIcon icon="briefcase" />
                      <span>{props.t("Leads")}</span>
                    </Link>
                    <ul className="sub-menu">
                      <li>
                        <Link to="/viewleads">{props.t("View Leads")}</Link>
                      </li>
                    </ul>
                  </li>
                )}

                {/*<li>*/}
                {/*  <Link to="/#" className="has-arrow ">*/}
                {/*    <FeatherIcon icon="share-2" />*/}
                {/*    <span>{props.t("All Maintenance Request")}</span>*/}
                {/*  </Link>*/}
                {/*  <ul className="sub-menu">*/}
                {/*    <li>*/}
                {/*      <Link to="/tickets_list">{props.t("Maintenance Request")}</Link>*/}
                {/*    </li>*/}
                {/*  </ul>*/}
                {/*</li>*/}
                {/*<li>*/}
                {/*  <Link to="/#" className="has-arrow ">*/}
                {/*    <FeatherIcon icon="share-2" />*/}
                {/*    <span>{props.t("Task Management")}</span>*/}
                {/*  </Link>*/}
                {/*  <ul className="sub-menu">*/}
                {/*    <li>*/}
                {/*      <Link to="/task_frnt">{props.t("Tasks")}</Link>*/}
                {/*    </li>*/}
                {/*  </ul>*/}
                {/*</li>*/}
                {/*<li>*/}
                {/*  <Link to="/#" className="has-arrow ">*/}
                {/*    <FeatherIcon icon="share-2" />*/}
                {/*    <span>{props.t("Vendors")}</span>*/}
                {/*  </Link>*/}
                {/*  <ul className="sub-menu">*/}
                {/*    <li>*/}
                {/*      <Link to="/assets">{props.t("Assets")}</Link>*/}
                {/*    </li>*/}
                {/*    <li>*/}
                {/*      <Link to="/parts">{props.t("Parts")}</Link>*/}
                {/*    </li>*/}
                {/*    <li>*/}
                {/*      <Link to="/vendor_cat">{props.t("Vendor Category")}</Link>*/}
                {/*    </li>*/}
                {/*    <li>*/}
                {/*      <Link to="/vendors">{props.t("Vendors")}</Link>*/}
                {/*    </li>*/}
                {/*    <li>*/}
                {/*      <Link to="/contact">{props.t("Contacts")}</Link>*/}
                {/*    </li>*/}
                {/*    <li>*/}
                {/*      <Link to="/space_center">{props.t("Space Center")}</Link>*/}
                {/*    </li>*/}
                {/*  </ul>*/}
                {/*</li>*/}
                {/*<li>*/}
                {/*  <Link to="/#" className="has-arrow ">*/}
                {/*    <FeatherIcon icon="share-2" />*/}
                {/*    <span>{props.t("Appointments")}</span>*/}
                {/*  </Link>*/}
                {/*  <ul className="sub-menu">*/}
                {/*    <li>*/}
                {/*      <Link to="/schedule">{props.t("Schedule")}</Link>*/}
                {/*    </li>*/}
                {/*    <li>*/}
                {/*      <Link to="/chart">{props.t("Chart")}</Link>*/}
                {/*    </li>*/}
                {/*    /!* <li>*/}
                {/*            <Link to="/planner">{props.t("Planner")}</Link>*/}
                {/*        </li> *!/*/}
                {/*    <li>*/}
                {/*      <Link to="/calender_sec">{props.t("Calendar")}</Link>*/}
                {/*    </li>*/}
                {/*  </ul>*/}
                {/*</li>*/}
                <li>
                  <Link to="/#" className="has-arrow ">
                    <FeatherIcon icon="edit" />
                    <span>{props.t("Resident Applications")}</span>
                  </Link>
                  <ul className="sub-menu">
                    {/* <li>
                        <Link to="/manager_profile">{props.t("Manager Profile")}</Link>
                      </li> */}
                    <li>
                      <Link to="/resident_application">
                        {props.t("Resident Applications")}
                        {dashboarddata.residentApplications
                          ? ` ( ${dashboarddata.residentApplications} Pending )`
                          : null}
                      </Link>
                    </li>
                    {/* <li>
                        <Link to="/user-profile">{props.t("User Profile")}</Link>
                      </li> */}
                    {/*<li>
                      <Link to="/visit_park">{props.t("Visitor Parking")}</Link>
                    </li>

                    <li>
                      <Link to="/parking_list">{props.t("Parking List")}</Link>
                    </li>*}

                    {/* <li>
                        <Link to="/pages-maintenance">{props.t("Maintance")}</Link>
                      </li>   */}
                  </ul>
                </li>

                <li className="facilities-li">
                  <Link to="/widget">
                    <FeatherIcon icon="settings" />
                    <span> {props.t("Widget Settings")}</span>
                  </Link>
                </li>
                <li className="facilities-li">
                  <a
                    target="_blank"
                    href="http://sms.rentdigicare.com"
                    className=""
                    rel="noreferrer"
                  >
                    <FeatherIcon icon="message-square" />
                    <span>{props.t(`${user} SMS`)}</span>
                  </a>
                </li>
              </ul>
            </div>
          </SimpleBar>
        </React.Fragment>
      );
    } else if (role === "manager") {
      //TODO here
      return (
        <React.Fragment>
          <SimpleBar style={{ maxHeight: "100%" }} ref={ref}>
            <div id="sidebar-menu">
              <ul
                className={` list-unstyled metismenu-${props.companyClass}`}
                id="side-menu"
              >
                <li>
                  <Link to="/dashboard" className="">
                    <FeatherIcon icon="grid" />
                    <span>{props.t("Dashboard")}</span>
                  </Link>
                </li>
                {/* <li className="menu-title">{props.t("Menu")} </li> */}
                {/* <li>
                    <Link to="/dashboard" className="">
                      <FeatherIcon
                        icon="home"
                      />
                      <span>{props.t("Dashboard")}</span>
                    </Link>
                  </li> */}

                {/* <li>
                    <Link to="/apps-chat" className="">
                      <FeatherIcon
                        icon="message-circle"
                      />
                      <span>{props.t("Chat")}</span>
                    </Link> */}
                {/* <ul className="sub-menu"> */}
                {/* <li>
                        <Link to="/apps-calendar">{props.t("Calendar")}</Link>
                      </li> */}
                {/* <li>
                        <Link to="/apps-chat">
                          {props.t("Chat")}
                        </Link>
                      </li> */}
                {/* <li>
                        <Link to="/#" className="has-arrow">
                          <span>{props.t("Email")}</span>
                        </Link>
                        <ul className="sub-menu">
                          <li>
                            <Link to="/email-inbox">{props.t("Inbox")}</Link>
                          </li>
                          <li>
                            <Link to="/email-read">{props.t("Read Email")} </Link>
                          </li>

                        </ul>
                      </li> */}
                {/* <li>
                        <Link to="/#" className="has-arrow">
                          <span>{props.t("Invoices")}</span>
                        </Link>
                        <ul className="sub-menu">
                          <li>
                            <Link to="/invoices-list">{props.t("Invoice List")}</Link>
                          </li>
                          <li>
                            <Link to="/invoices-detail">{props.t("Invoice Detail")}</Link>
                          </li>
                        </ul>
                      </li> */}
                {/* <li>
                        <Link to="/#" className="has-arrow ">
                          <span>{props.t("Contacts")}</span>
                        </Link>
                        <ul className="sub-menu">
                          <li>
                            <Link to="/contacts-grid">{props.t("User Grid")}</Link>
                          </li>
                          <li>
                            <Link to="/contacts-list">{props.t("User List")}</Link>
                          </li>
                          <li>
                            <Link to="/contacts-profile">{props.t("Profile")}</Link>
                          </li>
                        </ul>
                      </li> */}

                {/* </ul> */}
                {/* </li> */}

                {/* <li>
                    <Link to="/#" className="has-arrow">
                      <FeatherIcon
                        icon="users"
                      />
                      <span>{props.t("Authentication")}</span>
                    </Link>
                    <ul className="sub-menu">
                      <li>
                        <Link to="/page-login">{props.t("Login")}</Link>
                      </li>
                      <li>
                        <Link to="/page-register">{props.t("Register")}</Link>
                      </li>
                      <li>
                        <Link to="/page-recoverpw">
                          {props.t("Recover Password")}
                        </Link>
                      </li>
                      <li>
                        <Link to="/page-lock-screen">{props.t("Lock Screen")}</Link>
                      </li>
                      <li>
                        <Link to="/page-confirm-mail">{props.t("Confirm Mail")}</Link>
                      </li>
                      <li>
                        <Link to="/page-email-verification">
                          {props.t("Email Verification")}
                        </Link>
                      </li>
                      <li>
                        <Link to="/page-two-step-verification">
                          {props.t("Two Step Verification")}
                        </Link>
                      </li>
                    </ul>
                  </li> */}
                {/* <li>
                    <Link to="/#" className="has-arrow ">
                      <FeatherIcon
                        icon="file-text"
                      />
                      <span>{props.t("Pages")}</span>
                    </Link>
                    <ul className="sub-menu">
                      <li>
                        <Link to="/pages-starter">{props.t("Starter Page")}</Link>
                      </li>
                      <li>
                        <Link to="/pages-maintenance">{props.t("Maintenance")}</Link>
                      </li>
                      <li>
                        <Link to="/pages-comingsoon">{props.t("Coming Soon")}</Link>
                      </li>
                      <li>
                        <Link to="/pages-timeline">{props.t("Timeline")}</Link>
                      </li>
                      <li>
                        <Link to="/pages-faqs">{props.t("FAQs")}</Link>
                      </li>
                      <li>
                        <Link to="/pages-pricing">{props.t("Pricing")}</Link>
                      </li>
                      <li>
                        <Link to="/pages-404">{props.t("Error 404")}</Link>
                      </li>
                      <li>
                        <Link to="/pages-500">{props.t("Error 500")}</Link>
                      </li>
                    </ul>
                  </li> */}

                {/* <li className="menu-title">{props.t("Elements")}</li> */}

                {/* <li>
                    <Link to="/#" className="has-arrow ">
                      <i className="bx bx-tone"></i>
                      <span>{props.t("Components")}</span>
                    </Link>
                    <ul className="sub-menu">
                      <li>
                        <Link to="/ui-alerts">{props.t("Alerts")}</Link>
                      </li>
                      <li>
                        <Link to="/ui-buttons">{props.t("Buttons")}</Link>
                      </li>
                      <li>
                        <Link to="/ui-cards">{props.t("Cards")}</Link>
                      </li>
                      <li>
                        <Link to="/ui-carousel">{props.t("Carousel")}</Link>
                      </li>
                      <li>
                        <Link to="/ui-dropdowns">{props.t("Dropdowns")}</Link>
                      </li>
                      <li>
                        <Link to="/ui-grid">{props.t("Grid")}</Link>
                      </li>
                      <li>
                        <Link to="/ui-images">{props.t("Images")}</Link>
                      </li>
                      <li>
                        <Link to="/ui-modals">{props.t("Modals")}</Link>
                      </li>
                      <li>
                        <Link to="/ui-drawer">{props.t("Drawer")}</Link>
                      </li>
                      <li>
                        <Link to="/ui-progressbars">{props.t("Progress Bars")}</Link>
                      </li>
                      <li>
                        <Link to="/ui-tabs-accordions">
                          {props.t("Tabs & Accordions")}
                        </Link>
                      </li>
                      <li>
                        <Link to="/ui-typography">{props.t("Typography")}</Link>
                      </li>
                      <li>
                        <Link to="/ui-video">{props.t("Video")}</Link>
                      </li>
                      <li>
                        <Link to="/ui-general">{props.t("General")}</Link>
                      </li>
                      <li>
                        <Link to="/ui-colors">{props.t("Colors")}</Link>
                      </li>
                    </ul>
                  </li> */}

                {/* <li>
                    <Link to="/#" className="has-arrow ">
                      <FeatherIcon
                        icon="gift"
                      />
                      <span>{props.t("Extended")}</span>
                    </Link>
                    <ul className="sub-menu">
                      <li>
                        <Link to="/extended-lightbox">{props.t("Lightbox")}</Link>
                      </li>
                      <li>
                        <Link to="/extended-rangeslider">{props.t("Range Slider")}</Link>
                      </li>
                      <li>
                        <Link to="/extended-sweet-alert">{props.t("Sweet Alert")}</Link>
                      </li>
                      <li>
                        <Link to="/extended-session-timeout">{props.t("Session Timeout")}</Link>
                      </li>
                      <li>
                        <Link to="/extended-rating">{props.t("Rating")}</Link>
                      </li>
                      <li>
                        <Link to="/extended-notifications">{props.t("Notifications")}</Link>
                      </li>
                    </ul>
                  </li> */}

                {/* <li>
                    <Link to="/#" className="">
                      <FeatherIcon
                        icon="box"
                      />

                      <span>{props.t("Forms")}</span>
                    </Link>
                    <ul className="sub-menu">
                      <li>
                        <Link to="/form-elements">{props.t("Basic Elements")}</Link>
                      </li>
                      <li>
                        <Link to="/form-validation">
                          {props.t("Validation")}
                        </Link>
                      </li>
                      <li>
                        <Link to="/form-advanced">{props.t("Advanced Plugins")}</Link>
                      </li>
                      <li>
                        <Link to="/form-editors">{props.t("Editors")}</Link>
                      </li>
                      <li>
                        <Link to="/form-uploads">{props.t("File Upload")} </Link>
                      </li>
                      <li>
                        <Link to="/form-wizard">{props.t("Form Wizard")}</Link>
                      </li>
                      <li>
                        <Link to="/form-mask">{props.t("Form Mask")}</Link>
                      </li>
                    </ul>
                  </li> */}

                {/* <li>
                    <Link to="/#" className="has-arrow ">
                      <FeatherIcon
                        icon="sliders"
                      />
                      <span>{props.t("Tables")}</span>
                    </Link>
                    <ul className="sub-menu">
                      <li>
                        <Link to="/tables-basic">{props.t("Bootstrap Basic")}</Link>
                      </li>
                      <li>
                        <Link to="/tables-datatable">{props.t("DataTables")}</Link>
                      </li>
                      <li>
                        <Link to="/tables-responsive">
                          {props.t("Responsive")}
                        </Link>
                      </li>
                      <li>
                        <Link to="/tables-editable">{props.t("Editable")}</Link>
                      </li>
                    </ul>
                  </li> */}

                {/* <li>
                    <Link to="/#" className="has-arrow ">
                      <FeatherIcon
                        icon="pie-chart"
                      />
                      <span>{props.t("Charts")}</span>
                    </Link>

                    <ul className="sub-menu">
                      <li>
                        <Link to="/charts-apex">{props.t("Apexcharts")}</Link>
                      </li>
                      <li>
                        <Link to="/charts-echart">{props.t("Echarts")}</Link>
                      </li>
                      <li>
                        <Link to="/charts-chartjs">{props.t("Chartjs")}</Link>
                      </li>
                      <li>
                        <Link to="/charts-knob">{props.t("Jquery Knob")}</Link>
                      </li>
                      <li>
                        <Link to="/charts-sparkline">{props.t("Sparkline")}</Link>
                      </li>
                    </ul>
                  </li> */}

                {/* <li>
                    <Link to="/#" className="has-arrow ">
                      <FeatherIcon
                        icon="cpu"
                      />
                      <span>{props.t("Icons")}</span>
                    </Link>
                    <ul className="sub-menu">
                      <li>
                        <Link to="/icons-boxicons">{props.t("Boxicons")}</Link>
                      </li>
                      <li>
                        <Link to="/icons-materialdesign">
                          {props.t("Material Design")}
                        </Link>
                      </li>
                      <li>
                        <Link to="/icons-dripicons">{props.t("Dripicons")}</Link>
                      </li>
                      <li>
                        <Link to="/icons-fontawesome">{props.t("Font awesome")}</Link>
                      </li>
                    </ul>
                  </li> */}

                {/* <li>
                    <Link to="/#" className="has-arrow ">
                      <FeatherIcon
                        icon="map"
                      />
                      <span>{props.t("Maps")}</span>
                    </Link>
                    <ul className="sub-menu">
                      <li>
                        <Link to="/maps-google">{props.t("Google")}</Link>
                      </li>
                      <li>
                        <Link to="/maps-vector">{props.t("Vector")}</Link>
                      </li>
                      <li>
                        <Link to="/maps-leaflet">{props.t("Leaflet")}</Link>
                      </li>
                    </ul>
                  </li> */}

                {/* <li>
                    <Link to="/#" className="has-arrow ">
                      <FeatherIcon
                        icon="share-2"
                      />
                      <span>{props.t("Multi Level")}</span>
                    </Link>
                    <ul className="sub-menu">
                      <li>
                        <Link to="/#">{props.t("Level 1.1")}</Link>
                      </li>
                      <li>
                        <Link to="/#" className="has-arrow">
                          {props.t("Level 1.2")}
                        </Link>
                        <ul className="sub-menu">
                          <li>
                            <Link to="/#">{props.t("Level 2.1")}</Link>
                          </li>
                          <li>
                            <Link to="/#">{props.t("Level 2.2")}</Link>
                          </li>
                        </ul>
                      </li>
                    </ul>
                  </li> */}
                <li className="facilities-li">
                  <Link to="/#" className="has-arrow ">
                    <FeatherIcon icon="home" />
                    <span>{props.t("Properties")}</span>
                  </Link>
                  <ul className="sub-menu">
                    {/* <li>
                        <Link to="/facilities">{props.t("Company")}</Link>
                      </li> */}
                    <li>
                      <Link to="/property">{props.t("Property")}</Link>
                    </li>
                    {/*<li>*/}
                    {/*  <Link to="/building_area">*/}
                    {/*    {props.t("Building Area")}*/}
                    {/*  </Link>*/}
                    {/*</li>*/}
                    {/*/!* <li>*/}
                    {/*  <Link to="/floors">{props.t("Floors")}</Link>*/}
                    {/*</li> *!/*/}
                    {/*<li>*/}
                    {/*  <Link to="/rooms">{props.t("Rooms")}</Link>*/}
                    {/*</li>*/}
                    {/*<li>*/}
                    {/*  <Link to="/task_types">{props.t("Task Types")}</Link>*/}
                    {/*</li>*/}
                    {/*<li>*/}
                    {/*  <Link to="/task_class">{props.t("Task Class")}</Link>*/}
                    {/*</li>*/}

                    {/*<li>*/}
                    {/*  <Link to="/property_manager">*/}
                    {/*    {props.t("Property Manager")}*/}
                    {/*  </Link>*/}
                    {/*</li>*/}
                    {/* <li>
                        <Link to="/manager_profile">{props.t("Manager Profile")}</Link>
                      </li> */}
                    {/* <li>
                        <Link to="/resident_applicant">{props.t("Resident Applicant")}</Link>
                      </li> */}
                  </ul>
                </li>

                <li>
                  <Link to="/#" className="has-arrow ">
                    <FeatherIcon icon="users" />
                    <span>{props.t("Vendors")}</span>
                  </Link>
                  <ul className="sub-menu">
                    <li>
                      <Link to="/viewvendor">{props.t("View Vendors")}</Link>
                    </li>
                  </ul>
                </li>
                <li>
                  <Link to="/#" className="has-arrow ">
                    <FeatherIcon icon="monitor" />
                    <span>{props.t("Maintenance Team")}</span>
                  </Link>
                  <ul className="sub-menu">
                    <li>
                      <Link to="/technical_staff">
                        {props.t("View Maintenance Team")}
                      </Link>
                    </li>
                  </ul>
                </li>

                {/*<li>*/}
                {/*  <Link to="/#" className="has-arrow ">*/}
                {/*    <FeatherIcon icon="share-2" />*/}
                {/*    <span>{props.t("All Maintenance Request")}</span>*/}
                {/*  </Link>*/}
                {/*  <ul className="sub-menu">*/}
                {/*    <li>*/}
                {/*      <Link to="/tickets_list">{props.t("Maintenance Request")}</Link>*/}
                {/*    </li>*/}
                {/*  </ul>*/}
                {/*</li>*/}
                {/*<li>*/}
                {/*  <Link to="/#" className="has-arrow ">*/}
                {/*    <FeatherIcon icon="share-2" />*/}
                {/*    <span>{props.t("Task Management")}</span>*/}
                {/*  </Link>*/}
                {/*  <ul className="sub-menu">*/}
                {/*    <li>*/}
                {/*      <Link to="/task_frnt">{props.t("Tasks")}</Link>*/}
                {/*    </li>*/}
                {/*  </ul>*/}
                {/*</li>*/}
                {/*<li>*/}
                {/*  <Link to="/#" className="has-arrow ">*/}
                {/*    <FeatherIcon icon="share-2" />*/}
                {/*    <span>{props.t("Vendors")}</span>*/}
                {/*  </Link>*/}
                {/*  <ul className="sub-menu">*/}
                {/*    <li>*/}
                {/*      <Link to="/assets">{props.t("Assets")}</Link>*/}
                {/*    </li>*/}
                {/*    <li>*/}
                {/*      <Link to="/parts">{props.t("Parts")}</Link>*/}
                {/*    </li>*/}
                {/*    <li>*/}
                {/*      <Link to="/vendor_cat">{props.t("Vendor Category")}</Link>*/}
                {/*    </li>*/}
                {/*    <li>*/}
                {/*      <Link to="/vendors">{props.t("Vendors")}</Link>*/}
                {/*    </li>*/}
                {/*    <li>*/}
                {/*      <Link to="/contact">{props.t("Contacts")}</Link>*/}
                {/*    </li>*/}
                {/*    <li>*/}
                {/*      <Link to="/space_center">{props.t("Space Center")}</Link>*/}
                {/*    </li>*/}
                {/*  </ul>*/}
                {/*</li>*/}
                {/*<li>*/}
                {/*  <Link to="/#" className="has-arrow ">*/}
                {/*    <FeatherIcon icon="share-2" />*/}
                {/*    <span>{props.t("Appointments")}</span>*/}
                {/*  </Link>*/}
                {/*  <ul className="sub-menu">*/}
                {/*    <li>*/}
                {/*      <Link to="/schedule">{props.t("Schedule")}</Link>*/}
                {/*    </li>*/}
                {/*    <li>*/}
                {/*      <Link to="/chart">{props.t("Chart")}</Link>*/}
                {/*    </li>*/}
                {/*    /!* <li>*/}
                {/*          <Link to="/planner">{props.t("Planner")}</Link>*/}
                {/*      </li> *!/*/}
                {/*    <li>*/}
                {/*      <Link to="/calender_sec">{props.t("Calendar")}</Link>*/}
                {/*    </li>*/}
                {/*  </ul>*/}
                {/*</li>*/}

                {decode.applicationPrivilege && (
                  <li>
                    <Link to="/#" className="has-arrow ">
                      <FeatherIcon icon="edit" />
                      <span>{props.t("Resident Applications")}</span>
                    </Link>
                    <ul className="sub-menu">
                      <li>
                        <Link to="/resident_application">
                          {`${props.t("Resident Applications")}`}
                          <br />
                          {`${
                            residentApplicationInfo &&
                            `${residentApplicationInfo.Pending} Pending`
                          }`}
                        </Link>
                      </li>
                    </ul>
                  </li>
                )}
                {decode.calendarPrivilege && (
                  <li>
                    <Link to="/#" className="has-arrow ">
                      <FeatherIcon icon="calendar" />
                      <span>{props.t("Calendar")}</span>
                    </Link>
                    <ul className="sub-menu">
                      {/* <li>
                        <Link to="/manager_profile">{props.t("Manager Profile")}</Link>
                      </li> */}
                      <li>
                        <Link to="/apps-calendar">
                          {props.t("Calendar View")}
                        </Link>
                      </li>
                      <li>
                        <Link to="/calender_availabilty">
                          {props.t("Availability")}
                        </Link>
                      </li>
                      <li>
                        <Link to="/appointments">
                          {props.t("Appointments")}
                          <br />
                          {appointmentsInfo &&
                          appointmentsInfo.pending !== null &&
                          appointmentsInfo.pending !== undefined &&
                          appointmentsInfo.pending !== 0
                            ? `${appointmentsInfo.pending} Pending`
                            : `0 Pending`}
                        </Link>
                      </li>
                    </ul>
                  </li>
                )}
                {decode.ticketPrivilege && (
                  <>
                    <li>
                      <Link to="/#" className="has-arrow ">
                        <FeatherIcon icon="file-text" />
                        <span>{props.t("Maintenance Request")}</span>
                      </Link>
                      <ul className="sub-menu">
                        <li>
                          <Link to="/tickets_list">
                            {props.t("View Request")}
                            <br />
                            {`${
                              maintenanceRequestInfo &&
                              `${maintenanceRequestInfo.open} Open`
                            }`}
                          </Link>
                        </li>
                      </ul>
                    </li>
                    {/* <li>
                      <Link to="/apps-chat" className="">
                        <FeatherIcon icon="message-circle" />
                        <span>{props.t("Chat")}</span>
                      </Link>
                    </li> */}
                  </>
                )}
                {decode.managerOf == "https://www.gskproperties.ca/" && (
                  <li>
                    <Link to="/#" className="has-arrow ">
                      <FeatherIcon icon="briefcase" />
                      <span>{props.t("Leads")}</span>
                    </Link>
                    <ul className="sub-menu">
                      <li>
                        <Link to="/viewleads">
                          {props.t("View Leads")}
                          <br />
                          {`${
                            viewLeadsInfo && `${viewLeadsInfo.pending} Pending`
                          }`}
                        </Link>
                      </li>
                    </ul>
                  </li>
                )}
                {/* <li>
                  <Link to="/apps-chat" >
                    <FeatherIcon icon="share-2" />
                    <span>{props.t("Chat")}</span>
                  </Link>

                </li> */}

                {/*<li>*/}
                {/*  <Link to="/widget_settings">*/}
                {/*    <FeatherIcon icon="share-2" />*/}
                {/*    {props.t("Widget Settings")}*/}
                {/*  </Link>*/}
                {/*</li>*/}
              </ul>
            </div>
          </SimpleBar>
        </React.Fragment>
      );
    } else if (role === "customer") {
      return (
        <React.Fragment>
          <SimpleBar style={{ maxHeight: "100%" }} ref={ref}>
            <div id="sidebar-menu">
              <ul
                className={` list-unstyled metismenu-${props.companyClass}`}
                id="side-menu"
              >
                <li>
                  <Link to="/#" className="has-arrow ">
                    <FeatherIcon icon="file-text" />
                    <span>{props.t("Maintenance Request")}</span>
                  </Link>
                  <ul className="sub-menu">
                    {/* <li>
                        <Link to="/manager_profile">{props.t("Manager Profile")}</Link>
                      </li> */}
                    <li>
                      <Link to="/ticket_manager">
                        {props.t("Create Request")}
                      </Link>
                    </li>
                    <li>
                      <Link to="/tickets_list">{props.t("View Requests")}</Link>
                    </li>
                  </ul>
                </li>

                {/* <li>
                  <Link to="/#" className="has-arrow ">
                    <FeatherIcon icon="calendar" />
                    <span>{props.t("Calendar")}</span>
                  </Link>
                  <ul className="sub-menu">
                    <li>
                        <Link to="/manager_profile">{props.t("Manager Profile")}</Link>
                      </li>
                    <li>
                      <Link to="/apps-calendar">
                        {props.t("Calendar View")}
                      </Link>
                    </li>
                  </ul>
                </li> */}
                {/* <li>
                  <Link to="/apps-chat">
                    <FeatherIcon icon="message-circle" />
                    <span>{props.t("Chat")}</span>
                  </Link>
                </li> */}
                {/* <li>
                  <Link to="/transactions_list" >
                    <FeatherIcon icon="share-2" />
                    <span>{props.t("Transactions")}</span>
                  </Link>
                </li> */}
              </ul>
            </div>
          </SimpleBar>
        </React.Fragment>
      );
    } else if (role === "vendor") {
      return (
        <React.Fragment>
          <SimpleBar style={{ maxHeight: "100%" }} ref={ref}>
            <div id="sidebar-menu">
              <ul
                className={` list-unstyled metismenu-${props.companyClass}`}
                id="side-menu"
              >
                <li>
                  <Link to="/#" className="has-arrow ">
                    <FeatherIcon icon="file-text" />
                    <span>{props.t("Maintenance Request")}</span>
                  </Link>
                  <ul className="sub-menu">
                    {/* <li>
                        <Link to="/manager_profile">{props.t("Manager Profile")}</Link>
                      </li> */}

                    <li>
                      <Link to="/working-tickets">
                        {props.t("Working Request")}
                      </Link>
                    </li>
                    {/* <li>
                      <Link to="/general-tickets">
                        {props.t("General Request")}
                      </Link>
                    </li>
                    <li>
                      <Link to="/specific-tickets">
                        {props.t("Specific Request")}
                      </Link>
                    </li> */}
                    {/* <li>
                      <Link to="/vendor_tickets">{props.t("View Maintenance Request")}</Link>
                    </li> */}
                  </ul>
                </li>

                {/* <li>
                  <Link to="/#" className="has-arrow ">
                    <FeatherIcon icon="calendar" />
                    <span>{props.t("Calendar")}</span>
                  </Link>
                  <ul className="sub-menu"> */}
                {/* <li>
                        <Link to="/manager_profile">{props.t("Manager Profile")}</Link>
                      </li> */}
                {/* <li>
                      <Link to="/apps-calendar">
                        {props.t("Calendar View")}
                      </Link>
                    </li>
                  </ul>
                </li> */}
                {/* <li>
                  <Link to="/apps-chat" >
                    <FeatherIcon icon="share-2" />
                    <span>{props.t("Chat")}</span>
                  </Link>

                </li> */}
              </ul>
            </div>
          </SimpleBar>
        </React.Fragment>
      );
    } else if (role === "technical staff") {
      return (
        <React.Fragment>
          <SimpleBar style={{ maxHeight: "100%" }} ref={ref}>
            <div id="sidebar-menu">
              <ul
                className={` list-unstyled metismenu-${props.companyClass}`}
                id="side-menu"
              >
                <li>
                  <Link to="/#" className="has-arrow ">
                    <FeatherIcon icon="file-text" />
                    <span>{props.t("Maintenance Request")}</span>
                  </Link>
                  <ul className="sub-menu">
                    {/* <li>
                        <Link to="/manager_profile">{props.t("Manager Profile")}</Link>
                      </li> */}
                    <li>
                      <Link to="/technical_staff_tickets">
                        {props.t("View Maintenance Request")}
                      </Link>
                    </li>
                  </ul>
                </li>
                {/* <li>
                  <Link to="/#" className="has-arrow ">
                    <FeatherIcon icon="calendar" />
                    <span>{props.t("Calendar")}</span>
                  </Link>
                  <ul className="sub-menu">
                  
                    <li>
                      <Link to="/apps-calendar">
                        {props.t("Calendar View")}
                      </Link>
                    </li>
                  </ul>
                </li> */}
              </ul>
            </div>
          </SimpleBar>
        </React.Fragment>
      );
    } else if (role === "technical staff") {
      return (
        <React.Fragment>
          <SimpleBar style={{ maxHeight: "100%" }} ref={ref}>
            <div id="sidebar-menu">
              <ul
                className={` list-unstyled metismenu-${props.companyClass}`}
                id="side-menu"
              >
                <li>
                  <Link to="/#" className="has-arrow ">
                    <FeatherIcon icon="share-2" />
                    <span>{props.t("Maintenance Request")}</span>
                  </Link>
                  <ul className="sub-menu">
                    {/* <li>
                        <Link to="/manager_profile">{props.t("Manager Profile")}</Link>
                      </li> */}
                    <li>
                      <Link to="/technical_staff_tickets">
                        {props.t("View Request")}
                      </Link>
                    </li>
                  </ul>
                </li>
              </ul>
            </div>
          </SimpleBar>
        </React.Fragment>
      );
    } else {
      return <h1>last one</h1>;
    }
  } else {
    window.location.replace("/login");
  }
};

SidebarContent.propTypes = {
  location: PropTypes.object,
  t: PropTypes.any,
};

export default withRouter(withTranslation()(SidebarContent));
