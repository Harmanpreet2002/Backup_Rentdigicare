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
import axios from "../api/axios";
import jwt_decode from "jwt-decode";


// TODO Validations
const Disable2fa = () => {
    const decode = jwt_decode(window.localStorage.accessToken)

    const[otp,setOtp] = useState()
  

const updateProfileInformation = () => {

}

 
        return (
            <React.Fragment>
                <div className="page-content">
                    <MetaTags>
                        <title>Disable2fa</title>
                    </MetaTags>
                    <div className="container-fluid">
                        <Breadcrumbs title="Home" breadcrumbItem="Disable2fa" />
                        <Row>
                            <Col xl={12}>
                                <Card>
                                    <CardHeader>
                                        <h4 className="card-title">Disable2fa</h4>
                                    </CardHeader>
                                    <CardBody>
                                        <div className="row align-items-center">
                                            <div class="col-lg-2">
                                                <div className="mb-3">
                                                    <Label className="form-label" htmlFor="formrow-username-input">OTP
                                                    </Label>
                                                    <Input onChange={(e) => {
                                                        setOtp(e.target.value)
                                                    }} type="text" className="form-control" id="formrow-username-input"
                                                         />
                                                </div>
                                                <div class="col-lg-12">
                                                <div className="mt-4">
                                                    <button type="submit" onClick={ (e) => {
                                                         updateProfileInformation(e)
                                                    }} className="btn btn-primary mr-10 w-md">Submit
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

export default Disable2fa
