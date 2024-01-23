import axios from "../api/axios";
import React, { Component, useState } from "react";
import {
  AvForm,
  AvField,
  AvGroup,
  AvInput,
  AvFeedback,
  AvRadioGroup,
  AvRadio,
  AvCheckboxGroup,
  AvCheckbox,
} from "availity-reactstrap-validation";
import {
  Row,
  Col,
  Card,
  Container,
  CardBody,
  Button,
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
import logoSvg from "../../assets/images/rdig_logo.jpg";
import logoGsk from "../../assets/images/gsklogo.png";
import ThankYou from "../../assets/images/thnx.gif";
import "../../assets/css/rentdigicare.css";
import Select from "react-select";
import jwt_decode from "jwt-decode";

function formatBytes(bytes, decimals = 2) {
  if (bytes === 0) return "0 Bytes";
  const k = 1024;
  const dm = decimals < 0 ? 0 : decimals;
  const sizes = ["Bytes", "KB", "MB", "GB", "TB", "PB", "EB", "ZB", "YB"];

  const i = Math.floor(Math.log(bytes) / Math.log(k));
  return parseFloat((bytes / Math.pow(k, i)).toFixed(dm)) + " " + sizes[i];
}

const ADD_TICKET_URL = "/vendor/register";
const GET_PROPERTY_URL = "/property/applicant-option";
const GET_PROPERTY_DATA = "/ticket/getdata";
const GET_COMPANIES_URL = "/company";

const GET_SPECIALTY_URL = "/vendorspeciality/get_speciality";

let domain = "";
class AddLead extends Component {
  constructor(props) {
    super(props);

    this.formRef = React.createRef();

    this.state = {
      propertyList: [],
      first_name: "",
      last_name: "",
      email: "",
      phone: "",
      agency_name: "",
      addedSpecialities: [],
      address: "",
      details: "",

      documents: [],

      breadcrumbItems: [
        { title: "Forms", link: "#" },
        { title: "Form Wizard", link: "#" },
      ],
      activeTabProgress: 1,
      progressValue: 33,
      selectedFiles: [],
      profileFiles: [],
      selectedFilesError: "",
      profileError: "",
      error: "",
      specialities: [],
      companies: [],
      selectedCompanies: [],
      loading: false,
    };
    this.toggleTabProgress.bind(this);
  }

  async componentDidMount() {
    this.getSpecialty();

    this.getCompanies();

    let userData = JSON.parse(window.localStorage.getItem("authUser")).userData;
    console.log(userData);
    // this.setState({
    //     name: userData.firstname,
    //     email: userData.email,
    //     role: userData.role,
    //     propertyIDs: userData.properties,
    //     phone: userData.mobile,
    //     customer_id: userData.id
    // })
    // if (userData.role == 'customer') {
    //     try {
    //         const response = await axios.post(GET_PROPERTY_DATA, {
    //             propertyID: userData.properties
    //         });
    //         console.log("new Data", response)
    //         this.setState({ propertyList: response.data.property, suite: response.data.property[0].location })

    //     } catch (error) {
    //         // TODO proper message
    //         console.log("Unable to fetch")
    //     }
    //     return;
    // }
  }

  async getSpecialty() {
    try {
      const response = await axios.get(GET_SPECIALTY_URL);

      this.setState({ specialities: [] });

      response.data.specialties.forEach((element) => {
        this.setState((state, props) => {
          return {
            specialities: [
              ...state.specialities,
              { label: element.specialty, value: element._id },
            ],
          };
        });
      });
    } catch (error) {
      // TODO proper message
      console.log("Unable to fetch");
    }
  }

  toggleTabProgress() {
    this.formRef.current.submit();

    // if (tab === 1) { this.setState({ progressValue: 33 }) }
    // if (tab === 2) { this.setState({ progressValue: 66 }) }
    // if (tab === 3) { this.setState({ progressValue: 100 }) }
  }

  validSubmit(e, tab) {
    console.log(e);
    if (this.state.activeTabProgress !== tab) {
      if (tab >= 1 && tab <= 3) {
        this.setState({
          activeTabProgress: tab,
          error: "",
        });

        if (tab === 1) {
          this.setState({ progressValue: 33 });
        }
        if (tab === 2) {
          this.setState({ progressValue: 66 });
        }
        if (tab === 3) {
          this.setState({ progressValue: 100 });
        }
      }
    }
  }

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
  handleProgress = (event) => {};
  handleProfileFiles = (files) => {
    files.map((file) =>
      Object.assign(file, {
        preview: URL.createObjectURL(file),
        formattedSize: formatBytes(file.size),
      })
    );
    console.log("files", files);
    this.setState({ profileFiles: files });
  };

  submitVendorInformation = async (event) => {
    alert("Add success")
    // var submited = false;
    // try {
    //   if (this.state.profileFiles.length === 0) {
    //     this.setState({ profileError: "Please Select the profile Picture" });
    //     return;
    //   }

    //   if (this.state.selectedFiles.length == 0) {
    //     this.setState({
    //       selectedFilesError: "Please Select atleast one document",
    //     });
    //     return;
    //   }

    //   this.setState({ loading: true });

    //   const response = await axios.post(ADD_TICKET_URL, {
    //     name: this.state.name,
    //     last_name: this.state.last_name,
    //     email: this.state.email,
    //     address: this.state.address,

    //     agency_name: this.state.agency_name,
    //     specialties: this.state.addedSpecialities,
    //     contact_no: this.state.phone,
    //     Id_proof:
    //       "https://www.gravatar.com/avatar/205e460b479e2e5b48aec07710c08d50",
    //     profile:
    //       "https://screenshotting.s3.ap-south-1.amazonaws.com/Screenshotting2022-08-01_f62bcce0-b82a-450c-b216-2c883aac5400.png",

    //     interestedCompanies: this.state.selectedCompanies,
    //   });
    //   if (response.data.success) {
    //     submited = true;

    //     await this.uploadDocuments(
    //       response.data.addedVendor._id,
    //       "id_proof_documents"
    //     );
    //     await this.uploadDocuments(response.data.addedVendor._id, "profile");
    //     this.setState({ loading: false });
    //   } else {
    //     this.setState({ loading: false });

    //     this.setState({
    //       selectedFilesError:
    //         "Email or Phone number or Agency name already exists",
    //     });
    //   }
    // } catch (error) {
    //   console.log(error); // TODO proper error
    // } finally {
    //   if (submited) {
    //     const applicantStepForm = document.getElementById("ticketStepForm");
    //     const thanks = document.getElementById("thanks");
    //     applicantStepForm.style.display = "none";
    //     thanks.style.display = "block";
    //   }
    // }
  };

  addSpecialities = async (value) => {
    const data = [...document.querySelectorAll('input[name="Specialty"]')];

    const result = data
      .filter((obj) => obj.checked)
      .map((filteredObj) => filteredObj.value);

    // let result = data.filter(a => {
    //     if (a.checked) {
    //         return a.value
    //     }
    // });

    this.setState({ addedSpecialities: result });
  };

  removeProfile = (idToRemove) => {
    const filteredProfile = this.state.profileFiles.filter(
      (item, i) => i !== idToRemove
    );

    this.setState({ profileFiles: filteredProfile });
  };

  removeDocuments = (idToRemove) => {
    const filteredDocuments = this.state.selectedFiles.filter(
      (item, i) => i !== idToRemove
    );

    this.setState({ selectedFiles: filteredDocuments });
  };

  uploadDocuments = async (ticketID, type) => {
    const formData = new FormData();
    var i = 0;

    if (type == "profile") {
      while (i < this.state.profileFiles.length) {
        formData.append(`file`, this.state.profileFiles[i]);
        i++;
      }
    } else {
      while (i < this.state.selectedFiles.length) {
        formData.append(`file`, this.state.selectedFiles[i]);
        i++;
      }
    }

    const config = {
      headers: {
        "content-type": "multipart/form-data",
        id: `${ticketID}`,
        type: type,
      },
    };

    try {
      const response = await axios.post(
        "/vendor/upload-documents",
        formData,
        config
      );
    } catch (error) {
      console.log(error);
    }
  };

  getCompanies = async () => {
    try {
      const response = await axios.get(GET_COMPANIES_URL);
      this.setState({ companies: response.data.companies });

      console.log("response.data.companies", response.data.companies);
      this.setState({ companies: [] });
      response.data.companies.forEach((element) => {
        this.setState((state, props) => {
          return {
            companies: [
              ...state.companies,
              { label: element.name, value: element._id },
            ],
          };
        });
        // setPropertyList((current) => [
        //     ...current,
        //     { label: element.title, value: element._id },
        // ]);
      });
    } catch (error) {
      // TODO proper error message
      console.log(error);
    }
    // console.log(companyList);
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
                      <Row className="tickt-frm-hd  mt-3">
                        <Link className="tckt-frm-bck" to="/viewLeads">
                          <i className="bx bx-left-arrow-alt"></i>
                        </Link>

                        <div
                          className="logo-top text-end font-weight-bold"
                          style={{ fontWeight: "bold" }}
                        >
                          Add Lead
                        </div>
                      </Row>
                      <Row className="justify-content-center mt-3">
                        <div className="col-xl-12 col-lg-12">
                          <div
                            id="progrss-wizard"
                            className="twitter-bs-wizard"
                          >
                            <AvForm
                              onSubmit={(e) => {}}
                              ref={this.formRef}
                              onValidSubmit={(e) => {
                                this.submitVendorInformation(e);
                              }}
                            >
                              <div className="row">
                                <div className="col-lg-6">
                                  <div className="mb-3">
                                    <AvField
                                      name="first_name"
                                      value={this.state.name}
                                      onChange={(e) => {
                                        this.setState({
                                          name: e.target.value,
                                        });
                                      }}
                                      label="First Name"
                                      validate={{
                                        required: {
                                          value: true,
                                          errorMessage: "Please enter name",
                                        },
                                      }}
                                    />
                                  </div>
                                </div>
                                <div className="col-lg-6">
                                  <div className="mb-3">
                                    <AvField
                                      name="email"
                                      label="Email"
                                      value={this.state.email}
                                      onChange={(e) => {
                                        this.setState({
                                          email: e.target.value,
                                        });
                                      }}
                                      validate={{
                                        required: {
                                          value: true,
                                          errorMessage:
                                            "Please enter the Email",
                                        },

                                        pattern: {
                                          value:
                                            "^[a-zA-Z0-9+_.-]+@[a-zA-Z0-9.-]+$",
                                          errorMessage:
                                            "Please enter the valid email",
                                        },
                                      }}
                                    />
                                  </div>
                                </div>
                              </div>

                              <div className="row">
                                <div className="col-lg-6">
                                  <div className="mb-3">
                                    <AvField
                                      name="ph_no"
                                      type="number"
                                      label="Contact Number"
                                      value={this.state.phone}
                                      onChange={(e) => {
                                        this.setState({
                                          phone: e.target.value,
                                        });
                                      }}
                                      validate={{
                                        required: {
                                          value: true,
                                          errorMessage:
                                            "Please enter your contact number",
                                        },
                                      }}
                                    />
                                  </div>
                                </div>
                                <div className="col-lg-6">
                                  <div className="mb-3">
                                    <AvField
                                      name="website"
                                      label="Website URL"
                                      value={this.state.websiteUrl}
                                      onChange={(e) => {
                                        this.setState({
                                          websiteUrl: e.target.value,
                                        });
                                      }}
                                      validate={{
                                        required: {
                                          value: true,
                                          errorMessage:
                                            "Please enter the website url",
                                        },
                                      }}
                                    />
                                  </div>
                                </div>
                              </div>
                              <div className="row">
                                <div className="col-lg-6">
                                  <div className="mb-3">
                                    <AvField
                                      name="interestedApartment"
                                      label="interested Apartment"
                                      value={this.state.interestedApartment}
                                      onChange={(e) => {
                                        this.setState({
                                          interestedApartment: e.target.value,
                                        });
                                      }}
                                      validate={{
                                        required: {
                                          value: true,
                                          errorMessage:
                                            "Please enter a interested Apartment",
                                        },
                                      }}
                                    />
                                  </div>
                                </div>{" "}
                                <div className="col-lg-6">
                                  <div className="mb-3">
                                    <AvField
                                      name="interestedBedroomType"
                                      label="interested Bedroom Type"
                                      value={this.state.interestedBedroomType}
                                      onChange={(e) => {
                                        this.setState({
                                          interestedBedroomType: e.target.value,
                                        });
                                      }}
                                      validate={{
                                        required: {
                                          value: true,
                                          errorMessage:
                                            "Please enter a interested Bedroom Type",
                                        },
                                      }}
                                    />
                                  </div>
                                </div>
                              </div>
                            </AvForm>

                            <ul className="pager wizard twitter-bs-wizard-pager-link">
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

                              <li
                                className={
                                  this.state.activeTabProgress === 3
                                    ? "next disabled"
                                    : "next"
                                }
                              >
                                <Button
                                  type="submit"
                                  className="btn btn-primary"
                                  style={{ background: "#0e578e" }}
                                  onClick={(event) => {
                                    this.toggleTabProgress();
                                    // this.toggleTabProgress(this.state.activeTabProgress + 1);
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
                                </Button>
                              </li>
                            </ul>
                          </div>
                        </div>
                      </Row>
                    </CardBody>
                  </Card>
                  <div id="thanks" className="text-center thanks white-bg">
                    <Link
                      style={{ top: "10px", left: "20px" }}
                      className="tckt-frm-bck"
                      to="/viewLeads"
                    >
                      <i className="bx bx-left-arrow-alt"></i>
                    </Link>
                    <img src={ThankYou} />
                    <div className={`thankyou-title`}>
                      <span>Thank You !</span>
                    </div>
                    <p>Your Request Has been Registered.</p>
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
export default AddLead;