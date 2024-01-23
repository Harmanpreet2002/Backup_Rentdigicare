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
  Input,
  Pagination,
  PaginationItem,
  PaginationLink,
  DropdownItem,
  DropdownMenu,
  DropdownToggle,
  Dropdown,
  Form

} from "reactstrap"

//Import Breadcrumb
import Breadcrumbs from "../../components/Common/Breadcrumb"

// Form Editor
import "react-draft-wysiwyg/dist/react-draft-wysiwyg.css"

const AssetClass = () => {
     const [modal_center, setmodal_center] = useState(false);
     const [btnsuccess1, setBtnsuccess1] = useState(false);
     function removeBodyCss() {
         document.body.classList.add("no_padding")
     }
 
     function tog_center() {
         setmodal_center(!modal_center)
         removeBodyCss()
     }       
 
     const role = window.localStorage.getItem("role");
     if(role === "admin"){
        return (
          <React.Fragment>
            <div className="page-content">
              <MetaTags>
                <title>Rentdigicare | Asset Class</title>
              </MetaTags>
              <div className="container-fluid">
                <Breadcrumbs title="Home" breadcrumbItem="Asset Class" />
                <Row>
                  <Col xl={12}>
                    <Card>
                    <CardHeader>
                      <div className="row align-items-center">
                        <div className="col-md-6">
                          <div className="mb">
                              <h5 className="card-title">Asset Class <span className="text-muted fw-normal ms-2">(6)</span></h5>
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
                              <i className="bx bx-plus me-1"></i> Add Assets
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
                                      id="myLargeModalLabel"
                                  >
                                      Add Assets
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
                                              <Label className="form-label" htmlFor="formrow-seq-input">Sequence#</Label>
                                              <Input type="text" className="form-control" id="formrow-seq-input" />
                                          </div>
                                      </div>   
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
                                              <Label className="form-Label">Active</Label>
                                              <select className="form-select">
                                                  <option>Select</option>
                                                  <option>Yes</option>
                                                  <option>No</option>
                                              </select>
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
                      </CardHeader>
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
                                <td>123456</td>
                                <td>Danish Sharma</td>
                                <td>V-22</td>
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
                                <td>123456</td>
                                <td>Danish Sharma</td>
                                <td>V-22</td>
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
                                <td>123456</td>
                                <td>Danish Sharma</td>
                                <td>V-22</td>
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
                                <td>123456</td>
                                <td>Danish Sharma</td>
                                <td>V-22</td>
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
                                <td>123456</td>
                                <td>Danish Sharma</td>
                                <td>V-22</td>
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
                                <td>123456</td>
                                <td>Danish Sharma</td>
                                <td>V-22</td>
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
                                <td>7</td>
                                <td>123456</td>
                                <td>Danish Sharma</td>
                                <td>V-22</td>
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
export default AssetClass
