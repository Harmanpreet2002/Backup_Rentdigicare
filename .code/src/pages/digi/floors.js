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
import Dropzone from "react-dropzone"

//Import Breadcrumb
import Breadcrumbs from "../../components/Common/Breadcrumb"

const Floors = () => {

    const [modal_large, setmodal_large] = useState(false);
    const [btnsuccess1, setBtnsuccess1] = useState(false);

    function removeBodyCss() {
        document.body.classList.add("no_padding")
    }

    function tog_large() {
        setmodal_large(!modal_large)
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
          <title>Rentdigicare | Floors </title>
        </MetaTags>
        <div className="container-fluid">
          <Breadcrumbs title="Home" breadcrumbItem="Floors"/>
          <Row>
            <Col xl={12}>
              <Card>
        
              {<CardHeader>
                <div className="row align-items-center">
                  <div className="col-md-6">
                     <div className="mb">
                        <h5 className="card-title">Floors<span className="text-muted fw-normal ms-2">(6)</span></h5>
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
                        <i className="bx bx-plus me-1"></i>Add Floors
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
                                Add Floors
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
                                <Label className="form-Label">Building Name</Label>
                                <select className="form-select">
                                    <option>Select</option>
                                    <option>Building 1</option>
                                    <option>Building 2</option>
                                    <option>Building 3</option>
                                    <option>Building 4</option>
                                    <option>Building 5</option>
                                    <option>Building 6</option>
                                </select>
                            </div>    
                         </div>
                         <div className="col-md-6">
                            <div className="mb-3">
                                  <Label className="form-label" htmlFor="formrow-room-input">Floors</Label>
                                  <Input type="text" className="form-control" id="formrow-room-input" />
                            </div>
                          </div>
                          <div className="col-md-6">
                            <div className="mb-3">
                                  <Label className="form-label" htmlFor="formrow-room-input">Rooms</Label>
                                  <Input type="text" className="form-control" id="formrow-room-input" />
                            </div>
                          </div>
                          <div className="col-md-6">
                            <div className="mb-3">
                                  <Label className="form-label" htmlFor="formrow-name-input">Contact Name</Label>
                                  <Input type="text" className="form-control" id="formrow-name-input" />
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
                                  <Label className="form-label" htmlFor="formrow-name-input">Contact Phone</Label>
                                  <Input type="text" className="form-control" id="formrow-phone-input" />
                            </div>
                          </div>    
                          <div className="col-md-6">
                            <div className="mb-3">
                                  <Label className="form-label" htmlFor="formrow-facility-input">Status</Label>
                                  <select className="form-select">
                                    <option>Select</option>
                                    <option>Active</option>
                                    <option>In Active</option>
                                </select>
                            </div>
                          </div>
                          <div className="col-md-6">
                            <div className="mb-3">
                               <Label className="form-Label"></Label>    
                                <div className="form-check">
                                      <input className="form-check-input" type="checkbox" id="formCheck22" defaultChecked/>
                                      <label className="form-check-label" htmlFor="formCheck22">
                                         Web Enable
                                      </label>
                                  </div>
                            </div>    
                          </div>
                          <div className="col-md-12">
                            <div className="mb-3">
                              <Label className="form-label" htmlFor="formrow-firstname-input">Documents</Label>
                              <Dropzone
                                onDrop={acceptedFiles => {
                                  handleAcceptedFiles(acceptedFiles)
                                }}
                              >
                                {({ getRootProps, getInputProps }) => (
                                  <div className="dropzone">
                                    <div
                                      className="dz-message needsclick mt-2"
                                      {...getRootProps()}
                                    >
                                      <input {...getInputProps()} />
                                      <div className="mb-3">
                                        <i className="display-4 text-muted bx bxs-cloud-upload" />
                                      </div>
                                      <h4>Drop files here or click to upload.</h4>
                                    </div>
                                  </div>
                                )}
                              </Dropzone>
                              <div className="dropzone-previews mt-3" id="file-previews">
                                {selectedFiles.map((f, i) => {
                                  return (
                                    <Card
                                      className="mt-1 mb-0 shadow-none border dz-processing dz-image-preview dz-success dz-complete"
                                      key={i + "-file"}
                                    >
                                      <div className="p-2">
                                        <Row className="align-items-center">
                                          <Col className="col-auto">
                                            <img
                                              data-dz-thumbnail=""
                                              height="80"
                                              className="avatar-sm rounded bg-light"
                                              alt={f.name}
                                              src={f.preview}
                                            />
                                          </Col>
                                          <Col>
                                            <Link
                                              to="#"
                                              className="text-muted font-weight-bold"
                                            >
                                              {f.name}
                                            </Link>
                                            <p className="mb-0">
                                              <strong>{f.formattedSize}</strong>
                                            </p>
                                          </Col>
                                        </Row>
                                      </div>
                                    </Card>
                                  )
                                })}
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
                          <th scope="col">Building Name</th>
                          <th scope="col">Floors</th>
                          <th scope="col">Rooms</th>
                          <th scope="col">Contact Name</th>
                          <th scope="col">Contact Email</th>
                          <th scope="col">Contact Phone</th>
                          <th scope="col">Created</th>
                          <th scope="col">Attachment</th>
                          <th scope="col">Status</th>
                          <th scope="col">Action</th>
                        </tr>
                      </thead>
                      <tbody>
                        <tr>
                          <td>1</td>
                          <td>Building One</td>
                          <td>10</td>
                          <td>200</td>
                          <td>Danish Sharma</td>
                          <td>danishsharma88@gmail.com</td>
                          <td>8556055809</td>
                          <td>18/01/2022</td>
                          <td>
                            <div>
                              <button
                                type="button"
                                className="btn btn-soft-light btn-sm w-xs waves-effect btn-label waves-light"
                              >
                                <i className="bx bx-download label-icon"></i> PDF
                              </button>
                            </div>
                          </td>
                          <td>Closed</td>
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
                          <td>Building One</td>
                          <td>10</td>
                          <td>200</td>
                          <td>Danish Sharma</td>
                          <td>danishsharma88@gmail.com</td>
                          <td>8556055809</td>
                          <td>18/01/2022</td>
                          <td>
                            <div>
                              <button
                                type="button"
                                className="btn btn-soft-light btn-sm w-xs waves-effect btn-label waves-light"
                              >
                                <i className="bx bx-download label-icon"></i> PDF
                              </button>
                            </div>
                          </td>
                          <td>Closed</td>
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
                          <td>Building One</td>
                          <td>10</td>
                          <td>200</td>
                          <td>Danish Sharma</td>
                          <td>danishsharma88@gmail.com</td>
                          <td>8556055809</td>
                          <td>18/01/2022</td>
                          <td>
                            <div>
                              <button
                                type="button"
                                className="btn btn-soft-light btn-sm w-xs waves-effect btn-label waves-light"
                              >
                                <i className="bx bx-download label-icon"></i> PDF
                              </button>
                            </div>
                          </td>
                          <td>Closed</td>
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
                          <td>Building One</td>
                          <td>10</td>
                          <td>200</td>
                          <td>Danish Sharma</td>
                          <td>danishsharma88@gmail.com</td>
                          <td>8556055809</td>
                          <td>18/01/2022</td>
                          <td>
                            <div>
                              <button
                                type="button"
                                className="btn btn-soft-light btn-sm w-xs waves-effect btn-label waves-light"
                              >
                                <i className="bx bx-download label-icon"></i> PDF
                              </button>
                            </div>
                          </td>
                          <td>Closed</td>
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
                          <td>Building One</td>
                          <td>10</td>
                          <td>200</td>
                          <td>Danish Sharma</td>
                          <td>danishsharma88@gmail.com</td>
                          <td>8556055809</td>
                          <td>18/01/2022</td>
                          <td>
                            <div>
                              <button
                                type="button"
                                className="btn btn-soft-light btn-sm w-xs waves-effect btn-label waves-light"
                              >
                                <i className="bx bx-download label-icon"></i> PDF
                              </button>
                            </div>
                          </td>
                          <td>Closed</td>
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

export default Floors
