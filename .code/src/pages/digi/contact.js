import React, { useState } from "react";
import MetaTags from 'react-meta-tags';
import { Link } from "react-router-dom"
import {
  Table,
  Row,
  Col,
  Card,
  CardBody,
  CardText,
  Modal,
  CardHeader,
  Label,
  Input,
  Nav,
  NavItem,
  NavLink,
  TabContent,
  TabPane,
  Form,
  Pagination,
  PaginationItem,
  DropdownItem,
  DropdownMenu,
  DropdownToggle,
  Dropdown,
  PaginationLink

} from "reactstrap"

//Import Breadcrumb
import Breadcrumbs from "../../components/Common/Breadcrumb"
import classnames from "classnames"

// Form Editor
import { Editor } from "react-draft-wysiwyg"
import "react-draft-wysiwyg/dist/react-draft-wysiwyg.css"

const Contact = () => {
    const [customActiveTab, setcustomActiveTab] = useState("1")
    const [btnsuccess1, setBtnsuccess1] = useState(false);

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
     const toggleCustom = tab => {
        if (customActiveTab !== tab) {
            setcustomActiveTab(tab)
        }
    }
  return (
    <React.Fragment>
      <div className="page-content">
        <MetaTags>
          <title>Rentdigicare | Contacts </title>
        </MetaTags>
        <div className="container-fluid">
          <Breadcrumbs title="Home" breadcrumbItem="Contacts" />
          <Row>
            <Col xl={12}>
              <Card>
                <CardHeader>
                <div className="row align-items-center">
                  <div className="col-md-6">
                     <div className="mb">
                        <h5 className="card-title">Contacts <span className="text-muted fw-normal ms-2">(6)</span></h5>
                      </div>
                  </div>
                  <div className="col-md-6 d-flex flex-wrap align-items-center justify-content-end">
                    <div className="mb d-flex flex-wrap">
                    <Dropdown
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
                    </Dropdown>  
                    <button
                        type="button"
                        onClick={() => {
                            tog_large()
                        }}
                        className="btn btn-light "
                        data-toggle="modal"
                        data-target=".bs-example-modal-lg"
                    >
                        <i className="bx bx-plus me-1"></i> Add Contacts
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
                                Add Contacts
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
                                  <Label className="form-label" htmlFor="formrow-code-input">Contact Code</Label>
                                  <Input type="text" className="form-control" id="formrow-code-input" />
                            </div>
                          </div>   
                          <div className="col-md-6">
                            <div className="mb-3">
                                <Label className="form-Label">Facility</Label>
                                <select className="form-select">
                                    <option>Select One</option>
                                    <option>Facility 1</option>
                                    <option>Facility 2</option>
                                    <option>Facility 3</option>
                                    <option>Facility 4</option>
                                    <option>Facility 5</option>
                                    <option>Facility 6</option>
                                </select>
                            </div>    
                          </div>
                          <div className="col-md-6">
                            <div className="mb-3">
                                <Label className="form-Label">Status</Label>
                                <select className="form-select">
                                    <option>Select One</option>
                                    <option>Active</option>
                                    <option>Inactive</option>
                                </select>
                            </div>    
                          </div>
                          <div className="col-md-6">
                            <div className="mb-3">
                            <label htmlFor="choices-chk-default" className="form-label font-size-13 text-muted"></label>
                                <div className="form-check">
                                      <input className="form-check-input" type="checkbox" id="formCheck1" defaultChecked/>
                                      <label className="form-check-label" htmlFor="formCheck1">
                                          Global
                                      </label>
                                  </div>
                            </div>    
                          </div>     
                          
                          <div className="col-md-12">
                            <Card>
                                <CardBody>
                                    <Nav tabs className="nav-tabs-custom nav-justified">
                                        <NavItem>
                                            <NavLink
                                                style={{ cursor: "pointer" }}
                                                className={classnames({
                                                    active: customActiveTab === "1",
                                                })}
                                                onClick={() => {
                                                    toggleCustom("1")
                                                }}
                                            >
                                                <span className="d-block d-sm-none">
                                                    <i className="fas fa-home"></i>
                                                </span>
                                                <span className="d-none d-sm-block">Details</span>
                                            </NavLink>
                                        </NavItem>
                                        <NavItem>
                                            <NavLink
                                                style={{ cursor: "pointer" }}
                                                className={classnames({
                                                    active: customActiveTab === "2",
                                                })}
                                                onClick={() => {
                                                    toggleCustom("2")
                                                }}
                                            >
                                                <span className="d-block d-sm-none">
                                                    <i className="far fa-user"></i>
                                                </span>
                                                <span className="d-none d-sm-block">Notes</span>
                                            </NavLink>
                                        </NavItem>
                                    </Nav>

                                    <TabContent
                                        activeTab={customActiveTab}
                                        className="p-3 text-muted"
                                    >
                                        <TabPane tabId="1">
                                            <Row>
                                                <Col md="12">
                                                    <CardText className="mb-0">
                                                        <div className="row">    
                                                            <div className="col-md-6">
                                                                <div className="mb-3">
                                                                    <Label className="form-label" htmlFor="formrow-name-input">First Name</Label>
                                                                    <Input type="text" className="form-control" id="formrow-name-input" />
                                                                </div>
                                                            </div>
                                                            <div className="col-md-6">
                                                                <div className="mb-3">
                                                                    <Label className="form-label" htmlFor="formrow-name-input">Second Name</Label>
                                                                    <Input type="text" className="form-control" id="formrow-name-input" />
                                                                </div>
                                                            </div>
                                                            <div className="col-md-6">
                                                                <div className="mb-3">
                                                                    <Label className="form-label" htmlFor="formrow-email-input">Email</Label>
                                                                    <Input type="text" className="form-control" id="formrow-email-input" />
                                                                </div>
                                                            </div>
                                                            <div className="col-md-6">
                                                                <div className="mb-3">
                                                                    <Label className="form-label" htmlFor="formrow-address-input">Address</Label>
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
                                                                    <Label className="form-Label">State/Province</Label>
                                                                    <select className="form-select">
                                                                        <option>Select One</option>
                                                                        <option>Alberta</option>
                                                                        <option>British Columbia</option>
                                                                        <option>British Columbia</option>
                                                                        <option>Manitoba</option>
                                                                        <option>New Brunswick</option>
                                                                        <option>Nunavut</option>    
                                                                    </select>
                                                                </div>    
                                                            </div>
                                                            <div className="col-md-6">
                                                                <div className="mb-3">
                                                                    <Label className="form-label" htmlFor="formrow-code-input">Postal/Zip Code</Label>
                                                                    <Input type="text" className="form-control" id="formrow-code-input" />
                                                                </div>
                                                            </div>
                                                            <div className="col-md-6">
                                                                <div className="mb-3">
                                                                    <Label className="form-label" htmlFor="formrow-phone-input">Telephone 1</Label>
                                                                    <Input type="text" className="form-control" id="formrow-phone-input" />
                                                                </div>
                                                            </div>
                                                            <div className="col-md-6">
                                                                <div className="mb-3">
                                                                    <Label className="form-label" htmlFor="formrow-phone-input">Telephone 2</Label>
                                                                    <Input type="text" className="form-control" id="formrow-phone-input" />
                                                                </div>
                                                            </div>
                                                        </div>
                                                    </CardText>
                                                </Col>
                                            </Row>
                                        </TabPane>
                                        <TabPane tabId="2">
                                            <Row>
                                                <Col md="12">
                                                <CardText className="mb-0">
                                                        <div className="row">    
                                                        <div className="col-md-12">
                                                            <div className="mb-3">
                                                                <Editor
                                                                    toolbarClassName="toolbarClassName"
                                                                    wrapperClassName="wrapperClassName"
                                                                    editorClassName="editorClassName"
                                                                />
                                                            </div>          
                                                        </div> 
                                                        </div>
                                                    </CardText>
                                                </Col>
                                            </Row>
                                        </TabPane>
                                    </TabContent>
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
                </CardHeader>
                <CardBody>
                  <div className="table-responsive">
                    <Table className="table-striped table-bordered mb-0">
                      <thead>
                        <tr>
                          <th scope="col">#</th>
                          <th scope="col">Email</th>
                          <th scope="col">Code</th>
                          <th scope="col">Facility</th>
                          <th scope="col">First Name</th>
                          <th scope="col">Last Name</th>
                          <th scope="col">Address</th>
                          <th scope="col">Active</th>
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
                                danishsharma88@gmail.com
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
                                  View Contacts
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
                                  <Label className="form-label" htmlFor="formrow-code-input">Contact Code</Label>
                                  <Input type="text" className="form-control" value="12345" id="formrow-code-input" readOnly/>
                            </div>
                          </div>   
                          <div className="col-md-6">
                            <div className="mb-3">
                                <Label className="form-Label">Facility</Label>
                                <Input type="text" className="form-control" value="Facility 1" id="formrow-facility-input" readOnly/>
                            </div>    
                          </div>
                          <div className="col-md-6">
                            <div className="mb-3">
                                <Label className="form-Label">Status</Label>
                                <Input type="text" className="form-control" value="Active" id="formrow-status-input" readOnly/>
                            </div>    
                          </div>
                          <div className="col-md-6">
                          <div className="mb-3">
                                <Label className="form-Label">Global</Label>
                                <Input type="text" className="form-control" value="Yes" id="formrow-global-input" readOnly/>
                            </div>       
                          </div>     
                          
                          <div className="col-md-12">
                            <Card>
                                <CardBody>
                                    <Nav tabs className="nav-tabs-custom nav-justified">
                                        <NavItem>
                                            <NavLink
                                                style={{ cursor: "pointer" }}
                                                className={classnames({
                                                    active: customActiveTab === "1",
                                                })}
                                                onClick={() => {
                                                    toggleCustom("1")
                                                }}
                                            >
                                                <span className="d-block d-sm-none">
                                                    <i className="fas fa-home"></i>
                                                </span>
                                                <span className="d-none d-sm-block">Details</span>
                                            </NavLink>
                                        </NavItem>
                                        <NavItem>
                                            <NavLink
                                                style={{ cursor: "pointer" }}
                                                className={classnames({
                                                    active: customActiveTab === "2",
                                                })}
                                                onClick={() => {
                                                    toggleCustom("2")
                                                }}
                                            >
                                                <span className="d-block d-sm-none">
                                                    <i className="far fa-user"></i>
                                                </span>
                                                <span className="d-none d-sm-block">Notes</span>
                                            </NavLink>
                                        </NavItem>
                                    </Nav>

                                    <TabContent
                                        activeTab={customActiveTab}
                                        className="p-3 text-muted"
                                    >
                                        <TabPane tabId="1">
                                            <Row>
                                                <Col md="12">
                                                    <CardText className="mb-0">
                                                        <div className="row">    
                                                            <div className="col-md-6">
                                                                <div className="mb-3">
                                                                    <Label className="form-label" htmlFor="formrow-name-input">First Name</Label>
                                                                    <Input type="text" className="form-control" value="Danish" id="formrow-name-input" readOnly />
                                                                </div>
                                                            </div>
                                                            <div className="col-md-6">
                                                                <div className="mb-3">
                                                                    <Label className="form-label" htmlFor="formrow-name-input">Second Name</Label>
                                                                    <Input type="text" className="form-control" value="Sharma" id="formrow-name-input" readOnly/>
                                                                </div>
                                                            </div>
                                                            <div className="col-md-6">
                                                                <div className="mb-3">
                                                                    <Label className="form-label" htmlFor="formrow-email-input">Email</Label>
                                                                    <Input type="text" className="form-control" value="abc@gmail.com" id="formrow-email-input" readOnly />
                                                                </div>
                                                            </div>
                                                            <div className="col-md-6">
                                                                <div className="mb-3">
                                                                    <Label className="form-label" htmlFor="formrow-address-input">Address</Label>
                                                                    <Input type="text" className="form-control" value="Canada"  id="formrow-address-input" readOnly />
                                                                </div>
                                                            </div>
                                                            <div className="col-md-6">
                                                                <div className="mb-3">
                                                                    <Label className="form-label" htmlFor="formrow-city-input">City</Label>
                                                                    <Input type="text" className="form-control" value="Toronto" id="formrow-city-input" readOnly />
                                                                </div>
                                                            </div>
                                                            <div className="col-md-6">
                                                                <div className="mb-3">
                                                                    <Label className="form-Label">State/Province</Label>
                                                                    <Input type="text" className="form-control" value="Alberta" id="formrow-city-input" readOnly />
              
                                                                </div>    
                                                            </div>
                                                            <div className="col-md-6">
                                                                <div className="mb-3">
                                                                    <Label className="form-label" htmlFor="formrow-code-input">Postal/Zip Code</Label>
                                                                    <Input type="text" className="form-control" value="143416"  id="formrow-code-input" readOnly />
                                                                </div>
                                                            </div>
                                                            <div className="col-md-6">
                                                                <div className="mb-3">
                                                                    <Label className="form-label" htmlFor="formrow-phone-input">Telephone 1</Label>
                                                                    <Input type="text" className="form-control" value="143416" id="formrow-phone-input" eadOnly/>
                                                                </div>
                                                            </div>
                                                            <div className="col-md-6">
                                                                <div className="mb-3">
                                                                    <Label className="form-label" htmlFor="formrow-phone-input">Telephone 2</Label>
                                                                    <Input type="text" className="form-control" value="143416" id="formrow-phone-input" eadOnly/>
                                                                </div>
                                                            </div>
                                                        </div>
                                                    </CardText>
                                                </Col>
                                            </Row>
                                        </TabPane>
                                        <TabPane tabId="2">
                                            <Row>
                                                <Col md="12">
                                                <textarea
                                                    id="basicpill-address-input"
                                                    className="form-control"
                                                    rows="3"
                                                    readOnly
                                                    placeholder="Lorem Ipsum is simply dummy text of the printing and typesetting industry.
                                                    Lorem Ipsum has been the industry's standard dummy text ever since the 1500s, when an 
                                                    unknown printer took a galley of type and scrambled it to make a type specimen book."
                                                  ></textarea>
                                                </Col>
                                            </Row>
                                        </TabPane>
                                    </TabContent>
                                </CardBody>
                            </Card>
                          </div>
                          
                          </div>
                          </Form>     
                          </div> 
                      </Modal>
                          </td>
                          <td>22VV1</td>
                          <td>Facility1</td>
                          <td>Danish</td>
                          <td>Sharma</td>
                          <td>V-22, Malbourne</td>
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
                          <td>2</td>
                          <td><a href="#!"
                                  onClick={() => {
                                      tog_large2()
                                  }}
                                  data-toggle="modal"
                                  data-target=".bs-example-modal-lg"
                                  >
                                danishsharma88@gmail.com
                              </a>  </td>
                          <td>22VV1</td>
                          <td>Facility1</td>
                          <td>Danish</td>
                          <td>Sharma</td>
                          <td>V-23, Sydney</td>
                          <td>No</td>
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
                          <td><a href="#!"
                                  onClick={() => {
                                      tog_large2()
                                  }}
                                  data-toggle="modal"
                                  data-target=".bs-example-modal-lg"
                                  >
                                danishsharma88@gmail.com
                              </a>  </td>
                          <td>22VV1</td>
                          <td>Facility1</td>
                          <td>Danish</td>
                          <td>Sharma</td>
                          <td>V-22, Tasmania</td>
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
                          <td><a href="#!"
                                  onClick={() => {
                                      tog_large2()
                                  }}
                                  data-toggle="modal"
                                  data-target=".bs-example-modal-lg"
                                  >
                                danishsharma88@gmail.com
                              </a>  </td>
                          <td>22VV1</td>
                          <td>Facility1</td>
                          <td>Danish</td>
                          <td>Sharma</td>
                          <td>V-22, Singapur</td>
                          <td>No</td>
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
                          <td><a href="#!"
                                  onClick={() => {
                                      tog_large2()
                                  }}
                                  data-toggle="modal"
                                  data-target=".bs-example-modal-lg"
                                  >
                                danishsharma88@gmail.com
                              </a>  </td>
                          <td>22VV1</td>
                          <td>Facility1</td>
                          <td>Danish</td>
                          <td>Sharma</td>
                          <td>V-22, America</td>
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
                          <td>6</td>
                          <td><a href="#!"
                                  onClick={() => {
                                      tog_large2()
                                  }}
                                  data-toggle="modal"
                                  data-target=".bs-example-modal-lg"
                                  >
                                danishsharma88@gmail.com
                              </a>  </td>
                          <td>22VV1</td>
                          <td>Facility1</td>
                          <td>Danish</td>
                          <td>Sharma</td>
                          <td>V-22, UK</td>
                          <td>No</td>
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
}
export default Contact
