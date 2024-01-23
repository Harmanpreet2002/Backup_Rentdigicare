import axios from "../pages/api/axios";
import React, { Component, useState } from "react";
import {
  Row,
  Col,
  Card,
  Container,
  CardBody,
  TabContent,
  TabPane,
  NavItem,
  NavLink,
  Progress,
  Label,
} from "reactstrap";
import Dropzone from "react-dropzone";
import classnames from "classnames";
import { Link } from "react-router-dom";
import logoSvg from "../assets/images/logo-sm.svg";
// import logoGsk from "../assets/images/gsklogo.png";
import ThankYou from "../assets/images/thnx.gif";
import "../assets/css/rentdigicare.css";
import jwt_decode from "jwt-decode";

function formatBytes(bytes, decimals = 2) {
  if (bytes === 0) return "0 Bytes";
  const k = 1024;
  const dm = decimals < 0 ? 0 : decimals;
  const sizes = ["Bytes", "KB", "MB", "GB", "TB", "PB", "EB", "ZB", "YB"];

  const i = Math.floor(Math.log(bytes) / Math.log(k));
  return parseFloat((bytes / Math.pow(k, i)).toFixed(dm)) + " " + sizes[i];
}

const ADD_TICKET_URL = "/ticket/public";
const GET_PROPERTY_URL = "/property/applicant-option";
const GET_PROPERTY_DATA = "/ticket/getdata";
const GET_REQUEST_TYPES = "/requesttype/getrequest";
const GET_COMPANY_DETAILS = "/company/companydetails";
const GET_PROPERTY_LIST = "/property/getpropertyList/list";
const GET_PERMISSION_LIST = "/permissiontype/getpermissions";

let decode = "";

if (window.localStorage.getItem("accessToken")) {
  decode = jwt_decode(window.localStorage.getItem("accessToken"));
}

let domain = "";
class Maintenance_request extends Component {
  constructor(props) {
    super(props);
    this.state = {
      phoneValid: false,
      propertyList: [],
      name: "",
      email: "",
      phone: "",
      details: "",
      requestTypeList: [],
      permissionTypeList: [],
      companyID: undefined,
      requestType: "",
      permission: "",
      property: "",
      propertyID: "",
      suite: "",
      documents: [],

      breadcrumbItems: [
        { title: "Forms", link: "#" },
        { title: "Form Wizard", link: "#" },
      ],
      activeTabProgress: 1,
      progressValue: 33,
      selectedFiles: [],
      priority: "",
      role: "",
      error: "",
      customer_id: "",
      domain: "",
      loading: false,
      nameError: "",
      emailError: "",
      suiteError: "",
      phoneError: "",
      requestTypeError: "",
      propertyIDError: "",
      permission: "",
      detailsError: "",
      priority: "",
      documentError: "",
      companyId: "",
      companyName: "",
      logo: null,
      companyUrl: "",
    };
    this.toggleTabProgress.bind(this);
    this.getData();
  }

  getRequestType = async (companyId) => {
    try {
      const response = await axios.post(GET_REQUEST_TYPES, {
        company_id: companyId,
      });
      console.log(
        axios.post(GET_REQUEST_TYPES, {
          company_id: companyId,
        })
      );
      console.log(companyId);
      this.setState({ requestTypeList: response.data.requestType });
    } catch (error) {
      // TODO proper message
      console.log("Unable to fetch");
    }
  };
  getPropertiesList = async (companyID) => {
    try {
      const response = await axios.get(GET_PROPERTY_LIST, {
        params: {
          company_id: companyID, // Replace with the company ID you want to fetch
        },
      });
      console.log(response.data);
      this.setState({ propertyList: response.data.data });
    } catch {}
  };
  getPermissionList = async (companyId) => {
    try {
      const response = await axios.post(GET_PERMISSION_LIST, {
        company_id: companyId,
      });
      this.setState({ permissionTypeList: response.data.permission_type });
    } catch (error) {
      // TODO proper message
      console.log("Unable to fetch");
    }
  };

  async getData() {
    if (this.state.role != "customer") {
      // TODO : working properties where company name is === company name in url

      // getting query pram
      const location = window.location.href;
      const position = location.search("name");
      const subStr = location.substring(position);

      // geting position of domain and domain it self
      const domainPosition = subStr.search("=");
      const companyDomain = subStr.substring(domainPosition + 1);

      console.log(`${domainPosition}, ${companyDomain}`);
      if (domainPosition != -1) {
        domain = companyDomain;
        await this.getProperties(companyDomain);
      }
    }
  }

  async componentDidMount() {
    const currentURL = window.location.href;
    const segment = "/maintenance-request";
    const slugurl = currentURL.substring(
      currentURL.indexOf(segment) + segment.length + 1
    );
    const response = await axios.get(GET_COMPANY_DETAILS, {
      params: {
        // company_id: companyId // Replace with the company ID you want to fetch
        slug: slugurl,
      },
    });
    if (response.status === 200) {
      this.setState({
        companyName: response.data.data.name,
        companyId: response.data.data._id,
      });
      this.getRequestType(response.data.data._id);
      this.getPropertiesList(response.data.data._id);
      this.getPermissionList(response.data.data._id);
      this.setState({ companyUrl: response.data.data.domain });
    }

    // let userData = JSON.parse(window.localStorage.getItem("authUser")).userData
    // this.setState({
    //     name: userData.firstname,
    //     email: userData.email,
    //     role: userData.role,
    //     propertyIDs: userData.properties,
    //     phone: userData.mobile,
    //     customer_id: userData.id,
    //     companyId: userData.companyId
    // })
    // this.getRequestType(userData.companyId)

    // if (userData.role == 'customer' || userData.role == 'manager') {
    //     try {
    //         const response = await axios.post(GET_PROPERTY_DATA, {
    //             propertyID: decode.properties
    //         });
    //         if(userData.role == 'customer'){
    //             this.setState({ propertyID : response.data.property[0]._id,property : response.data.property[0].title,companyID : response.data.property[0].companyID})
    //             domain= response.data.property[0].companyDomain
    //         }
    //         this.setState({ propertyList: response.data.property,  })

    //     } catch (error) {
    //         // TODO proper message
    //         console.log("Unable to fetch")
    //     }
    //     return;
    // }
  }

  // getting properties
  async getProperties(companyDomain) {
    try {
      const response = await axios.post(GET_PROPERTY_URL, {
        domain: companyDomain,
      });
      this.setState({ propertyList: response.data.properties });
    } catch (error) {
      // TODO proper message
      console.log("Unable to fetch");
    }
  }

  async getCustomerData(companyDomain) {
    try {
      const response = await axios.post(GET_PROPERTY_URL, {
        domain: companyDomain,
      });
      this.setState({ propertyList: response.data.properties });
    } catch (error) {
      // TODO proper message
      console.log("Unable to fetch");
    }
  }

  toggleTabProgress(tab) {
    // if (this.state.activeTabProgress !== tab) {
    //     if (tab >= 1 && tab <= 3) {

    // if (this.state.activeTabProgress === 1) {

    this.setState({
      requestTypeError: "",
      propertyIDError: "",
      permissionError: "",
      priorityError: "",
      nameError: "",
      emailError: "",
      suiteError: "",
      phoneError: "",
      detailsError: "",
      documentError: "",
      permissionError: "",
      phoneValid: false,
    });

    if (!this.state.requestType) {
      this.setState({ requestTypeError: "Please select the request type" });
    }
    if (!this.state.permission) {
      this.setState({ permissionError: "Please select the permission type" });
    }
    if (!this.state.suite) {
      this.setState({ suiteError: "Please select the suite" });
    }
    if (!this.state.name) {
      this.setState({ nameError: "Please type your name" });
    }
    if (!this.state.email) {
      this.setState({ emailError: "Please type your email" });
    }
    if (!this.state.phone) {
      this.setState({ phoneError: "Please enter your phone" });
    } else {
      // Regular expression for a 10-digit phone number
      const numberRegex = /^[0-9]+$/;

      if (!numberRegex.test(this.state.phone)) {
        const invalidCharsRegex = ["#", "-", "*"];
        const errorMessage = `No special characters are allowed. Invalid characters: ${invalidCharsRegex.join(
          ", "
        )}`;
        this.setState({ phoneError: errorMessage });
      } else {
        // Phone number is valid
        this.setState({ phoneError: "" });
        this.setState({ phoneValid: true });
      }
    }

    if (!this.state.propertyID) {
      this.setState({ propertyIDError: "Please select the property" });
    }

    if (!this.state.permission) {
      this.setState({ permissionError: "Please select the permission" });
    }

    if (!this.state.details) {
      this.setState({ detailsError: "Please enter the details" });
    }

    // if (!this.state.priority) {
    //     this.setState({ priorityError: "Please Select the priority" })

    // }

    if (
      !this.state.requestType ||
      !this.state.propertyID ||
      !this.state.permission ||
      !this.state.name ||
      !this.state.email ||
      !this.state.suite ||
      !this.state.phone ||
      !this.state.phoneValid ||
      !this.state.details
    ) {
      document.body.scrollTop = document.documentElement.scrollTop = 0;
      return;
    }

    this.submitTicketInformation();
    // }

    //         if (tab === 1) { this.setState({ progressValue: 33 }) }
    //         if (tab === 2) { this.setState({ progressValue: 66 }) }
    //         if (tab === 3) { this.setState({ progressValue: 100 }) }
    //     }
    // }
  }
  handleProgress = (event) => {
    if (this.state.selectedFiles.length === 0) {
      this.setState({ documentError: "Please select the documents" });
    }
    if (this.state.selectedFiles.length === 0) {
      console.log(this.state.selectedFiles.length === 0, "hkljlk");

      return;
    } else {
      console.log(this.state.selectedFiles.length === 0, "hkljlk");

      this.submitTicketInformation(event);
    }
  };
  handleAcceptedFiles = (files) => {
    files.map((file) =>
      Object.assign(file, {
        preview: URL.createObjectURL(file),
        formattedSize: formatBytes(file.size),
      })
    );
    console.log("files", files);
    this.setState({ selectedFiles: files });
  };

  submitTicketInformation = async () => {
    console.log(this.state.documents.length === 0, "hkljlk");

    // event.preventDefault()
    this.setState({ loading: true });
    var submited = false;
    try {
      const response = await axios.post(ADD_TICKET_URL, {
        name: this.state.name,
        email: this.state.email,
        phone: this.state.phone,
        details: this.state.details,
        requestType: this.state.requestType,
        permission: this.state.permission,
        property: this.state.property,
        propertyID: this.state.propertyID,
        suite: this.state.suite,
        // TODO: Documents
        documents: this.state.documents,
        companyDomain: domain,
        companyID: this.state.companyId,
        // createdByid: this.state.customer_id,
        // createdByRole: this.state.role
      });
      if (response.data.status === 200) {
        submited = true;
        if (this.state.selectedFiles.length > 0) {
          await this.uploadDocuments(response.data.id);
        }
      } else if (response.data.status === 401) {
        alert("Enter your registered mail adddress");
      }
    } catch (error) {
      console.log(error); // TODO proper error
    } finally {
      if (submited) {
        const applicantStepForm = document.getElementById("ticketStepForm");
        const thanks = document.getElementById("thanks");
        applicantStepForm.style.display = "none";
        thanks.style.display = "block";
        const URL = this.state.companyUrl;
        setTimeout(function () {
          window.location.href = URL; // Replace "otherpage.html" with the URL of the other page you want to navigate to
        }, 5000);
      }
      this.setState({ loading: false });
    }
  };

  removeDocuments = (idToRemove) => {
    const filteredDocuments = this.state.selectedFiles.filter(
      (item, i) => i !== idToRemove
    );

    this.setState({ selectedFiles: filteredDocuments });
  };

  uploadDocuments = async (ticketID) => {
    const formData = new FormData();
    var i = 0;
    while (i < this.state.selectedFiles.length) {
      formData.append(`file`, this.state.selectedFiles[i]);
      i++;
    }

    const config = {
      headers: {
        "content-type": "multipart/form-data",
        id: `${ticketID}`,
      },
    };

    try {
      const response = await axios.post(
        "/ticket/upload-documents",
        formData,
        config
      );
    } catch (error) {
      console.log(error);
    }
  };

  render() {
    return (
      <React.Fragment>
        <div className="bg-soft-light min-vh-100 py-5">
          <div className="py-4">
            <Container>
              <Row>
                <Col lg={12}>
                  <Card id="ticketStepForm">
                    <CardBody>
                      <Row className="tickt-frm-hd justify-content-center mt-3">
                        {/* <Link className="tckt-frm-bck" to="/">
                          <i className="bx bx-left-arrow-alt"></i>
                        </Link> */}
                        <div className="col-xl-8 col-lg-10">
                          <div className="logo-top text-center">
                            <img src={logoSvg} alt="" height="70" />
                          </div>
                          <div className="hd-frm text-center">
                            <h2>
                              MAINTENANCE REQUEST FOR{" "}
                              <p>{this.state.companyName}</p>{" "}
                              <Link className="hd-frm" to="/">
                                <img
                                  className="logo-gsk"
                                  src={this.state.logo}
                                  height="50"
                                  alt=""
                                />
                              </Link>
                            </h2>
                          </div>
                          {/* <Link className="hd-frm" to="/">GSK Properties</Link> */}
                        </div>
                      </Row>
                      <Row className="justify-content-center mt-3">
                        <div className="col-xl-12 col-lg-12">
                          <div
                            id="progrss-wizard"
                            className="twitter-bs-wizard"
                          >
                            {/* <ul className="twitter-bs-wizard-nav nav-justified nav nav-pills">
                                                            <NavItem>
                                                                <NavLink className={classnames({ active: this.state.activeTabProgress === 1 })} onClick={() => { this.toggleTabProgress(1); }} >
                                                                    <div className="step-icon" data-bs-toggle="tooltip" data-bs-placement="top" title="Seller Details">
                                                                        <i className="bx bx-list-ul"></i>
                                                                    </div>
                                                                </NavLink>
                                                            </NavItem>
                                                            <NavItem>
                                                                <NavLink className={classnames({ active: this.state.activeTabProgress === 2 })} onClick={() => { this.toggleTabProgress(2); }} >
                                                                    <div className="step-icon" data-bs-toggle="tooltip" data-bs-placement="top" title="Company Document">
                                                                        <i className="bx bx-book-bookmark"></i>
                                                                    </div>
                                                                </NavLink>
                                                            </NavItem>
                                                            <NavItem>
                                                                <NavLink className={classnames({ active: this.state.activeTabProgress === 3 })} onClick={() => { this.toggleTabProgress(3); }} >
                                                                    <div className="step-icon" data-bs-toggle="tooltip" data-bs-placement="top" title="Bank Details">
                                                                        <i className="bx bx-list-ul"></i>
                                                                    </div>
                                                                </NavLink>
                                                            </NavItem>
                                                        </ul> */}

                            {/* <div id="bar" className="mt-4">
                                                            <Progress color="success" striped animated value={this.state.progressValue} />

                                                        </div> */}
                            <TabContent
                              activeTab={this.state.activeTabProgress}
                              className="twitter-bs-wizard-tab-content"
                            >
                              <TabPane tabId={1}>
                                <form>
                                  <div className="row">
                                    <div className="col-lg-6">
                                      <div className="mb-3">
                                        <label htmlFor="progresspill-firstname-input">
                                          Type
                                        </label>
                                        <select
                                          onChange={(e) =>
                                            this.setState({
                                              requestType: e.target.value,
                                            })
                                          }
                                          className="form-select"
                                        >
                                          <option>Please select one</option>

                                          {this.state.requestTypeList.map(
                                            (item) => {
                                              return (
                                                <option>
                                                  {item.request_type}
                                                </option>
                                              );
                                            }
                                          )}
                                        </select>
                                        {this.state.requestTypeError && (
                                          <p style={{ color: "red" }}>
                                            {this.state.requestTypeError}
                                          </p>
                                        )}
                                      </div>
                                    </div>
                                    <div className="col-lg-6">
                                      <div className="mb-3">
                                        <label htmlFor="progresspill-lastname-input">
                                          Permission To Enter Suite
                                        </label>
                                        <select
                                          onChange={(e) =>
                                            this.setState({
                                              permission: e.target.value,
                                            })
                                          }
                                          className="form-select"
                                        >
                                          <option>Please select one</option>

                                          {this.state.permissionTypeList.map(
                                            (item) => {
                                              return (
                                                <option>
                                                  {item.PermissionType}
                                                </option>
                                              );
                                            }
                                          )}
                                        </select>
                                        {this.state.permissionError && (
                                          <p style={{ color: "red" }}>
                                            {this.state.permissionError}
                                          </p>
                                        )}
                                      </div>
                                    </div>
                                  </div>

                                  <div className="row">
                                    <div className="col-lg-6">
                                      <div className="mb-3">
                                        <label htmlFor="progresspill-phoneno-input">
                                          Property
                                        </label>
                                        {decode.role === "customer" ? (
                                          <input
                                            className="form-control"
                                            value={
                                              this.state.propertyList[0]?.title
                                            }
                                            disabled
                                          />
                                        ) : (
                                          <select
                                            className="form-select"
                                            onChange={(e) => {
                                              const propertyData = JSON.parse(
                                                e.target.value
                                              );
                                              console.log(propertyData);
                                              this.setState({
                                                propertyID: propertyData.ID,
                                              });
                                              this.setState({
                                                property: propertyData.title,
                                              });
                                              domain =
                                                this.state.propertyList.find(
                                                  (o) =>
                                                    o._id === propertyData.ID
                                                );
                                              domain = domain.companyDomain;
                                              console.log(domain);
                                            }}
                                          >
                                            <option>Select</option>

                                            {this.state.propertyList.map(
                                              (property) => (
                                                <option
                                                  value={`{"title": "${property.title}", "ID": "${property._id}"}`}
                                                >
                                                  {property.title}
                                                </option>
                                              )
                                            )}
                                          </select>
                                        )}
                                        {this.state.propertyIDError && (
                                          <p style={{ color: "red" }}>
                                            {this.state.propertyIDError}
                                          </p>
                                        )}
                                      </div>
                                    </div>
                                    <div className="col-lg-6">
                                      <div className="mb-3">
                                        <label htmlFor="progresspill-email-input">
                                          Suite#
                                        </label>
                                        <input
                                          value={this.state.suite}
                                          placeholder="Enter suite number"
                                          onChange={(e) =>
                                            this.setState({
                                              suite: e.target.value,
                                            })
                                          }
                                          type="email"
                                          className="form-control"
                                          id="progresspill-email-input"
                                        />
                                        {this.state.suiteError && (
                                          <p style={{ color: "red" }}>
                                            {this.state.suiteError}
                                          </p>
                                        )}
                                      </div>
                                    </div>
                                  </div>
                                  <div className="row">
                                    <div className="col-lg-4">
                                      <div className="mb-3">
                                        <label htmlFor="progresspill-phoneno-input">
                                          Your Name
                                        </label>
                                        <input
                                          value={this.state.name}
                                          onChange={(e) =>
                                            this.setState({
                                              name: e.target.value,
                                            })
                                          }
                                          type="text"
                                          className="form-control"
                                          id="progresspill-phoneno-input"
                                        />
                                        {this.state.nameError && (
                                          <p style={{ color: "red" }}>
                                            {this.state.nameError}
                                          </p>
                                        )}
                                      </div>
                                    </div>
                                    <div className="col-lg-4">
                                      <div className="mb-3">
                                        <label htmlFor="progresspill-email-input">
                                          Your Email Address
                                        </label>
                                        <input
                                          value={this.state.email}
                                          onChange={(e) =>
                                            this.setState({
                                              email: e.target.value,
                                            })
                                          }
                                          type="email"
                                          className="form-control"
                                          id="progresspill-email-input"
                                        />
                                        {this.state.emailError && (
                                          <p style={{ color: "red" }}>
                                            {this.state.emailError}
                                          </p>
                                        )}
                                      </div>
                                    </div>
                                    <div className="col-lg-4">
                                      <div className="mb-3">
                                        <label htmlFor="progresspill-phoneno-input">
                                          Phone#
                                        </label>
                                        <input
                                          value={this.state.phone}
                                          onChange={(e) =>
                                            this.setState({
                                              phone: e.target.value,
                                            })
                                          }
                                          type="number"
                                          className="form-control"
                                          id="progresspill-phoneno-input"
                                        />
                                        {this.state.phoneError && (
                                          <p style={{ color: "red" }}>
                                            {this.state.phoneError}
                                          </p>
                                        )}
                                      </div>
                                    </div>
                                  </div>
                                  <div className="row">
                                    {/* <div className="col-lg-6">
                                                                            <div className="mb-3">
                                                                                {
                                                                                    this.state.priorityError && <p style={{ color: "red" }}>{this.state.priorityError}</p>
                                                                                }
                                                                                <label htmlFor="progresspill-lastname-input">Priority</label>
                                                                                <select onChange={(e) => this.setState({ priority: e.target.value })} className="form-select">
                                                                                    <option>Select</option>
                                                                                    <option>High</option>
                                                                                    <option>Medium</option>
                                                                                    <option>Low</option>
                                                                                </select>
                                                                            </div>
                                                                        </div> */}
                                  </div>

                                  <div>
                                    <div className="row">
                                      <div className="col-lg-12">
                                        <div className="mb-3">
                                          <label htmlFor="progresspill-address-input">
                                            Comments
                                          </label>
                                          <textarea
                                            onChange={(e) =>
                                              this.setState({
                                                details: e.target.value,
                                              })
                                            }
                                            id="progresspill-address-input"
                                            className="form-control"
                                            rows="7"
                                          ></textarea>
                                          {this.state.detailsError && (
                                            <p style={{ color: "red" }}>
                                              {this.state.detailsError}
                                            </p>
                                          )}
                                        </div>
                                      </div>
                                    </div>
                                  </div>
                                  <div className="row">
                                    <div className="col-lg-12">
                                      <div className="mb-3">
                                        <Label
                                          className="form-label"
                                          htmlFor="formrow-firstname-input"
                                        >
                                          Upload images, videos or documents
                                        </Label>

                                        <Dropzone
                                          onDrop={(acceptedFiles) =>
                                            this.handleAcceptedFiles(
                                              acceptedFiles
                                            )
                                          }
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
                                                <h4>Attach files here</h4>
                                              </div>
                                            </div>
                                          )}
                                        </Dropzone>
                                        <div
                                          className="dropzone-previews mt-3"
                                          id="file-previews"
                                        >
                                          {this.state.selectedFiles &&
                                            this.state.selectedFiles.map(
                                              (f, i) => {
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
                                                            onClick={(e) => {
                                                              this.removeDocuments(
                                                                i
                                                              );
                                                            }}
                                                          >
                                                            <i className="bx bx-trash-alt"></i>
                                                          </button>
                                                        </Col>
                                                      </Row>
                                                    </div>
                                                  </Card>
                                                );
                                              }
                                            )}
                                        </div>
                                        {this.state.documentError && (
                                          <p style={{ color: "red" }}>
                                            {this.state.documentError}
                                          </p>
                                        )}
                                      </div>
                                    </div>
                                  </div>
                                </form>
                              </TabPane>
                              <TabPane tabId={2}>
                                <div>
                                  <form></form>
                                </div>
                              </TabPane>
                              <TabPane tabId={3}>
                                <div>
                                  <form></form>
                                </div>
                              </TabPane>
                            </TabContent>
                            <div
                              style={{
                                width: "100%",
                                display: "flex",
                                justifyContent: "flex-end",
                              }}
                            >
                              {/* <li className={this.state.activeTabProgress === 1 ? "previous disabled" : "previous"}>
                                                                <Link
                                                                    to="#"
                                                                    className={this.state.activeTabProgress === 1 ? "btn btn-primary disabled" : "btn btn-primary"}
                                                                    onClick={() => {
                                                                        this.toggleTabProgress(this.state.activeTabProgress - 1);
                                                                    }}
                                                                >
                                                                    <i className="bx bx-chevron-left me-1"></i> Previous
                                                                </Link>
                                                            </li> */}
                              <Link to="/" className="btn btn-light">
                                Back
                              </Link>
                              <Link
                                to="#"
                                className="btn btn-primary ms-1"
                                onClick={(event) => {
                                  if (this.state.loading == false) {
                                    this.toggleTabProgress(
                                      this.state.activeTabProgress + 1
                                    );
                                  }
                                  // if (this.state.activeTabProgress === 3) { console.log(); this.handleProgress(event) }
                                }}
                              >
                                {this.state.loading ? (
                                  <>
                                    <span
                                      class="spinner-border spinner-border-sm"
                                      style={{ marginRight: "3px" }}
                                      role="status"
                                      aria-hidden="true"
                                    ></span>
                                    Loading...
                                  </>
                                ) : (
                                  <div>Submit </div>
                                )}
                              </Link>
                            </div>
                          </div>
                        </div>
                      </Row>
                    </CardBody>
                  </Card>
                  <div id="thanks" className="text-center thanks white-bg">
                    <Link
                      style={{ top: "10px", left: "20px" }}
                      className="tckt-frm-bck"
                      to="/"
                    >
                      <i className="bx bx-left-arrow-alt"></i>
                    </Link>
                    <img src={ThankYou} />
                    <div className={`thankyou-title`}>
                      <span>Thank You !</span>
                    </div>
                    <p>
                      We have received your request and our maintenance team
                      will reach out to you.
                    </p>
                  </div>
                </Col>
              </Row>
            </Container>
          </div>
        </div>
      </React.Fragment>
    );
  }
}
export default Maintenance_request;
