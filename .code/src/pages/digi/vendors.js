import React, { useState, useEffect } from "react";
import MetaTags from 'react-meta-tags';
import { Link } from "react-router-dom"
import { SERVER_URL } from "../ServerLink";
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
  Form

} from "reactstrap"
import axios from '../api/axios'
import jwt_decode from "jwt-decode"

//Import Breadcrumb
import Breadcrumbs from "../../components/Common/Breadcrumb"
const Vendors = () => {

  const [modal_large, setmodal_large] = useState(false);
  const [showFilter, setShowFilter] = useState(false);

  const [btnsuccess1, setBtnsuccess1] = useState(false);
  const [modal_large2, setmodal_large2] = useState(false);
  const [vendor, setVendor] = useState([])
  const [loading, setLoading] = useState(false)
  const [vendorError, setVendorError] = useState("")
  const [vendorspeciality, setVendorSpeciality] = useState([])
  const [name, setName] = useState("")
  const [speciality, setSpeciality] = useState("")
  const [agency, setAgency] = useState("")
  const [email, setEmail] = useState("")

  const [idProofList, setIdProofList] = useState([])
  const [profilesList, setProfilesList] = useState([])
  const [openDocumentModel, setOpenDocumentModel] = useState(false)


  function removeBodyCss() {
    document.body.classList.add("no_padding")
  }

  const decode = jwt_decode(window.localStorage.getItem("accessToken"));


  const ADD_VENDOR = `/vendor/get_requested_vendors/${decode.id}`
  const ADD_COMPANY_VENDOR = "/vendor/add_company_vendor"
  const VIEW_DOCUMENTS = "/vendor/view_documents"
  const REMOVE_COMPANY_VENDOR = "/vendor/delete_vendor"
  const GET_VENDOR_SPECIALITY = "/vendorspeciality/get_speciality"

  function tog_large() {
    setmodal_large(!modal_large)
    removeBodyCss()
  }

  const [col5, setcol5] = useState(false)

  const t_col5 = () => {
    setcol5(!col5)
  }
  function tog_large2() {
    setmodal_large2(!modal_large2)
    removeBodyCss()
  }


  const getVendor = async (e) => {
    try {
      const response = await axios.get(ADD_VENDOR)

      console.log("response", response)

      if (response.data?.success) {
        setVendor(response?.data?.vendors)
      } else {
        setVendorError(response.data?.errorMessage)
      }

    } catch (error) {
      setVendorError("Something went wrong")

      console.log(error) // TODO proper error
    }
  }


  const getVendorSpeciality = async (e) => {
    try {
      const response = await axios.get(`${GET_VENDOR_SPECIALITY}?companyId=${decode.id}`)
      console.log("speciality", response)

      if (response.data?.success) {
        setVendorSpeciality(response.data.specialties)

      } else {
        setVendorError(response.data?.errorMessage)
      }

    }
    catch (error) {
      setVendorError("Something went wrong")

      console.log(error) // TODO proper error
    }
  }


  const viewDocuments = async (id, i) => {

    try {

      const response = await axios.post(VIEW_DOCUMENTS, { vendor_id: id });

      if (response.data.success) {
        setIdProofList(response.data.Id_proofs)
        setProfilesList(response.data.Profiles)
        toggleDocumentModel()
      }
      console.log(response.data)

    } catch (e) {

    }

  }

  const toggleDocumentModel = () => {
    setOpenDocumentModel(!openDocumentModel)
  }


  const verification = async (id) => {
    console.log(id, "hello")
    let updatedList = vendor.map(item => {
      if (item._id == id) {
        return { ...item, loading: true }; //gets everything that was already in item, and updates "done"
      }
      return item; // else return unmodified item 
    })
    setVendor(updatedList)
    try {
      const response = await axios.post(ADD_COMPANY_VENDOR, { vendor_id: id, companyID: decode.id });

      if (response.data.success) {
        let updatedList = vendor.map(item => {
          if (item._id == id) {
            return { ...item, verified: true }; //gets everything that was already in item, and updates "done"
          }
          return item; // else return unmodified item 
        })
        setVendor(updatedList)

      }
    } catch (error) {
      // TODO proper message
      console.log("Unable to fetch")
      let updatedList = vendor.map(item => {
        if (item._id == id) {
          return { ...item, loading: false }; //gets everything that was already in item, and updates "done"
        }
        return item; // else return unmodified item 
      })
      setVendor(updatedList)

    }

  }


  const download = e => {
    console.log(e.target.href);
    fetch(e.target.href, {
      method: "GET",
      headers: {}
    })
      .then(response => {
        response.arrayBuffer().then(function (buffer) {
          const url = window.URL.createObjectURL(new Blob([buffer]));
          const link = document.createElement("a");
          link.href = url;
          link.setAttribute("download", "image.png"); //or any other extension
          document.body.appendChild(link);
          link.click();
        });
      })
      .catch(err => {
        console.log(err);
      });
  };


  const removeRequest = async (id) => {
    let updatedList = vendor.map(item => {
      if (item._id == id) {
        return { ...item, loading: true }; //gets everything that was already in item, and updates "done"
      }
      return item; // else return unmodified item 
    })
    setVendor(updatedList)
    try {
      const response = await axios.post(REMOVE_COMPANY_VENDOR, { vendor: id, });

      if (response.data.success) {
        window. location. reload()
        let updatedList = vendor.map(item => {
          if (item._id == id) {
            return { ...item, removed: true }; //gets everything that was already in item, and updates "done"
          }
          return item; // else return unmodified item 
        })
        setVendor(updatedList)

      }
    } catch (error) {
      // TODO proper message
      console.log("Unable to fetch")
      let updatedList = vendor.map(item => {
        if (item._id == id) {
          return { ...item, loading: false }; //gets everything that was already in item, and updates "done"
        }
        return item; // else return unmodified item 
      })
      setVendor(updatedList)

    }

  }



  const FilterSearch = async (speciality, name, agency, email) => {
    console.log(name, email, agency, speciality)
    try {
      const response = await axios.post("/vendor/filter", {
        first_name: name,

        agency_name: agency,

        email: email,

        specialties: [speciality]
      });
      console.log(response, "hello")
      if (response.data.success) {
        getVendor()
      }
    } catch (error) {
      // TODO proper message
      console.log("Unable to fetch")
    }
  }



  useEffect(() => {
    // dispatch(onGetInvoices());
    getVendor()
    getVendorSpeciality()
  }, []);



  return (
    <React.Fragment>
      <div className="page-content">
        <MetaTags>
          <title>Rentdigicare | Vendors</title>
        </MetaTags>
        <div className="container-fluid">
          <Breadcrumbs title="Home" breadcrumbItem="Vendors" />
          <Row>
            <Col xl={12}>
              <Card>
                <CardHeader>
                  <div className="row">
                    <div className="col-md-6">
                      <div className="mb">
                        <h5 className="card-title">Vendors <span className="text-muted fw-normal ms-2">({vendor.length})</span></h5>
                      </div>
                    </div>
                    <div className="col-md-6 d-flex flex-wrap align-items-center justify-content-end">
                      <div className="mb d-flex flex-wrap">
                        {/* <button
                          onClick={(e) => { setShowFilter(!showFilter) }}
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
                          <i className="bx bx-plus me-1"></i> Add Vendors
                        </button> */}
                        <Modal
                          size="lg"
                          isOpen={modal_large}
                          toggle={() => {
                            tog_large()
                          }}
                        >
                          <div className="modal-header">
                            <h5
                              className="modal-title mt-0"
                              id="myLargeModalLabel"
                            >
                              Add Vendors
                            </h5>
                            <button
                              onClick={() => {
                                setmodal_large(false)
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
                                    <Label className="form-label" htmlFor="formrow-name-input">Vendor Name</Label>
                                    <Input type="text" className="form-control" id="formrow-name-input" />
                                  </div>
                                </div>
                                <div className="col-md-6">
                                  <div className="mb-3">
                                    <Label className="form-label" htmlFor="formrow-code-input">Vendor Code</Label>
                                    <Input type="text" className="form-control" id="formrow-code-input" />
                                  </div>
                                </div>
                                <div className="col-md-6">
                                  <div className="mb-3">
                                    <Label className="form-Label">Category</Label>
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
                                    <Label className="form-Label">Rate/Term</Label>
                                    <div class="row">
                                      <div class="col-md-8">
                                        <div className="mb-3">
                                          <Input type="text" className="form-control" id="formrow-code-input" />
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
                                      <h4 className="card-title mb-4">Details</h4>
                                      <div className="row">
                                        <div className="col-md-6">
                                          <div className="mb-3">
                                            <Label className="form-label" htmlFor="formrow-address-input">Address1</Label>
                                            <Input type="text" className="form-control" id="formrow-address-input" />
                                          </div>
                                        </div>
                                        <div className="col-md-6">
                                          <div className="mb-3">
                                            <Label className="form-label" htmlFor="formrow-address-input">Address2</Label>
                                            <Input type="text" className="form-control" id="formrow-address-input" />
                                          </div>
                                        </div>
                                        <div className="col-md-6">
                                          <div className="mb-3">
                                            <Label className="form-label" htmlFor="formrow-city-input">City</Label>
                                            <Input type="text" className="form-control" id="formrow-city-input" />
                                          </div>
                                        </div>
                                        <div className="col-md-6">
                                          <div className="mb-3">
                                            <Label className="form-label" htmlFor="formrow-state-input">State/Province</Label>
                                            <Input type="text" className="form-control" id="formrow-state-input" />
                                          </div>
                                        </div>
                                        <div className="col-md-6">
                                          <div className="mb-3">
                                            <Label className="form-label" htmlFor="formrow-postal-input">Postal/Zip Code</Label>
                                            <Input type="text" className="form-control" id="formrow-postal-input" />
                                          </div>
                                        </div>
                                        <div className="col-md-6">
                                          <div className="mb-3">
                                            <Label className="form-label" htmlFor="formrow-contact-input">Telephone 1</Label>
                                            <Input type="text" className="form-control" id="formrow-contact-input" />
                                          </div>
                                        </div>
                                        <div className="col-md-6">
                                          <div className="mb-3">
                                            <Label className="form-label" htmlFor="formrow-contact-input">Telephone 2</Label>
                                            <Input type="text" className="form-control" id="formrow-contact-input" />
                                          </div>
                                        </div>
                                        <div className="col-md-6">
                                          <div className="mb-3">
                                            <Label className="form-label" htmlFor="formrow-fax-input">Fax</Label>
                                            <Input type="text" className="form-control" id="formrow-fax-input" />
                                          </div>
                                        </div>
                                        <div className="col-md-6">
                                          <div className="mb-3">
                                            <Label className="form-label" htmlFor="formrow-contact-input">Contact</Label>
                                            <Input type="text" className="form-control" id="formrow-contact-input" />
                                          </div>
                                        </div>
                                        <div className="col-md-6">
                                          <div className="mb-3">
                                            <Label className="form-label" htmlFor="formrow-email-input">Email</Label>
                                            <Input type="text" className="form-control" id="formrow-email-input" />
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
                      <Collapse className="mt-4" isOpen={showFilter}>
                        <Card>
                          <CardBody>
                            <div className="filter-sec">
                              <Form >
                                <div class="row align-items-center">
                                  <div className="col-md-3">
                                    <div className="mb-3">
                                      <Label className="form-Label">Category</Label>
                                      <select onChange={(e) => { setSpeciality(e.target.value) }} className="form-select">
                                        {vendorspeciality.map((items) => {

                                          return (

                                            <option value={items._id}>{items.specialty}</option>


                                          )
                                        })}
                                      </select>
                                    </div>
                                  </div>
                                  <div className="col-md-3">
                                    <div className="mb-3">
                                      <Label className="form-label" htmlFor="formrow-name-input">Name</Label>
                                      <Input onChange={(e) => { setName(e.target.value) }} className="form-control" id="formrow-name-input" />
                                    </div>
                                  </div>
                                  <div className="col-md-3">
                                    <div className="mb-3">
                                      <Label className="form-label" htmlFor="formrow-code-input">Agency Name</Label>
                                      <Input onChange={(e) => { setAgency(e.target.value) }} type="text" className="form-control" id="formrow-code-input" />
                                    </div>
                                  </div>
                                  <div className="col-md-3">
                                    <div className="mb-3">
                                      <Label className="form-label" htmlFor="formrow-code-input">Email</Label>
                                      <Input onChange={(e) => { setEmail(e.target.value) }} type="text" className="form-control" id="formrow-code-input" />
                                    </div>
                                  </div>
                                  <div className="col-md-12">
                                    <div className="srch-btn">
                                      <button onClick={(e) => { FilterSearch(speciality, name, agency, email); e.preventDefault() }} className="btn btn-primary">Search</button>
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
                <CardBody>
                  <div className="table-responsive">
                    <Table className="table-striped table-bordered mb-0">
                      <thead>
                        <tr>
                          <th scope="col">#</th>
                          <th scope="col">Category</th>
                          {/* <th scope="col">Code</th> */}
                          <th scope="col">Name</th>
                          <th scope="col">Address</th>
                          <th scope="col">City</th>
                          <th scope="col">Contact</th>
                          <th scope="col">Documents</th>
                          {/* <th scope="col">Attachment</th> */}
                          <th scope="col">Action</th>
                          {/* <th scope="col">Action</th> */}
                        </tr>
                      </thead>

                      {vendor.map((item, i) => {
                        return (

                          <tbody>
                            <tr>
                              <td>{i + 1}</td>
                              <td>
                                <a href="#!"
                                  onClick={() => {
                                    tog_large2()
                                  }}
                                  data-toggle="modal"
                                  data-target=".bs-example-modal-lg"
                                >
                                  {item.specialties.length > 0 ? item.specialties.map(a => a.specialty).join() : "No Category found"}
                                </a>
                                <Modal
                                  size="lg"
                                  isOpen={modal_large2}
                                  toggle={() => {
                                    tog_large2()
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
                                        setmodal_large2(false)
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
                                            <Label className="form-label" htmlFor="formrow-name-input">Vendor Name</Label>
                                            <Input type="text" className="form-control" value="Danish" id="formrow-name-input" readonly />
                                          </div>
                                        </div>
                                        <div className="col-md-6">
                                          <div className="mb-3">
                                            <Label className="form-label" htmlFor="formrow-code-input">Vendor Code</Label>
                                            <Input type="text" className="form-control" value="12345" id="formrow-code-input" readonly />
                                          </div>
                                        </div>
                                        <div className="col-md-6">
                                          <div className="mb-3">
                                            <Label className="form-Label">Category</Label>
                                            <Input type="text" className="form-control" value="Category 1" id="formrow-cat-input" readonly />
                                          </div>
                                        </div>
                                        <div className="col-md-6">
                                          <div className="mb-3">
                                            <Label className="form-Label">Active</Label>
                                            <Input type="text" className="form-control" value="Yes" id="formrow-stat-input" readonly />
                                          </div>
                                        </div>
                                        <div className="col-md-6">
                                          <div className="mb-3">
                                            <Label className="form-Label">Rate/Term</Label>
                                            <div class="row">
                                              <div class="col-md-8">
                                                <div className="mb-3">
                                                  <Input type="text" className="form-control" value="100" id="formrow-code-input" readonly />
                                                </div>
                                              </div>
                                              <div class="col-md-4">
                                                <div className="mb-3">
                                                  <Input type="text" className="form-control" value="Hours" id="formrow-code-input" readonly />
                                                </div>
                                              </div>
                                            </div>
                                          </div>
                                        </div>
                                        <div className="col-md-12">
                                          <Card>
                                            <CardBody>
                                              <h4 className="card-title mb-4">Details</h4>
                                              <div className="row">
                                                <div className="col-md-6">
                                                  <div className="mb-3">
                                                    <Label className="form-label" htmlFor="formrow-address-input">Address1</Label>
                                                    <Input type="text" className="form-control" value="#9, Industrial Area, near Rajdeep Nagar" id="formrow-address-input" readonly />
                                                  </div>
                                                </div>
                                                <div className="col-md-6">
                                                  <div className="mb-3">
                                                    <Label className="form-label" htmlFor="formrow-address-input">Address2</Label>
                                                    <Input type="text" className="form-control" value="#9, Industrial Area, near Rajdeep Nagar" id="formrow-address-input" readonly />
                                                  </div>
                                                </div>
                                                <div className="col-md-6">
                                                  <div className="mb-3">
                                                    <Label className="form-label" htmlFor="formrow-city-input">City</Label>
                                                    <Input type="text" className="form-control" value="Toronto" id="formrow-city-input" readonly />
                                                  </div>
                                                </div>
                                                <div className="col-md-6">
                                                  <div className="mb-3">
                                                    <Label className="form-label" htmlFor="formrow-state-input">State/Province</Label>
                                                    <Input type="text" className="form-control" value="Brampton" id="formrow-state-input" readonly />
                                                  </div>
                                                </div>
                                                <div className="col-md-6">
                                                  <div className="mb-3">
                                                    <Label className="form-label" htmlFor="formrow-postal-input">Postal/Zip Code</Label>
                                                    <Input type="text" className="form-control" value="143416" id="formrow-postal-input" readonly />
                                                  </div>
                                                </div>
                                                <div className="col-md-6">
                                                  <div className="mb-3">
                                                    <Label className="form-label" htmlFor="formrow-contact-input">Telephone 1</Label>
                                                    <Input type="text" className="form-control" value="143416" id="formrow-contact-input" readonly />
                                                  </div>
                                                </div>
                                                <div className="col-md-6">
                                                  <div className="mb-3">
                                                    <Label className="form-label" htmlFor="formrow-contact-input">Telephone 2</Label>
                                                    <Input type="text" className="form-control" value="143416" id="formrow-contact-input" readonly />
                                                  </div>
                                                </div>
                                                <div className="col-md-6">
                                                  <div className="mb-3">
                                                    <Label className="form-label" htmlFor="formrow-fax-input">Fax</Label>
                                                    <Input type="text" className="form-control" value="243416" id="formrow-fax-input" readonly />
                                                  </div>
                                                </div>
                                                <div className="col-md-6">
                                                  <div className="mb-3">
                                                    <Label className="form-label" htmlFor="formrow-contact-input">Contact</Label>
                                                    <Input type="text" className="form-control" value="143416" id="formrow-contact-input" readonly />
                                                  </div>
                                                </div>
                                                <div className="col-md-6">
                                                  <div className="mb-3">
                                                    <Label className="form-label" htmlFor="formrow-email-input">Email</Label>
                                                    <Input type="text" className="form-control" value="abc@gmail.com" id="formrow-email-input" readonly />
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
                              </td>
                              {/* <td>18</td> */}
                              <td>{item.first_name}</td>
                              <td>{item.address}</td>
                              <td>{item.address}</td>
                              <td>{item.contact_no}</td>
                              <td>{<button
                                onClick={() => { viewDocuments(item._id, i) }}
                                className="btn btn-primary mo-mb-2 mr-10"
                                type="button"
                                style={{ cursor: "pointer" }}
                              >
                                View
                              </button>}</td>


                              <td>{item.loading ? <button className="btn btn-primary w-100"><div
                                id="saveSpinner"
                                style={{
                                  height: "15px",
                                  width: "15px",
                                  marginLeft: "5px",
                                }}
                                className="spinner-border"
                                role="status"
                              > </div></button>
                                :
                                item.verified || item.removed ?

                                  <div>
                                    {item.verified && <div style={{ color: "green" }}>Verified</div>}
                                    {item.removed && <div style={{ color: "red" }}>Removed</div>}

                                  </div>

                                  :
                                  <div>
                                    <button
                                      onClick={() => { verification(item._id, i) }}
                                      className="btn btn-primary mo-mb-2 mr-10"
                                      type="button"
                                      style={{ cursor: "pointer" }}
                                    >
                                      Verify
                                    </button>
                                    <button
                                      onClick={() => { removeRequest(item._id, i) }}
                                      className="btn btn-danger mo-mb-2 mr-10"
                                      type="button"
                                      style={{ cursor: "pointer" }}
                                    >
                                      Delete
                                    </button>
                                  </div>
                              }</td>

                              <Modal
                                size="lg"
                                isOpen={openDocumentModel}
                                toggle={() => {
                                  // tog_large2()
                                  toggleDocumentModel()
                                }}
                              >
                                <div className="modal-header">
                                  <h5
                                    className="modal-title mt-0"
                                    id="myLargeModalLabel"
                                  >
                                    Documents
                                  </h5>
                                  <button
                                    onClick={() => {
                                      toggleDocumentModel()
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
                                  <div className="row">

                                    <div className="col-md-6">
                                      <h5
                                        className="modal-title mt-0"
                                        id="myLargeModalLabel"
                                      >
                                        Id Proofs :
                                      </h5>
                                      <br />
                                      <div className="row">
                                        {idProofList.map((item) => {
                                          return (
                                            <div className="col-md-3" style={{ marginLeft: "10px" }}>
                                              <div className="mb-3">

                                                <img src={`${SERVER_URL}/${item}`} width="300" height={"200"} />
                                              </div>
                                              <a
                                                href={`${SERVER_URL}/${item}`}
                                                download
                                                className="btn btn-primary"
                                                style={{ width: "150px" }}
                                                onClick={e => download(e)}
                                              >
                                                <i className="fa fa-download" />
                                                {"  download"}
                                              </a>
                                            </div>
                                          )
                                        })}
                                      </div>
                                    </div>
                                    <div className="col-md-6">
                                      <h5
                                        className="modal-title mt-0"
                                        id="myLargeModalLabel"
                                      >
                                        Profile :
                                      </h5>
                                      <br />

                                      {profilesList.map((item) => {
                                        return (
                                          <div className="col-md-3" style={{ marginLeft: "10px" }}>
                                            <div className="mb-3">

                                              <img src={`${SERVER_URL}/${item}`} width="300" height={"200"} />
                                            </div>
                                            <a
                                              href={`${SERVER_URL}/${item}`}
                                              download
                                              className="btn btn-primary"
                                              style={{ width: "150px" }}
                                              onClick={e => download(e)}
                                            >
                                              <i className="fa fa-download" />
                                              {"  download"}
                                            </a>
                                          </div>
                                        )
                                      })}
                                    </div>

                                  </div>


                                </div>
                              </Modal>




                              {/* <td>
                                <div className="d-flex gap-3">
                                  <Link className="text-success" to="#">
                                    <i
                                      className="mdi mdi-pencil font-size-18"
                                      id="edittooltip"
                                      onClick={() => {
                                        tog_large()
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
                                        setmodal_large(false)
                                      }}
                                    ></i>
                                  </Link>
                                </div>
                              </td> */}
                            </tr>
                            {/* <tr>
                          <td>2</td>
                          <td>
                            <a href="#!"
                              onClick={() => {
                                tog_large2()
                              }}
                              data-toggle="modal"
                              data-target=".bs-example-modal-lg"
                            >
                              HVAC/Refrigeration
                            </a>
                          </td>
                          <td>18</td>
                          <td>Danish Sharma</td>
                          <td>#9, Industrial Area, near Rajdeep Nagar</td>
                          <td>Ambala</td>
                          <td>8550605580
                          </td>
                          <td>
                            <div>
                              <button
                                type="button"
                                className="btn btn-soft-light btn-sm w-xs waves-effect btn-label waves-light"
                              >
                                <i className="bx bx-download label-icon"></i> Excel
                              </button>
                            </div>
                          </td>
                          <td>Yes</td>
                          <td>
                            <div className="d-flex gap-3">
                              <Link className="text-success" to="#">
                                <i
                                  className="mdi mdi-pencil font-size-18"
                                  id="edittooltip"
                                  onClick={() => {
                                    tog_large()
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
                                    setmodal_large(false)
                                  }}
                                ></i>
                              </Link>
                            </div>
                          </td>
                        </tr>
                        <tr>
                          <td>3</td>
                          <td>
                            <a href="#!"
                              onClick={() => {
                                tog_large2()
                              }}
                              data-toggle="modal"
                              data-target=".bs-example-modal-lg"
                            >
                              Plumbing
                            </a>
                          </td>
                          <td>18</td>
                          <td>Danish Sharma</td>
                          <td>#9, Industrial Area, near Rajdeep Nagar</td>
                          <td>Ambala</td>
                          <td>8550605580
                          </td>
                          <td>
                            <div>
                              <button
                                type="button"
                                className="btn btn-soft-light btn-sm w-xs waves-effect btn-label waves-light"
                              >
                                <i className="bx bx-download label-icon"></i> Excel
                              </button>
                            </div>
                          </td>
                          <td>Yes</td>
                          <td>
                            <div className="d-flex gap-3">
                              <Link className="text-success" to="#">
                                <i
                                  className="mdi mdi-pencil font-size-18"
                                  id="edittooltip"
                                  onClick={() => {
                                    tog_large()
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
                                    setmodal_large(false)
                                  }}
                                ></i>
                              </Link>
                            </div>
                          </td>
                        </tr>
                        <tr>
                          <td>4</td>
                          <td>
                            <a href="#!"
                              onClick={() => {
                                tog_large2()
                              }}
                              data-toggle="modal"
                              data-target=".bs-example-modal-lg"
                            >
                              Painting
                            </a>
                          </td>
                          <td>18</td>
                          <td>Danish Sharma</td>
                          <td>#9, Industrial Area, near Rajdeep Nagar</td>
                          <td>Ambala</td>
                          <td>8550605580
                          </td>
                          <td>
                            <div>
                              <button
                                type="button"
                                className="btn btn-soft-light btn-sm w-xs waves-effect btn-label waves-light"
                              >
                                <i className="bx bx-download label-icon"></i> Excel
                              </button>
                            </div>
                          </td>
                          <td>Yes</td>
                          <td>
                            <div className="d-flex gap-3">
                              <Link className="text-success" to="#">
                                <i
                                  className="mdi mdi-pencil font-size-18"
                                  id="edittooltip"
                                  onClick={() => {
                                    tog_large()
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
                                    setmodal_large(false)
                                  }}
                                ></i>
                              </Link>
                            </div>
                          </td>
                        </tr>
                        <tr>
                          <td>5</td>
                          <td>Painting</td>
                          <td>18</td>
                          <td>Danish Sharma</td>
                          <td>#9, Industrial Area, near Rajdeep Nagar</td>
                          <td>Ambala</td>
                          <td>8550605580
                          </td>
                          <td>
                            <div>
                              <button
                                type="button"
                                className="btn btn-soft-light btn-sm w-xs waves-effect btn-label waves-light"
                              >
                                <i className="bx bx-download label-icon"></i> Excel
                              </button>
                            </div>
                          </td>
                          <td>Yes</td>
                          <td>
                            <div className="d-flex gap-3">
                              <Link className="text-success" to="#">
                                <i
                                  className="mdi mdi-pencil font-size-18"
                                  id="edittooltip"
                                  onClick={() => {
                                    tog_large()
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
                                    setmodal_large(false)
                                  }}
                                ></i>
                              </Link>
                            </div>
                          </td>
                        </tr>
 */}

                          </tbody>
                        )
                      })}
                    </Table>
                  </div>
                  {/* <Row className="proress-style mt-3">
                    <Col xl={3}>
                    </Col>
                    <Col xl={9}>
                      <div className="pagination-bar">
                        <Pagination aria-label="Page navigation example">
                          <PaginationItem disabled>
                            <PaginationLink href="#" tabIndex="-1">
                              Previous
                            </PaginationLink>
                          </PaginationItem>
                          <PaginationItem>
                            <PaginationLink href="#">1</PaginationLink>
                          </PaginationItem>
                          <PaginationItem active>
                            <PaginationLink href="#">
                              2 <span className="sr-only">(current)</span>
                            </PaginationLink>
                          </PaginationItem>
                          <PaginationItem>
                            <PaginationLink href="#">3</PaginationLink>
                          </PaginationItem>
                          <PaginationItem>
                            <PaginationLink href="#">Next</PaginationLink>
                          </PaginationItem>
                        </Pagination>
                      </div>
                    </Col>
                  </Row> */}
                </CardBody>
              </Card>
            </Col>
          </Row>
        </div>
      </div >
    </React.Fragment >
  )
}
export default Vendors
