import React, { useEffect, useState } from "react";
import MetaTags from "react-meta-tags";
import CreatableSelect from "react-select/creatable";
import { Link } from "react-router-dom";
import axios from "../api/axios";
import jwt_decode from "jwt-decode";
import { CopyToClipboard } from "react-copy-to-clipboard";


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
  Input,
} from "reactstrap";
import Dropzone from "react-dropzone";
//Import Breadcrumb
import Breadcrumbs from "../../components/Common/Breadcrumb";
import img4 from "../../assets/images/small/img-4.jpg";

const AddRequestType = () => {
  // USE ROLE
  const decode = jwt_decode(window.localStorage.accessToken);
  //ENDPOINTS
  const GET_COMPANIES_URL = "/company";
  const ADD_PROPERTY_URL = "/layout/add";
  const POST_IMAGE_URL = "/property1/img";

  // for populating dropdowns
  const [companyList, setCompanyList] = useState([]);
  const [companyOwner, setCompanyOwner] = useState([]);
  // const [copied, setcopied] = useState(false);


  //  database
  const [toallayout, settoallayout] = useState(0);
  const [title, setTitle] = useState("");

  const [loading, setLoading] = useState(false);
  const [selectedId, setSelectedId] = useState("");
  const [isEdit, setIsEdit] = useState(false);
  const [newRequestType, setNewRequestType] = useState("");
  const [requestTypes, setRequestTypes] = useState([]);

  const [category, setCategory] = useState([]);
  const [location, setLocation] = useState("");
  const [status, setStatus] = useState("");

  // TOOD working today
  const [managers, setManagers] = useState({});
  const [documents, setDocuments] = useState([]);
  // const [url, setUrl] = useState("")

  const createOption = (label) => ({
    label,
    value: label,
  });
  const defaultOptions = [
    createOption("Air Condition"),
    createOption("Appliance"),
    createOption("Clean Up/Spill"),
    createOption("Electrical Issue"),
    createOption("Elevator"),
    createOption("General Maintenance"),
    createOption("Heating"),
    createOption("Landscape"),
    createOption("Light"),
    createOption("Painting/Touch Ups"),
    createOption("Pest Control"),
    createOption("Plumbing"),
    createOption("Smoke Detector"),
    createOption("Snow Removal"),
  ];

  const [reqestTypes, setReqestTypes] = useState(defaultOptions);
  const [createLoadings, setCreateLoadings] = useState(false);


  const handleCreate = (inputValue) => {
    setCreateLoadings(true);
    setTimeout(() => {
      const newOption = createOption(inputValue);
      setCreateLoadings(false);
      setReqestTypes((prev) => [...prev, newOption]);
      setNewRequestType(newOption);
    }, 1000);
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

  async function addRquestType(event) {
    event.preventDefault();

    if (newRequestType == "") {
      setshowError(true);
    } else {
      setshowError(false);
    }
    if (newRequestType != "") {
      //alert("dhd");
      // Getting company information from local storage
      try {
        const response = await axios.post("requesttype/addrequesttype", {
          company_id: decode.id,
          request_type: newRequestType?.value,
        });

        if (response.data.status === 200) {
          getRequestTypes();
          setIsEdit(false);
          setNewRequestType("");
          tog_large();
        }
      } catch (error) {
        console.log(error); // TODO Proper Error
      }
    }
  }

  async function editRquestType(event) {
    event.preventDefault();

    if (newRequestType == "") {
      setshowError(true);
    } else {
      setshowError(false);
    }
    if (newRequestType != "") {
      //alert("dhd");
      // Getting company information from local storage
      try {
        const response = await axios.post("requesttype/editrequesttype", {
          id: selectedId,
          request_type: newRequestType?.value,
        });

        if (response.data.status === 200) {
          getRequestTypes();
          setIsEdit(false);
          setNewRequestType("");
          tog_large();
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

  const getRequestTypes = async () => {
    try {
      const response = await axios.post("requesttype/getrequest", {
        company_id: decode.id,
      });
      console.log(response.data.requestType);
      if (response.data.requestType) {
        const temp = response.data.requestType.reverse();
        setRequestTypes(temp);
      }
    } catch (error) {
      console.log(error);
    }
  };

  async function deleteRequestTypes(requestTypeID) {
    if (window.confirm("Are you sure?")) {
      try {
        const response = await axios.post(`requesttype/delete`, {
          id: requestTypeID,
        });
        if (response.data.status === 200) {
          getRequestTypes();
        }
      } catch (error) {
        // visible error
        console.log(error);
      }
    }
  }

  // const getCompanyUrl = async () => {
  //   try {
  //     let response = await axios.get(`company/get-url/?company_id=${decode.id}&role=${decode.role}`
  //     );
  //     console.log(response.data, 'datata')

  //     if (response.data.status == 200) {
  //       console.log(response.data.data, 'datata')
  //       const url =
  //         window.location.protocol +
  //         "//" +
  //         window.location.host +
  //         "/maintenance-request/" +
  //         response.data.data;
  //       setUrl(url);
  //     }
  //   } catch (error) {
  //     console.log(error); // TODO proper error
  //   }
  // };


  useEffect(() => {
    getRequestTypes();
    // getCompanyUrl();
  }, []);

  return (
    <React.Fragment>
      <div className="page-content">
        <MetaTags>
          <title>Rentdigicare | Request Types </title>
        </MetaTags>
        {/* <div className="col-md-12  mb-3">
          {!["vendor", "technical staff"].includes(decode.role) && (
            <CopyToClipboard
              text={url}
              onCopy={() => {
                  setcopied(true);
              }}
            >
              <button
                style={{
                  border: "0px",
                  borderRadius: "4px",
                  color: "white",
                  backgroundColor: "#0e578e",
                }}
                onClick={(e) => {
                  e.preventDefault();
                    navigator.clipboard.writeText(url);
                 
                }}
              >
                Copy Maintenance Link
              </button>
            </CopyToClipboard>
          )}
          {copied ? (
            <span
              style={{
                color: "white",
                backgroundColor: "black",
                marginLeft: "4px",
                borderRadius: "5px",
              }}
            >
              Copied.
            </span>
          ) : null}
        </div> */}
        <div className="container-fluid">
          <Breadcrumbs title="Home" breadcrumbItem="Request Type" />
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
                              ({requestTypes.length})
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
                                setNewRequestType("");
                                setIsEdit(false);
                                tog_large();
                                // await getCompanies();
                              }}
                              className="btn btn-light "
                              data-toggle="modal"
                              data-target=".bs-example-modal-lg"
                            >
                              <i className="bx bx-plus me-1"></i> Add Request
                              Type
                            </button>
                          ) : (
                            <></>
                          )}
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
                          <th scope="col">Title</th>

                          <th scope="col">Action</th>
                        </tr>
                      </thead>
                      <tbody>
                        {requestTypes.map((item, i) => {
                          return (
                            <tr>
                              <td>{i + 1}</td>
                              <td>{item.request_type}</td>

                              <td>
                                <div className="d-flex gap-3">
                                  <Link className="text-success" to="#">
                                    <i
                                      className="mdi mdi-pencil font-size-18"
                                      id="edittooltip"
                                      onClick={() => {
                                        setIsEdit(true);
                                        setSelectedId(item._id);
                                        setNewRequestType(item.request_type);
                                        tog_large();
                                      }}
                                      data-toggle="modal"
                                      data-target=".bs-example-modal-lg"
                                    ></i>
                                  </Link>
                                  <Link className="text-danger" to="#">
                                    <i
                                      className="mdi mdi-delete font-size-18"
                                      id="deletetooltip"
                                      onClick={async (e) => {
                                        e.preventDefault();
                                        await deleteRequestTypes(item._id);
                                      }}
                                    ></i>
                                  </Link>
                                </div>
                              </td>
                            </tr>
                          );
                        })}

                        {/* <LayoutList toall={settoallayout} /> */}
                      </tbody>
                    </Table>
                  </div>
                </CardBody>
              </Card>
            </Col>
          </Row>
          <Modal
            size="lg"
            isOpen={modal_large}
            toggle={() => {
              tog_large();
            }}
          >
            <div className="modal-header">
              <h5 className="modal-title mt-0" id="myLargeModalLabel">
                {isEdit ? "Edit Request Type" : "Add Request Type"}
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
              <Form onSubmit={isEdit ? editRquestType : addRquestType}>
                <div className="row align-items-center">
                  <div className="col-md-6">
                    <div className="mb-3">
                      <Label
                        className="form-label"
                        htmlFor="formrow-title-input"
                      >
                        Request Type *
                      </Label>
                      {/* <Input
                                                onChange={(e) => {
                                                    setNewRequestType(e.target.value);
                                                }}
                                                type="text"
                                                className="form-control"
                                                id="formrow-name-input"
                                                value={newRequestType}
                                            /> */}
                      {/* <CreatableSelect
                        // value={newRequestType}
                        options={reqestTypes}
                        placeholder="Search by type..."
                        isClearable
                        //   onChange={(e) => {
                        //   setNewRequestType(e);
                        //   }}
                      /> */}
                      <CreatableSelect
                        isClearable
                        isDisabled={createLoadings}
                        isLoading={createLoadings}
                        onChange={(newValue) => setNewRequestType(newValue)}
                        onCreateOption={handleCreate}
                        options={reqestTypes}
                        value={newRequestType}
                      />
                      {showError ? (
                        <h6 style={{ color: "red" }}>Cannot be empty</h6>
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
    </React.Fragment>
  );
};

export default AddRequestType;
