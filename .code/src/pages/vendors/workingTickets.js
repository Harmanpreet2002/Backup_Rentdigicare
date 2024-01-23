import React, { useState, useEffect } from "react";
import MetaTags from 'react-meta-tags';
import { Link } from "react-router-dom"
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
    Badge

} from "reactstrap"
import axios from '../api/axios'
import moment from "moment"
import jwt_decode from "jwt-decode"
import Select from "react-select";
import { BUCKET_URL, SERVER_URL } from "../ServerLink";



//Import Breadcrumb
import Breadcrumbs from "../../components/Common/Breadcrumb"


const WorkingTickets = (props) => {


    const decode = jwt_decode(window.localStorage.getItem("accessToken"));
    const [ticketID, setticketID] = useState("")
    const [notesInput, setNotesInput] = useState("")
    const [statusModel, setStatusModel] = useState(false);
    const [filterModel, setFilterModel] = useState(false);
    const [btnsuccess1, setBtnsuccess1] = useState(false);
    const [modal_large2, setmodal_large2] = useState(false);
    const [vendor, setVendor] = useState([])
    const [getTicketError, setGetTicketError] = useState("")
    const [showNotes, setShowNotes] = useState([]);



    const [loading, setLoading] = useState(false)
    const [changeStatus, setChangeStatus] = useState("")
    const [statusValue, setStatusValue] = useState("select")
    const [selectTicketId, setSelectTicketId] = useState("")
    const [statusError, setStatusError] = useState("")
    const [showModal, setShowModal] = useState(false);
    const [confirm_Modal, setConfirm_Modal] = useState(false);
    const [Ticket_ID, setTicket_ID] = useState('')

    const openModal = () => {
        setShowModal(true);
    };

    const closeModal = () => {
        getWorkingTickets()
        setShowModal(false);
    }


    const [propertyID, setPropertyID] = useState("")
    const [priority, setPriority] = useState("")
    const [pageNumber, setPageNumber] = useState(1)
    const [totalTickets, setTotalTickets] = useState(0)
    const [propertyList, setPropertyList] = useState([])
    const [property, setProperty] = useState("")
    const [ticketData, setTicketData] = useState({})

    const [filterFromDate, setFilterFromDate] = useState();
    const [filterToDate, setFilterToDate] = useState();
    const [filterStatus, setFilterStatus] = useState("");
    const [requestTypes, setRequestTypes] = useState([])
    const [requestTypeFilter, setRequestTypeFilter] = useState({ label: "", value: "" });
    const [ticketIDs, setTicketIDs] = useState([])
    const [filterID, setFiletrID] = useState("")
    const [notesCount, setNotesCount] = useState([]);

    function removeBodyCss() {
        document.body.classList.add("no_padding")
    }
    const GET_WORKING_TICKET = `/ticket/ongoing-tickets`
    const CHANGE_STATUS = "/ticket/update_status"
    const GET_VENDOR_SPECIALITY = "/vendorspeciality/get_speciality"
    const NOTES = "ticket/add_notes"
    const GET_NOTES = "ticket/get_notes"
    const PDF_DOWNLOAD_URL = "/ticket/view_ticket_documents";
    const REASSIGN_TICKET = '/ticket/vendor_reassign'

    function confirm_view() {
        setConfirm_Modal(!confirm_Modal)
        removeBodyCss()
    }

    function tog_view() {
        setStatusModel(!statusModel)
        removeBodyCss()
    }

    function tog_filter_model() {
        setFilterModel(!filterModel)
        removeBodyCss()
    }

    const [col5, setcol5] = useState(false)
    function tog_large2(item) {
        setTicketData(item)
        setmodal_large2(!modal_large2)
        removeBodyCss()
    }
    const getWorkingTickets = async (pgNum, type) => {
        try {
            let response;
            if (type == "clear") {
                let query = {
                    vendorId: decode.id
                }
                response = await axios.post(GET_WORKING_TICKET, query)
            } else {
                let query = {
                    pageNumber: pageNumber,
                    startDate: filterFromDate,
                    endDate: filterToDate,
                    status: filterStatus,
                    propertyID: propertyID,
                    filterID: filterID.value,
                    requestType: requestTypeFilter.value,
                    vendorId: decode.id
                };
                response = await axios.post(GET_WORKING_TICKET, query)
            }


            console.log("response", response)

            if (response.data?.status == 200) {
                setVendor(response?.data?.tickets)
                setTotalTickets(response.data.totalCount)
                setPropertyList(response.data.propertyList)
                setRequestTypes(response.data.requestTypes)
                setTicketIDs(response?.data?.tickets.map((t) => t._id))
                setNotesCount(response?.data?.notesCount)
                if (type == "next") setPageNumber(pageNumber + 1)
                if (type == "previous") setPageNumber(pageNumber - 1)
                if (type == "search") setPageNumber(pgNum)

            } else {
                setGetTicketError(response.data?.errorMessage || "Something went wrong")
            }

        } catch (error) {
            setGetTicketError("Something went wrong")

            console.log(error) // TODO proper error
        }
    }

    const handlePrint = (data) => {
        const printContent = `
        <div class="print-template">
          <table style="border-collapse: collapse; width: 100%;">
            <tr>
              <td colspan="2" style="text-align: center; padding: 10px; border: 1px solid #ccc;">
                <h2>Ticket Details</h2>
                <p>ID : ${data._id.substring(data._id.length - 6)}</p>
              </td>
            </tr>
            <tr>
              <td style="padding: 10px; border: 1px solid #ccc;">Property Name:</td>
              <td style="padding: 10px; border: 1px solid #ccc;">${data.property}</td>
            </tr>
            <tr>
              <td style="padding: 10px; border: 1px solid #ccc;">Company Name:</td>
              <td style="padding: 10px; border: 1px solid #ccc;">${data.companyDomain}</td>
            </tr>
            <tr>
              <td style="padding: 10px; border: 1px solid #ccc;">Name:</td>
              <td style="padding: 10px; border: 1px solid #ccc;">${data.name}</td>
            </tr>
            <tr>
              <td style="padding: 10px; border: 1px solid #ccc;">Email:</td>
              <td style="padding: 10px; border: 1px solid #ccc;">${data.email}</td>
            </tr>
            <tr>
              <td style="padding: 10px; border: 1px solid #ccc;">Phone:</td>
              <td style="padding: 10px; border: 1px solid #ccc;">${data.phone}</td>
            </tr>
            <tr>
              <td style="padding: 10px; border: 1px solid #ccc;">Suite:</td>
              <td style="padding: 10px; border: 1px solid #ccc;">${data.suite}</td>
            </tr>
            <tr>
              <td style="padding: 10px; border: 1px solid #ccc;">Request Type:</td>
              <td style="padding: 10px; border: 1px solid #ccc;">${data.requestType}</td>
            </tr>
            <tr>
              <td style="padding: 10px; border: 1px solid #ccc;">Details:</td>
              <td style="padding: 10px; border: 1px solid #ccc;">${data.details}</td>
            </tr>
          <tr>
              <td style="padding: 10px; border: 1px solid #ccc;">Status :</td>
              <td style="padding: 10px; border: 1px solid #ccc;">${data.status}</td>
            </tr>
          </table>
        </div>
    `;
        const printWindow = window.open("", "_blank");
        printWindow.document.write(`
      <html>
        <head>
          <title>Ticket Details</title>
        </head>
        <body>${printContent}</body>
      </html>
    `);
        printWindow.document.close();
        printWindow.print();
    }
    const ChangeStatus = async () => {

        if (!statusValue || statusValue == "select") {
            return setStatusError("Please enter the status")
        }
        setLoading(true)
        try {
            const response = await axios.post(CHANGE_STATUS, { ticketID: selectTicketId, status: statusValue });
            setLoading(false)
            if (response.data.success) {
                getWorkingTickets(1)
                tog_view()
            }
        } catch (error) {
            // TODO proper message
            console.log("Unable to fetch")
            setLoading(false)
        }

    }
    const FilterSearch = async (speciality, name, agency, email) => {
        console.log(name, email, agency, speciality)
        try {
            const response = await axios.post("/vendor/filter", {
                first_name: name,

                agency_name: agency,

                email: email,

                specialties: [speciality]
            });
            console.log(response, "hello")
            if (response.data.success) {
                // getVendor()
            }
        } catch (error) {
            // TODO proper message
            console.log("Unable to fetch")
        }
    }


    const getProperties = async () => {
        try {
            const response = await axios.get("/property/getproperties");

            console.log(response)

            setPropertyList(response.data.properties)
        } catch (error) {
            // setportalTikets("Something went wrong")

            console.log(error) // TODO proper error
        }

    }

    const clearFunc = () => {
        setPropertyID("")
        setProperty("")
        setPriority("")
        setPageNumber(1)
        setFiletrID('')
        setRequestTypeFilter('')
        setFilterStatus('')
        setFilterToDate('')
        setFilterToDate('')
        getWorkingTickets(1, "clear")


    }

    const sendNotes = async (ticketId) => {
        // alert(ticketID)
        if (notesInput.length > 0) {
            try {
                const payload = {
                    user: decode.role,
                    id: decode.id,
                    notes: notesInput,
                    ticketId,
                    name: decode.firstname
                }
                console.log(payload, 'payload')
                const response = await axios.post(NOTES, payload);


                if (response.status === 200) {
                    setNotesInput("")
                    getNotes(ticketID)
                }
            }
            catch { }
        }
        else {
            return
        }

    }

    const getNotes = async (ticketID) => {
        setShowNotes([])
        setticketID(ticketID)
        const payload = {
            id: decode.id,
            user: decode.role,
            ticketId: ticketID
        }
        console.log(payload, 'payloadfdfdf')
        const response = await axios.post(GET_NOTES, payload)
        if (response.data.status === 200) {
            console.log(response.data.notes, 'nptoes')
            setShowNotes(response.data.notes)
        }
    }


    // const getVendorTickets = async (type) => {
    //     if (type == "Search") {
    //         let query = {
    //             pageNumber: pageNumber,
    //             startDate: filterFromDate,
    //             endDate: filterToDate,
    //             status: filterStatus,
    //             propertyID: propertyID,
    //             // propertyManagerID: filterPropertyManager,
    //             requestType: requestTypeFilter.value,
    //             vendorId: decode.id
    //         };

    //         let response = await axios.post(`/ticket/filter_tickets_vendor`, query)
    //         console.log(response);
    //         if (response.status == 200) {
    //             setPropertyList(response.data.propertyList)
    //             setRequestTypes(response.data.requestTypes)
    //             setportalTikets(response.data.tickets)
    //             setTotalTickets(response.data.totalCount)
    //         }

    //     }
    // }

    useEffect(() => {
        // dispatch(onGetInvoices());
        getWorkingTickets(1)
        // getProperties()
        // getVendorSpeciality()

    }, []);

    const reAssignTicket = async (ticketId) => {
        setLoading(true)
        try {
            let body = {
                ticketId,
                vendorId: decode.id
            }
            let response = await axios.post(REASSIGN_TICKET, body)
            if (response.data.success) {
                setLoading(false)
                confirm_view()
                getWorkingTickets(1)
            }
        } catch (err) {

        }
    }

    return (
        <React.Fragment>
            <div className="page-content">
                <MetaTags>
                    <title>Rentdigicare | Working Maintenance Request</title>
                </MetaTags>
                <div className="container-fluid">
                    <Breadcrumbs title="Home" breadcrumbItem="Working Maintenance Request" />
                    <Row>
                        <Col xl={12}>
                            <Card>
                                <CardHeader>
                                    <div className="row">
                                        <div className="col-md-6">
                                            <div className="mb">
                                                <h5 className="card-title">Working Maintenance Request <span className="text-muted fw-normal ms-2">({vendor.length})</span></h5>
                                            </div>
                                        </div>
                                        <div className="col-md-6 d-flex flex-wrap align-items-center justify-content-end">
                                            <div className="mb d-flex flex-wrap">
                                                <button
                                                    onClick={tog_filter_model}
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

                                        </div>
                                    </div>

                                    <div className="row">
                                        <div className="col-lg-12">
                                            <Collapse className="mt-4" isOpen={filterModel}>
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
                                                                                    // const propertyData = JSON.parse(e.target.value)
                                                                                    setPropertyID(e.value)
                                                                                    setProperty(e)
                                                                                    // console.log(propertyData)
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


                                                                    <div className="col-md-2 text-end">
                                                                        <button type="submit" className="btn btn-primary" onClick={(e) => { e.preventDefault(); getWorkingTickets() }}>Search</button>
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
                                                    <th scope="col">Company</th>
                                                    <th scope="col">Property</th>
                                                    <th scope="col">Suite</th>
                                                    <th scope="col">Details</th>
                                                    <th scope="col">Priority</th>
                                                    <th scope="col">From</th>
                                                    <th scope="col">To</th>
                                                    <th scope="col">Status</th>
                                                    <th scope="col">Action</th>

                                                </tr> */}
                                                <tr>
                                                    <th scope="col">#</th>
                                                    <th scope="col">ID</th>
                                                    <th scope="col">Request Type</th>
                                                    <th scope="col">Property</th>
                                                    <th scope="col">Submited By</th>
                                                    <th scope="col">Created</th>
                                                    <th scope="col">Age</th>
                                                    <th scope="col">Status</th>
                                                    <th scope="col">Download</th>
                                                    <th scope="col">Action</th>
                                                    <th scope="col">Reassign</th>
                                                    <th scope="col">View</th>
                                                    <th scope="col">Memo</th>


                                                </tr>
                                            </thead>

                                            {vendor?.map((item, i) => {
                                                return (

                                                    <tbody>

                                                        <tr key={item._id}>
                                                            <td>{i + 1}</td>
                                                            <td>{item._id.substring(item._id.length - 6)}</td>
                                                            <td>{item.requestType}</td>
                                                            <td>{item.property}</td>
                                                            <td>{item.name}<br></br>{item.email}<br></br>{item.suite}</td>
                                                            <td>{moment(item.createdAt).format("DD-MM-YY")}</td>
                                                            <td>{moment(item.createdAt).fromNow()}</td>
                                                            <td className="text-capitalize text-center">
                                                                <button className={`btn ${item.status === 'Completed' ? 'btn-success' : item.status === 'Inprogress' ? 'btn-warning' : item.status === 'Unresolved' ? 'btn-danger' : 'btn-primary'}`}>
                                                                    {item.status}
                                                                </button>
                                                            </td>
                                                            <td>
                                                                <div>
                                                                    {console.log("Documents:", item.documents)}
                                                                    {item?.documents?.length > 0 && item?.documents[0]?.includes(BUCKET_URL) ? (
                                                                        <button
                                                                            onClick={async () => {
                                                                                item.documents.map((file) => {
                                                                                    window.location.href = file
                                                                                })
                                                                            }}
                                                                            type="button"
                                                                            className="btn btn-soft-light btn-sm w-xs waves-effect "
                                                                        >
                                                                            <i className="bx bx-download label-icon"></i>
                                                                        </button>
                                                                    ) : item?.documents?.length > 0 && !item?.documents[0]?.includes(BUCKET_URL) ? (
                                                                        <button
                                                                            onClick={async () => {
                                                                                const response = await axios.post(PDF_DOWNLOAD_URL, {
                                                                                    id: item._id,
                                                                                });

                                                                                for (let i = 0; i < response.data.documents.length; i++) {
                                                                                    const url = `${SERVER_URL}${response.data.documents[i]}`;
                                                                                    const filePath = response.data.documents[i];
                                                                                    const extension = filePath.substring(filePath.lastIndexOf('.') + 1)
                                                                                    console.log(extension);
                                                                                    console.log(url);
                                                                                    fetch(url, {
                                                                                        method: "GET",
                                                                                        headers: {},
                                                                                    })
                                                                                        .then((response) => {
                                                                                            response.arrayBuffer().then(function (buffer) {
                                                                                                const url = window.URL.createObjectURL(
                                                                                                    new Blob([buffer])
                                                                                                );
                                                                                                const link = document.createElement("a");
                                                                                                link.href = url;
                                                                                                link.setAttribute("download", `ticket.${extension}`); //or any other extension
                                                                                                document.body.appendChild(link);
                                                                                                link.click();
                                                                                            });
                                                                                        })
                                                                                        .catch((err) => {
                                                                                            console.log(err);
                                                                                        });
                                                                                } }}
                                                                                type="button"
                                                                                className="btn btn-soft-light btn-sm w-xs waves-effect "
                                                                              >
                                                                                <i className="bx bx-download label-icon"></i>
                                                                              </button>
                                                                    ) :
                                                                        (
                                                                            <div className="d-flex flex-wrap align-items-center justify-content-center">
                                                                                NA
                                                                            </div>
                                                                        )}
                                                                </div>
                                                            </td>
                                                            <td className="text-center">
                                                                {
                                                                    item.status !== "Completed" ?
                                                                        (
                                                                            <button
                                                                                onClick={() => { tog_view(); setStatusValue(item.status); setSelectTicketId(item._id) }}
                                                                                className="btn btn-primary mo-mb-2 mr-10"
                                                                                type="button"
                                                                                style={{ cursor: "pointer" }}
                                                                            >
                                                                                Change Status
                                                                            </button>
                                                                        ) :
                                                                        (
                                                                            <p className="fw-bold text-danger">NA</p>
                                                                        )
                                                                }
                                                            </td>
                                                            <td className="text-capitalize">
                                                                <button className="btn btn-danger btn-sm" onClick={() => { confirm_view(); setTicket_ID(item._id) }}>
                                                                    Reassign
                                                                </button>
                                                            </td>
                                                            <td className="text-capitalize" ><button className="btn btn-outline-info btn-sm" onClick={() => {
                                                                tog_large2(item)
                                                            }}>
                                                                View
                                                            </button></td>
                                                            <td className="text-capitalize" >
                                                                <div style={{ position: "relative" }}>
                                                                    {
                                                                        notesCount[item._id] ?
                                                                            (
                                                                                <Badge style={{ background: "#fd625e", position: "absolute", right: 0, top: "-7px" }}>{notesCount[item._id]}</Badge>
                                                                            ) : ''
                                                                    }
                                                                    <button className="btn btn-outline-info btn-sm"
                                                                        // onClick={openModal}
                                                                        onClick={() => {
                                                                            getNotes(item._id)
                                                                            openModal()

                                                                        }}
                                                                    >
                                                                        Memo
                                                                    </button>
                                                                </div>
                                                            </td>

                                                        </tr>




                                                    </tbody>
                                                )
                                            })}
                                        </Table>
                                        <Modal
                                            size="md"
                                            // isOpen={showlogs?.value}
                                            // toggle={() => {
                                            //   setShowLogs((prev) => ({ ...prev, data: [], value: false }));
                                            // }}
                                            isOpen={showModal}
                                            toggle={closeModal}
                                        >
                                            <div className="modal-header">
                                                <h5 className="modal-title mt-0" id="myLargeModalLabel">
                                                    Notes
                                                </h5>
                                                <button
                                                    onClick={closeModal}
                                                    type="button"
                                                    className="close"
                                                    data-dismiss="modal"
                                                    aria-label="Close"
                                                >
                                                    <span aria-hidden="true">&times;</span>
                                                </button>
                                            </div>
                                            <div className="modal-body">
                                                <div
                                                    className=" d-flex flex-column ml-2 " style={{ overflow: "auto", maxHeight: '70vh' }}>
                                                    <Card className="mb-2 w-100 w-fit-content border-0">
                                                        <CardBody className="p-0 border-0">
                                                            {showNotes?.map((log, i) => (
                                                                <div key={log?._id} className="chatBox mb-2 pt-1">
                                                                    <div className="d-flex justify-content-between align-items-center ">
                                                                        {/* {log.user} */}
                                                                        <h5 className="">{log?.userName}</h5>
                                                                        <div>
                                                                            <div className="rounded-pill px-1  bg-primary text-white text-center">{log?.user}</div>
                                                                            <small className="text-muted mx-2 " style={{ fontStyle: "italic" }}>
                                                                                {moment(log?.createdAt).calendar()}
                                                                            </small>
                                                                        </div>
                                                                    </div>

                                                                    {/* <div className={`${i + 1 !== showlogs?.data?.length ? "line h-100" : ""}`}></div> */}

                                                                    <div className="">
                                                                        <p className="lead mb-0 p-0">
                                                                            <span className="text-black mx-2">
                                                                                <strong>
                                                                                    {log?.note}
                                                                                </strong>
                                                                            </span>
                                                                            {/* {log?.action}.{" "}kjk kjk */}

                                                                        </p>
                                                                    </div>
                                                                </div>
                                                            ))}
                                                        </CardBody>
                                                    </Card>

                                                </div>
                                                <div className=" d-flex flex  ml-2">
                                                    <div className="divider"></div>
                                                    <input className="w-100 me-2 px-2" onChange={(event) => { setNotesInput(event.target.value) }} value={notesInput} type="text"></input>
                                                    <button
                                                        onClick={() => sendNotes(ticketID)}
                                                        className="btn btn-primary btn-m ml-15"
                                                    >Send</button>
                                                </div>
                                            </div>
                                        </Modal>


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
                                                    View Ticket Details
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
                                                                <Label className="form-label" htmlFor="formrow-name-input">Company Name</Label>
                                                                <Input type="text" className="form-control" value={ticketData?.companyDomain} id="formrow-name-input" readonly />
                                                            </div>
                                                        </div>
                                                        <div className="col-md-6">
                                                            <div className="mb-3">
                                                                <Label className="form-label" htmlFor="formrow-code-input">Status</Label>
                                                                <Input type="text" className="form-control" value={ticketData?.status} id="formrow-code-input" readonly />
                                                            </div>
                                                        </div>
                                                        <div className="col-md-6">
                                                            <div className="mb-3">
                                                                <Label className="form-Label">Property Name</Label>
                                                                <Input type="text" className="form-control" value={ticketData?.property} id="formrow-cat-input" readonly />
                                                            </div>
                                                        </div>
                                                        <div className="col-md-6">
                                                            <div className="mb-3">
                                                                <Label className="form-Label">Suite</Label>
                                                                <Input type="text" className="form-control" value={ticketData?.suite} id="formrow-stat-input" readonly />
                                                            </div>
                                                        </div>
                                                        <div className="col-md-6">
                                                            <div className="mb-3">
                                                                <Label className="form-Label">Request Type</Label>
                                                                <Input type="text" className="form-control" value={ticketData?.requestType} id="formrow-stat-input" readonly />
                                                            </div>
                                                        </div>
                                                        <div className="col-md-12">
                                                            <Card>
                                                                <CardBody>
                                                                    <h4 className="card-title mb-4">Details</h4>
                                                                    <div className="row">
                                                                        <div className="col-md-6">
                                                                            <div className="mb-3">
                                                                                <Label className="form-label" htmlFor="formrow-address-input">Name</Label>
                                                                                <Input type="text" className="form-control" value={ticketData?.name} id="formrow-address-input" readonly />
                                                                            </div>
                                                                        </div>
                                                                        <div className="col-md-6">
                                                                            <div className="mb-3">
                                                                                <Label className="form-label" htmlFor="formrow-address-input">Email</Label>
                                                                                <Input type="text" className="form-control" value={ticketData?.email} id="formrow-address-input" readonly />
                                                                            </div>
                                                                        </div>
                                                                        <div className="col-md-6">
                                                                            <div className="mb-3">
                                                                                <Label className="form-label" htmlFor="formrow-city-input">Phone</Label>
                                                                                <Input type="text" className="form-control" value={ticketData?.phone} id="formrow-city-input" readonly />
                                                                            </div>
                                                                        </div>
                                                                        <div className="col-md-6">
                                                                            <div className="mb-3">
                                                                                <Label className="form-label" htmlFor="formrow-state-input">Details</Label>
                                                                                <textarea
                                                                                    id="basicpill-address-input"
                                                                                    className="form-control"
                                                                                    rows="3"
                                                                                    readOnly
                                                                                    value={ticketData?.details}
                                                                                ></textarea>
                                                                            </div>
                                                                        </div>
                                                                        {/* <div className="col-md-6">
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
                                                                                        </div> */}
                                                                    </div>
                                                                </CardBody>
                                                            </Card>
                                                        </div>
                                                    </div>
                                                </Form>
                                                <div className="d-flex justify-content-end">
                                                    <div className="mb-3">
                                                        <button className="btn btn-primary" onClick={() => handlePrint(ticketData)} >
                                                            Print
                                                        </button>
                                                    </div>
                                                </div>
                                            </div>
                                        </Modal>
                                    </div>
                                    <Row className="proress-style mt-3">
                                        <Col xl={3}>
                                        </Col>
                                        <Col xl={9}>
                                            <div className="pagination-bar">
                                                <Pagination aria-label="Page navigation example">
                                                    <PaginationItem disabled={pageNumber == 1}>
                                                        <PaginationLink onClick={(e) => { e.preventDefault(); getWorkingTickets(pageNumber - 1, "previous") }} tabIndex="-1">
                                                            Previous
                                                        </PaginationLink>
                                                    </PaginationItem>

                                                    <PaginationItem active>
                                                        <PaginationLink href="#">
                                                            {pageNumber} <span className="sr-only">(current)</span>
                                                        </PaginationLink>
                                                    </PaginationItem>
                                                    <PaginationItem disabled={(Math.ceil(totalTickets / 10)) == pageNumber || (Math.ceil(totalTickets / 10)) == 0}>
                                                        <PaginationLink onClick={(e) => { e.preventDefault(); getWorkingTickets(pageNumber + 1, "next") }}>Next</PaginationLink>
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
            </div >
            <Modal
                size="md"
                isOpen={statusModel}
                toggle={() => {
                    tog_view()
                }}
            >
                <div className="modal-header">
                    <h5
                        className="modal-title mt-0"
                        id="myLargeModalLabel"
                    >
                        Change Status
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

                    <div className="col-md-12">
                        <div className="mb-4">
                            {statusError && <p style={{ color: "red" }}>{statusError}</p>}

                            <Label className="form-Label mb-3">Status</Label>
                            <select className="form-select" value={statusValue} onChange={(e) => { setStatusValue(e.target.value) }}>
                                <option value="select">Select One</option>
                                <option value="Inprogress">Inprogress</option>
                                <option value="Completed">Completed</option>
                            </select>
                        </div>
                    </div>
                    <div className="col-md-12 d-flex flex-wrap align-items-center justify-content-center">
                        <button className="btn btn-primary mo-mb-2 mr-10"
                            disabled={loading}

                            onClick={(e) => {
                                //addSpeciality(e)
                                // tog_rating_view()
                                ChangeStatus()
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
                            Submit</button>
                        <button className='btn btn-light' onClick={(e) => { tog_view() }}>Cancel</button>
                        <br />
                    </div>
                </div>

            </Modal>
            <Modal
                size="md"
                isOpen={confirm_Modal}
                toggle={() => {
                    confirm_view()
                }}
            >
                <div className="modal-header">
                    <h5
                        className="modal-title mt-0"
                        id="myLargeModalLabel"
                    >
                        Reassign Confirm
                    </h5>
                    <button
                        onClick={() => {
                            confirm_view()
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

                    <div className="col-md-12">
                        <div className="mb-4">
                            <p>Are You Sure ?</p>
                        </div>
                    </div>
                    <div className="col-md-12 d-flex flex-wrap align-items-center justify-content-center">
                        <button className="btn btn-success mo-mb-2 mr-10"
                            disabled={loading}

                            onClick={(e) => {
                                //addSpeciality(e)
                                // tog_rating_view()
                                reAssignTicket(Ticket_ID)
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
                            Yes</button>
                        <button className='btn btn-danger' onClick={(e) => { confirm_view() }}>No</button>
                        <br />
                    </div>
                </div>

            </Modal>
        </React.Fragment >
    )
}
export default WorkingTickets
