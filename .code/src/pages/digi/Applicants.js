import React, { useEffect, useState } from "react";
import axios from "../api/axios";
import { Link } from "react-router-dom";
import jwt_decode from "jwt-decode";
// import rar from "../../assets/images/rar.png";
import { SERVER_URL } from "../ServerLink";
import jszip from 'jszip';
import { saveAs } from 'file-saver';
// import Dropdown from 'react-bootstrap/Dropdown';
import {
  Row,
  Col,
  Card,
  Label,
  Form,
  Input,
  Modal,
  Button,
  ModalFooter,
  ModalBody,
  ModalHeader,
} from "reactstrap";
import Dropzone from "react-dropzone";
import TenantsTable from "./TenantsTable";
import { toast } from "react-toastify";

export default function Applicants(props) {
  const CREATE_CUSTOMER = "customer/addCustomer";
  const PROPERTIES_URL = `property/list`;

  // const PDF_DOWNLOAD_URL = "/applicant/pdf";
  const decode = jwt_decode(window.localStorage.getItem("accessToken"));
  const [showDeleteDialoge, setShowDeleteDialoge] = useState(false);
  const [tenantsDialoge, setTenantsDialoge] = useState(false);
  const [addTenantsDialoge, setAddTenantsDialoge] = useState(false);

  const [propList, setPropList] = useState([]);

  const [firstName, setFirstName] = useState("");
  const [lastName, setLastName] = useState("");
  const [email, setEmail] = useState("");
  const [phone, setPhone] = useState("");
  const [property, setProperty] = useState("");
  const [suitNum, setSuitNum] = useState("");
  const [selectedFiles, setselectedFiles] = useState([]);

  const [check_first_name, setcheck_first_name] = useState(false);
  const [check_last_name, setcheck_last_name] = useState(false);
  const [check_email, setcheck_email] = useState(false);
  const [check_phone, setcheck_phone] = useState(false);
  const [check_properties, setcheck_properties] = useState(false);
  const [check_suit, setcheck_suit] = useState(false);
  const [check_document, setcheck_document] = useState(false);

  const [first_err, setfist_err] = useState("");
  const [last_err, setlast_err] = useState("");
  const [email_err, setemail_err] = useState("");
  const [phone_err, setphone_err] = useState("");
  const [prop_err, setprop_err] = useState("");
  const [suit_err, setsuit_err] = useState("");
  const [doc_err, setdoc_err] = useState("");

  async function deleteApplication(applicationID, userID) {
    try {
      const response = await axios.delete(
        `/applicant/delete?userID=${userID}&applicationID=${applicationID}`
      );
      if (response.data.status === 200) {
        window.location.replace("/resident_application");
      }

      if (response.data.status === 409) {
        alert("409");
        // TODO visible message
      }
      if (response.data.status === 401) {
        alert("401");
        // TODO visible message
      }
    } catch (error) {
      // TODO visible message
    }
  }
  const handleUpdate = async (id, val) => {
    await axios
      .post("/applicant/status-update", {
        applicationID: id,
        applicationStatus: val,
      })
      .then((res) => props.setStatusUpdate(true));
  };

  const getColor = (val) => {
    switch (val) {
      case "Approved":
        return "btn btn-success";
      case "Denied":
        return "btn btn-danger";
      default:
        return "btn btn-warning ";
    }
  };

  function formatBytes(bytes, decimals = 2) {
    if (bytes === 0) return "0 Bytes";
    const k = 1024;
    const dm = decimals < 0 ? 0 : decimals;
    const sizes = ["Bytes", "KB", "MB", "GB", "TB", "PB", "EB", "ZB", "YB"];

    const i = Math.floor(Math.log(bytes) / Math.log(k));
    return parseFloat((bytes / Math.pow(k, i)).toFixed(dm)) + " " + sizes[i];
  }

  async function uploadDocuments(val) {
    console.log("uploadDocuments", val);
    const formData = new FormData();
    var i = 0;
    while (i < selectedFiles.length) {
      formData.append(`file`, selectedFiles[i]);
      i++;
    }

    const config = {
      headers: {
        "content-type": "multipart/form-data",
        id: `${val}`,
      },
    };
    console.log("config", config);
    try {
      const response = await axios.post(
        "/customer/upload-documents",
        formData,
        config
      );
      console.log("response upload file", response);
      setAddTenantsDialoge(false);
    } catch (error) {
      console.log(error);
    }
  }

  function handleAcceptedFiles(files) {
    files.map((file) =>
      Object.assign(file, {
        preview: URL.createObjectURL(file),
        formattedSize: formatBytes(file.size),
      })
    );
    setselectedFiles(files);
    setcheck_document(true);
    setdoc_err("");
  }

  const deleteDocument = (index) => {
    setselectedFiles(selectedFiles.filter((_, i) => i !== index));
    // console.log(selectedFiles)
  };

  const getProperties = async () => {
    let data = {
      role: decode.role,
      domain: decode.role === "company" ? decode.domain : "",
      managerID: decode.role === "manager" ? decode.id : "",
    };
    try {
      const response = await axios.post(PROPERTIES_URL, data);
      if (response.data.results.properties) {
        setPropList(response.data.results.properties);
        setProperty(propList[0]?._id)
      }
    } catch (error) {
      console.log(error);
    }
  };
  useEffect(() => {
    getProperties();
  }, []);

  const onModalSave = async (event, id) => {
    // alert(id);
    event.preventDefault();

    const data = new FormData();

    let errorFirst = false;
    let errorLast = false;
    let errorEmail = false;
    let errorPhone = false;
    let errorProp = false;
    let errorSuit = false;
    let errorDoc = false;

    if (firstName === "") {
      setcheck_first_name(false);
      errorFirst = false;
      setfist_err("Cannot be empty");
    } else if (firstName !== "") {
      if (!firstName.match(/^[a-zA-Z ]+$/)) {
        setcheck_first_name(false);
        errorFirst = false;
        setfist_err("Only letters allowed");
      } else {
        setcheck_first_name(true);
        errorFirst = true;
      }
    }

    if (lastName === "") {
      setcheck_last_name(false);
      errorLast = false;
      setlast_err("Cannot be empty");
    } else if (lastName !== "") {
      if (!lastName.match(/^[a-zA-Z ]+$/)) {
        setcheck_last_name(false);
        errorLast = false;
        setlast_err("Only letters allowed");
      } else {
        setcheck_last_name(true);
        errorLast = true;
      }
    }

    if (email === "") {
      setcheck_email(false);
      errorEmail = false;
      setemail_err("Cannot be empty");
    } else if (email !== "") {
      if (!email.match(/^\w+([\.-]?\w+)*@\w+([\.-]?\w+)*(\.\w{2,3})+$/)) {
        setcheck_email(false);
        errorEmail = false;
        setemail_err("Enter valid email address");
      } else {
        setcheck_email(true);
        errorEmail = true;
      }
    }

    if (phone === "") {
      setcheck_phone(false);
      errorPhone = false;
      setphone_err("Cannot be empty");
    } else if (phone !== "") {
      if (!phone.match(/^\(?([0-9]{3})\)?[-. ]?([0-9]{3})[-. ]?([0-9]{4})$/)) {
        setcheck_phone(false);
        errorPhone = false;
        setphone_err("Enter valid phone number");
      } else {
        setcheck_phone(true);
        errorPhone = true;
      }
    }

    if (property === "") {
      setcheck_properties(false);
      errorProp = false;
      setprop_err("Cannot be empty");
    } else {
      setcheck_properties(true);
      errorProp = true;
    }

    if (suitNum === "") {
      setcheck_suit(false);
      errorSuit = false;
      setsuit_err("Cannot be empty");
    } else if (suitNum !== "") {
      if (!suitNum.match(/^[0-9a-zA-Z]+$/)) {
        setcheck_suit(false);
        errorSuit = false;
        setsuit_err("Only letters and numbers are allowed");
      } else {
        setcheck_suit(true);
        errorSuit = true;
      }
    }
    if (selectedFiles.length < 1) {
      setcheck_document(false);
      errorDoc = false;
      setdoc_err("Cannot be empty");
    } else {
      setcheck_document(true);
      errorDoc = true;
    }

    if (
      errorFirst &&
      errorLast &&
      errorEmail &&
      errorPhone &&
      errorProp &&
      errorSuit &&
      errorDoc
    ) {
      data.append("firstname", firstName);
      data.append("lastname", lastName);
      data.append("email", email);
      data.append("mobile", phone);
      data.append("properties", property);
      data.append("suite", suitNum);
      data.append("file", []);
      data.append("applicantId", id);
      data.append("due_date", "due_date");
      data.append("username", "");
      try {
        const response = await axios.post(
          `${CREATE_CUSTOMER}`,
          data
          // {
          //   firstname: firstName,
          //   lastname: lastName,
          //   email: email,
          //   mobile: phone,
          //   properties: property,
          //   suite: suitNum,
          //   file: [],
          //   applicantId: id,
          //   due_date: "due_date",
          //   username: "username",
          // }
        );
        console.log("response create customer", response);
        if (response.status === 201) {
          await uploadDocuments(response.data.id);
          setAddTenantsDialoge(false);
        }
      } catch (error) {
        console.error("error ==>", error);
      }
    }
   
  };
  console.log(property,'opopopop')
  console.log('workingg')
  // console.log(props.status, "applicant.status");
  const getFilenameFromLink = (link) => {
    const url = new URL(link);
    return url.pathname.split('/').pop();
  };
  // const handleDownload = async () => {
  //   const zip = new jszip();
  //   let urls = props?.documents?.map((e)=>{
  //     let docName = getFilenameFromLink(e)
  //     return ({url:`${e}`, name: docName})})
  //   const folder = zip.folder('Apllicants')
  //   urls.forEach((url)=>{
      
  //     const blobPromise = fetch(url.url).then(r => {
  //       if (r.status === 200) return r.blob()
  //         return Promise.reject(new Error(r.statusText))
  //     }).catch((e) => {
  //         console.log(e,'nnnnn');
  //       })
      
  //     folder.file(url.name,blobPromise)
  //   })
  //   zip.generateAsync({type:"blob"}).then(blob => 
  //   saveAs(blob,"Apllicants")).catch(e=> console.log(e));
  // };
  
  const handleDownload = async () => {
    let urls = props?.documents?.map((e) => {
      let docName = getFilenameFromLink(e);
      return { url: `${e}`, name: docName };
    });

    try {
      const response = await axios.post(`/applicant/download-zip`, { urls }, {
        responseType: 'arraybuffer', // Specify responseType
      });

      if (response.status === 200) {
        const blob = new Blob([response.data], { type: 'application/zip' });
        const url = window.URL.createObjectURL(blob);
        const a = document.createElement('a');
        a.href = url;
        a.download = 'Applicants.zip';
        a.click();
      } else {
        console.error('Error creating zip:', response.statusText);
      }
    } catch (error) {
      console.error('An error occurred:', error);
    }
  };


  return (
    <tr>
      <td>{props.number}</td>
      <td>
        <Link to={`/resident_applicant?qapp=${props.id}`}>
          {props.propertyName}
        </Link>
      </td>
      <td>
        <div>{props.name}</div> <div>{props.email}</div>{" "}
        <div>{props.mobile}</div>
      </td>
      {/* <td>{props.email}</td>
      <td>{props.mobile}</td> */}
      <td>{props.address}</td>
      <td>{props.createdAt}</td>
      <td>
        <div>
          <a
            href={`${SERVER_URL}/applicant/pdf?id=${props.id}`}
            download={"Applicant.pdf"}
          >
            <button
              type="button"
              className="btn btn-soft-light btn-sm w-xs waves-effect btn-label waves-light"
            >
              <i className="bx bx-download label-icon"></i> PDF
            </button>
          </a>
        </div>
      </td>
      <td>
        {props.totalDocuments < 1  && props?.documents?.length == 0 ? <p>No Document Uploaded</p> : <></>}
        {props.totalDocuments === 1 ? (
          <>
            <div>
              <a
                href={`${SERVER_URL}/applicant/download-document?id=${props.id}&documents=1`}
                download={`${
                  props.applicants ? props.applicants[0].firstname : ""
                }-documents.zip`}
              >
                <button
                  type="button"
                  class="btn btn-soft-light btn-sm w-xs waves-effect btn-label waves-light"
                >
                  <i class="bx bx-download label-icon"></i> Applicant 1
                </button>
              </a>
            </div>
          </>
        ) : (
          <></>
        )}
        {props.totalDocuments === 2 ? (
          <>
            <div>
              <a
                href={`${SERVER_URL}/applicant/download-document?id=${props.id}&documents=1`}
                download={`${
                  props.applicants ? props.applicants[0].firstname : ""
                }-documents.zip`}
              >
                <button
                  type="button"
                  class="btn btn-soft-light btn-sm w-xs waves-effect btn-label waves-light"
                >
                  <i class="bx bx-download label-icon"></i> Applicant 1
                </button>
              </a>
            </div>
            <div>
              <a
                href={`${SERVER_URL}/applicant/download-document?id=${props.id}&documents=2`}
                download={`${
                  props.applicants ? props.applicants[1].firstname : ""
                }-documents.zip`}
              >
                <button
                  type="button"
                  class="btn btn-soft-light btn-sm w-xs waves-effect btn-label waves-light"
                >
                  <i class="bx bx-download label-icon"></i> Applicant 2
                </button>
              </a>
            </div>
          </>
        ) : (
          <></>
        )}
        {props?.documents?.length > 0 ?(
          <>
          <div>
              <button
              onClick={() => handleDownload(props?.documents)}
                type="button"
                class="btn btn-soft-light btn-sm w-xs waves-effect btn-label waves-light"
              >
                <i class="bx bx-download label-icon"></i> Applicants
              </button>
          </div>
        </>
        ) : (
          <></>
        )}
      </td>
      <td>
        <select
          className={`form-select applicant-status btn-sm ${getColor(
            props?.status
          )}`}
          style={{ width: "120px" }}
          value={props.status}
          onChange={(event) => {
            handleUpdate(props.id, event.target.value);
          }}
        >
          <option className="btn btn-light" value={"Pending"}>
            Pending
          </option>
          <option className="btn btn-light " value="Approved">
            Approved
          </option>
          <option className="btn btn-light " value="Denied">
            Denied
          </option>
        </select>
        {/* {
          props.status == "Approved" &&
          <div className="d-flex justify-content-center align-items-center w-100 mt-1">
              <a href="/agreement-form" className="btn btn-primary btn-sm">Fill Form</a>
          </div>
        } */}
      </td>
      <td>{props.sources}</td>
      {["company"].includes(decode.role) ||
      ["manager"].includes(decode.role) ? (
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
            {["company"].includes(decode.role) && (
              <Link className="text-danger" to="#">
                <i
                  className="mdi mdi-delete font-size-18"
                  id="deletetooltip"
                  onClick={async (e) => {
                    e.preventDefault();
                    setShowDeleteDialoge(!showDeleteDialoge);
                  }}
                ></i>
              </Link>
            )}
            {(["company"].includes(decode.role) ||
              ["manager"].includes(decode.role)) && (
              <button
                className="btn btn-primary btn-sm mo-mb-2 mr-5"
                type="button"
                style={{ cursor: "pointer" }}
                onClick={async (e) => {
                  e.preventDefault();
                  setTenantsDialoge(!tenantsDialoge);
                }}
              >
                Tenants
              </button>
            )}

            <Modal
              size="lg"
              isOpen={tenantsDialoge}
              toggle={() => setTenantsDialoge(!tenantsDialoge)}
            >
              <ModalHeader
                toggle={() => setTenantsDialoge(!tenantsDialoge)}
                style={{ position: "relative" }}
              >
                Tenants
                <button
                  className="btn btn-primary mo-mb-2 mr-5"
                  type="button"
                  style={{
                    cursor: "pointer",
                    position: "absolute",
                    right: 35,
                    top: 8,
                  }}
                  onClick={async (e) => {
                    e.preventDefault();
                    setAddTenantsDialoge(!addTenantsDialoge);
                    setTenantsDialoge(!tenantsDialoge);
                  }}
                >
                  {" "}
                  <i className="bx bx-plus me-1"></i>Add Tenants
                </button>
              </ModalHeader>
              <ModalBody>
                <TenantsTable id={props.id} />
              </ModalBody>
            </Modal>

            <Modal
              size="lg"
              isOpen={addTenantsDialoge}
              toggle={() => setAddTenantsDialoge(!addTenantsDialoge)}
            >
              <ModalHeader
                toggle={() => setAddTenantsDialoge(!addTenantsDialoge)}
              >
                Add Tenants
              </ModalHeader>
              <ModalBody>
                <Form onSubmit={(e) => onModalSave(e, props.id)}>
                  <div className="row">
                    <div className="col-md-6">
                      <div className="mb-3">
                        <Label
                          className="form-label"
                          htmlFor="formrow-name-input"
                        >
                          First Name *
                        </Label>
                        <Input
                          name="name"
                          type="text"
                          className="form-control"
                          id="formrow-name-input"
                          placeholder="First Name"
                          onChange={(e) => setFirstName(e.target.value)}
                        />
                        {check_first_name ? (
                          ""
                        ) : (
                          <Label style={{ color: "red" }}>{first_err}</Label>
                        )}
                      </div>
                    </div>
                    <div className="col-md-6">
                      <div className="mb-3">
                        <Label
                          className="form-label"
                          htmlFor="formrow-name-input"
                        >
                          Last Name *
                        </Label>
                        <Input
                          name="firstname"
                          type="text"
                          className="form-control"
                          id="formrow-name-input"
                          placeholder="Last Name"
                          onChange={(e) => setLastName(e.target.value)}
                        />
                        {check_last_name ? (
                          ""
                        ) : (
                          <Label style={{ color: "red" }}>{last_err}</Label>
                        )}
                      </div>
                    </div>
                    <div className="col-md-6">
                      <div className="mb-3">
                        <Label
                          className="form-label"
                          htmlFor="formrow-zip-input"
                        >
                          Email *
                        </Label>
                        <Input
                          name="email"
                          type="text"
                          className="form-control"
                          id="formrow-zip-input"
                          placeholder="abc@gmail.com"
                          onChange={(e) => setEmail(e.target.value)}
                        />
                        {check_email ? (
                          ""
                        ) : (
                          <Label style={{ color: "red" }}>{email_err}</Label>
                        )}
                      </div>
                    </div>

                    <div className="col-md-6">
                      <div className="mb-3">
                        <Label
                          className="form-label"
                          htmlFor="formrow-zip-input"
                        >
                          Phone *
                        </Label>
                        <Input
                          name="phone"
                          type="number"
                          className="form-control"
                          id="formrow-zip-input"
                          placeholder="9875400000"
                          inputMode="numeric"
                          maxLength={10}
                          onChange={(e) => setPhone(e.target.value)}
                        />
                        {check_phone ? (
                          ""
                        ) : (
                          <Label style={{ color: "red" }}>{phone_err}</Label>
                        )}
                      </div>
                    </div>
                    <div className="col-md-6">
                      <div className="mb-3">
                        <Label
                          className="form-label"
                          htmlFor="formrow-category-input"
                        >
                          Properties *
                        </Label>
                        <select
                          // value={propList[0]?._id}
                          value={property}
                          onChange={(e) => {
                            setProperty(e.target.value);
                          }}
                          className="form-select"
                          placeholder="Select a property"
                        >
                          {propList.map((opt, ind) => {
                            return <option value={opt._id}>{opt.title}</option>;
                          })}
                        </select>
                        {check_properties ? (
                          ""
                        ) : (
                          <Label style={{ color: "red" }}>{prop_err}</Label>
                        )}
                      </div>
                    </div>

                    <div className="col-md-6">
                      <div className="mb-3">
                        <Label
                          className="form-label"
                          htmlFor="formrow-zip-input"
                        >
                          Suit *
                        </Label>
                        <Input
                          name="suitNumber"
                          type="text"
                          className="form-control"
                          id="formrow-zip-input"
                          placeholder="zx1"
                          onChange={(e) => setSuitNum(e.target.value)}
                        />
                        {check_suit ? (
                          ""
                        ) : (
                          <Label style={{ color: "red" }}>{suit_err}</Label>
                        )}
                      </div>
                    </div>
                    <div className="col-md-12">
                      <div className="mb-3">
                        <Label
                          className="form-label"
                          htmlFor="formrow-firstname-input"
                        >
                          Documents *
                        </Label>
                        <Dropzone
                          onDrop={async (acceptedFiles) => {
                            // working
                            handleAcceptedFiles(acceptedFiles);
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
                        <div
                          className="dropzone-previews mt-3"
                          id="file-previews"
                        >
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
                                      <button
                                        type="button"
                                        className="btn btn-soft-danger waves-effect waves-light"
                                        href="javascript:void(0)"
                                        onClick={() => deleteDocument(i)}
                                      >
                                        <i className="bx bx-trash-alt"></i>
                                      </button>
                                    </Col>
                                  </Row>
                                </div>
                              </Card>
                            );
                          })}
                        </div>
                        {check_document ? (
                          ""
                        ) : (
                          <Label style={{ color: "red" }}>{doc_err}</Label>
                        )}
                      </div>
                    </div>
                    <div className="col-md-12">
                      <div className="text-end">
                        <span
                          id="errorSpan"
                          style={{
                            display: "none",
                            color: "red",
                            marginRight: "10px",
                          }}
                        >
                          Error:here
                        </span>
                        <button
                          id="companySubmitBtn"
                          type="submit"
                          className="btn btn-success save-user"
                        >
                          Save
                          <div
                            id="saveSpinner"
                            style={{
                              display: "none",
                              height: "15px",
                              width: "15px",
                              marginLeft: "5px",
                            }}
                            class="spinner-border"
                            role="status"
                          ></div>
                          <i
                            id="failedSaveErrorIcon"
                            style={{
                              display: "none",
                              marginLeft: "5px",
                            }}
                            class="fa fa-exclamation-triangle"
                            aria-hidden="true"
                          ></i>
                        </button>
                      </div>
                    </div>
                  </div>
                </Form>
              </ModalBody>
            </Modal>

            <Modal
              isOpen={showDeleteDialoge}
              toggle={() => setShowDeleteDialoge(!showDeleteDialoge)}
            >
              <ModalHeader
                toggle={() => setShowDeleteDialoge(!showDeleteDialoge)}
              >
                Confirm
              </ModalHeader>
              <ModalBody>Are you sure you want to delete this?</ModalBody>
              <ModalFooter>
                <Button
                  color="secondary"
                  onClick={() => setShowDeleteDialoge(!showDeleteDialoge)}
                >
                  Cancel
                </Button>
                <Button
                  color="danger"
                  onClick={async () =>
                    await deleteApplication(props.id, props.userID)
                  }
                >
                  Delete
                </Button>
              </ModalFooter>
            </Modal>
          </div>
        </td>
      ) : (
        ""
      )}
    </tr>
  );
}
