import React, { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import axios from "../api/axios";
import { SERVER_URL } from "../ServerLink";
import { Rating } from "react-simple-star-rating";
import { toast } from "react-toastify";
import jwt_decode from "jwt-decode";
import Select from "react-select";

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
const DOCUMENT_DOWNLOAD_URL = "/property_manager/download-document";

export default function Manager(props) {
  const [modal_large, setmodal_large] = useState(false);
  const [showConfirmation, setShowConfirmation] = useState(false);

  const [check_first, setcheck_first] = useState(true);
  const [check_last, setcheck_last] = useState(true);
  const [check_name, setcheck_name] = useState(true);
  const [check_email, setcheck_email] = useState(true);
  const [check_mobile, setcheck_mobile] = useState(true);
  const [check_skills, setCheck_skills] = useState(true);
  const [check_specialities, setCheck_specialities] = useState(true);
  const [managerFirstName, setManagerFirstName] = useState(props.firstname);
  const [managerLastName, setManagerLastName] = useState(props.lastname);
  const [managerPhone, setManagerPhone] = useState(props.mobile);
  const [managerEmail, setManagerEmail] = useState(props.email);
  const [skills, setSkills] = useState(props.skills);
  const [specialitiesList, setSpecialitiesList] = useState([]);

  const [msg_error, setmsg_error] = useState("");
  const [msg_error1, setmsg_error1] = useState("");
  const [msg_error3, setmsg_error3] = useState("");
  const [msg_error4, setmsg_error4] = useState("");
  const [msg_error5, setmsg_error5] = useState("");
  const [msg_error6, setmsg_error6] = useState("");
  const [msg_error7, setmsg_error7] = useState("");
  const [msg_error8, setmsg_error8] = useState("");

  const [selectedSpecialities, setSelectedSpecialities] = useState([]);
  const [save, setSave] = useState(0);
  const [nextpageno, setnextpageno] = useState(2);
  const [previouspageno, setpreviouspageno] = useState(1);
  const [currentpageno, setcurrentpageno] = useState(1);

  const [Propertys, setPropertys] = useState([]);
  const [category, setCategory] = useState([]);

  const [propertyList, setPropertyList] = useState([]);

  const UPDATE_TECHNICAL_STAFF = "/technicalStaff/update";
  const GET_TECHNICAL_SPECIALITY = "/technicalStaff/get_speciality";
  const GET_PROPERTY_URL = "/property/list";

  const decode = jwt_decode(window.localStorage.getItem("accessToken"));

  const getSpeciality = async (e) => {
    try {
      const response = await axios.post(GET_TECHNICAL_SPECIALITY, {
        companyId: decode.id,
      });

      if (response.data?.success) {
        setSpecialitiesList([]);
        await response.data.specialties.forEach((element) => {
          setSpecialitiesList((current) => [
            ...current,
            { label: element.speciality, value: element._id },
          ]);
        });

        let categ = await props.specialities.map((categ) => {
          const { speciality, _id } = response.data.specialties.find(
            (prop) => categ._id == prop._id
          );
          return { label: speciality, value: _id };
        });

        setCategory(categ);
      } else {
        // setVendorError(response.data?.errorMessage)
      }
    } catch (error) {
      // setVendorError("Something went wrong")

      console.log(error); // TODO proper error
    }
  };

  // Getting Properties for options
  async function getProperties(companyDomain) {
    try {
      const response = await axios.post(GET_PROPERTY_URL, {
        domain: companyDomain,
        role: "company",
      });
      //setPropertyList(response.data.properties);
      // console.log(response.data);
      if (response.data.status == 200) {
        setPropertyList([]);
        await response.data.results.properties.forEach((element) => {
          setPropertyList((current) => [
            ...current,
            { label: element.title, value: element._id },
          ]);
        });

        let myprop = props.assignedProperties.map((assigned) => {
          const { _id, title } = response.data.results.properties.find(
            (prop) => assigned._id === prop._id
          );
          return { label: title, value: _id };
        });
        setPropertys(myprop);
      }
    } catch (error) {
      console.log(error);
      console.log("Unable to fetch");
    }
  }

  const handleDeleteClick = async () => {
    const confirmed = window.confirm("Are you sure you want to delete?");

    if (confirmed) {
      //  e.preventDefault();
      await deleteTechnicalStaff(props.id, props.userID);
    }
  };

  async function deleteTechnicalStaff(managerID, userID) {
    try {
      const response = await axios.post(
        `/technicalStaff/delete_technical_staff`,
        { technicalStaff: managerID }
      );
      if (response.data.success) {
        window.location.replace("/technical_staff");
      }
    } catch (error) {
      // TODO proper Error
    }
  }

  async function getMaintenanceTeamData() {}

  function removeBodyCss() {
    document.body.classList.add("no_padding");
  }

  function tog_large() {
    if (modal_large) {
      console.log("Excecuted");
      setcheck_first(true);
      setcheck_last(true);
      setcheck_name(true);
      setcheck_email(true);
      setcheck_mobile(true);
      setCheck_skills(true);
      setCheck_specialities(true);
    }

    setmodal_large(!modal_large);
    removeBodyCss();
  }

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
        .post("/technicalStaff/status-update", {
          staffID: id,
          staffStatus: val,
        })
        .then((res) => {
          props.FilterSearch();
          toast.success(res.data.message);
        });
    } catch (error) {
      console.log(error.message);
    }
  };
  async function editTechnicalStaff(event) {
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

    // if (Propertys.length <= 0) {
    //   setcheck_name(false);
    //   return setmsg_error3("Cannot be empty");
    // } else {
    //   setcheck_name(true);
    // }

    if (category.length <= 0) {
      setCheck_specialities(false);
      return setmsg_error7("Cannot be empty");
    } else {
      setCheck_specialities(true);
    }

    if (!skills) {
      setCheck_skills(false);
      return setmsg_error6("Cannot be empty");
    } else {
      setCheck_skills(true);
    }

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
      category &&
      check_specialities &&
      skills &&
      check_skills
    ) {
      const saveSpinner = document.getElementById("saveSpinner");
      const failedSaveErrorIcon = document.getElementById(
        "failedSaveErrorIcon"
      );
      const managerSaveBtn = document.getElementById("managerSaveBtn");
      const errorSpan = document.getElementById("errorSpan");
      const domain = decode.domain;

      managerSaveBtn.disabled = true;
      saveSpinner.style.display = "inline-block";
      failedSaveErrorIcon.style.display = "none";
      errorSpan.style.display = "none";

      try {
        const response = await axios.put(UPDATE_TECHNICAL_STAFF, {
          first_name: managerFirstName,
          last_name: managerLastName,
          email: managerEmail,
          contact_no: managerPhone,
          assigned_properties: Propertys?.map((property) => property.value),
          // assigned_properties: Propertys,
          specialties: category?.map((cate) => cate.value),
          companyAssigned: domain,
          assigned_companies: [decode.id],
          skills: skills,
        });

        if (response.data.status === 200) {
          window.location.replace("/technical_staff");
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

  return (
    <>
      <Modal
        size="lg"
        isOpen={modal_large}
        toggle={() => {
          tog_large();
        }}
      >
        <div className="modal-header">
          <h5 className="modal-title mt-0" id="myLargeModalLabel">
            Edit Maintenance Team
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
          <Form onSubmit={editTechnicalStaff}>
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
                    <Label style={{ color: "red" }}>{msg_error}</Label>
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
                    <Label style={{ color: "red" }}>{msg_error1}</Label>
                  )}
                </div>
              </div>
              <div className="col-md-6">
                <div className="mb-3">
                  <Label className="form-label" htmlFor="formrow-email-input">
                    Email *
                  </Label>
                  <Input
                    value={props.email}
                    onChange={(e) => {
                      setManagerEmail(e.target.value);
                    }}
                    type="text"
                    className="form-control"
                    id="formrow-email-input"
                  />
                  {check_email ? (
                    ""
                  ) : (
                    <Label style={{ color: "red" }}>{msg_error4}</Label>
                  )}
                </div>
              </div>
              <div className="col-md-6">
                <div className="mb-3">
                  <Label className="form-label" htmlFor="formrow-phone-input">
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
                  />
                  {check_mobile ? (
                    ""
                  ) : (
                    <Label style={{ color: "red" }}>{msg_error5}</Label>
                  )}
                </div>
              </div>

              <div className="col-md-6">
                <div className="mb-3">
                  <Label
                    className="form-label"
                    htmlFor="formrow-facility-input"
                  >
                    Properties *
                  </Label>
                  <Select
                    isMulti
                    value={Propertys}
                    onBlur={(e) => {
                      if (!Propertys?.length > 0) {
                        setcheck_name(false);
                        setmsg_error3("Please select a Property!");
                      } else {
                        setcheck_name(true);
                      }
                    }}
                    onChange={(selectedOption) => {
                      const propertys = [];
                      selectedOption.map((property) => {
                        propertys.push(property);
                      });
                      setPropertys(propertys);
                    }}
                    options={propertyList}
                    className="basic-multi-select"
                    classNamePrefix="select"
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
                  {check_name ? (
                    ""
                  ) : (
                    <Label style={{ color: "red" }}>{msg_error3}</Label>
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
                    value={category}
                    onChange={(selectedOption) => {
                      const speciality = [];
                      selectedOption.map((property) => {
                        speciality.push(property);
                      });
                      setCategory(speciality);
                    }}
                    onBlur={(e) => {
                      if (!category?.length > 0) {
                        setCheck_specialities(false);
                        setmsg_error7("Please select a speciality!");
                      } else {
                        setCheck_specialities(true);
                      }
                    }}
                    options={specialitiesList}
                    className="basic-multi-select"
                    classNamePrefix="Select"
                  />
                  {check_specialities ? (
                    ""
                  ) : (
                    <Label style={{ color: "red" }}>{msg_error7}</Label>
                  )}
                </div>
              </div>

              <div className="col-md-12">
                <div className="mb-3">
                  <Label
                    className="form-label"
                    htmlFor="formrow-firstname-input"
                  >
                    Skill *
                  </Label>
                  <Input
                    value={skills}
                    onChange={(e) => {
                      setSkills(e.target.value);
                    }}
                    type="textarea"
                    className="form-control"
                    id="formrow-phone-input"
                  />
                  {check_skills ? (
                    ""
                  ) : (
                    <Label style={{ color: "red" }}>{msg_error6}</Label>
                  )}
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
      <tr>
        <td>{props.number}</td>
        <td>{props.primaryID}</td>
        <td>
          {props.name}
          <br></br>
          {props.email}
          <br></br>
          {props.mobile}
        </td>
        {/*<td>20</td> */}
        {/* <td>{props.mobile}</td> */}
        <td>{props.properties.join(",")}</td>
        <td>
          {props.specialities.length > 0
            ? props.specialities.map((a) => a.speciality).join(",")
            : "No Category found"}
        </td>

        {/* <td className="text-capitalize">
          {" "}
          {decode.role === "company" ? (
            <select
              className={`form-select applicant-status btn-sm ${getColor(
                props?.status
              )}`}
              style={{ width: "120px" }}
              defaultValue={props?.status}
              onChange={(event) => {
                handleUpdate(props.id, event.target.value);
              }}
            >
              <option className="btn btn-light" value={"Suspended"}>
                Suspended
              </option>
              <option className="btn btn-light " value="Verified">
                Verified
              </option>
              <option className="btn btn-light " value="Rejected">
                Rejected
              </option>
            </select>
          ) : (
            props?.status
          )}
        </td> */}
        {/* <td>
          {" "}
          <Rating
            initialValue={props?.tickets?.[0]?.totalRating || 0}
            readonly={true}
            size={20}
          />
        </td> */}
        <td>
          {" "}
          {props.tickets.length > 0 &&
            `${props.tickets.map((a) => a.completed)}/${props.tickets.map(
              (a) => a.total
            )}`}
        </td>
        {/* <td>56</td> */}

        {decode.role === "company" && (
          <td>
            <div className="d-flex gap-3">
              <Link className="text-success" to="#">
                <i
                  className="mdi mdi-pencil font-size-18 "
                  id="edittooltip"
                  onClick={async () => {
                    // getMaintenanceTeamData();
                    await getProperties(decode.domain);
                    await getSpeciality();
                    tog_large();
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
                  onClick={handleDeleteClick}
                  // onClick={async (e) => {
                  //   e.preventDefault();
                  //   await deleteTechnicalStaff(props.id, props.userID)
                  // }}
                ></i>
              </Link>
            </div>
          </td>
        )}
      </tr>
    </>
  );
}
