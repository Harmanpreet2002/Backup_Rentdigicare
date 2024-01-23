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
  Form,
  Label,
  DropdownItem,
  DropdownMenu,
  DropdownToggle,
  Dropdown,
  Input
} from "reactstrap"
//Import Breadcrumb
import Breadcrumbs from "../../components/Common/Breadcrumb"

const TaskTypes = () => {
  
  const optionMulti = [
    { label: "Choice 1", value: "choice-1" },
    { label: "Choice 2", value: "choice-2" },
    { label: "Choice 3", value: "choice-3" }
  ]
    const [modal_large, setmodal_large] = useState(false);
    const [btnsuccess1, setBtnsuccess1] = useState(false);
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

  return (
    <React.Fragment>
      <div className="page-content">
        <MetaTags>
          <title>Rentdigicare | Task Types</title>
        </MetaTags>
        <div className="container-fluid">
          <Breadcrumbs title="Home" breadcrumbItem="Task Types" />
          <Row>
            <Col xl={12}>
              <Card>
        
              {<CardHeader>
                <div className="row align-items-center">
                  <div className="col-md-4">
                     <div className="mb">
                        <h5 className="card-title">Task Types<span className="text-muted fw-normal ms-2">(6)</span></h5>
                      </div>
                  </div>
                  <div className="col-md-4">
                    <div class="row">
                      <div class="col-sm-2">
                        <div class="faclt-hd">
                          <Label className="form-label fcl-mr">Company</Label>
                        </div>
                      </div>
                      <div class="col-sm-10">
                          <select className="form-select">
                            <option>Select</option>
                            <option>Company 1</option>
                            <option>Company 2</option>
                            <option>Company 3</option>
                            <option>Company 4</option>
                            <option>Company 5</option>
                          </select>
                      </div>
                    </div>
                  </div>
                  <div className="col-md-4 d-flex flex-wrap align-items-center justify-content-end">
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
                        <i className="bx bx-plus me-1"></i>Add Task Types
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
                                Add Task Types
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
                                  <Label className="form-label" htmlFor="formrow-code-input">Type Code</Label>
                                  <Input type="text" className="form-control" id="formrow-code-input" />
                            </div>
                          </div>
                          <div className="col-md-6"> 
                            <div className="mb-3">
                                  <Label className="form-label" htmlFor="formrow-name-input">Display Name</Label>
                                  <Input type="text" className="form-control" id="formrow-name-input" />
                            </div>
                          </div>
                          <div className="col-md-6">
                            <div className="mb-3">
                                  <Label className="form-label" htmlFor="formrow-facility-input">Company</Label>
                                  <select className="form-select">
                                    <option>Select</option>
                                    <option>Company 1</option>
                                    <option>Company 2</option>
                                    <option>Company 3</option>
                                    <option>Company 4</option>
                                    <option>Company 5</option>
                                </select>
                            </div>
                          </div>
                          <div className="col-md-6"> 
                            <div className="mb-3">
                                  <Label className="form-label" htmlFor="formrow-sequence-input">Sequence</Label>
                                  <Input type="text" className="form-control" id="formrow-sequence-input" />
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
                                  <Label className="form-label" htmlFor="formrow-email-input">Contact Email</Label>
                                  <Input type="text" className="form-control" id="formrow-email-input" />
                            </div>
                          </div>
                          <div className="col-md-6">
                            <div className="mb-3">
                                <Label className="form-Label">Provider</Label>
                                <select className="form-select">
                                    <option>Select</option>
                                    <option>One</option>
                                    <option>Two</option>
                                    <option>Three</option>
                                    <option>Fourth</option>
                                </select>
                            </div>    
                          </div>
                          <div className="col-md-6"> 
                            <div className="mb-3">
                                  <Label className="form-label" htmlFor="formrow-cell-input">Cell #</Label>
                                  <Input type="text" className="form-control" id="formrow-cell-input" />
                            </div>
                          </div>       
                          <div className="col-md-6">
                            <div className="mb-3">
                            <label htmlFor="choices-chk-default" className="form-label font-size-13 text-muted"></label>
                                <div className="form-check">
                                      <input className="form-check-input" type="checkbox" id="formCheck1" defaultChecked/>
                                      <label className="form-check-label" htmlFor="formCheck1">
                                          Web Enable
                                      </label>
                                  </div>
                            </div>    
                          </div>
                          <div className="col-md-6">
                            <div className="mb-3">
                                 <label htmlFor="choices-chk-default" className="form-label font-size-13 text-muted"></label>
                                  <div className="form-check">
                                      <input className="form-check-input" type="checkbox" id="formCheck2" defaultChecked/>
                                      <label className="form-check-label" htmlFor="formCheck2">
                                            Cell Notification
                                      </label>
                                  </div>
                            </div>
                          </div>
                          <div className="col-md-12">
                            <div className="mb-3">
                              <label htmlFor="choices-multiple-default" className="form-label font-size-13 text-muted">Assign Manager</label>
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
                </CardHeader>}
                <CardBody>
                  <div className="table-responsive">
                    <Table className="table-striped table-bordered mb-0">
                      <thead>
                        <tr>
                          <th scope="col">#</th>
                          <th scope="col">Location</th>
                          <th scope="col">Task Code</th>
                          <th scope="col">Name</th>
                          <th scope="col">Description</th>
                          <th scope="col">Seq. Number</th>
                          <th scope="col">Active</th>
                          <th scope="col">Action</th>
                        </tr>
                      </thead>
                      <tbody>
                        <tr>
                          <td >1</td>
                          <td>
                          <a href="#!"
                                onClick={() => {
                                    tog_large2()
                                }}
                                data-toggle="modal"
                                data-target=".bs-example-modal-lg"
                                >
                              Rentdigi/GSK
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
                                      View Task Types
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
                                              <Label className="form-label" htmlFor="formrow-code-input">Type Code</Label>
                                              <Input type="text" className="form-control" value="1245" id="formrow-code-input" readOnly/>
                                        </div>
                                      </div>
                                      <div className="col-md-6"> 
                                        <div className="mb-3">
                                              <Label className="form-label" htmlFor="formrow-name-input">Display Name</Label>
                                              <Input type="text" className="form-control" value="Rentdigi/GSK" id="formrow-name-input" readOnly/>
                                        </div>
                                      </div>
                                      <div className="col-md-6">
                                        <div className="mb-3">
                                              <Label className="form-label" htmlFor="formrow-facility-input">Company</Label>
                                              <Input type="text" className="form-control" value="Company 1" id="formrow-name-input" readOnly/>
                                        </div>
                                      </div>
                                      <div className="col-md-6"> 
                                        <div className="mb-3">
                                              <Label className="form-label" htmlFor="formrow-sequence-input">Sequence</Label>
                                              <Input type="text" className="form-control" value="1234" id="formrow-sequence-input" readOnly/>
                                        </div>
                                      </div>
                                      <div className="col-md-6">
                                        <div className="mb-3">
                                            <Label className="form-Label">Active</Label>
                                            <Input type="text" className="form-control" value="Yes" id="formrow-sequence-input" readOnly/>
                                        </div>    
                                      </div>
                                      <div className="col-md-6">
                                        <div className="mb-3">
                                              <Label className="form-label" htmlFor="formrow-email-input">Contact Email</Label>
                                              <Input type="text" className="form-control" value="abc@gmail.com" id="formrow-email-input" readOnly/>
                                        </div>
                                      </div>
                                      <div className="col-md-6">
                                        <div className="mb-3">
                                            <Label className="form-Label">Provider</Label>
                                            <Input type="text" className="form-control" value="11" id="formrow-email-input" readOnly/>
                                        </div>    
                                      </div>
                                      <div className="col-md-6"> 
                                        <div className="mb-3">
                                              <Label className="form-label" htmlFor="formrow-cell-input">Cell #</Label>
                                              <Input type="text" className="form-control" value="11" id="formrow-cell-input" readOnly/>
                                        </div>
                                      </div>       
                                      <div className="col-md-6">
                                        <div className="mb-3">
                                            <Label className="form-Label">Web Enable</Label>
                                            <Input type="text" className="form-control" value="Yes" id="formrow-cell-input" readOnly/>
                                        </div>    
                                      </div>
                                      <div className="col-md-6">
                                        <div className="mb-3">
                                            <Label className="form-Label">Cell Notification</Label>
                                            <Input type="text" className="form-control" value="Yes" id="formrow-cell-input" readOnly/>
                                        </div> 
                                      </div>
                                      <div className="col-md-12">
                                        <div className="mb-3">
                                          <label htmlFor="choices-multiple-default" className="form-label font-size-13 text-muted">Assign Manager</label>
                                          <Input type="text" className="form-control" value="Manager 1" id="formrow-cell-input" readOnly/>
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
                                            placeholder="It is a long established fact that a reader will be distracted by the readable
                                             content of a page when looking at its layout. "
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
                                              <Input type="text" className="form-control" value="11" id="formrow-cell-input" readOnly/>
                                            </div>
                                            <div className="mb-3">
                                                <Label className="form-label" htmlFor="formrow-email-input">Escalation Email</Label>
                                                <Input type="text" className="form-control" value="abc@gmail.com" id="formrow-cell-input" readOnly/>
                                          </div>
                                          </CardBody>    
                                        </Card>                       
                                      </div>
                                    </div> 
                                    </Form>      
                                </div>
                            </Modal>
                          </td>
                          <td>AC</td>
                          <td>Air Condition</td>
                          <td>Air Condition</td>
                          <td>10</td>
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
                          <td>
                           <a href="#!"
                                onClick={() => {
                                    tog_large2()
                                }}
                                data-toggle="modal"
                                data-target=".bs-example-modal-lg"
                                >
                              Rentdigi/GSK
                            </a>  
                          </td>
                          <td>APPL</td>
                          <td>Appliance</td>
                          <td>Appliance</td>
                          <td>20</td>
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
                          <td>
                           <a href="#!"
                                onClick={() => {
                                    tog_large2()
                                }}
                                data-toggle="modal"
                                data-target=".bs-example-modal-lg"
                                >
                              Rentdigi/GSK
                            </a>  
                          </td>
                          <td>Clean</td>
                          <td>Clean Up / Spill</td>
                          <td>Clean Up / Spill</td>
                          <td>30</td>
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
                              Rentdigi/GSK
                            </a>  
                          </td>
                          <td>ELEC</td>
                          <td>Electrical Issue</td>
                          <td>Electrical Issue</td>
                          <td>40</td>
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
                          <td>
                           <a href="#!"
                                onClick={() => {
                                    tog_large2()
                                }}
                                data-toggle="modal"
                                data-target=".bs-example-modal-lg"
                                >
                              Rentdigi/GSK
                            </a>  
                          </td>
                          <td>ELEV</td>
                          <td>Elevator</td>
                          <td>Elevator</td>
                          <td>50</td>
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
                          <td>
                           <a href="#!"
                                onClick={() => {
                                    tog_large2()
                                }}
                                data-toggle="modal"
                                data-target=".bs-example-modal-lg"
                                >
                              DLF Park Estate
                            </a>  
                          </td>
                          <td>GEN</td>
                          <td>General Maintenance</td>
                          <td>General Maintenance</td>
                          <td>60</td>
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
                </CardBody>
              </Card>
            </Col>
          </Row>
        </div>
      </div>
    </React.Fragment>
  )
}

export default TaskTypes
