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
  Input,
  Progress,
  Pagination,
  PaginationItem,
  Collapse,
  PaginationLink
} from "reactstrap"
import Dropzone from "react-dropzone"
//Lightbox
import Lightbox from "react-image-lightbox"
import "react-image-lightbox/style.css"
import "react-modal-video/scss/modal-video.scss"

// import image
import img1 from "../../assets/images/small/img-1.jpg"
import img2 from "../../assets/images/small/img-2.jpg"
import img4 from "../../assets/images/small/img-4.jpg"
import img5 from "../../assets/images/small/img-5.jpg"

//Import Breadcrumb
import Breadcrumbs from "../../components/Common/Breadcrumb"

const SpaceCenter = () => {
    const images = [img4, img5, img1]
    const [photoIndex, setphotoIndex] = useState(0)
    const [isFits, setisFits] = useState(false)
    const [isEffects, setisEffects] = useState(false)
    const [isGallery, setisGallery] = useState(false)
    
    const [col5, setcol5] = useState(false) 
    const t_col5 = () => {
        setcol5(!col5)
    }
    const [customActiveTab, setcustomActiveTab] = useState("1")

    const [modal_large, setmodal_large] = useState(false);
  
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
      /**Formats the size**/
      function formatBytes(bytes, decimals = 2) {
        if (bytes === 0) return "0 Bytes"
        const k = 1024
        const dm = decimals < 0 ? 0 : decimals
        const sizes = ["Bytes", "KB", "MB", "GB", "TB", "PB", "EB", "ZB", "YB"]
    
        const i = Math.floor(Math.log(bytes) / Math.log(k))
        return parseFloat((bytes / Math.pow(k, i)).toFixed(dm)) + " " + sizes[i]
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
          <title>Rentdigicare | Space Center</title>
        </MetaTags>
        <div className="container-fluid">
          <Breadcrumbs title="Home" breadcrumbItem="Space Center" />
          {isFits ? (
            <Lightbox
                mainSrc={images[photoIndex]}
                enableZoom={false}
                imageCaption={
                    "Caption. Can be aligned it to any side and contain any HTML."
                }
                onCloseRequest={() => {
                    setisFits(!isFits)
                }}
            />
        ) : null}

        {isEffects ? (
            <Lightbox
                mainSrc={images[1]}
                enableZoom={false}
                onCloseRequest={() => {
                    setisEffects(!isEffects)
                }}
            />
        ) : null}

        {isGallery ? (
            <Lightbox
                mainSrc={images[photoIndex]}
                nextSrc={images[(photoIndex + 1) % images.length]}
                prevSrc={images[(photoIndex + images.length - 1) % images.length]}
                enableZoom={true}
                onCloseRequest={() => {
                    setisGallery(false)
                }}
                onMovePrevRequest={() => {
                    setphotoIndex((photoIndex + images.length - 1) % images.length)
                }}
                onMoveNextRequest={() => {
                    setphotoIndex((photoIndex + 1) % images.length)
                }}
                imageCaption={"Project " + parseFloat(photoIndex + 1)}
            />
        ) : null}

          <Row>
            <Col xl={12}>
              <Card>
              <CardHeader>
                <div className="row align-items-center">
                  <div className="col-md-6">
                     <div className="mb">
                        <h5 className="card-title">Space Center <span className="text-muted fw-normal ms-2">(6)</span></h5>
                      </div>
                  </div>
                  <div className="col-md-6 d-flex flex-wrap align-items-center justify-content-end">
                    <div className="mb">
                    <button
                        onClick={t_col5}
                        className="btn btn-primary mo-mb-2 mr-10"
                        type="button"
                        style={{ cursor: "pointer" }}
                    >
                        Filters
                    </button>  
                   
                    <button
                        type="button"
                        onClick={() => {
                            tog_large()
                        }}
                        className="btn btn-light "
                        data-toggle="modal"
                        data-target=".bs-example-modal-lg"
                    >
                        <i className="bx bx-plus me-1"></i> Add Space Center
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
                                Add Space Center
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
                                <Label className="form-Label">Category</Label>
                                <select className="form-select">
                                    <option>Select One</option>
                                    <option>Category 1</option>
                                    <option>Category 2</option>
                                    <option>Category 3</option>
                                    <option>Category 4</option>
                                </select>
                            </div>    
                          </div>
                          <div className="col-md-6"> 
                            <div className="mb-3">
                                  <Label className="form-label" htmlFor="formrow-name-input">Name</Label>
                                  <Input type="text" className="form-control" id="formrow-name-input" />
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
                                    <div className="col-md-4">
                                      <div className="mb-3">
                                          <Label className="form-Label">Category</Label>
                                          <select className="form-select">
                                              <option>Select One</option>
                                              <option>Category 1</option>
                                              <option>Category 2</option>
                                              <option>Category 3</option>
                                              <option>Category 4</option>
                                          </select>
                                      </div>    
                                    </div>
                                    <div className="col-md-4">
                                      <div className="mb-3">
                                          <Label className="form-Label">Status</Label>
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
                          <th scope="col">Category</th>
                          <th scope="col">Description</th>
                          <th scope="col">File</th>
                          <th scope="col">Size</th>
                          <th scope="col">Ver.</th>
                          <th scope="col">Date Modified</th>
                          <th scope="col">Status</th>
                          <th scope="col">Action</th>
                        </tr>
                      </thead>
                      <tbody>
                        <tr>
                          <td>1</td>
                          <td>Rentdigi/GSK</td>
                          <td>Task</td>
                          <td>
                              <div>
                                <img
                                    className="rounded me-2"
                                    src={img4}
                                    width="100"
                                    onClick={() => {
                                        setisGallery(true)
                                        setphotoIndex(0)
                                    }}
                                    className="img-fluid"
                                    alt=""
                                />
                            </div>
                          </td>
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
                          <td>200.13 KB</td>
                          <td>1</td>
                          <td>24/01/2022 22:00</td>
                          <td>Current</td>
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
                          <td>Rentdigi/GSK</td>
                          <td>Task</td>
                          <td>
                            <div>
                                <img
                                    className="rounded me-2"
                                    src={img5}
                                    width="100"
                                    onClick={() => {
                                        setisGallery(true)
                                        setphotoIndex(1)
                                    }}
                                    className="img-fluid"
                                    alt=""
                                />
                            </div>
                          </td>
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
                          <td>200.13 KB</td>
                          <td>1</td>
                          <td>24/01/2022 22:00</td>
                          <td>Current</td>
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
                          <td>Rentdigi/GSK</td>
                          <td>Task</td>
                          <td>
                            <div>
                                <img
                                    className="rounded me-2"
                                    width="100"
                                    src={img1}
                                    onClick={() => {
                                        setisGallery(true)
                                        setphotoIndex(2)
                                    }}
                                    className="img-fluid"
                                    alt=""
                                />
                            </div>
                          </td>
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
                          <td>200.13 KB</td>
                          <td>1</td>
                          <td>24/01/2022 22:00</td>
                          <td>Current</td>
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
                          <td>Rentdigi/GSK</td>
                          <td>Task</td>
                          <td>
                            <div>
                                <img
                                    className="rounded me-2"
                                    width="100"
                                    src={img2}
                                    onClick={() => {
                                        setisGallery(true)
                                        setphotoIndex(2)
                                    }}
                                    className="img-fluid"
                                    alt=""
                                />
                            </div>
                          </td>
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
                          <td>200.13 KB</td>
                          <td>1</td>
                          <td>24/01/2022 22:00</td>
                          <td>Current</td>
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
                          <td>Rentdigi/GSK</td>
                          <td>Task</td>
                          <td>
                            <div>
                                <img
                                    className="rounded me-2"
                                    width="100"
                                    src={img1}
                                    onClick={() => {
                                        setisGallery(true)
                                        setphotoIndex(2)
                                    }}
                                    className="img-fluid"
                                    alt=""
                                />
                            </div>
                          </td>
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
                          <td>200.13 KB</td>
                          <td>1</td>
                          <td>24/01/2022 22:00</td>
                          <td>Current</td>
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
                          <td>Rentdigi/GSK</td>
                          <td>Task</td>
                          <td>
                              <div>
                                <img className="rounded me-2"
                                    width="100"
                                    src={img1}
                                    onClick={() => {
                                        setisGallery(true)
                                        setphotoIndex(0)
                                    }}
                                    className="img-fluid"
                                    alt=""
                                />
                            </div>
                          </td>
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
                          <td>200.13 KB</td>
                          <td>1</td>
                          <td>24/01/2022 22:00</td>
                          <td>Current</td>
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
                        <div className="mb-4 progrss-lft">
                            <Progress striped color="success" value={40} animated></Progress>
                            <h5 className="card-title disk"><span className="green">103.2 MB </span> of 2.0 GB</h5>             
                        </div>  
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
export default SpaceCenter
