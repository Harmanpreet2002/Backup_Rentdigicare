import React, { useState } from 'react'
import { Link } from "react-router-dom"
import axios from "../api/axios";
import {
  Modal,
  Form,
  Label,
  Input
} from "reactstrap"
import { useDropzone } from 'react-dropzone';

export default function Company(props) {
  const EDIT_COMPANY_URL = "/company/edit";

  const [CompanyName, setCompanyName] = useState(props.name);
  const [Owner_First_Name, setOwner_First_Name] = useState(props.ownerFirstName);
  const [Owner_Last_Name, setOwner_Last_Name] = useState(props.ownerLastName);
  const [Addresss1, setAddresss1] = useState(props.addresses[0]);
  const [Addresss2, setAddresss2] = useState(props.addresses[1]);
  const [Cityy, setCityy] = useState(props.city);
  const [Zipp, setZipp] = useState(props.zip);
  const [Statee, setStatee] = useState(props.state);
  const [Emaill, setEmaill] = useState(props.email);
  const [Phone, setPhone] = useState(props.phone);
  const [Domainn, setDomainn] = useState(props.domain);
  const [logo, setLogo] = useState(props?.logo);
  const { acceptedFiles, getRootProps, getInputProps } = useDropzone();
  const files = acceptedFiles.map((file) => (
    <li key={file.name}>
      {file.name} - {file.size} bytes
    </li>
  ));
  let check_company = false;
  let check_first = false
  let check_second = false
  let check_add1 = false
  let check_add2 = false
  let check_city = false
  let _d_check_city = false
  let check_state = false
  let _d_check_state = false
  let check_zip = false
  let _d_check_zip = false
  let check_email = false
  let check_phone = false
  let _d_check_email = false
  let _d_check_phone = false
  let check_domain = false
  let _d_check_domain = false


  const [msg_error_name, setmsg_error_name] = useState("");
  const [msg_error1, setmsg_error1] = useState("");
  const [msg_error2, setmsg_error2] = useState("");
  const [msg_error_add1, setmsg_error_add1] = useState("");
  const [msg_error_add2, setmsg_error_add2] = useState("");
  const [msg_error_city, setmsg_error_city] = useState("");
  const [msg_error_domain, setmsg_error_domain] = useState("");
  const [msg_error_email, setmsg_error_email] = useState("");
  const [msg_error_phone, setmsg_error_phone] = useState("");
  const [msg_error_state, setmsg_error_state] = useState("");
  const [msg_error_zip, setmsg_error_zip] = useState("");
  

  // for model functionality
  const [modal_large, setmodal_large] = useState(false);
  function tog_large() {
    setmodal_large(!modal_large)
    removeBodyCss()
  }
  function removeBodyCss() {
    document.body.classList.add("no_padding")
  }
  // Adding Company to Database
  const onModalSave = async (event) => {

    console.log(acceptedFiles[0])

    event.preventDefault()

  //  alert(window.localStorage.getItem("accessToken")) 
  const token = window.localStorage.getItem("accessToken");

  
  

    if (Owner_First_Name === "") {
      check_first = false
      setmsg_error1("firstname cannot Be Empty");
    } else {
      check_first = true
    }
    if (CompanyName === "") {
      check_company = false
      setmsg_error_name("name Cannot Be Empty");
    } else {
      check_company = true
    }

    if (Owner_First_Name !== "") {
      if (!Owner_First_Name.match(/^[a-zA-Z ]+$/)) {
        check_first = false
        setmsg_error1("Only Letters Allowed");
      } else {
        check_first = true
      }
    }

    if (Owner_Last_Name === "") {
      check_second = false
      setmsg_error2("Cannot Be Empty");
    }

    if (Addresss1 === "") {
      check_add1 = false
      setmsg_error_add1("Cannot Be Empty");
    } else {
      check_add1 = true
    }
    if (Addresss2 === "") {
      check_add2 = false;
      setmsg_error_add2("Cannot Be Empty");
    } else {
      check_add2 = true;
    }
    

    if (Owner_Last_Name !== "") {
      if (!Owner_Last_Name.match(/^[a-zA-Z ]+$/)) {
        check_second = false
        setmsg_error2("Only Letters Allowed");
      } else {
        check_second = true
      }
    }

    if (Cityy === "") {
      check_city = false;
      setmsg_error_city("Cannot Be Empty");
    } else {
      setmsg_error_city("");
      check_city = true;
    }
    
    if (Cityy != "") {
      if (!Cityy.match(/^[a-zA-Z0-9 ]+$/)) {
        check_city = false;
        _d_check_city = false;
        setmsg_error_city("Only Letters And Numbers Are Allowed");
      } else {
        setmsg_error_city(true);
        _d_check_city = true;
      }
    }

    if (Statee === "") {
      check_state = false;
      setmsg_error_state("Cannot Be Empty");
    }

    if (Statee != "") {
      if (!Statee.match(/^[a-zA-Z0-9 ]+$/)) {
        check_state = false
        _d_check_state = false;
        setmsg_error_state("Only Letters And Numbers Are Allowed");
      } else {
        setmsg_error_state(true);
        _d_check_state = true;
      }
    }

    if (Zipp === "") {
      check_zip = false
      setmsg_error_zip("Cannot Be Empty");
    }

    if (Zipp != "") {
      if (!Zipp.match(/^[a-zA-Z0-9 ]+$/)) {
        check_zip = false
        _d_check_zip = false
        setmsg_error_zip("Only Letters And Numbers Are Allowed");
      } else {
        setmsg_error_zip(true);
        _d_check_zip = true
      }
    }

    if (Emaill === "") {
      check_email = false
      setmsg_error_email("Cannot Be Empty");
    }

    if (Emaill != "") {
      if (!Emaill.match(/\S+@\S+\.\S+/)) {
        check_email = false
        _d_check_email = false
        setmsg_error_email("Enter Valid Email Address");
      } else {
        setmsg_error_email(true);
        _d_check_email = true
      }
    }

    if (Phone != "") {
      if (
        !Phone.match(
          /^[\+]?[(]?[0-9]{3}[)]?[-\s\.]?[0-9]{3}[-\s\.]?[0-9]{4,6}$/
        )
      ) {
        check_phone = false
        _d_check_phone = false
        setmsg_error_phone("Enter Valid Phone Number");
      } else {
        setmsg_error_phone(true);
        _d_check_phone = true
      }
    }

    if (Domainn === "") {
      check_domain = false
      setmsg_error_domain("Cannot Be Empty");
    }

    if (Domainn != "") {
      if (
        !Domainn.match("(https?://)?([\\da-z.-]+)\\.([a-z.]{2,6})[/\\w .-]*/?")
      ) {
        check_domain = false
        _d_check_domain = false
        setmsg_error_domain("Enter Valid Domain");
      } else {
        setmsg_error_domain(true);
        _d_check_domain = true
      }
    }

    
    if (
      CompanyName &&
      check_company === true &&
      Owner_First_Name &&
      check_first === true &&
      Owner_Last_Name &&
      check_second === true &&
      Addresss1 &&
      check_add1 === true &&
      Addresss2 && 
      check_add2 === true &&
      Cityy &&
      _d_check_city === true &&
      Statee &&
      _d_check_state === true &&
      Zipp &&
      _d_check_zip === true &&
      Emaill &&
      _d_check_email === true &&
      Domainn &&
      _d_check_domain === true &&
      Phone &&
      _d_check_phone === true
    ){

      console.log("condition passed");
      const saveSpinner = document.getElementById("saveSpinner");
      const failedSaveErrorIcon = document.getElementById(
        "failedSaveErrorIcon"
      );
      const companySubmitBtn = document.getElementById("companySubmitBtn");
      const errorSpan = document.getElementById("errorSpan");

      companySubmitBtn.disabled = true;
      saveSpinner.style.display = "inline-block";
      failedSaveErrorIcon.style.display = "none";
      errorSpan.style.display = "none";
      try {
        const response = await axios.put(EDIT_COMPANY_URL, {
          adminID:event.target.adminID.value,
          companyID:event.target.companyID.value,
          name: event.target.name.value,
          phone: event.target.phone.value,
          ownerFirstName: event.target.ownerFirstName.value,
          ownerLastName: event.target.ownerLastName.value,
          city: event.target.city.value,
          state: event.target.state.value,
          address: [event.target.address1.value, event.target.address2.value],
          zip: event.target.zip.value,
          email: event.target.email.value,
          domain: event.target.domain.value,
        }, {
          headers: {
            'Content-Type': 'application/json',
            'Authorization': `Bearer ${token}`
          }
        });

        if (response.data.status === 201) {
          if(acceptedFiles[0]){
          await uploadDocuments(response.data.id);
          }
          window.location.reload();
        } else {
          errorSpan.innerText = response.data.message;
          saveSpinner.style.display = "none";
          companySubmitBtn.disabled = false;
          failedSaveErrorIcon.style.display = "inline-block";
          errorSpan.style.display = "inline-block";
        }
        
      
        // Handle the response
        console.log(response);
      } catch (error) {
        // Handle the error
        saveSpinner.style.display = "none";
        companySubmitBtn.disabled = false;
        failedSaveErrorIcon.display = "inline-block";
        console.log(error);
      }
      
    }else{
    
    }
    
  }
  async function uploadDocuments(val) {
    const formData = new FormData();
    formData.append(`file`, acceptedFiles[0]);
    // const file = formData.get('file'); 
    // console.log('File name:',file);
    console.log(formData,'formData')

    const config = {
      headers: {
        "content-type": "multipart/form-data",
        id: `${val}`,
      },
    };
    // alert("stop")
    try {
      const response = await axios.post(
        "/company/upload-documents",
        formData,
        config
      );
    } catch (error) {

    }
  }
  async function deleteCompany(companyID, adminID) {

    if (window.confirm('Are you sure?')) {
      const response = await axios.delete(`/company/delete?companyID=${companyID}&adminID=${adminID}`)
      if (response.data.status === 200) {
        window.location.replace("/company")
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
          <h5
            className="modal-title mt-0"
            id="myLargeModalLabel"
          >
            Edit Company
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
          <Form onSubmit={onModalSave}>
            <div className="row align-items-center">
              <div className="col-md-6">
                <div className="mb-3">
                  <Label
                    className="form-label"
                    htmlFor="formrow-name-input"
                  >
                  <input
                  name="companyID"
                  type='text'
                  value={props.id}
                  style={{ display: 'none' }}
                  >
                  </input>  
                  <input
                  name="adminID"
                  type='text'
                  value={props.adminID}
                  style={{ display: 'none' }}
                  >
                  </input>
                    Company Name *
                  </Label>
                  <Input
                    defaultValue={props.name}
                    name="name"
                    type="text"
                    className="form-control"
                    id="formrow-name-input"
                    onChange={(e) =>
                      setCompanyName(e.target.value)
                    }
                  />
                  {check_company ? (
                    ""
                  ) : (
                    <Label style={{ color: "red" }}>
                      {msg_error_name}
                    </Label>
                  )}
                </div>
              </div>
              <div className="col-md-6">
                <div className="mb-3">
                  <Label
                    className="form-label"
                    htmlFor="formrow-name-input"
                  >
                    Owner Firstname *
                  </Label>
                  <Input
                    defaultValue={props.ownerFirstName}
                    name="ownerFirstName"
                    type="text"
                    className="form-control"
                    id="formrow-name-input"
                    onChange={(e) =>
                      setOwner_First_Name(e.target.value)
                    }

                  />
                  {check_first ? (
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
                    htmlFor="formrow-name-input"
                  >
                    Owner Lastname *
                  </Label>
                  <Input
                    defaultValue={props.ownerLastName}
                    name="ownerLastName"
                    type="text"
                    className="form-control"
                    id="formrow-name-input"
                    onChange={(e) =>
                      setOwner_Last_Name(e.target.value)
                    }
                  />
                  {check_second ? (
                    ""
                  ) : (
                    <Label style={{ color: "red" }}>
                      {msg_error2}
                    </Label>
                  )}
                </div>
              </div>
              <div className="col-md-6">
                <div className="mb-3">
                  <Label
                    className="form-label"
                    htmlFor="formrow-address-input"
                  >
                    Address 1 *
                  </Label>
                  <Input
                    defaultValue={props.addresses[0]}
                    name="address1"
                    type="text"
                    className="form-control"
                    id="formrow-address-input"
                    onChange={(e) =>
                      setAddresss1(e.target.value)
                    }
                  />
                  {check_add1 ? (
                    ""
                  ) : (
                    <Label style={{ color: "red" }}>
                      {msg_error_add1}
                    </Label>
                  )}
                </div>
              </div>
              <div className="col-md-6">
                <div className="mb-3">
                  <Label
                    className="form-label"
                    htmlFor="formrow-address-input"
                  >
                    Address 2 *
                  </Label> 
                  <Input
                    defaultValue={props.addresses[1]}
                    name="address2"
                    type="text"
                    className="form-control"
                    id="formrow-address-input"
                    onChange={(e) =>
                      setAddresss2(e.target.value)
                    }
                  />
                  {check_add2 ? (
                    ""
                  ) : (
                    <Label style={{ color: "red" }}>
                      {msg_error_add2}
                    </Label>
                  )}
                </div>
              </div>
              <div className="col-md-6">
                <div className="mb-3">
                  <Label
                    className="form-label"
                    htmlFor="formrow-city-input"
                  >
                    City *
                  </Label>
                  <Input
                    defaultValue={props.city}
                    name="city"
                    type="text"
                    className="form-control"
                    id="formrow-city-input"
                    onChange={(e) =>
                      setCityy(e.target.value)
                    }
                  />
                  {check_city ? (
                    ""
                  ) : (
                    <Label style={{ color: "red" }}>
                      {msg_error_city}
                    </Label>
                  )}
                </div>
              </div>
              <div className="col-md-6">
                <div className="mb-3">
                  <Label
                    className="form-label"
                    htmlFor="formrow-state-input"
                  >
                    State *
                  </Label>
                  <Input
                    defaultValue={props.state}
                    name="state"
                    type="text"
                    className="form-control"
                    id="formrow-state-input"
                    onChange={(e) =>
                      setStatee(e.target.value)
                    }
                  />
                  {check_state ? (
                    ""
                  ) : (
                    <Label style={{ color: "red" }}>
                      {msg_error_state}
                    </Label>
                  )}

                </div>
              </div>
              <div className="col-md-6">
                <div className="mb-3">
                  <Label
                    className="form-label"
                    htmlFor="formrow-zip-input"
                  >
                    Zip *
                  </Label>
                  <Input
                    defaultValue={props.zip}
                    name="zip"
                    type="text"
                    className="form-control"
                    id="formrow-zip-input"
                    onChange={(e) =>
                      setZipp(e.target.value)
                    }
                  />
                  {check_zip ? (
                    ""
                  ) : (
                    <Label style={{ color: "red" }}>
                      {msg_error_zip}
                    </Label>
                  )}
                </div>
              </div>
              <div className="col-md-6">
                <div className="mb-3">
                  <Label
                    className="form-label"
                    htmlFor="formrow-zip-input"
                  >
                    Email *
                  </Label>
                  <Input
                    defaultValue={props.email}
                    name="email"
                    type="text"
                    className="form-control"
                    id="formrow-zip-input"
                    onChange={(e) =>
                      setEmaill(e.target.value)
                    }
                  />
                  {check_email ? (
                    ""
                  ) : (
                    <Label style={{ color: "red" }}>
                      {msg_error_email}
                    </Label>
                  )}
                </div>
              </div>
              <div className="col-md-6">
                <div className="mb-3">
                  <Label
                    className="form-label"
                    htmlFor="formrow-zip-input"
                  >
                    Phone *
                  </Label>
                  <Input
                    defaultValue={props.phone}
                    name="phone"
                    type="text"
                    className="form-control"
                    id="formrow-zip-input"
                    onChange={(e) =>
                      setPhone(e.target.value)
                    }
                  />
                  {check_phone ? (
                    ""
                  ) : (
                    <Label style={{ color: "red" }}>
                      {msg_error_phone}
                    </Label>
                  )}


                </div>
              </div>
              <div className="col-md-6">
                <div className="mb-3">
                  <Label
                    className="form-label"
                    htmlFor="formrow-zip-input"
                  >
                    {check_domain ? (
                    ""
                  ) : (
                    <Label style={{ color: "red" }}>
                      {msg_error_domain}
                    </Label>
                  )}
                  Domain *
                  </Label>
                  <Input
                    defaultValue={props.domain}
                    name="domain"
                    type="text"
                    className="form-control"
                    id="formrow-zip-input"
                    onChange={(e) =>
                      setDomainn(e.target.value)
                    }
                  />
                  {check_domain ? (
                    ""
                  ) : (
                    <Label style={{ color: "red" }}>
                      {msg_error_domain}
                    </Label>
                  )}
                </div>
              </div>
              <div className="col-md-6">
                <div className="mb-3">
                  <Label className="form-label" htmlFor="formrow-zip-input">
                    Logo
                  </Label>
                  <div {...getRootProps({ className: 'form-control' })}>
                    <input
                      className="form-control"
                      id="formrow-zip-input"
                      {...getInputProps({ multiple: false })}
                    />
                    <p className="m-0">Choose your file</p>
                  </div>
                  {acceptedFiles.length > 0 && (
                    <ul>
                      <li key={acceptedFiles[0].name}>
                        {acceptedFiles[0].name} - {acceptedFiles[0].size} bytes
                      </li>
                    </ul>
                  )}
                </div>
              </div>
              <div className="col-md-12">
                <div className="text-end">
                  <span id="errorSpan" style={{ display: "none", color: "red", marginRight: "10px" }}>Error:here</span>
                  <button
                    id="companySubmitBtn"
                    type="submit"
                    className="btn btn-success save-user"
                  >
                    Save
                    <div id="saveSpinner" style={{ display: "none", height: "15px", width: "15px", marginLeft: "5px" }} class="spinner-border" role="status"></div>
                    <i id="failedSaveErrorIcon" style={{ display: "none", marginLeft: "5px" }} class="fa fa-exclamation-triangle" aria-hidden="true"></i>
                  </button>
                </div>
              </div>
            </div>
          </Form>
        </div>
      </Modal>
      <tr>
        <td>{props.number}</td>
        <td>
          <Link to="#">
            {props.name}
          </Link>
        </td>
        <td>{props.owner}</td>
        <td>{props.email}</td>
        <td>{props.domain}</td>
        <td>{props.city}</td>
        <td>{props.state}</td>
        <td className='text-center'>{props?.logo ? <button
              onClick={async () => {
                  window.location.href = props?.logo }}
                type="button"
                className="btn btn-soft-light btn-sm w-xs waves-effect "
              >
                <i className="bx bx-download label-icon"></i>
              </button> : <p className='text-center'>NA</p>}</td>
        <td className='text-center'>
          <div>
            <Link to="#">
              <i
                className="mdi mdi-clipboard-text font-size-18"
                onClick={() => {
                  navigator.clipboard.writeText(`<script src = "${props.script}"></script>`);
                }}
              ></i>
            </Link>
          </div>
        </td>
        {/* <td>13-12-2022</td>
    <td>14-12-2022</td> */}
        {/* <td>Yes</td> */}
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
                onClick={async (e) => {
                  e.preventDefault();
                  await deleteCompany(props.id, props.adminID)
                }}
              ></i>
            </Link>
          </div>
        </td>
      </tr>
    </>

  )
}
