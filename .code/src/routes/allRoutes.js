import React from "react";
import { Redirect } from "react-router-dom";

//Home
import Home from "../pages/LandingPage/Home/Home";

//Dashboard
import Dashboard from "../pages/Dashboard/index";

// Calendar
import Calendar from "../pages/Calendar/index";
import Calender_availabilty from "../pages/Calendar/calender_availabilty";

// // Calendar 1
// import Calendar1 from "../pages/Calendar1/index";
// import Calender_availabilty1 from "../pages/Calendar1/calender_availabilty"

import Calendarurl from "../pages/Calendar/calendar";
import Appointment from "../pages/Calendar/Appointments";
//Chat
import Chat from "../pages/Chat/Chat";

//Email
import EmailInbox from "../pages/Email/email-inbox";
import EmailRead from "../pages/Email/email-read";

//Invoice
import InvoicesList from "../pages/Invoices/invoices-list";
import InvoiceDetail from "../pages/Invoices/invoices-detail";

//Contact
import ContactsGrid from "../pages/Contacts/contacts-grid";
import ContactsList from "../pages/Contacts/ContactList/contacts-list";
import ContactsProfile from "../pages/Contacts/ContactsProfile/contacts-profile";

//Utility
import PagesStarter from "../pages/Utility/StarterPage";
import PageMaintenance from "../pages/Utility/PageMaintenance";
import PagesComingsoon from "../pages/Utility/PageComingsoon";
import PageTimeline from "../pages/Utility/PageTimeline";
import PageFaqs from "../pages/Utility/PageFaqs";
import PagePricing from "../pages/Utility/PagePricing/index";
import Error404 from "../pages/Utility/Error404";
import Error500 from "../pages/Utility/Error500";

// Ui Components
import UiAlert from "../pages/UiElements/UiAlert";
import UiButton from "../pages/UiElements/UiButton";
import UiCard from "../pages/UiElements/UiCard";
import UiCarousel from "../pages/UiElements/UiCarousel";
import UiDropdowns from "../pages/UiElements/UiDropdowns";
import UiGrid from "../pages/UiElements/UiGrid";
import UiImages from "../pages/UiElements/UiImages";
import UiModal from "../pages/UiElements/UiModals";
import UiDrawer from "../pages/UiElements/UiDrawer";
import UiProgressbar from "../pages/UiElements/UiProgressbar";
import UiTabsAccordions from "../pages/UiElements/UiTabsAccordions";
import UiTypography from "../pages/UiElements/UiTypography";
import UiVideo from "../pages/UiElements/UiVideo";
import UiGeneral from "../pages/UiElements/UiGeneral";
import UiColors from "../pages/UiElements/UiColors";

//Extended pages
import Lightbox from "../pages/Extended/Lightbox";
import Rangeslider from "../pages/Extended/Rangeslider";
import SweetAlert from "../pages/Extended/SweetAlert";
import SessionTimeout from "../pages/Extended/SessionTimeout";
import UiRating from "../pages/Extended/UiRating";
import Notifications from "../pages/Extended/Notifications";

//Forms
import FormElements from "../pages/Forms/FormElements/index";
import FormValidation from "../pages/Forms/FormValidation/";
import AdvancedPlugins from "../pages/Forms/AdvancedPlugins";
import FormEditors from "../pages/Forms/FormEditors";
import FormUpload from "../pages/Forms/FormUpload";
import FormWizard from "../pages/Forms/FormWizard";
import FormMask from "../pages/Forms/FormMask";

//Tables
import BasicTable from "../pages/Tables/BasicTables";
import DatatableTables from "../pages/Tables/DatatableTables";
import ResponsiveTables from "../pages/Tables/ResponsiveTables";
import EditableTables from "../pages/Tables/EditableTables";

//Charts
import Apexchart from "../pages/Charts/Apexcharts";
import EChart from "../pages/Charts/EChart";
import ChartjsChart from "../pages/Charts/ChartjsChart";
import KnobCharts from "../pages/Charts/KnobCharts";
import SparklineChart from "../pages/Charts/SparklineChart";

//Icons
import IconBoxicons from "../pages/Icons/IconBoxicons";
import IconMaterialdesign from "../pages/Icons/IconMaterialdesign";
import IconDripicons from "../pages/Icons/IconDripicons";
import IconFontawesome from "../pages/Icons/IconFontawesome";

// Maps
import MapsGoogle from "../pages/Maps/MapsGoogle";
import MapsVector from "../pages/Maps/MapsVector";
import MapsLeaflet from "../pages/Maps/MapsLeaflet";

// Authentication related pages
import Login from "../pages/Authentication/Login";
import Logout from "../pages/Authentication/Logout";
import SuperAdminLogin from "../pages/Authentication/SuperAdminLogin";
import Register from "../pages/Authentication/Register";
import ForgetPwd from "../pages/Authentication/ForgetPassword";
import ChangePassword from "../pages/Authentication/ChangePassword";
import TwooFa from "../pages/Authentication/TwooFa";
import comfirmPassword from "../pages/Authentication/comfirmPassword";

//AuthenticationInner related pages
import PageLogin from "../pages/AuthenticationInner/PageLogin";
import PageRegister from "../pages/AuthenticationInner/PageRegister";
import RecoverPassword from "../pages/AuthenticationInner/RecoverPassword";
import LockScreen from "../pages/AuthenticationInner/LockScreen";
import ConfirmMail from "../pages/AuthenticationInner/ConfirmMail";
import EmailVerification from "../pages/AuthenticationInner/EmailVerification";
import TwoStepVerfication from "../pages/AuthenticationInner/TwoStepVerfication";
import userProfile from "../pages/Authentication/user-profile";

//Project Related pages
import AddProperty from "../pages/digi/add_property";
import Layout from "../pages/digi/layout";
import Facilities from "../pages/digi/facilities";
import TaskTypes from "../pages/digi/task_types";
import TaskClass from "../pages/digi/task_class";
import BuildingArea from "../pages/digi/building_area";
import TaskFrnt from "../pages/digi/task_frnt";
import Floors from "../pages/digi/floors";
import Room from "../pages/digi/rooms";
import Setting from "../pages/digi/setting";
import disable2fa from "../pages/digi/disable2fa";
import Address from "../pages/digi/address";
import Assets from "../pages/digi/assets";
import Parts from "../pages/digi/parts";
import Vendors from "../pages/digi/vendors";
import ViewVendor from "../pages/digi/ViewVendor";
import ViewLeads from "../pages/digi/ViewLeads";
import ViewRentDigiLeads from "../pages/digi/ViewRentdigiLeads";

import Contact from "../pages/digi/contact";
import SpaceCenter from "../pages/digi/space_center";
import AssetClass from "../pages/digi/asset_class";
import UserAccount from "../pages/digi/user_account";
import CompsDetail from "../pages/digi/comps_detail";

import Widget from "../pages/digi/widget";
//Application
import PropertyManager from "../pages/digi/property_manager";
import ManagerProfile from "../pages/digi/manager_profile";
import ResidentApplication from "../pages/digi/resident_application";
import ResidentApplicant from "../pages/digi/resident_applicant";
import ApplicantInformation from "../pages/digi/ApplicantInformation";
import Schedule from "../pages/digi/schedule";
import Chart from "../pages/digi/chart";
import CalenderSec from "../pages/digi/calender_sec";
import VendorCat from "../pages/digi/vendor_cat";
import TicketList from "../pages/digi/tickets_list";
import Applicant from "../pages/digi/applicant";
//Ticket Form
import TicketManager from "../pages/digi/ticket_manager";
import VisitPark from "../pages/digi/visit_park";

// Widget Setting
import WidgetSettings from "../pages/digi/widget";
import TransactionsList from "../pages/digi/transactions";
import VendorSpecialty from "../pages/vendors/vendorSpecialty";
import ApproveQuotedTicket from "../pages/digi/approve_quoted_ticket";
import VendorApplication from "../pages/vendors/vendorApplication";
import AddLead from "../pages/Leads/addLead";
import GeneralTickets from "../pages/vendors/generalTickets";
import WorkingTickets from "../pages/vendors/workingTickets";
import SpecificTickets from "../pages/vendors/specificTickets";
import TechnicalStaff from "../pages/digi/technical_staff";
import TechnicalStaffTickets from "../pages/TechnicalStaff/tickets";

import AddRequestType from "../pages/digi/add_request_type";
import EmailNotification from "../pages/digi/Email_Notification";
import AddSpecialities from "../pages/TechnicalStaff/add_specialities_technical";
import RentList from "../pages/digi/rent_list";
import VendorTickets from "../pages/digi/VendorTckets";
import ReasonType from "../pages/Calendar/ReasonType";
import Deletefiles from "../pages/delete/App";
import MaintenanceFYI from "../components/MaintenanceFYI";
import Maintenance_request from "../components/Maintenance_request";
import AddPermission from "../pages/digi/add_permission";
import ContactUs from "../pages/LandingPage/ContactUs/ContactUs";
import Agreement from "../pages/Agreement/Agreement";
import CancelAppointment from "../pages/Calendar/CancelAppointment";
import RescheduleAppoinment from "../pages/Calendar/Reschedule";

//Blog module
import Blog from "../pages/blog/BlogList";
import EditBlog from "../pages/blog/EditBlog";
import AddBlog from "../pages/blog/Addblog";
import BlogDetail from "../pages/blog/BlogDetail";

// Newsletter module
import Newsletters from "../pages/Newsletter/Newsletters";
import ManagementReports from "../pages/Calendar/ManagementReports";

const userRoutes = [
  //dashboard
  { path: "/dashboard", component: Dashboard },

  //profile
  { path: "/profile", component: userProfile },

  //Calendar
  { path: "/apps-calendar", component: Calendar },

  //Calendar Reports
  { path: "/calendar-reports", component: ManagementReports },

  //Chat
  { path: "/apps-chat", component: Chat },

  //Email
  { path: "/email-inbox", component: EmailInbox },
  { path: "/email-read", component: EmailRead },

  //Invoice
  { path: "/invoices-list", component: InvoicesList },
  { path: "/invoices-detail", component: InvoiceDetail },
  { path: "/rent_list/:propertyId", component: RentList },

  //Vendor
  { path: "/vendor-specialty", component: VendorSpecialty },
  { path: "/general-tickets", component: GeneralTickets },
  { path: "/specific-tickets", component: SpecificTickets },
  { path: "/approve-quoted-ticket/:ticketId", component: ApproveQuotedTicket },
  { path: "/working-tickets", component: WorkingTickets },

  //Contact
  { path: "/contacts-grid", component: ContactsGrid },
  { path: "/contacts-list", component: ContactsList },
  { path: "/contacts-profile", component: ContactsProfile },

  //Utility
  { path: "/pages-starter", component: PagesStarter },
  { path: "/pages-timeline", component: PageTimeline },
  { path: "/pages-faqs", component: PageFaqs },
  { path: "/pages-pricing", component: PagePricing },
  { path: "/widget", component: Widget },

  //Components
  { path: "/ui-alerts", component: UiAlert },
  { path: "/ui-buttons", component: UiButton },
  { path: "/ui-cards", component: UiCard },
  { path: "/ui-carousel", component: UiCarousel },
  { path: "/ui-dropdowns", component: UiDropdowns },
  { path: "/ui-grid", component: UiGrid },
  { path: "/ui-images", component: UiImages },
  { path: "/ui-modals", component: UiModal },
  { path: "/ui-drawer", component: UiDrawer },
  { path: "/ui-progressbars", component: UiProgressbar },
  { path: "/ui-tabs-accordions", component: UiTabsAccordions },
  { path: "/ui-typography", component: UiTypography },
  { path: "/ui-video", component: UiVideo },
  { path: "/ui-general", component: UiGeneral },
  { path: "/ui-colors", component: UiColors },

  //Extended pages
  { path: "/extended-lightbox", component: Lightbox },
  { path: "/extended-rangeslider", component: Rangeslider },
  { path: "/extended-sweet-alert", component: SweetAlert },
  { path: "/extended-session-timeout", component: SessionTimeout },
  { path: "/extended-rating", component: UiRating },
  { path: "/extended-notifications", component: Notifications },

  //Forms
  { path: "/form-elements", component: FormElements },
  { path: "/form-validation", component: FormValidation },
  { path: "/form-advanced", component: AdvancedPlugins },
  { path: "/form-editors", component: FormEditors },
  { path: "/form-uploads", component: FormUpload },
  { path: "/form-wizard", component: FormWizard },
  { path: "/form-mask", component: FormMask },

  //tables
  { path: "/tables-basic", component: BasicTable },
  { path: "/tables-datatable", component: DatatableTables },
  { path: "/tables-responsive", component: ResponsiveTables },
  { path: "/tables-editable", component: EditableTables },

  //Charts
  { path: "/charts-apex", component: Apexchart },
  { path: "/charts-echart", component: EChart },
  { path: "/charts-chartjs", component: ChartjsChart },
  { path: "/charts-knob", component: KnobCharts },
  { path: "/charts-sparkline", component: SparklineChart },

  //Icons
  { path: "/icons-boxicons", component: IconBoxicons },
  { path: "/icons-materialdesign", component: IconMaterialdesign },
  { path: "/icons-dripicons", component: IconDripicons },
  { path: "/icons-fontawesome", component: IconFontawesome },

  // Maps
  { path: "/maps-google", component: MapsGoogle },
  { path: "/maps-vector", component: MapsVector },
  { path: "/maps-leaflet", component: MapsLeaflet },

  //Project Pages
  { path: "/property", component: AddProperty },
  { path: "/property_layout", component: Layout },
  { path: "/company", component: Facilities },
  { path: "/task_types", component: TaskTypes },
  { path: "/task_class", component: TaskClass },
  { path: "/building_area", component: BuildingArea },
  { path: "/task_frnt", component: TaskFrnt },
  { path: "/rooms", component: Room },
  { path: "/setting", component: Setting },
  { path: "/disable2fa", component: disable2fa },
  { path: "/address", component: Address },
  { path: "/floors", component: Floors },
  { path: "/assets", component: Assets },
  { path: "/parts", component: Parts },
  { path: "/vendors", component: Vendors },
  { path: "/viewvendor", component: ViewVendor },
  { path: "/viewLeads", component: ViewLeads },
  { path: "/ViewRentDigiLeads", component: ViewRentDigiLeads },

  { path: "/contact", component: Contact },
  { path: "/space_center", component: SpaceCenter },
  { path: "/asset_class", component: AssetClass },
  { path: "/user_account", componcleent: UserAccount },
  { path: "/property_manager", component: PropertyManager },
  { path: "/resident_application", component: ResidentApplication },
  { path: "/resident_applicant", component: ApplicantInformation },
  { path: "/manager_profile", component: ManagerProfile },
  { path: "/schedule", component: Schedule },
  { path: "/chart", component: Chart },
  { path: "/vendor_cat", component: VendorCat },
  { path: "/tickets_list", component: TicketList },
  { path: "/comps_detail", component: CompsDetail },
  { path: "/calender_sec", component: CalenderSec },
  // { path: "/transactions_list", component: TransactionsList },
  { path: "/calender_availabilty", component: Calender_availabilty },
  { path: "/appointments", component: Appointment },
  { path: "/technical_staff", component: TechnicalStaff },
  { path: "/add_specialities", component: AddSpecialities },
  { path: "/technical_staff_tickets", component: TechnicalStaffTickets },
  { path: "/request_type", component: AddRequestType },
  { path: "/permissions", component: AddPermission },
  { path: "/emailnotification", component: EmailNotification },

  { path: "/vendor_tickets", component: VendorTickets },
  { path: "/calendar_reasons", component: ReasonType },

  { path: "/agreement-form", component: Agreement },

  // Rentdigicare blogs routes
  { path: "/blog", component: Blog },
  { path: "/addblog", component: AddBlog },
  { path: "/editblog", component: EditBlog },
  { path: "/blog-detail/:slug", component: BlogDetail },

  // Rentdigicare newsletter route
  { path: "/newsletters", component: Newsletters },

  // this route should be at the end of all other routes
  { path: "/", exact: true, component: () => <Redirect to="/dashboard" /> },
];

const authRoutes = [
  //Home
  { path: "/home", component: Home },
  { path: "/contact", component: ContactUs },

  //authencation page
  { path: "/logout", component: Logout },
  { path: "/login", component: Login },
  { path: "/sadmin", component: SuperAdminLogin },
  { path: "/forgot-password", component: ForgetPwd },
  { path: "/reset_password", component: ChangePassword },
  { path: "/2fa", component: TwooFa },
  { path: "/register", component: Register },

  { path: "/operation", component: Deletefiles },
  //AuthenticationInner pages
  { path: "/page-login", component: PageLogin },
  { path: "/page-register", component: PageRegister },
  { path: "/comfirm-password", component: comfirmPassword },
  { path: "/page-recoverpw", component: RecoverPassword },
  { path: "/page-lock-screen", component: LockScreen },
  { path: "/page-confirm-mail", component: ConfirmMail },
  { path: "/page-email-verification", component: EmailVerification },
  { path: "/page-two-step-verification", component: TwoStepVerfication },

  //Utility page
  { path: "/pages-maintenance", component: PageMaintenance },
  { path: "/pages-comingsoon", component: PagesComingsoon },
  { path: "/pages-404", component: Error404 },
  { path: "/pages-500", component: Error500 },
  { path: "/ticket_manager", component: TicketManager },
  { path: "/vendor_application", component: VendorApplication },
  { path: "/add_lead", component: AddLead },
  { path: "/applicant", component: Applicant },

  // Widget Settings
  { path: "/widget_settings", component: WidgetSettings },
];

const PublicRoutes = [
  { path: "/maintenance-fyi", component: MaintenanceFYI },
  { path: "/maintenance-request/:companyId", component: Maintenance_request },
  { path: "/cancel-appointment/:appointmentId", component: CancelAppointment },
  {
    path: "/reschedule-appoinment/:appointmentId/:calendarId",
    component: RescheduleAppoinment,
  },
  { path: "/calendar/:id", component: Calendarurl },
];

export { userRoutes, authRoutes, PublicRoutes };
