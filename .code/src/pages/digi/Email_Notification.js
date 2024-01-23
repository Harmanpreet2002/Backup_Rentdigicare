import React, { useEffect, useState } from "react";
import MetaTags from "react-meta-tags";
import Select from "react-select";
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
} from "reactstrap";
import Dropzone from "react-dropzone";
//Import Breadcrumb
import Breadcrumbs from "../../components/Common/Breadcrumb";
import img4 from "../../assets/images/small/img-4.jpg";




const EmailNotification = () => {
    // USE ROLE
    const decode = jwt_decode(window.localStorage.accessToken);
    //ENDPOINTS
    const GET_COMPANIES_URL = "/company";
    const ADD_PROPERTY_URL = "/layout/add";
    const POST_IMAGE_URL = "/property1/img";

    // for populating dropdowns
    const [companyList, setCompanyList] = useState([]);
    const [companyOwner, setCompanyOwner] = useState([]);

    //  database
    const [toallayout, settoallayout] = useState(0);
    const [title, setTitle] = useState("");

    const [loading, setLoading] = useState(false)
    const [selectedId, setSelectedId] = useState("")
    const [isEdit, setIsEdit] = useState(false)
    const [newRequestType, setNewRequestType] = useState("")
    const [requestTypes, setRequestTypes] = useState([]);
    const [days, setDays] = useState(0)


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

    async function editDays(event) {
        event.preventDefault();

        if (days == '') {
            setshowError(true)
        }
        else {
            setshowError(false)
        }
        if (days != '') {


            //alert("dhd");
            // Getting company information from local storage
            try {
                const response = await axios.post("company/change_ticket_email_days", {
                    companyId: decode.id,
                    days: days,
                });

                if (response.data.sucess) {
                    getEmailDay()
                    tog_large()
                }
            } catch (error) {
                console.log(error); // TODO Proper Error
            }
        }
    }


    async function editRquestType(event) {
        event.preventDefault();

        if (newRequestType == '') {
            setshowError(true)
        }
        else {
            setshowError(false)
        }
        if (newRequestType != '') {



            //alert("dhd");
            // Getting company information from local storage
            try {
                const response = await axios.post("requesttype/editrequesttype", {
                    id: selectedId,
                    request_type: newRequestType,
                });

                if (response.data.status === 200) {
                    getEmailDay()
                    setIsEdit(false)
                    setNewRequestType("")
                    tog_large()
                }
            } catch (error) {
                console.log(error); // TODO Proper Error
            }
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

    const [showError, setshowError] = useState(false);

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

    const getEmailDay = async () => {
        try {
            const response = await axios.post("company/get_ticket_email_days", { companyId: decode.id });
            if (response.data.days) {

                setDays(response.data.days)
            }
        } catch (error) {
            console.log(error);
        }
    };


    async function deleteRequestTypes(requestTypeID) {

        if (window.confirm('Are you sure?')) {
            try {
                const response = await axios.post(
                    `requesttype/delete`, { id: requestTypeID }
                );
                if (response.data.status === 200) {
                    getEmailDay()
                }


            } catch (error) {
                // visible error
                console.log(error);
            }
        }
    }


    useEffect(() => {
        getEmailDay()

    }, [])



    return (
        <React.Fragment>
            <div className="page-content">
                <MetaTags>
                    <title>Rentdigicare | Email Notification </title>
                </MetaTags>
                <div className="container-fluid">
                    <Breadcrumbs title="Home" breadcrumbItem="Email Notification" />
                    <Row>
                        <Col xl={12}>
                            <Card>
                                {
                                    <CardHeader>
                                        <div className="row align-items-center">
                                            <div className="col-md-6">
                                                <div className="mb">
                                                    <h5 className="card-title">
                                                        Email Notification
                                                        <span className="text-muted fw-normal ms-2">
                                                            ({requestTypes.length})
                                                        </span>
                                                    </h5>
                                                </div>
                                            </div>

                                        </div>
                                        <div className="row">
                                            <div className="col-lg-12">
                                                <Collapse className="mt-4" isOpen={col5}>
                                                    <Card>
                                                        <CardBody>
                                                            <div className="filter-sec">
                                                                <Form>
                                                                    <div class="row align-items-center">
                                                                        <div className="col-md-4">
                                                                            <div className="mb-3">
                                                                                <Label className="form-Label">
                                                                                    Property Name
                                                                                </Label>
                                                                                <select className="form-select">
                                                                                    <option>Select One</option>
                                                                                    <option>Exotic Grandeur</option>
                                                                                    <option>Vaneet Sunview</option>
                                                                                    <option>Vera Gold Mark</option>
                                                                                    <option>Sushma Valencia</option>
                                                                                </select>
                                                                            </div>
                                                                        </div>
                                                                        <div className="col-md-4">
                                                                            <div className="mb-3">
                                                                                <Label className="form-Label">
                                                                                    Company Name
                                                                                </Label>
                                                                                <select className="form-select">
                                                                                    <option>Select One</option>
                                                                                    <option>Rentdigi</option>
                                                                                    <option>GSK</option>
                                                                                    <option>
                                                                                        Chappelle Garden Villas
                                                                                    </option>
                                                                                    <option>Riverside Villas</option>
                                                                                </select>
                                                                            </div>
                                                                        </div>
                                                                        <div className="col-md-4">
                                                                            <div className="mb-3">
                                                                                <Label className="form-Label">
                                                                                    Property Manager
                                                                                </Label>
                                                                                <select className="form-select">
                                                                                    <option>Select One</option>
                                                                                    <option>Danish Sharma</option>
                                                                                    <option>John Doe</option>
                                                                                    <option>Jameson</option>
                                                                                    <option>Rock</option>
                                                                                </select>
                                                                            </div>
                                                                        </div>
                                                                        <div className="col-md-12">
                                                                            <div className="srch-btn">
                                                                                <button
                                                                                    type="submit"
                                                                                    className="btn btn-primary"
                                                                                >
                                                                                    Search
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
                                        <Table className="table-striped table-bordered mb-0">
                                            <thead>
                                                <tr>
                                                    <th scope="col">Days</th>

                                                    <th scope="col">Action</th>
                                                </tr>
                                            </thead>
                                            <tbody>

                                                <tr>
                                                    <td>{days}</td>

                                                    <td>
                                                        <div className="d-flex gap-3">
                                                            <button className="btn btn-primary" onClick={() => {
                                                                setIsEdit(true)
                                                                tog_large();
                                                            }}>Edit</button>


                                                        </div>
                                                    </td>
                                                </tr>

                                                {/* <LayoutList toall={settoallayout} /> */}
                                            </tbody>
                                        </Table>
                                    </div>
                                </CardBody>
                            </Card>
                        </Col>
                    </Row>
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
                                {"Edit Days"}
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
                            <Form onSubmit={editDays}>
                                <div className="row align-items-center">
                                    <div className="col-md-6">
                                        <div className="mb-3">
                                            <Label
                                                className="form-label"
                                                htmlFor="formrow-title-input"
                                            >
                                                Days *
                                            </Label>
                                            <Input
                                                onChange={(e) => {
                                                    setDays(e.target.value);
                                                }}
                                                type="text"
                                                className="form-control"
                                                id="formrow-name-input"
                                                value={days}
                                            />
                                            {showError ? <h6 style={{ color: 'red' }}>Cannot be empty</h6> : ""}
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
        </React.Fragment>
    );
};

export default EmailNotification;
