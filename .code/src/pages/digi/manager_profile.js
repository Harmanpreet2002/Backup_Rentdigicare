import React, { useState } from 'react';
import { 
    Card, 
    CardHeader,
    CardBody, 
    CardTitle, 
    Col, 
    Nav, 
    NavItem,
     NavLink, 
     Row, 
     TabContent, 
     TabPane, 
     DropdownItem, 
     DropdownMenu, 
     UncontrolledDropdown,
     DropdownToggle

} from 'reactstrap';
import { Link } from 'react-router-dom';
import MetaTags from 'react-meta-tags';

import classnames from "classnames"
//import images
import avatar from "../../assets/images/users/avatar-2.jpg";
import avatar1 from "../../assets/images/users/avatar-1.jpg";
import avatar3 from "../../assets/images/users/avatar-3.jpg";

//import images
import img1 from "../../assets/images/small/img-3.jpg";
import img2 from "../../assets/images/small/img-1.jpg";
import img3 from "../../assets/images/small/img-5.jpg";

//Import Breadcrumb
import Breadcrumbs from "../../components/Common/Breadcrumb"

const ManagerProfile= () => {
    const [activeTab, toggleTab] = useState("1");
    return (
        
        <React.Fragment>
            <div className="page-content">
            <MetaTags>
                 <title>Rentdigicare | Manager Profile </title>
            </MetaTags>
            <div className="container-fluid">
            <Breadcrumbs title="Home" breadcrumbItem="Manager Profile" />
            <Row>
                <Col xl={9} lg={8}>
                    <Card>
                        <CardBody>
                            <Row>
                                <div className="col-sm order-2 order-sm-1">
                                    <div className="d-flex align-items-center mt-3 mt-sm-0">
                                        <div className="flex-shrink-0">
                                            <div className="avatar-xl me-3">
                                                <img src={avatar} alt="" className="img-fluid rounded-circle d-block" />
                                            </div>
                                        </div>
                                        <div className="flex-grow-1">
                                            <div>
                                                <h5 className="font-size-16 mb-1">Danish Sharma</h5>
                                                <p className="text-muted font-size-13">Id No. 222558822</p>
                                            </div>
                                        </div>
                                    </div>
                                </div>
                                <div className="col-sm-auto order-1 order-sm-2">
                                    <div className="d-flex align-items-start justify-content-end gap-2">
                                        {/* <div>
                                            <button type="button" className="btn btn-soft-light"><i className="me-1"></i> Message</button>
                                        </div> */}
                                        {/*<div>
                                            <UncontrolledDropdown>
                                                <DropdownToggle className="btn btn-link font-size-16 shadow-none text-muted" tag="a">
                                                    <i className="bx bx-dots-horizontal-rounded"></i>
                                                </DropdownToggle>
                                                <DropdownMenu className="dropdown-menu-end">
                                                    <li><DropdownItem to="#">Action</DropdownItem></li>
                                                    <li><DropdownItem to="#">Another action</DropdownItem></li>
                                                    <li><DropdownItem to="#">Something else here</DropdownItem></li>
                                                </DropdownMenu>
                                            </UncontrolledDropdown>
                                        </div>*/}
                                    </div>
                                </div>
                            </Row>
                            <Nav className="nav-tabs-custom card-header-tabs border-top mt-4">
                                <NavItem>
                                    <NavLink
                                        to="#"
                                        className={classnames({
                                            active: activeTab === "1",
                                        }, "px-3")}
                                        onClick={() => {
                                            toggleTab("1")
                                        }}>
                                        Overview</NavLink>
                                </NavItem>
                                <NavItem>
                                    <NavLink
                                        to="#"
                                        className={classnames({
                                            active: activeTab === "2",
                                        }, "px-3")}
                                        onClick={() => {
                                            toggleTab("2")
                                        }}
                                    >Properties</NavLink>
                                </NavItem>
                            </Nav>
                        </CardBody>
                    </Card>
                    <TabContent activeTab={activeTab}>
                        <TabPane tabId="1">
                            
                            <Card>
                                <CardHeader>
                                    <CardTitle className="mb-0"><b>Overview</b></CardTitle>
                                </CardHeader>
                                <CardBody>
                                <div>
                                    <div className="pb-3">
                                        <Row>
                                            <Col xl={2}>
                                                <div>
                                                    <h5 className="font-size-15">Bio :</h5>
                                                </div>
                                            </Col>
                                            <div className="col-xl">
                                                <div className="text-muted">
                                                    <p className="mb-2">Hi I'm Phyllis Gatlin, Lorem Ipsum is simply dummy text of the printing and typesetting industry. Lorem Ipsum has been the industry's standard dummy text ever since the 1500s, when an unknown printer took a galley of type and scrambled it to make a type specimen book. It has survived not only five centuries, but also the leap into electronic typesetting, remaining essentially unchanged. It was popularised in the 1960s with the release of Letraset sheets containing Lorem Ipsum passages</p>
                                                    <p className="mb-0">It is a long established fact that a reader will be distracted by the readable content of a page when looking at it has a more-or-less normal distribution of letters</p>
                                                </div>
                                            </div>
                                        </Row>
                                    </div>

                                    <div className="py-3">
                                        <Row>
                                            <Col xl={2}>
                                                <div>
                                                    <h5 className="font-size-15">Experience :</h5>
                                                </div>
                                            </Col>
                                            <div className="col-xl">
                                                <div className="text-muted">
                                                    <ul className="list-unstyled mb-0">
                                                        <li className="py-1"><i className="mdi mdi-circle-medium me-1 text-success align-middle"></i>Donec vitae sapien ut libero venenatis faucibus</li>
                                                        <li className="py-1"><i className="mdi mdi-circle-medium me-1 text-success align-middle"></i>Quisque rutrum aenean imperdiet</li>
                                                        <li className="py-1"><i className="mdi mdi-circle-medium me-1 text-success align-middle"></i>Integer ante a consectetuer eget</li>
                                                        <li className="py-1"><i className="mdi mdi-circle-medium me-1 text-success align-middle"></i>Phasellus nec sem in justo pellentesque</li>
                                                    </ul>
                                                </div>
                                            </div>
                                        </Row>
                                    </div>
                                </div>
                                </CardBody>
                            </Card> 
                        </TabPane>
                        <TabPane tabId="2">
                        <Card>
                            <CardHeader>
                                <div className="d-flex">
                                    <div className="flex-grow-1">
                                        <CardTitle className="mb-0"><b>Properties</b><span className="text-muted fw-normal ms-2">(6)</span> </CardTitle>
                                    </div>
                                    {/* <div className="flex-shrink-0">
                                        <Link to="#">View All</Link>
                                    </div> */}
                                </div>
                            </CardHeader>
                            <CardBody>
                                <div>
                                    <Row>
                                        <Col xl={4}>
                                            <Card className="p-1 mb-xl-0">
                                                <div className="p-3">
                                                    <div className="d-flex align-items-start">
                                                        <div className="flex-grow-1 overflow-hidden">
                                                            <h5 className="font-size-14 text-truncate"><Link to="#" className="text-dark">Property Name 1</Link></h5>
                                                            <p className="font-size-13 text-muted mb-0">10 Apr, 2020</p>
                                                        </div>
                                                        <div className="flex-shrink-0 ms-2">
                                                            <UncontrolledDropdown>
                                                                <DropdownToggle className="btn btn-link text-muted font-size-16 p-1 py-0 shadow-none" tag="a">
                                                                    <i className="bx bx-dots-horizontal-rounded"></i>
                                                                </DropdownToggle>
                                                                <DropdownMenu className="dropdown-menu-end">
                                                                    <li><DropdownItem to="#">Action</DropdownItem></li>
                                                                    <li><DropdownItem to="#">Another action</DropdownItem></li>
                                                                    <li><DropdownItem to="#">Something else here</DropdownItem></li>
                                                                </DropdownMenu>
                                                            </UncontrolledDropdown>
                                                        </div>
                                                    </div>
                                                </div>

                                                <div className="position-relative">
                                                    <img src={img1} alt="" className="img-thumbnail" />
                                                </div>

                                                <div className="p-3">
                                                    <p className="text-muted">Neque porro quisquam est, qui dolorem ipsum quia dolor sit amet</p>

                                                    {/* <div>
                                                        <Link to="/contacts-list" className="text-primary">Read more <i className="mdi mdi-arrow-right"></i></Link>
                                                    </div> */}
                                                </div>
                                            </Card>
                                        </Col>

                                        <Col xl={4}>
                                            <Card className="p-1 mb-xl-0">
                                                <div className="p-3">
                                                    <div className="d-flex align-items-start">
                                                        <div className="flex-grow-1 overflow-hidden">
                                                            <h5 className="font-size-14 text-truncate"><Link to="#" className="text-dark">Property Name 2</Link></h5>
                                                            <p className="font-size-13 text-muted mb-0">24 Mar, 2020</p>
                                                        </div>
                                                        <div className="flex-shrink-0 ms-2">
                                                            <UncontrolledDropdown>
                                                                <DropdownToggle className="btn btn-link text-muted font-size-16 p-1 py-0 shadow-none" tag="a">
                                                                    <i className="bx bx-dots-horizontal-rounded"></i>
                                                                </DropdownToggle>
                                                                <DropdownMenu className="dropdown-menu-end">
                                                                    <li><DropdownItem to="#">Action</DropdownItem></li>
                                                                    <li><DropdownItem to="#">Another action</DropdownItem></li>
                                                                    <li><DropdownItem to="#">Something else here</DropdownItem></li>
                                                                </DropdownMenu>
                                                            </UncontrolledDropdown>
                                                        </div>
                                                    </div>
                                                </div>

                                                <div className="position-relative">
                                                    <img src={img2} alt="" className="img-thumbnail" />
                                                </div>

                                                <div className="p-3">
                                                    <p className="text-muted">At vero eos et accusamus et iusto odio dignissimos ducimus quos</p>

                                                    {/* <div>
                                                        <Link to="/contacts-list" className="text-primary">Read more <i className="mdi mdi-arrow-right"></i></Link>
                                                    </div> */}
                                                </div>
                                            </Card>
                                        </Col>

                                        <Col xl={4}>
                                            <Card className="p-1 mb-sm-0">
                                                <div className="p-3">
                                                    <div className="d-flex align-items-start">
                                                        <div className="flex-grow-1 overflow-hidden">
                                                            <h5 className="font-size-14 text-truncate">Property Name 2</h5>
                                                            <p className="font-size-13 text-muted mb-0">20 Mar, 2020</p>
                                                        </div>
                                                        <div className="flex-shrink-0 ms-2">
                                                            <UncontrolledDropdown>
                                                                <DropdownToggle className="btn btn-link text-muted font-size-16 p-1 py-0 shadow-none" tag="a">
                                                                    <i className="bx bx-dots-horizontal-rounded"></i>
                                                                </DropdownToggle>
                                                                <DropdownMenu className="dropdown-menu-end">
                                                                    <li><DropdownItem to="#">Action</DropdownItem></li>
                                                                    <li><DropdownItem to="#">Another action</DropdownItem></li>
                                                                    <li><DropdownItem to="#">Something else here</DropdownItem></li>
                                                                </DropdownMenu>
                                                            </UncontrolledDropdown>
                                                        </div>
                                                    </div>
                                                </div>

                                                <div className="position-relative">
                                                    <img src={img3} alt="" className="img-thumbnail" />
                                                </div>

                                                <div className="p-3">
                                                    <p className="text-muted">Itaque earum rerum hic tenetur a sapiente delectus ut aut</p>
{/* 
                                                    <div>
                                                        <Link to="/contacts-list" className="text-primary">Read more <i className="mdi mdi-arrow-right"></i></Link>
                                                    </div> */}
                                                </div>
                                            </Card>
                                        </Col>
                                    </Row>
                                </div>
                            </CardBody>
                        </Card>            
                        </TabPane>
                    </TabContent>                   
                </Col>
                <Col xl={3} lg={4}>
                    {/* <Card>
                        <CardBody>
                            <CardTitle className="mb-3">Skills</CardTitle>

                            <div className="d-flex flex-wrap gap-2 font-size-16">
                                <Link to="#" className="badge badge-soft-primary">Photoshop</Link>
                                <Link to="#" className="badge badge-soft-primary">illustrator</Link>
                                <Link to="#" className="badge badge-soft-primary">HTML</Link>
                                <Link to="#" className="badge badge-soft-primary">CSS</Link>
                                <Link to="#" className="badge badge-soft-primary">Javascript</Link>
                                <Link to="#" className="badge badge-soft-primary">Php</Link>
                                <Link to="#" className="badge badge-soft-primary">Python</Link>
                            </div>
                        </CardBody>
                    </Card>

                    <Card>
                        <CardBody>
                            <CardTitle className="mb-3">Portfolio</CardTitle>

                            <div>
                                <ul className="list-unstyled mb-0">
                                    <li>
                                        <Link to="#" className="py-2 d-block text-muted"><i className="mdi mdi-web text-primary me-1"></i> Website</Link>
                                    </li>
                                    <li>
                                        <Link to="#" className="py-2 d-block text-muted"><i className="mdi mdi-note-text-outline text-primary me-1"></i> Blog</Link>
                                    </li>
                                </ul>
                            </div>
                        </CardBody>
                    </Card> */}

                    <Card>
                        <CardBody>
                            <CardTitle className="mb-3">Similar Managers</CardTitle>

                            <div className="list-group list-group-flush">
                                <Link to="#" className="list-group-item list-group-item-action">
                                    <div className="d-flex align-items-center">
                                        <div className="avatar-sm flex-shrink-0 me-3">
                                            <img src={avatar1} alt="" className="img-thumbnail rounded-circle" />
                                        </div>
                                        <div className="flex-grow-1">
                                            <div>
                                                <h5 className="font-size-14 mb-1">James Nix</h5>
                                                <p className="font-size-13 text-muted mb-0">Full Stack Developer</p>
                                            </div>
                                        </div>
                                    </div>
                                </Link>
                                <Link to="#" className="list-group-item list-group-item-action">
                                    <div className="d-flex align-items-center">
                                        <div className="avatar-sm flex-shrink-0 me-3">
                                            <img src={avatar3} alt="" className="img-thumbnail rounded-circle" />
                                        </div>
                                        <div className="flex-grow-1">
                                            <div>
                                                <h5 className="font-size-14 mb-1">Darlene Smith</h5>
                                                <p className="font-size-13 text-muted mb-0">UI/UX Designer</p>
                                            </div>
                                        </div>
                                    </div>
                                </Link>
                                <Link to="#" className="list-group-item list-group-item-action">
                                    <div className="d-flex align-items-center">
                                        <div className="avatar-sm flex-shrink-0 me-3">
                                            <div className="avatar-title bg-soft-light text-light rounded-circle font-size-22">
                                                <i className="bx bxs-user-circle"></i>
                                            </div>
                                        </div>
                                        <div className="flex-grow-1">
                                            <div>
                                                <h5 className="font-size-14 mb-1">William Swift</h5>
                                                <p className="font-size-13 text-muted mb-0">Backend Developer</p>
                                            </div>
                                        </div>
                                    </div>
                                </Link>
                            </div>
                        </CardBody>
                    </Card>
                </Col>
            </Row>
            </div>
            </div>
        </React.Fragment>
    );
}

export default ManagerProfile;