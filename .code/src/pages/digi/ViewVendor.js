import React, { useState, useEffect } from "react";
import MetaTags from "react-meta-tags";
import { useHistory } from "react-router-dom";
import { Link } from "react-router-dom";
import { Rating } from "react-simple-star-rating";
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
  Form,
} from "reactstrap";
import Select from "react-select";
import axios from "../api/axios";
import jwt_decode from "jwt-decode";
import { toast } from "react-toastify";
//Import Breadcrumb
import Breadcrumbs from "../../components/Common/Breadcrumb";
const Vendors = () => {
  const [modal_large, setmodal_large] = useState(false);
  const [showFilter, setShowFilter] = useState(false);
  const [pageLimit, setPageLimit] = useState(10);
  const [btnsuccess1, setBtnsuccess1] = useState(false);
  const [modal_large2, setmodal_large2] = useState(false);
  const [vendor, setVendor] = useState([]);
  const [loading, setLoading] = useState(false);
  const [vendorError, setVendorError] = useState("");
  const [vendorspeciality, setVendorSpeciality] = useState([]);
  const [name, setName] = useState("");
  const [speciality, setSpeciality] = useState("");
  const [cityFilter, setCity] = useState("");
  const [email, setEmail] = useState("");
  const [filterContact, setFilterContact] = useState("");
  const [filterRating, setFilterRating] = useState("");
  const [filterStatus, setFilterStatus] = useState("");
  const [stats, setStats] = useState({
    total: 0,
    pending: 0,
    verified: 0,
    rejected: 0,
    suspended: 0,
  });
  const [startPage, setStartPage] = useState(1);
  const [currentPage, setCurrentPage] = useState(1);
  const pageTotal = Math.ceil(stats?.total / pageLimit);

  const [check_first, setcheck_first] = useState(true);
  const [check_last, setcheck_last] = useState(true);
  const [check_name, setcheck_name] = useState(true);
  const [check_email, setcheck_email] = useState(true);
  const [check_mobile, setcheck_mobile] = useState(true);
  const [check_agency, setCheck_agency] = useState(true);
  const [check_categories, setCheck_categories] = useState(true);
  const [check_address, setCheck_address] = useState(true);

  const [managerFirstName, setManagerFirstName] = useState("");
  const [managerLastName, setManagerLastName] = useState("");
  const [managerPhone, setManagerPhone] = useState("");
  const [managerEmail, setManagerEmail] = useState("");
  const [managerAgency, setManagerAgency] = useState("");
  const [categories, setCategories] = useState([]);
  const [managerAddress, setManagerAddress] = useState([]);

  const [selectedCategories, setSelectedCategories] = useState([]);

  const [msg_error, setmsg_error] = useState("");
  const [msg_error1, setmsg_error1] = useState("");
  const [msg_error3, setmsg_error3] = useState("");
  const [msg_error4, setmsg_error4] = useState("");
  const [msg_error5, setmsg_error5] = useState("");
  const [msg_error6, setmsg_error6] = useState("");
  const [msg_error7, setmsg_error7] = useState("");

  const UPDATE_VENDOR = "/vendor/update-vendor";

  const handlePageChange = (page) => {
    setCurrentPage(page);

    if (page > startPage + pageLimit - 1 || page < startPage) {
      setStartPage(Math.max(1, page - pageLimit / 2));
    }
  };

  const [primaryID, setPrimaryID] = useState("");
  function removeBodyCss() {
    document.body.classList.add("no_padding");
  }

  const decode = jwt_decode(window.localStorage.getItem("accessToken"));

  const ADD_VENDOR = () => {
    if (decode.role === "manager")
      return `/vendor/get_vendors/${decode.companyId}?page=${currentPage}&limit=10`;
    else if (decode.role === "company")
      return `/vendor/get_vendors/${decode.id}?page=${currentPage}&limit=10`;
    else return `/vendor/get_vendors?page=${currentPage}&limit=10`;
  };
  const ADD_COMPANY_VENDOR = "/vendor/add_company_vendor";
  const REMOVE_COMPANY_VENDOR = "/vendor/remove_company_vendor";
  const GET_VENDOR_SPECIALITY = "/vendorspeciality/get_speciality";

  const history = useHistory();

  async function tog_large(item) {
    if (item) {
      console.log(item);
      setManagerFirstName(item.first_name);
      setManagerLastName(item.last_name);
      setManagerEmail(item.email);
      setManagerPhone(item.contact_no);
      setManagerAgency(item.agency_name);
      setManagerAddress(item.address);
      let mycat = await item.specialties.map((sp) => sp._id);
      setSelectedCategories(mycat);
    }
    if (modal_large) {
      console.log("Excecuted");
      setcheck_first(true);
      setcheck_last(true);
      setcheck_name(true);
      setcheck_email(true);
      setcheck_mobile(true);
      setCheck_agency(true);
      setCheck_categories(true);
      setCheck_address(true);
    }
    setmodal_large(!modal_large);
    // removeBodyCss();
  }

  const [col5, setcol5] = useState(false);

  const t_col5 = () => {
    setcol5(!col5);
  };
  function tog_large2() {
    setmodal_large2(!modal_large2);
    removeBodyCss();
  }

  const getVendor = async (e) => {
    try {
      const response = await axios.get(ADD_VENDOR());

      console.log("decode", decode);

      if (response.data?.success && response?.data?.vendors?.length > 0) {
        setVendor(response?.data?.vendors);
        setStats(response?.data?.stats);
      } else {
        setVendor([]);
        setStats({
          total: 0,
          pending: 0,
          verified: 0,
          rejected: 0,
          suspended: 0,
        });
        setVendorError(response.data?.errorMessage);
      }
    } catch (error) {
      setVendorError("Something went wrong");

      console.log(error); // TODO proper error
    }
  };

  const getVendorSpeciality = async (e) => {
    try {
      const response = await axios.get(
        `${GET_VENDOR_SPECIALITY}?companyId=${decode.id}`
      );
      console.log("speciality", response);

      if (response.data?.success) {
        setVendorSpeciality(response.data.specialties);
        let mycat = await response.data.specialties.map((sp) => ({
          label: sp.specialty,
          value: sp._id,
        }));
        setCategories(mycat);
      } else {
        setVendorError(response.data?.errorMessage);
      }
    } catch (error) {
      setVendorError("Something went wrong");

      console.log(error); // TODO proper error
    }
  };
  async function editVendor(event) {
    event.preventDefault();

    if (!managerFirstName) {
      setcheck_first(false);
      return setmsg_error("Cannot be empty");
    } else {
      setcheck_first(true);
    }

    if (managerFirstName) {
      if (!managerFirstName.match(/^[A-Za-z]+$/)) {
        setcheck_first(false);
        return setmsg_error("Only Letters Are Allowed");
      } else {
        setcheck_first(true);
      }
    }

    if (!managerLastName) {
      setcheck_last(false);
      return setmsg_error1("Cannot be empty");
    } else {
      setcheck_last(true);
    }

    if (managerLastName) {
      if (!managerLastName.match(/^[A-Za-z]+$/)) {
        setcheck_last(false);
        return setmsg_error1("Only Letters are Allowed");
      } else {
        setcheck_last(true);
      }
    }

    if (!managerEmail) {
      setcheck_email(false);
      return setmsg_error4("Cannot be empty");
    } else {
      setcheck_email(true);
    }

    if (managerEmail) {
      if (!managerEmail.match(/\S+@\S+\.\S+/)) {
        setcheck_email(false);
        return setmsg_error4("Enter Valid Email Address");
      } else {
        setcheck_email(true);
      }
    }

    if (!managerPhone) {
      setcheck_mobile(false);
      return setmsg_error5("Cannot be empty");
    } else {
      setcheck_mobile(true);
    }

    if (managerPhone) {
      if (managerPhone.length !== 10) {
        setcheck_mobile(false);
        return setmsg_error5("Invalid Phone Number");
      } else {
        setcheck_mobile(true);
      }
    }
    if (!managerAgency) {
      setCheck_agency(false);
      return setmsg_error3("Cannot be empty");
    } else {
      setCheck_agency(false);
    }

    // if (Propertys.length <= 0) {
    //   setcheck_name(false);
    //   return setmsg_error3("Cannot be empty");
    // } else {
    //   setcheck_name(true);
    // }

    if (selectedCategories.length <= 0) {
      setCheck_categories(false);
      return setmsg_error7("Cannot be empty");
    } else {
      setCheck_categories(true);
    }

    // if (!managerAddress) {
    //   setCheck_address(false);
    //   return setmsg_error6("Cannot be empty");
    // } else {
    //   setCheck_address(true);
    // }

    // if (selectedFiles.length <= 0) {
    //     setcheck_document(false)
    //     setmsg_error8("Cannot be empty")
    // }
    // else {
    //     setcheck_document(true)
    // }

    if (
      managerFirstName &&
      check_first &&
      managerLastName &&
      check_last &&
      // Propertys &&
      check_name &&
      managerEmail &&
      check_email &&
      managerPhone &&
      check_mobile &&
      selectedCategories &&
      check_categories &&
      // managerAddress &&
      check_address &&
      managerAgency &&
      check_agency
    ) {
      const saveSpinner = document.getElementById("saveSpinner");
      const failedSaveErrorIcon = document.getElementById(
        "failedSaveErrorIcon"
      );
      const managerSaveBtn = document.getElementById("managerSaveBtn");
      const errorSpan = document.getElementById("errorSpan");

      managerSaveBtn.disabled = true;
      saveSpinner.style.display = "inline-block";
      failedSaveErrorIcon.style.display = "none";
      errorSpan.style.display = "none";

      try {
        const response = await axios.put(UPDATE_VENDOR, {
          first_name: managerFirstName,
          last_name: managerLastName,
          email: managerEmail,
          contact_no: managerPhone,
          specialties: selectedCategories,
          agency_name: managerAgency,
          address: managerAddress,
        });

        if (response.data.status === 200) {
          window.location.replace("/viewvendor");
        } else if (response.data.status === 201) {
          errorSpan.innerText =
            response.data.errorMessage || "Something went wrong";
          saveSpinner.style.display = "none";
          managerSaveBtn.disabled = false;
          failedSaveErrorIcon.style.display = "inline-block";
          errorSpan.style.display = "inline-block";
        } else {
          errorSpan.innerText =
            response.data.errorMessage || "Something went wrong";
          saveSpinner.style.display = "none";
          managerSaveBtn.disabled = false;
          failedSaveErrorIcon.style.display = "inline-block";
          errorSpan.style.display = "inline-block";
        }
      } catch (error) {
        saveSpinner.style.display = "none";
        managerSaveBtn.disabled = false;
        failedSaveErrorIcon.display = "inline-block";
      }
    }
  }

  const handleDeleteClick = async (vendorId) => {
    const confirmed = window.confirm("Are you sure you want to delete?");
    if (confirmed) {
      try {
        const response = await axios.post(`/vendor/delete_vendor`, {
          vendor: vendorId,
        });
        if (response.data.success) {
          window.location.replace("/viewvendor");
        }
      } catch (error) {
        // TODO proper Error
      }
    }
  };

  const verification = async (id) => {
    console.log(id, "hello");
    let updatedList = vendor.map((item) => {
      if (item._id == id) {
        return { ...item, loading: true }; //gets everything that was already in item, and updates "done"
      }
      return item; // else return unmodified item
    });
    setVendor(updatedList);
    try {
      const response = await axios.post(ADD_COMPANY_VENDOR, {
        vendor_id: id,
        companyID: decode.id,
      });

      if (response.data.success) {
        let updatedList = vendor.map((item) => {
          if (item._id == id) {
            return { ...item, verified: true }; //gets everything that was already in item, and updates "done"
          }
          return item; // else return unmodified item
        });
        setVendor(updatedList);
      }
    } catch (error) {
      // TODO proper message
      console.log("Unable to fetch");
      let updatedList = vendor.map((item) => {
        if (item._id == id) {
          return { ...item, loading: false }; //gets everything that was already in item, and updates "done"
        }
        return item; // else return unmodified item
      });
      setVendor(updatedList);
    }
  };

  const removeRequest = async (id) => {
    let updatedList = vendor.map((item) => {
      if (item._id == id) {
        return { ...item, loading: true }; //gets everything that was already in item, and updates "done"
      }
      return item; // else return unmodified item
    });
    setVendor(updatedList);
    try {
      const response = await axios.post(REMOVE_COMPANY_VENDOR, {
        vendor_id: id,
        companyID: decode.id,
      });

      if (response.data.success) {
        let updatedList = vendor.map((item) => {
          if (item._id == id) {
            return { ...item, removed: true }; //gets everything that was already in item, and updates "done"
          }
          return item; // else return unmodified item
        });
        setVendor(updatedList);
      }
    } catch (error) {
      // TODO proper message
      console.log("Unable to fetch");
      let updatedList = vendor.map((item) => {
        if (item._id == id) {
          return { ...item, loading: false }; //gets everything that was already in item, and updates "done"
        }
        return item; // else return unmodified item
      });
      setVendor(updatedList);
    }
  };

  const getColor = (val) => {
    switch (val) {
      case "Verified":
        return "btn btn-success";
      case "Rejected":
        return "btn btn-danger";
      default:
        return "btn btn-warning ";
    }
  };
  const handleUpdate = async (id, val) => {
    try {
      await axios
        .post("/vendor/status-update", {
          vendorID: id,
          vendorStatus: val,
        })
        .then((res) => {
          ClearTicket();
          toast.success(res.data.message);
        });
    } catch (error) {
      console.log(error.message);
    }
  };

  const FilterSearch = async () => {
    try {
      const response = await axios.get(
        `${ADD_VENDOR()}&first_name=${name}&city=${cityFilter}&contact=${filterContact}&status=${filterStatus}&rating=${filterRating}&specialties=${speciality}&primaryID=${primaryID}`
      );
      if (response.data?.success) {
        setVendor(response?.data?.vendors);
        setStats(response?.data?.stats);
      } else {
        setVendor([]);
        setStats({
          total: 0,
          pending: 0,
          verified: 0,
          rejected: 0,
          suspended: 0,
        });
        setVendorError(response.data?.errorMessage);
      }
    } catch (error) {
      // TODO proper message
      console.log("Unable to fetch");
    }
  };

  useEffect(() => {
    // dispatch(onGetInvoices());
    getVendor();
    getVendorSpeciality();
  }, []);

  const ClearTicket = () => {
    setFilterStatus("");
    setName("");
    setPrimaryID("");
    setSpeciality("");
    setFilterContact("");
    setFilterRating("");
    setCity("");
    setTimeout(() => {
      document.getElementById("ticketfilter").click();
    }, 1000);
  };
  return (
    <React.Fragment>
      <div className="page-content">
        <MetaTags>
          <title>Rentdigicare | Vendors</title>
        </MetaTags>
        <div className="container-fluid">
          <Breadcrumbs title="Home" breadcrumbItem="Vendors" />
          <Row>
            <Col xl={12}>
              <Card>
                <CardHeader>
                  <div className="row">
                    <div className="col-md-6 d-flex">
                      <div className="mb mx-2">
                        <h5 className="card-title">
                          Total
                          <span className="text-muted fw-normal ms-1">
                            ({stats?.total})
                          </span>
                        </h5>
                      </div>
                      {/* <div className="mx-2">
                        <h5 className="card-title">
                          Pending
                          <span className="text-muted fw-normal ms-1">
                            ({stats?.pending})
                          </span>
                        </h5>
                      </div> */}
                      <div className="mx-2">
                        <h5 className="card-title">
                          Verified
                          <span className="text-muted fw-normal ms-1">
                            ({stats?.verified})
                          </span>
                        </h5>
                      </div>
                      <div className="mx-2">
                        <h5 className="card-title">
                          Rejected
                          <span className="text-muted fw-normal ms-1">
                            ({stats?.rejected})
                          </span>
                        </h5>
                      </div>
                      <div className="mx-2">
                        <h5 className="card-title">
                          Suspended
                          <span className="text-muted fw-normal ms-1">
                            ({stats?.suspended})
                          </span>
                        </h5>
                      </div>
                    </div>
                    <div className="col-md-6 d-flex flex-wrap align-items-center justify-content-end">
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
                        {/* <Dropdown
                          isOpen={btnsuccess1}
                          toggle={() => setBtnsuccess1(!btnsuccess1)}
                        >
                          <DropdownToggle tag="button" className="btn btn-success mr-10">
                            Show Items <i className="mdi mdi-chevron-down" />
                          </DropdownToggle>
                          <DropdownMenu>
                            <DropdownItem>Active</DropdownItem>
                            <DropdownItem>Inactive</DropdownItem>
                          </DropdownMenu>
                        </Dropdown> */}
                        {decode.role === "company" && (
                          <button
                            type="button"
                            onClick={() => {
                              history.push("/vendor_application");
                            }}
                            className="btn btn-light mx-3"
                            data-toggle="modal"
                            data-target=".bs-example-modal-lg"
                          >
                            <i className="bx bx-plus me-1"></i> Add Vendors
                          </button>
                        )}
                        {/* <Modal
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
                              Add Vendors
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
                            <Form>
                              <div className="row align-items-center">
                                <div className="col-md-6">
                                  <div className="mb-3">
                                    <Label
                                      className="form-label"
                                      htmlFor="formrow-name-input"
                                    >
                                      Vendor Name
                                    </Label>
                                    <Input
                                      type="text"
                                      className="form-control"
                                      id="formrow-name-input"
                                    />
                                  </div>
                                </div>
                                <div className="col-md-6">
                                  <div className="mb-3">
                                    <Label
                                      className="form-label"
                                      htmlFor="formrow-code-input"
                                    >
                                      Vendor Code
                                    </Label>
                                    <Input
                                      type="text"
                                      className="form-control"
                                      id="formrow-code-input"
                                    />
                                  </div>
                                </div>
                                <div className="col-md-6">
                                  <div className="mb-3">
                                    <Label className="form-Label">
                                      Category
                                    </Label>
                                    <select className="form-select">
                                      <option>Select One</option>
                                      <option>Category 1</option>
                                      <option>Category 2</option>
                                      <option>Category 3</option>
                                      <option>Category 4</option>
                                    </select>
                                  </div>
                                </div>
                                <div className="col-md-6">
                                  <div className="mb-3">
                                    <Label className="form-Label">Active</Label>
                                    <select className="form-select">
                                      <option>Select</option>
                                      <option>Yes</option>
                                      <option>No</option>
                                    </select>
                                  </div>
                                </div>
                                <div className="col-md-6">
                                  <div className="mb-3">
                                    <Label className="form-Label">
                                      Rate/Term
                                    </Label>
                                    <div className="row">
                                      <div className="col-md-8">
                                        <div className="mb-3">
                                          <Input
                                            type="text"
                                            className="form-control"
                                            id="formrow-code-input"
                                          />
                                        </div>
                                      </div>
                                      <div className="col-md-4">
                                        <div className="mb-3">
                                          <select className="form-select">
                                            <option>Select</option>
                                            <option>Hour</option>
                                            <option>Week</option>
                                            <option>Month</option>
                                          </select>
                                        </div>
                                      </div>
                                    </div>
                                  </div>
                                </div>
                                <div className="col-md-12">
                                  <Card>
                                    <CardBody>
                                      <h4 className="card-title mb-4">
                                        Details
                                      </h4>
                                      <div className="row">
                                        <div className="col-md-6">
                                          <div className="mb-3">
                                            <Label
                                              className="form-label"
                                              htmlFor="formrow-address-input"
                                            >
                                              Address1
                                            </Label>
                                            <Input
                                              type="text"
                                              className="form-control"
                                              id="formrow-address-input"
                                            />
                                          </div>
                                        </div>
                                        <div className="col-md-6">
                                          <div className="mb-3">
                                            <Label
                                              className="form-label"
                                              htmlFor="formrow-address-input"
                                            >
                                              Address2
                                            </Label>
                                            <Input
                                              type="text"
                                              className="form-control"
                                              id="formrow-address-input"
                                            />
                                          </div>
                                        </div>
                                        <div className="col-md-6">
                                          <div className="mb-3">
                                            <Label
                                              className="form-label"
                                              htmlFor="formrow-city-input"
                                            >
                                              City
                                            </Label>
                                            <Input
                                              type="text"
                                              className="form-control"
                                              id="formrow-city-input"
                                            />
                                          </div>
                                        </div>
                                        <div className="col-md-6">
                                          <div className="mb-3">
                                            <Label
                                              className="form-label"
                                              htmlFor="formrow-state-input"
                                            >
                                              State/Province
                                            </Label>
                                            <Input
                                              type="text"
                                              className="form-control"
                                              id="formrow-state-input"
                                            />
                                          </div>
                                        </div>
                                        <div className="col-md-6">
                                          <div className="mb-3">
                                            <Label
                                              className="form-label"
                                              htmlFor="formrow-postal-input"
                                            >
                                              Postal/Zip Code
                                            </Label>
                                            <Input
                                              type="text"
                                              className="form-control"
                                              id="formrow-postal-input"
                                            />
                                          </div>
                                        </div>
                                        <div className="col-md-6">
                                          <div className="mb-3">
                                            <Label
                                              className="form-label"
                                              htmlFor="formrow-contact-input"
                                            >
                                              Telephone 1
                                            </Label>
                                            <Input
                                              type="text"
                                              className="form-control"
                                              id="formrow-contact-input"
                                            />
                                          </div>
                                        </div>
                                        <div className="col-md-6">
                                          <div className="mb-3">
                                            <Label
                                              className="form-label"
                                              htmlFor="formrow-contact-input"
                                            >
                                              Telephone 2
                                            </Label>
                                            <Input
                                              type="text"
                                              className="form-control"
                                              id="formrow-contact-input"
                                            />
                                          </div>
                                        </div>
                                        <div className="col-md-6">
                                          <div className="mb-3">
                                            <Label
                                              className="form-label"
                                              htmlFor="formrow-fax-input"
                                            >
                                              Fax
                                            </Label>
                                            <Input
                                              type="text"
                                              className="form-control"
                                              id="formrow-fax-input"
                                            />
                                          </div>
                                        </div>
                                        <div className="col-md-6">
                                          <div className="mb-3">
                                            <Label
                                              className="form-label"
                                              htmlFor="formrow-contact-input"
                                            >
                                              Contact
                                            </Label>
                                            <Input
                                              type="text"
                                              className="form-control"
                                              id="formrow-contact-input"
                                            />
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
                                      </div>
                                    </CardBody>
                                  </Card>
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
                          </div>
                        </Modal> */}
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
                                <div className="row align-items-center">
                                  <div className="col-md-3">
                                    <div className="mb-3">
                                      <Label className="form-Label">
                                        Category
                                      </Label>
                                      <select
                                        value={speciality}
                                        onChange={(e) => {
                                          setSpeciality(e.target.value);
                                        }}
                                        className="form-select"
                                      >
                                        <option selected>Select</option>
                                        {vendorspeciality.map((items) => {
                                          return (
                                            <option value={items._id}>
                                              {items.specialty}
                                            </option>
                                          );
                                        })}
                                      </select>
                                    </div>
                                  </div>
                                  <div className="col-md-3">
                                    <div className="mb-3">
                                      <Label
                                        className="form-label"
                                        htmlFor="formrow-code-input"
                                      >
                                        Vendor Id
                                      </Label>
                                      <Input
                                        placeholder="Enter vendor id"
                                        onChange={(e) => {
                                          setPrimaryID(e.target.value);
                                        }}
                                        type="text"
                                        className="form-control"
                                        id="formrow-code-input"
                                        value={primaryID}
                                      />
                                    </div>
                                  </div>
                                  <div className="col-md-3">
                                    <div className="mb-3">
                                      <Label
                                        className="form-label"
                                        htmlFor="formrow-name-input"
                                      >
                                        Name
                                      </Label>
                                      <Input
                                        placeholder="Enter vendor name"
                                        onChange={(e) => {
                                          setName(e.target.value);
                                        }}
                                        className="form-control"
                                        id="formrow-name-input"
                                        value={name}
                                      />
                                    </div>
                                  </div>
                                  <div className="col-md-3">
                                    <div className="mb-3">
                                      <Label
                                        className="form-label"
                                        htmlFor="formrow-code-input"
                                      >
                                        Contact
                                      </Label>
                                      <Input
                                        placeholder="Enter vendor contact number"
                                        onChange={(e) => {
                                          setFilterContact(e.target.value);
                                        }}
                                        type="text"
                                        className="form-control"
                                        id="formrow-code-input"
                                        value={filterContact}
                                      />
                                    </div>
                                  </div>

                                  <div className="col-md-3">
                                    <div className="mb-3">
                                      <Label
                                        className="form-label"
                                        htmlFor="formrow-code-input"
                                      >
                                        City
                                      </Label>
                                      <Input
                                        placeholder="Enter vendor city"
                                        onChange={(e) => {
                                          setCity(e.target.value);
                                        }}
                                        type="text"
                                        className="form-control"
                                        id="formrow-code-input"
                                        value={cityFilter}
                                      />
                                    </div>
                                  </div>
                                  <div className="col-md-3">
                                    <div className="mb-3">
                                      <Label className="form-Label">
                                        Status
                                      </Label>
                                      <select
                                        className="form-select"
                                        onChange={(e) => {
                                          setFilterStatus(e.target.value);
                                        }}
                                        value={filterStatus}
                                      >
                                        <option selected>Select</option>
                                        {[
                                          "Verified",
                                          "Rejected",
                                          "Suspended",
                                        ]?.map((v) => (
                                          <option
                                            className="text-capitalize"
                                            key={v}
                                            value={v}
                                          >
                                            {v}
                                          </option>
                                        ))}
                                      </select>
                                    </div>
                                  </div>
                                  <div className="col-md-3">
                                    <div className="mb-3">
                                      <Label className="form-Label">
                                        Rating
                                      </Label>
                                      <select
                                        className="form-select"
                                        onChange={(e) => {
                                          setFilterRating(e.target.value);
                                        }}
                                        value={filterRating}
                                      >
                                        <option selected>Select</option>
                                        {[1, 2, 3, 4, 5]?.map((v) => (
                                          <option key={v} value={v}>
                                            {v}
                                          </option>
                                        ))}
                                      </select>
                                    </div>
                                  </div>
                                  <div className="col-md-12 btn-group d-flex justify-content-end">
                                    <div className="srch-btn">
                                      <button
                                        type="submit"
                                        id="ticketfilter"
                                        onClick={(e) => {
                                          e.preventDefault();
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
                                          e.preventDefault();
                                          ClearTicket();
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
                    <Table className="table-striped table-bordered mb-0">
                      <thead>
                        <tr>
                          <th scope="col">#</th>
                          <th scope="col">Vendor Id</th>
                          <th scope="col">Category</th>
                          {/* <th scope="col">Code</th> */}
                          <th scope="col">Name</th>
                          <th scope="col">Email</th>
                          <th scope="col">Address</th>
                          <th scope="col">Contact</th>
                          <th scope="col">Status</th>
                          <th scope="col">Rating</th>
                          <th scope="col">Completed/Total Jobs</th>
                          {decode.role == "company" && (
                            <th scope="col">Action</th>
                          )}
                          {/* <th scope="col">Action</th> */}
                        </tr>
                      </thead>

                      {vendor
                        .slice(
                          (currentPage - 1) * pageLimit,
                          (currentPage - 1) * pageLimit + pageLimit
                        )
                        .map((item, i) => {
                          console.log(vendor, "vendor");
                          return (
                            <tbody>
                              <tr>
                                <td>{(currentPage - 1) * 10 + i + 1} </td>
                                <td>{item.primaryID}</td>
                                <td>
                                  {/* <a
                                  href="#!"
                                  onClick={() => {
                                    tog_large2();
                                  }}
                                  data-toggle="modal"
                                  data-target=".bs-example-modal-lg"
                                > */}
                                  {item.specialties.length > 0
                                    ? item.specialties
                                        .map((a) => a.specialty)
                                        .join()
                                    : "No Category found"}
                                  {/* </a> */}
                                  <Modal
                                    size="lg"
                                    isOpen={modal_large2}
                                    toggle={() => {
                                      tog_large2();
                                    }}
                                  >
                                    <div className="modal-header">
                                      <h5
                                        className="modal-title mt-0"
                                        id="myLargeModalLabel"
                                      >
                                        View Vendors
                                      </h5>
                                      <button
                                        onClick={() => {
                                          setmodal_large2(false);
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
                                      <Form>
                                        <div className="row align-items-center">
                                          <div className="col-md-6">
                                            <div className="mb-3">
                                              <Label
                                                className="form-label"
                                                htmlFor="formrow-name-input"
                                              >
                                                Vendor Name
                                              </Label>
                                              <Input
                                                type="text"
                                                className="form-control"
                                                value="Danish"
                                                id="formrow-name-input"
                                                readonly
                                              />
                                            </div>
                                          </div>
                                          <div className="col-md-6">
                                            <div className="mb-3">
                                              <Label
                                                className="form-label"
                                                htmlFor="formrow-code-input"
                                              >
                                                Vendor Code
                                              </Label>
                                              <Input
                                                type="text"
                                                className="form-control"
                                                value="12345"
                                                id="formrow-code-input"
                                                readonly
                                              />
                                            </div>
                                          </div>
                                          <div className="col-md-6">
                                            <div className="mb-3">
                                              <Label className="form-Label">
                                                Category
                                              </Label>
                                              <Input
                                                type="text"
                                                className="form-control"
                                                value="Category 1"
                                                id="formrow-cat-input"
                                                readonly
                                              />
                                            </div>
                                          </div>
                                          <div className="col-md-6">
                                            <div className="mb-3">
                                              <Label className="form-Label">
                                                Active
                                              </Label>
                                              <Input
                                                type="text"
                                                className="form-control"
                                                value="Yes"
                                                id="formrow-stat-input"
                                                readonly
                                              />
                                            </div>
                                          </div>
                                          <div className="col-md-6">
                                            <div className="mb-3">
                                              <Label className="form-Label">
                                                Rate/Term
                                              </Label>
                                              <div className="row">
                                                <div className="col-md-8">
                                                  <div className="mb-3">
                                                    <Input
                                                      type="text"
                                                      className="form-control"
                                                      value="100"
                                                      id="formrow-code-input"
                                                      readonly
                                                    />
                                                  </div>
                                                </div>
                                                <div className="col-md-4">
                                                  <div className="mb-3">
                                                    <Input
                                                      type="text"
                                                      className="form-control"
                                                      value="Hours"
                                                      id="formrow-code-input"
                                                      readonly
                                                    />
                                                  </div>
                                                </div>
                                              </div>
                                            </div>
                                          </div>
                                          <div className="col-md-12">
                                            <Card>
                                              <CardBody>
                                                <h4 className="card-title mb-4">
                                                  Details
                                                </h4>
                                                <div className="row">
                                                  <div className="col-md-6">
                                                    <div className="mb-3">
                                                      <Label
                                                        className="form-label"
                                                        htmlFor="formrow-address-input"
                                                      >
                                                        Address1
                                                      </Label>
                                                      <Input
                                                        type="text"
                                                        className="form-control"
                                                        value="#9, Industrial Area, near Rajdeep Nagar"
                                                        id="formrow-address-input"
                                                        readonly
                                                      />
                                                    </div>
                                                  </div>
                                                  <div className="col-md-6">
                                                    <div className="mb-3">
                                                      <Label
                                                        className="form-label"
                                                        htmlFor="formrow-address-input"
                                                      >
                                                        Address2
                                                      </Label>
                                                      <Input
                                                        type="text"
                                                        className="form-control"
                                                        value="#9, Industrial Area, near Rajdeep Nagar"
                                                        id="formrow-address-input"
                                                        readonly
                                                      />
                                                    </div>
                                                  </div>
                                                  <div className="col-md-6">
                                                    <div className="mb-3">
                                                      <Label
                                                        className="form-label"
                                                        htmlFor="formrow-city-input"
                                                      >
                                                        City
                                                      </Label>
                                                      <Input
                                                        type="text"
                                                        className="form-control"
                                                        value="Toronto"
                                                        id="formrow-city-input"
                                                        readonly
                                                      />
                                                    </div>
                                                  </div>
                                                  <div className="col-md-6">
                                                    <div className="mb-3">
                                                      <Label
                                                        className="form-label"
                                                        htmlFor="formrow-state-input"
                                                      >
                                                        State/Province
                                                      </Label>
                                                      <Input
                                                        type="text"
                                                        className="form-control"
                                                        value="Brampton"
                                                        id="formrow-state-input"
                                                        readonly
                                                      />
                                                    </div>
                                                  </div>
                                                  <div className="col-md-6">
                                                    <div className="mb-3">
                                                      <Label
                                                        className="form-label"
                                                        htmlFor="formrow-postal-input"
                                                      >
                                                        Postal/Zip Code
                                                      </Label>
                                                      <Input
                                                        type="text"
                                                        className="form-control"
                                                        value="143416"
                                                        id="formrow-postal-input"
                                                        readonly
                                                      />
                                                    </div>
                                                  </div>
                                                  <div className="col-md-6">
                                                    <div className="mb-3">
                                                      <Label
                                                        className="form-label"
                                                        htmlFor="formrow-contact-input"
                                                      >
                                                        Telephone 1
                                                      </Label>
                                                      <Input
                                                        type="text"
                                                        className="form-control"
                                                        value="143416"
                                                        id="formrow-contact-input"
                                                        readonly
                                                      />
                                                    </div>
                                                  </div>
                                                  <div className="col-md-6">
                                                    <div className="mb-3">
                                                      <Label
                                                        className="form-label"
                                                        htmlFor="formrow-contact-input"
                                                      >
                                                        Telephone 2
                                                      </Label>
                                                      <Input
                                                        type="text"
                                                        className="form-control"
                                                        value="143416"
                                                        id="formrow-contact-input"
                                                        readonly
                                                      />
                                                    </div>
                                                  </div>
                                                  <div className="col-md-6">
                                                    <div className="mb-3">
                                                      <Label
                                                        className="form-label"
                                                        htmlFor="formrow-fax-input"
                                                      >
                                                        Fax
                                                      </Label>
                                                      <Input
                                                        type="text"
                                                        className="form-control"
                                                        value="243416"
                                                        id="formrow-fax-input"
                                                        readonly
                                                      />
                                                    </div>
                                                  </div>
                                                  <div className="col-md-6">
                                                    <div className="mb-3">
                                                      <Label
                                                        className="form-label"
                                                        htmlFor="formrow-contact-input"
                                                      >
                                                        Contact
                                                      </Label>
                                                      <Input
                                                        type="text"
                                                        className="form-control"
                                                        value="143416"
                                                        id="formrow-contact-input"
                                                        readonly
                                                      />
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
                                                        value="abc@gmail.com"
                                                        id="formrow-email-input"
                                                        readonly
                                                      />
                                                    </div>
                                                  </div>
                                                </div>
                                              </CardBody>
                                            </Card>
                                          </div>
                                        </div>
                                      </Form>
                                    </div>
                                  </Modal>
                                </td>
                                {/* <td>18</td> */}
                                <td>{item.first_name}</td>
                                <td>{item.email}</td>
                                <td>{item.address}</td>
                                <td>{item.contact_no}</td>
                                <td className="text-capitalize">
                                  {decode.role === "company" ? (
                                    <select
                                      className={`form-select applicant-status btn-sm ${getColor(
                                        item?.status
                                      )}`}
                                      style={{ width: "120px" }}
                                      defaultValue={item?.status}
                                      onChange={(event) => {
                                        handleUpdate(
                                          item._id,
                                          event.target.value
                                        );
                                      }}
                                    >
                                      <option
                                        className="btn btn-light"
                                        value={"Suspended"}
                                      >
                                        Suspended
                                      </option>
                                      <option
                                        className="btn btn-light "
                                        value="Verified"
                                      >
                                        Verified
                                      </option>
                                      <option
                                        className="btn btn-light "
                                        value="Rejected"
                                      >
                                        Rejected
                                      </option>
                                    </select>
                                  ) : (
                                    item?.status
                                  )}
                                </td>
                                <td>
                                  {" "}
                                  <Rating
                                    initialValue={
                                      item?.tickets?.[0]?.totalRating || 0
                                    }
                                    readonly={true}
                                    size={20}
                                  />
                                </td>
                                <td>
                                  {" "}
                                  {item?.tickets?.length > 0 &&
                                    `${item?.tickets?.map(
                                      (a) => a.completed
                                    )}/${item?.tickets?.map((a) => a?.total)}`}
                                </td>
                                {decode.role == "company" && (
                                  <td>
                                    <div className="d-flex gap-3">
                                      <Link className="text-success" to="#">
                                        <i
                                          className="mdi mdi-pencil font-size-18 "
                                          id="edittooltip"
                                          onClick={async () => {
                                            // await getProperties(decode.domain);
                                            // await getSpeciality()
                                            tog_large(item);
                                          }}
                                          type="button"
                                          data-dismiss="modal"
                                          aria-label="Close"
                                        ></i>
                                      </Link>
                                      <Link className="text-danger" to="#">
                                        <i
                                          className="mdi mdi-delete font-size-18"
                                          id="deletetooltip"
                                          onClick={() =>
                                            handleDeleteClick(item._id)
                                          }
                                          // onClick={async (e) => {
                                          //   e.preventDefault();
                                          //   await deleteTechnicalStaff(props.id, props.userID)
                                          // }}
                                        ></i>
                                      </Link>
                                    </div>
                                  </td>
                                )}
                                {/* <td>{item.loading ? <button className="btn btn-primary w-100"><div
                                                                id="saveSpinner"
                                                                style={{
                                                                    height: "15px",
                                                                    width: "15px",
                                                                    marginLeft: "5px",
                                                                }}
                                                                className="spinner-border"
                                                                role="status"
                                                            > </div></button>
                                                                :
                                                                item.verified || item.removed ?

                                                                    <div>
                                                                        {item.verified && <div style={{ color: "green" }}>Verified</div>}
                                                                        {item.removed && <div style={{ color: "red" }}>Removed</div>}

                                                                    </div>

                                                                    :
                                                                    <div>
                                                                        <button
                                                                            onClick={() => { verification(item._id, i) }}
                                                                            className="btn btn-primary mo-mb-2 mr-10"
                                                                            type="button"
                                                                            style={{ cursor: "pointer" }}
                                                                        >
                                                                            verify
                                                                        </button>
                                                                        <button
                                                                            onClick={() => { removeRequest(item._id, i) }}
                                                                            className="btn btn-danger mo-mb-2 mr-10"
                                                                            type="button"
                                                                            style={{ cursor: "pointer" }}
                                                                        >
                                                                            Delete
                                                                        </button>
                                                                    </div>
                                                            }</td> */}

                                {/* <td>
                                <div className="d-flex gap-3">
                                  <Link className="text-success" to="#">
                                    <i
                                      className="mdi mdi-pencil font-size-18"
                                      id="edittooltip"
                                      onClick={() => {
                                        tog_large()
                                      }}
                                      data-toggle="modal"
                                      data-target=".bs-example-modal-lg"
                                    ></i>
                                  </Link>
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
                              </td> */}
                              </tr>
                              {/* <tr>
                          <td>2</td>
                          <td>
                            <a href="#!"
                              onClick={() => {
                                tog_large2()
                              }}
                              data-toggle="modal"
                              data-target=".bs-example-modal-lg"
                            >
                              HVAC/Refrigeration
                            </a>
                          </td>
                          <td>18</td>
                          <td>Danish Sharma</td>
                          <td>#9, Industrial Area, near Rajdeep Nagar</td>
                          <td>Ambala</td>
                          <td>8550605580
                          </td>
                          <td>
                            <div>
                              <button
                                type="button"
                                className="btn btn-soft-light btn-sm w-xs waves-effect btn-label waves-light"
                              >
                                <i className="bx bx-download label-icon"></i> Excel
                              </button>
                            </div>
                          </td>
                          <td>Yes</td>
                          <td>
                            <div className="d-flex gap-3">
                              <Link className="text-success" to="#">
                                <i
                                  className="mdi mdi-pencil font-size-18"
                                  id="edittooltip"
                                  onClick={() => {
                                    tog_large()
                                  }}
                                  data-toggle="modal"
                                  data-target=".bs-example-modal-lg"
                                ></i>
                              </Link>
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
                          <td>
                            <a href="#!"
                              onClick={() => {
                                tog_large2()
                              }}
                              data-toggle="modal"
                              data-target=".bs-example-modal-lg"
                            >
                              Plumbing
                            </a>
                          </td>
                          <td>18</td>
                          <td>Danish Sharma</td>
                          <td>#9, Industrial Area, near Rajdeep Nagar</td>
                          <td>Ambala</td>
                          <td>8550605580
                          </td>
                          <td>
                            <div>
                              <button
                                type="button"
                                className="btn btn-soft-light btn-sm w-xs waves-effect btn-label waves-light"
                              >
                                <i className="bx bx-download label-icon"></i> Excel
                              </button>
                            </div>
                          </td>
                          <td>Yes</td>
                          <td>
                            <div className="d-flex gap-3">
                              <Link className="text-success" to="#">
                                <i
                                  className="mdi mdi-pencil font-size-18"
                                  id="edittooltip"
                                  onClick={() => {
                                    tog_large()
                                  }}
                                  data-toggle="modal"
                                  data-target=".bs-example-modal-lg"
                                ></i>
                              </Link>
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
                          <td>
                            <a href="#!"
                              onClick={() => {
                                tog_large2()
                              }}
                              data-toggle="modal"
                              data-target=".bs-example-modal-lg"
                            >
                              Painting
                            </a>
                          </td>
                          <td>18</td>
                          <td>Danish Sharma</td>
                          <td>#9, Industrial Area, near Rajdeep Nagar</td>
                          <td>Ambala</td>
                          <td>8550605580
                          </td>
                          <td>
                            <div>
                              <button
                                type="button"
                                className="btn btn-soft-light btn-sm w-xs waves-effect btn-label waves-light"
                              >
                                <i className="bx bx-download label-icon"></i> Excel
                              </button>
                            </div>
                          </td>
                          <td>Yes</td>
                          <td>
                            <div className="d-flex gap-3">
                              <Link className="text-success" to="#">
                                <i
                                  className="mdi mdi-pencil font-size-18"
                                  id="edittooltip"
                                  onClick={() => {
                                    tog_large()
                                  }}
                                  data-toggle="modal"
                                  data-target=".bs-example-modal-lg"
                                ></i>
                              </Link>
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
                          <td>Painting</td>
                          <td>18</td>
                          <td>Danish Sharma</td>
                          <td>#9, Industrial Area, near Rajdeep Nagar</td>
                          <td>Ambala</td>
                          <td>8550605580
                          </td>
                          <td>
                            <div>
                              <button
                                type="button"
                                className="btn btn-soft-light btn-sm w-xs waves-effect btn-label waves-light"
                              >
                                <i className="bx bx-download label-icon"></i> Excel
                              </button>
                            </div>
                          </td>
                          <td>Yes</td>
                          <td>
                            <div className="d-flex gap-3">
                              <Link className="text-success" to="#">
                                <i
                                  className="mdi mdi-pencil font-size-18"
                                  id="edittooltip"
                                  onClick={() => {
                                    tog_large()
                                  }}
                                  data-toggle="modal"
                                  data-target=".bs-example-modal-lg"
                                ></i>
                              </Link>
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
 */}
                            </tbody>
                          );
                        })}
                    </Table>
                    <Modal
                      size="lg"
                      isOpen={modal_large}
                      toggle={() => {
                        tog_large();
                      }}
                    >
                      <div className="modal-header">
                        <h5 className="modal-title mt-0" id="myLargeModalLabel">
                          Edit vendor
                        </h5>
                        <button
                          onClick={async () => {
                            tog_large();
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
                        <Form onSubmit={editVendor}>
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
                                  value={managerFirstName}
                                  onChange={(e) => {
                                    setManagerFirstName(e.target.value);
                                  }}
                                  type="text"
                                  className="form-control"
                                  id="formrow-phone-input"
                                />
                                {check_first ? (
                                  ""
                                ) : (
                                  <Label style={{ color: "red" }}>
                                    {msg_error}
                                  </Label>
                                )}
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
                                  value={managerLastName}
                                  onChange={(e) => {
                                    setManagerLastName(e.target.value);
                                  }}
                                  type="text"
                                  className="form-control"
                                  id="formrow-phone-input"
                                />
                                {check_last ? (
                                  ""
                                ) : (
                                  <Label style={{ color: "red" }}>
                                    {msg_error1}
                                  </Label>
                                )}
                              </div>
                            </div>
                            <div className="col-md-6">
                              <div className="mb-3">
                                <Label
                                  className="form-label"
                                  htmlFor="formrow-email-input"
                                >
                                  Email *
                                </Label>
                                <Input
                                  value={managerEmail}
                                  onChange={(e) => {
                                    setManagerEmail(e.target.value);
                                  }}
                                  type="text"
                                  className="form-control"
                                  id="formrow-email-input"
                                  readOnly
                                />
                                {check_email ? (
                                  ""
                                ) : (
                                  <Label style={{ color: "red" }}>
                                    {msg_error4}
                                  </Label>
                                )}
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
                                  value={managerPhone}
                                  onChange={(e) => {
                                    setManagerPhone(e.target.value);
                                  }}
                                  type="number"
                                  onWheel={(e) => e.target.blur()}
                                  className="form-control"
                                  id="formrow-phone-input"
                                  readOnly
                                />
                                {check_mobile ? (
                                  ""
                                ) : (
                                  <Label style={{ color: "red" }}>
                                    {msg_error5}
                                  </Label>
                                )}
                              </div>
                            </div>

                            <div className="col-md-6">
                              <div className="mb-3">
                                <Label
                                  className="form-label"
                                  htmlFor="formrow-facility-input"
                                >
                                  Agency *
                                </Label>
                                <Input
                                  value={managerAgency}
                                  onChange={(e) => {
                                    setManagerAgency(e.target.value);
                                  }}
                                  type="text"
                                  className="form-control"
                                  id="formrow-email-input"
                                />
                                {/* <Select
                    isMulti
                    onChange={(selectedOption) => {
                      const propertys = [];
                      selectedOption.map((property) => {
                        propertys.push(property.value);
                      });
                      setPropertys(propertys);
                    }}
                    options={propertyList}
                    className="basic-multi-select"
                    classNamePrefix="select"
                  /> */}
                                {check_agency ? (
                                  ""
                                ) : (
                                  <Label style={{ color: "red" }}>
                                    {msg_error3}
                                  </Label>
                                )}
                              </div>
                            </div>
                            <div className="col-md-6">
                              <div className="mb-3">
                                <Label
                                  className="form-label"
                                  htmlFor="formrow-facility-input"
                                >
                                  CategorySelect
                                </Label>
                                <Select
                                  isMulti
                                  value={selectedCategories.map((id) =>
                                    categories.find((cat) => id == cat.value)
                                  )}
                                  onChange={(selectedOption) => {
                                    console.log(categories, "kdk");
                                    const speciality = [];
                                    selectedOption.map((property) => {
                                      speciality.push(property.value);
                                    });
                                    setSelectedCategories(speciality);
                                  }}
                                  options={categories}
                                  className="basic-multi-select"
                                  classNamePrefix="Select"
                                />
                                {check_categories ? (
                                  ""
                                ) : (
                                  <Label style={{ color: "red" }}>
                                    {msg_error7}
                                  </Label>
                                )}
                              </div>
                            </div>

                            <div className="col-md-12">
                              <div className="mb-3">
                                <Label
                                  className="form-label"
                                  htmlFor="formrow-firstname-input"
                                >
                                  Address
                                </Label>
                                <Input
                                  value={managerAddress}
                                  onChange={(e) => {
                                    setManagerAddress(e.target.value);
                                  }}
                                  type="textarea"
                                  className="form-control"
                                  id="formrow-phone-input"
                                />
                                {/* {check_address ? (
                                  ""
                                ) : (
                                  <Label style={{ color: "red" }}>
                                    {msg_error6}
                                  </Label>
                                )} */}
                              </div>
                            </div>
                            <div className="col-md-12">
                              <div className="text-end">
                                <span
                                  id="errorSpan"
                                  style={{
                                    color: "red",
                                    fontWeight: "bolder",
                                    marginRight: "10px",
                                    display: "none",
                                  }}
                                ></span>
                                <button
                                  id="managerSaveBtn"
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
                  </div>
                  {vendor.length !== 0 && (
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
                                onClick={() =>
                                  handlePageChange(currentPage - 1)
                                }
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
                            <PaginationItem
                              disabled={currentPage === pageTotal}
                            >
                              <PaginationLink
                                next
                                onClick={() =>
                                  handlePageChange(currentPage + 1)
                                }
                              />
                            </PaginationItem>
                            <PaginationItem
                              disabled={currentPage === pageTotal}
                            >
                              <PaginationLink
                                last
                                onClick={() => handlePageChange(pageTotal)}
                              />
                            </PaginationItem>
                          </Pagination>
                        </div>
                      </Col>
                    </Row>
                  )}
                </CardBody>
              </Card>
            </Col>
          </Row>
        </div>
      </div>
    </React.Fragment>
  );
};
export default Vendors;
