import React, { useState, useEffect } from "react";
import MetaTags from "react-meta-tags";
import { Link } from "react-router-dom";
import axios from "../api/axios";
import {
  Table,
  Row,
  Col,
  Card,
  CardBody,
  Modal,
  CardHeader,
  Label,
  Form,
  Pagination,
  PaginationItem,
  Collapse,
  PaginationLink,
  Input,
} from "reactstrap";
//Lightbox
import Lightbox from "react-image-lightbox";
import "react-image-lightbox/style.css";
import "react-modal-video/scss/modal-video.scss";

// import image
import img1 from "../../assets/images/small/img-1.jpg";
import img2 from "../../assets/images/small/img-2.jpg";
import img4 from "../../assets/images/small/img-4.jpg";
import img5 from "../../assets/images/small/img-5.jpg";

// Form Mask
import InputMask from "react-input-mask";

//Import Breadcrumb
import Breadcrumbs from "../../components/Common/Breadcrumb";

// Importing ApplicantList component
import ApplicantList from "./ApplicantList";
import jwt_decode from "jwt-decode";

const ResidentApplication = () => {
  // filter Options
  const [totalapp, settotalapp] = useState({
    Total: 0,
    Pending: 0,
    Approved: 0,
    Denied: 0,
  });
  const [filterLayout, setFilterLayout] = useState("");
  const [filterPropertyName, setFilterPropertyName] = useState("");
  const [filterApplicantName, setFilterApplicantName] = useState("");
  const [filterEmail, setFilterEmail] = useState("");
  const [filterPhone, setfilterPhone] = useState("");
  const [filterFromDate, setFilterFromDate] = useState("");
  const [filterToDate, setFilterToDate] = useState("");
  const [propertyNameList, setPropertyNameList] = useState([]);
  const [startPage, setStartPage] = useState(1);

  const images = [img4, img5, img1];
  const [photoIndex, setphotoIndex] = useState(0);
  const [isFits, setisFits] = useState(false);
  const [isEffects, setisEffects] = useState(false);
  const [isGallery, setisGallery] = useState(false);
  const [sorting, setSorting] = useState("");
  const [source, setSource] = useState("");
  const decode = jwt_decode(window.localStorage.getItem("accessToken"));
  const DUR = (props) => (
    <InputMask
      mask="99.99"
      value={props.value}
      className="form-control input-color"
      onChange={props.onChange}
    ></InputMask>
  );

  const optionMulti = [
    { label: "Danish Sharma", value: "Danish Sharma" },
    { label: "Jameson", value: "Jameson" },
    { label: "Digi", value: "Digi" },
  ];

  const [col5, setcol5] = useState(false);

  const [currentPage, setCurrentPage] = useState(1);
  const [pages, setPages] = useState([]);
  const [pageLimit, setPageLimit] = useState(10);

  const pageTotal = Math.ceil(totalapp.Total / pageLimit);

  const FROM_URL = `/applicant/first-application-date`;
  const From = async () => {
    const response = await axios.get(FROM_URL);
    var today = new Date(response.data.fromDate);
    var dd = String(today.getDate()).padStart(2, "0");
    var mm = String(today.getMonth() + 1).padStart(2, "0");
    var yyyy = today.getFullYear();
    today = yyyy + "-" + mm + "-" + dd;
    // alert(today)
    setFromFilter(today);
  };

  const t_col5 = () => {
    setcol5(!col5);
  };
  const [modal_large, setmodal_large] = useState(false);

  const handlePageChange = (page) => {
    setCurrentPage(page);

    if (page > startPage + pageLimit - 1 || page < startPage) {
      setStartPage(Math.max(1, page - pageLimit / 2));
    }
  };

  useEffect(async () => {
    await From();
  });

  useEffect(() => {
    let total_pages = totalapp.Total / pageLimit;
    if (totalapp.Total % pageLimit == 0) {
      setPages(Array.from(Array(Math.round(total_pages)).keys()));
    } else {
      setPages(Array.from(Array(parseInt(total_pages) + 1).keys()));
    }
    // console.log('totalapp / pageLimit',totalapp , pageLimit)
    // console.log(Array.from(Array(Math.round(totalapp / pageLimit)).keys()))
  }, [totalapp, pageLimit]);

  useEffect(async () => {
    await getPropertyNames();
    //setPages(Array.from(Array(Math.round(totalapp / pageLimit)).keys()))
    let total_pages = totalapp.Total / pageLimit;
    if (totalapp.Total % pageLimit == 0) {
      setPages(Array.from(Array(Math.round(total_pages)).keys()));
    } else {
      setPages(Array.from(Array(parseInt(total_pages) + 1).keys()));
    }
  }, [currentPage]);

  function removeBodyCss() {
    document.body.classList.add("no_padding");
  }

  function tog_large() {
    setmodal_large(!modal_large);
    removeBodyCss();
  }
  const [selectedFiles, setselectedFiles] = useState([]);
  function handleAcceptedFiles(files) {
    files?.map((file) =>
      Object.assign(file, {
        preview: URL.createObjectURL(file),
        formattedSize: formatBytes(file.size),
      })
    );
    setselectedFiles(files);
  }
  /**Formats the size**/
  function formatBytes(bytes, decimals = 2) {
    if (bytes === 0) return "0 Bytes";
    const k = 1024;
    const dm = decimals < 0 ? 0 : decimals;
    const sizes = ["Bytes", "KB", "MB", "GB", "TB", "PB", "EB", "ZB", "YB"];

    const i = Math.floor(Math.log(bytes) / Math.log(k));
    return parseFloat((bytes / Math.pow(k, i)).toFixed(dm)) + " " + sizes[i];
  }

  function filterApplications(event) {
    event.preventDefault();
    console.log("working");
  }
  const [propertNameFilter, setpropertNameFilter] = useState("");
  const [ApplicantNameFilter, setApplicantNameFilter] = useState("");
  const [PhoneFilter, setPhoneFilter] = useState("");
  const [FromFilter, setFromFilter] = useState("");
  const [from, setFrom] = useState("");
  const [ToFilter, setToFilter] = useState();
  const [status, setStatus] = useState("");
  const [isFilterOn, setisFilterOn] = useState(false);
  const [on, seton] = useState(1);
  const searchFilter = (e) => {
    e.preventDefault();
    setCurrentPage(1);
    setisFilterOn(true);
    setpropertNameFilter(propertNameFilter);

    setNewww(neew);
    seton(on + 1);
    setStatus(status);
  };
  console.log("before", isFilterOn);

  var today = new Date();
  var today1 = new Date();
  var dd = String(today.getDate()).padStart(2, "0");
  var mm = String(today.getMonth() + 1).padStart(2, "0");
  var yyyy = today.getFullYear();
  today = yyyy + "-" + mm + "-" + dd;
  const [neew, setNewww] = useState("");
  const [sendTo, setSendTo] = useState("");
  const [OriginalTo, setOriginalTo] = useState();
  const [OriginalFrom, setOriginalFrom] = useState("");

  const To_ = (date) => {
    var today = new Date(date);
    var dd = String(today.getDate()).padStart(2, "0");
    var mm = String(today.getMonth() + 1).padStart(2, "0");
    var yyyy = today.getFullYear();
    today = yyyy + "-" + mm + "-" + dd;
    setOriginalTo(today);
  };
  const From_ = (date) => {
    var today = new Date(date);
    var dd = String(today.getDate()).padStart(2, "0");
    var mm = String(today.getMonth() + 1).padStart(2, "0");
    var yyyy = today.getFullYear();
    today = yyyy + "-" + mm + "-" + dd;
    setOriginalFrom(today);
  };

  const refresh = () => {
    setpropertNameFilter("");
    setApplicantNameFilter("");
    setPhoneFilter("");
    setStatus("");
    setOriginalFrom("");
    setOriginalTo("");
    setSource("");
    setTimeout(() => {
      document.getElementById("ticketfilter").click();
    }, 1000);
  };

  async function getPropertyNames() {
    try {
      let data = { role: decode.role };
      if (decode.role === "manager") {
        data = {
          role: decode.role,
          managerID: decode.id,
        };
      }

      if (decode.role === "company") {
        data = {
          role: decode.role,
          domain: decode.domain,
        };
      }

      const response = await axios.post(
        "/applicant/getPropertyNameFilterValue",
        data
      );
      setPropertyNameList(response.data.propertyNameList);
    } catch (error) {
      console.log(error); // todo proper error
    }

    console.log("decode is:", decode);
  }

  const handleSorting = (e) => {
    console.log(e.target.value);
    let value = [1, -1];
    let newData = {};
    if (e.target.value == 1) {
      newData["fullName"] = value[0];
      // console.log(e.target.value, "value1");
    } else if (e.target.value == 2) {
      newData["fullName"] = value[1];
      // console.log(e.target.value, "value2");
    } else if (e.target.value == 3) {
      newData["createdAt"] = value[1];
      // console.log(e.target.value, "value2");
    } else if (e.target.value == 4) {
      newData["createdAt"] = value[0];
      // console.log(e.target.value, "value2");
    } else {
      newData[" "] = " ";
      console.log(e.target.value, "valueelse");
    }
    setSorting(newData);
    // getProperties(newData)

    console.log(newData, "newData");
  };

  return (
    <React.Fragment>
      <div className="page-content">
        <MetaTags>
          <title>Rentdigicare | Resident Applications</title>
        </MetaTags>
        <div className="container-fluid">
          <Breadcrumbs title="Home" breadcrumbItem="Resident Application" />
          {isFits ? (
            <Lightbox
              mainSrc={images[photoIndex]}
              enableZoom={false}
              imageCaption={
                "Caption. Can be aligned it to any side and contain any HTML."
              }
              onCloseRequest={() => {
                setisFits(!isFits);
              }}
            />
          ) : null}

          {isEffects ? (
            <Lightbox
              mainSrc={images[1]}
              enableZoom={false}
              onCloseRequest={() => {
                setisEffects(!isEffects);
              }}
            />
          ) : null}

          {isGallery ? (
            <Lightbox
              mainSrc={images[photoIndex]}
              nextSrc={images[(photoIndex + 1) % images.length]}
              prevSrc={images[(photoIndex + images.length - 1) % images.length]}
              enableZoom={true}
              onCloseRequest={() => {
                setisGallery(false);
              }}
              onMovePrevRequest={() => {
                setphotoIndex((photoIndex + images.length - 1) % images.length);
              }}
              onMoveNextRequest={() => {
                setphotoIndex((photoIndex + 1) % images.length);
              }}
              imageCaption={"Project " + parseFloat(photoIndex + 1)}
            />
          ) : null}

          <Row>
            <Col xl={12}>
              <Card>
                <CardHeader>
                  <div className="row align-items-center">
                    <div className="col-md-6 d-flex">
                      <div className="mb mx-2">
                        <h5 className="card-title">
                          Total
                          <span className="text-muted fw-normal ms-1">
                            ({totalapp?.Total})
                          </span>
                        </h5>
                      </div>
                      <div className="mx-2">
                        <h5 className="card-title">
                          Pending
                          <span className="text-muted fw-normal ms-1">
                            ({totalapp?.Pending})
                          </span>
                        </h5>
                      </div>

                      <div className="mx-2">
                        <h5 className="card-title">
                          Approved
                          <span className="text-muted fw-normal ms-1">
                            ({totalapp?.Approved})
                          </span>
                        </h5>
                      </div>
                      <div className="mx-2">
                        <h5 className="card-title">
                          Denied
                          <span className="text-muted fw-normal ms-1">
                            ({totalapp?.Denied})
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
                      </div>
                    </div>
                  </div>
                  <div className="row">
                    <div className="col-lg-12">
                      <Collapse className="mt-4" isOpen={col5}>
                        <Card>
                          <CardBody>
                            <div className="filter-sec">
                              <Form onSubmit={filterApplications}>
                                <div class="row align-items-center">
                                  {/* <div className="col-md-3">
                                        <div className="mb-3">
                                            <Label className="form-Label">Layout</Label>
                                            <select className="form-select">
                                                <option>Select One</option>
                                                <option>1 Bedroom 1 Bath</option>
                                                <option>2 Bedroom 1 Bath</option>
                                                <option>2 Bedroom 2 Bath</option>
                                                <option>1 Bedroom 1 Bath Fully Furnished</option>
                                                <option>2 Bedroom 2 Bath Fully Furnished</option>
                                            </select>
                                        </div>    
                                      </div> */}
                                  <div className="col-md-4">
                                    <div className="mb-3">
                                      <Label
                                        className="form-label"
                                        htmlFor="formrow-Name-input"
                                      >
                                        Property Name
                                      </Label>
                                      <select
                                        className="form-select"
                                        value={propertNameFilter}
                                        onChange={(e) =>
                                          setpropertNameFilter(e.target.value)
                                        }
                                      >
                                        <option value="" selected>
                                          Select One
                                        </option>
                                        {propertyNameList?.map((property) => {
                                          return (
                                            <option value={property.title}>
                                              {property.title}
                                            </option>
                                          );
                                        })}
                                      </select>
                                    </div>
                                  </div>

                                  <div className="col-md-4">
                                    <div className="mb-3">
                                      <Label
                                        className="form-label"
                                        htmlFor="formrow-Name-input"
                                      >
                                        Applicant Name
                                      </Label>
                                      <Input
                                        type="text"
                                        className="form-control"
                                        onChange={(e) =>
                                          setApplicantNameFilter(e.target.value)
                                        }
                                        value={ApplicantNameFilter}
                                        placeholder="Enter applicant name"
                                        id="formrow-Name-input"
                                      />
                                    </div>
                                  </div>
                                  {/* <div className="col-md-3"> 
                                        <div className="mb-3">
                                              <Label className="form-label" htmlFor="formrow-email-input">Email</Label>
                                              <Input type="text" className="form-control" id="formrow-email-input" />
                                        </div>
                                      </div> */}
                                  <div className="col-md-4">
                                    <div className="mb-3">
                                      <Label
                                        className="form-label"
                                        htmlFor="formrow-phone-input"
                                      >
                                        Phone
                                      </Label>
                                      <Input
                                        type="text"
                                        className="form-control"
                                        placeholder="Enter applicant phone number"
                                        value={PhoneFilter}
                                        onChange={(e) =>
                                          setPhoneFilter(e.target.value)
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
                                        value={OriginalFrom}
                                        onChange={(e) => From_(e.target.value)}
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
                                        value={OriginalTo}
                                        type="date"
                                        onChange={(e) => To_(e.target.value)}
                                        id="example-date-input"
                                      />
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
                                          setStatus(e.target.value)
                                        }
                                        value={status}
                                      >
                                        <option value="" selected>
                                          Select One
                                        </option>
                                        <option>Denied</option>
                                        <option>Pending</option>
                                        <option>Approved</option>
                                      </select>
                                    </div>
                                  </div>
                                  <div className="col-md-4">
                                    <div className="mb-3">
                                      <Label className="form-Label">
                                        Source
                                      </Label>
                                      <select
                                        className="form-select"
                                        onChange={(e) =>
                                          setSource(e.target.value)
                                        }
                                        value={source}
                                      >
                                        <option value="" selected>
                                          Select One
                                        </option>
                                        <option>Facebook</option>
                                        <option>Google</option>
                                        <option>GSK Website</option>
                                        <option>Other</option>
                                        <option>Referral</option>
                                        <option>Rent Board</option>
                                        <option>Rent Faster</option>
                                      </select>
                                    </div>
                                  </div>
                                  <div className="col-md-12 searchClear-btns justify-content-end d-flex">
                                    <div className="srch-btn">
                                      <button
                                        type="submit"
                                        id="ticketfilter"
                                        onClick={searchFilter}
                                        className="btn btn-primary"
                                      >
                                        Search
                                      </button>
                                    </div>
                                    <div className="srch-btn ">
                                      <button
                                        className="btn btn-primary"
                                        onClick={(e) => {
                                          e.preventDefault();
                                          refresh();
                                        }}
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
                        {/* <option value={2}>Created At</option> */}
                      </select>
                    </div>
                    <Table className="table-striped table-bordered mb-0">
                      <thead>
                        <tr>
                          <th scope="col">#</th>
                          <th scope="col">Property Name</th>
                          <th scope="col">Applicant</th>
                          {/* <th scope="col">Email</th>
                          <th scope="col">Mobile</th> */}
                          <th scope="col">Address</th>
                          <th scope="col">Created On</th>
                          <th scope="col">Documents</th>
                          <th scope="col">Id Proof's</th>
                          <th scope="col">Status</th>
                          <th scope="col">Source</th>
                          {["company"].includes(decode.role) || ["manager"].includes(decode.role) ? (
                            <th scope="col">Action</th>
                          ) : (
                            ""
                          )}
                        </tr>
                      </thead>
                      <tbody>
                        <ApplicantList
                          filter={{
                            filterstaus: isFilterOn,
                            propertyname: propertNameFilter,
                            name: ApplicantNameFilter,
                            phone: PhoneFilter,
                            status: status,
                            fromfilter: OriginalFrom ? OriginalFrom : "",
                            tofilter: OriginalTo ? OriginalTo : sendTo,
                            source: source,
                          }}
                          one={on}
                          totalap={settotalapp}
                          pageno={currentPage}
                          filtrfrom={setFromFilter}
                          sorting={sorting}
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

export default ResidentApplication;
