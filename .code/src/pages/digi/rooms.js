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
  Pagination,
  PaginationItem,
  Collapse,
  PaginationLink,
  DropdownItem,
  DropdownMenu,
  DropdownToggle,
  Dropdown,
  Input
} from "reactstrap"
import Dropzone from "react-dropzone"
// Form Editor
import { Editor } from "react-draft-wysiwyg"
import "react-draft-wysiwyg/dist/react-draft-wysiwyg.css"

//Import Breadcrumb
import Breadcrumbs from "../../components/Common/Breadcrumb"

const Room = () => {

    const [modal_large, setmodal_large] = useState(false);
    const [btnsuccess1, setBtnsuccess1] = useState(false);
    const [modal_large2, setmodal_large2] = useState(false); 

    const [col5, setcol5] = useState(false) 
    const t_col5 = () => {
        setcol5(!col5)
    }

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
          <title>Rentdigicare | Rooms</title>
        </MetaTags>
        <div className="container-fluid">
          <Breadcrumbs title="Home" breadcrumbItem="Rooms" />
          <Row>
            <Col xl={12}>
              <Card>
              <CardHeader>
                <div className="row align-items-center">
                  <div className="col-md-6">
                     <div className="mb">
                        <h5 className="card-title">Rooms<span className="text-muted fw-normal ms-2">(6)</span></h5>
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
                        <i className="bx bx-plus me-1"></i>Add Rooms
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
                                Add Rooms
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
                                  <Label className="form-label" htmlFor="formrow-room-input">Room#</Label>
                                  <Input type="text" className="form-control" id="formrow-room-input" />
                            </div>
                          </div>
                          <div className="col-md-4">
                            <div className="mb-3">
                                  <Label className="form-label" htmlFor="formrow-room-input">Room Label</Label>
                                  <Input type="text" className="form-control" id="formrow-room-input" />
                            </div>
                          </div>
                          <div className="col-md-4">
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
                          <div className="col-md-4">
                            <div className="mb-3">
                                <Label className="form-Label">Floor</Label>
                                <select className="form-select">
                                    <option>Select</option>
                                    <option>Floor 1</option>
                                    <option>Floor 2</option>
                                    <option>Floor 3</option>
                                    <option>Floor 4</option>
                                    <option>Floor 5</option>
                                    <option>Floor 6</option>
                                </select>
                            </div>    
                          </div>
                          <div className="col-md-4">
                            <div className="mb-3">
                                  <Label className="form-label" htmlFor="formrow-name-input">Contact Name</Label>
                                  <Input type="text" className="form-control" id="formrow-name-input" />
                            </div>
                          </div>  
                          <div className="col-md-4">
                            <div className="mb-3">
                                  <Label className="form-label" htmlFor="formrow-email-input">Contact Email</Label>
                                  <Input type="text" className="form-control" id="formrow-email-input" />
                            </div>
                          </div>  
                          <div className="col-md-4">
                            <div className="mb-3">
                                  <Label className="form-label" htmlFor="formrow-name-input">Contact Phone</Label>
                                  <Input type="text" className="form-control" id="formrow-phone-input" />
                            </div>
                          </div>    
                          <div className="col-md-4">
                            <div className="mb-3">
                                  <Label className="form-label" htmlFor="formrow-facility-input">Status</Label>
                                  <select className="form-select">
                                    <option>Select</option>
                                    <option>Active</option>
                                    <option>In Active</option>
                                </select>
                            </div>
                          </div>
                          <div className="col-md-4">
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
                                <Label className="form-Label">Notes</Label>
                                <Editor
                                    toolbarClassName="toolbarClassName"
                                    wrapperClassName="wrapperClassName"
                                    editorClassName="editorClassName"
                                />
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
                                          <Col className="trash-btn">
                                             <button type="button" className="btn btn-soft-danger waves-effect waves-light">
                                             <i className="bx bx-trash-alt"></i></button>
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
                                            <Label className="form-Label">Company</Label>
                                            <select className="form-select">
                                                <option>Select One</option>
                                                <option>Company 1</option>
                                                <option>Company 2</option>
                                                <option>Company 3</option>
                                                <option>Company 4</option>
                                            </select>
                                        </div>    
                                      </div>
                                      <div className="col-md-4"> 
                                        <div className="mb-3">
                                              <Label className="form-label" htmlFor="formrow-area-input">Area</Label>
                                              <Input type="text" className="form-control" id="formrow-area-input" />
                                        </div>
                                      </div>
                                      <div className="col-md-4"> 
                                        <div className="mb-3">
                                              <Label className="form-label" htmlFor="formrow-room-input">Room</Label>
                                              <Input type="text" className="form-control" id="formrow-room-input" />
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
                          <th scope="col">Company</th>
                          <th scope="col">Area</th>
                          <th scope="col">Room</th>
                          <th scope="col">Contact</th>
                          <th scope="col">Created</th>
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
                              PLUMB
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
                                      View Rooms
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
                                          <Label className="form-label" htmlFor="formrow-facility-input">Room</Label>
                                          <Input type="text" className="form-control" value="12" id="formrow-phone-input" readOnly/>
                                    </div>
                                  </div>
                                  <div className="col-md-6">
                                    <div className="mb-3">
                                          <Label className="form-label" htmlFor="formrow-email-input">Room Label</Label>
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
                                          <Label className="form-label" htmlFor="formrow-phone-input">Floor</Label>
                                          <Input type="text" className="form-control" value="32" id="formrow-phone-input" readOnly />
                                    </div>
                                  </div>
                                  <div className="col-md-6">
                                    <div className="mb-3">
                                          <Label className="form-label" htmlFor="formrow-name-input">Contact Name</Label>
                                          <Input type="text" className="form-control" value="Danish Sharma" id="formrow-name-input" readOnly/>
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
                                          <Label className="form-label" htmlFor="formrow-phone-input">Contact Phone</Label>
                                          <Input type="text" className="form-control" value="8556055809" id="formrow-phone-input" readOnly/>
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
                                  <div className="col-md-6">
                                      <div className="mb-3">
                                         <Label className="form-label" htmlFor="formrow-phone-input">Documents</Label>
                                         <div>
                                            <button
                                                type="button"
                                                className="btn btn-soft-light btn-sm w-xs waves-effect btn-label waves-light"
                                              >
                                                <i className="bx bx-download label-icon"></i> Pdf
                                              </button>
                                         </div>
                                        </div>
                                    </div> 
                                  <div className="col-md-12">
                                      <div className="mb-3">
                                         <Label className="form-label" htmlFor="formrow-phone-input">Notes</Label>
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
                          <td>1071</td>
                          <td>213</td>
                          <td>The water</td>
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
                          <td> 
                            <a href="#!"
                                onClick={() => {
                                    tog_large2()
                                }}
                                data-toggle="modal"
                                data-target=".bs-example-modal-lg"
                                >
                              PLUMB
                            </a> 
                          </td>
                          <td>1071</td>
                          <td>213</td>
                          <td>The water</td>
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
                          <td>
                          <a href="#!"
                                onClick={() => {
                                    tog_large2()
                                }}
                                data-toggle="modal"
                                data-target=".bs-example-modal-lg"
                                >
                              PLUMB
                            </a>      
                          </td>
                          <td>1071</td>
                          <td>213</td>
                          <td>The water</td>
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
                          <td>
                          <a href="#!"
                                onClick={() => {
                                    tog_large2()
                                }}
                                data-toggle="modal"
                                data-target=".bs-example-modal-lg"
                                >
                              PLUMB
                            </a>
                          </td>
                          <td>1071</td>
                          <td>213</td>
                          <td>The water</td>
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
                          <td>
                            <a href="#!"
                                  onClick={() => {
                                      tog_large2()
                                  }}
                                  data-toggle="modal"
                                  data-target=".bs-example-modal-lg"
                                  >
                                PLUMB
                              </a>
                          </td>
                          <td>1071</td>
                          <td>213</td>
                          <td>The water</td>
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

export default Room
