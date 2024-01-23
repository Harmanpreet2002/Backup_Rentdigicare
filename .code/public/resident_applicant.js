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
  Input
} from "reactstrap"
//Lightbox
import Lightbox from "react-image-lightbox"
import "react-image-lightbox/style.css"
import "react-modal-video/scss/modal-video.scss"

// import image
import img1 from "../../assets/images/small/img-1.jpg"
import img2 from "../../assets/images/small/img-2.jpg"
import img4 from "../../assets/images/small/img-4.jpg"
import img5 from "../../assets/images/small/img-5.jpg"

// Form Mask
import InputMask from "react-input-mask"

//Import Breadcrumb
import Breadcrumbs from "../../components/Common/Breadcrumb"

const ResidentApplicant = () => {
  const images = [img4, img5, img1]
  const [photoIndex, setphotoIndex] = useState(0)
  const [isFits, setisFits] = useState(false)
  const [isEffects, setisEffects] = useState(false)
  const [isGallery, setisGallery] = useState(false)
    const DUR = props => (
        <InputMask
          mask="99.99"
          value={props.value}
          className="form-control input-color"
          onChange={props.onChange}
        >
        </InputMask>
    )  

  const optionMulti = [
    { label: "Danish Sharma", value: "Danish Sharma" },
    { label: "Jameson", value: "Jameson" },
    { label: "Digi", value: "Digi" }
  ]

  const [col5, setcol5] = useState(false) 
  const t_col5 = () => {
      setcol5(!col5)
  }
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
  
  return (
    <React.Fragment>
      <div className="page-content">
        <MetaTags>
          <title> Rentdigicare | Resident Applicant</title>
        </MetaTags>
        <div className="container-fluid">
          <Breadcrumbs title="Home" breadcrumbItem="Resident Applicant" />
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
                        <h5 className="card-title">Resident Application<span className="text-muted fw-normal ms-2">(6)</span></h5>
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
                                            <Label className="form-Label">Property Type</Label>
                                            <select className="form-select">
                                                <option>Select One</option>
                                                <option>Type 1</option>
                                                <option>Type 2</option>
                                                <option>Type 3</option>
                                                <option>Type 4</option>
                                            </select>
                                        </div>    
                                      </div>
                                      <div className="col-md-3"> 
                                        <div className="mb-3">
                                              <Label className="form-label" htmlFor="formrow-task-input">ApplicantName</Label>
                                              <Input type="text" className="form-control" id="formrow-task-input" />
                                        </div>
                                      </div>
                                      <div className="col-md-3"> 
                                        <div className="mb-3">
                                              <Label className="form-label" htmlFor="formrow-task-input">Email</Label>
                                              <Input type="text" className="form-control" id="formrow-task-input" />
                                        </div>
                                      </div>
                                      <div className="col-md-3"> 
                                        <div className="mb-3">
                                              <Label className="form-label" htmlFor="formrow-task-input">Phone</Label>
                                              <Input type="text" className="form-control" id="formrow-task-input" />
                                        </div>
                                      </div>
                                      <div className="col-md-3">       
                                          <div className="mb-3">
                                              <Label htmlFor="example-date-input" className="form-Label">Created on</Label>
                                              <Input className="form-control" type="date" defaultValue="2019-08-19" id="example-date-input" />
                                          </div>
                                      </div>  
                                      <div className="col-md-3">
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
                          <th scope="col">Name</th>
                          <th scope="col">Property Type</th>
                          <th scope="col">Email</th>
                          <th scope="col">Mobile</th>
                          <th scope="col">Address</th>
                          <th scope="col">Created On</th>
                          <th scope="col">ID Attachment</th>
                          <th scope="col">Documents</th>
                          <th scope="col">Status</th>
                          <th scope="col">Action</th>
                        </tr>
                      </thead>
                      <tbody>
                        <tr>
                          <td>1</td>
                          <td>Danish Sharma</td>
                          <td>Chappelle Garden Villas</td>
                          <td>abc@gmail.com</td>
                          <td>8556055809</td>
                          <td>56</td>
                          <td>18/01/2022</td>
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
                          <td>Active</td>
                          <td>
                            <div className="d-flex gap-3">
                              {/* <Link className="text-success" to="#">
                                <i
                                  className="mdi mdi-pencil font-size-18"
                                  id="edittooltip"
                                  onClick={() => {
                                      tog_large()
                                  }}
                                  data-toggle="modal"
                                  data-target=".bs-example-modal-lg"
                                ></i>
                              </Link> */}
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
                          <td>Danish Sharma</td>
                          <td>Chappelle Garden Villas</td>
                          <td>abc@gmail.com</td>
                          <td>8556055809</td>
                          <td>56</td>
                          <td>18/01/2022</td>
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
                          <td>Active</td>
                          <td>
                            <div className="d-flex gap-3">
                              {/* <Link className="text-success" to="#">
                                <i
                                  className="mdi mdi-pencil font-size-18"
                                  id="edittooltip"
                                  onClick={() => {
                                      tog_large()
                                  }}
                                  data-toggle="modal"
                                  data-target=".bs-example-modal-lg"
                                ></i>
                              </Link> */}
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
                          <td>Danish Sharma</td>
                          <td>Chappelle Garden Villas</td>
                          <td>abc@gmail.com</td>
                          <td>8556055809</td>
                          <td>56</td>
                          <td>18/01/2022</td>
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
                          <td>Active</td>
                          <td>
                            <div className="d-flex gap-3">
                              {/* <Link className="text-success" to="#">
                                <i
                                  className="mdi mdi-pencil font-size-18"
                                  id="edittooltip"
                                  onClick={() => {
                                      tog_large()
                                  }}
                                  data-toggle="modal"
                                  data-target=".bs-example-modal-lg"
                                ></i>
                              </Link> */}
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
                          <td>Danish Sharma</td>
                          <td>Chappelle Garden Villas</td>
                          <td>abc@gmail.com</td>
                          <td>8556055809</td>
                          <td>56</td>
                          <td>18/01/2022</td>
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
                          <td>Active</td>
                          <td>
                            <div className="d-flex gap-3">
                              {/* <Link className="text-success" to="#">
                                <i
                                  className="mdi mdi-pencil font-size-18"
                                  id="edittooltip"
                                  onClick={() => {
                                      tog_large()
                                  }}
                                  data-toggle="modal"
                                  data-target=".bs-example-modal-lg"
                                ></i>
                              </Link> */}
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
                          <td>Danish Sharma</td>
                          <td>Chappelle Garden Villas</td>
                          <td>abc@gmail.com</td>
                          <td>8556055809</td>
                          <td>56</td>
                          <td>18/01/2022</td>
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
                          <td>Active</td>
                          <td>
                            <div className="d-flex gap-3">
                              {/* <Link className="text-success" to="#">
                                <i
                                  className="mdi mdi-pencil font-size-18"
                                  id="edittooltip"
                                  onClick={() => {
                                      tog_large()
                                  }}
                                  data-toggle="modal"
                                  data-target=".bs-example-modal-lg"
                                ></i>
                              </Link> */}
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
                          <td>Danish Sharma</td>
                          <td>Chappelle Garden Villas</td>
                          <td>abc@gmail.com</td>
                          <td>8556055809</td>
                          <td>56</td>
                          <td>18/01/2022</td>
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
                          <td>Active</td>
                          <td>
                            <div className="d-flex gap-3">
                              {/* <Link className="text-success" to="#">
                                <i
                                  className="mdi mdi-pencil font-size-18"
                                  id="edittooltip"
                                  onClick={() => {
                                      tog_large()
                                  }}
                                  data-toggle="modal"
                                  data-target=".bs-example-modal-lg"
                                ></i>
                              </Link> */}
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
                          <td>Danish Sharma</td>
                          <td>Chappelle Garden Villas</td>
                          <td>abc@gmail.com</td>
                          <td>8556055809</td>
                          <td>56</td>
                          <td>18/01/2022</td>
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
                          <td>Active</td>
                          <td>
                            <div className="d-flex gap-3">
                              {/* <Link className="text-success" to="#">
                                <i
                                  className="mdi mdi-pencil font-size-18"
                                  id="edittooltip"
                                  onClick={() => {
                                      tog_large()
                                  }}
                                  data-toggle="modal"
                                  data-target=".bs-example-modal-lg"
                                ></i>
                              </Link> */}
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
                          <td>Danish Sharma</td>
                          <td>Chappelle Garden Villas</td>
                          <td>abc@gmail.com</td>
                          <td>8556055809</td>
                          <td>56</td>
                          <td>18/01/2022</td>
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
                          <td>Active</td>
                          <td>
                            <div className="d-flex gap-3">
                              {/* <Link className="text-success" to="#">
                                <i
                                  className="mdi mdi-pencil font-size-18"
                                  id="edittooltip"
                                  onClick={() => {
                                      tog_large()
                                  }}
                                  data-toggle="modal"
                                  data-target=".bs-example-modal-lg"
                                ></i>
                              </Link> */}
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

export default ResidentApplicant
