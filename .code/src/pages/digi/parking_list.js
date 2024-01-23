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
  Collapse,
  Label,
  Form,
  Input
} from "reactstrap"
import logoSvg from "../../assets/images/logo-sm.svg";
import Dropzone from "react-dropzone"
//Import Breadcrumb
import Breadcrumbs from "../../components/Common/Breadcrumb"

const ParkingList = () => {
  const optionMulti = [
    { label: "Manager", value: "Manager" },
    { label: "Manager 1", value: "Manager 1" },
    { label: "Manager 2", value: "Manager 2" }
  ]
    const [modal_large, setmodal_large] = useState(false);
    const [modal_large1, setmodal_large1] = useState(false);

    function removeBodyCss() {
        document.body.classList.add("no_padding")
    }

    function tog_large() {
        setmodal_large(!modal_large)
         removeBodyCss()
     }

     const [col5, setcol5] = useState(false) 
     const t_col5 = () => {
         setcol5(!col5)
     }
     function tog_large1() {
      setmodal_large1(!modal_large1)
       removeBodyCss()
   }


     const [selectedFiles, setselectedFiles] = useState([])
      function handleAcceptedFiles(files) {
        files.map(file =>
          Object.assign(file, {
            preview: URL.createObjectURL(file),
            formattedSize: formatBytes(file.size),
          })
        )
        setselectedFiles(files)
      }
    
      /**
        * Formats the size
        */
      function formatBytes(bytes, decimals = 2) {
        if (bytes === 0) return "0 Bytes"
        const k = 1024
        const dm = decimals < 0 ? 0 : decimals
        const sizes = ["Bytes", "KB", "MB", "GB", "TB", "PB", "EB", "ZB", "YB"]
    
        const i = Math.floor(Math.log(bytes) / Math.log(k))
        return parseFloat((bytes / Math.pow(k, i)).toFixed(dm)) + " " + sizes[i]
      }
  return (
    <React.Fragment>
      <div className="page-content">
        <MetaTags>
          <title>Rentdigicare | Visitor Parking List</title>
        </MetaTags>
        <div className="container-fluid">
          <Breadcrumbs title="Home" breadcrumbItem="Visitor Parking"/>
          <Row>
            <Col xl={12}>
              <Card>
        
              {<CardHeader>
                <div className="row align-items-center">
                  <div className="col-md-6">
                     <div className="mb">
                        <h5 className="card-title">Visitor Parking<span className="text-muted fw-normal ms-2">(6)</span></h5>
                      </div>
                  </div>
                  
                  <div className="col-md-6 d-flex flex-wrap align-items-center justify-content-end">
                    <div className="mb">
                    {/* <button
                        onClick={t_col5}
                        className="btn btn-primary mo-mb-2 mr-10"
                        type="button"
                        style={{ cursor: "pointer" }}
                    >
                        Filters
                    </button>   */}
                    <button
                        type="button"
                        onClick={() => {
                            tog_large()
                        }}
                        className="btn btn-light "
                        data-toggle="modal"
                        data-target=".bs-example-modal-lg"
                    >
                        <i className="bx bx-plus me-1"></i> Add Visitor
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
                                Add Visitor
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
                                    <Label className="form-label" htmlFor="formrow-facility-input">Select The Building</Label>
                                    <select className="form-select">
                                        <option>Select</option>
                                        <option>Chappelle Gardens Apartment</option>
                                        <option>Chappelle Gardens Villas</option>
                                        <option>Oak Tower</option>
                                        <option>Oxford Campus</option>
                                        <option>Prescott Place</option>
                                    </select>
                                </div>
                            </div>
                            <div className="col-md-6">
                                <div className="mb-3">
                                    <Label className="form-label" htmlFor="formrow-suite-input">Visiting Suite Number</Label>
                                    <Input type="text" className="form-control" id="formrow-suite-input" />
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
                                    <Label className="form-label" htmlFor="formrow-number-input">Phone Number</Label>
                                    <Input type="text" className="form-control" id="formrow-number-input" />
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
                                    <Label className="form-label" htmlFor="formrow-stall-input">Visitor Parking Stall Number</Label>
                                    <Input type="text" className="form-control" id="formrow-stall-input" />
                                </div>
                            </div>
                            <div className="col-md-6">
                                <div className="mb-3">
                                    <Label htmlFor="example-date-input" className="form-Label">Date</Label>
                                    <Input className="form-control" type="date" defaultValue="2019-08-19" id="example-date-input" />
                                </div>
                            </div> 
                            <div className="col-md-6">
                                <div className="mb-3">
                                    <Label htmlFor="example-time-input" className="form-Label">From</Label>
                                    <Input className="form-control" type="time" defaultValue="13:45:00" id="example-time-input" />
                                </div> 
                            </div>
                            <div className="col-md-6">
                                <div className="mb-3">
                                    <Label htmlFor="example-time-input" className="form-Label">To</Label>
                                    <Input className="form-control" type="time" defaultValue="13:45:00" id="example-time-input" />
                                </div> 
                            </div>
                            <div className="col-md-6">
                                <div className="mb-3">
                                    <Label className="form-label" htmlFor="formrow-make-input">Car Make</Label>
                                    <Input type="text" className="form-control" id="formrow-make-input" />
                                </div>
                            </div>
                            <div className="col-md-6">
                                <div className="mb-3">
                                    <Label className="form-label" htmlFor="formrow-model-input">Car Model</Label>
                                    <Input type="text" className="form-control" id="formrow-model-input" />
                                </div>
                            </div>
                            <div className="col-md-6">
                                <div className="mb-3">
                                    <Label className="form-label" htmlFor="formrow-plate-input">Plate Number</Label>
                                    <Input type="text" className="form-control" id="formrow-plate-input" />
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
                          <th scope="col">Building</th>
                          <th scope="col">Suite Number</th>
                          <th scope="col">Name</th>
                          <th scope="col">Phone Number</th>
                          <th scope="col">Email</th>
                          <th scope="col">Stall Number</th>
                          <th scope="col">Date</th>
                          <th scope="col">From</th>
                          <th scope="col">To</th>
                          <th scope="col">Car Make</th>
                          <th scope="col">Car Model</th>
                          <th scope="col">Plate Number</th>
                          <th scope="col">Action</th>
                        </tr>
                      </thead>
                      <tbody>
                        <tr>
                          <td>1</td>
                          <td>Building Name</td>
                          <td>123456</td>
                          <td>Danish Sharma</td>
                          <td>8556055809</td>
                          <td>abc@gmail.com</td>
                          <td>120</td>
                          <td>2019-08-19</td>
                          <td>01:20 AM</td>
                          <td>09:20 PM</td>
                          <td>Toyoto</td>
                          <td>Innova</td> 
                          <td>Pb 38 4455</td>
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
                          <td>Building Name</td>
                          <td>123456</td>
                          <td>Danish Sharma</td>
                          <td>8556055809</td>
                          <td>abc@gmail.com</td>
                          <td>120</td>
                          <td>2019-08-19</td>
                          <td>01:20 AM</td>
                          <td>09:20 PM</td>
                          <td>Toyoto</td>
                          <td>Innova</td> 
                          <td>Pb 38 4455</td>
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
                          <td>Building Name</td>
                          <td>123456</td>
                          <td>Danish Sharma</td>
                          <td>8556055809</td>
                          <td>abc@gmail.com</td>
                          <td>120</td>
                          <td>2019-08-19</td>
                          <td>01:20 AM</td>
                          <td>09:20 PM</td>
                          <td>Toyoto</td>
                          <td>Innova</td> 
                          <td>Pb 38 4455</td>
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
                          <td>Building Name</td>
                          <td>123456</td>
                          <td>Danish Sharma</td>
                          <td>8556055809</td>
                          <td>abc@gmail.com</td>
                          <td>120</td>
                          <td>2019-08-19</td>
                          <td>01:20 AM</td>
                          <td>09:20 PM</td>
                          <td>Toyoto</td>
                          <td>Innova</td> 
                          <td>Pb 38 4455</td>
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
                          <td>Building Name</td>
                          <td>123456</td>
                          <td>Danish Sharma</td>
                          <td>8556055809</td>
                          <td>abc@gmail.com</td>
                          <td>120</td>
                          <td>2019-08-19</td>
                          <td>01:20 AM</td>
                          <td>09:20 PM</td>
                          <td>Toyoto</td>
                          <td>Innova</td> 
                          <td>Pb 38 4455</td>
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
                          <td>Building Name</td>
                          <td>123456</td>
                          <td>Danish Sharma</td>
                          <td>8556055809</td>
                          <td>abc@gmail.com</td>
                          <td>120</td>
                          <td>2019-08-19</td>
                          <td>01:20 AM</td>
                          <td>09:20 PM</td>
                          <td>Toyoto</td>
                          <td>Innova</td> 
                          <td>Pb 38 4455</td>
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
                          <td>Building Name</td>
                          <td>123456</td>
                          <td>Danish Sharma</td>
                          <td>8556055809</td>
                          <td>abc@gmail.com</td>
                          <td>120</td>
                          <td>2019-08-19</td>
                          <td>01:20 AM</td>
                          <td>09:20 PM</td>
                          <td>Toyoto</td>
                          <td>Innova</td> 
                          <td>Pb 38 4455</td>
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

export default ParkingList
