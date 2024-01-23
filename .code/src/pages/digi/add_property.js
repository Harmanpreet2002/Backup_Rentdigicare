import React, { useState, useEffect } from "react";
import MetaTags from "react-meta-tags";
import Select from "react-select";
import { Link } from "react-router-dom";
import axios from "../api/axios";
import jwt_decode from "jwt-decode";
import { SERVER_URL } from "../ServerLink";
import moment from "moment";
// import { Form, FormControl } from "./assets/scss/theme.scss";

import {
  Table,
  Row,
  Col,
  Card,
  CardBody,
  Modal,
  CardHeader,
  FormGroup,
  Collapse,
  Label,
  Form,
  // FormControl,
  Input,
  Pagination,
  PaginationItem,
  PaginationLink,
  ModalFooter,
  ModalBody,
  Button,
  ModalHeader,
} from "reactstrap";
import Dropzone from "react-dropzone";
//Import Breadcrumb
import Breadcrumbs from "../../components/Common/Breadcrumb";
import img4 from "../../assets/images/small/img-4.jpg";

// Importing Components
import PropertyList from "./PropertyList";
import { toast } from "react-toastify";

const AddProperty = (props) => {
  // USE ROLE
  const decode = jwt_decode(window.localStorage.accessToken);
  const decode2 = jwt_decode(window.localStorage.getItem("accessToken"));
  //ENDPOINTS
  const GET_COMPANIES_URL = "/company";
  const GET_LAYOUT_URL = "/layout/all";
  const ADD_PROPERTY_URL = "/property/add";
  const POST_IMAGE_URL = "/property1/img";
  const FILTER_URL = `/property/filter?role=${decode2.role}&domain=${
    decode2.role == "manager" ? decode2.id : decode2.domain
  }`;
  const [selectedFiles, setselectedFiles] = useState([]);

  // for populating dropdowns
  const [companyList, setCompanyList] = useState([]);
  const [companyOwner, setCompanyOwner] = useState([]);
  const [editData, seteditData] = useState(false);
  const [editLayout, seteditLayout] = useState([]);
  //  database
  const [title, setTitle] = useState("");
  const [rent, setRent] = useState("");
  const [postal, setPostal] = useState("");
  const [propertySignature, setPropertySignature] = useState("");
  const [address, setAddress] = useState("");
  const [category, setCategory] = useState([]);
  const [location, setLocation] = useState("");
  const [status, setStatus] = useState("");
  const [totalcompanies, settotalcompanies] = useState(0);
  const [active, setActive] = useState(0);
  const [totalproperties, settotalproperties] = useState([]);
  // TOOD working today
  const [managers, setManagers] = useState({});
  const [documents, setDocuments] = useState([]);
  const [layout, setLayout] = useState([]);
  const [currentPage, setCurrentPage] = useState(1);
  const [pageLimit, setPageLimit] = useState(10);
  const [pages, setPages] = useState([]);
  const [categories, setCategories] = useState([]);
  const [manager, setManager] = useState([]);
  const [locationn, setlocationn] = useState([]);
  const [company, setCompany] = useState([]);
  const [propertyname, setPropertyname] = useState([]);
  const [startDate, setstartDate] = useState("");
  const [endDate, setendDate] = useState("");
  const [check_title, setcheck_title] = useState(true);
  const [check_rent, setcheck_rent] = useState(true);
  const [check_postal, setcheck_postal] = useState(true);
  const [check_address, setcheck_address] = useState(true);
  const [check_layout, setcheck_layout] = useState(true);
  const [check_city, setcheck_city] = useState(true);
  const [check_status, setcheck_status] = useState(true);
  const [check_document, setcheck_document] = useState(true);
  const [filterData, setFilterData] = useState(null);
  const [msg_error, setmsg_error] = useState("");
  const [msg_error1, setmsg_error1] = useState("");
  const [msg_error2, setmsg_error2] = useState("");
  const [msg_error3, setmsg_error3] = useState("");
  const [msg_error4, setmsg_error4] = useState("");
  const [rent_error, setrent_error] = useState("");
  const [postal_error, setpostal_error] = useState("");
  const [address_error, setaddress_error] = useState("");
  const [Fun, setFun] = useState(() => {});
  const [loading, setLoading] = useState(false);
  const [showDeleteDialoge, setShowDeleteDialoge] = useState(false);
  const [modal_largee, setmodal_largee] = useState(false);
  const [modal_largee1, setmodal_largee1] = useState(false);
  const [modal_largee2, setmodal_largee2] = useState(false);
  const [propertyID, setPropertyID] = useState("");
  const [selectPropertyManager, setSelectPropertyManager] = useState(null);
  const [selectPropertyName, setSelectPropertyName] = useState(null);
  const [page, setPage] = useState();
  const [stats, setStats] = useState({
    Total: 0,
    Active: 0,
    Inactive: 0,
  });

  const [startPage, setStartPage] = useState(1);

  const pageTotal = Math.ceil(stats.Total / pageLimit);

  function removeBodyCss2() {
    document.body.classList.add("no_padding");
  }
  function tog_largee() {
    setmodal_largee(!modal_large);
    removeBodyCss2();

    // if (editData && editData)
    // if(editData?.document?.length > 0){

    //   setselectedFiles(files);
    // }
  }
  function tog_largee1() {
    setmodal_largee1(!modal_large1);
    removeBodyCss2();
  }
  function tog_largee2() {
    setmodal_largee2(!modal_large2);
    removeBodyCss2();
  }
  const handlePageChange = (page) => {
    setCurrentPage(page);

    if (page > startPage + pageLimit - 1 || page < startPage) {
      setStartPage(Math.max(1, page - pageLimit / 2));
    }
  };

  const dataFilter = async () => {
    let temp = await axios.get(FILTER_URL);
    // if(decode2.role != "admin"){
    setCompany(temp?.data?.properties[0]?.company);
    setCategories(temp?.data?.properties[0]?.category);
    setManager(temp?.data?.properties[0]?.manager);
    setlocationn(temp?.data?.properties[0]?.location);
    setPropertyname(temp?.data?.properties[0]?.property_name);
    // }
  };
  const PROPERTIES_URL = `/property/list?page=${currentPage}&limit=10`;
  const decode1 = jwt_decode(window.localStorage.getItem("accessToken"));
  useEffect(() => {
    dataFilter();
    let total_pages = totalcompanies / pageLimit;
    if (totalcompanies % pageLimit == 0) {
      setPages(Array.from(Array(Math.round(total_pages)).keys()));
    } else {
      setPages(Array.from(Array(parseInt(total_pages) + 1).keys()));
    }
  }, [totalcompanies]);

  useEffect(() => {
    if (props.location?.state?.name !== undefined) {
      getProperties(0, { manager: props.location?.state?.name });
      window.history.replaceState(null, "");
    } else {
      getProperties();
    }
    //setPages(Array.from(Array(Math.round(totalcompanies / pageLimit)).keys()))
    let total_pages = totalcompanies / pageLimit;
    if (totalcompanies % pageLimit == 0) {
      setPages(Array.from(Array(Math.round(total_pages)).keys()));
    } else {
      setPages(Array.from(Array(parseInt(total_pages) + 1).keys()));
    }
  }, [currentPage, props.location?.state?.name]);

  async function TotalProperties(url, data) {
    try {
      const response = await axios.post(url, data);
      if (response.status === 200) {
        setStats(response.data.totalProperties);
      } else {
        console.log("Unable to fetch the resoureces");
      }
    } catch (error) {
      console.log("unable to get applicants", error);
    }
  }
  // under work
  async function getCompanies() {
    try {
      const response = await axios.get(GET_COMPANIES_URL);
      setCompanyList(response.data.companies);
    } catch (error) {
      // TODO proper error message
      console.log(error);
    }
  }
  async function getLayout(url, data) {
    try {
      const response = await axios.post(url, data);
      //setLayout(response.data.layouts[0].layouts);
      response.data.layouts.forEach((element) => {
        setLayout((current) => [
          ...current,
          { label: element.layoutName, value: element._id },
        ]);
        // setLayout.push({ label: element.name, value: element._id });
      });
    } catch (error) {
      console.log(error);
    }
  }

  const handleCloseModal = () => {
    tog_large();

    setcheck_title(true);
    setcheck_rent(true);
    setcheck_layout(true);
    setcheck_city(true);
    setcheck_status(true);
    setcheck_postal(true);
    setcheck_document(true);
    seteditData(false);
    setTitle("");
    setLocation("");
    setStatus("");
    setRent("");
    setPostal("");
    setCategory([]);
    setselectedFiles([]);
    setPropertyID("");
  };

  async function addProperty(event) {
    event.preventDefault();
    // Getting company information from local storage

    if (!title) {
      setcheck_title(false);
      setmsg_error("Property Name is required!");
    } else {
      setcheck_title(true);
    }

    if (title) {
      if (!title.match(/^[a-zA-Z0-9 ]+$/)) {
        setcheck_title(false);
        setmsg_error("Only Letters And Numbers Are Allowed");
      } else {
        setcheck_title(true);
      }
    }

    if (!rent) {
      setcheck_rent(false);
      setrent_error("Rent is required!");
    } else {
      if (!rent.match(/^[0-9 ]+$/)) {
        setcheck_rent(false);
        setrent_error("Only Numbers Are Allowed");
      } else {
        setcheck_rent(true);
      }
    }

    if (!postal) {
      setcheck_postal(false);
      setpostal_error("Postal code is required!");
    } else {
      if (!postal.match(/^[a-zA-Z0-9 ]+$/)) {
        setcheck_postal(false);
        setpostal_error("Enter a valid value");
      } else {
        setcheck_postal(true);
      }
    }

    if (!address) {
      setcheck_address(false);
      setaddress_error("Address is required!");
    } else {
      setcheck_address(true);
    }

    if (!location) {
      setcheck_city(false);
      setmsg_error3("City required!");
    } else {
      setcheck_city(true);
    }

    if (location) {
      if (!location.match(/^[a-zA-Z0-9 ]+$/)) {
        setcheck_city(false);
        setmsg_error3("Only letters and numbers are allowed!");
      } else {
        setcheck_city(true);
      }
    }

    if (category.length <= 0) {
      setcheck_layout(false);
      setmsg_error2("Please select a Layout!");
    } else {
      setcheck_layout(true);
    }

    if (!status) {
      setcheck_status(false);
      setmsg_error4("Please select a Status!");
    } else {
      setcheck_status(true);
    }

    // if (!editData && selectedFiles.length <= 0) {
    //   setcheck_document(false);
    //   setmsg_error1("Select at least One file");
    // } else {
    //   setcheck_document(true);
    // }
    if (
      title &&
      check_title &&
      category.length > 0 &&
      check_layout &&
      location &&
      check_city &&
      status &&
      check_rent &&
      check_status &&
      postal &&
      check_postal &&
      check_address &&
      address
    ) {
      const decode = jwt_decode(window.localStorage.getItem("accessToken"));
      if (!editData) {
        try {
          const saveSpinner = document.getElementById("saveSpinner");
          const failedSaveErrorIcon = document.getElementById(
            "failedSaveErrorIcon"
          );
          const nexticon = document.getElementById("nexticon");

          saveSpinner.style.display = "inline-block";
          failedSaveErrorIcon.style.display = "none";
          nexticon.style.display = "none";

          const response = await axios.post(ADD_PROPERTY_URL, {
            title: title,
            propertySignature,
            companyID: decode.id,
            company: decode.company,
            companyDomain: decode.domain,
            category: category?.map((category) => category.value),
            owner: decode.firstname + " " + decode.lastname,
            rent: rent,
            postal: postal,
            address: address,
            location: location,
            status: status,
            manager: [],
            documents: [],
          });

          if (response.data.status === 201) {
            await uploadDocuments(response.data.id);
            toast.success(response.data.message);
            handleCloseModal();
            getProperties();

            saveSpinner.style.display = "none";
            failedSaveErrorIcon.style.display = "none";
            nexticon.style.display = "inline-block";
          }
        } catch (error) {
          console.log(error); // TODO Proper Error
        }
      } else {
        editProperty();
      }
    }
  }
  const EDIT_PROPERTY_URL = `/property/update/${propertyID}`;

  const editProperty = async () => {
    // EDIT_PROPERTY_URL
    try {
      setLoading(true);

      const res = await axios.post(EDIT_PROPERTY_URL, {
        title: title,
        propertySignature,
        companyID: decode.id,
        company: decode.company,
        companyDomain: decode.domain,
        category: category.map((category) => category.value),
        owner: decode.firstname + " " + decode.lastname,
        rent_amount: rent,
        postal_code: postal,
        address: address,
        location: location,
        status: status,
        documents: [],
      });

      if (res) {
        selectedFiles?.length > 0 && (await uploadDocuments(res.data.id));
        toast.success(res.data.message);
        handleCloseModal();
        getProperties();

        setLoading(false);
      }
    } catch (e) {
      console.log("error", e.message);
      setLoading(false);
    }
  };

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

  function handleAcceptedFiles(files) {
    files.map((file) =>
      Object.assign(file, {
        preview: URL.createObjectURL(file),
        formattedSize: formatBytes(file.size),
      })
    );
    if (editData?.document?.length > 0) {
    }
    setselectedFiles(files);
    setcheck_document(true);
    setmsg_error1("");
  }
  useState(async () => {
    if (decode.role === "company") {
      await getLayout(GET_LAYOUT_URL, {
        companyID: decode.id,
      });
    }
  });
  /**
   * Formats the size
   */

  const filterDataHandle = (e, name, data) => {
    let newData = { ...filterData };
    if (name == "title") {
      newData[name] = data;
    } else if (name == "company") {
      newData[name] = data;
    } else if (name == "location") {
      newData[name] = data;
    } else if (name == "category") {
      newData[name] = data;
    } else if (name == "manager") {
      newData[name] = data;
    } else if (name == "status") {
      newData[name] = data;
    } else {
      newData[name] = " ";
    }
    setFilterData(newData);
  };
  const onchangetext = (e, name) => {
    let newData = { ...filterData };
    // let From = new Date(startDate).getTime() / 1000
    // let To = new Date(endDate).getTime() / 1000
    // console.log(From ,"From" , To ,"To")
    //console.log(`${startDate}=${e.target.value}`)
    if (name === "propertyId") {
      newData[name] = e.target.value;
    } else if (name === "To") {
      newData["dateRange"] = `${startDate}=${e.target.value}`;
    } else {
      newData[name] = "";
    }
    setFilterData(newData);
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
    const formData = new FormData();
    var i = 0;
    while (i < selectedFiles.length) {
      formData.append(`file`, selectedFiles[i]);
      i++;
    }
    const file = formData.get("file"); // Assuming the form data is already populated with the file
    const config = {
      headers: {
        "content-type": "multipart/form-data",
        id: `${val}`,
      },
    };

    try {
      const response = await axios.post(
        "/property/upload-documents",
        formData,
        config
      );
    } catch (error) {}
  }

  const deleteDocument = (index) => {
    setselectedFiles(selectedFiles.filter((_, i) => i !== index));
  };

  const handleSubmit = async (e) => {
    try {
      e.preventDefault();
      const res = await Fun;
    } catch (error) {
      console.log(error);
    }
  };

  function createSignatureFromTitle(title) {
    const words = title.split(" ");
    const signature = words.map((word) => word[0]).join(".");
    return signature;
  }

  const getProperties = async (sorting, custom) => {
    // if (filterData !== null) {
    //   setCurrentPage(1);
    // }
    let data = {
      role: decode1.role,
      domain: decode1.domain,
      managerID: decode1.id,
      filter: custom ? custom : filterData,
      managerID: decode1.role === "manager" ? decode1.id : "",
      sort: sorting,
    };
    try {
      const response = await axios.post(PROPERTIES_URL, data);
      if (response.data.results.properties) {
        const properties = response.data.results.properties;
        const propertiesWithSignatures = properties.map((property) => {
          const signature = property.propertySignature
            ? property.propertySignature
            : createSignatureFromTitle(property.title);
          return {
            ...property,
            propertySignature: signature,
          };
        });
        settotalproperties(propertiesWithSignatures);
        setPage(
          response.data.results.previous
            ? response.data.results.previous.page + 1
            : 1
        );
        settotalcompanies(response.data.totalProperties);
        setActive(response.data.totalActiveProperties);
        setStats((prev) => ({
          ...prev,
          Total: response.data.total.Total || 0,
          Active: response.data.total.Active || 0,
          Inactive: response.data.total.Inactive || 0,
        }));
      }
    } catch (error) {
      console.log(error);
    }
  };

  const handleSorting = (e) => {
    let value = [1, -1];
    let newData = {};
    if (e.target.value == 1) {
      newData["title"] = value[0];
    } else if (e.target.value == 2) {
      newData["title"] = value[1];
    } else if (e.target.value == 3) {
      newData["createdAt"] = value[1];
    } else if (e.target.value == 4) {
      newData["createdAt"] = value[0];
    } else if (e.target.value == 5) {
      newData["modifiedAt"] = value[1];
    } else if (e.target.value == 6) {
      newData["modifiedAt"] = value[0];
    } else {
      newData[" "] = " ";
    }

    getProperties(newData);
  };
  async function deleteProperty() {
    try {
      const response = await axios.delete(
        `/property/delete?userID=${decode2.id}&propertyID=${propertyID}`
      );
      if (response.data.status === 200) {
        toast.success(response.data.message);
        setPropertyID("");
        getProperties();
        setShowDeleteDialoge(false);
      } else {
        toast.warning(response.data.message);
      }
    } catch (error) {
      // visible error
      console.log(error);
    }
  }

  let number = 0;
  let number1 = page > 1 ? (page - 1) * 10 : 0;

  return (
    <React.Fragment>
      <div className="page-content">
        <MetaTags>
          <title> Rentdigicare | Property</title>
        </MetaTags>
        <div className="container-fluid">
          <Breadcrumbs title="Home" breadcrumbItem="Property" />
          <Row>
            <Col xl={12}>
              <Card>
                {
                  <CardHeader>
                    <div className="row align-items-center">
                      <div className="col-md-6 d-flex">
                        <div className="mb mx-2">
                          <h5 className="card-title">
                            Total
                            <span className="text-muted fw-normal ms-1">
                              ({stats?.Total})
                            </span>
                          </h5>
                        </div>
                        <div className="mb mx-2">
                          <h5 className="card-title">
                            Active
                            <span className="text-muted fw-normal ms-1">
                              ({stats?.Active})
                            </span>
                          </h5>
                        </div>
                        <div className="mb mx-2">
                          <h5 className="card-title">
                            Inactive
                            <span className="text-muted fw-normal ms-1">
                              ({stats?.Inactive})
                            </span>
                          </h5>
                        </div>
                      </div>

                      <div className="col-md-6 d-flex flex-wrap align-items-center justify-content-end">
                        <div className="mb">
                          <button
                            onClick={t_col5}
                            className="btn btn-primary mo-mb-2 mr-10"
                            type="button"
                            style={{ cursor: "pointer" }}
                          >
                            Filters
                          </button>
                          {!(
                            decode.role === "manager" || decode.role === "admin"
                          ) ? (
                            <>
                              {/* <button
                          onClick={t_col5}
                          className="btn btn-primary mo-mb-2 mr-10"
                          type="button"
                          style={{ cursor: "pointer" }}
                        >
                          Filters
                        </button>   */}

                              <button
                                type="button"
                                onClick={async () => {
                                  tog_large();
                                  await getCompanies();
                                  setPropertySignature("");
                                }}
                                className="btn btn-light "
                                data-toggle="modal"
                                data-target=".bs-example-modal-lg"
                              >
                                <i className="bx bx-plus me-1"></i> Add Property
                              </button>
                            </>
                          ) : (
                            <></>
                          )}
                          <Modal
                            size="lg"
                            isOpen={modal_large}
                            toggle={() => {
                              handleCloseModal();
                            }}
                          >
                            <div className="modal-header">
                              <h5
                                className="modal-title mt-0"
                                id="myLargeModalLabel"
                              >
                                {editData ? "Edit" : "Add"} Property
                              </h5>
                              <button
                                onClick={() => {
                                  handleCloseModal();
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
                                <div className="row">
                                  <div className="col-md-6">
                                    <div className="mb-3">
                                      <Label
                                        className="form-label"
                                        htmlFor="formrow-title-input"
                                      >
                                        Property Name *
                                      </Label>
                                      <Input
                                        value={title}
                                        placeholder="Enter a Property Name"
                                        onBlur={(e) => {
                                          const value = e.target.value;
                                          if (!value) {
                                            setcheck_title(false);
                                            setmsg_error(
                                              "Property Name is required!"
                                            );
                                          } else {
                                            setcheck_title(true);
                                          }

                                          if (!value.match(/^[a-zA-Z0-9 ]+$/)) {
                                            setcheck_title(false);
                                            setmsg_error(
                                              "Only letters and numbers are allowed!"
                                            );
                                          } else {
                                            setcheck_title(true);
                                          }
                                        }}
                                        onChange={(e) => {
                                          setTitle(e.target.value);
                                        }}
                                        type="text"
                                        className="form-control"
                                        id="formrow-name-input"
                                      />
                                      {check_title ? (
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
                                        htmlFor="formrow-rent-input"
                                      >
                                        Property Signature (Optional)*
                                      </Label>
                                      <Input
                                        value={propertySignature}
                                        placeholder="Enter Property Signature (Ex. C.A)"
                                        onChange={(e) => {
                                          setPropertySignature(e.target.value);
                                        }}
                                        type="text"
                                        className="form-control"
                                        id="formrow-rent-input"
                                      />
                                    </div>
                                  </div>
                                  <div className="col-md-6">
                                    <div className="mb-3">
                                      <Label
                                        className="form-label"
                                        htmlFor="formrow-category-input"
                                      >
                                        Layout *
                                      </Label>

                                      <Select
                                        isMulti
                                        value={category}
                                        onBlur={() => {
                                          if (!category.length > 0) {
                                            setcheck_layout(false);
                                            setmsg_error2(
                                              "Please select a Layout!"
                                            );
                                          } else {
                                            setcheck_layout(true);
                                          }
                                        }}
                                        onChange={(selectedOption) => {
                                          const layouts = [];
                                          selectedOption.map((layout) => {
                                            layouts.push(layout);
                                          });
                                          setCategory(layouts);
                                        }}
                                        options={layout}
                                        className="basic-multi-select"
                                        classNamePrefix="select"
                                      />
                                      {check_layout ? (
                                        ""
                                      ) : (
                                        <Label style={{ color: "red" }}>
                                          {msg_error2}
                                        </Label>
                                      )}
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
                                        htmlFor="formrow-location-input"
                                      >
                                        City *
                                      </Label>
                                      <Input
                                        value={location}
                                        placeholder="Enter a city name"
                                        onBlur={(e) => {
                                          const value = e.target.value;
                                          if (!value) {
                                            setcheck_city(false);
                                            setmsg_error3("City is required!");
                                          } else {
                                            setcheck_city(true);
                                          }

                                          if (!value.match(/^[a-zA-Z0-9 ]+$/)) {
                                            setcheck_city(false);
                                            setmsg_error3(
                                              "Only letters and numbers are allowed!"
                                            );
                                          } else {
                                            setcheck_city(true);
                                          }
                                        }}
                                        onChange={(e) => {
                                          setLocation(e.target.value);
                                        }}
                                        type="text"
                                        className="form-control"
                                        id="formrow-location-input"
                                      />
                                      {check_city ? (
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
                                      <Label className="form-Label">
                                        Status *
                                      </Label>
                                      <select
                                        value={status}
                                        onBlur={(e) => {
                                          const value = e.target.value;
                                          if (!value) {
                                            setcheck_status(false);
                                            setmsg_error4(
                                              "Please select a Status!"
                                            );
                                          } else {
                                            setcheck_status(true);
                                          }
                                        }}
                                        onChange={(e) => {
                                          setStatus(e.target.value);
                                        }}
                                        className="form-select"
                                      >
                                        <option value="">Select</option>
                                        <option value="Active">Active</option>
                                        <option value="Inactive">
                                          In-active{" "}
                                        </option>
                                      </select>
                                      {check_status ? (
                                        ""
                                      ) : (
                                        <Label style={{ color: "red" }}>
                                          {msg_error4}
                                        </Label>
                                      )}
                                    </div>
                                  </div>
                                  <div className="col-md-3">
                                    <div className="mb-3">
                                      <Label
                                        className="form-label"
                                        htmlFor="formrow-rent-input"
                                      >
                                        Rent ($) *
                                      </Label>
                                      <Input
                                        value={rent}
                                        placeholder="Enter a rent"
                                        onBlur={(e) => {
                                          const value = e.target.value;
                                          if (!value) {
                                            setcheck_rent(false);
                                            setrent_error("Rent is required!");
                                          } else {
                                            setcheck_rent(true);
                                          }

                                          if (!value.match(/^[0-9 ]+$/)) {
                                            setcheck_rent(false);
                                            setrent_error(
                                              "Only numbers are allowed!"
                                            );
                                          } else {
                                            setcheck_rent(true);
                                          }
                                        }}
                                        onChange={(e) => {
                                          setRent(e.target.value);
                                        }}
                                        type="text"
                                        className="form-control"
                                        id="formrow-rent-input"
                                      />
                                      {check_rent ? (
                                        ""
                                      ) : (
                                        <Label style={{ color: "red" }}>
                                          {rent_error}
                                        </Label>
                                      )}
                                    </div>
                                  </div>
                                  <div className="col-md-3">
                                    <div className="mb-3">
                                      <Label
                                        className="form-label"
                                        htmlFor="formrow-rent-input"
                                      >
                                        Postal code *
                                      </Label>
                                      <Input
                                        value={postal}
                                        placeholder="Enter a rent"
                                        onBlur={(e) => {
                                          const value = e.target.value;
                                          if (!value) {
                                            setcheck_postal(false);
                                            setpostal_error(
                                              "Postal code is required!"
                                            );
                                          } else {
                                            setcheck_postal(true);
                                          }

                                          if (!value.match(/^[a-zA-Z0-9 ]+$/)) {
                                            setcheck_postal(false);
                                            setpostal_error(
                                              "Enter a valid value"
                                            );
                                          } else {
                                            setcheck_postal(true);
                                          }
                                        }}
                                        onChange={(e) => {
                                          setPostal(e.target.value);
                                        }}
                                        type="text"
                                        className="form-control"
                                        id="formrow-rent-input"
                                      />
                                      {check_postal ? (
                                        ""
                                      ) : (
                                        <Label style={{ color: "red" }}>
                                          {postal_error}
                                        </Label>
                                      )}
                                    </div>
                                  </div>

                                  <div className="col-md-12">
                                    <div className="mb-3">
                                      <label
                                        htmlFor="basicpill-address-input"
                                        className="form-label"
                                      >
                                        Address *
                                      </label>
                                      <textarea
                                        id="basicpill-address-input"
                                        className="form-control"
                                        rows="3"
                                        value={address}
                                        placeholder="Enter you address"
                                        onBlur={(e) => {
                                          const value = e.target.value;
                                          if (!value) {
                                            setcheck_address(false);
                                            setaddress_error(
                                              "Address is required!"
                                            );
                                          } else {
                                            setcheck_address(true);
                                          }
                                        }}
                                        onChange={(e) => {
                                          setAddress(e.target.value);
                                        }}
                                      ></textarea>
                                      {check_address ? (
                                        ""
                                      ) : (
                                        <Label style={{ color: "red" }}>
                                          {address_error}
                                        </Label>
                                      )}
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
                                            </div>
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
                                        })}
                                      </div>
                                      {check_document ? (
                                        ""
                                      ) : (
                                        <Label style={{ color: "red" }}>
                                          {msg_error1}
                                        </Label>
                                      )}
                                    </div>
                                  </div>
                                  <div className="col-md-12">
                                    <div className="text-end">
                                      <button
                                        type="submit"
                                        disabled={[
                                          check_title,
                                          check_rent,
                                          check_layout,
                                          check_city,
                                          check_status,
                                          check_postal,
                                        ].includes(false)}
                                        className="btn btn-success save-user"
                                      >
                                        Save
                                        <i
                                          id="nexticon"
                                          className="bx bx-chevron-right ms-1"
                                        ></i>
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
                      </div>
                    </div>
                    <div className="row">
                      <div className="col-lg-12">
                        <Collapse className="mt-4" isOpen={col5}>
                          <Card>
                            <CardBody>
                              <div className="filter-sec">
                                <Form
                                  onSubmit={(e) => {
                                    e.preventDefault();
                                    getProperties();
                                  }}
                                >
                                  <div class="row align-items-center">
                                    {decode2.role === "admin" ? (
                                      <div className="col-md-4">
                                        <div className="mb-3">
                                          <Label className="form-Label">
                                            Company Name
                                          </Label>
                                          <select
                                            className="form-select"
                                            onChange={(e) =>
                                              filterDataHandle(
                                                e,
                                                "company",
                                                e.target.value
                                              )
                                            }
                                          >
                                            <option value="">Select One</option>
                                            {company &&
                                              company.map((item) => {
                                                return (
                                                  <>
                                                    <option value={item.id}>
                                                      {item.name}
                                                    </option>
                                                  </>
                                                );
                                              })}
                                          </select>
                                        </div>
                                      </div>
                                    ) : (
                                      <></>
                                    )}

                                    <div className="col-md-4">
                                      <div className="mb-3">
                                        <Label className="form-Label">
                                          Property Name
                                        </Label>
                                        <Select
                                          value={selectPropertyName}
                                          options={propertyname?.map((item) => {
                                            return {
                                              value: item.title,
                                              label: item.title,
                                            };
                                          })}
                                          placeholder="Search By Name"
                                          onChange={(e) => {
                                            setSelectPropertyName(e);
                                            filterDataHandle(
                                              e,
                                              "title",
                                              e.value
                                            );
                                          }}
                                        />
                                        {/* <select
                                          className="form-select"
                                          onChange={(e) =>
                                            filterDataHandle(
                                              e,
                                              "title",
                                              e.target.value
                                            )
                                          }
                                        >
                                          <option value="">Select One</option>
                                          {propertyname &&
                                            propertyname.map((item) => {
                                              return (
                                                <>
                                                  <option value={item.title}>
                                                    {item.title}
                                                  </option>
                                                </>
                                              );
                                            })}
                                        </select> */}
                                      </div>
                                    </div>
                                    {decode2.role == "manager" ? (
                                      <></>
                                    ) : (
                                      <>
                                        <div className="col-md-4">
                                          <div className="mb-3">
                                            <Label className="form-Label">
                                              Property Manager
                                            </Label>
                                            <Select
                                              value={selectPropertyManager}
                                              options={
                                                manager?.map((item) => {
                                                  return {
                                                    value: item._id,
                                                    label:
                                                      item.firstname +
                                                      item.lastname,
                                                  };
                                                }) || []
                                              }
                                              placeholder="Search By Name"
                                              onChange={(e) => {
                                                setSelectPropertyManager(e);
                                                filterDataHandle(
                                                  e,
                                                  "manager",
                                                  e.value
                                                );
                                              }}
                                            />
                                            {/* <select
                                              className="form-select"
                                              onChange={(e) =>
                                                filterDataHandle(
                                                  e,
                                                  "manager",
                                                  e.target.value
                                                )
                                              }
                                            >
                                              <option value="">
                                                Select One
                                              </option>
                                              {manager &&
                                                manager.map((item) => {
                                                  return (
                                                    <>
                                                      <option value={item._id}>
                                                        {item.firstname +
                                                          item.lastname}
                                                      </option>
                                                    </>
                                                  );
                                                })}
                                            </select> */}
                                          </div>
                                        </div>
                                      </>
                                    )}
                                    <div className="col-md-4">
                                      <div className="mb-3">
                                        <Label className="form-Label">
                                          City
                                        </Label>
                                        <select
                                          className="form-select"
                                          onChange={(e) =>
                                            filterDataHandle(
                                              e,
                                              "location",
                                              e.target.value
                                            )
                                          }
                                        >
                                          <option value="">Select One</option>
                                          {locationn &&
                                            locationn.map((item) => {
                                              return (
                                                <>
                                                  <option value={item.location}>
                                                    {item.location}
                                                  </option>
                                                </>
                                              );
                                            })}
                                        </select>
                                      </div>
                                    </div>
                                    <div className="col-md-4">
                                      <div className="mb-3">
                                        <Label className="form-Label">
                                          Status
                                        </Label>
                                        <select
                                          className="form-select"
                                          onChange={(e) =>
                                            filterDataHandle(
                                              e,
                                              "status",
                                              e.target.value
                                            )
                                          }
                                        >
                                          <option value="">Select One</option>
                                          <option value="Active">Active</option>
                                          <option value="Inactive">
                                            Inactive
                                          </option>
                                        </select>
                                      </div>
                                    </div>
                                    <div className="col-md-4">
                                      <div className="mb-3">
                                        <Label className="form-Label">
                                          Layout Type
                                        </Label>
                                        <select
                                          className="form-select"
                                          onChange={(e) =>
                                            filterDataHandle(
                                              e,
                                              "category",
                                              e.target.value
                                            )
                                          }
                                        >
                                          <option value="">Select One</option>

                                          {categories &&
                                            categories.map((item) => {
                                              return (
                                                <>
                                                  <option value={item._id}>
                                                    {item.layoutName}
                                                  </option>
                                                </>
                                              );
                                            })}
                                        </select>
                                      </div>
                                    </div>
                                    <div className="col-md-4">
                                      <div className="mb-3">
                                        <Label
                                          className="form-label"
                                          htmlFor="formrow-phone-input"
                                        >
                                          Property ID
                                        </Label>
                                        <Input
                                          type="text"
                                          placeholder="Enter a property ID"
                                          className="form-control"
                                          onChange={(e) =>
                                            onchangetext(e, "propertyId")
                                          }
                                          id="formrow-phone-input"
                                        />
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
                                          onChange={(e) => {
                                            setstartDate(e.target.value);
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
                                          onChange={(e) => {
                                            onchangetext(e, "To");
                                          }}
                                          //  defaultValue={FromFilter}
                                          id="example-date-input"
                                        />
                                      </div>
                                    </div>
                                    <div className="col-md-12 searchClear-btns justify-content-end d-flex">
                                      <div className="srch-btn">
                                        <button
                                          type="submit"
                                          className="btn btn-primary"
                                        >
                                          Search
                                        </button>
                                      </div>
                                      <div className="srch-btn">
                                        <button
                                          type="submit"
                                          className="btn btn-primary"
                                          onClick={() =>
                                            window.location.reload()
                                          }
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
                }

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
                        <option value={5}>Modified Latest</option>
                        <option value={6}>Modified Oldest</option>
                      </select>
                    </div>
                    <Table className="table-striped table-bordered mb-0">
                      <thead>
                        <tr>
                          <th scope="col">#</th>
                          <th scope="col">Property</th>
                          {/* <th scope="col">Property Name</th> */}
                          {decode2.role !== "company" && (
                            <th scope="col">Company</th>
                          )}
                          <th scope="col">Layout</th>
                          {decode2.role !== "company" && (
                            <th scope="col">Owner</th>
                          )}
                          <th scope="col">Manager</th>
                          <th scope="col">City</th>
                          <th scope="col">Rent</th>
                          <th scope="col">Docs</th>
                          <th scope="col">Status</th>
                          <th scope="col">Created/Modified </th>
                          {/* <th scope="col">Modified Date</th> */}
                          {["company"].includes(decode.role) ? (
                            <th scope="col">Action</th>
                          ) : (
                            ""
                          )}
                        </tr>
                      </thead>
                      <tbody>
                        {totalproperties &&
                          totalproperties.map((item, index) => {
                            number++;
                            return (
                              <>
                                <tr key={item._id}>
                                  <td>{number + number1}</td>
                                  {/* <td>{item.primaryID} </td> */}
                                  <td>
                                    <a
                                      href={`/rent_list/${item._id}`}
                                      onClick={() => {
                                        tog_largee2();
                                      }}
                                      data-toggle="modal"
                                      data-target=".bs-example-modal-lg"
                                    >
                                      <strong className="text-muted">
                                        {item.propertySignature}
                                      </strong>
                                      <br />
                                      <small>{item.primaryID}</small>
                                    </a>
                                  </td>
                                  {decode2.role !== "company" && (
                                    <td>{item.company}</td>
                                  )}
                                  <td>
                                    {item.layouts.map((cate, index) => {
                                      if (index !== item.layouts.length - 1) {
                                        return `${cate.layoutName}, `;
                                      } else {
                                        return `${cate.layoutName}`;
                                      }
                                    })}
                                  </td>
                                  {decode2.role !== "company" && (
                                    <td>{item.owner}</td>
                                  )}

                                  <td>
                                    {item.managersList.map((data) => {
                                      return `${
                                        data.firstname + " " + data.lastname
                                      }, `;
                                    })}
                                  </td>
                                  <td>{item.location}</td>
                                  <td>
                                    {item.rent_amount
                                      ? `$${item?.rent_amount}`
                                      : "--"}
                                  </td>
                                  <td className="text-center">
                                    {item?.document.length > 0 &&
                                    item?.document[0] == "1" ? (
                                      <div>
                                        <a
                                          href={`${SERVER_URL}/property/download-document?ID=${item._id}`}
                                          download={`${
                                            item.title ? item.title : "property"
                                          }.zip`}
                                        >
                                          <button
                                            type="button"
                                            className="btn @btn-soft-light btn-md w-xs waves-effect btn-label waves-light doc-download-btn "
                                          >
                                            {" "}
                                            <i className="bx bx-download label-icon"></i>
                                          </button>
                                        </a>
                                      </div>
                                    ) : item?.document.length > 0 &&
                                      item?.document[0] !== "1" ? (
                                      <button
                                        onClick={async () => {
                                          item.document.map((file) => {
                                            window.location.href = file;
                                          });
                                        }}
                                        type="button"
                                        className="btn btn-soft-light btn-sm w-xs waves-effect "
                                      >
                                        <i className="bx bx-download label-icon"></i>
                                      </button>
                                    ) : (
                                      "NA"
                                    )}
                                  </td>
                                  <td>{item.status}</td>
                                  <td>
                                    {moment(item.createdAt).format(
                                      "YYYY-MM-DD"
                                    )}
                                    /
                                    <br />
                                    {moment(item.modifiedAt).format(
                                      "YYYY-MM-DD"
                                    )}
                                  </td>
                                  {/* <td>
                                    
                                  </td> */}
                                  {["company"].includes(decode.role) ? (
                                    <td>
                                      <div className="d-flex gap-3">
                                        <Link className="text-danger" to="#">
                                          <i
                                            className="mdi mdi-delete font-size-18"
                                            id="deletetooltip"
                                            onClick={async (e) => {
                                              e.preventDefault();
                                              setPropertyID(item._id);
                                              setShowDeleteDialoge(
                                                !showDeleteDialoge
                                              );
                                            }}
                                          ></i>
                                          <Modal
                                            isOpen={showDeleteDialoge}
                                            toggle={() => {
                                              setPropertyID("");
                                              setShowDeleteDialoge(
                                                !showDeleteDialoge
                                              );
                                            }}
                                          >
                                            <ModalHeader
                                              toggle={() => {
                                                setPropertyID("");
                                                setShowDeleteDialoge(
                                                  !showDeleteDialoge
                                                );
                                              }}
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
                                                  setPropertyID("");
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
                                                  await deleteProperty()
                                                }
                                              >
                                                Delete
                                              </Button>
                                            </ModalFooter>
                                          </Modal>
                                          {decode2.role === "admin" ? (
                                            <></>
                                          ) : (
                                            <i
                                              className="mdi mdi-border-color font-size-18"
                                              // id="deletetooltip"
                                              style={{ color: "black" }}
                                              onClick={async () => {
                                                seteditData(true);
                                                setPropertyID(item?._id);
                                                setTitle(item.title);
                                                setPropertySignature(
                                                  item.propertySignature
                                                );
                                                setLocation(item.location);
                                                setStatus(item.status);
                                                setRent(item.rent_amount);
                                                setAddress(item?.address);
                                                setPostal(item?.postal_code);
                                                const prop = item?.layouts?.map(
                                                  (p) => {
                                                    return {
                                                      label: p.layoutName,
                                                      value: p._id,
                                                    };
                                                  }
                                                );
                                                setCategory(prop);

                                                setmodal_large(!modal_large);

                                                removeBodyCss();
                                                // await getCompanies();
                                              }}
                                            ></i>
                                          )}
                                        </Link>
                                      </div>
                                    </td>
                                  ) : (
                                    ""
                                  )}
                                </tr>
                              </>
                            );
                          })}
                        {/* <PropertyList totalc={settotalcompanies} pageno={currentPage} filter ={filterData} callApi = {totalproperties} /> */}
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
