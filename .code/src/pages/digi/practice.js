import axios from "../api/axios";
import React, { useState, useEffect } from "react";
import MetaTags from 'react-meta-tags';
import { Link } from "react-router-dom"
import CompanyList from "./CompanyList"
import Company from "./Company"
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
} from "reactstrap"

//Import Breadcrumb
import Breadcrumbs from "../../components/Common/Breadcrumb"

const Facilities = () => {
  const ADD_COMPANY_URL = "/company/add"
  const [modal_large, setmodal_large] = useState(false);
  const [btnsuccess1, setBtnsuccess1] = useState(false);
  const [totalcompanies, settotalcompanies] = useState(0);

  const [currentPage, setCurrentPage] = useState(1);
  const [pageLimit, setPageLimit] = useState(10);
  const [pages, setPages] = useState([]);

  const [FilterCompanyName, setFilterCompanyName] = useState([]);

  const [Company_Name, setCompany_Name] = useState();
  const [FilterOwnerName, setFilterOwnerName] = useState();
  const [FilterCityName, setFilterCityName] = useState();
  const [isFilterOn, setisFilterOn] = useState(false);
  // const [default_value, setdefault_value] = useState(true);
  const [on, seton] = useState(1)

  const [CompanyName, setCompanyName] = useState("")
  const [Owner_First_Name, setOwner_First_Name] = useState("")
  const [Owner_Last_Name, setOwner_Last_Name] = useState("")
  const [Addresss1, setAddresss1] = useState("")
  const [Addresss2, setAddresss2] = useState("")
  const [Cityy, setCityy] = useState("")
  const [Zipp, setZipp] = useState("")
  const [Statee, setStatee] = useState("")
  const [Emaill, setEmaill] = useState("")
  const [Domainn, setDomainn] = useState("")

  const [check_company, setcheck_company] = useState(true)
  const [check_first, setcheck_first] = useState(true)
  const [check_second, setcheck_second] = useState(true)
  const [check_add1, setcheck_add1] = useState(true)
  const [check_add2, setcheck_add2] = useState(true)
  const [check_city, setcheck_city] = useState(true)
  const [check_state, setcheck_state] = useState(true)
  const [check_zip, setcheck_zip] = useState(true)
  const [check_email, setcheck_email] = useState(true)
  const [check_domain, setcheck_domain] = useState(true)

  const [msg_error, setmsg_error] = useState("Can't be empty")
  const [msg_error1, setmsg_error1] = useState("")
  const [msg_error2, setmsg_error2] = useState("")
  const [msg_error_add1, setmsg_error_add1] = useState("")
  const [msg_error_add2, setmsg_error_add2] = useState("")
  const [msg_error_city, setmsg_error_city] = useState("")
  const [msg_error_domain, setmsg_error_domain] = useState("")
  const [msg_error_email, setmsg_error_email] = useState("")
  const [msg_error_state, setmsg_error_state] = useState("")
  const [msg_error_zip, setmsg_error_zip] = useState("")


  const searchFilter = (e) => {
    e.preventDefault()
    setisFilterOn(true)
    setFilterOwnerName(FilterOwnerName)
    setFilterCityName(FilterCityName)
    seton(on + 1)
  }

  const change = (name) => {
    if (name === "Select One") {
      setCompany_Name()
    }
    else {
      setCompany_Name(name)
    }

  }


  function goToNextPage() {

    if (currentPage > 0 && pages.length > currentPage) {
      setCurrentPage((page) => page + 1);
      console.log(currentPage)
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
    let total_pages = totalcompanies / pageLimit
    if (totalcompanies % pageLimit == 0) {
      setPages(Array.from(Array(Math.round(total_pages)).keys()))
    } else {
      setPages(Array.from(Array(parseInt(total_pages) + 1).keys()))
    }
    console.log('totalcompanies / pageLimit', totalcompanies, pageLimit)
    console.log(Array.from(Array(Math.round(totalcompanies / pageLimit)).keys()))
  }, [totalcompanies]);

  useEffect(() => {
    //setPages(Array.from(Array(Math.round(totalcompanies / pageLimit)).keys()))
    let total_pages = totalcompanies / pageLimit
    if (totalcompanies % pageLimit == 0) {
      setPages(Array.from(Array(Math.round(total_pages)).keys()))
    } else {
      setPages(Array.from(Array(parseInt(total_pages) + 1).keys()))
    }
  }, [currentPage]);

  // Adding Company to Database
  const onModalSave = async (event) => {
    event.preventDefault()
    setcheck_company(false)
    const saveSpinner = document.getElementById("saveSpinner");
    const failedSaveErrorIcon = document.getElementById("failedSaveErrorIcon");
    const companySubmitBtn = document.getElementById("companySubmitBtn")
    const errorSpan = document.getElementById("errorSpan")

    companySubmitBtn.disabled = true;
    saveSpinner.style.display = "inline-block";
    failedSaveErrorIcon.style.display = "none";
    errorSpan.style.display = "none";

    try {
      const response = await axios.post(ADD_COMPANY_URL, {
        name: event.target.name.value,
        ownerFirstName: event.target.firstname.value,
        ownerLastName: event.target.lastname.value,
        city: event.target.city.value,
        state: event.target.state.value,
        address: [event.target.address1.value, event.target.address2.value],
        zip: event.target.zip.value,
        email: event.target.email.value,
        domain: event.target.domain.value,
      });

      if (response.data.status === 201) {
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
      console.log(error)
    }
  }

  const [col5, setcol5] = useState(false)
  const t_col5 = () => {
    setcol5(!col5)
  }

  function removeBodyCss() {
    document.body.classList.add("no_padding")
  }

  function tog_large() {
    setmodal_large(!modal_large)
    removeBodyCss()
  }

  const refresh = () => {
    window.location.replace("./company")
  }


  if (window.localStorage.getItem("role") === "admin") {
    return (
      <React.Fragment>
        <div className="page-content">
          <MetaTags>
            <title>Rentdigicare | Company</title>
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
                                  <div className="row align-items-center">
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
                                          onChange={(e) => setCompanyName(e.target.value)}
                                        />
                                        {check_company ? <h6 style={{ color: 'red' }}></h6> : { msg_error }}
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
                                          onChange={(e) => setOwner_First_Name(e.target.value)}
                                        />
                                        {check_first ? <h6 style={{ color: 'red' }}>{msg_error1}</h6> : ""}
                                      </div>
                                    </div>
                                    <div className="col-md-6">
                                      <div className="mb-3">
                                        <Label
                                          className="form-label"
                                          htmlFor="formrow-name-input"
                                        >
                                          Owner Last Name
                                        </Label>
                                        <Input
                                          name="lastname"
                                          type="text"
                                          className="form-control"
                                          id="formrow-name-input"
                                          onChange={(e) => setOwner_Last_Name(e.target.value)}
                                        />
                                        {check_second ? <h6 style={{ color: 'red' }}>{msg_error2}</h6> : ""}

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
                                          onChange={(e) => setAddresss1(e.target.value)}
                                        />
                                        {check_add1 ? <h6 style={{ color: 'red' }}>{msg_error_add1}</h6> : ""}

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
                                          onChange={(e) => setAddresss2(e.target.value)}
                                        />
                                        {check_add2 ? <h6 style={{ color: 'red' }}>{msg_error_add2}</h6> : ""}

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
                                          onChange={(e) => setCityy(e.target.value)}
                                        />
                                        {check_city ? <h6 style={{ color: 'red' }}>{msg_error_city}</h6> : ""}

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
                                          onChange={(e) => setStatee(e.target.value)}
                                        />
                                        {check_state ? <h6 style={{ color: 'red' }}>{msg_error_state}</h6> : ""}

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
                                          onChange={(e) => setZipp(e.target.value)}
                                        />
                                        {check_zip ? <h6 style={{ color: 'red' }}>{msg_error_zip}</h6> : ""}

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
                                          onChange={(e) => setEmaill(e.target.value)}
                                        />
                                        {check_email ? <h6 style={{ color: 'red' }}>{msg_error_email}</h6> : ""}

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
                                          onChange={(e) => setDomainn(e.target.value)}
                                        />
                                        {check_domain ? <h6 style={{ color: 'red' }}>{msg_error_domain}</h6> : ""}

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
                                        <span id="errorSpan" style={{ display: "none", color: "red", marginRight: "10px" }}>Error:here</span>
                                        <button
                                          id="companySubmitBtn"
                                          type="submit"
                                          className="btn btn-success save-user"
                                          
                                        >
                                          Save
                                          <div id="saveSpinner" style={{ display: "none", height: "15px", width: "15px", marginLeft: "5px" }} class="spinner-border" role="status"></div>
                                          <i id="failedSaveErrorIcon" style={{ display: "none", marginLeft: "5px" }} class="fa fa-exclamation-triangle" aria-hidden="true"></i>
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
                                          <select className="form-select" onChange={(e) => {
                                            change(e.target.value)
                                          }}>
                                            <option>Select One</option>
                                            {FilterCompanyName.length > 0 ? FilterCompanyName.map((dat) => <option>{dat.name}
                                            </option>) : <option>Select One</option>}
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
                                            onChange={(e) => setFilterOwnerName(e.target.value)}
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
                                            onChange={(e) => setFilterCityName(e.target.value)}
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
                            <th scope="col">Script</th>

                            {/* <th scope="col">Created</th>
                              <th scope="col">Modified</th> */}
                            {/* <th scope="col">Active</th> */}
                            <th scope="col">Action</th>
                          </tr>
                        </thead>
                        <tbody>
                          <CompanyList settotal={settotalcompanies} companyName={setFilterCompanyName} filter={{ filter: isFilterOn, company: Company_Name, ownwername: FilterOwnerName, city: FilterCityName }} pageno={currentPage} one={on} />
                        </tbody>
                      </Table>
                    </div>
                    <Row className="proress-style mt-3">
                      <Col xl={3}></Col>
                      <Col xl={9}>
                        <div className="pagination-bar">
                          <Pagination aria-label="Page navigation example" key={currentPage}>
                            <PaginationItem
                              onClick={goToPreviousPage}

                            >
                              <PaginationLink href="#" tabIndex="-1">
                                Previous
                              </PaginationLink>
                            </PaginationItem>
                            {pages.map((index, i) => {
                              let crr = currentPage == i + 1 ? 'true' : ''
                              console.log(currentPage, i + 1)

                              return <PaginationItem active={crr}
                                key={i + 1}
                                onClick={() => changePage(i + 1)}
                              >
                                <PaginationLink href="#">
                                  {i + 1} <span className="sr-only">(current)</span>
                                </PaginationLink>
                              </PaginationItem>

                            })}



                            <PaginationItem
                              onClick={goToNextPage}
                            >
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
    window.location.replace("/Property")
  }
}

export default Facilities
