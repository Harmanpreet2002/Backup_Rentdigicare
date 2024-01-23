import React, { useEffect, useState } from "react";
import MetaTags from 'react-meta-tags';
import Select from "react-select";

import { Link, useHistory } from "react-router-dom"
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
    Nav,
    NavItem,
    NavLink,
    TabContent,
    TabPane,
    Pagination,
    PaginationItem,
    Collapse,
    PaginationLink,
    Input
} from "reactstrap"


import Breadcrumbs from "../../components/Common/Breadcrumb"
import classnames from "classnames"
import jwt_decode from "jwt-decode"
import axios from '../api/axios'

const TransactionsList = () => {

    const decode = jwt_decode(window.localStorage.getItem("accessToken"));

    const GET_TICKETS = "/payment/get-transactions"
    const PAY_URL = "/payment/pay"


    const [transactions, setTransaction] = useState([])
    const [transactionsTotal, setTransactionsTotal] = useState(0)

    const getTransactions = async () => {
        try {
            const response = await axios.post(GET_TICKETS, {
                sender_id: decode.id,

            })

            if (response.data.status == 200) {

                setTransaction(response.data.transactions)
                setTransactionsTotal(response.data.total)
            }
        } catch (error) {
            console.log(error) // TODO proper error
        }
    }

    const payRent = async () => {
        try {
            const response = await axios.post(PAY_URL, {
                userId: decode.id,
                propertyID: decode.properties[0]

            })

            if (response.data.status == 200) {
                console.log("response", response.data.checkout)

                window.location.href = response.data.checkout.url

            }
        } catch (error) {
            console.log(error) // TODO proper error
        }
    }

    useEffect(() => {
        getTransactions()
    }, [])

    return (
        <React.Fragment>
            <div className="page-content">
                <MetaTags>
                    <title>Rentdigicare | Transactions</title>
                </MetaTags>
                <div className="container-fluid">
                    <Breadcrumbs title="Home" breadcrumbItem="Transactions" />
                    <Row>
                        <Col xl={12}>
                            <Card>

                                <CardHeader>
                                    <div className="row align-items-center">
                                        <div className="col-md-6">
                                            <div className="mb">
                                                <h5 className="card-title">Transactions<span className="text-muted fw-normal ms-2">({transactionsTotal})</span></h5>
                                            </div>
                                        </div>
                                        <div className="col-md-6 d-flex flex-wrap align-items-center justify-content-end">
                                            <div className="mb">
                                                <button
                                                    onClick={() => { payRent() }}
                                                    className="btn btn-primary mo-mb-2 mr-10"
                                                    type="button"
                                                    style={{ cursor: "pointer" }}
                                                >
                                                    Pay Rent
                                                </button>
                                                {/* <button
                                                    type="button"
                                                    onClick={() => {
                                                        // history.push("/ticket_manager")
                                                    }}
                                                    className="btn btn-light "
                                                    data-toggle="modal"
                                                    data-target=".bs-example-modal-lg"
                                                >
                                                    <i className="bx bx-plus me-1"></i>Pay Rent
                                                </button> */}
                                            </div>
                                        </div>
                                        <CardBody>
                                            <div className="table-responsive">
                                                <Table className="table-striped table-bordered mb-0">
                                                    <thead>
                                                        <tr>
                                                            <th scope="col">Transaction ID</th>
                                                            <th scope="col">Company Name</th>
                                                            <th scope="col">Amount</th>

                                                            <th scope="col">Payment Status</th>

                                                        </tr>
                                                    </thead>
                                                    <tbody>
                                                        {
                                                            transactions.map((element) => {
                                                                return (
                                                                    <tr>
                                                                        <td>{element._id}</td>
                                                                        <td>{element.companyDomain}</td>
                                                                        <td>{element.amount}</td>
                                                                        <td>{element.payment_status}</td>
                                                                    </tr>
                                                                )

                                                            })
                                                        }
                                                        {/* <TicketListRow totalTickets={totalTickets} setTotalTickets={setTotalTickets} filteredTickets={filteredTickets} /> */}
                                                    </tbody>
                                                </Table>
                                            </div>
                                        </CardBody>

                                    </div>
                                </CardHeader>
                            </Card>
                        </Col>
                    </Row>
                </div>
            </div>
        </React.Fragment>
    )
}

export default TransactionsList;

