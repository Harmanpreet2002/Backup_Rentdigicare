import React, { useState } from "react";
import MetaTags from "react-meta-tags";
import Select from "react-select";
import { Link } from "react-router-dom";
import axios from "../api/axios";
import jwt_decode from "jwt-decode";
import classnames from "classnames"

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
    Nav,
    NavItem,
    NavLink,
    TabContent,
    TabPane
} from "reactstrap";
import Dropzone from "react-dropzone";
//Import Breadcrumb
import Breadcrumbs from "../../components/Common/Breadcrumb";

// Importing Components
import PropertyList from "./PropertyList";

const AddProperty = () => {

    const [verticleAlignment, setVerticleAlignment] = useState("center");
    const [horizontalAlignment, setHorizontalAlignment] = useState("left");
    const [applicantButtonColor, setApplicantButtonColor] = useState("#4ba6ef");
    const [isApplicantButtonEnabled, setIsApplicantButtonEnabled] = useState(true);
    const [isTicketButtonEnabled, setIsTicketButtonEnabled] = useState(true);
    const [applicantButtonName, setApplicantButtonName] = useState("Resident Application")
    const [ticketButtonName, setTicketButtonName] = useState("Raise Ticket")


    const [customActiveTab, setcustomActiveTab] = useState("1")

    const [col5, setcol5] = useState(false)
    const t_col5 = () => {
        setcol5(!col5)
    }

    const toggleCustom = tab => {
        if (customActiveTab !== tab) {
            setcustomActiveTab(tab)
        }
    }

    const [customActiveTab1, setcustomActiveTab1] = useState("1")
    const toggleCustom1 = tab => {
        if (customActiveTab1 !== tab) {
            setcustomActiveTab1(tab)
        }
    }

    const [status, setStatus] = useState(1)
    const radioHandler = (status) => {
        setStatus(status);
    };
    const [status2, setStatus2] = useState(3)
    const radioHandler2 = (status2) => {
        setStatus2(status2);
    };

    async function generateNewScript(reset) {
        if (!reset) await updateWidgetSettings(
            applicantButtonName,
            ticketButtonName,
            applicantButtonColor,
            verticleAlignment,
            horizontalAlignment,
            isTicketButtonEnabled,
            isApplicantButtonEnabled
        );
        else await updateWidgetSettings();
    }

    async function updateWidgetSettings(
        applicantButtonName = applicantButtonName,
        ticketButtonName = "Raise Ticket",
        applicantButtonColor = applicantButtonColor,
        verticleAlignment = "center",
        horizontalAlignment = horizontalAlignment,
        // isApplicantButtonEnabled = isApplicantButtonEnabled,
        ticketButtonEnabled = true,
        applicantButtonEnabled = true
    ) {
        // Disable preloaeded Status
        const statusSpan = document.getElementById("statusMessage");
        statusSpan.style.display = "none";
        // getting domain name from accesstoken
        const decode = jwt_decode(window.localStorage.getItem("accessToken"));
        try {
            const response = await axios.post("/company/set-script", {
                domain: decode.domain,
                color: applicantButtonColor,
                position: horizontalAlignment,
                applicantButtonName: applicantButtonName,
                isApplicantButtonEnabled: isApplicantButtonEnabled,

            });
            console.log('response', response)
            if (response.data.status === 201) {
                // enable successful message

                statusSpan.innerText = "Settings Updated!";
                statusSpan.style.display = "block";
                statusSpan.style.color = "#12D70F";
            }
        } catch (error) {
            console.log(error);
            statusSpan.innerText = "Something Went Wrong !";
            statusSpan.style.display = "block";
            statusSpan.style.color = "red";
        }
    }


    // USE ROLE
    const decode = jwt_decode(window.localStorage.accessToken);
    //ENDPOINTS
    const GET_COMPANIES_URL = "/company";
    const GET_LAYOUT_URL = "/layout/all";
    const ADD_PROPERTY_URL = "/property/add";
    const POST_IMAGE_URL = "/property1/img";

    // for populating dropdowns
    const [companyList, setCompanyList] = useState([]);
    const [companyOwner, setCompanyOwner] = useState([]);

    //  database
    const [title, setTitle] = useState("");
    const [category, setCategory] = useState([]);
    const [location, setLocation] = useState("");
    // const [status, setStatus] = useState("");

    // TOOD working today
    const [managers, setManagers] = useState({});
    const [documents, setDocuments] = useState([]);
    const [layout, setLayout] = useState([]);

    // under work
    async function getCompanies() {
        try {
            const response = await axios.get(GET_COMPANIES_URL);
            setCompanyList(response.data.companies);
        } catch (error) {
            // TODO proper error message
            console.log(error);
        }
        console.log(companyList);
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
            //console.log("Testttt", layout);
        } catch (error) {
            // TODO proper error message
            console.log(error);
        }
        console.log(companyList);
    }

    async function addProperty(event) {
        event.preventDefault();
        // Getting company information from local storage
        const decode = jwt_decode(window.localStorage.getItem("accessToken"));
        try {
            const response = await axios.post(ADD_PROPERTY_URL, {
                title: title,
                companyID: decode.id,
                company: decode.company,
                companyDomain: decode.domain,
                category: category,
                owner: decode.firstname + " " + decode.lastname,
                location: location,
                status: status,
                manager: [],
                documents: [],
            });

            if (response.data.status === 201) {
                await uploadDocuments(response.data.id);
                window.location.replace("/property");
            }
        } catch (error) {
            console.log(error); // TODO Proper Error
        }
    }

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


    return (
        <React.Fragment>
            <div className="page-content">
                <MetaTags>
                    <title>Rentdigicare | Widget Settings</title>
                </MetaTags>
                <div className="container-fluid">
                    <Breadcrumbs breadcrumbItem="Widget Settings" />
                    <Row>
                        <Col xl={12}>
                            <Card>

                                <CardBody>
                                    <div className="nav-btn-top">
                                        <Nav tabs className="nav-tabs-custom nav-justified mb-4">
                                            <NavItem>
                                                <NavLink
                                                    style={{ cursor: "pointer" }}
                                                    className={classnames({
                                                        active: customActiveTab === "1",
                                                    })}
                                                    onClick={() => {
                                                        toggleCustom("1")
                                                    }}
                                                >
                                                    <span className="d-block d-sm-none">
                                                        <i className="fas fa-home"></i>
                                                    </span>
                                                    <span className="d-none d-sm-block">Application</span>
                                                </NavLink>
                                            </NavItem>
                                            {/* <NavItem>
                            <NavLink
                                style={{ cursor: "pointer" }}
                                className={classnames({
                                    active: customActiveTab === "2",
                                })}
                                onClick={() => {
                                    toggleCustom("2")
                                }}
                            >
                                <span className="d-block d-sm-none">
                                    <i className="fas fa-home"></i>
                                </span>
                                <span className="d-none d-sm-block">Ticket</span>
                            </NavLink>
                        </NavItem> */}
                                        </Nav>
                                    </div>
                                    <TabContent
                                        activeTab={customActiveTab}
                                        className="p-3 text-muted"
                                    >
                                        <TabPane tabId="1">
                                            {/* <div className="d-flex justify-content-center mb-4">   
                                <div className="form-check me-2">
                                        <input className="form-check-input" type="radio" name="formRadios"
                                            id="formRadios1" defaultChecked />
                                        <label className="form-check-label" htmlFor="formRadios1">
                                                Custom Design
                                        </label>
                                    </div>
                                    <div className="form-check">
                                        <input className="form-check-input" type="radio" name="formRadios"
                                            id="formRadios2" />
                                        <label className="form-check-label" htmlFor="formRadios2">
                                                Default Design
                                        </label>
                                    </div>
                            </div>   */}
                                            {status === 1 ? (
                                                <>
                                                    <Row id="div1" className="g-4">
                                                        <div className="col-xl-4">
                                                            <h5 className="font-size-15 mb-3">Horizontal Position</h5>
                                                            <div className="btn-group btn-group-example mb-3 radio-align-sec">
                                                                <span>
                                                                    <input onChange={(e) => { setHorizontalAlignment("left"); }} type="radio" name="btnradio22" id="btnradio5" />
                                                                    <label className="btn btn-outline-primary w-sm lft-algn" htmlFor="btnradio5">Left</label>
                                                                </span>
                                                                
                                                                <span>
                                                                    <input onChange={(e) => setHorizontalAlignment("right")} type="radio" name="btnradio22" id="btnradio7" />
                                                                    <label className="btn btn-outline-primary w-sm rt-algn" htmlFor="btnradio7">Right</label>
                                                                </span>
                                                            </div>

                                                        </div>
                                                        {/* <div className="col-xl-4">
                                                            <h5 className="font-size-15 mb-3">Vertical Position</h5>
                                                            <div className="btn-group btn-group-example mb-3" role="group">
                                                                <button type="button" className="btn btn-outline-primary w-sm tp-algn">Top</button>
                                                                <button type="button" className="btn btn-outline-primary w-sm mdl-algn">Middle</button>
                                                                <button type="button" className="btn btn-outline-primary w-sm btm-algn">Bottom</button>
                                                            </div>
                                                            <div className="btn-group btn-group-example mb-3 radio-align-sec">
                                                                <span>
                                                                    <input onChange={(e) => setVerticleAlignment("top")} type="radio" name="btnradio21" id="btnradio56" />
                                                                    <label className="btn btn-outline-primary w-sm tp-algn" htmlFor="btnradio56">Top</label>
                                                                </span>
                                                                <span>
                                                                    <input onChange={(e) => setVerticleAlignment("center")} type="radio" name="btnradio21" id="btnradio66" />
                                                                    <label className="btn btn-outline-primary w-sm mdl-algn" htmlFor="btnradio66">Middle</label>
                                                                </span>
                                                                <span>
                                                                    <input onChange={(e) => setVerticleAlignment("bottom")} type="radio" name="btnradio21" id="btnradio76" />
                                                                    <label className="btn btn-outline-primary w-sm btm-algn" htmlFor="btnradio76">Bottom</label>
                                                                </span>
                                                            </div>
                                                        </div> */}

                                                        <div className="col-xl-2">
                                                            <div className="mb-3">
                                                                <h5 className="font-size-15 mb-3">Button Color</h5>
                                                                <div className="eye-drop">
                                                                    <Input onChange={(e) => setApplicantButtonColor(e.target.value)} type="color" className="form-control form-control-color colr-btn mw-100" id="example-color-input" defaultValue="#4ba6ef" title="Choose your color" />
                                                                    <span className="dropper"><i class="fas fa-eye-dropper"></i></span>
                                                                </div>
                                                            </div>
                                                        </div>
                                                        <div className="col-xl-2">
                                                            <div className="mb-3">
                                                                <h5 className="font-size-15 mb-3">Enable/Disable</h5>
                                                                <Input onChange={(e) => setIsApplicantButtonEnabled(e.target.checked)} type="checkbox" id="switch1" switch="none" defaultChecked />
                                                                <Label className="me-1" htmlFor="switch1" data-on-label="" data-off-label=""></Label>
                                                            </div>
                                                        </div>
                                                    </Row>
                                                    <Row id="div1" className="g-4 mt-1">
                                                        <div className="col-xl-4">
                                                            <h5 className="font-size-15 mb-3">Applicant Button Text</h5>
                                                            <Form>
                                                                <Input onChange={(e) => setApplicantButtonName(e.target.value)} type="text" className="form-control" id="formrow-buttontxt-input" />
                                                            </Form>
                                                        </div>
                                                    </Row>
                                                    <Row>
                                                        <div className="changes-btn mt-4">
                                                            <button onClick={(e) => generateNewScript(false)} type="submit" className="btn btn-primary mr-10 w-md">Save Changes</button>
                                                            <button onClick={(e) => generateNewScript(true)} type="submit" className="btn btn-secondary w-md">Reset Default</button>
                                                        </div>
                                                    </Row>
                                                    <span style={{ fontWeight: "bolder", display: "none", marginTop: "10px" }} id="statusMessage"></span>
                                                </>
                                            ) :
                                                null
                                            }


                                        </TabPane>
                                        <TabPane tabId="2">

                                            {status2 === 3 ? (
                                                <>
                                                    <Row id="div1" className="g-4">
                                                        <div className="col-xl-4">
                                                            <h5 className="font-size-15 mb-3">Horizontal Position</h5>
                                                            <div className="btn-group btn-group-example mb-3 radio-align-sec">
                                                                <span>
                                                                    <input type="radio" name="btnradio29" id="btnradio59" />
                                                                    <label className="btn btn-outline-primary w-sm lft-algn" htmlFor="btnradio59">Left</label>
                                                                </span>
                                                                <span>
                                                                    <input type="radio" name="btnradio29" id="btnradio69" />
                                                                    <label className="btn btn-outline-primary w-sm cnt-algn" htmlFor="btnradio69">Center</label>
                                                                </span>
                                                                <span>
                                                                    <input type="radio" name="btnradio29" id="btnradio79" />
                                                                    <label className="btn btn-outline-primary w-sm rt-algn" htmlFor="btnradio79">Right</label>
                                                                </span>
                                                            </div>

                                                        </div>
                                                        <div className="col-xl-4">
                                                            <h5 className="font-size-15 mb-3">Vertical Position</h5>
                                                            {/* <div className="btn-group btn-group-example mb-3" role="group">
                                        <button type="button" className="btn btn-outline-primary w-sm tp-algn">Top</button>
                                        <button type="button" className="btn btn-outline-primary w-sm mdl-algn">Middle</button>
                                        <button type="button" className="btn btn-outline-primary w-sm btm-algn">Bottom</button>
                                    </div>    */}
                                                            <div className="btn-group btn-group-example mb-3 radio-align-sec">
                                                                <span>
                                                                    <input type="radio" name="btnradio33" id="btnradio58" />
                                                                    <label className="btn btn-outline-primary w-sm tp-algn" htmlFor="btnradio58">Top</label>
                                                                </span>
                                                                <span>
                                                                    <input type="radio" name="btnradio33" id="btnradio68" />
                                                                    <label className="btn btn-outline-primary w-sm mdl-algn" htmlFor="btnradio68">Middle</label>
                                                                </span>
                                                                <span>
                                                                    <input type="radio" name="btnradio33" id="btnradio78" />
                                                                    <label className="btn btn-outline-primary w-sm btm-algn" htmlFor="btnradio78">Bottom</label>
                                                                </span>
                                                            </div>
                                                        </div>
                                                        <div className="col-xl-2">
                                                            <div className="mb-3">
                                                                <h5 className="font-size-15 mb-3">Button Color</h5>
                                                                <div className="eye-drop">
                                                                    <Input type="color" className="form-control form-control-color colr-btn mw-100" id="example-color-input" defaultValue="#4ba6ef" title="Choose your color" />
                                                                    <span className="dropper"><i class="fas fa-eye-dropper"></i></span>
                                                                </div>
                                                            </div>
                                                        </div>
                                                        <div className="col-xl-2">
                                                            <div className="mb-3">
                                                                <h5 className="font-size-15 mb-3">Enable/Disable</h5>
                                                                <Input onChange={(e) => setIsTicketButtonEnabled(e.target.checked)} type="checkbox" id="switch2" switch="none" defaultChecked />
                                                                <Label className="me-1" htmlFor="switch2" data-on-label="" data-off-label=""></Label>
                                                            </div>
                                                        </div>
                                                    </Row>
                                                    <Row className="g-4 mt-1">
                                                        <div className="col-xl-4">
                                                            <h5 className="font-size-15 mb-3">Ticket Button Text</h5>
                                                            <Form>
                                                                <Input onChange={(e) => setTicketButtonName(e.target.value)} type="text" className="form-control" id="formrow-buttontxt-input" />
                                                            </Form>
                                                        </div>
                                                    </Row>
                                                    <Row>
                                                        <div className="changes-btn mt-4">
                                                            <button onClick={(e) => generateNewScript(false)} type="submit" className="btn btn-primary mr-10 w-md">Save Changes</button>
                                                            <button onClick={(e) => generateNewScript(true)} type="submit" className="btn btn-secondary w-md">Reset Default</button>
                                                        </div>

                                                    </Row>
                                                    <span style={{ fontWeight: "bolder", display: "none", marginTop: "10px" }} id="statusMessage2"></span>
                                                </>
                                            ) :
                                                null
                                            }
                                        </TabPane>
                                    </TabContent>
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
