import PropTypes from "prop-types"
import MetaTags from "react-meta-tags"
import React from "react"
import axios from "../api/axios"
import jwt_decode from "jwt-decode";

import { useState, useEffect } from "react"
import { useHistory } from 'react-router-dom';

import { Row, Col, Alert, Container } from "reactstrap"

//redux
import { useSelector, useDispatch } from "react-redux"

import { withRouter, Link } from "react-router-dom"

// availity-reactstrap-validation
import { AvForm, AvField } from "availity-reactstrap-validation"

//Social Media Imports
import { GoogleLogin } from "react-google-login"
// import TwitterLogin from "react-twitter-auth"
import FacebookLogin from "react-facebook-login/dist/facebook-login-render-props"

// actions
import { loginUser, loginUserCustom, socialLogin } from "../../store/actions"

// import images
import logo from "../../assets/images/logo-sm.svg"

//Import config
import { facebook, google } from "../../config"
import CarouselPage from "../AuthenticationInner/CarouselPage"


const LOGIN_ROLE = "admin"
const TwooFa = props => {

    const location1 = window.location.href;
    const position1 = location1.search("tkn");
    const subStr1 = location1.substring(position1);
    const domainPosition1 = subStr1.search("=");
    const companyDomain1 = subStr1.substring(domainPosition1 + 1);

    const [show, setshow] = useState(false)
    const [error1, seterror1] = useState(false)
    const [token, settoken] = useState()
    const [email, setemail] = useState()
    const [one, set1] = useState()
    const [Reset, setReset] = useState(false)
    const [Colour, setColour] = useState(true)




    useEffect(() => {
        settoken(one?one:props.location.state ? props.location.state.token : companyDomain1)
        setemail(props.location.state ? props.location.state.email : window.localStorage.getItem("email"),)
    })


    // Setting login_role as company 
    window.localStorage.setItem("login_role", LOGIN_ROLE)

    const COMMON_LOGIN_URL = "/"
    const dispatch = useDispatch()

    const { error } = useSelector(state => ({
        error: state.Login.error,
    }))

    // handleValidSubmit
    const handleValidSubmit = async (event, values) => {

        const data = {
            verificationCode: JSON.parse(values.verificationCode),
            email: email,
            verificationToken: token,
        }

        const res = axios.post("/two-fa/login", data)
            .then(res => {
                const role = jwt_decode(res.data.accessToken).role
                window.localStorage.setItem("role", role);
                window.localStorage.setItem("accessToken", res.data.accessToken)
                window.location.replace("/company");
            })
            .catch(error => {
                seterror1(error.message)
                setColour(false)
            })




    }

    const resend = () => {
        const data = {
            email: window.localStorage.getItem("email"),
            password: window.localStorage.getItem("pass")
        }

        const res = axios.post("/sadmin", data)
        .then(res => {
           set1(res.data.verificationCodeToken)
           seterror1(res.data.message)
           setColour(true)
        })
            .catch(error => {
                seterror1(error.message)
                setColour(false)
            })
    }




    // const ADMIN_LOGIN_URL = "/sadmin"
    // const loginAdmin = async (values, history) =>{
    //   const res = await axios.post(ADMIN_LOGIN_URL, {
    //     email: values.email,
    //     password: values.password
    //   })
    //
    //   if(res.data.accessToken){
    //     history.push("/dashboard")
    //   }
    // }



    // const signIn = (res, type) => {
    //   if (type === "google" && res) {
    //     const postData = {
    //       name: res.profileObj.name,
    //       email: res.profileObj.email,
    //       token: res.tokenObj.access_token,
    //       idToken: res.tokenId,
    //     }
    //     dispatch(socialLogin(postData, props.history, type))
    //   } else if (type === "facebook" && res) {
    //     const postData = {
    //       name: res.name,
    //       email: res.email,
    //       token: res.accessToken,
    //       idToken: res.tokenId,
    //     }
    //     dispatch(socialLogin(postData, props.history, type))
    //   }
    // }

    //handleGoogleLoginResponse
    // const googleResponse = response => {
    //   signIn(response, "google")
    // }

    //handleTwitterLoginResponse
    // const twitterResponse = e => {}

    //handleFacebookLoginResponse
    // const facebookResponse = response => {
    //   signIn(response, "facebook")
    // }

    return (
        <React.Fragment>
            <MetaTags>
                <title>Rentdigicare | Login</title>
            </MetaTags>
            <div className="auth-page">
                <Container fluid className="p-0">
                    <Row className="g-0">
                        <Col lg={4} md={5} className="col-xxl-3">
                            <div className="auth-full-page-content d-flex p-sm-5 p-4">
                                <div className="w-100">
                                    <div className="d-flex flex-column h-100">
                                        <div className="mb-4 mb-md-5 text-center">
                                            <Link to="/company" className="d-block auth-logo">
                                                <img src={logo} alt="" height="70" />
                                            </Link>
                                        </div>
                                        <div className="auth-content my-auto">
                                            <div className="text-center">
                                                <h5 className="mb-0">OTP</h5>
                                                <p className="text-muted mt-2">Submit otp to continue to Rentdigicare</p>
                                            </div>
                                            <AvForm
                                                className="custom-form mt-4 pt-2"
                                                onValidSubmit={(e, v) => {
                                                    handleValidSubmit(e, v)
                                                }}
                                            >
                                                {error1 ? <Alert color={Colour?"success":"danger"}>{error1}</Alert> : null}
                                                <div className="mb-3">
                                                    <AvField
                                                        name="verificationCode"
                                                        className="form-control"
                                                        placeholder="Otp"
                                                        type="verificationCode"
                                                        required
                                                    />
                                                </div>

                                                <div className="mb-3">
                                                    <button className="btn btn-primary w-100 waves-effect waves-light" type="submit"
                                                        >Submit</button>
                                                </div>

                                            </AvForm>
                                            <div className="mb-3">
                                                <button className="btn btn-primary w-100 waves-effect waves-light" type="submit" onClick={() => {
                                                    resend()
                                                }}
                                                >Resend</button>
                                            </div>

                                            {/* <div className="mt-4 text-center">
                        <h5 className="font-size-14 mb-3">Sign in with</h5>

                        <ul className="list-inline">
                          <li className="list-inline-item">
                            <FacebookLogin
                              appId={facebook.APP_ID}
                              autoLoad={false}
                              callback={facebookResponse}
                              render={renderProps => (
                                <Link
                                  to="#"
                                  className="social-list-item bg-primary text-white border-primary"
                                  onClick={renderProps.onClick}
                                >
                                  <i className="mdi mdi-facebook" />
                                </Link>
                              )}
                            />
                          </li>

                          <li className="list-inline-item">
                            <GoogleLogin
                              clientId={google.CLIENT_ID}
                              render={renderProps => (
                                <Link
                                  to="#"
                                  className="social-list-item bg-danger text-white border-danger"
                                  onClick={renderProps.onClick}
                                >
                                  <i className="mdi mdi-google" />
                                </Link>
                              )}
                              onSuccess={googleResponse}
                              onFailure={() => { }}
                            />
                          </li>
                        </ul>
                      </div> */}

                                            {/* <div className="mt-5 text-center">
                        <p className="text-muted mb-0">Don't have an account ? <Link to="/register"
                          className="text-primary fw-semibold"> Signup now </Link> </p>
                      </div> */}
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
        </React.Fragment>
    )
}

export default TwooFa
