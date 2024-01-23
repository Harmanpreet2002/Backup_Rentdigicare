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

//Import Breadcrumb
import Breadcrumbs from "../../components/Common/Breadcrumb"
import classnames from "classnames"

// Form Editor
import { Editor } from "react-draft-wysiwyg"
import "react-draft-wysiwyg/dist/react-draft-wysiwyg.css"

const Assets = () => {
    const [customActiveTab, setcustomActiveTab] = useState("1")
    const [btnsuccess1, setBtnsuccess1] = useState(false);

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

     const toggleCustom = tab => {
        if (customActiveTab !== tab) {
            setcustomActiveTab(tab)
        }
    }
    function tog_large2() {
      setmodal_large2(!modal_large2)
       removeBodyCss()
    }
  return (
    <React.Fragment>
      <div className="page-content">
        <MetaTags>
          <title>Rentdigicare | Assets </title>
        </MetaTags>
        <div className="container-fluid">
          <Breadcrumbs title="Home" breadcrumbItem="Assets" />
          <Row>
            <Col xl={12}>
              <Card>
              <CardHeader>
                <div className="row align-items-center">
                  <div className="col-md-6">
                     <div className="mb">
                        <h5 className="card-title">Assets <span className="text-muted fw-normal ms-2">(6)</span></h5>
                      </div>
                  </div>
                  <div className="col-md-6 d-flex flex-wrap align-items-center justify-content-end">
                    <div className="mb d-flex flex-wrap">
                    <button
                        onClick={t_col5}
                        className="btn btn-primary mo-mb-2 mr-10"
                        type="button"
                        style={{ cursor: "pointer" }}
                    >
                        Filters
                    </button>  
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
                        <i className="bx bx-plus me-1"></i> Add Assets
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
                                Add Assets
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
                          <div className="col-md-4"> 
                            <div className="mb-3">
                                  <Label className="form-label" htmlFor="formrow-code-input">Asset Code</Label>
                                  <Input type="text" className="form-control" id="formrow-code-input" />
                            </div>
                          </div>
                          <div className="col-md-4">       
                            <div className="mb-3">
                                <Label htmlFor="example-date-input" className="form-Label">Date Purchased</Label>
                                <Input className="form-control" type="date" defaultValue="2019-08-19" id="example-date-input" />
                            </div>
                          </div>   
                          <div className="col-md-4">       
                            <div className="mb-3">
                                <Label htmlFor="example-date-input" className="form-Label">Warranty Expiry</Label>
                                <Input className="form-control" type="date" defaultValue="2019-08-19" id="example-date-input" />
                            </div>
                          </div>         
                          <div className="col-md-4">
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
                          <div className="col-md-4">
                            <div className="mb-3">
                                <Label className="form-Label">Vendor</Label>
                                <select className="form-select">
                                    <option>Select One</option>
                                    <option>Appliance</option>
                                    <option>Dial/Appliance</option>
                                    <option>Foti</option>
                                    <option>James - Plumber</option>
                                </select>
                            </div>    
                          </div>
                          <div className="col-md-4">
                            <div className="mb-3">
                                <Label className="form-Label">Assset Class</Label>
                                <select className="form-select">
                                    <option>Select One</option>
                                    <option>Assset Class 1</option>
                                    <option>Assset Class 2</option>
                                    <option>Assset Class 3</option>
                                    <option>Assset Class 4</option>
                                </select>
                            </div>    
                          </div>
                          <div className="col-md-4">
                            <div className="mb-3">
                                <Label className="form-Label">Status</Label>
                                <select className="form-select">
                                    <option>Select One</option>
                                    <option>Active</option>
                                    <option>Inactive</option>
                                </select>
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
                                                                    <Label className="form-label" htmlFor="formrow-make-input">Make</Label>
                                                                    <Input type="text" className="form-control" id="formrow-make-input" />
                                                                </div>
                                                            </div>
                                                            <div className="col-md-6">
                                                                <div className="mb-3">
                                                                    <Label className="form-label" htmlFor="formrow-model-input">Model</Label>
                                                                    <Input type="text" className="form-control" id="formrow-model-input" />
                                                                </div>
                                                            </div>
                                                            <div className="col-md-6">
                                                                <div className="mb-3">
                                                                    <Label className="form-label" htmlFor="formrow-serial-input">Serial</Label>
                                                                    <Input type="text" className="form-control" id="formrow-serial-input" />
                                                                </div>
                                                            </div>
                                                            <div className="col-md-6">
                                                                <div className="mb-3">
                                                                    <Label className="form-label" htmlFor="formrow-loc-input">Location</Label>
                                                                    <Input type="text" className="form-control" id="formrow-loc-input" />
                                                                </div>
                                                            </div>
                                                            <div className="col-md-6">
                                                                <div className="mb-3">
                                                                    <Label className="form-label" htmlFor="formrow-floor-input">Floor</Label>
                                                                    <Input type="text" className="form-control" id="formrow-floor-input" />
                                                                </div>
                                                            </div>
                                                            <div className="col-md-6">
                                                                <div className="mb-3">
                                                                    <Label className="form-label" htmlFor="formrow-room-input">Room</Label>
                                                                    <Input type="text" className="form-control" id="formrow-room-input" />
                                                                </div>
                                                            </div>
                                                            <div className="col-md-6">
                                                                <div className="mb-3">
                                                                    <Label className="form-label" htmlFor="formrow-unit-input">Unit Cost</Label>
                                                                    <Input type="text" className="form-control" id="formrow-unit-input" />
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
                <div className="row">
                      <div className="col-lg-12">
                        <Collapse className="mt-4" isOpen={col5}>
                            <Card>
                                <CardBody>
                                  <div className="filter-sec">
                                  <Form>
                                    <div class="row align-items-center">
                                      <div className="col-md-3">
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
                                      <div className="col-md-3">
                                        <div className="mb-3">
                                            <Label className="form-Label">Class</Label>
                                            <select className="form-select">
                                                <option>Select One</option>
                                                <option>Class 1</option>
                                                <option>Class 2</option>
                                                <option>Class 3</option>
                                                <option>Class 4</option>
                                            </select>
                                        </div>    
                                      </div>
                                      <div className="col-md-3"> 
                                        <div className="mb-3">
                                              <Label className="form-label" htmlFor="formrow-name-input">Name</Label>
                                              <Input type="text" className="form-control" id="formrow-name-input" />
                                        </div>
                                      </div>
                                      <div className="col-md-3"> 
                                        <div className="mb-3">
                                              <Label className="form-label" htmlFor="formrow-desc-input">Description</Label>
                                              <Input type="text" className="form-control" id="formrow-desc-input" />
                                        </div>
                                      </div>
                                      <div className="col-md-3"> 
                                        <div className="mb-3">
                                              <Label className="form-label" htmlFor="formrow-other-input">Other</Label>
                                              <Input type="text" className="form-control" id="formrow-other-input" />
                                        </div>
                                      </div>         
                                      <div className="col-md-3">
                                        <div className="mb-3">
                                            <Label className="form-Label">Vendor</Label>
                                            <select className="form-select">
                                                <option>Select One</option>
                                                <option>All</option>
                                                <option>Current</option>
                                                <option>Previous</option>
                                                <option>Inactive</option>
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
                          <th scope="col">Facility</th>
                          <th scope="col">Class</th>
                          <th scope="col">Name</th>
                          <th scope="col">Description</th>
                          <th scope="col">Purchase Date</th>
                          <th scope="col">Model</th>
                          <th scope="col">Attachment</th>
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
                              Mark Jubarg
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
                                View Assets
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
                          <div className="col-md-4"> 
                            <div className="mb-3">
                                  <Label className="form-label" htmlFor="formrow-code-input">Asset Code</Label>
                                  <Input type="text" className="form-control" value="1234" id="formrow-code-input" readOnly />
                            </div>
                          </div>
                          <div className="col-md-4">       
                            <div className="mb-3">
                                <Label htmlFor="example-date-input" className="form-Label">Date Purchased</Label>
                                <Input className="form-control" type="date" defaultValue="2019-08-19" id="example-date-input" readOnly/>
                            </div>
                          </div>   
                          <div className="col-md-4">       
                            <div className="mb-3">
                                <Label htmlFor="example-date-input" className="form-Label">Warranty Expiry</Label>
                                <Input className="form-control" type="date" defaultValue="2019-08-19" id="example-date-input" readOnly/>
                            </div>
                          </div>         
                          <div className="col-md-4">
                            <div className="mb-3">
                                <Label className="form-Label">Facility</Label>
                                <Input type="text" className="form-control" value="Facility 1" id="formrow-code-input" readOnly />
                            </div>    
                          </div>
                          <div className="col-md-4">
                            <div className="mb-3">
                                <Label className="form-Label">Vendor</Label>
                                <Input type="text" className="form-control" value="Appliance" id="formrow-code-input" readOnly />
                            </div>    
                          </div>
                          <div className="col-md-4">
                            <div className="mb-3">
                                <Label className="form-Label">Assset Class</Label>
                                <Input type="text" className="form-control" value="Assset Class 1" id="formrow-code-input" readOnly />
                            </div>    
                          </div>
                          <div className="col-md-4">
                            <div className="mb-3">
                                <Label className="form-Label">Status</Label>
                                <Input type="text" className="form-control" value="Active" id="formrow-code-input" readOnly />
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
                                placeholder=""
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
                                                                    <Label className="form-label" htmlFor="formrow-make-input">Make</Label>
                                                                    <Input type="text" className="form-control" value="Make One" id="formrow-make-input" readOnly />
                                                                </div>
                                                            </div>
                                                            <div className="col-md-6">
                                                                <div className="mb-3">
                                                                    <Label className="form-label" htmlFor="formrow-model-input">Model</Label>
                                                                    <Input type="text" className="form-control" value="123ABC45" id="formrow-model-input" readOnly />
                                                                </div>
                                                            </div>
                                                            <div className="col-md-6">
                                                                <div className="mb-3">
                                                                    <Label className="form-label" htmlFor="formrow-serial-input">Serial</Label>
                                                                    <Input type="text" className="form-control" value="123" id="formrow-serial-input" readOnly/>
                                                                </div>
                                                            </div>
                                                            <div className="col-md-6">
                                                                <div className="mb-3">
                                                                    <Label className="form-label" htmlFor="formrow-loc-input">Location</Label>
                                                                    <Input type="text" className="form-control" value="Canada" id="formrow-loc-input" readOnly/>
                                                                </div>
                                                            </div>
                                                            <div className="col-md-6">
                                                                <div className="mb-3">
                                                                    <Label className="form-label" htmlFor="formrow-floor-input">Floor</Label>
                                                                    <Input type="text" className="form-control" value="10" id="formrow-floor-input" readOnly />
                                                                </div>
                                                            </div>
                                                            <div className="col-md-6">
                                                                <div className="mb-3">
                                                                    <Label className="form-label" htmlFor="formrow-room-input">Room</Label>
                                                                    <Input type="text" className="form-control" value="13A" id="formrow-room-input" readOnly />
                                                                </div>
                                                            </div>
                                                            <div className="col-md-6">
                                                                <div className="mb-3">
                                                                    <Label className="form-label" htmlFor="formrow-unit-input">Unit Cost</Label>
                                                                    <Input type="text" className="form-control" value="100" id="formrow-unit-input" readOnly />
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
                                                <div className="mb-3">
                                                    <textarea
                                                      id="basicpill-address-input"
                                                      className="form-control"
                                                      rows="3"
                                                      readOnly
                                                      placeholder="Lorem Ipsum is simply dummy text of the printing and typesetting industry.
                                                      Lorem Ipsum has been the industry's standard dummy text ever since the 1500s, when an 
                                                      unknown printer took a galley of type and scrambled it to make a type specimen book."
                                                  ></textarea>
                                                </div>
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
                          </td>
                          <td>1</td>
                          <td>Danish Sharma</td>
                          <td>It is a long established fact.</td>
                          <td>13-12-2022</td>
                          <td>V-22</td>
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
                          <td>2</td>
                          <td> <a href="#!"
                                onClick={() => {
                                    tog_large2()
                                }}
                                data-toggle="modal"
                                data-target=".bs-example-modal-lg"
                                >
                              Mark Jubarg
                            </a>  </td>
                          <td>1</td>
                          <td>Danish Sharma</td>
                          <td>It is a long established fact.</td>
                          <td>13-12-2022</td>
                          <td>V-22</td>
                          <td>
                            <div>
                              <button
                                type="button"
                                className="btn btn-soft-light btn-sm w-xs waves-effect btn-label waves-light"
                              >
                                <i className="bx bx-download label-icon"></i> Pdf
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
                          <td> <a href="#!"
                                onClick={() => {
                                    tog_large2()
                                }}
                                data-toggle="modal"
                                data-target=".bs-example-modal-lg"
                                >
                              Mark Jubarg
                            </a>  </td>
                          <td>1</td>
                          <td>Danish Sharma</td>
                          <td>It is a long established fact.</td>
                          <td>13-12-2022</td>
                          <td>V-22</td>
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
                          <td> <a href="#!"
                                onClick={() => {
                                    tog_large2()
                                }}
                                data-toggle="modal"
                                data-target=".bs-example-modal-lg"
                                >
                              Mark Jubarg
                            </a>  </td>
                          <td>1</td>
                          <td>Danish Sharma</td>
                          <td>It is a long established fact.</td>
                          <td>13-12-2022</td>
                          <td>V-22</td>
                          <td>
                            <div>
                              <button
                                type="button"
                                className="btn btn-soft-light btn-sm w-xs waves-effect btn-label waves-light"
                              >
                                <i className="bx bx-download label-icon"></i> Pdf
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
                          <td> <a href="#!"
                                onClick={() => {
                                    tog_large2()
                                }}
                                data-toggle="modal"
                                data-target=".bs-example-modal-lg"
                                >
                              Mark Jubarg
                            </a>  </td>
                          <td>1</td>
                          <td>Danish Sharma</td>
                          <td>It is a long established fact.</td>
                          <td>13-12-2022</td>
                          <td>V-22</td>
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
                          <td>6</td>
                          <td> <a href="#!"
                                onClick={() => {
                                    tog_large2()
                                }}
                                data-toggle="modal"
                                data-target=".bs-example-modal-lg"
                                >
                              Mark Jubarg
                            </a>  </td>
                          <td>1</td>
                          <td>Danish Sharma</td>
                          <td>It is a long established fact.</td>
                          <td>13-12-2022</td>
                          <td>V-22</td>
                          <td>
                            <div>
                              <button
                                type="button"
                                className="btn btn-soft-light btn-sm w-xs waves-effect btn-label waves-light"
                              >
                                <i className="bx bx-download label-icon"></i> Pdf
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
export default Assets
