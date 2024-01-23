import React, { useState } from "react";
import MetaTags from "react-meta-tags";
import Select from "react-select";
import { Link } from "react-router-dom";
import axios from "../api/axios";
import jwt_decode from "jwt-decode";

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
  Pagination,
  PaginationItem,
  PaginationLink,
  Input,
} from "reactstrap";
import Dropzone from "react-dropzone";
//Import Breadcrumb
import Breadcrumbs from "../../components/Common/Breadcrumb";
import img4 from "../../assets/images/small/img-4.jpg";

// Importing Components
import LayoutList from "./LayoutList";

const AddProperty = () => {
  // USE ROLE
  const decode = jwt_decode(window.localStorage.accessToken);
  const [pageLimit, setPageLimit] = useState(10);
  //ENDPOINTS
  const GET_COMPANIES_URL = "/company";
  const ADD_PROPERTY_URL = "/layout/add";
  const POST_IMAGE_URL = "/property1/img";

  // for populating dropdowns
  const [companyList, setCompanyList] = useState([]);
  const [companyOwner, setCompanyOwner] = useState([]);

  //  database
  const [toallayout, settoallayout] = useState(0);
  const [title, setTitle] = useState("");
  const [category, setCategory] = useState([]);
  const [location, setLocation] = useState("");
  const [status, setStatus] = useState("");

  // TOOD working today
  const [managers, setManagers] = useState({});
  const [documents, setDocuments] = useState([]);
  const [startPage, setStartPage] = useState(1);
  const [currentPage, setCurrentPage] = useState(1);
  const pageTotal = Math.ceil(toallayout / pageLimit);

  const handlePageChange = (page) => {
    setCurrentPage(page);

    if (page > startPage + pageLimit - 1 || page < startPage) {
      setStartPage(Math.max(1, page - pageLimit / 2));
    }
  };
  // under work
  async function getCompanies() {
    try {
      const response = await axios.get(GET_COMPANIES_URL);
      setCompanyList(response.data.companies);
    } catch (error) {
      // TODO proper error message
      console.log(error);
    }
    console.log(companyList);
  }

  async function addProperty(event) {
    event.preventDefault();

    if (title == "") {
      setshowError(true);
    } else {
      setshowError(false);
    }
    if (title != "") {
      //alert("dhd");
      // Getting company information from local storage
      const decode = jwt_decode(window.localStorage.getItem("accessToken"));
      try {
        const response = await axios.post(ADD_PROPERTY_URL, {
          layoutName: title,
          layoutOf: decode.id,
        });

        if (response.data.status === 201) {
          await uploadDocuments(response.data.id);
          window.location.replace("/property_layout");
        }
      } catch (error) {
        console.log(error); // TODO Proper Error
      }
    }
  }

  const optionMulti = [
    { label: "Manager", value: "Manager" },
    { label: "Manager 1", value: "Manager 1" },
    { label: "Manager 2", value: "Manager 2" },
  ];

  const layoutsMulti = [
    { label: "1 Bedroom 1 Bath", value: "1 Bedroom 1 Bath" },
    { label: "2 Bedroom 1 Bath", value: "2 Bedroom 1 Bath" },
    { label: "2 Bedroom 2 Bath", value: "2 Bedroom 2 Bath" },
    {
      label: "1 Bedroom 1 Bath Fully Furnished",
      value: "1 Bedroom 1 Bath Fully Furnished",
    },
    {
      label: "2 Bedroom 2 Bath Fully Furnished",
      value: "2 Bedroom 2 Bath Fully Furnished",
    },
  ];
  const [modal_large, setmodal_large] = useState(false);
  const [modal_large1, setmodal_large1] = useState(false);
  const [modal_large2, setmodal_large2] = useState(false);

  const [showError, setshowError] = useState(false);

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

  const [col5, setcol5] = useState(false);
  const t_col5 = () => {
    setcol5(!col5);
  };

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

  /**
   * Formats the size
   */
  function formatBytes(bytes, decimals = 2) {
    if (bytes === 0) return "0 Bytes";
    const k = 1024;
    const dm = decimals < 0 ? 0 : decimals;
    const sizes = ["Bytes", "KB", "MB", "GB", "TB", "PB", "EB", "ZB", "YB"];

    const i = Math.floor(Math.log(bytes) / Math.log(k));
    return parseFloat((bytes / Math.pow(k, i)).toFixed(dm)) + " " + sizes[i];
  }

  async function uploadDocuments(propertyID) {
    const formData = new FormData();
    var i = 0;
    while (i < selectedFiles.length) {
      formData.append(`file`, selectedFiles[i]);
      i++;
    }

    const config = {
      headers: {
        "content-type": "multipart/form-data",
        id: `${propertyID}`,
      },
    };

    try {
      const response = await axios.post(
        "/property/upload-documents",
        formData,
        config
      );
    } catch (error) {
      console.log(error);
    }
  }

  return (
    <React.Fragment>
      <div className="page-content">
        <MetaTags>
          <title>Rentdigicare | Property Layout </title>
        </MetaTags>
        <div className="container-fluid">
          <Breadcrumbs title="Home" breadcrumbItem="Property Layout" />
          <Row>
            <Col xl={12}>
              <Card>
                {
                  <CardHeader>
                    <div className="row align-items-center">
                      <div className="col-md-6">
                        <div className="mb">
                          <h5 className="card-title">
                            Total
                            <span className="text-muted fw-normal ms-2">
                              ({toallayout})
                            </span>
                          </h5>
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
                          </button> */}
                          {!(
                            decode.role === "manager" || decode.role === "admin"
                          ) ? (
                            <button
                              type="button"
                              onClick={async () => {
                                tog_large();
                                await getCompanies();
                              }}
                              className="btn btn-light "
                              data-toggle="modal"
                              data-target=".bs-example-modal-lg"
                            >
                              <i className="bx bx-plus me-1"></i> Add Layout
                            </button>
                          ) : (
                            <></>
                          )}
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
                                Add Layout
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
                              <Form onSubmit={addProperty}>
                                <div className="row align-items-center">
                                  <div className="col-md-6">
                                    <div className="mb-3">
                                      <Label
                                        className="form-label"
                                        htmlFor="formrow-title-input"
                                      >
                                        Layout Name *
                                      </Label>
                                      <Input
                                        onChange={(e) => {
                                          setTitle(e.target.value);
                                        }}
                                        type="text"
                                        className="form-control"
                                        id="formrow-name-input"
                                      />
                                      {showError ? (
                                        <h6 style={{ color: "red" }}>
                                          Layout Name is required!
                                        </h6>
                                      ) : (
                                        ""
                                      )}
                                    </div>
                                  </div>

                                  {/* <div className="col-md-6">
                            <div className="mb-3">
                                  <Label className="form-label" htmlFor="formrow-category-input">Category Name</Label>
                                  <Input type="text" className="form-control" id="formrow-category-input" />
                            </div>
                          </div> */}

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
                                            <div className="modal-body">
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
                                                  {/* <div className="col-md-12">
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
                                                  </div> */}
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
                                  </div>
                                  {/* <div className="col-md-12">
                                    <div className="mb-3">
                                      <Label
                                        className="form-label"
                                        htmlFor="formrow-firstname-input"
                                      >
                                        Documents
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
                                                      <strong>
                                                        {f.formattedSize}
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
                                        })}
                                      </div>
                                    </div>
                                  </div> */}
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
                                        <Label className="form-Label">
                                          Property Name
                                        </Label>
                                        <select className="form-select">
                                          <option>Select One</option>
                                          <option>Exotic Grandeur</option>
                                          <option>Vaneet Sunview</option>
                                          <option>Vera Gold Mark</option>
                                          <option>Sushma Valencia</option>
                                        </select>
                                      </div>
                                    </div>
                                    <div className="col-md-4">
                                      <div className="mb-3">
                                        <Label className="form-Label">
                                          Company Name
                                        </Label>
                                        <select className="form-select">
                                          <option>Select One</option>
                                          <option>Rentdigi</option>
                                          <option>GSK</option>
                                          <option>
                                            Chappelle Garden Villas
                                          </option>
                                          <option>Riverside Villas</option>
                                        </select>
                                      </div>
                                    </div>
                                    <div className="col-md-4">
                                      <div className="mb-3">
                                        <Label className="form-Label">
                                          Property Manager
                                        </Label>
                                        <select className="form-select">
                                          <option>Select One</option>
                                          <option>Danish Sharma</option>
                                          <option>John Doe</option>
                                          <option>Jameson</option>
                                          <option>Rock</option>
                                        </select>
                                      </div>
                                    </div>
                                    <div className="col-md-12">
                                      <div className="srch-btn">
                                        <button
                                          type="submit"
                                          className="btn btn-primary"
                                        >
                                          Search
                                        </button>
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
                }
                <CardBody>
                  <div className="table-responsive">
                    <Table className="table-striped table-bordered mb-0">
                      <thead>
                        <tr>
                          <th scope="col">#</th>
                          <th scope="col">Layout Name</th>

                          <th scope="col">Action</th>
                        </tr>
                      </thead>
                      <tbody>
                        <LayoutList
                          currentPage={currentPage}
                          toall={settoallayout}
                        />
                      </tbody>
                    </Table>
                  </div>
                  <Row className="proress-style mt-3">
                    <Col xl={3}></Col>
                    <Col xl={9}>
                      <div className="pagination-bar">
                        <Pagination>
                          <PaginationItem disabled={currentPage === 1}>
                            <PaginationLink
                              first
                              onClick={() => handlePageChange(1)}
                            />
                          </PaginationItem>
                          <PaginationItem disabled={currentPage === 1}>
                            <PaginationLink
                              previous
                              onClick={() => handlePageChange(currentPage - 1)}
                            />
                          </PaginationItem>
                          {Array.from(
                            { length: pageLimit },
                            (_, i) => i + startPage
                          ).map((page) => {
                            if (page > pageTotal) return null;
                            return (
                              <PaginationItem
                                key={page}
                                active={currentPage === page}
                              >
                                <PaginationLink
                                  onClick={() => handlePageChange(page)}
                                >
                                  {page}
                                </PaginationLink>
                              </PaginationItem>
                            );
                          })}
                          <PaginationItem disabled={currentPage === pageTotal}>
                            <PaginationLink
                              next
                              onClick={() => handlePageChange(currentPage + 1)}
                            />
                          </PaginationItem>
                          <PaginationItem disabled={currentPage === pageTotal}>
                            <PaginationLink
                              last
                              onClick={() => handlePageChange(pageTotal)}
                            />
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
  );
};

export default AddProperty;
