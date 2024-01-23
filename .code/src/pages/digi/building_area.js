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
  DropdownItem,
  DropdownMenu,
  DropdownToggle,
  Dropdown,
  Form,
  Input
} from "reactstrap"

//Import Breadcrumb
import Breadcrumbs from "../../components/Common/Breadcrumb"

const BuildingArea = () => {
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
          <title>Rentdigicare | Building Area </title>
        </MetaTags>
        <div className="container-fluid">
          <Breadcrumbs title="Home" breadcrumbItem="Building Area" />
          <Row>
            <Col xl={12}>
              <Card>
              <CardHeader>
                <div className="row align-items-center">
                  <div className="col-md-4">
                     <div className="mb">
                        <h5 className="card-title">Building Area <span className="text-muted fw-normal ms-2">(6)</span></h5>
                      </div>
                  </div>
                  <div className="col-md-4">
                    <div class="row">
                      <div class="col-sm-2">
                        <div class="faclt-hd">
                          <Label className="form-label fcl-mr">Company
                          </Label>
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
                                Add Building Area
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
                        <form>
                        <div className="row align-items-center">
                          <div className="col-md-6"> 
                            <div className="mb-3">
                                  <Label className="form-label" htmlFor="formrow-code-input">Area Code</Label>
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
                                <Label className="form-Label">Company</Label>
                                <select className="form-select">
                                    <option>Select One</option>
                                    <option>Company 1</option>
                                    <option>Company 2</option>
                                </select>
                            </div>    
                          </div>
                          <div className="col-md-6"> 
                            <div className="mb-3">
                                  <Label className="form-label" htmlFor="formrow-seq-input">Sequence </Label>
                                  <Input type="text" className="form-control" id="formrow-seq-input" />
                            </div>
                          </div>
                          <div className="col-md-6"> 
                            <div className="mb-3">
                                  <Label className="form-label" htmlFor="formrow-floor-input">Floors </Label>
                                  <Input type="text" className="form-control" id="formrow-floor-input" />
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
                                <Label className="form-Label">Active</Label>
                                <select className="form-select">
                                    <option>Select One</option>
                                    <option>Yes</option>
                                    <option>No</option>
                                </select>
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
                          <div className="col-md-12">
                            <div className="mb-3">
                              <label htmlFor="choices-multiple-default" className="form-label font-size-13 text-muted">Auto Manager</label>
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
                          </form>      
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
                          <th scope="col">Company</th>
                          <th scope="col">Area Code</th>
                          <th scope="col">Display Name</th>
                          <th scope="col">Description</th>
                          <th scope="col">Seq. Number</th>
                          <th scope="col">Floors</th>
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
                              Rentdigi
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
                                      View Building Area
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
                                          <Label className="form-label" htmlFor="formrow-facility-input">Area Code</Label>
                                          <Input type="text" className="form-control" value="123456" id="formrow-phone-input" readOnly/>
                                    </div>
                                  </div>
                                  <div className="col-md-6">
                                    <div className="mb-3">
                                          <Label className="form-label" htmlFor="formrow-email-input">Display Name</Label>
                                          <Input type="text" className="form-control" value="Rentdigi" id="formrow-email-input" readOnly/>
                                    </div>
                                  </div>
                                  <div className="col-md-6">
                                    <div className="mb-3">
                                          <Label className="form-label" htmlFor="formrow-phone-input">Company</Label>
                                          <Input type="text" className="form-control" value="Company 1" id="formrow-phone-input" readOnly />
                                    </div>
                                  </div>
                                  <div className="col-md-6">
                                    <div className="mb-3">
                                          <Label className="form-label" htmlFor="formrow-phone-input">Sequence</Label>
                                          <Input type="text" className="form-control" value="345" id="formrow-phone-input" readOnly />
                                    </div>
                                  </div>
                                  <div className="col-md-6">
                                    <div className="mb-3">
                                          <Label className="form-label" htmlFor="formrow-phone-input">Floor</Label>
                                          <Input type="text" className="form-control" value="23" id="formrow-phone-input" readOnly/>
                                    </div>
                                  </div>
                                  <div className="col-md-6">
                                    <div className="mb-3">
                                          <Label className="form-label" htmlFor="formrow-phone-input">Contact Email</Label>
                                          <Input type="text" className="form-control" value="abc@gmail.com" id="formrow-phone-input" readOnly/>
                                    </div>
                                  </div>  
                                  <div className="col-md-6">
                                    <div className="mb-3">
                                          <Label className="form-label" htmlFor="formrow-phone-input">Manger</Label>
                                          <Input type="text" className="form-control" value="Danish Sharma" id="formrow-phone-input" readOnly/>
                                    </div>
                                  </div> 
                                  <div className="col-md-6">
                                    <div className="mb-3">
                                          <Label className="form-label" htmlFor="formrow-phone-input">Status</Label>
                                          <Input type="text" className="form-control" value="Yes" id="formrow-phone-input" readOnly/>
                                    </div>
                                  </div>    
                                  <div className="col-md-6">
                                    <div className="mb-3">
                                          <Label className="form-label" htmlFor="formrow-phone-input">Web Enable</Label>
                                          <Input type="text" className="form-control" value="Yes" id="formrow-phone-input" readOnly/>
                                    </div>
                                  </div>   
                                  <div className="col-md-12">
                                      <div className="mb-3">
                                         <Label className="form-label" htmlFor="formrow-phone-input">Description</Label>
                                         <textarea
                                          id="basicpill-address-input"
                                          className="form-control"
                                          rows="3"
                                          placeholder="It is a long established fact that a reader will be distracted by the readable
                                          content of a page when looking at its layout"
                                            readOnly
                                        ></textarea>
                                        </div>
                                    </div>
                                </div> 
                                </Form>
                                </div>
                            </Modal>
                          </td>
                          <td>107813</td>
                          <td>Australia</td>
                          <td>It is a long established fact that a reader will be distracted</td>
                          <td>13-12-2022</td>
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
                          <td >2</td>
                          <td>
                          <a href="#!"
                                onClick={() => {
                                    tog_large2()
                                }}
                                data-toggle="modal"
                                data-target=".bs-example-modal-lg"
                                >
                              GSK
                            </a>  
                          </td>
                          <td>1073363</td>
                          <td>Australia</td>
                          <td>It is a long established fact that a reader will be distracted</td>
                          <td>13-12-2022</td>
                          <td>20</td>
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
                          <td >3</td>
                          <td>
                          <a href="#!"
                                onClick={() => {
                                    tog_large2()
                                }}
                                data-toggle="modal"
                                data-target=".bs-example-modal-lg"
                                >
                              Chappelle Garden Villas
                            </a>  
                          </td>      

                          <td>1073545</td>
                          <td>Australia</td>
                          <td>It is a long established fact that a reader will be distracted</td>
                          <td>13-12-2022</td>
                          <td>32</td>
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
                          <td >4</td>
                          <td>
                          <a href="#!"
                                onClick={() => {
                                    tog_large2()
                                }}
                                data-toggle="modal"
                                data-target=".bs-example-modal-lg"
                                >
                              Oak Tower
                            </a>  
                          </td> 
                          <td>3345073</td>
                          <td>Australia</td>
                          <td>It is a long established fact that a reader will be distracted</td>
                          <td>13-12-2022</td>
                          <td>25</td>
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
                          <td>
                          <a href="#!"
                                onClick={() => {
                                    tog_large2()
                                }}
                                data-toggle="modal"
                                data-target=".bs-example-modal-lg"
                                >
                              Chappelle Garden
                            </a>  
                          </td> 
                          <td>965073</td>
                          <td>Australia</td>
                          <td>It is a long established fact that a reader will be distracted</td>
                          <td>13-12-2022</td>
                          <td>15</td>
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
                          <td >6</td>
                          <td>
                          <a href="#!"
                                onClick={() => {
                                    tog_large2()
                                }}
                                data-toggle="modal"
                                data-target=".bs-example-modal-lg"
                                >
                              Riverside Villas
                            </a>  
                          </td> 
                          <td>556073</td>
                          <td>Australia</td>
                          <td>It is a long established fact that a reader will be distracted</td>
                          <td>13-12-2022</td>
                          <td>20</td>
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

export default BuildingArea
