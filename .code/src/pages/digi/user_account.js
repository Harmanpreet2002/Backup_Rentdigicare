import React, { useState } from "react";
import MetaTags from 'react-meta-tags';
import Select from "react-select";
import { Link } from "react-router-dom"
import {
  Table,
  Row,
  Col,
  Card,
  CardBody,
  Modal,
  CardHeader,
  Label,
  Form,
  Pagination,
  PaginationItem,
  Collapse,
  PaginationLink,
  Input
} from "reactstrap"
// Form Editor
import { Editor } from "react-draft-wysiwyg"
import "react-draft-wysiwyg/dist/react-draft-wysiwyg.css"

// Form Mask
import InputMask from "react-input-mask"

//Import Breadcrumb
import Breadcrumbs from "../../components/Common/Breadcrumb"

const UserAccount = () => {
    
    const DUR = props => (
        <InputMask
          mask="99.99"
          value={props.value}
          className="form-control input-color"
          onChange={props.onChange}
        >
        </InputMask>
    )  

  const optionMulti = [
    { label: "Choice 1", value: "choice-1" },
    { label: "Choice 2", value: "choice-2" },
    { label: "Choice 3", value: "choice-3" }
  ]

  const [col5, setcol5] = useState(false) 
  
  const t_col5 = () => {
      setcol5(!col5)
  }
    const [modal_large, setmodal_large] = useState(false);
    const [modal_large2, setmodal_large2] = useState(false); 

    function removeBodyCss() {
        document.body.classList.add("no_padding")
    }

    function tog_large() {
        setmodal_large(!modal_large)
         removeBodyCss()
     }

     function tog_large2() {
      setmodal_large2(!modal_large2)
       removeBodyCss()
    }

    const role = window.localStorage.getItem("role");
    if(role === "admin"){
        return (
          <React.Fragment>
            <div className="page-content">
              <MetaTags>
                <title>Rentdigicare | User Account</title>
              </MetaTags>
              <div className="container-fluid">
                <Breadcrumbs title="Home" breadcrumbItem="User Account" />
                <Row>
                  <Col xl={12}>
                    <Card>
              
                    <CardHeader>
                      <div className="row align-items-center">
                        <div className="col-md-6">
                          <div className="mb">
                              <h5 className="card-title">User Account<span className="text-muted fw-normal ms-2">(6)</span></h5>
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
                                  tog_large()
                              }}
                              className="btn btn-light "
                              data-toggle="modal"
                              data-target=".bs-example-modal-lg"
                          >
                              <i className="bx bx-plus me-1"></i>Add User Account
                          </button>
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
                                      Add User Account
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
                                        <Label className="form-label" htmlFor="formrow-name-input">Username</Label>
                                        <Input type="text" className="form-control" id="formrow-name-input" />
                                  </div>
                                </div>
                                <div className="col-md-6"> 
                                  <div className="mb-3">
                                        <Label className="form-label" htmlFor="formrow-pass-input">Password</Label>
                                        <Input type="password" className="form-control" id="formrow-Pass-input" />
                                  </div>
                                </div>
                                <div className="col-md-6"> 
                                  <div className="mb-3">
                                        <Label className="form-label" htmlFor="formrow-name-input">First Name</Label>
                                        <Input type="text" className="form-control" id="formrow-name-input" />
                                  </div>
                                </div>
                                <div className="col-md-6"> 
                                  <div className="mb-3">
                                        <Label className="form-label" htmlFor="formrow-email-input">Email</Label>
                                        <Input type="email" className="form-control" id="formrow-email-input" />
                                  </div>
                                </div>
                                <div className="col-md-6"> 
                                  <div className="mb-3">
                                        <Label className="form-label" htmlFor="formrow-name-input">Last Name</Label>
                                        <Input type="text" className="form-control" id="formrow-name-input" />
                                  </div>
                                </div>
                                <div className="col-md-6">
                                  <div className="mb-3">
                                        <Label className="form-label" htmlFor="formrow-facility-input">Time Zone</Label>
                                        <select className="form-select">
                                          <option>Select</option>
                                          <option>US/Samoa</option>
                                          <option>US/Hawaii</option>
                                          <option>US/Alaska</option>
                                          <option>US/Pacific</option>
                                          <option>US/Mountain</option>
                                      </select>
                                  </div>
                                </div>
                                <div className="col-md-6">
                                  <div className="mb-3">
                                      <div className="form-check">
                                            <input className="form-check-input" type="checkbox" id="formCheck1" defaultChecked/>
                                            <label className="form-check-label" htmlFor="formCheck1">
                                              Confirmed
                                            </label>
                                        </div>
                                  </div>    
                                </div>
                                <div className="col-md-6">
                                  <div className="mb-3">
                                        <div className="form-check">
                                            <input className="form-check-input" type="checkbox" id="formCheck2" defaultChecked/>
                                            <label className="form-check-label" htmlFor="formCheck2">
                                              Disabled  
                                            </label>
                                        </div>
                                  </div>
                                </div>
                                <div className="col-md-12">
                                  <div className="mb-3">
                                    <label htmlFor="choices-multiple-default" className="form-label font-size-13 text-muted">Auto-Assign</label>
                                    <Select
                                      defaultValue={[optionMulti[1]]}
                                      isMulti
                                      options={optionMulti}
                                      className="basic-multi-select"
                                      classNamePrefix="select"
                                    />
                                  </div>
                                </div>
                                <div className="col-md-12">
                                  <div className="mb-3">
                                    <label
                                      htmlFor="basicpill-address-input"
                                      className="form-label"
                                    >
                                      Description
                                    </label>
                                    <textarea
                                      id="basicpill-address-input"
                                      className="form-control"
                                      rows="3"
                                    ></textarea>
                                  </div>
                                </div>
                                <div className="col-md-12">
                                  <Card>
                                    <CardBody>
                                      <h4 className="card-title mb-4">Escalation</h4>
                                      <div className="mb-3">
                                        <Label className="form-Label">Period</Label>
                                        <select className="form-select">
                                            <option>Select</option>
                                            <option>One</option>
                                            <option>Two</option>
                                            <option>Three</option>
                                            <option>Fourth</option>
                                        </select>
                                      </div>
                                      <div className="mb-3">
                                          <Label className="form-label" htmlFor="formrow-email-input">Escalation Email</Label>
                                          <Input type="text" className="form-control" id="formrow-email-input" />
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
                                            <div className="col-md-4">
                                              <div className="mb-3">
                                                  <Label className="form-Label">Facility</Label>
                                                  <select className="form-select">
                                                      <option>Select One</option>
                                                      <option>Facility 1</option>
                                                      <option>Facility 2</option>
                                                      <option>Facility 3</option>
                                                      <option>Facility 4</option>
                                                  </select>
                                              </div>    
                                            </div>
                                            <div className="col-md-4">
                                                  <div className="mb-3">
                                                      <Label className="form-Label">Status</Label>
                                                      <select className="form-select">
                                                          <option>All</option>
                                                          <option>Active</option>
                                                          <option>Disabled</option>
                                                      </select>
                                                  </div>    
                                            </div>
                                            <div className="col-md-4">
                                                  <div className="mb-3">
                                                      <Label className="form-Label">Role</Label>
                                                      <select className="form-select">
                                                          <option>All</option>
                                                          <option>Worker - Status tab only</option>
                                                          <option>Analyzer - Reports tab only</option>
                                                          <option>Administrator - Admin tab only</option>
                                                          <option>Maintenance - Status / Cabinet tabs</option>
                                                      </select>
                                                  </div>    
                                            </div>
                                            <div className="col-md-12">
                                                <div className="srch-btn">
                                                  <button type="submit" className="btn btn-primary">Search</button>
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
                                <th scope="col">User Name</th>
                                <th scope="col">First Name</th>
                                <th scope="col">Last Name</th>
                                <th scope="col">Created</th>
                                <th scope="col">Password Changed</th>
                                <th scope="col">Email</th>
                                <th scope="col">Confirmation</th>
                                <th scope="col">Time Zone</th>
                                <th scope="col">Last Login</th>
                                <th scope="col">Status</th>
                                <th scope="col">Action</th>
                              </tr>
                            </thead>
                            <tbody>
                              <tr>
                                <td>1</td>
                                  <td>
                                    <a href="#!"
                                          onClick={() => {
                                              tog_large2()
                                          }}
                                          data-toggle="modal"
                                          data-target=".bs-example-modal-lg"
                                          >
                                          Danish Sharma
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
                                          View User Account
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
                                              <Label className="form-label" htmlFor="formrow-name-input">Username</Label>
                                              <Input type="text" className="form-control" id="formrow-name-input" readOnly />
                                        </div>
                                      </div>
                                      <div className="col-md-6"> 
                                        <div className="mb-3">
                                              <Label className="form-label" htmlFor="formrow-pass-input">Password</Label>
                                              <Input type="password" className="form-control" id="formrow-Pass-input" readOnly />
                                        </div>
                                      </div>
                                      <div className="col-md-6"> 
                                        <div className="mb-3">
                                              <Label className="form-label" htmlFor="formrow-name-input">First Name</Label>
                                              <Input type="text" className="form-control" value="Danish" id="formrow-name-input" readOnly />
                                        </div>
                                      </div>
                                      <div className="col-md-6"> 
                                        <div className="mb-3">
                                              <Label className="form-label" htmlFor="formrow-name-input">Last Name</Label>
                                              <Input type="text" className="form-control" value="Sharma" id="formrow-name-input"readOnly/>
                                        </div>
                                      </div>
                                      <div className="col-md-6"> 
                                        <div className="mb-3">
                                              <Label className="form-label" htmlFor="formrow-email-input">Email</Label>
                                              <Input type="email" className="form-control" value="abc@gmail.com" id="formrow-email-input"  readOnly/>
                                        </div>
                                      </div>
                                    
                                      <div className="col-md-6">
                                        <div className="mb-3">
                                              <Label className="form-label" htmlFor="formrow-time-input">Time Zone</Label>
                                              <Input type="text" className="form-control" value="US/Hawaii" id="formrow-time-input"  readOnly/>
                                        
                                        </div>
                                      </div>
                                      <div className="col-md-6">
                                        <div className="mb-3">
                                              <Label className="form-label" htmlFor="formrow-time-input">confirmed</Label>
                                              <Input type="text" className="form-control" value="Yes" id="formrow-time-input"  readOnly/>
                                        
                                        </div>   
                                      </div>
                                      <div className="col-md-6">
                                      <div className="mb-3">
                                              <Label className="form-label" htmlFor="formrow-time-input">Disabled</Label>
                                              <Input type="text" className="form-control" value="Yes" id="formrow-time-input"  readOnly/>
                                        
                                        </div> 
                                      </div>
                                      <div className="col-md-12">
                                      <div className="mb-3">
                                              <Label className="form-label" htmlFor="formrow-time-input">Auto-Assign</Label>
                                              <Input type="text" className="form-control" value="Danish Sharma" id="formrow-time-input"  readOnly/>
                                        
                                        </div> 
                                      </div>
                                      <div className="col-md-12">
                                        <div className="mb-3">
                                          <label
                                            htmlFor="basicpill-address-input"
                                            className="form-label"
                                          >
                                            Description
                                          </label>
                                          <textarea
                                            id="basicpill-address-input"
                                            className="form-control"
                                            rows="3"
                                            placeholder="Lorem Ipsum is simply dummy text of the printing and typesetting industry.
                                            Lorem Ipsum has been the industry's standard dummy text ever since the 1500s, when an 
                                            unknown printer took a galley of type and scrambled it to make a type specimen book."
                                            readOnly
                                          ></textarea>
                                        </div>
                                      </div>
                                      <div className="col-md-12">
                                        <Card>
                                          <CardBody>
                                            <h4 className="card-title mb-4">Escalation</h4>
                                            <div className="mb-3">
                                              <Label className="form-Label">Period</Label>
                                              <Input type="text" className="form-control" value="one" id="formrow-period-input"  readOnly/>
                                            </div>
                                            <div className="mb-3">
                                                <Label className="form-label" htmlFor="formrow-email-input">Escalation Email</Label>
                                                <Input type="email" className="form-control" value="abc@gmail.com" id="formrow-email-input" readOnly/>
                                          </div>
                                          </CardBody>    
                                        </Card>                       
                                      </div>
                                    </div> 
                                    </Form>        
                                  </div> 
                              </Modal>
                                </td>
                                <td>Danish</td>
                                <td>Sharma</td>
                                <td>11/12/2022</td>
                                <td>19/12/2022, 01:45 pm</td>
                                <td>abc@gmail.com</td>
                                <td>confirmed</td>
                                <td>Canada/Mountain</td>
                                <td>19/12/2022, 01:45 pm</td>
                                <td>Active</td>
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
                                <td>2</td>
                                <td>
                                    <a href="#!"
                                        onClick={() => {
                                            tog_large2()
                                        }}
                                        data-toggle="modal"
                                        data-target=".bs-example-modal-lg"
                                        >
                                        Danish Sharma
                                    </a>  
                                </td>
                                <td>Danish</td>
                                <td>Sharma</td>
                                <td>11/12/2022</td>
                                <td>19/12/2022, 01:45 pm</td>
                                <td>abc@gmail.com</td>
                                <td>confirmed</td>
                                <td>Canada/Mountain</td>
                                <td>19/12/2022, 01:45 pm</td>
                                <td>Active</td>
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
                                        Danish Sharma
                                    </a>  
                                </td>
                                <td>Danish</td>
                                <td>Sharma</td>
                                <td>11/12/2022</td>
                                <td>19/12/2022, 01:45 pm</td>
                                <td>abc@gmail.com</td>
                                <td>confirmed</td>
                                <td>Canada/Mountain</td>
                                <td>19/12/2022, 01:45 pm</td>
                                <td>Active</td>
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
                                        Danish Sharma
                                    </a>  
                                </td>
                                <td>Danish</td>
                                <td>Sharma</td>
                                <td>11/12/2022</td>
                                <td>19/12/2022, 01:45 pm</td>
                                <td>abc@gmail.com</td>
                                <td>confirmed</td>
                                <td>Canada/Mountain</td>
                                <td>19/12/2022, 01:45 pm</td>
                                <td>Active</td>
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
                                <td>
                                  <a href="#!"
                                      onClick={() => {
                                          tog_large2()
                                      }}
                                      data-toggle="modal"
                                      data-target=".bs-example-modal-lg"
                                      >
                                      Danish Sharma
                                  </a>  
                                </td>
                                <td>Danish</td>
                                <td>Sharma</td>
                                <td>11/12/2022</td>
                                <td>19/12/2022, 01:45 pm</td>
                                <td>abc@gmail.com</td>
                                <td>confirmed</td>
                                <td>Canada/Mountain</td>
                                <td>19/12/2022, 01:45 pm</td>
                                <td>Active</td>
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
                                <td>6</td>
                                <td>
                                  <a href="#!"
                                      onClick={() => {
                                          tog_large2()
                                      }}
                                      data-toggle="modal"
                                      data-target=".bs-example-modal-lg"
                                      >
                                      Danish Sharma
                                  </a>  
                                </td>
                                <td>Danish</td>
                                <td>Sharma</td>
                                <td>11/12/2022</td>
                                <td>19/12/2022, 01:45 pm</td>
                                <td>abc@gmail.com</td>
                                <td>confirmed</td>
                                <td>Canada/Mountain</td>
                                <td>19/12/2022, 01:45 pm</td>
                                <td>Active</td>
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
                                <td>7</td>
                                <td>
                                    <a href="#!"
                                        onClick={() => {
                                            tog_large2()
                                        }}
                                        data-toggle="modal"
                                        data-target=".bs-example-modal-lg"
                                        >
                                        Danish Sharma
                                    </a>  
                                </td>
                                <td>Danish</td>
                                <td>Sharma</td>
                                <td>11/12/2022</td>
                                <td>19/12/2022, 01:45 pm</td>
                                <td>abc@gmail.com</td>
                                <td>confirmed</td>
                                <td>Canada/Mountain</td>
                                <td>19/12/2022, 01:45 pm</td>
                                <td>Active</td>
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
                                <td>8</td>
                                <td>
                                  <a href="#!"
                                      onClick={() => {
                                          tog_large2()
                                      }}
                                      data-toggle="modal"
                                      data-target=".bs-example-modal-lg"
                                      >
                                      Danish Sharma
                                  </a>  
                                </td>
                                <td>Danish</td>
                                <td>Sharma</td>
                                <td>11/12/2022</td>
                                <td>19/12/2022, 01:45 pm</td>
                                <td>abc@gmail.com</td>
                                <td>confirmed</td>
                                <td>Canada/Mountain</td>
                                <td>19/12/2022, 01:45 pm</td>
                                <td>Active</td>
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
                            </tbody>
                          </Table>
                        </div>
                        <Row className="proress-style mt-3">
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
                          </Row>  
                      </CardBody>
                    </Card>
                  </Col>
                </Row>
              </div>
            </div>
          </React.Fragment>
        )
    }else if(role === "company"){
      window.location.replace("/property")
    }
}

export default UserAccount
