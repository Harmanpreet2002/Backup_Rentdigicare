import React , {useState , useEffect} from 'react'
import { Link } from "react-router-dom"
import axios from '../api/axios'
import { SERVER_URL } from "../ServerLink";
import { Modal, Label, Form, Input } from "reactstrap";
import Dropzone from "react-dropzone";
import Select from "react-select";


const DOCUMENT_DOWNLOAD_URL = "/property_manager/download-document"
export default function Manager(props) {
  const [modal_large, setmodal_large] = useState(false);
  const [modal_large1, setmodal_large1] = useState(false);
  const [modal_large2, setmodal_large2] = useState(false);
  async function deletePropertyManager(managerID, userID) {
    try {
      const response = await axios.delete(`/property_manager/delete?userID=${userID}&managerID=${managerID}`)
      if (response.data.status === 200) {
        window.location.replace("/property_manager")
      }

      if (response.data.status === 409) {
        // TODO proper Error
      }

      if (response.data.status === 401) {
        // TODO proper Error
      }

    } catch (error) {
      // TODO proper Error
    }
  }
  const [selectedFiles, setselectedFiles] = useState([]);

  function handleAcceptedFiles(files) {
    files.map((file) =>
      Object.assign(file, {
        preview: URL.createObjectURL(file),
        formattedSize: formatBytes(file.size),
      })
    );
    setselectedFiles(files);
  }
   function removeBodyCss() {
    document.body.classList.add("no_padding");
  }
  function tog_large() {
    setmodal_large(!modal_large);
    removeBodyCss();
  }
  function tog_large1() {
    setmodal_large1(!modal_large1);
    removeBodyCss();
  }
  function tog_large2() {
    setmodal_large2(!modal_large2);
    removeBodyCss();
  }
  function formatBytes(bytes, decimals = 2) {
    if (bytes === 0) return "0 Bytes";
    const k = 1024;
    const dm = decimals < 0 ? 0 : decimals;
    const sizes = ["Bytes", "KB", "MB", "GB", "TB", "PB", "EB", "ZB", "YB"];

    const i = Math.floor(Math.log(bytes) / Math.log(k));
    return parseFloat((bytes / Math.pow(k, i)).toFixed(dm)) + " " + sizes[i];
  }
  return (
    <tr>
      <td>{props.number}</td>
      <td>

        {props.name}

      </td>
      {/*<td>20</td> */}
      <td>{props.email}</td>
      <td>{props.mobile}</td>
      <td>{props.createdAt}</td>
      <td>
        <div>
          <a href={`${SERVER_URL}/property_manager/download-document?ID=${props.id}`}
            download={`${props.name ? props.name : "propertyManager"}.zip`}>
            <button
              type="button"
              className="btn @btn-soft-light btn-md w-xs waves-effect btn-label waves-light  doc-download-btn"
            >
              <i className="bx bx-download label-icon"></i>
            </button>
          </a>
        </div>
      </td>
      {/* <td>56</td> */}
      <td>{props.status}</td>
      <td>{props.properties.length}</td>
      <td>
        <div className="d-flex gap-3">
          {/* <Link className="text-success" to="#">
          <i
            className="mdi mdi-pencil font-size-18"
            id="edittooltip"
            onClick={() => {
               // tog_large()
            }}
            data-toggle="modal"
            data-target=".bs-example-modal-lg"
          ></i>
        </Link> */}
          <Link className="text-danger" to="#">
            <i
              className="mdi mdi-delete font-size-18"
              id="deletetooltip"
              onClick={async (e) => {
                e.preventDefault();
                await deletePropertyManager(props.id, props.userID)
              }}
            ></i>{" "}{" "}
              <i
                className="mdi mdi-border-color font-size-18"
                // id="deletetooltip"
                style={{color : "black"}}
                onClick={async () => {
                                tog_large();
                                // await getCompanies();
                              }}
              ></i>
          </Link>
        </div>
      </td>
      <Modal
                            size="lg"
                            isOpen={modal_large}
                            toggle={() => {
                              tog_large();
                            }}
                          >
                            <div className="modal-header">
                              <h5
                                className="modal-title mt-0"
                                id="myLargeModalLabel"
                              >
                                Edit Property
                              </h5>
                              <button
                                onClick={() => {
                                  setmodal_large(false);
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
                              <Form >
                                <div className="row">
                                  <div className="col-md-6">
                                    <div className="mb-3">
                                    <Label
                                        className="form-label"
                                        htmlFor="formrow-facility-input"
                                      >
                                        First Name *
                                      </Label>
                                      <Input
                                        onChange={(e) => {
                                          // setManagerFirstName(e.target.value);
                                        }}
                                        type="text"
                                        className="form-control"
                                        id="formrow-phone-input"
                                      />
                                      
                                    </div>
                                  </div>
                                  <div className="col-md-6">
                                    <div className="mb-3">
                                      <Label
                                        className="form-label"
                                        htmlFor="formrow-facility-input"
                                      >
                                        Last Name *
                                      </Label>
                                      <Input
                                        onChange={(e) => {
                                          // setManagerLastName(e.target.value);
                                        }}
                                        type="text"
                                        className="form-control"
                                        id="formrow-phone-input"
                                      />
                                      {/* {check_last ? (
                                        ""
                                      ) : (
                                        <Label style={{ color: "red" }}>
                                          {msg_error1}
                                        </Label>
                                      )} */}
                                    </div>
                                  </div>

                                  <div className="col-md-6">
                                    <div className="mb-3">
                                      <Label
                                        className="form-label"
                                        htmlFor="formrow-facility-input"
                                      >
                                        Property Name *
                                      </Label>
                                      <Select
                                        isMulti
                                        // onChange={(selectedOption) => {
                                        //   const propertys = [];
                                        //   selectedOption.map((property) => {
                                        //     propertys.push(property.value);
                                        //   });
                                        //   // setPropertys(propertys);
                                        // }}
                                        // options={propertyList}
                                        className="basic-multi-select"
                                        classNamePrefix="select"
                                      />
                                      {/* {check_name ? (
                                        ""
                                      ) : (
                                        <Label style={{ color: "red" }}>
                                          {msg_error3}
                                        </Label>
                                      )} */}
                                      {/* <select
                                        className="form-select"
                                        onChange={(e) => {
                                          setPropertyID(e.target.value);
                                          console.log(e.target.value);
                                          const filteredProperties =
                                            propertyList.filter(
                                              (property) =>
                                                property._id == e.target.value
                                            );
                                          setFilteredProperties(
                                            filteredProperties
                                          );
                                        }}
                                      >
                                        <option>Select</option>
                                        {propertyList.map((property) => (
                                          <option value={property._id}>
                                            {property.title}
                                          </option>
                                        ))}
                                      </select> */}
                                    </div>
                                  </div>
                                  {/* <div className="col-md-6">
                            <div className="mb-3">
                                  <Label className="form-label" htmlFor="formrow-category-input">Category Name</Label>
                                  <Input type="text" className="form-control" id="formrow-category-input" />
                            </div>
                          </div> */}

                          <div className="col-md-6">
                                    <div className="mb-3">
                                      <Label
                                        className="form-label"
                                        htmlFor="formrow-email-input"
                                      >
                                        Email *
                                      </Label>
                                      <Input
                                        // onChange={(e) => {
                                        //   setManagerEmail(e.target.value);
                                        // }}
                                        type="text"
                                        className="form-control"
                                        id="formrow-email-input"
                                      />
                                      {/* {check_email ? (
                                        ""
                                      ) : (
                                        <Label style={{ color: "red" }}>
                                          {msg_error4}
                                        </Label>
                                      )} */}
                                    </div>
                                  </div>
                                  <div className="col-md-6">
                                    <div className="mb-3">
                                      <Label
                                        className="form-label"
                                        htmlFor="formrow-phone-input"
                                      >
                                        Mobile *
                                      </Label>
                                      <Input
                                        // onChange={(e) => {
                                        //   setManagerPhone(e.target.value);
                                        // }}
                                        type="number"
                                        onWheel={(e) => e.target.blur()}
                                        className="form-control"
                                        id="formrow-phone-input"
                                      />
                                      {/* {check_mobile ? (
                                        ""
                                      ) : (
                                        <Label style={{ color: "red" }}>
                                          {msg_error5}
                                        </Label>
                                      )} */}
                                    </div>
                                  </div>
                                  <div className="col-md-6">
                                    <div className="mb-3">
                                      <Label className="form-Label">
                                        Status *
                                      </Label>
                                      <select
                                        // onChange={(e) => {
                                        //   setManagerStatus(e.target.value);
                                        // }}
                                        className="form-select"
                                      >
                                        <option>Select</option>
                                        <option>Active</option>
                                        <option>In-active</option>
                                      </select>
                                      {/* {check_status ? (
                                        ""
                                      ) : (
                                        <Label style={{ color: "red" }}>
                                          {msg_error6}
                                        </Label>
                                      )} */}
                                    </div>
                                  </div>
                                  <div className="col-md-6">
                                    <div className="mb-3">
                                      <Label
                                        className="form-label"
                                        htmlFor="formrow-facility-input"
                                      >
                                        Time Zone *
                                      </Label>
                                      <select
                                        // onChange={(e) => {
                                        //   setManagerTimezone(e.target.value);
                                        // }}
                                        className="form-select"
                                      >
                                        <option>Select</option>
                                        <option>CA/Newfoundland</option>
                                        <option>CA/Atlantic</option>
                                        <option>CA/Central</option>
                                        <option>CA/Eastern</option>
                                        <option>CA/Mountain</option>
                                        <option>CA/Pacific</option>
                                      </select>
                                      {/* {check_time ? (
                                        ""
                                      ) : (
                                        <Label style={{ color: "red" }}>
                                          {msg_error7}
                                        </Label>
                                      )} */}
                                    </div>
                                  </div>
                                  <div className="col-md-6">
                                    <div className="mb-3">
                                      <Label
                                        className="form-label"
                                        htmlFor="formrow-facility-input"
                                      >
                                        Privilege *
                                      </Label>
                                      <br />
                                      <Input type="checkbox" 
                                      // value={applicationPrivilege} 
                                      // onChange={(e) => { setApplicationPrivilege(!applicationPrivilege) }}
                                       />{' '}
                                      Application {' '}
                                      <Input type="checkbox" 
                                      // value={ticketPrivilege} 
                                      // onChange={(e) => { setTicketPrivilege(!ticketPrivilege) }} 

                                      />{' '}
                                      Ticket
                                      {/* <AvCheckbox label={"Ticket"} />
                                      <AvCheckbox label={"Application"} /> */}


                                    </div>
                                  </div>
                                  <div className="col-md-12">
                                    <div className="mb-3">
                                      {/* 
                                        <label
                                          htmlFor="choices-multiple-default"
                                          className="form-label font-size-13 text-muted"
                                        >
                                          Manager
                                        </label>
                                        */}
                                      <div class="add-man-slct">
                                        <div className="add-man-btn">
                                          {/* <Select 
                                              defaultValue={[optionMulti[1]]}
                                              isMulti
                                              options={optionMulti}
                                              className="basic-multi-select"
                                              classNamePrefix="select"
                                        /> */}
                                        </div>
                                        <div class="add-man">
                                          {/*<button
                                              type="button"
                                              onClick={() => {
                                                tog_large1();
                                              }}
                                              className="btn btn-soft-success waves-effect waves-light"
                                              data-toggle="modal"
                                              data-target=".bs-example-modal-lg"
                                            >
                                              <i className="bx bx-plus"></i>
                                            </button>*/}
                                          <Modal
                                            size="lg"
                                            isOpen={modal_large1}
                                            toggle={() => {
                                              tog_large1();
                                            }}
                                          >
                                            <div className="modal-header">
                                              <h5
                                                className="modal-title mt-0"
                                                id="myLargeModalLabel"
                                              >
                                                Add Property Manager
                                              </h5>
                                              <button
                                                onClick={() => {
                                                  setmodal_large1(false);
                                                }}
                                                type="button"
                                                className="close"
                                                data-dismiss="modal"
                                                aria-label="Close"
                                              >
                                                <span aria-hidden="true">
                                                  &times;
                                                </span>
                                              </button>
                                            </div>
                                            {/* <div className="modal-body">
                                              <Form>
                                                <div className="row align-items-center">
                                                  <div className="col-md-6">
                                                    <div className="mb-3">
                                                      <Label
                                                        className="form-label"
                                                        htmlFor="formrow-facility-input"
                                                      >
                                                        Manager Name
                                                      </Label>
                                                      <Input
                                                        type="text"
                                                        className="form-control"
                                                        id="formrow-phone-input"
                                                      />
                                                    </div>
                                                  </div>
                                                  <div className="col-md-6">
                                                    <div className="mb-3">
                                                      <Label
                                                        className="form-label"
                                                        htmlFor="formrow-facility-input"
                                                      >
                                                        Property Type
                                                      </Label>
                                                      <select className="form-select">
                                                        <option>Select</option>
                                                        <option>
                                                          Category 1
                                                        </option>
                                                        <option>
                                                          Category 2
                                                        </option>
                                                        <option>
                                                          Category 3
                                                        </option>
                                                        <option>
                                                          Category 4
                                                        </option>
                                                        <option>
                                                          Category 5
                                                        </option>
                                                      </select>
                                                    </div>
                                                  </div>
                                                  <div className="col-md-6">
                                                    <div className="mb-3">
                                                      <Label
                                                        className="form-label"
                                                        htmlFor="formrow-facility-input"
                                                      >
                                                        Property Name
                                                      </Label>
                                                      <select className="form-select">
                                                        <option>Select</option>
                                                        <option>
                                                          Property Name 1
                                                        </option>
                                                        <option>
                                                          Property Name 2
                                                        </option>
                                                        <option>
                                                          Property Name 3
                                                        </option>
                                                        <option>
                                                          Property Name 4
                                                        </option>
                                                        <option>
                                                          Property Name 5
                                                        </option>
                                                        <option>
                                                          Property Name 6
                                                        </option>
                                                      </select>
                                                    </div>
                                                  </div>
                                                  <div className="col-md-6">
                                                    <div className="mb-3">
                                                      <Label
                                                        className="form-label"
                                                        htmlFor="formrow-email-input"
                                                      >
                                                        Email
                                                      </Label>
                                                      <Input
                                                        type="text"
                                                        className="form-control"
                                                        id="formrow-email-input"
                                                      />
                                                    </div>
                                                  </div>
                                                  <div className="col-md-6">
                                                    <div className="mb-3">
                                                      <Label
                                                        className="form-label"
                                                        htmlFor="formrow-phone-input"
                                                      >
                                                        Mobile
                                                      </Label>
                                                      <Input
                                                        type="text"
                                                        className="form-control"
                                                        id="formrow-phone-input"
                                                      />
                                                    </div>
                                                  </div>
                                                  <div className="col-md-6">
                                                    <div className="mb-3">
                                                      <Label className="form-Label">
                                                        Status
                                                      </Label>
                                                      <select className="form-select">
                                                        <option>Select</option>
                                                        <option>Active</option>
                                                        <option>
                                                          In-active
                                                        </option>
                                                      </select>
                                                    </div>
                                                  </div>
                                                  <div className="col-md-6">
                                                    <div className="mb-3">
                                                      <Label
                                                        className="form-label"
                                                        htmlFor="formrow-facility-input"
                                                      >
                                                        Time Zone
                                                      </Label>
                                                      <select className="form-select">
                                                        <option>Select</option>
                                                        <option>
                                                          US/Samoa
                                                        </option>
                                                        <option>
                                                          US/Hawaii
                                                        </option>
                                                        <option>
                                                          US/Alaska
                                                        </option>
                                                        <option>
                                                          US/Pacific
                                                        </option>
                                                        <option>
                                                          US/Mountain
                                                        </option>
                                                      </select>
                                                    </div>
                                                  </div>
                                                  <div className="col-md-12">
                                                    <div className="mb-3">
                                                      <label
                                                        htmlFor="choices-multiple-default"
                                                        className="form-label font-size-13 text-muted"
                                                      >
                                                        Assign Company
                                                      </label>
                                                      <Select
                                                        defaultValue={[
                                                          optionMulti[1],
                                                        ]}
                                                        isMulti
                                                        options={optionMulti}
                                                        className="basic-multi-select"
                                                        classNamePrefix="select"
                                                      />
                                                    </div>
                                                  </div>
                                                  <div className="col-md-12">
                                                    <div className="mb-3">
                                                      <Label
                                                        className="form-label"
                                                        htmlFor="formrow-firstname-input"
                                                      >
                                                        Documents
                                                      </Label>
                                                      <Dropzone
                                                        onDrop={(
                                                          acceptedFiles
                                                        ) => {
                                                          handleAcceptedFiles(
                                                            acceptedFiles
                                                          );
                                                        }}
                                                      >
                                                        {({
                                                          getRootProps,
                                                          getInputProps,
                                                        }) => (
                                                          <div className="dropzone">
                                                            <div
                                                              className="dz-message needsclick mt-2"
                                                              {...getRootProps()}
                                                            >
                                                              <input
                                                                {...getInputProps()}
                                                              />
                                                              <div className="mb-3">
                                                                <i className="display-4 text-muted bx bxs-cloud-upload" />
                                                              </div>
                                                              <h4>
                                                                Drop files here
                                                                or click to
                                                                upload.
                                                              </h4>
                                                            </div>
                                                          </div>
                                                        )}
                                                      </Dropzone>

                                                      <div
                                                        className="dropzone-previews mt-3"
                                                        id="file-previews"
                                                      >
                                                        {selectedFiles.map(
                                                          (f, i) => {
                                                            return (
                                                              <Card
                                                                className="mt-1 mb-0 shadow-none border dz-processing dz-image-preview dz-success dz-complete"
                                                                key={
                                                                  i + "-file"
                                                                }
                                                              >
                                                                <div className="p-2">
                                                                  <Row className="align-items-center">
                                                                    <Col className="col-auto">
                                                                      <img
                                                                        data-dz-thumbnail=""
                                                                        height="80"
                                                                        className="avatar-sm rounded bg-light"
                                                                        alt={
                                                                          f.name
                                                                        }
                                                                        src={
                                                                          f.preview
                                                                        }
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
                                                                        <strong>
                                                                          {
                                                                            f.formattedSize
                                                                          }
                                                                        </strong>
                                                                      </p>
                                                                    </Col>
                                                                    <Col className="trash-btn">
                                                                      <button
                                                                        type="button"
                                                                        className="btn btn-soft-danger waves-effect waves-light"
                                                                      >
                                                                        <i className="bx bx-trash-alt"></i>
                                                                      </button>
                                                                    </Col>
                                                                  </Row>
                                                                </div>
                                                              </Card>
                                                            );
                                                          }
                                                        )}
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
                                            </div> */}
                                          </Modal>
                                        </div>
                                      </div>
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
                                              <h4>
                                                Drop files here or click to
                                                upload.
                                              </h4>
                                            </div>
                                          </div>
                                        )}
                                      </Dropzone> 
                                      <div
                                        className="dropzone-previews mt-3"
                                        id="file-previews"
                                      >
                                        {/* {selectedFiles.map((f, i) => {
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
                                                      <strong>
                                                        {f.formattedSize}
                                                      </strong>
                                                    </p>
                                                  </Col>
                                                  <Col className="trash-btn">
                                                    <button
                                                      type="button"
                                                      className="btn btn-soft-danger waves-effect waves-light"
                                                      href="javascript:void(0)"
                                                      onClick={() =>
                                                        deleteDocument(i)
                                                      }
                                                    >
                                                      <i className="bx bx-trash-alt"></i>
                                                    </button>
                                                  </Col>
                                                </Row>



                                              </div>
                                            </Card>
                                          );
                                        })} */}
                                      </div>
                                      {/* {check_document ? (
                                        ""
                                      ) : (
                                        <Label style={{ color: "red" }}>
                                          {msg_error1}
                                        </Label>
                                      )} */}
                                    </div>
                                  </div>
                                  <div className="col-md-12">
                                    <div className="text-end">
                                      <button
                                        type="submit"
                                        className="btn btn-success save-user"
                                      >
                                        Save
                                        <i id="nexticon" className="bx bx-chevron-right ms-1"></i>

                                        <div
                                          id="saveSpinner"
                                          style={{
                                            display: "none",
                                            height: "15px",
                                            width: "15px",
                                            marginLeft: "5px",
                                          }}
                                          className="spinner-border"
                                          role="status"
                                        ></div>

                                        <i
                                          id="failedSaveErrorIcon"
                                          style={{
                                            display: "none",
                                            marginLeft: "5px",
                                          }}
                                          className="fa fa-exclamation-triangle"
                                          aria-hidden="true"
                                        ></i>

                                      </button>
                                    </div>
                                  </div>
                                </div>
                              </Form>
                            </div>
                          </Modal>
    </tr>
  )
}
