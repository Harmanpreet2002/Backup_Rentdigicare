import React, { useEffect, useState } from "react";
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
  Input,
  Pagination,
  PaginationItem,
  PaginationLink,
} from "reactstrap";
import Dropzone from "react-dropzone";
//Import Breadcrumb
import Breadcrumbs from "../../components/Common/Breadcrumb";
import img4 from "../../assets/images/small/img-4.jpg";

const AddSpecialities = () => {
  // USE ROLE
  const decode = jwt_decode(window.localStorage.accessToken);
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

  const [loading, setLoading] = useState(false);
  const [selectedId, setSelectedId] = useState("");
  const [isEdit, setIsEdit] = useState(false);
  const [newSpeciality, setNewSpeciality] = useState("");
  const [specialities, setSpecialities] = useState([]);

  const [category, setCategory] = useState([]);
  const [location, setLocation] = useState("");
  const [status, setStatus] = useState("");
  const [page, setPage] = useState();
  // TOOD working today
  const [managers, setManagers] = useState({});
  const [documents, setDocuments] = useState([]);
  const [pageLimit, setPageLimit] = useState(10);
  const [startPage, setStartPage] = useState(1);
  const [currentPage, setCurrentPage] = useState(1);
  const pageTotal = Math.ceil(toallayout / pageLimit);

  const handlePageChange = (page) => {
    setCurrentPage(page);

    if (page > startPage + pageLimit - 1 || page < startPage) {
      setStartPage(Math.max(1, page - pageLimit / 2));
    }
  };

  async function addRquestType(event) {
    event.preventDefault();

    if (!newSpeciality) {
      return setshowError("Please enter Category");
    }
    setshowError("");

    //alert("dhd");
    // Getting company information from local storage
    try {
      const response = await axios.post("technicalStaff/add_speciality", {
        createdByCompany: decode.id,
        speciality: newSpeciality,  
      });

      if (response.data.success) {
        getSpecialities();
        setIsEdit(false);
        setNewSpeciality("");
        tog_large();
      } else {
        setshowError(response.data.errorMessage);
      }
    } catch (error) {
      setshowError("Something went wrong");
      console.log(error); // TODO Proper Error
    }
  }

  async function editSpeciality(event) {
    event.preventDefault();

    if (newSpeciality == "") {
      setshowError(true);
    } else {
      setshowError(false);
    }
    if (newSpeciality != "") {
      // Getting company information from local storage
      try {
        const response = await axios.post("technicalStaff/edit_speciality", {
          id: selectedId,
          speciality: newSpeciality,
        });

        if (response.data.success) {
          getSpecialities();
          setIsEdit(false);
          setNewSpeciality("");
          tog_large();
        }
      } catch (error) {
        console.log(error); // TODO Proper Error
      }
    }
  }

  const [modal_large, setmodal_large] = useState(false);
  const [modal_large1, setmodal_large1] = useState(false);
  const [modal_large2, setmodal_large2] = useState(false);

  const [showError, setshowError] = useState("");

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

  const getSpecialities = async () => {
    try {
      const response = await axios.post(
        `technicalStaff/get_speciality?page=${currentPage}&limit=${pageLimit}`,
        { companyId: decode.id }
      );
      console.log(response.data.specialties);
      if (response.data.specialties) {
        const temp = response.data.specialties.reverse();
        setSpecialities(temp);
        settoallayout(response.data.total);
        setPage(
          response.data.results.previous
            ? response.data.results.previous.page + 1
            : 1
        );
      }
    } catch (error) {
      console.log(error);
    }
  };

  async function deleteSpecialities(specialityID) {
    if (window.confirm("Are you sure?")) {
      try {
        const response = await axios.post(`technicalStaff/delete_speciality`, {
          id: specialityID,
        });
        if (response.data.success) {
          getSpecialities();
        }
      } catch (error) {
        // visible error
        console.log(error);
      }
    }
  }

  useEffect(() => {
    getSpecialities();
  }, [currentPage]);

  let number = 0;
  let number1 = page > 1 ? (page - 1) * 10 : 0;

  return (
    <React.Fragment>
      <div className="page-content">
        <MetaTags>
          <title>Rentdigicare | Category </title>
        </MetaTags>
        <div className="container-fluid">
          <Breadcrumbs title="Home" breadcrumbItem="Category" />
          <Row>
            <Col xl={12}>
              <Card>
                {
                  <CardHeader>
                    <div className="row align-items-center">
                      <div className="col-md-6">
                        <div className="mb">
                          <h5 className="card-title">
                            Category
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
                                setNewSpeciality("");
                                setIsEdit(false);
                                tog_large();
                                // await getCompanies();
                              }}
                              className="btn btn-light "
                              data-toggle="modal"
                              data-target=".bs-example-modal-lg"
                            >
                              <i className="bx bx-plus me-1"></i> Add Category
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
                        {specialities.map((item, i) => {
                          number++;
                          return (
                            <tr>
                              <td>{number + number1}</td>
                              <td>{item.speciality}</td>

                              <td>
                                <div className="d-flex gap-3">
                                  <Link className="text-success" to="#">
                                    <i
                                      className="mdi mdi-pencil font-size-18"
                                      id="edittooltip"
                                      onClick={() => {
                                        setIsEdit(true);
                                        setSelectedId(item._id);
                                        setNewSpeciality(item.speciality);
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
                                        await deleteSpecialities(item._id);
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
          <Modal
            size="lg"
            isOpen={modal_large}
            toggle={() => {
              tog_large();
            }}
          >
            <div className="modal-header">
              <h5 className="modal-title mt-0" id="myLargeModalLabel">
                {isEdit ? "Edit Category" : "Add Category"}
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
              <Form onSubmit={isEdit ? editSpeciality : addRquestType}>
                <div className="row align-items-center">
                  <div className="col-md-6">
                    <div className="mb-3">
                      {showError && (
                        <h6 style={{ color: "red" }}>{showError}</h6>
                      )}

                      <Label
                        className="form-label"
                        htmlFor="formrow-title-input"
                      >
                        Category *
                      </Label>
                      <Input
                        onChange={(e) => {
                          setNewSpeciality(e.target.value);
                        }}
                        type="text"
                        className="form-control"
                        id="formrow-name-input"
                        value={newSpeciality}
                      />
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

export default AddSpecialities;
