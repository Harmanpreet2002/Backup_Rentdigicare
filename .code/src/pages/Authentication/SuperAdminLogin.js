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
const Login = props => {

  const [show, setshow] = useState(false)

  if (window.localStorage.getItem("accessToken") != null) {
    // Redirect to dashboard 
    window.location.replace("/company");
  }

  // Setting login_role as company 
  window.localStorage.setItem("login_role", LOGIN_ROLE)

  const COMMON_LOGIN_URL = "/"
  const dispatch = useDispatch()

  const { error } = useSelector(state => ({
    error: state.Login.error,
  }))

  // handleValidSubmit
  const handleValidSubmit = async (event, values) => {
    dispatch(loginUser(values, props.history))
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
                        <h5 className="mb-0">Welcome back!</h5>
                        <p className="text-muted mt-2">Sign in to continue to Rentdigicare</p>
                      </div>
                      <AvForm
                        className="custom-form mt-4 pt-2"
                        onValidSubmit={(e, v) => {
                          handleValidSubmit(e, v)
                        }}
                      >
                        {error ? <Alert color="danger">{error}</Alert> : null}
                        <div className="mb-3">
                          <AvField
                            name="email"
                            label="Email"
                            className="form-control"
                            placeholder="Enter email"
                            type="email"
                            required
                          />
                        </div>
                        <div className="mb-3">
                          <div className="d-flex align-items-start">
                            <div className="flex-grow-1">
                              <label className="form-label">Password</label>
                            </div>
                            <div className="flex-shrink-0">
                              <div className="">
                                <Link to="/forgot-password" className="text-muted">Forgot password?</Link>
                              </div>
                            </div>
                          </div>

                          <div class="authPassInputgroup">
                            <AvField
                              name="password"
                              type={show ? "asdf" : "password"}
                              className="form-control"
                              required
                              placeholder="Enter Password"
                            />
                            {show ?
                              <button class="btn btn-light shadow-none ms-0" type="button" onClick={() => setshow(!show)}>
                                <i class="bx bx-show"></i>
                              </button>
                              :
                              <button class="btn btn-light shadow-none ms-0" type="button" onClick={() => setshow(!show)}>
                                <i class="bx bxs-low-vision"></i>
                              </button>
                            }
                          </div>
                        </div>
                        <div className="row mb-4">
                          <div className="col">
                            <div className="form-check">
                              <input className="form-check-input" type="checkbox" id="remember-check" />
                              <label className="form-check-label" htmlFor="remember-check">
                                Remember me
                              </label>
                            </div>
                          </div>

                        </div>
                        <div className="mb-3">
                          <button className="btn btn-primary w-100 waves-effect waves-light" type="submit">Log In</button>
                        </div>
                      </AvForm>

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

export default withRouter(Login)

Login.propTypes = {
  history: PropTypes.object,
}