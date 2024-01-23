import React, { useEffect, useState } from "react";
import MetaTags from 'react-meta-tags';
import { Link } from "react-router-dom";
import classnames from "classnames";
import jwt_decode from "jwt-decode"
import Dropzone from "react-dropzone";
import { Rating } from 'react-simple-star-rating'
import moment from "moment";
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


    Nav,
    NavItem,
    NavLink,
    TabContent,
    TabPane,




} from "reactstrap"

//Import Breadcrumb
import Breadcrumbs from "../../components/Common/Breadcrumb"
import axios from '../api/axios'

const SpecificTickets = () => {
    const decode = jwt_decode(window.localStorage.getItem("accessToken"));

    const VENDOR_PORTAL_TICKETS = `/ticket/get_vendor_portal_tickets/${decode.id}`

    const [modal_large, setmodal_large] = useState(false);
    const [btnsuccess1, setBtnsuccess1] = useState(false);
    const [modal_large2, setmodal_large2] = useState(false);
    const [portalTikets, setportalTikets] = useState([])
    const [customActiveTab, setcustomActiveTab] = useState("1")
    const [modal_view, setmodal_view] = useState(false);
    const [startDate, setStartDate] = useState(Date.now())
    const [startTime, setStartTime] = useState("")
    const [endDate, setEndDate] = useState(Date.now())
    const [endTime, setEndTime] = useState("")
    const [notes, setNotes] = useState("")
    const [estimatedAmount, setestimatedAmount] = useState("")
    const [selectedItem, setSelectedItem] = useState({})
    const [documentError, setDocumentError] = useState("")
    const [selectedFiles, setSelectedFiles] = useState([])


    const [selectedTicketId, setSelectedTicketID] = useState("")
    const [quoteError, setQuoteError] = useState("")

    const [propertyID, setPropertyID] = useState("")
    const [priority, setPriority] = useState("")
    const [pageNumber, setPageNumber] = useState(1)
    const [totalTickets, setTotalTickets] = useState(0)
    const [propertyList, setPropertyList] = useState([])
    const [property, setProperty] = useState("")

    const [filterFromDate, setFilterFromDate] = useState();
    const [filterToDate, setFilterToDate] = useState();
    const [filterStatus, setFilterStatus] = useState("");
    const [requestTypes, setRequestTypes] = useState([])
    const [requestTypeFilter, setRequestTypeFilter] = useState({ label: "", value: "" });
    const [ticketIDs, setTicketIDs] = useState([])
    const [filterID, setFiletrID] = useState("")
    const [suite, seSuite] = useState([]);
    const [suiteFilter, setSuiteFilter] = useState('');

    const [loading, setLoading] = useState(false);


    function removeBodyCss() {
        document.body.classList.add("no_padding")
    }

    function tog_large() {
        setmodal_large(!modal_large)
        removeBodyCss()
    }


    const uploadDocuments = async (quoteId) => {
        const formData = new FormData();
        var i = 0;
        while (i < selectedFiles.length) {
            formData.append(`file`, selectedFiles[i]);
            i++
        }

        const config = {
            headers: {
                "content-type": "multipart/form-data",
                "id": `${quoteId}`
            },
        };

        try {
            const response = await axios.post("/ticket/upload-quoted-documents", formData, config);
        } catch (error) {
            console.log(error)
        }

    }

    async function quoteTicket() {

        if (!startDate || !startTime || !endDate || !endTime || !notes || !estimatedAmount) {
            return setQuoteError("Please enter all the fields")
        }

        setLoading(true)

        try {

            let Details = {
                "vendorID": decode.id,
                "ticketID": selectedTicketId,
                "startDate": startDate,
                "startTime": startTime,
                "estimatedEndDate": endDate,
                "estimatedETime": endTime,
                "notes": notes,
                "estimatedAmount": estimatedAmount
            }


            const response = await axios.post("/ticket/quote_vendor_ticket", Details)

            console.log("response", response)

            if (response.data?.success) {
                await uploadDocuments(response.data.addedQuoteTicket._id);
                getVendorPortal(1)
                tog_view()
                //setVendor(response?.data?.vendors)
            } else {
                setQuoteError(response.data?.errorMessage || "Something went wrong")
                //setVendorError(response.data?.errorMessage)
            }

            setLoading(false)

        } catch (error) {
            setQuoteError("Something went wrong")
            setLoading(false)

        }
    }

    function tog_view() {
        setmodal_view(!modal_view);
        removeBodyCss();

    }
    const [col5, setcol5] = useState(false)
    const t_col5 = () => {
        setcol5(!col5)
    }
    function tog_large2() {
        setmodal_large2(!modal_large2)
        removeBodyCss()
    }

    const toggleCustom = tab => {
        if (customActiveTab !== tab) {
            setcustomActiveTab(tab)
        }
    }

    const removeDocuments = (idToRemove) => {

        const filteredDocuments = selectedFiles.filter((item, i) => i !== idToRemove);

        setSelectedFiles(filteredDocuments)

    }

    const getVendorPortal = async (pgNum, type) => {
        try {
            const response = await axios.post(VENDOR_PORTAL_TICKETS, {
                propertyID: type == "clear" ? "" : propertyID,
                priority: type == "clear" ? "" : priority,
                pageNumber: pageNumber
            })

            console.log("response", response)

            if (response.data.status == 200) {
                setportalTikets(response.data.tickets)

                setTotalTickets(response.data.totalCount)
                setRequestTypes(response.data.requestTypes)
                setPropertyList(response.data.propertyList)
                setTicketIDs(response.data.tickets.map((t) => t._id));
                seSuite(response.data.tickets.map((t) => t.suite));
                if (type == "next") setPageNumber(pageNumber + 1)
                if (type == "previous") setPageNumber(pageNumber - 1)
                

                //console.log("responessssssssssssssssssssssssssss",response.data)
            } else {
                setportalTikets(response.data.errorMessage || 'something went wrong')
            }

        } catch (error) {
            setportalTikets("Something went wrong")

            console.log(error) // TODO proper error
        }

    }


    const clearFunc = () => {
        setPropertyID("")
        setProperty("")
        setPriority("")
        setPageNumber(1)
        setFilterFromDate('')
        setFilterToDate("")
        setRequestTypeFilter("")
        setFilterStatus("")
        setFiletrID('')
        setSuiteFilter('')
        getVendorPortal(1, "clear")

    }

    function formatBytes(bytes, decimals = 2) {
        if (bytes === 0) return "0 Bytes"
        const k = 1024
        const dm = decimals < 0 ? 0 : decimals
        const sizes = ["Bytes", "KB", "MB", "GB", "TB", "PB", "EB", "ZB", "YB"]

        const i = Math.floor(Math.log(bytes) / Math.log(k))
        return parseFloat((bytes / Math.pow(k, i)).toFixed(dm)) + " " + sizes[i]
    }

    const handleAcceptedFiles = (files) => {
        files.map(file =>
            Object.assign(file, {
                preview: URL.createObjectURL(file),
                formattedSize: formatBytes(file.size),
            })
        )
        console.log("files", files)
        setSelectedFiles(files)
    }

    const getProperties = async (pgNum, type) => {
        try {
            const response = await axios.get("/property/getproperties");

            console.log(response)

            setPropertyList(response.data.properties)
        } catch (error) {
            // setportalTikets("Something went wrong")

            console.log(error) // TODO proper error
        }

    }

    useEffect(async () => {
        getVendorPortal(1)
        // getProperties()
        // const getSpeciality = async (e) => {
        // }

    }, [])

    // const getPropertyManagerList = async () => {
    //     try {
    //         await axios
    //             .post(`/property_manager/vendor`, {vendorId: decode.id})
    //             .then(function (response) {
    //                 if (response?.data?.managers) {
    //                     setPropertyManagerList(response.data.managers);
    //                 }
    //                 if (response?.data?.types) {
    //                     setRequestTypes(response.data.types);
    //                 }
    //             })
    //             .catch(function (error) {
    //                 console.log(error);
    //             });
    //     } catch (error) {
    //         console.log(error?.message);
    //     }
    // };

    const getVendorTickets = async (type) => {
        if (type == "Search") {
            let query = {
                pageNumber: pageNumber,
                startDate: filterFromDate,
                endDate: filterToDate,
                status: filterStatus,
                propertyID: propertyID,
                filterID: filterID.value,
                requestType: requestTypeFilter.value,
                vendorId: decode.id,
                suite:suiteFilter.value,
            };
            
            let response = await axios.post(`/ticket/filter_tickets_vendor`, query)
            console.log(response);
            if (response.status == 200) {
                setPropertyList(response.data.propertyList)
                setRequestTypes(response.data.requestTypes)
                setportalTikets(response.data.tickets)
                setTotalTickets(response.data.totalCount)
                setTicketIDs(response.data.tickets.map((t) => t._id))
            }
                
        }
    }
    
    
    console.log("portalTicketssssssssssssss", portalTikets)

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
                                        <div className="col-md-6">
                                            <div className="mb">
                                                <h5 className="card-title">General Maintenance Request <span className="text-muted fw-normal ms-2">({portalTikets.length})</span></h5>
                                            </div>
                                        </div>
                                        <div className="col-md-6 d-flex flex-wrap align-items-center justify-content-end">
                                            <div className="mb d-flex flex-wrap">
                                                <button
                                                    onClick={t_col5}
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
                                                {/* <button
                                                    type="button"
                                                    onClick={() => {
                                                        tog_large()
                                                    }}
                                                    className="btn btn-light "
                                                    data-toggle="modal"
                                                    data-target=".bs-example-modal-lg"
                                                >
                                                    <i className="bx bx-plus me-1"></i> Add Staff
                                                </button> */}
                                                <Modal
                                                    size="lg"
                                                    isOpen={modal_large}
                                                    toggle={() => {
                                                        tog_large()
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
                                                                setmodal_large(false)
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
                                                                        <Label className="form-label" htmlFor="formrow-name-input">Vendor Name</Label>
                                                                        <Input type="text" className="form-control" id="formrow-name-input" />
                                                                    </div>
                                                                </div>
                                                                <div className="col-md-6">
                                                                    <div className="mb-3">
                                                                        <Label className="form-label" htmlFor="formrow-code-input">Vendor Code</Label>
                                                                        <Input type="text" className="form-control" id="formrow-code-input" />
                                                                    </div>
                                                                </div>
                                                                <div className="col-md-6">
                                                                    <div className="mb-3">
                                                                        <Label className="form-Label">Category</Label>
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
                                                                        <Label className="form-Label">Rate/Term</Label>
                                                                        <div class="row">
                                                                            <div class="col-md-8">
                                                                                <div className="mb-3">
                                                                                    <Input type="text" className="form-control" id="formrow-code-input" />
                                                                                </div>
                                                                            </div>
                                                                            <div class="col-md-4">
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
                                                                            <h4 className="card-title mb-4">Details</h4>
                                                                            <div className="row">
                                                                                <div className="col-md-6">
                                                                                    <div className="mb-3">
                                                                                        <Label className="form-label" htmlFor="formrow-address-input">Address1</Label>
                                                                                        <Input type="text" className="form-control" id="formrow-address-input" />
                                                                                    </div>
                                                                                </div>
                                                                                <div className="col-md-6">
                                                                                    <div className="mb-3">
                                                                                        <Label className="form-label" htmlFor="formrow-address-input">Address2</Label>
                                                                                        <Input type="text" className="form-control" id="formrow-address-input" />
                                                                                    </div>
                                                                                </div>
                                                                                <div className="col-md-6">
                                                                                    <div className="mb-3">
                                                                                        <Label className="form-label" htmlFor="formrow-city-input">City</Label>
                                                                                        <Input type="text" className="form-control" id="formrow-city-input" />
                                                                                    </div>
                                                                                </div>
                                                                                <div className="col-md-6">
                                                                                    <div className="mb-3">
                                                                                        <Label className="form-label" htmlFor="formrow-state-input">State/Province</Label>
                                                                                        <Input type="text" className="form-control" id="formrow-state-input" />
                                                                                    </div>
                                                                                </div>
                                                                                <div className="col-md-6">
                                                                                    <div className="mb-3">
                                                                                        <Label className="form-label" htmlFor="formrow-postal-input">Postal/Zip Code</Label>
                                                                                        <Input type="text" className="form-control" id="formrow-postal-input" />
                                                                                    </div>
                                                                                </div>
                                                                                <div className="col-md-6">
                                                                                    <div className="mb-3">
                                                                                        <Label className="form-label" htmlFor="formrow-contact-input">Telephone 1</Label>
                                                                                        <Input type="text" className="form-control" id="formrow-contact-input" />
                                                                                    </div>
                                                                                </div>
                                                                                <div className="col-md-6">
                                                                                    <div className="mb-3">
                                                                                        <Label className="form-label" htmlFor="formrow-contact-input">Telephone 2</Label>
                                                                                        <Input type="text" className="form-control" id="formrow-contact-input" />
                                                                                    </div>
                                                                                </div>
                                                                                <div className="col-md-6">
                                                                                    <div className="mb-3">
                                                                                        <Label className="form-label" htmlFor="formrow-fax-input">Fax</Label>
                                                                                        <Input type="text" className="form-control" id="formrow-fax-input" />
                                                                                    </div>
                                                                                </div>
                                                                                <div className="col-md-6">
                                                                                    <div className="mb-3">
                                                                                        <Label className="form-label" htmlFor="formrow-contact-input">Contact</Label>
                                                                                        <Input type="text" className="form-control" id="formrow-contact-input" />
                                                                                    </div>
                                                                                </div>
                                                                                <div className="col-md-6">
                                                                                    <div className="mb-3">
                                                                                        <Label className="form-label" htmlFor="formrow-email-input">Email</Label>
                                                                                        <Input type="text" className="form-control" id="formrow-email-input" />
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
                                                            <Form>
                                                                <div class="row align-items-center">
                                                                    <div className="col-md-3">
                                                                        <div className="mb-3">
                                                                            <Label
                                                                                htmlFor="example-date-input"
                                                                                className="form-Label"
                                                                            >
                                                                                From
                                                                            </Label>
                                                                            <Input
                                                                                className="form-control"
                                                                                onChange={(e) => {
                                                                                    setFilterFromDate(e.target.value);
                                                                                }}
                                                                                value={filterFromDate}
                                                                                type="date"
                                                                                defaultValue={Date.now()}
                                                                                id="example-date-input"
                                                                            />
                                                                        </div>
                                                                    </div>
                                                                    <div className="col-md-3">
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
                                                                                value={filterToDate}
                                                                                onChange={(e) => {
                                                                                    setFilterToDate(e.target.value);
                                                                                }}
                                                                                defaultValue={Date.now()}
                                                                                id="example-date-input"
                                                                            />
                                                                        </div>
                                                                    </div>
                                                                    <div className="col-md-3">
                                                                        <div className="mb-3">
                                                                            <Label className="form-Label">Request Id</Label>
                                                                            <Select
                                                                                value={filterID}
                                                                                onChange={(e) => {
                                                                                    setFiletrID(e)
                                                                                }}
                                                                                options={ticketIDs?.map((id) => {
                                                                                    return {
                                                                                        value: id,
                                                                                        label: id.substring(id.length - 6),
                                                                                    }
                                                                                })}
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
                                                                                <option value={"Open"}>Open</option>
                                                                                <option value={"Inprogress"}>
                                                                                    Inprogress
                                                                                </option>
                                                                                <option value={"Completed"}>
                                                                                    Completed
                                                                                </option>
                                                                                <option value={"Unresolved"}>
                                                                                    Unresolved
                                                                                </option>
                                                                            </select>
                                                                        </div>
                                                                    </div>
                                                                    <div className="col-md-3">
                                                                        <div className="mb-3">
                                                                            <Label className="form-Label">Property</Label>
                                                                            <Select 
                                                                                value={property}
                                                                                onChange={(e) => {
                                                                                    const propertyData = JSON.parse(e.target.value)
                                                                                    setPropertyID(propertyData.ID)
                                                                                    setProperty(e.target.value)
                                                                                    console.log(propertyData)
                                                                                    // domain = this.state.propertyList.find(o => o._id === propertyData.ID);
                                                                                    // domain = domain.companyDomain
                                                                                    // console.log(domain)

                                                                                }}
                                                                                options={propertyList?.map((p) => {
                                                                                    return {
                                                                                        value: p._id,
                                                                                        label: p.title
                                                                                    }
                                                                                })}
                                                                            />
                                                                        </div>
                                                                    </div>
                                                                    <div className="col-md-3">
                                                                        <div className="mb-3">
                                                                            <Label
                                                                                className="form-label"
                                                                                htmlFor="formrow-submitted-input"
                                                                            >
                                                                                Request Type
                                                                            </Label>
                                                                            <Select
                                                                                value={requestTypeFilter?.value ? requestTypeFilter : ""}
                                                                                placeholder="Select type"
                                                                                options={requestTypes?.map((item) => {

                                                                                    return {
                                                                                        value: item,
                                                                                        label: item,
                                                                                    };
                                                                                })}
                                                                                onChange={(e) => {
                                                                                    console.log(e)
                                                                                    setRequestTypeFilter(e);
                                                                                }}
                                                                            />
                                                                        </div>
                                                                    </div>
                                                                    <div className="col-md-3">
                                                                        <div className="mb-3">
                                                                            <Label
                                                                                className="form-label"
                                                                                htmlFor="formrow-submitted-input"
                                                                            >
                                                                               Suite
                                                                            </Label>
                                                                            <Select
                                                                                value={suiteFilter}
                                                                                placeholder="Select type"
                                                                                options={suite?.map((item) => {

                                                                                    return {
                                                                                        value: item,
                                                                                        label: item,
                                                                                    };
                                                                                })}
                                                                                onChange={(e) => {
                                                                                    console.log(e)
                                                                                    setSuiteFilter(e);
                                                                                }}
                                                                            />
                                                                        </div>
                                                                    </div>


                                                                    <div className="col-md-2 text-end">
                                                                        <button type="submit" className="btn btn-primary" onClick={(e) => { e.preventDefault(); getVendorTickets("Search") }}>Search</button>
                                                                    </div>
                                                                    <div className="col-md-1">
                                                                        <button type="submit" className="btn btn-light" onClick={(e) => { e.preventDefault(); clearFunc() }}>Clear</button>

                                                                    </div>
                                                                    <div className="col-md-12 d-flex flex-wrap align-items-center justify-content-end">
                                                                        <div className="mb d-flex flex-wrap justify-content-end" >

                                                                        </div>
                                                                    </div>
                                                                    <div className="col-md-12">


                                                                        <div className="col-md-4">

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
                                                {/* <tr>
                                                    <th scope="col">#</th>
                                                    <th scope="col">Category</th>
                                                    <th scope="col">Code</th>
                                                    <th scope="col">Name</th>
                                                    <th scope="col">Address</th>
                                                    <th scope="col">City</th>
                                                    <th scope="col">Contact</th>
                                                    <th scope="col">Attachment</th>
                                                    <th scope="col">Active</th>
                                                    <th scope="col">Action</th>
                                                    <th scope="col">Company</th>
                                                    <th scope="col">Property</th>
                                                    <th scope="col">Suite</th>
                                                    <th scope="col">Details</th>
                                                    <th scope="col">Action</th>

                                                </tr> */}
                                                <tr>
                                                    <th scope="col">#</th>
                                                    <th scope="col">ID</th>
                                                    <th scope="col">Request Type</th>
                                                    <th scope="col">Propery</th>
                                                    <th scope="col">Submited By</th>
                                                    <th scope="col">Created</th>
                                                    <th scope="col">Age</th>
                                                    <th scope="col">Status</th>
                                                    <th scope="col">Action</th>
                                                </tr>
                                            </thead>
                                            <tbody>
                                                <tr>
                                                    {/* <td>1</td>
                                                    <td>
                                                        <a href="#!"
                                                            onClick={() => {
                                                                tog_large2()
                                                            }}
                                                            data-toggle="modal"
                                                            data-target=".bs-example-modal-lg"
                                                        >
                                                            Painting 
                                                        </a>*/}
                                                    <Modal
                                                        size="lg"
                                                        isOpen={modal_large2}
                                                        toggle={() => {
                                                            tog_large2()
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
                                                                    setmodal_large2(false)
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
                                                                            <Label className="form-label" htmlFor="formrow-name-input">Vendor Name</Label>
                                                                            <Input type="text" className="form-control" value="Danish" id="formrow-name-input" readonly />
                                                                        </div>
                                                                    </div>
                                                                    <div className="col-md-6">
                                                                        <div className="mb-3">
                                                                            <Label className="form-label" htmlFor="formrow-code-input">Vendor Code</Label>
                                                                            <Input type="text" className="form-control" value="12345" id="formrow-code-input" readonly />
                                                                        </div>
                                                                    </div>
                                                                    <div className="col-md-6">
                                                                        <div className="mb-3">
                                                                            <Label className="form-Label">Category</Label>
                                                                            <Input type="text" className="form-control" value="Category 1" id="formrow-cat-input" readonly />
                                                                        </div>
                                                                    </div>
                                                                    <div className="col-md-6">
                                                                        <div className="mb-3">
                                                                            <Label className="form-Label">Active</Label>
                                                                            <Input type="text" className="form-control" value="Yes" id="formrow-stat-input" readonly />
                                                                        </div>
                                                                    </div>
                                                                    <div className="col-md-6">
                                                                        <div className="mb-3">
                                                                            <Label className="form-Label">Rate/Term</Label>
                                                                            <div class="row">
                                                                                <div class="col-md-8">
                                                                                    <div className="mb-3">
                                                                                        <Input type="text" className="form-control" value="100" id="formrow-code-input" readonly />
                                                                                    </div>
                                                                                </div>
                                                                                <div class="col-md-4">
                                                                                    <div className="mb-3">
                                                                                        <Input type="text" className="form-control" value="Hours" id="formrow-code-input" readonly />
                                                                                    </div>
                                                                                </div>
                                                                            </div>
                                                                        </div>
                                                                    </div>
                                                                    <div className="col-md-12">
                                                                        <Card>
                                                                            <CardBody>
                                                                                <h4 className="card-title mb-4">Details</h4>
                                                                                <div className="row">
                                                                                    <div className="col-md-6">
                                                                                        <div className="mb-3">
                                                                                            <Label className="form-label" htmlFor="formrow-address-input">Address1</Label>
                                                                                            <Input type="text" className="form-control" value="#9, Industrial Area, near Rajdeep Nagar" id="formrow-address-input" readonly />
                                                                                        </div>
                                                                                    </div>
                                                                                    <div className="col-md-6">
                                                                                        <div className="mb-3">
                                                                                            <Label className="form-label" htmlFor="formrow-address-input">Address2</Label>
                                                                                            <Input type="text" className="form-control" value="#9, Industrial Area, near Rajdeep Nagar" id="formrow-address-input" readonly />
                                                                                        </div>
                                                                                    </div>
                                                                                    <div className="col-md-6">
                                                                                        <div className="mb-3">
                                                                                            <Label className="form-label" htmlFor="formrow-city-input">City</Label>
                                                                                            <Input type="text" className="form-control" value="Toronto" id="formrow-city-input" readonly />
                                                                                        </div>
                                                                                    </div>
                                                                                    <div className="col-md-6">
                                                                                        <div className="mb-3">
                                                                                            <Label className="form-label" htmlFor="formrow-state-input">State/Province</Label>
                                                                                            <Input type="text" className="form-control" value="Brampton" id="formrow-state-input" readonly />
                                                                                        </div>
                                                                                    </div>
                                                                                    <div className="col-md-6">
                                                                                        <div className="mb-3">
                                                                                            <Label className="form-label" htmlFor="formrow-postal-input">Postal/Zip Code</Label>
                                                                                            <Input type="text" className="form-control" value="143416" id="formrow-postal-input" readonly />
                                                                                        </div>
                                                                                    </div>
                                                                                    <div className="col-md-6">
                                                                                        <div className="mb-3">
                                                                                            <Label className="form-label" htmlFor="formrow-contact-input">Telephone 1</Label>
                                                                                            <Input type="text" className="form-control" value="143416" id="formrow-contact-input" readonly />
                                                                                        </div>
                                                                                    </div>
                                                                                    <div className="col-md-6">
                                                                                        <div className="mb-3">
                                                                                            <Label className="form-label" htmlFor="formrow-contact-input">Telephone 2</Label>
                                                                                            <Input type="text" className="form-control" value="143416" id="formrow-contact-input" readonly />
                                                                                        </div>
                                                                                    </div>
                                                                                    <div className="col-md-6">
                                                                                        <div className="mb-3">
                                                                                            <Label className="form-label" htmlFor="formrow-fax-input">Fax</Label>
                                                                                            <Input type="text" className="form-control" value="243416" id="formrow-fax-input" readonly />
                                                                                        </div>
                                                                                    </div>
                                                                                    <div className="col-md-6">
                                                                                        <div className="mb-3">
                                                                                            <Label className="form-label" htmlFor="formrow-contact-input">Contact</Label>
                                                                                            <Input type="text" className="form-control" value="143416" id="formrow-contact-input" readonly />
                                                                                        </div>
                                                                                    </div>
                                                                                    <div className="col-md-6">
                                                                                        <div className="mb-3">
                                                                                            <Label className="form-label" htmlFor="formrow-email-input">Email</Label>
                                                                                            <Input type="text" className="form-control" value="abc@gmail.com" id="formrow-email-input" readonly />
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
                                                </tr>
                                                {portalTikets.map((item, index) => {
                                                    return (
                                                        <>
                                                        {/* <tr key={item._id}>
                                                            <td>{index + 1}</td>
                                                            <td>
                                                                <a href="#!"
                                                                    onClick={() => {
                                                                        tog_large2()
                                                                    }}
                                                                    data-toggle="modal"
                                                                    data-target=".bs-example-modal-lg"
                                                                >
                                                                    {item?.companyID?.name}
                                                                </a>
                                                            </td>

                                                            <td>{item.property}</td>
                                                            <td>{item.suite}</td>
                                                            <td>{item.details}</td>
                                                            <td>
                                                                <div>
                                                                    {item.quotedVendorTickets.length == 0 ?
                                                                        <button
                                                                            className="btn btn-success mr-5"
                                                                            type="button"
                                                                            style={{ cursor: "pointer" }}
                                                                            onClick={(e) => { setSelectedTicketID(item._id); setSelectedItem(item); tog_view(); }}

                                                                        >
                                                                            Quote
                                                                        </button>
                                                                        :
                                                                        <div style={{ color: "green" }}>Quoted</div>

                                                                    }

                                                                </div>
                                                            </td>





                                                            </tr> */}
                                                            <tr key={item._id}>
                                                                <td>{index + 1}</td>
                                                                <td>{item._id.substring(item._id.length - 6)}</td>
                                                                <td>{item.requestType}</td>
                                                                <td>{item.property}</td>
                                                                <td onClick={() => {
                                                                    tog_large2()
                                                                }}>{item.name}<br></br>{item.email}<br></br>{item.suite}</td>
                                                                <td>{moment(item.createdAt).format("DD-MM-YY")}</td>
                                                                <td>{moment(item.createdAt).fromNow()}</td>
                                                                <td className="text-capitalize text-center">
                                                                    <button className={`btn ${item.status === 'Completed' ? 'btn-success' : item.status === 'Inprogress' ? 'btn-warning' : item.status === 'Unresolved' ? 'btn-danger' : 'btn-primary'}`}>
                                                                        {item.status}
                                                                    </button>
                                                                </td>
                                                                <td>
                                                                    <div>
                                                                        {item.quotedVendorTickets.length == 0 ?
                                                                            <button
                                                                                className="btn btn-success mr-5"
                                                                                type="button"
                                                                                style={{ cursor: "pointer" }}
                                                                                onClick={(e) => { setSelectedTicketID(item._id); setSelectedItem(item); tog_view(); }}

                                                                            >
                                                                                Quote
                                                                            </button>
                                                                            :
                                                                            <div style={{ color: "green" }}>Quoted</div>

                                                                        }

                                                                    </div>
                                                                </td>
                                                            </tr>
                                                        </>
                                                    )
                                                })}



                                            </tbody>
                                        </Table>
                                    </div>
                                    <Row className="proress-style mt-3">
                                        <Col xl={3}>
                                        </Col>
                                        <Col xl={9}>
                                            <div className="pagination-bar">
                                                <Pagination aria-label="Page navigation example">
                                                    <PaginationItem disabled={pageNumber == 1}>
                                                        <PaginationLink onClick={(e) => { e.preventDefault(); getVendorPortal(pageNumber - 1, "previous") }} tabIndex="-1">
                                                            Previous
                                                        </PaginationLink>
                                                    </PaginationItem>

                                                    <PaginationItem active>
                                                        <PaginationLink href="#">
                                                            {pageNumber} <span className="sr-only">(current)</span>
                                                        </PaginationLink>
                                                    </PaginationItem>
                                                    <PaginationItem disabled={(Math.ceil(totalTickets / 10)) == pageNumber || (Math.ceil(totalTickets / 10)) == 0}>
                                                        <PaginationLink onClick={(e) => { e.preventDefault(); getVendorPortal(pageNumber + 1, "next") }}>Next</PaginationLink>
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


                <Modal
                    size="lg"
                    isOpen={modal_view}
                    toggle={() => {
                        tog_view()
                    }}
                >
                    <div className="modal-header">
                        <h5
                            className="modal-title mt-0"
                            id="myLargeModalLabel"
                        >
                            View Ticket list Details
                        </h5>
                        <button
                            onClick={() => {
                                tog_view()
                                // setmodal_large2(false)
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

                        <Nav tabs className="nav-tabs-custom nav-justified position-static mb-0">
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
                                    <span className="d-none d-sm-block">Ticket Detail</span>
                                </NavLink>
                            </NavItem>
                            <NavItem>
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
                                    <span className="d-none d-sm-block">Quote</span>
                                </NavLink>
                            </NavItem>
                        </Nav>
                        <TabContent
                            activeTab={customActiveTab}
                            className="p-3 text-muted"
                        >
                            <TabPane tabId="1">
                                <Form>

                                    <div className="row align-items-center">
                                        <div className="col-md-4">
                                            <div className="mb-3">
                                                <Label className="form-label" htmlFor="formrow-facility-input">Company</Label>
                                                <Input type="text" value={selectedItem?.companyID?.name} className="form-control" id="formrow-room-input" readOnly />
                                            </div>
                                        </div>
                                        <div className="col-md-4">
                                            <div className="mb-3">
                                                <Label className="form-label" htmlFor="formrow-facility-input">Status</Label>

                                                <Input type="text" value={selectedItem.status} className="form-control" id="formrow-room-input" readOnly />
                                            </div>
                                        </div>

                                        <div className="col-md-4">
                                            <div className="mb-3">
                                                <Label className="form-Label">Property Name</Label>
                                                <Input type="text" value={selectedItem.property} className="form-control" id="formrow-room-input" readOnly />
                                            </div>
                                        </div>
                                        <div className="col-md-4">
                                            <div className="mb-3">
                                                <Label className="form-Label">Suite</Label>
                                                <Input type="text" value={selectedItem.suite} className="form-control" id="formrow-room-input" readOnly />
                                            </div>
                                        </div>

                                        <div className="col-md-4">
                                            <div className="mb-3">
                                                <Label className="form-label" htmlFor="formrow-room-input">requestType</Label>
                                                <Input type="text" value={selectedItem.requestType} className="form-control" id="formrow-room-input" readOnly />
                                            </div>
                                        </div>
                                        <div className="col-md-4">
                                            <div className="mb-3">
                                                <Label className="form-label" htmlFor="formrow-phone-input">Phone</Label>
                                                <Input type="text" value={selectedItem.phone} className="form-control" id="formrow-room-input" readOnly />
                                            </div>
                                        </div>
                                        <div className="col-md-4">
                                            <div className="mb-3">
                                                <Label className="form-label" htmlFor="formrow-email-input">Email</Label>
                                                <Input type="text" value={selectedItem.email} className="form-control" id="formrow-room-input" readOnly />
                                            </div>
                                        </div>

                                        <div className="col-md-4">
                                            <div className="mb-3">
                                                <Label className="form-label" htmlFor="formrow-email-input">Name</Label>
                                                <Input type="text" value={selectedItem.name} className="form-control" id="formrow-room-input" readOnly />
                                            </div>
                                        </div>
                                        <div className="col-md-4">
                                            <div className="mb-3">
                                                <Label className="form-label" htmlFor="formrow-phone-input">Rating</Label>
                                                <div>
                                                    <td><Rating initialValue={selectedItem.ratings} readonly={true} size={20} /></td>

                                                </div>
                                            </div>
                                        </div>
                                        {/* <div className="col-md-4">
                                            <div className="mb-3">
                                                <Label className="form-label" htmlFor="formrow-phone-input">Documents</Label>
                                                <div>
                                                    <button
                                                        type="button"
                                                        className="btn btn-soft-light btn-sm w-xs waves-effect btn-label waves-light"
                                                    >
                                                        <i className="bx bx-download label-icon"></i> Pdf
                                                    </button>
                                                </div>
                                            </div>
                                        </div> */}
                                        <div className="col-md-12">
                                            <div className="mb-3">
                                                <label
                                                    htmlFor="basicpill-address-input"
                                                    className="form-label"
                                                >
                                                    Details
                                                </label>
                                                <textarea
                                                    id="basicpill-address-input"
                                                    className="form-control"
                                                    rows="3"
                                                    readOnly
                                                    placeholder={selectedItem.details}
                                                ></textarea>
                                            </div>
                                        </div>


                                    </div>
                                </Form>
                            </TabPane>


                            <TabPane tabId="2">
                                <div className="row">
                                    {quoteError && <p style={{ color: "red" }}>{quoteError}</p>}
                                    <div className="col-md-3">
                                        <div className="mb-3">
                                            <Label className="form-Label">Estimated Amount ($)</Label>
                                            <Input type="text" value={estimatedAmount} onChange={(e) => { setestimatedAmount(e.target.value) }} className="form-control" id="formrow-room-input" />
                                        </div>
                                    </div>

                                    {/* </div> */}
                                    <div className="col-md-3">
                                        <div className="mb-3">
                                            <Label htmlFor="example-date-input" className="form-Label">Start Date</Label>
                                            <Input className="form-control" value={startDate} onChange={(e) => { setStartDate(e.target.value) }} type="date" defaultValue="2019-08-19" id="example-date-input" />
                                        </div>
                                    </div>
                                    <div className="col-md-6">
                                        <div className="mb-3">
                                            <Label htmlFor="example-time-input" className="form-Label">Start Time</Label>
                                            <Input className="form-control" value={startTime} onChange={(e) => { setStartTime(e.target.value); console.log(e.target.value) }} type="time" defaultValue="13:45:00" id="example-time-input" />
                                        </div>
                                    </div>
                                    <div className="col-md-6">
                                        <div className="mb-3">
                                            <Label htmlFor="example-date-input" className="form-Label">Estimated Completion Date</Label>
                                            <Input className="form-control" type="date" value={endDate} onChange={(e) => { setEndDate(e.target.value) }} defaultValue="2019-08-19" id="example-date-input" />
                                        </div>
                                    </div>
                                    <div className="col-md-6">
                                        <div className="mb-3">
                                            <Label htmlFor="example-time-input" className="form-Label">Estimated Completion Time</Label>
                                            <Input className="form-control" type="time" value={endTime} onChange={(e) => { setEndTime(e.target.value) }} defaultValue="13:45:00" id="example-time-input" />
                                        </div>
                                    </div>
                                    <div className="col-md-12">
                                        <div className="mb-3">
                                            <Label className="form-Label">Notes</Label>
                                            <textarea
                                                id="basicpill-address-input"
                                                className="form-control"
                                                rows="3"
                                                value={notes}
                                                onChange={(e) => { setNotes(e.target.value) }}
                                                // readOnly={role == "customer" ? true : false}
                                                placeholder=""
                                            ></textarea>
                                        </div>
                                    </div>
                                    <div className="row">
                                        <div className="col-lg-12">
                                            <div className="mb-3">
                                                {
                                                    documentError && <p style={{ color: "red" }}>{documentError}</p>
                                                }
                                                <Label className="form-label" htmlFor="formrow-firstname-input">Documents</Label>


                                                <Dropzone
                                                    onDrop={acceptedFiles =>

                                                        handleAcceptedFiles(acceptedFiles)

                                                    }
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
                                                                <h4>Drop files here or click to upload.</h4>
                                                            </div>
                                                        </div>
                                                    )}
                                                </Dropzone>
                                                <div className="dropzone-previews mt-3" id="file-previews">
                                                    {selectedFiles && selectedFiles.map((f, i) => {
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
                                                                                <strong>{f.formattedSize}</strong>
                                                                            </p>
                                                                        </Col>
                                                                        <Col className="trash-btn">
                                                                            <button type="button" className="btn btn-soft-danger waves-effect waves-light" onClick={(e) => { removeDocuments(i) }}>
                                                                                <i className="bx bx-trash-alt"></i></button>
                                                                        </Col>
                                                                    </Row>
                                                                </div>
                                                            </Card>
                                                        )
                                                    })}
                                                </div>
                                            </div>
                                        </div>
                                    </div>
                                    <div className="col-md-12 d-flex flex-wrap align-items-center justify-content-center">
                                        <button className="btn btn-primary mo-mb-2 mr-10"
                                            disabled={loading}

                                            onClick={(e) => {
                                                // confirmTicket(e)
                                                // tog_view()
                                                quoteTicket()
                                            }}
                                        >
                                            {loading && <div
                                                id="saveSpinner"
                                                style={{
                                                    height: "15px",
                                                    width: "15px",
                                                    marginLeft: "5px",
                                                }}
                                                class="spinner-border"
                                                role="status"
                                            ></div>}
                                            Confirm
                                        </button>
                                        <button className='btn btn-light' onClick={(e) => { tog_view() }}>cancel</button>

                                    </div>


                                </div>
                            </TabPane>
                        </TabContent>
                    </div>
                </Modal>


            </div>
        </React.Fragment>
    )
}
export default SpecificTickets
