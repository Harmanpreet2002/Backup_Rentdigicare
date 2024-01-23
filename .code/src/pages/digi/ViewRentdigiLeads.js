import React, { useState, useEffect } from "react";
import MetaTags from "react-meta-tags";
import { useHistory } from "react-router-dom";
import { Link } from "react-router-dom";
import {
    Table,
    Row,
    Col,
    Card,
    CardBody,
    Modal,
    CardHeader,
    Label,
    Input,
    Pagination,
    PaginationItem,
    Collapse,
    PaginationLink,
    DropdownItem,
    DropdownMenu,
    DropdownToggle,
    Dropdown,
    Button,
    ModalHeader,
    ModalBody,
    ModalFooter,
    Form,
} from "reactstrap";
import axios from "../api/axios";
import jwt_decode from "jwt-decode";
import { AvForm, AvField } from "availity-reactstrap-validation";
//Import Breadcrumb
import Breadcrumbs from "../../components/Common/Breadcrumb";
import moment from "moment";
import { toast } from "react-toastify";

let filter = false;
const Leads = () => {
    const [modal_large, setmodal_large] = useState(false);
    const [showFilter, setShowFilter] = useState(false);

    const [btnsuccess1, setBtnsuccess1] = useState(false);
    const [modal_large2, setmodal_large2] = useState(false);
    const [leads, setLeads] = useState([]);
    const [loading, setLoading] = useState(false);
    const [vendorError, setVendorError] = useState("");
    const [vendorspeciality, setVendorSpeciality] = useState([]);
    const [name, setName] = useState("");
    const [speciality, setSpeciality] = useState("");
    const [cityFilter, setCity] = useState("");
    const [email, setEmail] = useState("");
    const [filterPhone, setFilterPhone] = useState("");
    const [filterRating, setFilterRating] = useState("");
    const [filterStatus, setFilterStatus] = useState("");
    const [stats, setStats] = useState({
        total: 0,
        closed: 0,
        pending: 0,
        cancelled: 0,
        follow_up: 0,
    });
    const [page, setPage] = useState(0);
    const [currentPage, setCurrentPage] = useState(1);
    const [pageLimit, setPageLimit] = useState(10);
    const [showModal, setShowModal] = useState(false);
    const [editLead, setEditLead] = useState({
        data: "",
        edit: false,
    });
    const [showDeleteDialoge, setShowDeleteDialoge] = useState(false);
    const [deleteLoading, setDeleteLoading] = useState(false);
    const [leadId, setLeadId] = useState("")

    const GET_LEADS = `/leads/getLeads?page=${currentPage}&limit=${pageLimit}`;
    const GET_MANAGER_LEADS = `/leads/getLeadsManager?page=${currentPage}&limit=${pageLimit}`;
    const ADD_LEAD = "/leads/addLead";
    const DELETE_LEAD = "/leads/delete";
    // const UPDATE_LEAD = `/leads/update/${editLead?.data?._id}`;
    const GET_ADMIN_LEADS = `/leads/getAdminLeads?page=${currentPage}&limit=${pageLimit}`;


    //   const CHANGE_STATUS=`/leads/updateStatus/${leadId}`
    const CHANGE_STATUS = `/leads/admin/updateStatus/${leadId}`
    

    const [selectedEndDate, setSelectedEndDate] = useState("");
    const [selectedStartDate, setSelectedStartDate] = useState("");
    const [startPage, setStartPage] = useState(1);
    const [propertyName, setPropertyName] = useState("");
    const [bedroomType, SetBedroomType] = useState([]);
    const [apartments, setApartments] = useState([]);
    const pageTotal = Math.ceil(stats.total / pageLimit);
    const [selectedBedroomType, setSelectedBedroomsType] = useState("");
    const [selectedApartment, setSelectedApartment] = useState("");
    const [statusOfLead, setStatusOfLead] = useState("");
    const [confirm_model, setConfirm_model] = useState(false)
    const [selectedStatus, setSelectedStatus] = useState("");
    const handlePageChange = (page) => {
        setCurrentPage(page);

        if (page > startPage + pageLimit - 1 || page < startPage) {
            setStartPage(Math.max(1, page - pageLimit / 2));
        }
    };

    const Confirm_view = (id, status) => {
        setLeadId(id);
        setStatusOfLead(status);
        setConfirm_model(!confirm_model);
    };

    const ChangeStatus = async () => {

        try {
            const response = await axios.put(CHANGE_STATUS, {
                status: statusOfLead,
            });

            if (response.data.success) {
                getLeads();
                setLeadId("")
                toast.success(response.data.message)
            }
        } catch (error) {
            // TODO proper message
            console.log("Unable to fetch");

        }
    };

    const handleDelete = async (val) => {
        // delete something here
        try {
            setDeleteLoading(true);
            axios.delete(`${DELETE_LEAD}/${val}`).then((res) => {
                setDeleteLoading(true);
                setShowDeleteDialoge(false);
                getLeads();
            });
        } catch (err) {
            setDeleteLoading(true);
        }
    };

    function removeBodyCss() {
        document.body.classList.add("no_padding");
    }

    const decode = jwt_decode(window.localStorage.getItem("accessToken"));

    const history = useHistory();

    function tog_large() {
        setmodal_large(!modal_large);
        removeBodyCss();
    }

    const [col5, setcol5] = useState(false);

    const t_col5 = () => {
        setcol5(!col5);
    };
    function tog_large2() {
        setmodal_large2(!modal_large2);
        removeBodyCss();
    }

    const getLeads = async (e) => {
        try {
            const response = await axios.get(
                decode.role === "admin" ? GET_ADMIN_LEADS : ""
            );
            console.log(response, 'jkkkkjkkj')

            if (response.data?.status === 200 && response?.data?.leads?.length > 0) {
                setLeads(response?.data?.leads);
                setPage(
                    response.data.results.previous
                        ? response.data.results.previous.page + 1
                        : 1
                );
                setStats((prev) => ({
                    ...prev,
                    total: response.data.total.Total || 0,
                    pending: response.data.total.Pending || 0,
                    closed: response.data.total.Closed || 0,
                    cancelled: response.data.total.Cancelled || 0,
                    follow_up: response.data.total["Follow Up"] || 0,
                }));
                SetBedroomType(response.data.bedroomType);
                setApartments(response.data.apartmentTypes);
            } else {
                setVendorError(response.data?.errorMessage);
            }
        } catch (error) {
            setVendorError("Something went wrong");

            console.log(error); // TODO proper error
        }
    };

    const FilterSearch = async (sorting) => {
        try {
            const params = {
                name: name,
                phone: filterPhone,
                email: email,
                startDate: selectedStartDate,
                endDate: selectedEndDate,
                propertyName: propertyName,
                interestedApartment: selectedApartment,
                interestedBedroomType: selectedBedroomType,
                sort: JSON.stringify(sorting),
                status: selectedStatus,
            };
            const response = await axios.get(
                `${decode.role === "admin" ? GET_ADMIN_LEADS : ""}`,
                { params }
            );
            if (response.data?.success) {
                setLeads(response?.data?.leads);
                setStats((prev) => ({
                    ...prev,
                    total: response.data.total.Total || 0,
                    pending: response.data.total.Pending || 0,
                    closed: response.data.total.Closed || 0,
                    cancelled: response.data.total.Cancelled || 0,
                    follow_up: response.data.total["Follow Up"] || 0,
                }));
                setPage(
                    response.data.results.previous
                        ? response.data.results.previous.page + 1
                        : 1
                );
            } else {
                setVendorError(response.data?.errorMessage);
            }
        } catch (error) {
            // TODO proper message
            console.log("Unable to fetch");
        }
    };

    const handleSorting = (e) => {
        var newData = {};
        var value = parseInt(e.target.value)
        console.log(typeof value, "SDDDDD")
        if (value === 1) {
            console.log("1")
            newData = { name: 1 };
        } else if (value === 2) {
            newData = { name: -1 };
        } else if (value === 3) {
            newData = { createdAt: -1 };
        } else if (value === 4) {
            newData = { createdAt: 1 };
        }
        FilterSearch(newData);
        console.log(newData, "newData");
    };

    useEffect(() => {
        // dispatch(onGetInvoices());
        if (filter) {
            console.log("filter is true");
            FilterSearch();
        } else {
            console.log("filter is false");
            getLeads();
        }
    }, [currentPage]);

    const ClearTicket = (e) => {
        e.preventDefault();
        filter = false;
        setFilterStatus("");
        setSelectedStatus("")
        setName("");
        setEmail("");
        setPropertyName("");
        setFilterPhone("");
        setCity("");
        setSelectedEndDate("");
        setSelectedApartment("");
        setSelectedBedroomsType("");
        setSelectedStartDate("");
        setTimeout(() => {
            document.getElementById("ticketfilter").click();
        }, 1000);
    };

    // const handleSubmit = async (event, errors, values) => {
    //   try {
    //     event.preventDefault();
    //     setLoading(true);
    //     if (errors.length === 0) {
    //       if (editLead?.edit) {
    //         await axios
    //           .put(UPDATE_LEAD, {
    //             name: values.name,
    //             email: values.email,
    //             phone: values.phone,
    //             interestedApartment: values?.interestedApartment,
    //             interestedBedroomType: values?.interestedBedroomType,
    //             // websiteURL: values?.websiteURL,
    //           })
    //           .then((res) => {
    //             setLoading(false);
    //             if (res.data?.success) {
    //               alert("Lead updated Successfully");
    //               setEditLead({
    //                 data: "",
    //                 edit: false,
    //               });
    //               setShowModal(false);
    //               getLeads();
    //             }
    //           });
    //       } else {
    //         await axios
    //           .post(ADD_LEAD, {
    //             name: values.name,
    //             email: values.email,
    //             phone: values.phone,
    //             interestedApartment: values?.interestedApartment,
    //             interestedBedroomType: values?.interestedBedroomType,
    //             // websiteURL: values?.websiteURL,
    //           })
    //           .then((res) => {
    //             setLoading(false);
    //             if (res.data?.success) {
    //               alert("Lead Added Successfully");
    //               setShowModal(false);
    //               getLeads();
    //             }
    //           });
    //       }
    //     } else {
    //       setLoading(false);
    //     }
    //   } catch (err) {
    //     setLoading(false);
    //     console.log(err);
    //   }
    // };
    let number = 0;
    let number1 = page > 1 ? (page - 1) * 10 : 0;
    return (
        <React.Fragment>
            <div className="page-content">
                <MetaTags>
                    <title>Rentdigicare | Leads </title>
                </MetaTags>
                <div className="container-fluid">
                    <Breadcrumbs title="Home" breadcrumbItem="Leads" />
                    <Row>
                        <Col xl={12}>
                            <Card>
                                <CardHeader>
                                    <div className="row">
                                        <div className="col-md-10 d-flex">
                                            <div className="mb mx-2">
                                                <h5 className="card-title">
                                                    Total
                                                    <span className="text-muted fw-normal ms-1">
                                                        ({stats?.total})
                                                    </span>
                                                </h5>
                                            </div>
                                            <div className="mx-2">
                                                <h5 className="card-title">
                                                    Pending
                                                    <span className="text-muted fw-normal ms-1">
                                                        ({stats?.pending})
                                                    </span>
                                                </h5>
                                            </div>

                                            <div className="mx-2">
                                                <h5 className="card-title">
                                                    Closed
                                                    <span className="text-muted fw-normal ms-1">
                                                        ({stats?.closed})
                                                    </span>
                                                </h5>
                                            </div>
                                            <div className="mx-2">
                                                <h5 className="card-title">
                                                    Cancelled
                                                    <span className="text-muted fw-normal ms-1">
                                                        ({stats?.cancelled})
                                                    </span>
                                                </h5>
                                            </div>
                                            <div className="mx-2">
                                                <h5 className="card-title">
                                                    Follow Up
                                                    <span className="text-muted fw-normal ms-1">
                                                        ({stats?.follow_up})
                                                    </span>
                                                </h5>
                                            </div>
                                        </div>
                                        <div className="col-md-2 d-flex flex-wrap align-items-center justify-content-end">
                                            <div className="mb d-flex flex-wrap">
                                                <button
                                                    onClick={(e) => {
                                                        setShowFilter(!showFilter);
                                                    }}
                                                    className="btn btn-primary mo-mb-2 mr-10"
                                                    type="button"
                                                    style={{ cursor: "pointer" }}
                                                >
                                                    Filters
                                                </button>

                                                {/* <button
                          type="button"
                          onClick={() => {
                            setShowModal(!showModal);
                          }}
                          className="btn btn-light "
                          data-toggle="modal"
                          data-target=".bs-example-modal-lg"
                        >
                          <i className="bx bx-plus me-1"></i> Add Lead
                        </button> */}
                                                <Modal size="lg" isOpen={showModal}>
                                                    <div className="modal-header">
                                                        <h5
                                                            className="modal-title mt-0"
                                                            id="myLargeModalLabel"
                                                        >
                                                            {editLead ? "Edit Lead" : "Add Lead"}
                                                        </h5>
                                                        <button
                                                            onClick={() => {
                                                                setShowModal(!showModal);

                                                                setTimeout(() => {
                                                                    setEditLead({
                                                                        data: "",
                                                                        edit: false,
                                                                    });
                                                                }, 1000);
                                                            }}
                                                            type="button"
                                                            className="close"
                                                            data-dismiss="modal"
                                                            aria-label="Close"
                                                        >
                                                            <span aria-hidden="true">&times;</span>
                                                        </button>
                                                    </div>
                                                    {/* <div className="modal-body">
                            <AvForm onSubmit={handleSubmit}>
                              <div className="row">
                                <div className="col-lg-6">
                                  <div className="mb-3">
                                    <AvField
                                      name="name"
                                      label="Name"
                                      defaultValue={
                                        editLead?.edit
                                          ? editLead?.data?.name
                                          : ""
                                      }
                                      validate={{
                                        required: {
                                          value: true,
                                          errorMessage: "Please enter name",
                                        },
                                      }}
                                    />
                                  </div>
                                </div>
                                <div className="col-lg-6">
                                  <div className="mb-3">
                                    <AvField
                                      name="email"
                                      label="Email"
                                      type="email"
                                      defaultValue={
                                        editLead?.edit
                                          ? editLead?.data?.email
                                          : ""
                                      }
                                      validate={{
                                        required: {
                                          value: true,
                                          errorMessage:
                                            "Please enter the Email",
                                        },

                                        pattern: {
                                          value:
                                            "^[a-zA-Z0-9+_.-]+@[a-zA-Z0-9.-]+$",
                                          errorMessage:
                                            "Please enter the valid email",
                                        },
                                      }}
                                    />
                                  </div>
                                </div>
                              </div>

                              <div className="row">
                                <div className="col-lg-6">
                                  <div className="mb-3">
                                    <AvField
                                      name="phone"
                                      type="number"
                                      label="Phone"
                                      defaultValue={
                                        editLead?.edit
                                          ? editLead?.data?.phone
                                          : ""
                                      }
                                      validate={{
                                        required: {
                                          value: true,
                                          errorMessage:
                                            "Please enter your phone number",
                                        },

                                        maxLength: {
                                          value: 10,
                                          errorMessage:
                                            "Maximum 10 digits is required",
                                        },
                                        pattern: {
                                          value: "^[0-9]{10}$",
                                          errorMessage:
                                            "Please enter a valid phone number",
                                        },
                                      }}
                                    />
                                  </div>
                                </div>
                                <div className="col-lg-6">
                                  <div className="mb-3">
                                    <AvField
                                      name="websiteURL"
                                      label="Website URL"
                                      defaultValue={
                                        editLead?.edit
                                          ? editLead?.data?.websiteURL
                                          : ""
                                      }
                                      validate={{
                                        required: {
                                          value: true,
                                          errorMessage:
                                            "Please enter the website url",
                                        },
                                      }}
                                    />
                                  </div>
                                </div>
                              </div>
                              <div className="row">
                                <div className="col-lg-6">
                                  <div className="mb-3">
                                    <AvField
                                      name="interestedApartment"
                                      label="Interested Apartment"
                                      defaultValue={
                                        editLead?.edit
                                          ? editLead?.data?.interestedApartment
                                          : ""
                                      }
                                      validate={{
                                        required: {
                                          value: true,
                                          errorMessage:
                                            "Please enter a interested Apartment",
                                        },
                                      }}
                                    />
                                  </div>
                                </div>{" "}
                                <div className="col-lg-6">
                                  <div className="mb-3">
                                    <AvField
                                      name="interestedBedroomType"
                                      label="Interested Bedroom Type"
                                      defaultValue={
                                        editLead?.edit
                                          ? editLead?.data
                                              ?.interestedBedroomType
                                          : ""
                                      }
                                      validate={{
                                        required: {
                                          value: true,
                                          errorMessage:
                                            "Please enter a interested Bedroom Type",
                                        },
                                      }}
                                    />
                                  </div>
                                </div>
                                <div className="col-md-12">
                                  <div className="text-end">
                                    {loading ? (
                                      <>
                                        <span
                                          class="spinner-border spinner-border-sm"
                                          style={{ marginRight: "3px" }}
                                          role="status"
                                          aria-hidden="true"
                                        ></span>
                                        Loading...
                                      </>
                                    ) : (
                                      <button
                                        type="submit"
                                        className="btn btn-success save-user"
                                      >
                                        Save
                                      </button>
                                    )}
                                  </div>
                                </div>
                              </div>
                            </AvForm>
                          </div> */}
                                                </Modal>
                                            </div>
                                        </div>
                                    </div>
                                    <div className="row">
                                        <div className="col-lg-12">
                                            <Collapse className="mt-4" isOpen={showFilter}>
                                                <Card>
                                                    <CardBody>
                                                        <div className="filter-sec">
                                                            <Form>
                                                                <div class="row align-items-center">
                                                                    <div className="col-md-4">
                                                                        <div className="mb-3">
                                                                            <Label
                                                                                className="form-label"
                                                                                htmlFor="formrow-name-input"
                                                                            >
                                                                                Name
                                                                            </Label>
                                                                            <Input
                                                                                placeholder="Enter leads name"
                                                                                onChange={(e) => {
                                                                                    setName(e.target.value);
                                                                                }}
                                                                                className="form-control"
                                                                                id="formrow-name-input"
                                                                                value={name}
                                                                            />
                                                                        </div>
                                                                    </div>
                                                                    <div className="col-md-4">
                                                                        <div className="mb-3">
                                                                            <Label
                                                                                className="form-label"
                                                                                htmlFor="formrow-code-input"
                                                                            >
                                                                                Phone
                                                                            </Label>
                                                                            <Input
                                                                                placeholder="Enter leads contact number"
                                                                                onChange={(e) => {
                                                                                    setFilterPhone(e.target.value);
                                                                                }}
                                                                                type="text"
                                                                                className="form-control"
                                                                                id="formrow-code-input"
                                                                                value={filterPhone}
                                                                            />
                                                                        </div>
                                                                    </div>

                                                                    <div className="col-md-4">
                                                                        <div className="mb-3">
                                                                            <Label
                                                                                className="form-label"
                                                                                htmlFor="formrow-code-input"
                                                                            >
                                                                                Email
                                                                            </Label>
                                                                            <Input
                                                                                placeholder="Enter leads email"
                                                                                onChange={(e) => {
                                                                                    setEmail(e.target.value);
                                                                                }}
                                                                                type="text"
                                                                                className="form-control"
                                                                                id="formrow-code-input"
                                                                                value={email}
                                                                            />
                                                                        </div>
                                                                    </div>
                                                                    <div className="col-md-4">
                                                                        <div className="mb-3">
                                                                            <Label
                                                                                className="form-label"
                                                                                htmlFor="formrow-name-input"
                                                                            >
                                                                                Company Name
                                                                            </Label>
                                                                            <Input
                                                                                placeholder="Enter property name"
                                                                                onChange={(e) => {
                                                                                    setPropertyName(e.target.value);
                                                                                }}
                                                                                className="form-control"
                                                                                id="formrow-name-input"
                                                                                value={propertyName}
                                                                            />
                                                                        </div>
                                                                    </div>
                                                                    
                                                                    
                                                                    <div className="col-md-4">
                                                                        <div className="mb-3">
                                                                            <Label
                                                                                className="form-label"
                                                                                htmlFor="formrow-facility-input"
                                                                            >
                                                                                Status
                                                                            </Label>
                                                                            <select className="form-select" onChange={(e) => setSelectedStatus(e.target.value)}>
                                                                                <option selected>Select</option>
                                                                                <option value="Pending">Pending</option>
                                                                                <option value="Closed">Closed</option>
                                                                                <option value="Cancelled">Cancelled</option>
                                                                                <option value="Follow Up">Follow Up</option>
                                                                            </select>
                                                                        </div>
                                                                    </div>
                                                                    <div className="col-md-4">
                                                                        <div className="mb-3">
                                                                            <Label
                                                                                htmlFor="example-date-input"
                                                                                className="form-Label"
                                                                            >
                                                                                From
                                                                            </Label>
                                                                            <Input
                                                                                className="form-control"
                                                                                type="date"
                                                                                value={selectedStartDate}
                                                                                onChange={(e) => {
                                                                                    setSelectedStartDate(e.target.value);
                                                                                }}
                                                                                //   defaultValue={neew}
                                                                                id="example-date-input"
                                                                            />
                                                                        </div>
                                                                    </div>
                                                                    <div className="col-md-4">
                                                                        <div className="mb-3">
                                                                            <Label
                                                                                htmlFor="example-date-input"
                                                                                className="form-Label"
                                                                            >
                                                                                To
                                                                            </Label>
                                                                            <Input
                                                                                className="form-control"
                                                                                type="date"
                                                                                value={selectedEndDate}
                                                                                onChange={(e) => {
                                                                                    setSelectedEndDate(e.target.value);
                                                                                }}
                                                                                //  defaultValue={FromFilter}
                                                                                id="example-date-input"
                                                                            />
                                                                        </div>
                                                                    </div>

                                                                    <div className="col-md-12 btn-group d-flex justify-content-end">
                                                                        <div className="srch-btn">
                                                                            <button
                                                                                type="submit"
                                                                                id="ticketfilter"
                                                                                onClick={(e) => {
                                                                                    e.preventDefault();
                                                                                    filter = true;
                                                                                    setCurrentPage(1);
                                                                                    FilterSearch();
                                                                                }}
                                                                                className="btn btn-primary"
                                                                            >
                                                                                Search
                                                                            </button>
                                                                        </div>
                                                                        <div
                                                                            className="srch-btn"
                                                                            style={{ marginLeft: "10px" }}
                                                                        >
                                                                            <button
                                                                                onClick={(e) => {
                                                                                    ClearTicket(e);
                                                                                }}
                                                                                className="btn btn-primary"
                                                                            >
                                                                                Clear
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
                                <CardBody>
                                    <div className="table-responsive">
                                        <div>
                                            <select
                                                onChange={(e) => handleSorting(e)}
                                                style={{
                                                    borderRadius: "4px",
                                                    marginBottom: "10px",
                                                    borderColor: "#d1d1d5",
                                                }}
                                            >
                                                <option>Sorting </option>
                                                <option value={1}>A-Z</option>
                                                <option value={2}>Z-A</option>
                                                <option value={3}>Created Latest</option>
                                                <option value={4}>Created Oldest</option>
                                            </select>
                                        </div>
                                        <Table className="table-striped table-bordered mb-0">
                                            <thead>
                                                <tr>
                                                    <th scope="col">#</th>
                                                    <th scope="col">Name</th>
                                                    <th scope="col">Email</th>
                                                    <th scope="col">Phone</th>
                                                    <th scope="col">Company</th>
                                                    <th scope="col">Status</th>
                                                    <th scope="col">Created</th>
                                                    {/* <th scope="col">Action</th> */}
                                                </tr>
                                            </thead>

                                            {leads?.map((item, i) => {
                                                number++;
                                                return (
                                                    <tbody>
                                                        <tr>
                                                            <td>{number + number1}</td>

                                                            <td>
                                                                <strong className="text-muted">
                                                                    {item.name}
                                                                </strong>

                                                            </td>
                                                            <td>{item.email}</td>
                                                            <td>{item.phone}</td>
                                                            <td>{item.company}</td>
                                                            <td>
                                                                <select
                                                                    className={`form-select applicant-status btn-sm `}
                                                                    style={{ width: "120px" }}
                                                                    value={item.status}
                                                                    onChange={(event) => {
                                                                        Confirm_view(item._id, event.target.value);
                                                                    }}
                                                                >
                                                                    <option className="btn btn-light" value={"Pending"}>
                                                                        Pending
                                                                    </option>
                                                                    <option className="btn btn-light" value={"Closed"}>
                                                                        Closed
                                                                    </option>
                                                                    <option className="btn btn-light " value="Cancelled">
                                                                        Cancelled
                                                                    </option>
                                                                    <option className="btn btn-light " value="Follow Up">
                                                                        Follow Up
                                                                    </option>
                                                                </select>
                                                            </td>
                                                            <td>
                                                                {moment(item.createdAt).format("YYYY-MM-DD")}
                                                            </td>



                                                            {/* <td className="d-flex justify-content-between align-items-center">
                                <button
                                  className="btn btn-outline-primary btn-sm"
                                  onClick={() => {
                                  
                                    setEditLead({
                                      data: item,
                                      edit: true,
                                    });
                                    setShowModal(!showModal);
                                  }}
                                >
                                  Edit
                                </button>
                                <button
                                  className="btn btn-outline-danger btn-sm"
                                  onClick={() =>
                                    setShowDeleteDialoge(!showDeleteDialoge)
                                  }
                                >
                                  Delete
                                </button>
                                <Modal
                                  isOpen={showDeleteDialoge}
                                  toggle={() =>
                                    setShowDeleteDialoge(!showDeleteDialoge)
                                  }
                                >
                                  <ModalHeader
                                    toggle={() =>
                                      setShowDeleteDialoge(!showDeleteDialoge)
                                    }
                                  >
                                    Confirm
                                  </ModalHeader>
                                  <ModalBody>
                                    Are you sure you want to delete this?
                                  </ModalBody>
                                  <ModalFooter>
                                    <Button
                                      color="secondary"
                                      onClick={() =>
                                        setShowDeleteDialoge(!showDeleteDialoge)
                                      }
                                    >
                                      Cancel
                                    </Button>
                                    <Button
                                      color="danger"
                                      onClick={() => handleDelete(item?._id)}
                                    >
                                      Delete
                                    </Button>
                                  </ModalFooter>
                                </Modal>
                              </td> */}
                                                        </tr>
                                                    </tbody>
                                                );
                                            })}
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

            <Modal
                isOpen={confirm_model}
                toggle={() => {
                    Confirm_view();
                }}
                aria-labelledby="contained-modal-title-vcenter"
                centered
            >
                <ModalHeader toggle={() => {
                    Confirm_view();
                }}><h3> Update lead status</h3></ModalHeader>
                {/* <div className="modal-header"> */}
                <button
                    onClick={() => {
                        Confirm_view();
                        // setmodal_large2(false)
                    }}
                    type="button"
                    className="close"
                    data-dismiss="modal"
                    aria-label="Close"
                >
                    <span aria-hidden="true">&times;</span>
                </button>
                {/* </div> */}
                <ModalBody>
                    <div className="modal-body">
                        {/* <h3>Are You Sure !</h3> */}
                        <h5>Are you sure want to change the status?</h5>
                    </div></ModalBody>
                <ModalFooter>
                    <button
                        onClick={() => {
                            console.log("confirm ");
                            ChangeStatus();
                            Confirm_view();
                        }}
                        className="btn btn-primary mr-10"
                        type="button"
                    >
                        <span aria-hidden="true">Yes</span>
                    </button>
                    <button
                        onClick={() => {
                            Confirm_view();
                            // setmodal_large2(false)
                        }}
                        className="btn btn-light"
                        type="button"
                    >
                        <span aria-hidden="true">No</span>
                    </button>
                </ModalFooter>
            </Modal>
        </React.Fragment>
    );
};
export default Leads;
