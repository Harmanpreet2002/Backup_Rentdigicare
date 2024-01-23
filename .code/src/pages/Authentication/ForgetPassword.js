import PropTypes from "prop-types"
import MetaTags from "react-meta-tags"
import React, { useState } from "react"
import { Row, Col, Alert, Container } from "reactstrap"
import { useHistory } from "react-router-dom"

//axios
import axios from "../api/axios"

//redux
import { useSelector, useDispatch } from "react-redux"

import { withRouter, Link } from "react-router-dom"

// availity-reactstrap-validation
import { AvForm, AvField } from "availity-reactstrap-validation"

// action
import { userForgetPassword } from "../../store/actions"


// import images
import logo from "../../assets/images/logo-sm.svg"
import CarouselPage from "../AuthenticationInner/CarouselPage"


const ForgetPasswordPage = (props) => {


  const [showMsg, setshowMsg] = useState(false)
  const [showMsg1, setshowMsg1] = useState(false)

  const FORGOTPASS_URL = `/forget_password/reset-link`;

  const ForgetPassword = async (url, data) => {



    const saveSpinner = document.getElementById("saveSpinner");
    const failedSaveErrorIcon = document.getElementById("failedSaveErrorIcon");

    saveSpinner.style.display = "inline-block";
    failedSaveErrorIcon.style.display = "none";

    try {
      const response = await axios.post(url, data);

      if (response.data.status === 200) {
        setshowMsg(true)
        setshowMsg1(false)
        saveSpinner.style.display = "none";
        failedSaveErrorIcon.style.display = "none";
      }
      if (response.data.status === 400) {
        setshowMsg1(true)
        setshowMsg(false)
        saveSpinner.style.display = "none";
        failedSaveErrorIcon.style.display = "none";
      }

    } catch (error) {
      console.log('err', error);
    }
  };


  const dispatch = useDispatch()

  const FORGET_PASSWORD = "/forget_password/get-otp"

  const [loading, setLoading] = useState(false)
  const [forgetError, setForgetError] = useState("")
  const [forgetSuccessMsg, setForgetSuccessMsg] = useState("")

  const history = useHistory()



  async function handleValidSubmit(event, values) {
    try {
      setLoading(true)

      const response = await axios.post(FORGET_PASSWORD, values);
      if (response.data.status == 200) {
        console.log("Temp:", response.data.message)
        setForgetSuccessMsg(response.data.message)
        history.push("/page-two-step-verification", { email: values.email })
      } else {
        setForgetError(response.data.message)
      }
      setLoading(false)

    } catch (e) {
      console.log(e)
    }



    //dispatch(userForgetPassword(values, props.history))
  }

  return (
    <React.Fragment>
      <MetaTags>
        <title>

        Rentdigicare | Forgot Password

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
                        <h5 className="mb-0">Forgot Password</h5>
                        <p className="text-muted mt-2">Forgot password with Rentdigicare</p>
                      </div>

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

                      <AvForm className="custom-form mt-4"
                        // onValidSubmit={(e, v) => handleValidSubmit(e, v)}
                        onValidSubmit={(e, v) => ForgetPassword(FORGOTPASS_URL, {
                          email: v.email,
                        })}
                      >
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
                        {showMsg ? <h6 className="text-success">Please check your registered email!</h6> : <td></td>}
                        {showMsg1 ? <h6 className="text-danger">User doesn't exist</h6> : <td></td>}
                      </AvForm>


                      {/* <div className="mt-5 text-center">
                        <p className="text-muted mb-0">Remember it ?  <a href="auth-login.html"
                          className="text-primary fw-semibold"> Sign in </a>
                        </p>
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
    </React.Fragment >
  )
}

ForgetPasswordPage.propTypes = {
  history: PropTypes.object,
}

export default withRouter(ForgetPasswordPage)
