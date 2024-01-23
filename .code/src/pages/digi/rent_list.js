import React, { useState, useEffect } from "react";
import MetaTags from 'react-meta-tags';
import { Link } from "react-router-dom"
import { SERVER_URL } from "../ServerLink";
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
    Form

} from "reactstrap"
import axios from '../api/axios'
import moment from "moment"

//Import Breadcrumb
import Breadcrumbs from "../../components/Common/Breadcrumb"



const RentList = (props) => {

    console.log("props", SERVER_URL)

    const [modal_large, setmodal_large] = useState(false);
    const [btnsuccess1, setBtnsuccess1] = useState(false);
    const [modal_large2, setmodal_large2] = useState(false);
    const [vendor, setVendor] = useState([])
    const [loading, setLoading] = useState(false)
    const [documents, setDocuments] = useState([])
    const [openDocumentModel, setOpenDocumentModel] = useState(false)


    const [vendorError, setVendorError] = useState("")
    const [vendorspeciality, setVendorSpeciality] = useState([])
    const [name, setName] = useState("")
    const [speciality, setSpeciality] = useState("")
    const [agency, setAgency] = useState("")
    const [email, setEmail] = useState("")
    function removeBodyCss() {
        document.body.classList.add("no_padding")
    }
    const GET_QUOTE_TICKET = `/property/get_payment_status`
    const UPDATE_PAYMENT_STATUS = "/property/update_payment_status"
    const GET_VENDOR_SPECIALITY = "/vendorspeciality/get_speciality"
    const VIEW_DOCUMENTS = "/ticket/view_documents"


    function tog_large() {
        setmodal_large(!modal_large)
        removeBodyCss()
    }

    const [col5, setcol5] = useState(false)
    const t_col5 = () => {
        setcol5(!col5)
    }
    function tog_large2() {
        setmodal_large2(!modal_large2)
        removeBodyCss()
    }
    const getQuotedTicket = async (e) => {
        try {
            const response = await axios.post(GET_QUOTE_TICKET, { propertyID: props.match.params.propertyId })

            console.log("response", response)

            if (response.data?.success) {
                setVendor(response?.data?.transactions)
            } else {
                setVendorError(response.data?.errorMessage)
            }

        } catch (error) {
            setVendorError("Something went wrong")

            console.log(error) // TODO proper error
        }
    }
    const getVendorSpeciality = async (e) => {
        try {
            const response = await axios.get(GET_VENDOR_SPECIALITY)
            console.log("speciality", response)

            if (response.data?.success) {
                setVendorSpeciality(response.data.specialties)

            } else {
                setVendorError(response.data?.errorMessage)
            }

        }
        catch (error) {
            setVendorError("Something went wrong")

            console.log(error) // TODO proper error
        }
    }
    const Approve = async (transactionId) => {
        setLoading(true)
        try {
            const response = await axios.post(UPDATE_PAYMENT_STATUS, { transactionId: transactionId, payment_status: "paid" });
            setLoading(false)
            if (response.data.success) {
                getQuotedTicket()
            }
        } catch (error) {
            // TODO proper message
            console.log("Unable to fetch")
            setLoading(false)
        }

    }

    const toggleDocumentModel = () => {
        setOpenDocumentModel(!openDocumentModel)
    }

    const viewDocuments = async (id, i) => {

        try {

            const response = await axios.post(VIEW_DOCUMENTS, { quote_id: id });

            if (response.data.success) {
                setDocuments(response.data.documents)
                toggleDocumentModel()
            }
            console.log(response.data)

        } catch (e) {

        }

    }


    const download = e => {
        console.log(e.target.href);
        fetch(e.target.href, {
            method: "GET",
            headers: {}
        })
            .then(response => {
                response.arrayBuffer().then(function (buffer) {
                    const url = window.URL.createObjectURL(new Blob([buffer]));
                    const link = document.createElement("a");
                    link.href = url;
                    link.setAttribute("download", "image.png"); //or any other extension
                    document.body.appendChild(link);
                    link.click();
                });
            })
            .catch(err => {
                console.log(err);
            });
    };


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

    useEffect(() => {
        // dispatch(onGetInvoices());
        getQuotedTicket()
        // getVendorSpeciality()
    }, []);



    return (
        <React.Fragment>
            <div className="page-content">
                <MetaTags>
                    <title>Rentdigicare | Rent Details</title>
                </MetaTags>
                <div className="container-fluid">
                    <Breadcrumbs title="Home" breadcrumbItem="Rent Details" />
                    <Row>
                        <Col xl={12}>
                            <Card>
                                <CardHeader>
                                    <div className="row">
                                        <div className="col-md-6">
                                            <div className="mb">
                                                <h5 className="card-title">Rent Details</h5>
                                            </div>
                                        </div>

                                    </div>
                                    <div className="row">
                                        <div className="col-lg-12">
                                        </div>
                                    </div>
                                </CardHeader>
                                <CardBody>
                                    <div className="table-responsive">
                                        <Table className="table-striped table-bordered mb-0">
                                            <thead>
                                                <tr>
                                                    <th scope="col">#</th>
                                                    <th scope="col">Bill Date</th>
                                                    <th scope="col">Payment Status</th>

                                                    <th scope="col">Amount</th>

                                                    <th scope="col">Action</th>

                                                </tr>
                                            </thead>
                                            {console.log(vendor)}

                                            {vendor.map((item, i) => {
                                                return (

                                                    <tbody>
                                                        <tr>
                                                            <td>{i + 1}</td>
                                                            <td>
                                                                {moment(item.createdAt).format("YYYY-MM-DD")}

                                                            </td>
                                                            {/* <td>18</td> */}
                                                            <td>{item.payment_status}</td>
                                                            <td>{item.amount}</td>


                                                            <td>{loading ? <button className="btn btn-primary w-100"><div
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
                                                                item.payment_status == "paid" ?

                                                                    <div style={{ color: "green" }}>Paid</div>
                                                                    : <button
                                                                        disabled={loading}

                                                                        onClick={() => { Approve(item._id) }}
                                                                        className="btn btn-primary mo-mb-2 mr-10"
                                                                        type="button"
                                                                        style={{ cursor: "pointer" }}
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
                                                                        Paid
                                                                    </button>}</td>

                                                        </tr>

                                                    </tbody>
                                                )
                                            })}
                                        </Table>
                                    </div>

                                    <Modal
                                        size="lg"
                                        isOpen={openDocumentModel}
                                        toggle={() => {
                                            // tog_large2()
                                            toggleDocumentModel()
                                        }}
                                    >
                                        <div className="modal-header">
                                            <h5
                                                className="modal-title mt-0"
                                                id="myLargeModalLabel"
                                            >
                                                Documents
                                            </h5>
                                            <button
                                                onClick={() => {
                                                    toggleDocumentModel()
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
                                            <div className="row">

                                                <div className="col-md-6">

                                                    <br />
                                                    <div className="row">
                                                        {documents.map((item) => {
                                                            return (
                                                                <div className="col-md-3" style={{ marginLeft: "10px" }}>
                                                                    <div className="mb-3">

                                                                        <img src={`${SERVER_URL}/${item}`} width="300" height={"200"} />
                                                                    </div>
                                                                    <a
                                                                        href={`${SERVER_URL}/${item}`}
                                                                        download
                                                                        className="btn btn-primary"
                                                                        style={{ width: "150px" }}
                                                                        onClick={e => download(e)}
                                                                    >
                                                                        <i className="fa fa-download" />
                                                                        {"  download"}
                                                                    </a>
                                                                </div>
                                                            )
                                                        })}
                                                    </div>



                                                </div>


                                            </div>


                                        </div>
                                    </Modal>

                                    {/* <Row className="proress-style mt-3">
                                        <Col xl={3}>
                                        </Col>
                                        <Col xl={9}>
                                            <div className="pagination-bar">
                                                <Pagination aria-label="Page navigation example">
                                                    <PaginationItem disabled>
                                                        <PaginationLink href="#" tabIndex="-1">
                                                            Previous
                                                        </PaginationLink>
                                                    </PaginationItem>
                                                    <PaginationItem>
                                                        <PaginationLink href="#">1</PaginationLink>
                                                    </PaginationItem>
                                                    <PaginationItem active>
                                                        <PaginationLink href="#">
                                                            2 <span className="sr-only">(current)</span>
                                                        </PaginationLink>
                                                    </PaginationItem>
                                                    <PaginationItem>
                                                        <PaginationLink href="#">3</PaginationLink>
                                                    </PaginationItem>
                                                    <PaginationItem>
                                                        <PaginationLink href="#">Next</PaginationLink>
                                                    </PaginationItem>
                                                </Pagination>
                                            </div>
                                        </Col>
                                    </Row> */}
                                </CardBody>
                            </Card>
                        </Col>
                    </Row>
                </div>
            </div >
        </React.Fragment >
    )
}
export default RentList
