import React, { useState } from "react";
import MetaTags from 'react-meta-tags';
import { Link } from "react-router-dom"
import { Card, CardBody, Col, Container, Row } from "reactstrap";
//Import Breadcrumb
import Breadcrumbs from "../../components/Common/Breadcrumb"

//import images
import img1 from "../../assets/images/small/img-1.jpg";
import img2 from "../../assets/images/small/img-2.jpg";
import img3 from "../../assets/images/small/img-3.jpg";
import img4 from "../../assets/images/small/img-4.jpg";
import img5 from "../../assets/images/small/img-5.jpg";
import img7 from "../../assets/images/small/img-7.jpg";
import img6 from "../../assets/images/small/img-6.jpg";

const CompsDetail = () => {
  const optionMulti = [
    { label: "Manager", value: "Manager" },
    { label: "Manager", value: "Manager" },
    { label: "Manager", value: "Manager" }
  ]
    const [modal_large, setmodal_large] = useState(false);

    function removeBodyCss() {
        document.body.classList.add("no_padding")
    }

    function tog_large() {
        setmodal_large(!modal_large)
         removeBodyCss()
     }

  return (
    <React.Fragment>
      <div className="page-content">
        <MetaTags>
          <title>Rentdigicare | Property </title>
        </MetaTags>
        <div className="container-fluid">
          <Breadcrumbs title="Home" breadcrumbItem="Property" />
             <div className="row align-items-center mb-3">
                <div className="col-md-6">
                    <div className="mb">
                         <h5 className="card-title">Properties <span className="text-muted fw-normal ms-2">(6)</span></h5>
                    </div>
                </div>
            </div>
          <Row>
            <Col md={6} xl={3}>
                <Card>
                    <img className="card-img-top img-fluid" src={img1} alt="" />
                    <CardBody>
                        <h4 className="card-title">Property Name</h4>
                        <p className="card-text">Some quick example text to build on the card title and make
                            up the bulk of the card's content.</p>
                    </CardBody>
                </Card>
            </Col>   
            <Col md={6} xl={3}>
                <Card>
                    <img className="card-img-top img-fluid" src={img2} alt="" />
                    <CardBody>
                        <h4 className="card-title">Property Name</h4>
                        <p className="card-text">Some quick example text to build on the card title and make
                            up the bulk of the card's content.</p>
                    </CardBody>
                </Card>
            </Col>  
            <Col md={6} xl={3}>
                <Card>
                    <img className="card-img-top img-fluid" src={img3} alt="" />
                    <CardBody>
                        <h4 className="card-title">Property Name</h4>
                        <p className="card-text">Some quick example text to build on the card title and make
                            up the bulk of the card's content.</p>
                    </CardBody>
                </Card>
            </Col>
            <Col md={6} xl={3}>
                <Card>
                    <img className="card-img-top img-fluid" src={img4} alt="" />
                    <CardBody>
                        <h4 className="card-title">Property Name</h4>
                        <p className="card-text">Some quick example text to build on the card title and make
                            up the bulk of the card's content.</p>
                    </CardBody>
                </Card>
            </Col>
            <Col md={6} xl={3}>
               <Card>
                    <img className="card-img-top img-fluid" src={img5} alt="" />
                    <CardBody>
                        <h4 className="card-title">Property Name</h4>
                        <p className="card-text">Some quick example text to build on the card title and make
                            up the bulk of the card's content.</p>
                    </CardBody>
                </Card>
            </Col>
            <Col md={6} xl={3}>
                <Card>
                    <img className="card-img-top img-fluid" src={img6} alt="" />
                    <CardBody>
                        <h4 className="card-title">Property Name</h4>
                        <p className="card-text">Some quick example text to build on the card title and make
                            up the bulk of the card's content.</p>
                    </CardBody>
                </Card>
            </Col>
            <Col md={6} xl={3}>
                 <Card>
                    <img className="card-img-top img-fluid" src={img7} alt="" />
                    <CardBody>
                        <h4 className="card-title">Property Name</h4>
                        <p className="card-text">Some quick example text to build on the card title and make
                            up the bulk of the card's content.</p>
                    </CardBody>
                </Card>
            </Col>
          </Row>
        </div>
      </div>
    </React.Fragment>
  )
}

export default CompsDetail
