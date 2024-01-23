import React, { useEffect, useState } from "react";
import MetaTags from "react-meta-tags";
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
  ModalFooter,
  ModalBody,
  Button,
  ModalHeader,
} from "reactstrap";
import { toast } from "react-toastify";

//Import Breadcrumb
import Breadcrumbs from "../../components/Common/Breadcrumb";

const ReasonType = () => {
  // USE ROLE
  const decode = jwt_decode(window.localStorage.accessToken);

  //  database
  const [stats, setStats] = useState(0);
  const [loading, setLoading] = useState(false);
  const [addLoading, setAddLoading] = useState(false);
  const [selectedId, setSelectedId] = useState("");
  const [isEdit, setIsEdit] = useState(false);
  const [newRequestType, setNewRequestType] = useState("");
  const [requestTypes, setRequestTypes] = useState([]);
  const [showModal, setShowModal] = useState(false);
  const [showError, setShowError] = useState(false);
  const [page, setPage] = useState(0);
  const [currentPage, setCurrentPage] = useState(1);
  const [pageLimit, setPageLimit] = useState(10);
  const [startPage, setStartPage] = useState(1);
  const pageTotal = Math.ceil(stats / pageLimit);
  const [showDeleteDialoge, setShowDeleteDialoge] = useState(false);
  const [reasonId, setReasonId] = useState("");
  const getReasonTypes = async () => {
    try {
      const response = await axios.get(
        `calender/reason/get?companyID=${decode.id}&page=${currentPage}&limit=${pageLimit}`
      );
      if (response.data.results.reasons) {
        const temp = response.data.results.reasons;
        setRequestTypes(temp);
        setPage(
          response.data.results.previous
            ? response.data.results.previous.page + 1
            : 1
        );
        setStats(response.data.results.total);
      }
    } catch (error) {
      console.log(error.message);
    }
  };

  useEffect(() => {
    getReasonTypes();
  }, [currentPage]);

  const handlePageChange = (page) => {
    setCurrentPage(page);

    if (page > startPage + pageLimit - 1 || page < startPage) {
      setStartPage(Math.max(1, page - pageLimit / 2));
    }
  };

  const AddReasonType = async () => {
    if (newRequestType === "") {
      setShowError(true);
    } else {
      setShowError(false);
      setAddLoading(true);
      try {
        const response = await axios.post("calender/reason/add", {
          companyID: decode.id,
          reasonType: newRequestType,
        });
        if (response.data.status === 200) {
          getReasonTypes();
          setIsEdit(false);
          setNewRequestType("");
          setShowModal(false);
          setAddLoading(false);
          toast.success(response.data.message);
        }
        else {
          toast.warning(response.data.message);
          setAddLoading(false);
        }
      } catch (error) {
        setAddLoading(false);
        console.log(error.message);
      
      }
    }
  };

  const EditReasonType = async () => {
    try {
      if (newRequestType === "") {
        setShowError(true);
      } else {
        setShowError(false);
        setAddLoading(true);
        const response = await axios.put("calender/reason/update", {
          id: selectedId,
          reasonType: newRequestType,
        });
        if (response.data.status === 200) {
          getReasonTypes();
          setIsEdit(false);
          setAddLoading(false);
          setShowModal(false);
          setNewRequestType("");
          toast.success(response.data.message);
        }
        else {
          toast.warning(response.data.message);
        }
      }
    } catch (error) {
      console.log(error.message);
      setAddLoading(false);
    }
  };
  const deleteRequestTypes = async () => {
    try {
      const response = await axios.delete(
        `calender/reason/delete?id=${reasonId}`
      );
      if (response.data.status === 200) {
        getReasonTypes();
        setReasonId("");
        setShowDeleteDialoge(false);
        toast.success(response.data.message);
      }else {
        // toast.warning(response.data.message);
      }
    } catch (error) {
      // visible error
      console.log(error);
      // toast.warning(error.error);
    }
  };

  let number = 0;
  let number1 = page > 1 ? (page - 1) * 10 : 0;

  return (
    <React.Fragment>
      <div className="page-content">
        <MetaTags>
          <title>Rentdigicare | Calendar Reason Types </title>
        </MetaTags>
        <div className="container-fluid">
          <Breadcrumbs title="Home" breadcrumbItem="Reason Types" />
          <Row>
            <Col xl={12}>
              <Card>
                {
                  <CardHeader>
                    <div className="row align-items-center">
                      <div className="col-md-6">
                        <div className="mb">
                          <h5 className="card-title">
                            Reason Types
                            <span className="text-muted fw-normal ms-2">
                              ({stats})
                            </span>
                          </h5>
                        </div>
                      </div>

                      <div className="col-md-6 d-flex flex-wrap align-items-center justify-content-end">
                        <div className="mb">
                          {decode.role === "company" && (
                            <button
                              type="button"
                              onClick={() => {
                                setShowModal(true);
                              }}
                              className="btn btn-light "
                              data-toggle="modal"
                              data-target=".bs-example-modal-lg"
                            >
                              <i className="bx bx-plus me-1"></i> Add Reason
                              Type
                            </button>
                          )}
                        </div>
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
                          number++;
                          return (
                            <tr>
                              <td>{number + number1}</td>
                              <td>{item.reasonType}</td>

                              <td>
                                <div className="d-flex gap-3">
                                  <Link className="text-success" to="#">
                                    <i
                                      className="mdi mdi-pencil font-size-18"
                                      id="edittooltip"
                                      onClick={() => {
                                        setIsEdit(true);
                                        setSelectedId(item._id);
                                        setNewRequestType(item.reasonType);
                                        setShowModal(true);
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
                                        setReasonId(item._id);
                                        setShowDeleteDialoge(
                                          !showDeleteDialoge
                                        );
                                      }}
                                    ></i>
                                  </Link>
                                  <Modal
                                    isOpen={showDeleteDialoge}
                                    toggle={() => {
                                      setReasonId("");
                                      setShowDeleteDialoge(!showDeleteDialoge);
                                    }}
                                  >
                                    <ModalHeader
                                      toggle={() => {
                                        setReasonId("");
                                        setShowDeleteDialoge(
                                          !showDeleteDialoge
                                        );
                                      }}
                                    >
                                      Confirm
                                    </ModalHeader>
                                    <ModalBody>
                                      Are you sure you want to delete this?
                                    </ModalBody>
                                    <ModalFooter>
                                      <Button
                                        color="secondary"
                                        onClick={() => {
                                          setReasonId("");
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
                                          await deleteRequestTypes()
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
            isOpen={showModal}
            toggle={() => {
              setShowModal(!showModal);
              setIsEdit(false);
              setNewRequestType("");
            }}
          >
            <div className="modal-header">
              <h5 className="modal-title mt-0" id="myLargeModalLabel">
                {isEdit ? "Edit Reason Type" : "Add Reason Type"}
              </h5>
              <button
                onClick={() => {
                  setShowModal(!showModal);
                  setIsEdit(false);
                  setNewRequestType("");
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
              <Form
                onSubmit={(e) => {
                  e.preventDefault();
                  isEdit ? EditReasonType() : AddReasonType();
                }}
              >
                <div className="row align-items-center">
                  <div className="col-md-6">
                    <div className="mb-3">
                      <Label
                        className="form-label"
                        htmlFor="formrow-title-input"
                      >
                        Reason Type *
                      </Label>
                      <Input
                        onChange={(e) => {
                          setNewRequestType(e.target.value);
                        }}
                        type="text"
                        className="form-control"
                        id="formrow-name-input"
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
                        {addLoading ? (
                          <div className="spinner-border spinner-border-sm" role="status">
                            <span className="sr-only">Loading...</span>
                          </div>
                        ) : (
                          "Save"
                        )}
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

export default ReasonType;
