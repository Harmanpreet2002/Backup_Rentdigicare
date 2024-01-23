import axios from "../api/axios";
import React, { useState, useEffect } from "react";
import MetaTags from "react-meta-tags";
import { Link } from "react-router-dom";
import CompanyList from "./CompanyList";
import Company from "./Company";
import {
  Table,
  Row,
  Col,
  Card,
  CardBody,
  Modal,
  CardHeader,
  Collapse,
  Form,
  Label,
  Input,
  Pagination,
  PaginationItem,
  PaginationLink,
} from "reactstrap";

//Import Breadcrumb
import Breadcrumbs from "../../components/Common/Breadcrumb";
import { useDropzone } from "react-dropzone";

const Facilities = () => {
  const { acceptedFiles, getRootProps, getInputProps } = useDropzone();
  const files = acceptedFiles.map((file) => (
    <li key={file.name}>
      {file.name} - {file.size} bytes
    </li>
  ));

  const ADD_COMPANY_URL = "/company/add";
  const [modal_large, setmodal_large] = useState(false);
  const [btnsuccess1, setBtnsuccess1] = useState(false);
  const [totalcompanies, settotalcompanies] = useState(0);
  const [logo, setLogo] = useState([])

  const [currentPage, setCurrentPage] = useState(1);
  const [pageLimit, setPageLimit] = useState(10);
  const [pages, setPages] = useState([]);

  const [FilterCompanyName, setFilterCompanyName] = useState([]);

  const [Company_Name, setCompany_Name] = useState();
  const [FilterOwnerName, setFilterOwnerName] = useState();
  const [FilterCityName, setFilterCityName] = useState();
  const [isFilterOn, setisFilterOn] = useState(false);
  // const [default_value, setdefault_value] = useState(true);
  const [on, seton] = useState(1);

  const [CompanyName, setCompanyName] = useState("");
  const [Owner_First_Name, setOwner_First_Name] = useState("");
  const [Owner_Last_Name, setOwner_Last_Name] = useState("");
  const [Addresss1, setAddresss1] = useState("");
  const [Addresss2, setAddresss2] = useState("");
  const [Cityy, setCityy] = useState("");
  const [Zipp, setZipp] = useState("");
  const [Statee, setStatee] = useState("");
  const [Emaill, setEmaill] = useState("");
  const [Phone, setPhone] = useState("");
  const [Domainn, setDomainn] = useState("");
  const [response, setREsponse] = useState({})


  // let [check_company, setcheck_company] = useState(false);
  // let [check_first, setcheck_first] = useState(false);
  // let [check_second, setcheck_second] = useState(false);
  // let [check_add1, setcheck_add1] = useState(false);
  // let [check_add2, setcheck_add2] = useState(false);
  // let [check_city, setcheck_city] = useState(false);
  // let [_d_check_city, set_d_check_city] = useState(false);
  // let [check_state, setcheck_state] = useState(false);
  // let [_d_check_state, set_d_check_state] = useState(false);
  // let [check_zip, setcheck_zip] = useState(false);
  // let [_d_check_zip, set_d_check_zip] = useState(false);
  // let [check_email, setcheck_email] = useState(false);
  // let [check_phone, setcheck_phone] = useState(false);
  // let [_d_check_email, set_d_check_email] = useState(false);
  // let [_d_check_phone, set_d_check_phone] = useState(false);
  // let [check_domain, setcheck_domain] = useState(false);
  // let [_d_check_domain, set_d_check_domain] = useState(false);


  /**under test */
  let check_company = false;
  let check_first = false
  let check_second = false
  let check_add1 = false
  let check_add2 = false
  let check_city = false
  let _d_check_city = false
  let check_state = false
  let _d_check_state = false
  let check_zip = false
  let _d_check_zip = false
  let check_email = false
  let check_phone = false
  let _d_check_email = false
  let _d_check_phone = false
  let check_domain = false
  let _d_check_domain = false
  /**under test */







  const [msg_error, setmsg_error] = useState();
  const [msg_error1, setmsg_error1] = useState("");
  const [msg_error2, setmsg_error2] = useState("");
  const [msg_error_add1, setmsg_error_add1] = useState("");
  const [msg_error_add2, setmsg_error_add2] = useState("");
  const [msg_error_city, setmsg_error_city] = useState("");
  const [msg_error_domain, setmsg_error_domain] = useState("");
  const [msg_error_email, setmsg_error_email] = useState("");
  const [msg_error_phone, setmsg_error_phone] = useState("");
  const [msg_error_state, setmsg_error_state] = useState("");
  const [msg_error_zip, setmsg_error_zip] = useState("");

  const searchFilter = (e) => {
    e.preventDefault();
    setisFilterOn(true);
    setFilterOwnerName(FilterOwnerName);
    setFilterCityName(FilterCityName);
    seton(on + 1);
  };

  const change = (name) => {
    if (name === "Select One") {
      setCompany_Name();
    } else {
      setCompany_Name(name);
    }
  };

  function goToNextPage() {
    if (currentPage > 0 && pages.length > currentPage) {
      setCurrentPage((page) => page + 1);
      console.log(currentPage);
    }
  }

  function goToPreviousPage() {
    if (currentPage > 1) {
      setCurrentPage((page) => page - 1);
    }
  }

  function changePage(event) {
    setCurrentPage(event);
  }

  useEffect(() => {
    let total_pages = totalcompanies / pageLimit;
    if (totalcompanies % pageLimit == 0) {
      setPages(Array.from(Array(Math.round(total_pages)).keys()));
    } else {
      setPages(Array.from(Array(parseInt(total_pages) + 1).keys()));
    }
    console.log("totalcompanies / pageLimit", totalcompanies, pageLimit);
    console.log(
      Array.from(Array(Math.round(totalcompanies / pageLimit)).keys())
    );
  }, [totalcompanies]);

  useEffect(() => {
    //setPages(Array.from(Array(Math.round(totalcompanies / pageLimit)).keys()))
    let total_pages = totalcompanies / pageLimit;
    if (totalcompanies % pageLimit == 0) {
      setPages(Array.from(Array(Math.round(total_pages)).keys()));
    } else {
      setPages(Array.from(Array(parseInt(total_pages) + 1).keys()));
    }
  }, [currentPage]);

  // Adding Company to Database
  const onModalSave = async (event) => {
    event.preventDefault();

    if (Owner_First_Name === "") {
      check_first = false
      setmsg_error1("Cannot Be Empty");
    } else {
      check_first = true
    }
    if (CompanyName === "") {
      check_company = false
      setmsg_error("Cannot Be Empty");
    } else {
      check_company = true
    }

    if (Owner_First_Name != "") {
      if (!Owner_First_Name.match(/^[a-zA-Z ]+$/)) {
        check_first = false
        setmsg_error1("Only Letters Allowed");
      } else {
        check_first = true
      }
    }

    if (Owner_Last_Name === "") {
      check_second = false
      setmsg_error2("Cannot Be Empty");
    }

    if (Addresss1 === "") {
      check_add1 = false
      setmsg_error_add1("Cannot Be Empty");
    } else {
      check_add1 = true
    }

    if (Owner_Last_Name != "") {
      if (!Owner_Last_Name.match(/^[a-zA-Z ]+$/)) {
        check_second = false
        setmsg_error2("Only Letters Allowed");
      } else {
        check_second = true
      }
    }

    if (Cityy === "") {
      check_city = false
      setmsg_error_city("Cannot Be Empty");
    }

    if (Cityy != "") {
      if (!Cityy.match(/^[a-zA-Z0-9 ]+$/)) {
        check_city = false;
        _d_check_city = false;
        setmsg_error_city("Only Letters And Numbers Are Allowed");
      } else {
        setmsg_error_city(true);
        _d_check_city = true;
      }
    }

    if (Statee === "") {
      check_state = false;
      setmsg_error_state("Cannot Be Empty");
    }

    if (Statee != "") {
      if (!Statee.match(/^[a-zA-Z0-9 ]+$/)) {
        check_state = false
        _d_check_state = false;
        setmsg_error_state("Only Letters And Numbers Are Allowed");
      } else {
        setmsg_error_state(true);
        _d_check_state = true;
      }
    }

    if (Zipp === "") {
      check_zip = false
      setmsg_error_zip("Cannot Be Empty");
    }

    if (Zipp != "") {
      if (!Zipp.match(/^[a-zA-Z0-9 ]+$/)) {
        check_zip = false
        _d_check_zip = false
        setmsg_error_zip("Only Letters And Numbers Are Allowed");
      } else {
        setmsg_error_zip(true);
        _d_check_zip = true
      }
    }

    if (Emaill === "") {
      check_email = false
      setmsg_error_email("Cannot Be Empty");
    }

    if (Emaill != "") {
      if (!Emaill.match(/\S+@\S+\.\S+/)) {
        check_email = false
        _d_check_email = false
        setmsg_error_email("Enter Valid Email Address");
      } else {
        setmsg_error_email(true);
        _d_check_email = true
      }
    }

    if (Phone != "") {
      if (
        !Phone.match(
          /^[\+]?[(]?[0-9]{3}[)]?[-\s\.]?[0-9]{3}[-\s\.]?[0-9]{4,6}$/
        )
      ) {
        check_phone = false
        _d_check_phone = false
        setmsg_error_phone("Enter Valid Phone Number");
      } else {
        setmsg_error_phone(true);
        _d_check_phone = true
      }
    }

    if (Domainn === "") {
      check_domain = false
      setmsg_error_domain("Cannot Be Empty");
    }

    if (Domainn != "") {
      if (
        !Domainn.match("(https?://)?([\\da-z.-]+)\\.([a-z.]{2,6})[/\\w .-]*/?")
      ) {
        check_domain = false
        _d_check_domain = false
        setmsg_error_domain("Enter Valid Domain");
      } else {
        setmsg_error_domain(true);
        _d_check_domain = true
      }
    }


    console.log("before condition passed:.....",
      check_company,
      check_first,
      check_second,
      check_add1,
      _d_check_city,
      _d_check_state,
      _d_check_zip,
      _d_check_email,
      _d_check_domain,
      _d_check_phone
    );
    if (
      CompanyName &&
      check_company === true &&
      Owner_First_Name &&
      check_first === true &&
      Owner_Last_Name &&
      check_second === true &&
      Addresss1 &&
      check_add1 === true &&
      Cityy &&
      _d_check_city === true &&
      Statee &&
      _d_check_state === true &&
      Zipp &&
      _d_check_zip === true &&
      Emaill &&
      _d_check_email === true &&
      Domainn &&
      _d_check_domain === true &&
      Phone &&
      _d_check_phone === true
    ) {
      console.log("condition passed");
      const saveSpinner = document.getElementById("saveSpinner");
      const failedSaveErrorIcon = document.getElementById(
        "failedSaveErrorIcon"
      );
      const companySubmitBtn = document.getElementById("companySubmitBtn");
      const errorSpan = document.getElementById("errorSpan");

      companySubmitBtn.disabled = true;
      saveSpinner.style.display = "inline-block";
      failedSaveErrorIcon.style.display = "none";
      errorSpan.style.display = "none";

      try {
        const response = await axios.post(ADD_COMPANY_URL, {
          name: event.target.name.value,
          phone: event.target.phone.value,
          ownerFirstName: event.target.firstname.value,
          ownerLastName: event.target.lastname.value,
          city: event.target.city.value,
          state: event.target.state.value,
          address: [event.target.address1.value, event.target.address2.value],
          zip: event.target.zip.value,
          email: event.target.email.value,
          domain: event.target.domain.value,
          logo: []
        });
        console.log(response.data, '--------response-----------')

        if (response.data.status === 201) {
          await uploadDocuments(response.data.id);
          window.location.reload();
        } else {
          errorSpan.innerText = response.data.message;
          saveSpinner.style.display = "none";
          companySubmitBtn.disabled = false;
          failedSaveErrorIcon.style.display = "inline-block";
          errorSpan.style.display = "inline-block";
        }
      } catch (error) {
        saveSpinner.style.display = "none";
        companySubmitBtn.disabled = false;
        failedSaveErrorIcon.display = "inline-block";
        console.log(error);
      }
    }
  };
  async function uploadDocuments(val) {
    const formData = new FormData();
    formData.append(`file`, acceptedFiles[0]);
    const file = formData.get('file'); // Assuming the form data is already populated with the file
    console.log('File name:', file);

    const config = {
      headers: {
        "content-type": "multipart/form-data",
        id: `${val}`,
      },
    };
    console.log(config, 'config')
    console.log(config, 'config')

    try {
      const response = await axios.post(
        "/company/upload-documents",
        formData,
        config
      );
    } catch (error) {

    }
  }
  const [col5, setcol5] = useState(false);
  const t_col5 = () => {
    setcol5(!col5);
  };

  function removeBodyCss() {
    document.body.classList.add("no_padding");
  }

  function tog_large() {
    setmodal_large(!modal_large);
    removeBodyCss();
  }

  const refresh = () => {
    window.location.replace("./company");
  };

  if (window.localStorage.getItem("role") === "admin") {
    return (
      <React.Fragment>
        <div className="page-content">
          <MetaTags>
            <title> Rentdigicare | Company</title>
          </MetaTags>
          <div className="container-fluid">
            <Breadcrumbs title="Home" breadcrumbItem="Company" />
            <Row>
              <Col xl={12}>
                <Card>
                  {
                    <CardHeader>
                      <div className="row align-items-center">
                        <div className="col-md-6">
                          <div className="mb">
                            <h5 className="card-title">
                              Company
                              <span className="text-muted fw-normal ms-2">
                                ({totalcompanies})
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
                            <button
                              type="button"
                              onClick={() => {
                                tog_large();
                              }}
                              className="btn btn-light "
                              data-toggle="modal"
                              data-target=".bs-example-modal-lg"
                            >
                              <i className="bx bx-plus me-1"></i> Add Company
                            </button>
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
                                  Add Company
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
                                <Form onSubmit={onModalSave}>
                                  <div className="row">
                                    <div className="col-md-6">
                                      <div className="mb-3">
                                        <Label
                                          className="form-label"
                                          htmlFor="formrow-name-input"
                                        >
                                          Company Name *
                                        </Label>
                                        <Input
                                          name="name"
                                          type="text"
                                          className="form-control"
                                          id="formrow-name-input"
                                          onChange={(e) =>
                                            setCompanyName(e.target.value)
                                          }
                                        />
                                        {check_company ? (
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
                                          htmlFor="formrow-name-input"
                                        >
                                          Owner First Name *
                                        </Label>
                                        <Input
                                          name="firstname"
                                          type="text"
                                          className="form-control"
                                          id="formrow-name-input"
                                          onChange={(e) =>
                                            setOwner_First_Name(e.target.value)
                                          }
                                        />
                                        {check_first ? (
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
                                          htmlFor="formrow-name-input"
                                        >
                                          Owner Last Name *
                                        </Label>
                                        <Input
                                          name="lastname"
                                          type="text"
                                          className="form-control"
                                          id="formrow-name-input"
                                          onChange={(e) =>
                                            setOwner_Last_Name(e.target.value)
                                          }
                                        />
                                        {check_second ? (
                                          ""
                                        ) : (
                                          <Label style={{ color: "red" }}>
                                            {msg_error2}
                                          </Label>
                                        )}
                                      </div>
                                    </div>
                                    <div className="col-md-6">
                                      <div className="mb-3">
                                        <Label
                                          className="form-label"
                                          htmlFor="formrow-address-input"
                                        >
                                          Address1 *
                                        </Label>
                                        <Input
                                          name="address1"
                                          type="text"
                                          className="form-control"
                                          id="formrow-address-input"
                                          onChange={(e) =>
                                            setAddresss1(e.target.value)
                                          }
                                        />
                                        {check_add1 ? (
                                          ""
                                        ) : (
                                          <Label style={{ color: "red" }}>
                                            {msg_error_add1}
                                          </Label>
                                        )}
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
                                          name="address2"
                                          type="text"
                                          className="form-control"
                                          id="formrow-address-input"
                                          onChange={(e) =>
                                            setAddresss2(e.target.value)
                                          }
                                        />
                                        {check_add2 ? (
                                          ""
                                        ) : (
                                          <Label style={{ color: "red" }}>
                                            {msg_error_add1}
                                          </Label>
                                        )}
                                      </div>
                                    </div>
                                    <div className="col-md-6">
                                      <div className="mb-3">
                                        <Label
                                          className="form-label"
                                          htmlFor="formrow-city-input"
                                        >
                                          City *
                                        </Label>
                                        <Input
                                          name="city"
                                          type="text"
                                          className="form-control"
                                          id="formrow-city-input"
                                          onChange={(e) =>
                                            setCityy(e.target.value)
                                          }
                                        />
                                        {check_city ? (
                                          ""
                                        ) : (
                                          <Label style={{ color: "red" }}>
                                            {msg_error_city}
                                          </Label>
                                        )}
                                      </div>
                                    </div>
                                    <div className="col-md-6">
                                      <div className="mb-3">
                                        <Label
                                          className="form-label"
                                          htmlFor="formrow-state-input"
                                        >
                                          State *
                                        </Label>
                                        <Input
                                          name="state"
                                          type="text"
                                          className="form-control"
                                          id="formrow-state-input"
                                          onChange={(e) =>
                                            setStatee(e.target.value)
                                          }
                                        />
                                        {check_state ? (
                                          ""
                                        ) : (
                                          <Label style={{ color: "red" }}>
                                            {msg_error_state}
                                          </Label>
                                        )}
                                      </div>
                                    </div>
                                    <div className="col-md-6">
                                      <div className="mb-3">
                                        <Label
                                          className="form-label"
                                          htmlFor="formrow-zip-input"
                                        >
                                          Zip *
                                        </Label>
                                        <Input
                                          name="zip"
                                          type="text"
                                          className="form-control"
                                          id="formrow-zip-input"
                                          onChange={(e) =>
                                            setZipp(e.target.value)
                                          }
                                        />
                                        {check_zip ? (
                                          ""
                                        ) : (
                                          <Label style={{ color: "red" }}>
                                            {msg_error_zip}
                                          </Label>
                                        )}
                                      </div>
                                    </div>
                                    <div className="col-md-6">
                                      <div className="mb-3">
                                        <Label
                                          className="form-label"
                                          htmlFor="formrow-zip-input"
                                        >
                                          Email *
                                        </Label>
                                        <Input
                                          name="email"
                                          type="text"
                                          className="form-control"
                                          id="formrow-zip-input"
                                          onChange={(e) =>
                                            setEmaill(e.target.value)
                                          }
                                        />
                                        {check_email ? (
                                          ""
                                        ) : (
                                          <Label style={{ color: "red" }}>
                                            {msg_error_email}
                                          </Label>
                                        )}
                                      </div>
                                    </div>

                                    <div className="col-md-6">
                                      <div className="mb-3">
                                        <Label
                                          className="form-label"
                                          htmlFor="formrow-zip-input"
                                        >
                                          Phone *
                                        </Label>
                                        <Input
                                          name="phone"
                                          type="text"
                                          className="form-control"
                                          id="formrow-zip-input"
                                          onChange={(e) =>
                                            setPhone(e.target.value)
                                          }
                                        />
                                        {check_phone ? (
                                          ""
                                        ) : (
                                          <Label style={{ color: "red" }}>
                                            {msg_error_phone}
                                          </Label>
                                        )}
                                      </div>
                                    </div>

                                    <div className="col-md-6">
                                      <div className="mb-3">
                                        <Label
                                          className="form-label"
                                          htmlFor="formrow-zip-input"
                                        >
                                          Domain *
                                        </Label>
                                        <Input
                                          name="domain"
                                          type="text"
                                          className="form-control"
                                          id="formrow-zip-input"
                                          onChange={(e) =>
                                            setDomainn(e.target.value)
                                          }
                                        />
                                        {check_domain ? (
                                          ""
                                        ) : (
                                          <Label style={{ color: "red" }}>
                                            {msg_error_domain}
                                          </Label>
                                        )}
                                      </div>
                                    </div>
                                    <div className="col-md-6">
                                      <div className="mb-3">
                                        <Label className="form-label" htmlFor="formrow-zip-input">
                                          Logo
                                        </Label>
                                        <div {...getRootProps({ className: 'form-control' })}>
                                          <input
                                            className="form-control"
                                            id="formrow-zip-input"
                                            {...getInputProps({ multiple: false })}
                                          />
                                          <p className="m-0">Choose your file</p>
                                        </div>
                                        {acceptedFiles.length > 0 && (
                                          <ul>
                                            <li key={acceptedFiles[0].name}>
                                              {acceptedFiles[0].name} - {acceptedFiles[0].size} bytes
                                            </li>
                                          </ul>
                                        )}
                                      </div>
                                    </div>
                                    {/* <div className="col-md-6">first na
                                <div className="mb-3">
                                    <Label htmlFor="example-date-input" className="form-Label">Created</Label>
                                    <Input className="form-control" type="date" defaultValue="2019-08-19" id="example-date-input" />
                                </div>
                              </div> 
                              <div className="col-md-6">
                                <div className="mb-3">
                                    <Label htmlFor="example-date-input" className="form-Label">Modified</Label>
                                    <Input className="form-control" type="date" defaultValue="2019-08-19" id="example-date-input" />
                                </div>
                              </div>   */}
                                    {/* <div className="col-md-6">
                                <div className="mb-3">
                                    <Label className="form-Label">Active</Label>
                                    <select className="form-select">
                                        <option>Select</option>
                                        <option>Yes</option>
                                        <option>No</option>
                                    </select>
                                    
                                </div>    
                              </div> */}
                                    <div className="col-md-12">
                                      <div className="text-end">
                                        <span
                                          id="errorSpan"
                                          style={{
                                            display: "none",
                                            color: "red",
                                            marginRight: "10px",
                                          }}
                                        >
                                          Error:here
                                        </span>
                                        <button
                                          id="companySubmitBtn"
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
                                            class="spinner-border"
                                            role="status"
                                          ></div>
                                          <i
                                            id="failedSaveErrorIcon"
                                            style={{
                                              display: "none",
                                              marginLeft: "5px",
                                            }}
                                            class="fa fa-exclamation-triangle"
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
                                  <Form>
                                    <div class="row align-items-center">
                                      <div className="col-md-4">
                                        <div className="mb-3">
                                          <Label className="form-Label">
                                            Company Name
                                          </Label>
                                          <select
                                            className="form-select"
                                            onChange={(e) => {
                                              change(e.target.value);
                                            }}
                                          >
                                            <option>Select One</option>
                                            {FilterCompanyName.length > 0 ? (
                                              FilterCompanyName.map((dat) => (
                                                <option>{dat.name}</option>
                                              ))
                                            ) : (
                                              <option>Select One</option>
                                            )}
                                          </select>
                                        </div>
                                      </div>
                                      <div className="col-md-4">
                                        <div className="mb-3">
                                          <Label
                                            className="form-label"
                                            htmlFor="formrow-area-input"
                                          >
                                            Owner Name
                                          </Label>
                                          <Input
                                            type="text"
                                            className="form-control"
                                            id="formrow-area-input"
                                            onChange={(e) =>
                                              setFilterOwnerName(e.target.value)
                                            }
                                          />
                                        </div>
                                      </div>
                                      <div className="col-md-4">
                                        <div className="mb-3">
                                          <Label
                                            className="form-label"
                                            htmlFor="formrow-room-input"
                                          >
                                            City
                                          </Label>
                                          <Input
                                            type="text"
                                            className="form-control"
                                            id="formrow-room-input"
                                            onChange={(e) =>
                                              setFilterCityName(e.target.value)
                                            }
                                          />
                                        </div>
                                      </div>

                                      <div className="col-md-12 searchClear-btns justify-content-end d-flex">
                                        <div className="srch-btn">
                                          <button
                                            type="submit"
                                            className="btn btn-primary"
                                            onClick={searchFilter}
                                          >
                                            Search
                                          </button>
                                        </div>
                                        <div className="srch-btn ">
                                          <button
                                            type="submit"
                                            className="btn btn-primary"
                                            onClick={refresh}
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
                  }
                  <CardBody>
                    <div className="table-responsive">
                      <Table className="table-striped table-bordered mb-0">
                        <thead>
                          <tr>
                            <th scope="col">#</th>
                            <th scope="col">Company Name</th>
                            <th scope="col">Owner Name</th>
                            <th scope="col">Email</th>
                            <th scope="col">Domain</th>
                            <th scope="col">City</th>
                            <th scope="col">State</th>
                            <th scope="col">Logo</th>
                            <th scope="col">Script</th>

                            {/* <th scope="col">Created</th>
                              <th scope="col">Modified</th> */}
                            {/* <th scope="col">Active</th> */}
                            <th scope="col">Action</th>
                          </tr>
                        </thead>
                        <tbody>
                          <CompanyList
                            settotal={settotalcompanies}
                            companyName={setFilterCompanyName}
                            filter={{
                              filter: isFilterOn,
                              company: Company_Name,
                              ownwername: FilterOwnerName,
                              city: FilterCityName,
                            }}
                            pageno={currentPage}
                            one={on}
                          />
                        </tbody>
                      </Table>
                    </div>
                    <Row className="proress-style mt-3">
                      <Col xl={3}></Col>
                      <Col xl={9}>
                        <div className="pagination-bar">
                          <Pagination
                            aria-label="Page navigation example"
                            key={currentPage}
                          >
                            <PaginationItem onClick={goToPreviousPage}>
                              <PaginationLink href="#" tabIndex="-1">
                                Previous
                              </PaginationLink>
                            </PaginationItem>
                            {pages.map((index, i) => {
                              let crr = currentPage == i + 1 ? "true" : "";
                              console.log(currentPage, i + 1);

                              return (
                                <PaginationItem
                                  active={crr}
                                  key={i + 1}
                                  onClick={() => changePage(i + 1)}
                                >
                                  <PaginationLink href="#">
                                    {i + 1}{" "}
                                    <span className="sr-only">(current)</span>
                                  </PaginationLink>
                                </PaginationItem>
                              );
                            })}

                            <PaginationItem onClick={goToNextPage}>
                              <PaginationLink href="#">Next</PaginationLink>
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
    window.location.replace("/property");
  }
};

export default Facilities;
