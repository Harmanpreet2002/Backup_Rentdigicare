import React, { useEffect, useState, useMemo } from "react";
import { Link } from "react-router-dom";
import MetaTags from "react-meta-tags";
import {
  Card,
  CardBody,
  Col,
  Container,
  Row,
  Modal,
  Label,
  Table,
  Nav,
  NavItem,
  NavLink,
  DropdownItem,
  UncontrolledDropdown,
  DropdownToggle,
  Input,
  ModalFooter,
  ModalBody,
  Button,
  ModalHeader,
} from "reactstrap";

import { getInvoices as onGetInvoices } from "../../store/actions";
import Breadcrumbs from "../../components/Common/Breadcrumb";

import paginationFactory, {
  PaginationListStandalone,
  PaginationProvider,
} from "react-bootstrap-table2-paginator";
import BootstrapTable from "react-bootstrap-table-next";
import jwt_decode from "jwt-decode";
import axios from "../api/axios";
import debouce from "lodash.debounce";

//redux
import { useSelector, useDispatch } from "react-redux";
import { toast } from "react-toastify";

const VendorSpecialty = () => {
  const dispatch = useDispatch();
  const [searchVendor, setSearchVendor] = useState("");
  const decode = jwt_decode(window.localStorage.getItem("accessToken"));

  const ADD_SPECIALTY = "/vendorspeciality/add_speciality";
  const GET_SPECIALTY = `/vendorspeciality/get_speciality?searchVendor=${searchVendor}&companyId=${decode.id}`;
  const EDIT_SPECIALTY = "/vendorspeciality/edit_speciality";
  const DELETE_SPECIALTY = `/vendorspeciality/delete_speciality`;

  const [specialtyModel, setSpecialtyModel] = useState(false);
  const [isEdit, setIsEdit] = useState(false);
  const [loading, setLoading] = useState(false);
  const [Id, setId] = useState("");
  const [newspecialty, setNewSpecialty] = useState("");
  const [specialtyError, setSpecialtyError] = useState("");
  const [specialties, setSpecialties] = useState([]);
  const [showDeleteDialoge, setShowDeleteDialoge] = useState(false);

  const handleChange = (e) => {
    setSearchVendor(e.target.value);
  };

  const debouncedResults = useMemo(() => {
    return debouce(handleChange, 300);
  }, []);

  useEffect(() => {
    return () => {
      debouncedResults.cancel();
    };
  });
  function tog_view() {
    setSpecialtyModel(!specialtyModel);
  }

  const addSpeciality = async (e) => {
    if (!newspecialty) {
      return setSpecialtyError("Please enter Specialty");
    }
    setLoading(true);

    setSpecialtyError("");
    try {
      const response = await axios.post(ADD_SPECIALTY, {
        specialty: newspecialty,
        createdBy: decode.id,
      });

      if (response.data.success) {
        tog_view();
        setNewSpecialty("")
        getSpeciality();
      } else {
        setSpecialtyError(response.data.errorMessage);
      }

      setLoading(false);
    } catch (error) {
      setSpecialtyError("Something went wrong");
      setLoading(false);

      console.log(error); // TODO proper error
    }
  };

  const getSpeciality = async (e) => {
    try {
      const response = await axios.get(GET_SPECIALTY);

      console.log("response", response);

      if (response.data.success) {
        setSpecialties(response.data.specialties);
      } else {
        setSpecialtyError(response.data.errorMessage);
      }
    } catch (error) {
      setSpecialtyError("Something went wrong");

      console.log(error); // TODO proper error
    }
  };

  async function editSpeciality(event) {
    event.preventDefault();

    if (!newspecialty) {
      return setSpecialtyError("Please enter Specialty");
    }
    setLoading(true);

    setSpecialtyError("");
    try {
      const response = await axios.post(EDIT_SPECIALTY, {
        id: Id,
        speciality: newspecialty,
      });

      if (response.data.success) {
        tog_view();
        setNewSpecialty("")
        getSpeciality();
      } else {
        setSpecialtyError(response.data.errorMessage);
      }

      setLoading(false);
    } catch (error) {
      setSpecialtyError("Something went wrong");
      setLoading(false);

      console.log(error); // TODO proper error
    }
  }

  async function deleteSpecialities() {
    try {
      const response = await axios.delete(`${DELETE_SPECIALTY}?id=${Id}`);
      if (response.data.success) {
        getSpeciality();
      }

      if (response.data.success) {
        setId("");
        setShowDeleteDialoge(false);
        toast.success(response.data.message);
      } else {
        toast.warning(response.data.message);
      }
    } catch (error) {
      // visible error
      console.log(error);
    }
  }

  const { invoices } = useSelector((state) => ({
    invoices: state.invoices.invoices,
  }));

  useEffect(() => {
    // dispatch(onGetInvoices());
    getSpeciality();
  }, [searchVendor]);

  const pageOptions = {
    sizePerPage: 7,
    totalSize: invoices.length, // replace later with size(users),
    custom: true,
  };

  const defaultSorted = [
    {
      dataField: "id", // if dataField is not match to any column you defined, it will be ignored.
      order: "desc", // desc or asc
    },
  ];

  return (
    <React.Fragment>
      <div className="page-content">
        <MetaTags>
          <title>Rentdigicare | Vendor Category</title>
        </MetaTags>
        <Container fluid>
          {/* Render Breadcrumbs */}
          <Breadcrumbs title="Vendor" breadcrumbItem="Vendor Category" />
          <Row>
            <Col lg="12">
              <Card>
                <CardBody>
                  <React.Fragment>
                    <Row className="mb-2">
                      <div className="row align-ite  ms-center">
                        <Col sm="6">
                          {/* <div className="search-box ms-2 mb-2 d-inline-block">
                            <div className="position-relative">
                              <Input
                                type="search"
                                placeholder="Search vendor"
                                onChange={debouncedResults}
                              />
                              <i className="bx bx-search-alt search-icon-search" />
                            </div>
                          </div> */}
                        </Col>

                        <div className="col-md-6">
                          <div className="d-flex flex-wrap align-items-center justify-content-end gap-2 mb-3">
                            <div>
                              <button
                                onClick={(e) => {
                                  tog_view();
                                }}
                                className="btn btn-light"
                              >
                                <i className="bx bx-plus me-1"></i> Add
                                Category
                              </button>
                            </div>
                          </div>
                        </div>
                      </div>
                    </Row>
                    <Row>
                      <Col xl="12">
                        <div className="table-responsive">
                          <Table className="table-striped table-bordered mb-0">
                            <thead>
                              <tr>
                                <th scope="col">#</th>
                                <th scope="col">Category Name</th>
                                <th scope="col">Status</th>
                                <th scope="col">Action</th>
                              </tr>
                            </thead>
                            <tbody>
                              {specialties.map((specialty, i) => {
                                return (
                                  <tr>
                                    <td>{i + 1}</td>
                                    <td>{specialty.specialty}</td>
                                    <td>
                                      {specialty.active ? "Active" : "InActive"}
                                    </td>
                                    <td>
                                      <div className="d-flex gap-3">
                                        <Link className="text-success" to="#">
                                          <i
                                            className="mdi mdi-pencil font-size-18"
                                            id="edittooltip"
                                            onClick={() => {
                                              tog_view();
                                              setIsEdit(true);
                                              setId(specialty._id);
                                              setNewSpecialty(
                                                specialty.specialty
                                              );
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
                                              setId(specialty._id);
                                              setShowDeleteDialoge(
                                                !showDeleteDialoge
                                              );
                                            }}
                                          ></i>
                                        </Link>

                                        <Modal
                                          isOpen={showDeleteDialoge}
                                          toggle={() =>
                                           {
                                            setId("")
                                             setShowDeleteDialoge(
                                              !showDeleteDialoge
                                            )}
                                          }
                                        >
                                          <ModalHeader
                                            toggle={() =>{
                                              setId("")
                                              setShowDeleteDialoge(
                                                !showDeleteDialoge
                                              )}
                                            }
                                          >
                                            Confirm
                                          </ModalHeader>
                                          <ModalBody>
                                            Are you sure you want to delete
                                            this?
                                          </ModalBody>
                                          <ModalFooter>
                                            <Button
                                              color="secondary"
                                              onClick={() => {
                                                setId("");
                                                setShowDeleteDialoge(
                                                  !showDeleteDialoge
                                                );
                                              }}
                                            >
                                              Cancel
                                            </Button>
                                            <Button
                                              color="danger"
                                              onClick={async () =>
                                                await deleteSpecialities()
                                              }
                                            >
                                              Delete
                                            </Button>
                                          </ModalFooter>
                                        </Modal>
                                      </div>
                                    </td>
                                  </tr>
                                );
                              })}
                            </tbody>
                          </Table>
                        </div>
                      </Col>
                    </Row>
                    <Row className="align-items-md-center mt-30">
                      <Col className="pagination pagination-rounded justify-content-end mb-2">
                        <PaginationListStandalone
                        // {...paginationProps}
                        />
                      </Col>
                    </Row>
                    <Modal
                      size="md"
                      isOpen={specialtyModel}
                      toggle={() => {
                        tog_view();
                      }}
                    >
                      <div className="modal-header">
                        <h5 className="modal-title mt-0" id="myLargeModalLabel">
                          {isEdit ? "Edit Category" : "Add Category"}
                        </h5>

                        <button
                          onClick={() => {
                            tog_view();
                            setIsEdit(false);
                            setNewSpecialty("");
                            // setmodal_large2(false)
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
                        <div className="col-md-12">
                          <div className="mb-4">
                            {specialtyError && (
                              <p style={{ color: "red" }}>{specialtyError}</p>
                            )}

                            <Label className="form-Label mb-3">Specialty</Label>
                            <input
                              className="form-control"
                              value={newspecialty}
                              placeholder="Enter a speciality"
                              onChange={(e) => {
                                setNewSpecialty(e.target.value);
                              }}
                            ></input>
                          </div>
                        </div>
                        <div className="col-md-12 d-flex flex-wrap align-items-center justify-content-center">
                          <button
                            className="btn btn-primary mo-mb-2 mr-10"
                            onClick={(e) => {
                              !isEdit ? addSpeciality(e) : editSpeciality(e);
                              // tog_rating_view()
                            }}
                          >
                            {loading && (
                              <div
                                id="saveSpinner"
                                style={{
                                  height: "15px",
                                  width: "15px",
                                  marginLeft: "5px",
                                }}
                                class="spinner-border"
                                role="status"
                              ></div>
                            )}
                            Submit
                          </button>
                          <button
                            className="btn btn-light"
                            onClick={(e) => {
                              tog_view();
                            }}
                          >
                            Cancel
                          </button>
                          <br />
                        </div>
                      </div>
                    </Modal>
                  </React.Fragment>
                </CardBody>
              </Card>
            </Col>
          </Row>
        </Container>
      </div>
    </React.Fragment>
  );
};

export default VendorSpecialty;
