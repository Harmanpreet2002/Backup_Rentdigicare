import React, { useState } from "react";
import MetaTags from 'react-meta-tags';
import { Link } from "react-router-dom"
import {
  Table,
  Row,
  Col,
  Card,
  CardBody,
  CardTitle,
  Modal,
  CardHeader,
  Label,
  Input
} from "reactstrap"

//Import Breadcrumb
import Breadcrumbs from "../../components/Common/Breadcrumb"

const BuildingArea = () => {
   const [modal_standard, setmodal_standard] = useState(false);
    const [modal_large, setmodal_large] = useState(false);

    function tog_standard() {
        setmodal_standard(!modal_standard)
        removeBodyCss()
    }

    function removeBodyCss() {
        document.body.classList.add("no_padding")
    }

    function tog_large() {
        setmodal_large(!modal_large)
         removeBodyCss()
     }



  
  return (
    <React.Fragment>
      <div className="page-content">
        <MetaTags>
          <title>Building Area |  Rentdigi Care</title>
        </MetaTags>
        <div className="container-fluid">
          <Breadcrumbs title="Home" breadcrumbItem="Building Area" />
          <Row>
            <Col xl={12}>
              <Card>
        
              {<CardHeader>
                <div className="row align-items-center">
                  <div className="col-md-6">
                     <div className="mb">
                        <h5 className="card-title">Building Area <span className="text-muted fw-normal ms-2">(34)</span></h5>
                      </div>
                  </div>
                  <div className="col-md-6 d-flex flex-wrap align-items-center justify-content-end">
                    <div className="mb">
                    <button
                        type="button"
                        onClick={() => {
                            tog_large()
                        }}
                        className="btn btn-light "
                        data-toggle="modal"
                        data-target=".bs-example-modal-lg"
                    >
                        <i className="bx bx-plus me-1"></i> Add Area
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
                                Add Facilities
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
                        <div className="row align-items-center">
                          <div className="col-md-6"> 
                            <div className="mb-3">
                                  <Label className="form-label" htmlFor="formrow-name-input">Name</Label>
                                  <Input type="text" className="form-control" id="formrow-name-input" />
                            </div>
                          </div>
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
                                  <Label className="form-label" htmlFor="formrow-state-input">State</Label>
                                  <Input type="text" className="form-control" id="formrow-state-input" />
                            </div>
                          </div>
                          <div className="col-md-6">
                            <div className="mb-3">
                                  <Label className="form-label" htmlFor="formrow-zip-input">Zip</Label>
                                  <Input type="text" className="form-control" id="formrow-zip-input" />
                            </div>
                          </div>
                          <div className="col-md-6">
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
                          <th scope="col">Name</th>
                          <th scope="col">Address1</th>
                          <th scope="col">Address2</th>
                          <th scope="col">City</th>
                          <th scope="col">State</th>
                          <th scope="col">Zip</th>
                          <th scope="col">Created</th>
                          <th scope="col">Modified</th>
                          <th scope="col">Status</th>
                          <th scope="col">Action</th>
                        </tr>
                      </thead>
                      <tbody>
                        <tr>
                          <td >1</td>
                          <td>Mark Jubarg</td>
                          <td>1073 Chappelle Blvd</td>
                          <td>1073 Chappelle Blvd</td>
                          <td>Melbourne</td>
                          <td>Australia</td>
                          <td>143416</td>
                          <td>13-12-2022</td>
                          <td>14-12-2022</td>
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
                          <td>Mark Jubarg</td>
                          <td>1073 Chappelle Blvd</td>
                          <td>1073 Chappelle Blvd</td>
                          <td>Melbourne</td>
                          <td>Australia</td>
                          <td>143416</td>
                          <td>13-12-2022</td>
                          <td>14-12-2022</td>
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
                          <td>Mark Jubarg</td>
                          <td>1073 Chappelle Blvd</td>
                          <td>1073 Chappelle Blvd</td>
                          <td>Melbourne</td>
                          <td>Australia</td>
                          <td>143416</td>
                          <td>13-12-2022</td>
                          <td>14-12-2022</td>
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
                          <td>Mark Jubarg</td>
                          <td>1073 Chappelle Blvd</td>
                          <td>1073 Chappelle Blvd</td>
                          <td>Melbourne</td>
                          <td>Australia</td>
                          <td>143416</td>
                          <td>13-12-2022</td>
                          <td>14-12-2022</td>
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
                          <td>Mark Jubarg</td>
                          <td>1073 Chappelle Blvd</td>
                          <td>1073 Chappelle Blvd</td>
                          <td>Melbourne</td>
                          <td>Australia</td>
                          <td>143416</td>
                          <td>13-12-2022</td>
                          <td>14-12-2022</td>
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
                          <td>Mark Jubarg</td>
                          <td>1073 Chappelle Blvd</td>
                          <td>1073 Chappelle Blvd</td>
                          <td>Melbourne</td>
                          <td>Australia</td>
                          <td>143416</td>
                          <td>13-12-2022</td>
                          <td>14-12-2022</td>
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
                          <td>7</td>
                          <td>Mark Jubarg</td>
                          <td>1073 Chappelle Blvd</td>
                          <td>1073 Chappelle Blvd</td>
                          <td>Melbourne</td>
                          <td>Australia</td>
                          <td>143416</td>
                          <td>13-12-2022</td>
                          <td>14-12-2022</td>
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
                          <td>8</td>
                          <td>Mark Jubarg</td>
                          <td>1073 Chappelle Blvd</td>
                          <td>1073 Chappelle Blvd</td>
                          <td>Melbourne</td>
                          <td>Australia</td>
                          <td>143416</td>
                          <td>13-12-2022</td>
                          <td>14-12-2022</td>
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
                          <td>9</td>
                          <td>Mark Jubarg</td>
                          <td>1073 Chappelle Blvd</td>
                          <td>1073 Chappelle Blvd</td>
                          <td>Melbourne</td>
                          <td>Australia</td>
                          <td>143416</td>
                          <td>13-12-2022</td>
                          <td>14-12-2022</td>
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
                          <td>10</td>
                          <td>Mark Jubarg</td>
                          <td>1073 Chappelle Blvd</td>
                          <td>1073 Chappelle Blvd</td>
                          <td>Melbourne</td>
                          <td>Australia</td>
                          <td>143416</td>
                          <td>13-12-2022</td>
                          <td>14-12-2022</td>
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

                </CardBody>
              </Card>
            </Col>
          </Row>

      
         

         
        </div>
      </div>
    </React.Fragment>
  )
}

export default BuildingArea
