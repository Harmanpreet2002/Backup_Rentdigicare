import React, { useState } from "react";
import MetaTags from 'react-meta-tags';
import {
    Row,
    Col,
    Card,
    CardBody,
    CardHeader,
    Label,
    Input
} from "reactstrap"

//Import Breadcrumb
import Breadcrumbs from "../../components/Common/Breadcrumb"

import { SERVER_URL } from "../ServerLink";

import Dropzone from "react-dropzone";
import { Link } from "react-router-dom";


import axios from "../api/axios";
import jwt_decode from "jwt-decode";


// TODO Validations
const Setting = () => {
    const decode = jwt_decode(window.localStorage.accessToken)

    // update password fields
    const [oldPassword, setOldPassword] = useState("")
    const [password, setPassword] = useState("")
    const [confirmPassword, setConfirmPassword] = useState("")
    const [checked, setchecked] = useState()
    const [showPassword, setShowPassword] = useState(false)
    const [showConfirmPassword, setShowConfirmPassword] = useState(false);

    // profile update fields
    const [username, setUsername] = useState(decode.username || "")
    const [firstname, setFirstName] = useState(decode.firstname || "")
    const [lastname, setLastName] = useState(decode.lastname || "")
    const [companyName, setCompanyName] = useState(decode.company || "")
    const [ownerName, setOwnerName] = useState(decode.owner || "")
    const [managerName, setManagerName] = useState(decode.name || "")
    const [timezone, setTimezone] = useState(decode.timezone || "")


    //Loading
    const [profileLoading, setProfileLoading] = useState(false)
    const [passwordLoading, setPasswordLoading] = useState(false)


    const [selectedFiles, setselectedFiles] = useState(decode.profile ? [`${SERVER_URL}/${decode.profile}`] : []);

    console.log(selectedFiles)


    function formatBytes(bytes, decimals = 2) {
        if (bytes === 0) return "0 Bytes";
        const k = 1024;
        const dm = decimals < 0 ? 0 : decimals;
        const sizes = ["Bytes", "KB", "MB", "GB", "TB", "PB", "EB", "ZB", "YB"];

        const i = Math.floor(Math.log(bytes) / Math.log(k));
        return parseFloat((bytes / Math.pow(k, i)).toFixed(dm)) + " " + sizes[i];
    }

    function updateToken(token) {
        // remove old access token
        window.localStorage.removeItem("accessToken")
        // set new accessToken with updated info
        console.log("TToken", jwt_decode(token))

        window.localStorage.setItem("accessToken", token)

    }

    if (checked == false) {

        const data = {
            email: window.localStorage.getItem("email"),
            role: decode.role,
        }

        const res = axios.post("/two-fa/disable-link", data)
            .then(res => {
                console.log(res)
            })
            .catch(error => {
                console.log(error)

            })
    }

    if (checked == true) {

        const data = {
            email: window.localStorage.getItem("email"),
            role: decode.role,
        }

        const res = axios.post("/two-fa/enable", data)
            .then(res => {
                console.log(res)
            })
            .catch(error => {
                console.log(error)

            })
    }

    function displaySuccessMessage(message, token) {
        const messageSpan = document.getElementById("updateMessageSpan");
        // update Access Token
        updateToken(token)
        messageSpan.innerText = message
        messageSpan.style.color = "green"
        messageSpan.style.display = "inline-block"
    }

    function displayFailureMessage(message) {
        const messageSpan = document.getElementById("updateMessageSpan");
        messageSpan.innerText = message
        messageSpan.style.color = "red"
        messageSpan.style.display = "inline-block"
    }


    const uploadDocuments = async (id) => {

        if (selectedFiles.length > 0 && !selectedFiles[0]?.preview) {

            return;
        }

        const formData = new FormData();
        var i = 0;

        while (i < selectedFiles.length) {
            formData.append(`file`, selectedFiles[i]);
            i++
        }




        const config = {
            headers: {
                "content-type": "multipart/form-data",
                "id": `${id}`,
                "role": decode.role
            },
        };

        try {
            const response = await axios.post("/settings/upload-documents", formData, config);
        } catch (error) {
            console.log(error)
        }



    }

    async function updateProfileInformation(e, role) {
        e.preventDefault()
        setProfileLoading(true)
        if (role === "admin") {
            const messageSpan = document.getElementById("updateMessageSpan");
            messageSpan.style.display = "none"
            await uploadDocuments(decode.id)
            try {
                const response = await axios.post("/settings/edit-information", {
                    role: decode.role,
                    userID: decode.id,
                    username: username,
                    firstname: firstname,
                    lastname: lastname,
                    timezone: timezone
                });

                if (response.data.status === 201) displaySuccessMessage(response.data.message, response.data.accessToken)
                if (response.data.status === 409) displayFailureMessage(response.data.message)
                window.location.replace("/setting")

            } catch (error) {
                setProfileLoading(false)

                displayFailureMessage("Something went wrong !")
            }
        } else if (role === "company") {
            await uploadDocuments(decode.id)

            const messageSpan = document.getElementById("updateMessageSpan");
            messageSpan.style.display = "none"
            try {
                const response = await axios.post("/settings/edit-information", {
                    role: decode.role,
                    userID: decode.id,
                    username: username,
                    companyName: companyName,
                    firstname: firstname,
                    lastname: lastname,
                    timezone: timezone
                });

                if (response.data.status === 201) {
                    displaySuccessMessage(response.data.message, response.data.accessToken)

                    window.location.replace("/setting")


                }
                if (response.data.status === 409) displayFailureMessage(response.data.message)
                setProfileLoading(false)


            } catch (error) {
                setProfileLoading(false)

                displayFailureMessage("Something went wrong !")
            }
        } else if (decode.role === "manager") {
            const messageSpan = document.getElementById("updateMessageSpan");
            messageSpan.style.display = "none"
            try {
                await uploadDocuments(decode.id)

                const response = await axios.post("/settings/edit-information", {
                    role: decode.role,
                    userID: decode.id,
                    username: username,
                    firstname: firstname,
                    lastname: lastname,
                    timezone: timezone
                });

                if (response.data.status === 201) {
                    displaySuccessMessage(response.data.message, response.data.accessToken)

                    console.log(jwt_decode(response.data.accessToken), "response.data.accessToken")
                    setProfileLoading(false)

                    window.location.replace("/setting")

                }
                if (response.data.status === 409) displayFailureMessage(response.data.message)
            } catch (error) {
                displayFailureMessage("Something went wrong !")
            }
        }
        else if (decode.role === "customer") {
            const messageSpan = document.getElementById("updateMessageSpan");
            messageSpan.style.display = "none"
            try {
                await uploadDocuments(decode.id)

                const response = await axios.post("/settings/edit-information", {
                    role: decode.role,
                    userID: decode.id,
                    username: username,
                    firstname: firstname,
                    lastname: lastname,
                    timezone: timezone
                });

                if (response.data.status === 201) {
                    displaySuccessMessage(response.data.message, response.data.accessToken)


                    window.location.replace("/setting")

                }
                if (response.data.status === 409) displayFailureMessage(response.data.message)
                setProfileLoading(false)

            } catch (error) {
                setProfileLoading(false)

                displayFailureMessage("Something went wrong !")
            }
        }

        else if (decode.role === "technical staff") {
            const messageSpan = document.getElementById("updateMessageSpan");
            messageSpan.style.display = "none"
            try {
                await uploadDocuments(decode.id)

                const response = await axios.post("/settings/edit-information", {
                    role: decode.role,
                    userID: decode.id,
                    username: username,
                    firstname: firstname,
                    lastname: lastname,
                    timezone: timezone
                });

                if (response.data.status === 201) {
                    displaySuccessMessage(response.data.message, response.data.accessToken)


                    window.location.replace("/setting")

                }
                if (response.data.status === 409) displayFailureMessage(response.data.message)
                setProfileLoading(false)

            } catch (error) {
                setProfileLoading(false)

                displayFailureMessage("Something went wrong !")
            }
        }

        else if (decode.role === "vendor") {
            const messageSpan = document.getElementById("updateMessageSpan");
            messageSpan.style.display = "none"
            try {
                await uploadDocuments(decode.id)

                const response = await axios.post("/settings/edit-information", {
                    role: decode.role,
                    userID: decode.id,
                    username: username,
                    firstname: firstname,
                    lastname: lastname,
                    timezone: timezone
                });

                if (response.data.status === 201) {
                    displaySuccessMessage(response.data.message, response.data.accessToken)


                    window.location.replace("/setting")

                }
                if (response.data.status === 409) displayFailureMessage(response.data.message)
                setProfileLoading(false)

            } catch (error) {
                setProfileLoading(false)

                displayFailureMessage("Something went wrong !")
            }
        }



    }


    function handleAcceptedFiles(files) {
        files.map((file) => {
            Object.assign(file, {
                preview: URL.createObjectURL(file),
                formattedSize: formatBytes(file.size),
            })
        }
        );
        setselectedFiles(files);
    }

    const removeDocuments = (idToRemove) => {

        const filteredDocuments = selectedFiles.filter((item, i) => i !== idToRemove);

        setselectedFiles(filteredDocuments)

    }

    async function changePassword(e) {
        e.preventDefault()
        const messageSpan = document.getElementById("messageSpan");
        messageSpan.style.display = "none"

        if (!oldPassword) {
            messageSpan.innerText = "Please enter old password"
        } else if (!password) {
            messageSpan.innerText = "Please enter new password"
        } else if (!confirmPassword) {
            messageSpan.innerText = "Please enter confirm password"
        } else if (!(password == confirmPassword)) {
            messageSpan.innerText = "Confirm Password doesn't match !"
        }


        if (!oldPassword || !password || !confirmPassword || (!(password == confirmPassword))) {
            messageSpan.style.color = "red"
            messageSpan.style.display = "inline-block"
            return


        }

        try {
            setPasswordLoading(true)
            const response = await axios.post("/settings/change-password", {
                role: decode.role,
                userID: decode.id,
                oldPassword: oldPassword,
                password: password,
                confirmPassword: confirmPassword
            })
            if (response.data.status === 201) {
                messageSpan.innerText = response.data.message
                messageSpan.style.color = "green"
                messageSpan.style.display = "inline-block"
                // empty password fields on successful update
                // document.getElementById("oldPwdInput").value = ""
                // document.getElementById("newPwdInput").value = ""
                // document.getElementById("confirmPwdInput").value = ""
            }

            if (response.data.status === 409) {
                messageSpan.innerText = response.data.message
                messageSpan.style.color = "red"
                messageSpan.style.display = "inline-block"

            }
            setPasswordLoading(false)

            console.log(response.data.status, response.data.message)
        } catch (error) {
            setPasswordLoading(false)

            messageSpan.innerText = "Something went wrong !"
            messageSpan.style.color = "red"
            messageSpan.style.display = "inline-block"
        }
    }



    if (decode.role === "admin") {
        return (
            <React.Fragment>
                <div className="page-content">
                    <MetaTags>
                        <title>Profile Settings</title>
                    </MetaTags>
                    <div className="container-fluid">
                        <Breadcrumbs title="Home" breadcrumbItem="Profile Settings" />
                        <Row>
                            <Col xl={12}>
                                <Card>
                                    <CardHeader>
                                        <h4 className="card-title">Your Profile Details</h4>
                                    </CardHeader>
                                    <CardBody>
                                        <div className="row align-items-center">
                                            <div class="col-lg-6">
                                                <div className="mb-3">
                                                    <Label className="form-label" htmlFor="formrow-username-input">User
                                                        name</Label>
                                                    <Input onChange={(e) => {
                                                        setUsername(e.target.value)
                                                    }} type="text" className="form-control" id="formrow-username-input"
                                                        value={username} />
                                                </div>
                                            </div>
                                            <div class="col-lg-6">
                                                <div className="mb-3">
                                                    <Label className="form-label" htmlFor="formrow-email-input">Email
                                                        Address</Label>
                                                    <Input type="text" className="form-control" id="formrow-email-input"
                                                        value={decode.email} disabled={true} />
                                                </div>
                                            </div>
                                            <div class="col-lg-6">
                                                <div className="mb-3">
                                                    <Label className="form-label" htmlFor="formrow-firstname-input">First
                                                        Name</Label>
                                                    <Input onChange={(e) => {
                                                        setFirstName(e.target.value)
                                                    }} type="text" className="form-control" id="formrow-firstname-input"
                                                        value={firstname} />
                                                </div>
                                            </div>
                                            <div class="col-lg-6">
                                                <div className="mb-3">
                                                    <Label className="form-label" htmlFor="formrow-firstname-input">Last
                                                        Name</Label>
                                                    <Input onChange={(e) => {
                                                        setLastName(e.target.value)
                                                    }} type="text" className="form-control"
                                                        id="formrow-secondname-input" value={lastname} />
                                                </div>
                                            </div>

                                            <div class="col-lg-6">
                                                <div className="mb-3">
                                                    <Label className="form-Label">Time Zone</Label>
                                                    <select onChange={(e) => {
                                                        setTimezone(e.target.value)
                                                    }} className="form-select">
                                                        <option>{decode.timezone ? `Current: ${timezone}` : "Select"}</option>
                                                        <option>CA/Newfoundland</option>
                                                        <option>CA/Atlantic</option>
                                                        <option>CA/Central</option>
                                                        <option>CA/Eastern</option>
                                                        <option>CA/Mountain</option>
                                                        <option>CA/Pacific</option>
                                                    </select>
                                                </div>
                                            </div>
                                            <div class="col-lg-6">
                                                <div className="mb-3">
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
                                                                                            f.preview ? f.preview : f
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
                                                                                        onClick={(e) => { removeDocuments(i) }}
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
                                            <div class="col-lg-12">
                                                <div className="mt-4">
                                                    <button type="submit" onClick={async (e) => {
                                                        await updateProfileInformation(e, decode.role)
                                                    }} className="btn btn-primary mr-10 w-md"> {profileLoading ? <><span class="spinner-border spinner-border-sm" style={{ marginRight: "3px" }} role="status" aria-hidden="true"></span>
                                                        Loading...</> : <div>Update Profile </div>}
                                                    </button>
                                                    <span id="updateMessageSpan" style={{
                                                        color: "red",
                                                        fontWeight: "bolder",
                                                        marginLeft: "10px",
                                                        display: "none"
                                                    }}></span>
                                                </div>
                                            </div>
                                        </div>
                                    </CardBody>
                                </Card>
                            </Col>
                        </Row>
                        <Row>
                            <Col xl={12}>
                                <Card>
                                    <CardHeader>
                                        <h4 className="card-title">Change Password</h4>
                                        <p className="card-title-desc">At least 8 characters, upper and lower case
                                            letters</p>
                                    </CardHeader>
                                    <CardBody>
                                        <div className="row align-items-center">
                                            <div class="col-lg-6">
                                                <div className="mb-3">
                                                    <Label className="form-label" htmlFor="formrow-password-input">Old
                                                        Password</Label>
                                                    <Input id="oldPwdInput" onChange={(e) => {
                                                        setOldPassword(e.target.value)
                                                    }} type="text" className="form-control" />
                                                </div>
                                            </div>
                                            <div class="col-lg-6">
                                                <div className="mb-3 d-flex">
                                                    <div className="w-100">
                                                        <Label className=""
                                                            htmlFor="formrow-password-input">Password</Label>
                                                        <div className="passwordToggle w-100">
                                                            <Input className="w-100 form-control" id="newPwdInput" onChange={(e) => {
                                                                setPassword(e.target.value)
                                                            }} type={showPassword ? 'text' : 'password'} />
                                                            <div className="passwordToggleEye">
                                                                {showPassword ?
                                                                    <button class="btn btn-light shadow-none ms-0" type="button" onClick={() => setShowPassword(!showPassword)}>
                                                                        <i class="bx bx-show"></i>
                                                                    </button>
                                                                    :
                                                                    <button class="btn btn-light shadow-none ms-0" type="button" onClick={() => setShowPassword(!showPassword)}>
                                                                        <i class="bx bxs-low-vision"></i>
                                                                    </button>
                                                                }
                                                            </div>
                                                        </div>
                                                    </div>
                                                </div>
                                            </div>
                                            <div class="col-lg-6">
                                                <div className="mb-3 d-flex">
                                                    <div className="w-100">
                                                        <Label className="form-label" htmlFor="formrow-password-input">Confirm Password
                                                        </Label>
                                                        <div className="passwordToggle w-100">
                                                            <Input id="confirmPwdInput" onChange={(e) => {
                                                                setConfirmPassword(e.target.value)
                                                            }} type={showConfirmPassword ? 'text' : 'password'} className="form-control" i />
                                                            <div className="passwordToggleEye">
                                                                {showConfirmPassword ?
                                                                    <button class="btn btn-light shadow-none ms-0" type="button" onClick={() => setShowConfirmPassword(!showConfirmPassword)}>
                                                                        <i class="bx bx-show"></i>
                                                                    </button>
                                                                    :
                                                                    <button class="btn btn-light shadow-none ms-0" type="button" onClick={() => setShowConfirmPassword(!showConfirmPassword)}>
                                                                        <i class="bx bxs-low-vision"></i>
                                                                    </button>
                                                                }
                                                            </div>
                                                        </div>
                                                    </div>
                                                </div>
                                            </div>
                                            <div class="col-lg-12">
                                                <div className="mt-4">
                                                    <button type="submit" onClick={changePassword}
                                                        className="btn btn-primary mr-10 w-md">{passwordLoading ? <><span class="spinner-border spinner-border-sm" style={{ marginRight: "3px" }} role="status" aria-hidden="true"></span>
                                                            Loading...</> : <div>Change password </div>}
                                                    </button>
                                                    <span id="messageSpan" style={{
                                                        color: "red",
                                                        fontWeight: "bolder",
                                                        marginLeft: "10px",
                                                        display: "none"
                                                    }}></span>
                                                </div>
                                            </div>
                                        </div>
                                    </CardBody>
                                </Card>
                            </Col>
                        </Row>
                        {/* <Row>
                            <Col xl={12}>
                                <Card>
                                    <CardHeader>
                                        <h4 className="card-title">2fa</h4>

                                    </CardHeader>
                                    <CardBody>
                                        <div class="col-lg-6">
                                            <div className="mb-3">
                                                <div className="form-check form-switch form-switch-md mb-3" dir="ltr">
                                                    <label className="form-check-label" htmlFor="customSwitchsizemd">Two-factor authentication</label>
                                                    <input type="checkbox"
                                                        className="form-check-input"
                                                        id="customSwitchsizemd"
                                                        onChange={(e) => setchecked(e.target.checked)}
                                                    />
                                                </div>
                                            </div>
                                        </div>
                                    </CardBody>
                                </Card>
                            </Col>
                        </Row> */}
                    </div>
                </div>
            </React.Fragment>
        )
    }

    if (decode.role === "company") {
        return (
            <React.Fragment>
                <div className="page-content">
                    <MetaTags>
                        <title>Profile Settings</title>
                    </MetaTags>
                    <div className="container-fluid">
                        <Breadcrumbs title="Home" breadcrumbItem="Profile Settings" />
                        <Row>
                            <Col xl={12}>
                                <Card>
                                    <CardHeader>
                                        <h4 className="card-title">Your Profile Details</h4>
                                    </CardHeader>
                                    <CardBody>
                                        <div className="row align-items-center">
                                            <div class="col-lg-6">
                                                <div className="mb-3">
                                                    <Label className="form-label" htmlFor="formrow-username-input">User
                                                        Name</Label>
                                                    <Input onChange={(e) => {
                                                        setUsername(e.target.value)
                                                    }} type="text" className="form-control" id="formrow-username-input"
                                                        value={username} />
                                                </div>
                                            </div>
                                            <div class="col-lg-6">
                                                <div className="mb-3">
                                                    <Label className="form-label" htmlFor="formrow-firstname-input">Company
                                                        Name</Label>
                                                    <Input onChange={(e) => {
                                                        setCompanyName(e.target.value)
                                                    }} type="text" className="form-control" id="formrow-firstname-input"
                                                        value={companyName} />
                                                </div>
                                            </div>
                                            <div className="col-lg-6">
                                                <div className="mb-3">
                                                    <Label className="form-label" htmlFor="formrow-firstname-input">Owner
                                                        First
                                                        Name</Label>
                                                    <Input onChange={(e) => {
                                                        setFirstName(e.target.value)
                                                    }} type="text" className="form-control" id="formrow-firstname-input"
                                                        value={firstname} />
                                                </div>
                                            </div>
                                            <div className="col-lg-6">
                                                <div className="mb-3">
                                                    <Label className="form-label" htmlFor="formrow-firstname-input">Owner
                                                        Last
                                                        Name</Label>
                                                    <Input onChange={(e) => {
                                                        setLastName(e.target.value)
                                                    }} type="text" className="form-control"
                                                        id="formrow-secondname-input" value={lastname} />
                                                </div>
                                            </div>
                                            <div class="col-lg-6">
                                                <div className="mb-3">
                                                    <Label className="form-label" htmlFor="formrow-email-input">Email
                                                        Address</Label>
                                                    <Input type="text" className="form-control" id="formrow-email-input"
                                                        value={decode.email} disabled={true} />
                                                </div>
                                            </div>
                                            <div class="col-lg-6">
                                                <div className="mb-3">
                                                    <Label className="form-Label">Time Zone</Label>
                                                    <select onChange={(e) => {
                                                        setTimezone(e.target.value)
                                                    }} className="form-select">
                                                        <option>{decode.timezone ? `Current: ${timezone}` : "Select"}</option>
                                                        <option>CA/Newfoundland</option>
                                                        <option>CA/Atlantic</option>
                                                        <option>CA/Central</option>
                                                        <option>CA/Eastern</option>
                                                        <option>CA/Mountain</option>
                                                        <option>CA/Pacific</option>
                                                    </select>
                                                </div>
                                            </div>
                                            <div class="col-lg-12">
                                                <div className="mb-3">
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
                                                                                            f.preview ? f.preview : f
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
                                                                                        className="btn btn-soft-danger waves-effect waves-light" onClick={(e) => { removeDocuments(i) }}
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
                                            <div class="col-lg-12">
                                                <div className="mt-4">
                                                    <button type="submit" onClick={async (e) => {
                                                        await updateProfileInformation(e, decode.role)
                                                    }} className="btn btn-primary mr-10 w-md">{profileLoading ? <><span class="spinner-border spinner-border-sm" style={{ marginRight: "3px" }} role="status" aria-hidden="true"></span>
                                                        Loading...</> : <div>Update Profile </div>}
                                                    </button>
                                                    <span id="updateMessageSpan" style={{
                                                        color: "red",
                                                        fontWeight: "bolder",
                                                        marginLeft: "10px",
                                                        display: "none"
                                                    }}></span>
                                                </div>
                                            </div>
                                        </div>
                                    </CardBody>
                                </Card>
                            </Col>
                        </Row>
                        <Row>
                            <Col xl={12}>
                                <Card>
                                    <CardHeader>
                                        <h4 className="card-title">Change Password</h4>
                                        <p className="card-title-desc">AAt least 8 characters, upper and lower case
                                            letters</p>
                                    </CardHeader>
                                    <CardBody>
                                        <div className="row align-items-center">
                                            <div class="col-lg-6">
                                                <div className="mb-3">
                                                    <Label className="form-label" htmlFor="formrow-password-input">Old
                                                        Password</Label>
                                                    <Input id="oldPwdInput" onChange={(e) => {
                                                        setOldPassword(e.target.value)
                                                    }} type="text" className="form-control" />
                                                </div>
                                            </div>
                                            <div class="col-lg-6">
                                                <div className="mb-3 d-flex">
                                                    <div className="w-100">
                                                        <Label className=""
                                                            htmlFor="formrow-password-input">Password</Label>
                                                        <div className="passwordToggle w-100">
                                                            <Input className="w-100 form-control" id="newPwdInput" onChange={(e) => {
                                                                setPassword(e.target.value)
                                                            }} type={showPassword ? 'text' : 'password'} />
                                                            <div className="passwordToggleEye">
                                                                {showPassword ?
                                                                    <button class="btn btn-light shadow-none ms-0" type="button" onClick={() => setShowPassword(!showPassword)}>
                                                                        <i class="bx bx-show"></i>
                                                                    </button>
                                                                    :
                                                                    <button class="btn btn-light shadow-none ms-0" type="button" onClick={() => setShowPassword(!showPassword)}>
                                                                        <i class="bx bxs-low-vision"></i>
                                                                    </button>
                                                                }
                                                            </div>
                                                        </div>
                                                    </div>

                                                </div>
                                            </div>
                                            <div class="col-lg-6">
                                                <div className="mb-3 d-flex">
                                                    <div className="w-100">
                                                        <Label className="form-label" htmlFor="formrow-password-input">Confirm Password
                                                        </Label>
                                                        <div className="passwordToggle w-100">
                                                            <Input id="confirmPwdInput" onChange={(e) => {
                                                                setConfirmPassword(e.target.value)
                                                            }} type={showConfirmPassword ? 'text' : 'password'} className="form-control" i />
                                                            <div className="passwordToggleEye">
                                                                {showConfirmPassword ?
                                                                    <button class="btn btn-light shadow-none ms-0" type="button" onClick={() => setShowConfirmPassword(!showConfirmPassword)}>
                                                                        <i class="bx bx-show"></i>
                                                                    </button>
                                                                    :
                                                                    <button class="btn btn-light shadow-none ms-0" type="button" onClick={() => setShowConfirmPassword(!showConfirmPassword)}>
                                                                        <i class="bx bxs-low-vision"></i>
                                                                    </button>
                                                                }
                                                            </div>
                                                        </div>
                                                    </div>
                                                </div>
                                            </div>
                                            <div class="col-lg-12">
                                                <div className="mt-4">
                                                    <button type="submit" onClick={changePassword}
                                                        className="btn btn-primary mr-10 w-md">{passwordLoading ? <><span class="spinner-border spinner-border-sm" style={{ marginRight: "3px" }} role="status" aria-hidden="true"></span>
                                                            Loading...</> : <div>Change password </div>}
                                                    </button>
                                                    <span id="messageSpan" style={{
                                                        color: "red",
                                                        fontWeight: "bolder",
                                                        marginLeft: "10px",
                                                        display: "none"
                                                    }}></span>
                                                </div>
                                            </div>
                                        </div>
                                    </CardBody>
                                </Card>
                            </Col>
                        </Row>
                    </div>
                </div>
            </React.Fragment>
        )
    }

    if (decode.role === "manager") {
        return (
            <React.Fragment>
                <div className="page-content">
                    <MetaTags>
                        <title>Profile Settings</title>
                    </MetaTags>
                    <div className="container-fluid">
                        <Breadcrumbs title="Home" breadcrumbItem="Profile Settings" />
                        <Row>
                            <Col xl={12}>
                                <Card>
                                    <CardHeader>
                                        <h4 className="card-title">Your Profile Details</h4>
                                    </CardHeader>
                                    <CardBody>
                                        <div className="row align-items-center">
                                            <div class="col-lg-6">
                                                <div className="mb-3">
                                                    <Label className="form-label" htmlFor="formrow-username-input">User
                                                        Name</Label>
                                                    <Input onChange={(e) => {
                                                        setUsername(e.target.value)
                                                    }} type="text" className="form-control" id="formrow-username-input"
                                                        value={username} />
                                                </div>
                                            </div>
                                            <div class="col-lg-6">
                                                <div className="mb-3">
                                                    <Label className="form-label" htmlFor="formrow-firstname-input">Associated
                                                        Company</Label>
                                                    <Input onChange={(e) => {

                                                    }} type="text" className="form-control"
                                                        id="formrow-secondname-input" value={decode.managerOf}
                                                        disabled={true} />
                                                </div>
                                            </div>
                                            <div className="col-lg-6">
                                                <div className="mb-3">
                                                    <Label className="form-label" htmlFor="formrow-firstname-input">First
                                                        Name</Label>
                                                    <Input onChange={(e) => {
                                                        setFirstName(e.target.value)
                                                    }} type="text" className="form-control" id="formrow-firstname-input"
                                                        value={firstname} />
                                                </div>
                                            </div>
                                            <div className="col-lg-6">
                                                <div className="mb-3">
                                                    <Label className="form-label" htmlFor="formrow-firstname-input">Last
                                                        Name</Label>
                                                    <Input onChange={(e) => {
                                                        setLastName(e.target.value)
                                                    }} type="text" className="form-control"
                                                        id="formrow-secondname-input" value={lastname} />
                                                </div>
                                            </div>

                                            <div class="col-lg-6">
                                                <div className="mb-3">
                                                    <Label className="form-label" htmlFor="formrow-email-input">Email
                                                        Address</Label>
                                                    <Input type="text" className="form-control" id="formrow-email-input"
                                                        value={decode.email} disabled={true} />
                                                </div>
                                            </div>
                                            <div class="col-lg-6">
                                                <div className="mb-3">
                                                    <Label className="form-Label">Time Zone</Label>
                                                    <select onChange={(e) => {

                                                        setTimezone(e.target.value)
                                                    }} className="form-select">
                                                        <option>{decode.timezone ? `Current: ${timezone}` : "Select"}</option>
                                                        <option>CA/Newfoundland</option>
                                                        <option>CA/Atlantic</option>
                                                        <option>CA/Central</option>
                                                        <option>CA/Eastern</option>
                                                        <option>CA/Mountain</option>
                                                        <option>CA/Pacific</option>
                                                    </select>
                                                </div>
                                            </div>
                                            <div class="col-lg-12">
                                                <div className="mb-3">
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
                                                                                            f.preview ? f.preview : f
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
                                                                                        className="btn btn-soft-danger waves-effect waves-light" onClick={(e) => { removeDocuments(i) }}
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
                                            <div class="col-lg-12">
                                                <div className="mt-4">
                                                    <button type="submit" onClick={async (e) => {
                                                        await updateProfileInformation(e, decode.role)
                                                    }} className="btn btn-primary mr-10 w-md">{profileLoading ? <><span class="spinner-border spinner-border-sm" style={{ marginRight: "3px" }} role="status" aria-hidden="true"></span>
                                                        Loading...</> : <div>Update Profile </div>}
                                                    </button>
                                                    <span id="updateMessageSpan" style={{
                                                        color: "red",
                                                        fontWeight: "bolder",
                                                        marginLeft: "10px",
                                                        display: "none"
                                                    }}></span>
                                                </div>
                                            </div>
                                        </div>
                                    </CardBody>
                                </Card>
                            </Col>
                        </Row>
                        <Row>
                            <Col xl={12}>
                                <Card>
                                    <CardHeader>
                                        <h4 className="card-title">Change Password</h4>
                                        <p className="card-title-desc">At least 8 characters, upper and lower case
                                            letters</p>
                                    </CardHeader>
                                    <CardBody>
                                        <div className="row align-items-center">
                                            <div class="col-lg-6">
                                                <div className="mb-3">
                                                    <Label className="form-label" htmlFor="formrow-password-input">Old
                                                        Password</Label>
                                                    <Input id="oldPwdInput" onChange={(e) => {
                                                        setOldPassword(e.target.value)
                                                    }} type="text" className="form-control" />
                                                </div>
                                            </div>
                                            <div class="col-lg-6">
                                                <div className="mb-3 d-flex">
                                                    <div className="w-100">
                                                        <Label className=""
                                                            htmlFor="formrow-password-input">Password</Label>
                                                        <div className="passwordToggle w-100">
                                                            <Input className="w-100 form-control" id="newPwdInput" onChange={(e) => {
                                                                setPassword(e.target.value)
                                                            }} type={showPassword ? 'text' : 'password'} />
                                                            <div className="passwordToggleEye">
                                                                {showPassword ?
                                                                    <button class="btn btn-light shadow-none ms-0" type="button" onClick={() => setShowPassword(!showPassword)}>
                                                                        <i class="bx bx-show"></i>
                                                                    </button>
                                                                    :
                                                                    <button class="btn btn-light shadow-none ms-0" type="button" onClick={() => setShowPassword(!showPassword)}>
                                                                        <i class="bx bxs-low-vision"></i>
                                                                    </button>
                                                                }
                                                            </div>
                                                        </div>
                                                    </div>

                                                </div>
                                            </div>
                                            <div class="col-lg-6">
                                                <div className="mb-3 d-flex">
                                                    <div className="w-100">
                                                        <Label className="form-label" htmlFor="formrow-password-input">Confirm Password
                                                        </Label>
                                                        <div className="passwordToggle w-100">
                                                            <Input id="confirmPwdInput" onChange={(e) => {
                                                                setConfirmPassword(e.target.value)
                                                            }} type={showConfirmPassword ? 'text' : 'password'} className="form-control" i />
                                                            <div className="passwordToggleEye">
                                                                {showConfirmPassword ?
                                                                    <button class="btn btn-light shadow-none ms-0" type="button" onClick={() => setShowConfirmPassword(!showConfirmPassword)}>
                                                                        <i class="bx bx-show"></i>
                                                                    </button>
                                                                    :
                                                                    <button class="btn btn-light shadow-none ms-0" type="button" onClick={() => setShowConfirmPassword(!showConfirmPassword)}>
                                                                        <i class="bx bxs-low-vision"></i>
                                                                    </button>
                                                                }
                                                            </div>
                                                        </div>
                                                    </div>
                                                </div>
                                            </div>
                                            <div class="col-lg-12">
                                                <div className="mt-4">
                                                    <button type="submit" onClick={changePassword}
                                                        className="btn btn-primary mr-10 w-md">{passwordLoading ? <><span class="spinner-border spinner-border-sm" style={{ marginRight: "3px" }} role="status" aria-hidden="true"></span>
                                                            Loading...</> : <div>Change password </div>}
                                                    </button>
                                                    <span id="messageSpan" style={{
                                                        color: "red",
                                                        fontWeight: "bolder",
                                                        marginLeft: "10px",
                                                        display: "none"
                                                    }}></span>
                                                </div>
                                            </div>
                                        </div>
                                    </CardBody>
                                </Card>
                            </Col>
                        </Row>
                    </div>
                </div>
            </React.Fragment>
        )
    }

    if (decode.role === "customer") {
        return (
            <React.Fragment>
                <div className="page-content">
                    <MetaTags>
                        <title>Profile Settings</title>
                    </MetaTags>
                    <div className="container-fluid">
                        <Breadcrumbs title="Home" breadcrumbItem="Profile Settings" />
                        <Row>
                            <Col xl={12}>
                                <Card>
                                    <CardHeader>
                                        <h4 className="card-title">Your Profile Details</h4>
                                    </CardHeader>
                                    <CardBody>
                                        <div className="row align-items-center">
                                            <div class="col-lg-6">
                                                <div className="mb-3">
                                                    <Label className="form-label" htmlFor="formrow-username-input">User
                                                        Name</Label>
                                                    <Input onChange={(e) => {
                                                        setUsername(e.target.value)
                                                    }} type="text" className="form-control" id="formrow-username-input"
                                                        value={username} />
                                                </div>
                                            </div>

                                            <div class="col-lg-6">
                                                <div className="mb-3">
                                                    <Label className="form-label" htmlFor="formrow-email-input">Email
                                                        Address</Label>
                                                    <Input type="text" className="form-control" id="formrow-email-input"
                                                        value={decode.email} disabled={true} />
                                                </div>
                                            </div>

                                            <div className="col-lg-6">
                                                <div className="mb-3">
                                                    <Label className="form-label" htmlFor="formrow-firstname-input">First
                                                        Name</Label>
                                                    <Input onChange={(e) => {
                                                        setFirstName(e.target.value)
                                                    }} type="text" className="form-control" id="formrow-firstname-input"
                                                        value={firstname} />
                                                </div>
                                            </div>
                                            <div className="col-lg-6">
                                                <div className="mb-3">
                                                    <Label className="form-label" htmlFor="formrow-firstname-input">Last
                                                        Name</Label>
                                                    <Input onChange={(e) => {
                                                        setLastName(e.target.value)
                                                    }} type="text" className="form-control"
                                                        id="formrow-secondname-input" value={lastname} />
                                                </div>
                                            </div>


                                            {/* <div class="col-lg-6">
                                                <div className="mb-3">
                                                    <Label className="form-Label">Time Zone</Label>
                                                    <select onChange={(e) => {

                                                        setTimezone(e.target.value)
                                                    }} className="form-select">
                                                        <option>{decode.timezone ? `Current: ${timezone}` : "Select"}</option>
                                                        <option>CA/Newfoundland</option>
                                                        <option>CA/Atlantic</option>
                                                        <option>CA/Central</option>
                                                        <option>CA/Eastern</option>
                                                        <option>CA/Mountain</option>
                                                        <option>CA/Pacific</option>
                                                    </select>
                                                </div>
                                            </div> */}
                                            <div class="col-lg-12">
                                                <div className="mb-3">
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
                                                                                            f.preview ? f.preview : f
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
                                                                                        className="btn btn-soft-danger waves-effect waves-light" onClick={(e) => { removeDocuments(i) }}
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
                                            <div class="col-lg-12">
                                                <div className="mt-4">
                                                    <button type="submit" onClick={async (e) => {
                                                        await updateProfileInformation(e, decode.role)
                                                    }} className="btn btn-primary mr-10 w-md">{profileLoading ? <><span class="spinner-border spinner-border-sm" style={{ marginRight: "3px" }} role="status" aria-hidden="true"></span>
                                                        Loading...</> : <div>Update Profile </div>}
                                                    </button>
                                                    <span id="updateMessageSpan" style={{
                                                        color: "red",
                                                        fontWeight: "bolder",
                                                        marginLeft: "10px",
                                                        display: "none"
                                                    }}></span>
                                                </div>
                                            </div>
                                        </div>
                                    </CardBody>
                                </Card>
                            </Col>
                        </Row>
                        <Row>
                            <Col xl={12}>
                                <Card>
                                    <CardHeader>
                                        <h4 className="card-title">Change Password</h4>
                                        <p className="card-title-desc">At least 8 characters, upper and lower case
                                            letters</p>
                                    </CardHeader>
                                    <CardBody>
                                        <div className="row align-items-center">
                                            <div class="col-lg-6">
                                                <div className="mb-3">
                                                    <Label className="form-label" htmlFor="formrow-password-input">Old
                                                        Password</Label>
                                                    <Input id="oldPwdInput" onChange={(e) => {
                                                        setOldPassword(e.target.value)
                                                    }} type="text" className="form-control" />
                                                </div>
                                            </div>
                                            <div class="col-lg-6">
                                                <div className="mb-3 d-flex">
                                                    <div className="w-100">
                                                        <Label className=""
                                                            htmlFor="formrow-password-input">Password</Label>
                                                        <div className="passwordToggle w-100">
                                                            <Input className="w-100 form-control" id="newPwdInput" onChange={(e) => {
                                                                setPassword(e.target.value)
                                                            }} type={showPassword ? 'text' : 'password'} />
                                                            <div className="passwordToggleEye">
                                                                {showPassword ?
                                                                    <button class="btn btn-light shadow-none ms-0" type="button" onClick={() => setShowPassword(!showPassword)}>
                                                                        <i class="bx bx-show"></i>
                                                                    </button>
                                                                    :
                                                                    <button class="btn btn-light shadow-none ms-0" type="button" onClick={() => setShowPassword(!showPassword)}>
                                                                        <i class="bx bxs-low-vision"></i>
                                                                    </button>
                                                                }
                                                            </div>
                                                        </div>
                                                    </div>

                                                </div>
                                            </div>
                                            <div class="col-lg-6">
                                                <div className="mb-3 d-flex">
                                                    <div className="w-100">
                                                        <Label className="form-label" htmlFor="formrow-password-input">Confirm Password
                                                        </Label>
                                                        <div className="passwordToggle w-100">
                                                            <Input id="confirmPwdInput" onChange={(e) => {
                                                                setConfirmPassword(e.target.value)
                                                            }} type={showConfirmPassword ? 'text' : 'password'} className="form-control" i />
                                                            <div className="passwordToggleEye">
                                                                {showConfirmPassword ?
                                                                    <button class="btn btn-light shadow-none ms-0" type="button" onClick={() => setShowConfirmPassword(!showConfirmPassword)}>
                                                                        <i class="bx bx-show"></i>
                                                                    </button>
                                                                    :
                                                                    <button class="btn btn-light shadow-none ms-0" type="button" onClick={() => setShowConfirmPassword(!showConfirmPassword)}>
                                                                        <i class="bx bxs-low-vision"></i>
                                                                    </button>
                                                                }
                                                            </div>
                                                        </div>
                                                    </div>
                                                </div>
                                            </div>
                                            <div class="col-lg-12">
                                                <div className="mt-4">
                                                    <button type="submit" onClick={changePassword}
                                                        className="btn btn-primary mr-10 w-md">{passwordLoading ? <><span class="spinner-border spinner-border-sm" style={{ marginRight: "3px" }} role="status" aria-hidden="true"></span>
                                                            Loading...</> : <div>Change password </div>}
                                                    </button>
                                                    <span id="messageSpan" style={{
                                                        color: "red",
                                                        fontWeight: "bolder",
                                                        marginLeft: "10px",
                                                        display: "none"
                                                    }}></span>
                                                </div>
                                            </div>
                                        </div>
                                    </CardBody>
                                </Card>
                            </Col>
                        </Row>
                    </div>
                </div>
            </React.Fragment>
        )
    }

    if (decode.role === "technical staff") {
        return (
            <React.Fragment>
                <div className="page-content">
                    <MetaTags>
                        <title>Profile Settings</title>
                    </MetaTags>
                    <div className="container-fluid">
                        <Breadcrumbs title="Home" breadcrumbItem="Profile Settings" />
                        <Row>
                            <Col xl={12}>
                                <Card>
                                    <CardHeader>
                                        <h4 className="card-title">Your Profile Details</h4>
                                    </CardHeader>
                                    <CardBody>
                                        <div className="row align-items-center">
                                            <div class="col-lg-6">
                                                <div className="mb-3">
                                                    <Label className="form-label" htmlFor="formrow-username-input">User
                                                        Name</Label>
                                                    <Input onChange={(e) => {
                                                        setUsername(e.target.value)
                                                    }} type="text" className="form-control" id="formrow-username-input"
                                                        value={username} />
                                                </div>
                                            </div>

                                            <div class="col-lg-6">
                                                <div className="mb-3">
                                                    <Label className="form-label" htmlFor="formrow-email-input">Email
                                                        Address</Label>
                                                    <Input type="text" className="form-control" id="formrow-email-input"
                                                        value={decode.email} disabled={true} />
                                                </div>
                                            </div>

                                            <div className="col-lg-6">
                                                <div className="mb-3">
                                                    <Label className="form-label" htmlFor="formrow-firstname-input">First
                                                        Name</Label>
                                                    <Input onChange={(e) => {
                                                        setFirstName(e.target.value)
                                                    }} type="text" className="form-control" id="formrow-firstname-input"
                                                        value={firstname} />
                                                </div>
                                            </div>
                                            <div className="col-lg-6">
                                                <div className="mb-3">
                                                    <Label className="form-label" htmlFor="formrow-firstname-input">Last
                                                        Name</Label>
                                                    <Input onChange={(e) => {
                                                        setLastName(e.target.value)
                                                    }} type="text" className="form-control"
                                                        id="formrow-secondname-input" value={lastname} />
                                                </div>
                                            </div>


                                            {/* <div class="col-lg-6">
                                                <div className="mb-3">
                                                    <Label className="form-Label">Time Zone</Label>
                                                    <select onChange={(e) => {

                                                        setTimezone(e.target.value)
                                                    }} className="form-select">
                                                        <option>{decode.timezone ? `Current: ${timezone}` : "Select"}</option>
                                                        <option>CA/Newfoundland</option>
                                                        <option>CA/Atlantic</option>
                                                        <option>CA/Central</option>
                                                        <option>CA/Eastern</option>
                                                        <option>CA/Mountain</option>
                                                        <option>CA/Pacific</option>
                                                    </select>
                                                </div>
                                            </div> */}
                                            <div class="col-lg-12">
                                                <div className="mb-3">
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
                                                                                            f.preview ? f.preview : f
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
                                                                                        className="btn btn-soft-danger waves-effect waves-light" onClick={(e) => { removeDocuments(i) }}
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
                                            <div class="col-lg-12">
                                                <div className="mt-4">
                                                    <button type="submit" onClick={async (e) => {
                                                        await updateProfileInformation(e, decode.role)
                                                    }} className="btn btn-primary mr-10 w-md">{profileLoading ? <><span class="spinner-border spinner-border-sm" style={{ marginRight: "3px" }} role="status" aria-hidden="true"></span>
                                                        Loading...</> : <div>Update Profile </div>}
                                                    </button>
                                                    <span id="updateMessageSpan" style={{
                                                        color: "red",
                                                        fontWeight: "bolder",
                                                        marginLeft: "10px",
                                                        display: "none"
                                                    }}></span>
                                                </div>
                                            </div>
                                        </div>
                                    </CardBody>
                                </Card>
                            </Col>
                        </Row>
                        <Row>
                            <Col xl={12}>
                                <Card>
                                    <CardHeader>
                                        <h4 className="card-title">Change Password</h4>
                                        <p className="card-title-desc">At least 8 characters, upper and lower case
                                            letters</p>
                                    </CardHeader>
                                    <CardBody>
                                        <div className="row align-items-center">
                                            <div class="col-lg-6">
                                                <div className="mb-3">
                                                    <Label className="form-label" htmlFor="formrow-password-input">Old
                                                        Password</Label>
                                                    <Input id="oldPwdInput" onChange={(e) => {
                                                        setOldPassword(e.target.value)
                                                    }} type="text" className="form-control" />
                                                </div>
                                            </div>
                                            <div class="col-lg-6">
                                                <div className="mb-3 d-flex">
                                                    <div className="w-100">
                                                        <Label className=""
                                                            htmlFor="formrow-password-input">Password</Label>
                                                        <div className="passwordToggle w-100">
                                                            <Input className="w-100 form-control" id="newPwdInput" onChange={(e) => {
                                                                setPassword(e.target.value)
                                                            }} type={showPassword ? 'text' : 'password'}  />
                                                            <div className="passwordToggleEye">
                                                                {showPassword ?
                                                                    <button class="btn btn-light shadow-none ms-0" type="button" onClick={() => setShowPassword(!showPassword)}>
                                                                        <i class="bx bx-show"></i>
                                                                    </button>
                                                                    :
                                                                    <button class="btn btn-light shadow-none ms-0" type="button" onClick={() => setShowPassword(!showPassword)}>
                                                                        <i class="bx bxs-low-vision"></i>
                                                                    </button>
                                                                }
                                                            </div>
                                                        </div>
                                                    </div>

                                                </div>
                                            </div>
                                            <div class="col-lg-6">
                                                <div className="mb-3 d-flex">
                                                    <div className="w-100">
                                                    <Label className="form-label" htmlFor="formrow-password-input">Confirm Password
                                                        </Label>
                                                        <div className="passwordToggle w-100">
                                                    <Input id="confirmPwdInput" onChange={(e) => {
                                                        setConfirmPassword(e.target.value)
                                                            }} type={showConfirmPassword ? 'text' : 'password'} className="form-control" i />
                                                            <div className="passwordToggleEye">
                                                                {showConfirmPassword ?
                                                                    <button class="btn btn-light shadow-none ms-0" type="button" onClick={() => setShowConfirmPassword(!showConfirmPassword)}>
                                                                        <i class="bx bx-show"></i>
                                                                    </button>
                                                                    :
                                                                    <button class="btn btn-light shadow-none ms-0" type="button" onClick={() => setShowConfirmPassword(!showConfirmPassword)}>
                                                                        <i class="bx bxs-low-vision"></i>
                                                                    </button>
                                                                }
                                                            </div>
                                                        </div>
                                                    </div>
                                                </div>
                                            </div>
                                            <div class="col-lg-12">
                                                <div className="mt-4">
                                                    <button type="submit" onClick={changePassword}
                                                        className="btn btn-primary mr-10 w-md">{passwordLoading ? <><span class="spinner-border spinner-border-sm" style={{ marginRight: "3px" }} role="status" aria-hidden="true"></span>
                                                            Loading...</> : <div>Change password </div>}
                                                    </button>
                                                    <span id="messageSpan" style={{
                                                        color: "red",
                                                        fontWeight: "bolder",
                                                        marginLeft: "10px",
                                                        display: "none"
                                                    }}></span>
                                                </div>
                                            </div>
                                        </div>
                                    </CardBody>
                                </Card>
                            </Col>
                        </Row>
                    </div>
                </div>
            </React.Fragment>
        )
    }

    if (decode.role === "vendor") {
        return (
            <React.Fragment>
                <div className="page-content">
                    <MetaTags>
                        <title>Profile Settings</title>
                    </MetaTags>
                    <div className="container-fluid">
                        <Breadcrumbs title="Home" breadcrumbItem="Profile Settings" />
                        <Row>
                            <Col xl={12}>
                                <Card>
                                    <CardHeader>
                                        <h4 className="card-title">Your Profile Details</h4>
                                    </CardHeader>
                                    <CardBody>
                                        <div className="row align-items-center">
                                            <div class="col-lg-6">
                                                <div className="mb-3">
                                                    <Label className="form-label" htmlFor="formrow-username-input">User
                                                        Name</Label>
                                                    <Input onChange={(e) => {
                                                        setUsername(e.target.value)
                                                    }} type="text" className="form-control" id="formrow-username-input"
                                                        value={username} />
                                                </div>
                                            </div>

                                            <div class="col-lg-6">
                                                <div className="mb-3">
                                                    <Label className="form-label" htmlFor="formrow-email-input">Email
                                                        Address</Label>
                                                    <Input type="text" className="form-control" id="formrow-email-input"
                                                        value={decode.email} disabled={true} />
                                                </div>
                                            </div>

                                            <div className="col-lg-6">
                                                <div className="mb-3">
                                                    <Label className="form-label" htmlFor="formrow-firstname-input">First
                                                        Name</Label>
                                                    <Input onChange={(e) => {
                                                        setFirstName(e.target.value)
                                                    }} type="text" className="form-control" id="formrow-firstname-input"
                                                        value={firstname} />
                                                </div>
                                            </div>
                                            <div className="col-lg-6">
                                                <div className="mb-3">
                                                    <Label className="form-label" htmlFor="formrow-firstname-input">Last
                                                        Name</Label>
                                                    <Input onChange={(e) => {
                                                        setLastName(e.target.value)
                                                    }} type="text" className="form-control"
                                                        id="formrow-secondname-input" value={lastname} />
                                                </div>
                                            </div>


                                            {/* <div class="col-lg-6">
                                                <div className="mb-3">
                                                    <Label className="form-Label">Time Zone</Label>
                                                    <select onChange={(e) => {

                                                        setTimezone(e.target.value)
                                                    }} className="form-select">
                                                        <option>{decode.timezone ? `Current: ${timezone}` : "Select"}</option>
                                                        <option>CA/Newfoundland</option>
                                                        <option>CA/Atlantic</option>
                                                        <option>CA/Central</option>
                                                        <option>CA/Eastern</option>
                                                        <option>CA/Mountain</option>
                                                        <option>CA/Pacific</option>
                                                    </select>
                                                </div>
                                            </div> */}
                                            <div class="col-lg-12">
                                                <div className="mb-3">
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
                                                                                            f.preview ? f.preview : f
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
                                                                                        className="btn btn-soft-danger waves-effect waves-light" onClick={(e) => { removeDocuments(i) }}
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
                                            <div class="col-lg-12">
                                                <div className="mt-4">
                                                    <button type="submit" onClick={async (e) => {
                                                        await updateProfileInformation(e, decode.role)
                                                    }} className="btn btn-primary mr-10 w-md">{profileLoading ? <><span class="spinner-border spinner-border-sm" style={{ marginRight: "3px" }} role="status" aria-hidden="true"></span>
                                                        Loading...</> : <div>Update Profile </div>}
                                                    </button>
                                                    <span id="updateMessageSpan" style={{
                                                        color: "red",
                                                        fontWeight: "bolder",
                                                        marginLeft: "10px",
                                                        display: "none"
                                                    }}></span>
                                                </div>
                                            </div>
                                        </div>
                                    </CardBody>
                                </Card>
                            </Col>
                        </Row>
                        <Row>
                            <Col xl={12}>
                                <Card>
                                    <CardHeader>
                                        <h4 className="card-title">Change Password</h4>
                                        <p className="card-title-desc">At least 8 characters, upper and lower case
                                            letters</p>
                                    </CardHeader>
                                    <CardBody>
                                        <div className="row align-items-center">
                                            <div class="col-lg-6">
                                                <div className="mb-3">
                                                    <Label className="form-label" htmlFor="formrow-password-input">Old
                                                        Password</Label>
                                                    <Input id="oldPwdInput" onChange={(e) => {
                                                        setOldPassword(e.target.value)
                                                    }} type="text" className="form-control" />
                                                </div>
                                            </div>
                                            <div class="col-lg-6">
                                                <div className="mb-3 d-flex">
                                                    <div className="w-100">
                                                        <Label className=""
                                                            htmlFor="formrow-password-input">Password</Label>
                                                        <div className="passwordToggle w-100">
                                                            <Input className="w-100 form-control" id="newPwdInput" onChange={(e) => {
                                                                setPassword(e.target.value)
                                                            }} type={showPassword ? 'text' : 'password'} />
                                                            <div className="passwordToggleEye">
                                                                {showPassword ?
                                                                    <button class="btn btn-light shadow-none ms-0" type="button" onClick={() => setShowPassword(!showPassword)}>
                                                                        <i class="bx bx-show"></i>
                                                                    </button>
                                                                    :
                                                                    <button class="btn btn-light shadow-none ms-0" type="button" onClick={() => setShowPassword(!showPassword)}>
                                                                        <i class="bx bxs-low-vision"></i>
                                                                    </button>
                                                                }
                                                            </div>
                                                        </div>
                                                    </div>

                                                </div>
                                            </div>
                                            <div class="col-lg-6">
                                                <div className="mb-3 d-flex">
                                                    <div className="w-100">
                                                        <Label className="form-label" htmlFor="formrow-password-input">Confirm Password
                                                        </Label>
                                                        <div className="passwordToggle w-100">
                                                            <Input id="confirmPwdInput" onChange={(e) => {
                                                                setConfirmPassword(e.target.value)
                                                            }} type={showConfirmPassword ? 'text' : 'password'} className="form-control" i />
                                                            <div className="passwordToggleEye">
                                                                {showConfirmPassword ?
                                                                    <button class="btn btn-light shadow-none ms-0" type="button" onClick={() => setShowConfirmPassword(!showConfirmPassword)}>
                                                                        <i class="bx bx-show"></i>
                                                                    </button>
                                                                    :
                                                                    <button class="btn btn-light shadow-none ms-0" type="button" onClick={() => setShowConfirmPassword(!showConfirmPassword)}>
                                                                        <i class="bx bxs-low-vision"></i>
                                                                    </button>
                                                                }
                                                            </div>
                                                        </div>
                                                    </div>
                                                </div>
                                            </div>
                                            <div class="col-lg-12">
                                                <div className="mt-4">
                                                    <button type="submit" onClick={changePassword}
                                                        className="btn btn-primary mr-10 w-md">{passwordLoading ? <><span class="spinner-border spinner-border-sm" style={{ marginRight: "3px" }} role="status" aria-hidden="true"></span>
                                                            Loading...</> : <div>Change password </div>}
                                                    </button>
                                                    <span id="messageSpan" style={{
                                                        color: "red",
                                                        fontWeight: "bolder",
                                                        marginLeft: "10px",
                                                        display: "none"
                                                    }}></span>
                                                </div>
                                            </div>
                                        </div>
                                    </CardBody>
                                </Card>
                            </Col>
                        </Row>
                    </div>
                </div>
            </React.Fragment>
        )
    }
}

export default Setting
