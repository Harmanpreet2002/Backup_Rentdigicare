import React, { useState } from "react";
import MetaTags from 'react-meta-tags';
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
  DropdownItem,
  DropdownMenu,
  DropdownToggle,
  Dropdown,
  Input
} from "reactstrap"
//Import Breadcrumb
import Breadcrumbs from "../../components/Common/Breadcrumb"

const TaskClass = () => {
    const [modal_center, setmodal_center] = useState(false);
    const [btnsuccess1, setBtnsuccess1] = useState(false);
    function removeBodyCss() {
        document.body.classList.add("no_padding")
    }

    function tog_center() {
        setmodal_center(!modal_center)
        removeBodyCss()
    }       

  return (
    <React.Fragment>
      <div className="page-content">
        <MetaTags>
          <title>Rentdigicare | Task Class</title>
        </MetaTags>
        <div className="container-fluid">
          <Breadcrumbs title="Home" breadcrumbItem="Task Class" />
          <Row>
            <Col xl={12}>
              <Card>
        
              {<CardHeader>
                <div className="row align-items-center">
                  <div className="col-md-6">
                     <div className="mb">
                        <h5 className="card-title">Task Class<span className="text-muted fw-normal ms-2">(6)</span></h5>
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
                            tog_center()
                        }}
                        className="btn btn-light "
                        data-toggle="modal"
                        data-target=".bs-example-modal-center"
                    >
                        <i className="bx bx-plus me-1"></i>Add Task Class
                    </button>
                    <Modal
                        isOpen={modal_center}
                        toggle={() => {
                            tog_center()
                        }}
                    >
                        <div className="modal-header">
                            <h5
                                className="modal-title mt-0"
                            >
                                Add Task Class
                            </h5>
                            <button
                                onClick={() => {
                                    tog_center(false)
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
                                  <Label className="form-label" htmlFor="formrow-code-input">Class Code</Label>
                                  <Input type="text" className="form-control" id="formrow-code-input" />
                            </div>
                          </div>
                          <div className="col-md-6"> 
                            <div className="mb-3">
                                  <Label className="form-label" htmlFor="formrow-name-input">Name</Label>
                                  <Input type="text" className="form-control" id="formrow-name-input" />
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
                            <label htmlFor="choices-multiple-default" className="form-label font-size-13 text-muted"></label>
                                <div className="form-check">
                                      <input className="form-check-input" type="checkbox" id="formCheck3" defaultChecked/>
                                      <label className="form-check-label" htmlFor="formCheck3">
                                          Web Enable
                                      </label>
                                </div>
                            </div>    
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
                          <th scope="col">Class Code</th>
                          <th scope="col">Name</th>
                          <th scope="col">Seq. Number</th>
                          <th scope="col">Active</th>
                          <th scope="col">Action</th>
                        </tr>
                      </thead>
                      <tbody>
                        <tr>
                          <td>1</td>
                          <td>CALL1</td>
                          <td>Call Before Entering</td>
                          <td>21020</td>
                          <td>Yes</td>
                          <td>
                            <div className="d-flex gap-3">
                              <Link className="text-success" to="#">
                                <i
                                  className="mdi mdi-pencil font-size-18"
                                  id="edittooltip"
                                  onClick={() => {
                                      tog_center()
                                  }}
                                  data-toggle="modal"
                                  data-target=".bs-example-modal-center"
                                ></i>
                              </Link>
                              <Link className="text-danger" to="#">
                                <i
                                  className="mdi mdi-delete font-size-18"
                                  id="deletetooltip"
                                  onClick={() => {
                                    setmodal_center(false)
                                }}
                                ></i>
                              </Link>
                            </div>
                          </td>    
                        </tr>
                        <tr>
                          <td>2</td>
                          <td>2CALL</td>
                          <td>Call Before Entering</td>
                          <td>31020</td>
                          <td>Yes</td>
                          <td>
                            <div className="d-flex gap-3">
                              <Link className="text-success" to="#">
                                <i
                                  className="mdi mdi-pencil font-size-18"
                                  id="edittooltip"
                                  onClick={() => {
                                    tog_center()
                                  }}
                                  data-toggle="modal"
                                  data-target=".bs-example-modal-center"
                                ></i>
                              </Link>
                              <Link className="text-danger" to="#">
                                <i
                                  className="mdi mdi-delete font-size-18"
                                  id="deletetooltip"
                                  onClick={() => {
                                    setmodal_center(false)
                                }}
                                ></i>
                              </Link>
                            </div>
                          </td>    
                        </tr>
                        <tr>
                          <td>3</td>
                          <td>3CALL</td>
                          <td>Call Before Entering</td>
                          <td>41020</td>
                          <td>Yes</td>
                          <td>
                            <div className="d-flex gap-3">
                              <Link className="text-success" to="#">
                                <i
                                  className="mdi mdi-pencil font-size-18"
                                  id="edittooltip"
                                  onClick={() => {
                                    tog_center()
                                  }}
                                  data-toggle="modal"
                                  data-target=".bs-example-modal-center"
                                ></i>
                              </Link>
                              <Link className="text-danger" to="#">
                                <i
                                  className="mdi mdi-delete font-size-18"
                                  id="deletetooltip"
                                  onClick={() => {
                                    setmodal_center(false)
                                }}
                                ></i>
                              </Link>
                            </div>
                          </td>    
                        </tr>
                        <tr>
                          <td>4</td>
                          <td>4CALL</td>
                          <td>Call Before Entering</td>
                          <td>61020</td>
                          <td>Yes</td>
                          <td>
                            <div className="d-flex gap-3">
                              <Link className="text-success" to="#">
                                <i
                                  className="mdi mdi-pencil font-size-18"
                                  id="edittooltip"
                                  onClick={() => {
                                    tog_center()
                                  }}
                                  data-toggle="modal"
                                  data-target=".bs-example-modal-center"
                                ></i>
                              </Link>
                              <Link className="text-danger" to="#">
                                <i
                                  className="mdi mdi-delete font-size-18"
                                  id="deletetooltip"
                                  onClick={() => {
                                    setmodal_center(false)
                                }}
                                ></i>
                              </Link>
                            </div>
                          </td>    
                        </tr>
                        <tr>
                          <td>5</td>
                          <td>5CALL</td>
                          <td>Call Before Entering</td>
                          <td>71020</td>
                          <td>Yes</td>
                          <td>
                            <div className="d-flex gap-3">
                              <Link className="text-success" to="#">
                                <i
                                  className="mdi mdi-pencil font-size-18"
                                  id="edittooltip"
                                  onClick={() => {
                                    tog_center()
                                  }}
                                  data-toggle="modal"
                                  data-target=".bs-example-modal-center"
                                ></i>
                              </Link>
                              <Link className="text-danger" to="#">
                                <i
                                  className="mdi mdi-delete font-size-18"
                                  id="deletetooltip"
                                  onClick={() => {
                                    setmodal_center(false)
                                }}
                                ></i>
                              </Link>
                            </div>
                          </td>    
                        </tr>
                        <tr>
                          <td>6</td>
                          <td>6CALL</td>
                          <td>Call Before Entering</td>
                          <td>91020</td>
                          <td>Yes</td>
                          <td>
                            <div className="d-flex gap-3">
                              <Link className="text-success" to="#">
                                <i
                                  className="mdi mdi-pencil font-size-18"
                                  id="edittooltip"
                                  onClick={() => {
                                    tog_center()
                                  }}
                                  data-toggle="modal"
                                  data-target=".bs-example-modal-center"
                                ></i>
                              </Link>
                              <Link className="text-danger" to="#">
                                <i
                                  className="mdi mdi-delete font-size-18"
                                  id="deletetooltip"
                                  onClick={() => {
                                    setmodal_center(false)
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

export default TaskClass
