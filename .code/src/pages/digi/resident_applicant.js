import React, { useState, useEffect } from "react";
import MetaTags from 'react-meta-tags';
import axios from "../api/axios"
import { SERVER_URL } from "../ServerLink";
import rar from "../../assets/images/rar.png";


import {
  Row,
  Col,
  Card,
  CardBody,
  CardHeader,
  Label,
  CardTitle,
  CardSubtitle,
  Form,
  Input,
  Button
} from "reactstrap"
//Lightbox
import Lightbox from "react-image-lightbox"
import "react-image-lightbox/style.css"


//Import Breadcrumb
import Breadcrumbs from "../../components/Common/Breadcrumb"

const ResidentApplicant = (props) => {

  let { applicant, date } = props

  const [documents, setDocuments] = useState([])
  const [photoIndex, setphotoIndex] = useState(0)
  const [isFits, setisFits] = useState(false)
  const [isEffects, setisEffects] = useState(false)
  const [isGallery, setisGallery] = useState(false)
  const [isOpen, setisOpen] = useState(false)
  const [isOpen1, setisOpen1] = useState(false)
  const [hiderar, sethiderar] = useState(true)

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

  const date1 = new Date(applicant.signatures[0].date)
  const signatureDate1 = date1.getDate() + "/" + date1.getMonth() + "/" + date1.getFullYear()

  async function getIDProofs() {
    const applicantID = applicant._id;
    try {
      const response = await axios.post("/applicant/document-url", { applicantID: applicantID });
      if (response.data.status === 200) {
        const files = response.data.documents;
        setDocuments(files)
        console.log(files)
      } else {
        console.log("Error123", response.data)
      }
    } catch (error) {
      console.log(error)
    }

  }

  useState(async () => {
    await getIDProofs()
  })

  return (
    <React.Fragment>
      <div className="page-content">
        <MetaTags>
          <title>Rentdigicare | Resident Applicant</title>
        </MetaTags>
        <div className="container-fluid">
          <Breadcrumbs title="Home" breadcrumbItem="Resident Applicant" />
          {isFits ? (
            <Lightbox
              mainSrc={documents[photoIndex]}
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
              mainSrc={documents[1]}
              enableZoom={false}
              onCloseRequest={() => {
                setisEffects(!isEffects)
              }}
            />
          ) : null}

          {isGallery ? (
            <Lightbox
              mainSrc={`${SERVER_URL}/images/${documents[photoIndex]}`}
              nextSrc={`${SERVER_URL}/images/${documents[(photoIndex + 1) % documents.length]}`}
              prevSrc={`${SERVER_URL}/images/${documents[(photoIndex + documents.length - 1) % documents.length]}`}
              enableZoom={true}
              onCloseRequest={() => {
                setisGallery(false)
              }}
              onMovePrevRequest={() => {
                if (photoIndex > 0) setphotoIndex(photoIndex - 1)
              }}
              onMoveNextRequest={() => {
                if (photoIndex < documents.length - 1) setphotoIndex(photoIndex + 1)
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
                        <h5 className="card-title">Information<span className="text-muted fw-normal ms-2"></span></h5>
                      </div>
                    </div>
                    <div className="col-md-6 d-flex flex-wrap align-items-center justify-content-end">
                      <div className="mb">
                        <span><b>{applicant.status ? applicant.status : "Not Selected"}</b></span>
                      </div>
                    </div>
                  </div>
                </CardHeader>
                <CardBody>
                  <div className="row align-items-center">

                    {(applicant.applicants.map((appPerson, index) => (
                      <>
                        <h4 className="mb-4">Applicant {(index + 1)}</h4>
                        <div className="col-md-6">
                          <div className="mb-3">
                            <Label htmlFor="example-text-input" className="form-Label">Name</Label>
                            <Input className="form-control" defaultValue={appPerson.firstname} type="text" id="example-text-input" readOnly />
                          </div>
                        </div>
                        <div className="col-md-6">
                          <div className="mb-3">
                            <Label htmlFor="example-text-input" className="form-Label">Phone</Label>
                            <Input className="form-control" defaultValue={appPerson.phone} type="text" id="example-text-input" readOnly />
                          </div>
                        </div>
                        <div className="col-md-6">
                          <div className="mb-3">
                            <Label htmlFor="example-date-input" className="form-Label">Current address</Label>
                            <Input className="form-control" type="text" defaultValue={appPerson.currentAddress} id="example-text-input" readOnly />
                          </div>
                        </div>
                        <div className="col-md-6">
                          <div className="mb-3">
                            <Label htmlFor="example-date-input" className="form-Label">How long at current address?</Label>
                            <Input className="form-control" type="text" defaultValue={appPerson.howLong} id="example-text-input" readOnly />
                          </div>
                        </div>
                        <div className="col-md-6">
                          <div className="mb-3">
                            <Label htmlFor="example-date-input" className="form-Label">Current landlord's name</Label>
                            <Input className="form-control" type="text" defaultValue={appPerson.currentLandloard} id="example-text-input" readOnly />
                          </div>
                        </div>
                        <div className="col-md-6">
                          <div className="mb-3">
                            <Label htmlFor="example-date-input" className="form-Label">Landlord's phone</Label>
                            <Input className="form-control" type="text" defaultValue={appPerson.currentLandlordPhone} id="example-text-input" readOnly />
                          </div>
                        </div>
                        <div className="col-md-6">
                          <div className="mb-3">
                            <Label htmlFor="example-date-input" className="form-Label">Previous address</Label>
                            <Input className="form-control" type="text" defaultValue={appPerson.previousAddressInformation.previousAddress} id="example-text-input" readOnly />
                          </div>
                        </div>
                        <div className="col-md-6">
                          <div className="mb-3">
                            <Label htmlFor="example-date-input" className="form-Label">How long?</Label>
                            <Input className="form-control" type="text" defaultValue={appPerson.previousAddressInformation.howLongAtPreviousAddress} id="example-text-input" readOnly />
                          </div>
                        </div>
                        <div className="col-md-6">
                          <div className="mb-3">
                            <Label htmlFor="example-date-input" className="form-Label">Previous landlord's name</Label>
                            <Input className="form-control" type="text" defaultValue={appPerson.previousAddressInformation.previousLandloardName} id="example-text-input" readOnly />
                          </div>
                        </div>
                        <div className="col-md-6">
                          <div className="mb-3">
                            <Label htmlFor="example-date-input" className="form-Label">landlord's  Phone</Label>
                            <Input className="form-control" type="text" defaultValue={appPerson.previousAddressInformation.previousLandloardPhone} id="example-text-input" readOnly />
                          </div>
                        </div>
                        <div className="col-md-6">
                          <div className="mb-3">
                            <Label htmlFor="example-date-input" className="form-Label">Current Employer</Label>
                            <Input className="form-control" type="text" defaultValue={appPerson.currentEmployer} id="example-text-input" readOnly />
                          </div>
                        </div>
                        <div className="col-md-6">
                          <div className="mb-3">
                            <Label htmlFor="example-date-input" className="form-Label">How Long?</Label>
                            <Input className="form-control" type="text" defaultValue={appPerson.currentEmployerFor} id="example-text-input" readOnly />
                          </div>
                        </div>
                        <div className="col-md-6">
                          <div className="mb-3">
                            <Label htmlFor="example-date-input" className="form-Label">Occupation</Label>
                            <Input className="form-control" type="text" defaultValue={appPerson.occupation} id="example-text-input" readOnly />
                          </div>
                        </div>
                        <div className="col-md-6">
                          <div className="mb-3">
                            <Label htmlFor="example-date-input" className="form-Label">Annual income</Label>
                            <Input className="form-control" type="text" defaultValue={appPerson.annualIncome} id="example-text-input" readOnly />
                          </div>
                        </div>
                        <div className="col-md-6">
                          <div className="mb-3">
                            <Label htmlFor="example-date-input" className="form-Label">Supervisor/Manager</Label>
                            <Input className="form-control" type="text" defaultValue={appPerson.manager} id="example-text-input" readOnly />
                          </div>
                        </div>
                        <div className="col-md-6">
                          <div className="mb-3">
                            <Label htmlFor="example-date-input" className="form-Label">Phone</Label>
                            <Input className="form-control" type="text" defaultValue={appPerson.currentEmployerPhone} id="example-text-input" readOnly />
                          </div>
                        </div>
                        <hr className="my-4" />
                      </>
                    )))}
                    <div className="col-md-6">
                      <div className="mb-3">
                        <Label htmlFor="example-text-input" className="form-Label">Layout</Label>
                        <Input className="form-control" defaultValue={applicant.main.layout} type="text" id="example-text-input" readOnly />
                      </div>
                    </div>
                    <div className="col-md-6">
                      <div className="mb-3">
                        <Label htmlFor="example-date-input" className="form-Label">Date to move in</Label>
                        <Input className="form-control" type="text" defaultValue={date} id="example-text-input" readOnly />
                      </div>
                    </div>
                    <div className="col-md-6">
                      <div className="mb-3">
                        <Label htmlFor="example-date-input" className="form-Label">How did you hear about us?</Label>
                        <Input className="form-control" type="text" defaultValue={applicant.main.source} id="example-text-input" readOnly />
                      </div>
                    </div>
                  </div>
                </CardBody>
              </Card>

              <Card>
                <CardHeader>
                  <CardTitle><b>Other Information</b></CardTitle>
                </CardHeader>
                <CardBody>
                  <div className="row align-items-center">

                    {(applicant.residePersons.map((person) => (
                      <>
                        <div className="col-md-6">
                          <div className="mb-3">
                            <Label htmlFor="example-text-input" className="form-Label">Name of persons who will reside in the units</Label>
                            <Input className="form-control" type="text" defaultValue={person.name} id="example-text-input" readOnly />
                          </div>
                        </div>
                        <div className="col-md-3">
                          <div className="mb-3">
                            <Label htmlFor="example-text-input" className="form-Label">Relation to Appliant (S)</Label>
                            <Input className="form-control" type="text" defaultValue={person.relation} id="example-text-input" readOnly />
                          </div>
                        </div>
                        <div className="col-md-3">
                          <div className="mb-3">
                            <Label htmlFor="example-text-input" className="form-Label">Age</Label>
                            <Input className="form-control" type="text" defaultValue={person.age} id="example-text-input" readOnly />
                          </div>
                        </div>
                      </>
                    )))}
                    <hr className="my-4" />
                    {applicant.emergencyContacts.map((person, index) => (
                      <>
                        <div className="col-md-6">
                          <div className="mb-3">
                            <Label htmlFor="example-text-input" className="form-Label">{(index + 1)}- Person to notify in case of emergency</Label>
                            <Input className="form-control" type="text" defaultValue={person.firstname} id="example-text-input" readOnly />
                          </div>
                        </div>
                        <div className="col-md-6">
                          <div className="mb-3">
                            <Label htmlFor="example-text-input" className="form-Label">Phone</Label>
                            <Input className="form-control" type="text" defaultValue={person.phone} id="example-text-input" readOnly />
                          </div>
                        </div>
                      </>
                    ))}

                  </div>
                </CardBody>
              </Card>
              <Row>
                <Col lg={6}>
                  <Card>
                    <CardHeader>
                      <CardTitle><b>ID Proofs</b></CardTitle>
                    </CardHeader>
                    <CardBody>
                      {/* <Row>
                        {documents.map((filename, index) => {
                          return (
                            <Col lg={3} sm={6}>
                              <div className="mt-4">
                                <img
                                  src={`${SERVER_URL}/images/${filename}`}
                                  onClick={() => {
                                    setisGallery(true);
                                    setphotoIndex(index);
                                  }}
                                  className="img-fluid"
                                  alt={filename}
                                />
                              </div>
                            </Col>
                          );
                        })}

                      </Row> */}

                      <Row>
                        {applicant.totalDocuments === 1 ?
                          <>

                            <Col lg={3} sm={6} >

                              <a href={`${SERVER_URL}/applicant/download-document?id=${applicant._id}&documents=1`} download={`${applicant.applicants[0].firstname}-documents.zip`}>
                                <img style={{ cursor: "pointer" }} src={rar} alt="" width="150" height="150" />
                              </a>

                              <p className="text-center mt-2"><b>Applicant 1</b></p>
                            </Col>

                          </>
                          : <></>
                        }
                        {applicant.totalDocuments === 2 ?
                          <>
                            <Col lg={3} sm={6} >
                              <a href={`${SERVER_URL}/applicant/download-document?id=${applicant._id}&documents=1`} download={`${applicant.applicants[0].firstname}-documents.zip`}>
                                <img className="img-fluid" style={{ cursor: "pointer", marginRight: "10px" }} src={rar} alt="" width="150" height="150" />
                                </a>
                                <p className="text-center mt-2"><b>Applicant 1</b></p>

                            </Col>

                            <Col lg={3} sm={6} >

                            <a href={`${SERVER_URL}/applicant/download-document?id=${applicant._id}&documents=2`} download={`${applicant.applicants[1].firstname}-documents.zip`}>
                              <img className="img-fluid" style={{ cursor: "pointer" }} src={rar} alt="" width="150" height="150"  />
                              </a>


                              <p className="text-center mt-2"><b>Applicant 2</b></p>
                            </Col>

                          </> : <></>
                        }

                      </Row>
                    </CardBody>
                  </Card>
                </Col>
                <Col lg={6}>
                  <Card>
                    <CardHeader>
                      <CardTitle><b>Applicant Signatures</b></CardTitle>
                    </CardHeader>
                    <CardBody>
                      <Row>
                        {(applicant?.signatures?.map((signature, i) => (
                          <Col lg={3} sm={6} >
                            <div className="mt-4">
                              <img
                                src={signature.signature}
                                className="img-fluid"
                                alt=""
                              />
                              <p className="text-center mt-2"><b>Date : </b>{signature?.date}</p>
                              <p className="text-center mt-2"><b>Applicant{i + 1} </b></p>
                            </div>
                          </Col>
                        )))}

                      </Row>
                    </CardBody>
                  </Card>
                </Col>
              </Row>
            </Col>
          </Row>
        </div>
      </div >
    </React.Fragment >
  )
}


export default ResidentApplicant
