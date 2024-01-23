import PropTypes from "prop-types"
import MetaTags from "react-meta-tags"
import React from "react"
import axios from "../api/axios"

import { useState } from "react"
import { useHistory } from 'react-router-dom';

import { Row, Col, Alert, Container } from "reactstrap"

//redux
import { useSelector, useDispatch } from "react-redux"

import { withRouter, Link } from "react-router-dom"

// availity-reactstrap-validation
import { AvForm, AvField } from "availity-reactstrap-validation"


// import images
import logo from "../../assets/images/logo-sm.svg"

//Import config
import { facebook, google } from "../../config"
import CarouselPage from "../AuthenticationInner/CarouselPage"

const LOGIN_ROLE = "other-users"
const ComfirmPassword = props => {

    const [forgetError, setForgetError] = useState("")
    const [loading, setLoading] = useState(false)
    const [forgetSuccessMsg, setForgetSuccessMsg] = useState("")

    const history = useHistory()

    const COMFIRM_PASSWORD = "/forget_password/change-password"
    const email = props.location.state.email

    const { error } = useSelector(state => ({
        error: state.Login.error,
    }))

    // handleValidSubmit
    const handleValidSubmit = async (event, values) => {

        try {
            setLoading(true)
            let data = {
                "password": values.confirm_password,
                "email": email
            }

            const response = await axios.post(COMFIRM_PASSWORD, data);
            if (response.data.status == 200) {
                console.log("Temp:", response.data.message)
                setForgetSuccessMsg(response.data.message)
                history.push("/")
                // history.push("/page-two-step-verification")
            } else {
                setForgetError(response.data.message)
            }
            setLoading(false)

        } catch (e) {
            setForgetError("something went wrong")

        }

    }



    return (
        <React.Fragment>
            <MetaTags>
                <title>Rentdigicare | Comfirm Password </title>
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
                                                <h5 className="mb-0">Welcome back!</h5>
                                                {/* <p className="text-muted mt-2">Sign in to continue to Rentdigicare</p> */}
                                            </div>
                                            <AvForm
                                                className="custom-form mt-4 pt-2"
                                                onValidSubmit={(e, v) => {
                                                    handleValidSubmit(e, v)
                                                }}
                                            >
                                                {error ? <Alert color="danger">{error}</Alert> : null}
                                                {forgetError && forgetError ? (
                                                    <Alert color="danger" style={{ marginTop: "13px" }}>
                                                        {forgetError}
                                                    </Alert>
                                                ) : null}
                                                {forgetSuccessMsg ? (
                                                    <Alert color="success" style={{ marginTop: "13px" }}>
                                                        {forgetSuccessMsg}
                                                    </Alert>
                                                ) : null}
                                                <div className="mb-3">
                                                    <AvField
                                                        name="password"
                                                        type="password"
                                                        label="Password"
                                                        className="form-control"
                                                        required
                                                        placeholder="Enter Password"

                                                    />
                                                </div>
                                                <div className="mb-3">
                                                    <div className="d-flex align-items-start">
                                                        <div className="flex-grow-1">
                                                            <label className="form-label">Confirm Password</label>
                                                        </div>

                                                    </div>

                                                    <div className="mb-3">
                                                        <AvField
                                                            name="confirm_password"
                                                            type="password"
                                                            className="form-control"
                                                            required
                                                            placeholder="Enter Confirm Password"
                                                            validate={{ match: { value: 'password', errorMessage: 'Confirm Password is not as Password' } }}
                                                        />
                                                    </div>
                                                </div>
                                                <br />
                                                <div className="mb-3">
                                                    {loading ?
                                                        <button className="btn btn-primary w-100"><div
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
                                                        <button className="btn btn-primary w-100 waves-effect waves-light" type="submit">Submit</button>
                                                    }
                                                </div>
                                            </AvForm>

                                        </div>
                                        <div className="mt-4 mt-md-5 text-center">
                                            <p className="mb-0"> {new Date().getFullYear()} ©  Rentdigicare</p>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        </Col>
                        <CarouselPage />
                    </Row>
                </Container>
            </div>
        </React.Fragment>
    )
}

export default withRouter(ComfirmPassword)

ComfirmPassword.propTypes = {
    history: PropTypes.object,
}
