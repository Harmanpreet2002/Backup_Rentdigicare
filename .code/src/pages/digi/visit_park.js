
import React, { Component, useState } from "react";
import { Row, Col, Card, Container, CardBody, TabContent, TabPane, NavItem, NavLink, Progress, Label, Form, Input } from 'reactstrap';
import Dropzone from "react-dropzone";
import classnames from 'classnames';
import { Link } from "react-router-dom";
import logoSvg from "../../assets/images/rdig_logo.jpg";
import logoGsk from "../../assets/images/gsklogo.png";
function formatBytes(bytes, decimals = 2) {
    if (bytes === 0) return "0 Bytes"
    const k = 1024
    const dm = decimals < 0 ? 0 : decimals
    const sizes = ["Bytes", "KB", "MB", "GB", "TB", "PB", "EB", "ZB", "YB"]

    const i = Math.floor(Math.log(bytes) / Math.log(k))
    return parseFloat((bytes / Math.pow(k, i)).toFixed(dm)) + " " + sizes[i]
  } 
class VisitPark extends Component {
    constructor(props) {
        super(props);
        this.state = {
            breadcrumbItems: [
                { title: "Forms", link: "#" },
                { title: "Form Wizard", link: "#" },
            ],
            activeTabProgress: 1,
            progressValue: 33,
            selectedFiles:[]
        };
        this.toggleTabProgress.bind(this);
    }

    toggleTabProgress(tab) {
        if (this.state.activeTabProgress !== tab) {
            if (tab >= 1 && tab <= 3) {
                this.setState({
                    activeTabProgress: tab
                });

                if (tab === 1) { this.setState({ progressValue: 33 }) }
                if (tab === 2) { this.setState({ progressValue: 66 }) }
                if (tab === 3) { this.setState({ progressValue: 100 }) }
            }
        }
    }
    handleAcceptedFiles=(files)=> {
        files.map(file =>
          Object.assign(file, {
            preview: URL.createObjectURL(file),
            formattedSize: formatBytes(file.size),
          })
        )
        console.log("files",files)
        this.setState({selectedFiles:files})
      }
    render() {
        
    return (
        <React.Fragment>
            <div className="bg-soft-light min-vh-100 py-5">
                <div className="py-4">
                    <Container>
                        <Row>
                            <Col lg={12}>
                                <Card>
                                    <CardBody className="tickt-bdy">
                                        <Row className="tickt-frm-hd justify-content-center mt-3">
                                            <Link className="tckt-frm-bck" to="/"><i className="bx bx-left-arrow-alt"></i></Link>     
                                            <div className="col-xl-8 col-lg-10">
                                                <div className="logo-top text-center">
                                                     <img src={logoSvg} alt=""/>
                                                </div>
                                                <div className="hd-frm text-center">
                                                    <h2>Visitor Parking Form</h2>
                                                </div>
                                            </div>
                                        </Row>
                                        <Row className="mt-3">
                                            <div className="col-xl-12 col-lg-12">
                                               <Form>
                                                    <div className="row align-items-center">
                                                        <div className="col-md-6">
                                                            <div className="mb-3">
                                                                <Label className="form-label" htmlFor="formrow-facility-input">Select The Building</Label>
                                                                <select className="form-select">
                                                                    <option>Select</option>
                                                                    <option>Chappelle Gardens Apartment</option>
                                                                    <option>Chappelle Gardens Villas</option>
                                                                    <option>Oak Tower</option>
                                                                    <option>Oxford Campus</option>
                                                                    <option>Prescott Place</option>
                                                                </select>
                                                            </div>
                                                        </div>
                                                        <div className="col-md-6">
                                                            <div className="mb-3">
                                                                <Label className="form-label" htmlFor="formrow-suite-input">Visiting Suite Number</Label>
                                                                <Input type="text" className="form-control" id="formrow-suite-input" />
                                                            </div>
                                                        </div>
                                                        <div className="col-md-6">
                                                            <div className="mb-3">
                                                                <Label className="form-label" htmlFor="formrow-name-input">Name</Label>
                                                                <Input type="text" className="form-control" id="formrow-name-input" />
                                                            </div>    
                                                        </div>
                                                        <div className="col-md-6">
                                                            <div className="mb-3">
                                                                <Label className="form-label" htmlFor="formrow-number-input">Phone Number</Label>
                                                                <Input type="text" className="form-control" id="formrow-number-input" />
                                                            </div>    
                                                        </div>
                                                        <div className="col-md-6">
                                                            <div className="mb-3">
                                                                <Label className="form-label" htmlFor="formrow-email-input">Email</Label>
                                                                <Input type="text" className="form-control" id="formrow-email-input" />
                                                            </div>    
                                                        </div>
                                                        <div className="col-md-6">
                                                            <div className="mb-3">
                                                                <Label className="form-label" htmlFor="formrow-stall-input">Visitor Parking Stall Number</Label>
                                                                <Input type="text" className="form-control" id="formrow-stall-input" />
                                                            </div>
                                                        </div>
                                                        <div className="col-md-6">
                                                            <div className="mb-3">
                                                                <Label htmlFor="example-date-input" className="form-Label">Date</Label>
                                                                <Input className="form-control" type="date" defaultValue="2019-08-19" id="example-date-input" />
                                                            </div>
                                                        </div> 
                                                        <div className="col-md-6">
                                                            <div className="mb-3">
                                                                <Label htmlFor="example-time-input" className="form-Label">From</Label>
                                                                <Input className="form-control" type="time" defaultValue="13:45:00" id="example-time-input" />
                                                            </div> 
                                                        </div>
                                                        <div className="col-md-6">
                                                            <div className="mb-3">
                                                                <Label htmlFor="example-time-input" className="form-Label">To</Label>
                                                                <Input className="form-control" type="time" defaultValue="13:45:00" id="example-time-input" />
                                                            </div> 
                                                        </div>
                                                        <div className="col-md-6">
                                                            <div className="mb-3">
                                                                <Label className="form-label" htmlFor="formrow-make-input">Car Make</Label>
                                                                <Input type="text" className="form-control" id="formrow-make-input" />
                                                            </div>
                                                        </div>
                                                        <div className="col-md-6">
                                                            <div className="mb-3">
                                                                <Label className="form-label" htmlFor="formrow-model-input">Car Model</Label>
                                                                <Input type="text" className="form-control" id="formrow-model-input" />
                                                            </div>
                                                        </div>
                                                        <div className="col-md-6">
                                                            <div className="mb-3">
                                                                <Label className="form-label" htmlFor="formrow-plate-input">Plate Number</Label>
                                                                <Input type="text" className="form-control" id="formrow-plate-input" />
                                                            </div>
                                                        </div>
                                                    </div>
                                                    <div className="row">
                                                        <div class="col-md-12">
                                                            <div className="mt-4 btn-sce">
                                                                <button type="submit" className="btn btn-lg btn-primary mr-10 w-md">Submit</button>
                                                                <button type="submit" className="btn btn-lg btn-secondary w-md">Cancel</button>
                                                            </div>
                                                        </div> 
                                                    </div>
                                                </Form>   
                                            </div>
                                        </Row>
                                    </CardBody>
                                </Card>    
                            </Col>
                        </Row>
                    </Container>
                </div>
            </div>
        </React.Fragment>
    );
                                                            
}
}
export default VisitPark;