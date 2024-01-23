import PropTypes from "prop-types"
import MetaTags from "react-meta-tags"
import React, { useState } from "react"
import { Row, Col, Alert, Container } from "reactstrap"

//redux
import { useSelector, useDispatch } from "react-redux"

import { withRouter, Link, button } from "react-router-dom"

// availity-reactstrap-validation
import { AvForm, AvField } from "availity-reactstrap-validation"

// action
import { userForgetPassword } from "../../store/actions"
import axios from "../api/axios";

// import images
import logo from "../../assets/images/logo-sm.svg"
import CarouselPage from "../AuthenticationInner/CarouselPage"

const ChangePassword = () => {

    const [showmsg, setshowmsg] = useState(false)
    const [truemsg, setruemsg] = useState(false)
    const [falsemsg, setfalsemsg] = useState(false)
    const [show, setshow] = useState(false)
    const [valid, invalid] = useState(true)

    const RESETPASS_URL = `/forget_password/reset`;
    const CHECKTOKEN_URL = `/forget_password/check_token`;

    const CheckToken = async (url, data) => {

        try {
            const response = await axios.post(url, data);

            if (response.data.status === 200) {
            //    alert(response.data.message)
               invalid(true)
            }
            if (response.data.status === 401) {
                // alert(response.data.message)
                invalid(false)
            }

        } catch (error) {
            console.log('err', error);
        }
    }

    const ResetPassword = async (url, data) => {
        const saveSpinner = document.getElementById("saveSpinner");
        const failedSaveErrorIcon = document.getElementById("failedSaveErrorIcon");

        saveSpinner.style.display = "inline-block";
        failedSaveErrorIcon.style.display = "none";

        try {
            const response = await axios.post(url, data);

            if (response.data.status === 200) {
                setruemsg(true)
                saveSpinner.style.display = "none";
                failedSaveErrorIcon.style.display = "none";
                window.location.replace('/login')
            }
            if (response.data.status === 401) {
                setfalsemsg(true)
                saveSpinner.style.display = "none";
                failedSaveErrorIcon.style.display = "none";
            }

        } catch (error) {
            console.log('err', error);
        }
    }

    const location1 = window.location.href;
    const position1 = location1.search("tkn");
    const subStr1 = location1.substring(position1);

    // geting position of domain and domain it self
    const domainPosition1 = subStr1.search("=");
    const Token = subStr1.substring(domainPosition1 + 1);

    
  useState(async () => {
  
      await CheckToken(CHECKTOKEN_URL, {
        resetToken:Token
      });


  });


if(valid === true){


    return (
        <React.Fragment>
            <MetaTags>
                <title>
                Rentdigicare | Reset Password
                </title>
            </MetaTags>
            <div className="auth-page">
                <Container fluid className="p-0">
                    <Row className="g-0">
                        <Col lg={4} md={5} className="col-xxl-3">
                            <div className="auth-full-page-content d-flex p-sm-5 p-4">
                                <div className="w-100">
                                    <div className="d-flex flex-column h-100">
                                        <div className="mb-4 mb-md-5 text-center">
                                            <Link to="/dashboard" className="d-block auth-logo">
                                                <img src={logo} alt="" height="70" />
                                            </Link>
                                        </div>
                                        <div className="auth-content my-auto">
                                            <div className="text-center">
                                                <h5 className="mb-0">Reset Password</h5>
                                            </div>

                                            <AvForm className="custom-form mt-4"
                                                // onValidSubmit={(e, v) => handleValidSubmit(e, v)}
                                                onValidSubmit={(e, v) => {
                                                    if (v.new_password === v.confirm_password) {
                                                        setshowmsg(false)
                                                        ResetPassword(RESETPASS_URL, {
                                                            resetToken: Token,
                                                            password: v.new_password,
                                                        })
                                                    }
                                                    else if (v.new_password !== v.confirm_password) {
                                                        setshowmsg(true)
                                                    }
                                                }}
                                            >
                                                <div className="mb-3">
                                                    <AvField
                                                        name="new_password"
                                                        label="New Password"
                                                        className="form-control"
                                                        placeholder="Enter New Password"
                                                        type="new_password"
                                                        required
                                                    />
                                                </div>
                                                <div className="mb-3 passShowInput">
                                                    <AvField
                                                        name="confirm_password"
                                                        label="Confirm Password"
                                                        className="form-control"
                                                        placeholder="Enter Confirm Password"
                                                        type={show ? "confirm_pass" : "password"}

                                                    />
                                                    {/* d-none */}
                                                    <div className="">
                                                        {show ? <i class="bx bx-show" onClick={() => setshow(!show)}></i> :
                                                            <i class="bx bxs-low-vision" onClick={() => setshow(!show)}></i>}
                                                    </div>

                                                </div>
                                                {showmsg ? <h6 className="text-danger">Password's are not matching!</h6> : <td></td>}
                                                {truemsg ? <h6 className="text-success">Password Changed Successfully</h6> : <td></td>}
                                                {falsemsg ? <h6 className="text-danger">Something Went Wrong!</h6> : <td></td>}

                                                <div className="mb-3 mt-4">
                                                    <button className="btn btn-primary w-100 waves-effect waves-light" type="submit">Reset
                                                        <div
                                                            id="saveSpinner"
                                                            style={{
                                                                display: "none",
                                                                height: "15px",
                                                                width: "15px",
                                                                marginLeft: "5px",
                                                            }}
                                                            className="spinner-border"
                                                            role="status"
                                                        ></div>
                                                        <i
                                                            id="failedSaveErrorIcon"
                                                            style={{
                                                                display: "none",
                                                                marginLeft: "5px",
                                                            }}
                                                            className="fa fa-exclamation-triangle"
                                                            aria-hidden="true"
                                                        ></i></button>
                                                </div>
                                            </AvForm>

                                        </div>

                                        <div className="mt-4 mt-md-5 text-center">
                                            <p className="mb-0"> {new Date().getFullYear()} © Rentdigicare</p>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        </Col>
                        <CarouselPage />
                    </Row>
                </Container>
            </div>
        </React.Fragment >
    )}
    else{
        return (
            <React.Fragment>
                <MetaTags>
                    <title>
                    Rentdigicare | Reset Password
                    </title>
                </MetaTags>
                <div className="auth-page">
                    <Container fluid className="p-0">
                        <Row className="g-0">
                            <Col lg={4} md={5} className="col-xxl-3">
                                <div className="auth-full-page-content d-flex p-sm-5 p-4">
                                    <div className="w-100">
                                        <div className="d-flex flex-column h-100">
                                            <div className="mb-4 mb-md-5 text-center">
                                                <Link to="/dashboard" className="d-block auth-logo">
                                                    <img src={logo} alt="" height="70" />
                                                </Link>
                                            </div>
                                            <div className="auth-content my-auto">
                                                <div className="text-center">
                                                <h5 className="text-danger">Password reset token is invalid or has expired!</h5>
                                                <Link to="/login">Go Back</Link>
                                                </div>
    
                                            </div>
    
                                            <div className="mt-4 mt-md-5 text-center">
                                                <p className="mb-0"> {new Date().getFullYear()} © Rentdigicare</p>
                                            </div>
                                        </div>
                                    </div>
                                </div>
                            </Col>
                            <CarouselPage />
                        </Row>
                    </Container>
                </div>
            </React.Fragment >
        )
    }
};

export default ChangePassword;