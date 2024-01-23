import React, { useState } from 'react'
import axios from '../api/axios'
import { Card, CardBody, Col, Row } from 'reactstrap';
import jwt_decode from "jwt-decode"

import WalletPieChart from "./WalletPieChart";

const WalletBalance = () => {

    let p = []
    let d = []
    let c = []

    const COMPANY_APPLICANTS_URL = `/applicant/list?page=1&limit=10`

    const [applicantsList, setApplicantsList] = useState([]);

    const decode = jwt_decode(window.localStorage.getItem("accessToken"));


    async function getApplicants(url, data) {

        try {
            const response = await axios.post(url, data);
            if (response.status === 200) {
                if (response.data.results.applications) {
                    const temp = (response.data.results.applications);
                    setApplicantsList(temp)
                    temp.map((data) => {
                        if (data.status === 'Pending') {
                            p.push(data.status)
                            console.log(p)
                        }
                        if (data.status === 'Denied') {
                            d.push(data.status)
                            console.log(d)
                        }
                        if (data.status === 'Completed') {
                            c.push(data.status)
                            console.log(c)
                        }
                    })
                }

            } else {
                console.log("Unable to fetch the resoureces")
            }
        } catch (error) {
            console.log("unable to get applicants", error)
        }
    }

    useState(async () => {

        if (decode.role === "company") {
            await getApplicants(COMPANY_APPLICANTS_URL, {

                role: decode.role,
                domain: decode.domain

            })
        }

        if (decode.role === "manager") {
            await getApplicants(COMPANY_APPLICANTS_URL, {

                role: decode.role,
                managerID: decode.id
            })
        }

        if (decode.role === "admin") {
            await getApplicants(COMPANY_APPLICANTS_URL, {

                role: decode.role,

            })
        }

    })

    return (
        <React.Fragment>
            <Col xl={5}>
                <Card className="card-h-100">
                    <CardBody>
                        <div className="d-flex flex-wrap align-items-center mb-4">
                            <h5 className="card-title me-2">Applications</h5>
                            {/* <div className="ms-auto">
                                <div>
                                    <button type="button" className="btn btn-soft-secondary btn-sm">
                                        ALL
                                    </button>
                                    <button type="button" className="btn btn-soft-primary btn-sm">
                                        1M
                                    </button>
                                    <button type="button" className="btn btn-soft-secondary btn-sm">
                                        6M
                                    </button>
                                    <button type="button" className="btn btn-soft-secondary btn-sm active">
                                        1Y
                                    </button>
                                </div>
                            </div> */}
                        </div>

                        <Row className="align-items-center">
                            <div className="col-sm">
                                <div id="wallet-balance" className="apex-charts">
                                    <WalletPieChart />
                                </div>
                            </div>
                            <div className="col-sm align-self-center">
                                <div className="mt-4 mt-sm-0">
                                    <div>
                                        <p className="mb-2"><i className="mdi mdi-circle align-middle font-size-10 me-2 text-success"></i>Denied</p>
                                        <span className="text-muted font-size-14 fw-normal">{d? d.length:<td></td>}</span>
                                    </div>

                                    <div className="mt-4 pt-2">
                                        <p className="mb-2"><i className="mdi mdi-circle align-middle font-size-10 me-2 text-primary"></i>Completed</p>
                                        <span className="text-muted font-size-14 fw-normal">{c? c.length:<td></td>}</span>
                                    </div>

                                    <div className="mt-4 pt-2">
                                        <p className="mb-2"><i className="mdi mdi-circle align-middle font-size-10 me-2 text-info"></i>Pending</p>
                                        <span className="text-muted font-size-14 fw-normal">{p? p.length:<td></td>}</span>
                                    </div>
                                </div>
                            </div>
                        </Row>
                    </CardBody>
                </Card>
            </Col>
        </React.Fragment>
    );
}

export default WalletBalance;