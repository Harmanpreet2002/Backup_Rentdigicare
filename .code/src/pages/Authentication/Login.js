import PropTypes from "prop-types";
import MetaTags from "react-meta-tags";
import React from "react";
import axios from "../api/axios";

import { useState } from "react";
import { useHistory } from "react-router-dom";

import { Row, Col, Alert, Container } from "reactstrap";

//redux
import { useSelector, useDispatch } from "react-redux";

import { withRouter, Link } from "react-router-dom";

// availity-reactstrap-validation
import { AvForm, AvField } from "availity-reactstrap-validation";

//Social Media Imports
import { GoogleLogin } from "react-google-login";
// import TwitterLogin from "react-twitter-auth"
import FacebookLogin from "react-facebook-login/dist/facebook-login-render-props";

// actions
import { loginUser, loginUserCustom, socialLogin } from "../../store/actions";

// import images
import logo from "../../assets/images/logo-sm.svg";

//Import config
import { facebook, google } from "../../config";
import CarouselPage from "../AuthenticationInner/CarouselPage";

const LOGIN_ROLE = "other-users";
const Login = (props) => {
  const [show, setshow] = useState(false);
  if (window.localStorage.getItem("accessToken") != null) {
    // Redirect to dashboard
    window.location.replace("/dashboard");
  }

  // Setting login_role as company
  window.localStorage.setItem("login_role", LOGIN_ROLE);
  const COMMON_LOGIN_URL = "/";
  const dispatch = useDispatch();

  const { error } = useSelector((state) => ({
    error: state.Login.error,
  }));

  // handleValidSubmit
  const handleValidSubmit = async (event, values) => {
    dispatch(loginUser(values, props.history)); // todo use redux
    //loginAdmin(values, props.history)
  };

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
            {/* <CarouselPage /> */}
            <div
              className="col-xxl-8 col-lg-7 col-md-7 d-none d-sm-block"
              style={{
                backgroundImage: "url('images/Group 110@2x.png')",
                backgroundSize: "cover",
                backgroundRepeat: "no-repeat",
                objectFit: "cover",
              }}
            >
              <img
                src="images/Layer 0@2x.png"
                alt="Company Logo"
                className="position-absolute top-0 start-0 m-4"
                style={{ maxWidth: "163px" }}
              />

              <div className="auth-full-page-content d-flex pb-5">
                <div className="w-100">
                  <div className="d-flex flex-column justify-content-center align-items-center h-100">
                    <div className="d-flex justify-content-start align-items-center w-75">
                      <p
                        className="h1 fs-1 fs-md-1 text-primary"
                        style={{
                          fontSize: "clamp(20px, 5vw, 50px)",
                          color: "#0c518a",
                        }}
                      >
                        <span style={{ fontWeight: "100" }}> Welcome to </span>
                        <br /> RentDigiCare
                      </p>
                      <div className="d-flex d-none d-lg-block">
                        <img
                          src="images/Group 108@2x.png"
                          alt=""
                          style={{ maxWidth: "115px" }}
                        />
                        <img
                          src="images/Group 109@2x.png"
                          alt=""
                          style={{ maxWidth: "100px" }}
                        />
                      </div>
                    </div>

                    <div
                      className="d-flex justify-content-start align-items-center w-75"
                      style={{
                        textAlign: "start",
                        lineHeight: "normal",
                        display: "flex",
                        justifyContent: "center",
                        margin: "25px 0 0",
                      }}
                    >
                      <span
                        className="fst-brd"
                        style={{
                          height: "6px",
                          borderRadius: "50px",
                          backgroundColor: "#ff6128",
                          display: "inline-block",
                          margin: "0 5px",
                          width: "16px",
                        }}
                      ></span>
                      <span
                        className="secend-brd"
                        style={{
                          height: "6px",
                          borderRadius: "50px",
                          backgroundColor: "#ff6128",
                          display: "inline-block",
                          margin: "0 5px",
                          width: "46px",
                        }}
                      ></span>
                      <span
                        className="fst-brd"
                        style={{
                          height: "6px",
                          borderRadius: "50px",
                          backgroundColor: "#ff6128",
                          display: "inline-block",
                          margin: "0 5px",
                          width: "16px",
                        }}
                      ></span>
                      <span
                        className="secend-brd"
                        style={{
                          height: "6px",
                          borderRadius: "50px",
                          backgroundColor: "#ff6128",
                          display: "inline-block",
                          margin: "0 5px",
                          width: "46px",
                        }}
                      ></span>
                    </div>

                    <div className="d-flex justify-content-start align-items-center w-75">
                      <p className="h3 mt-4">
                        <span style={{ fontWeight: "100", color: "#212121" }}>
                          Where Property Managers Feel Right at <br /> Home in
                          the World of{" "}
                          <span
                            style={{ fontWeight: "bold", color: "#0c518a" }}
                          >
                             Rental Success!
                          </span>
                        </span>
                      </p>
                    </div>
                  </div>
                </div>
              </div>
            </div>

            <Col
              lg={5}
              md={5}
              className="col-xxl-4"
              style={{
                backgroundImage: "url('images/login page@2x.png')",
                backgroundSize: "cover",
                backgroundRepeat: "no-repeat",
                objectFit: "cover",
              }}
            >
              <div className="auth-full-page-content d-flex p-sm-5 p-4">
                <div className="w-100">
                  <div className="d-flex flex-column h-100">
                    <div className="auth-content my-auto">
                      <div className="text-center">
                        <h2 className="mb-0" style={{ color: "#0c518a" }}>
                          Sign in here!
                        </h2>
                        <p className="text-muted mt-2">
                          Sign in to continue to Rentdigicare
                        </p>
                      </div>

                      <div
                        style={{
                          textAlign: "center",
                          lineHeight: "normal",
                          display: "flex",
                          justifyContent: "center",
                          margin: "25px 0 0",
                        }}
                      >
                        <span
                          className="fst-brd"
                          style={{
                            height: "6px",
                            borderRadius: "50px",
                            backgroundColor: "#ff6128",
                            display: "inline-block",
                            margin: "0 5px",
                            width: "16px",
                          }}
                        ></span>
                        <span
                          className="secend-brd"
                          style={{
                            height: "6px",
                            borderRadius: "50px",
                            backgroundColor: "#ff6128",
                            display: "inline-block",
                            margin: "0 5px",
                            width: "46px",
                          }}
                        ></span>
                      </div>

                      <AvForm
                        className="custom-form mt-4 pt-2"
                        onValidSubmit={(e, v) => {
                          handleValidSubmit(e, v);
                        }}
                      >
                        {error ? <Alert color="danger">{error}</Alert> : null}

                        {/* Email Field */}
                        <div className="mb-4">
                          <AvField
                            name="email"
                            className="form-control"
                            placeholder="Email"
                            type="email"
                            required
                          />
                        </div>

                        {/* Password Field */}
                        <div class="mb-4">
                          <div class="authPassInputgroup">
                            <AvField
                              name="password"
                              type={show ? "asdf" : "password"}
                              className="form-control"
                              required
                              placeholder="Password"
                            />
                            {show ? (
                              <button
                                class="btn btn-light shadow-none ms-0"
                                type="button"
                                onClick={() => setshow(!show)}
                              >
                                <i class="bx bx-show"></i>
                              </button>
                            ) : (
                              <button
                                class="btn btn-light shadow-none ms-0"
                                type="button"
                                onClick={() => setshow(!show)}
                              >
                                <i class="bx bxs-low-vision"></i>
                              </button>
                            )}
                          </div>
                        </div>

                        {/* Remember me and Forgot Password */}
                        <div className="row mb-4">
                          <div className="col d-flex justify-content-between align-items-center">
                            <div className="form-check">
                              <input
                                className="form-check-input"
                                type="checkbox"
                                id="remember-check"
                              />
                              <label
                                className="form-check-label"
                                htmlFor="remember-check"
                              >
                                Remember me
                              </label>
                            </div>

                            <div class="flex-shrink-0">
                              <div class="">
                                <Link
                                  to="/forgot-password"
                                  className="text-muted"
                                >
                                  Forgot password?
                                </Link>
                              </div>
                            </div>
                          </div>
                        </div>

                        {/* Login Button  */}
                        <div className="mb-3">
                          <button
                            className="btn btn-primary w-100 waves-effect waves-light"
                            type="submit"
                          >
                            Log In
                          </button>
                        </div>
                      </AvForm>
                    </div>
                  </div>
                </div>
              </div>
            </Col>
          </Row>
        </Container>
      </div>
    </React.Fragment>
  );
};

export default withRouter(Login);

// Login2.propTypes = {
//   history: PropTypes.object,
// };
