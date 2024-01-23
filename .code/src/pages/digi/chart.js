
import React, { useState } from "react";
import MetaTags from 'react-meta-tags';
import { Link } from "react-router-dom"
import {
  Table,
  Row,
  Col,
  Card,
  CardBody,
  Modal,
  CardHeader,
  Label,
  Input,
  Pagination,
  PaginationItem,
  Collapse,
  PaginationLink,
  DropdownItem,
  DropdownMenu,
  DropdownToggle,
  Dropdown,
  Form
} from "reactstrap"

//Import Breadcrumb
import Breadcrumbs from "../../components/Common/Breadcrumb"

// Form Mask
import InputMask from "react-input-mask"

// Form Editor
import { Editor } from "react-draft-wysiwyg"
import "react-draft-wysiwyg/dist/react-draft-wysiwyg.css"

const Chart = () => {
  
    const [modal_large, setmodal_large] = useState(false);
    const [btnsuccess1, setBtnsuccess1] = useState(false);

    function removeBodyCss() {
        document.body.classList.add("no_padding")
    }

    function tog_large() {
        setmodal_large(!modal_large)
         removeBodyCss()
     }

     const Currency = props => (
        <InputMask
          mask="$ 999,999,999.99"
          value={props.value}
          className="form-control input-color"
          onChange={props.onChange}
        >
        </InputMask>
      )
      const [col5, setcol5] = useState(false) 
        const t_col5 = () => {
         setcol5(!col5)
      }
 
  return (
    <React.Fragment>
      <div className="page-content">
        <MetaTags>
          <title>Rentdigicare | Chart </title>
        </MetaTags>
        <div className="container-fluid">
          <Breadcrumbs title="Home" breadcrumbItem="Chart" />
          <Row>
            <Col xl={12}>
              <Card>
              <CardHeader>
                <div className="row align-items-center">
                  <div className="col-md-6">
                     <div className="mb">
                        <h5 className="card-title">Chart <span className="text-muted fw-normal ms-2">(6)</span></h5>
                      </div>
                  </div>
                  <div className="col-md-6 d-flex flex-wrap align-items-center justify-content-end">
                    <div className="mb d-flex flex-wrap">
                    <button
                        onClick={t_col5}
                        className="btn btn-primary mo-mb-2 mr-10"
                        type="button"
                        style={{ cursor: "pointer" }}
                    >
                        Filters
                    </button>  
                    <button type="button" className="btn btn-light waves-effect">
                    <i className="bx bx-file-find"></i> PDF View
                    </button>
                    </div>              
                  </div>
                </div> 
                <div className="row">
                      <div className="col-lg-12">
                        <Collapse className="mt-4" isOpen={col5}>
                            <Card>
                                <CardBody>
                                  <div className="filter-sec">
                                  <Form>
                                    <div class="row align-items-center">
                                      <div className="col-md-4">
                                        <div className="mb-3">
                                            <Label className="form-Label">Company</Label>
                                            <select className="form-select">
                                                <option>Select One</option>
                                                <option>Company 1</option>
                                                <option>Company 2</option>
                                                <option>Company 3</option>
                                                <option>Company4</option>
                                            </select>
                                        </div>    
                                      </div>
                                      <div className="col-md-4">
                                        <div className="mb-3">
                                            <Label htmlFor="example-date-input" className="form-Label">Date From</Label>
                                            <Input className="form-control" type="date" defaultValue="2022-08-19" id="example-date-input"/>
                                        </div>
                                      </div>
                                      <div className="col-md-4">
                                        <div className="mb-3">
                                            <Label htmlFor="example-date-input" className="form-Label">Date To</Label>
                                            <Input className="form-control" type="date" defaultValue="2023-08-19" id="example-date-input"/>
                                        </div>
                                      </div>                                
                                      <div className="col-md-12">
                                          <div className="srch-btn">
                                            <button type="submit" className="btn btn-primary">Search</button>
                                          </div>
                                      </div>
                                    </div>
                                  </Form>
                                  </div>
                                </CardBody>
                            </Card>
                        </Collapse>
                      </div>           
                  </div> 
                </CardHeader>
                <CardBody>
                  <div className="table-responsive">
                    <Table className="table-striped table-bordered mb-0">
                      <thead>
                        <tr>
                          <th scope="col">Facility</th>
                          <th scope="col">Day</th>
                          <th scope="col">Date</th>
                          <th scope="col">Note</th>
                          <th scope="col">Type</th>
                          <th scope="col">Comments</th>
                          <th scope="col">Status</th>
                        </tr>
                      </thead>
                      <tbody>
                        <tr >
                          <td colspan="8"><b>Day: FRIDAY (1 Item)</b></td>
                        </tr>
                        <tr>
                          <td>Rentdigi/GSK</td>
                          <td>Friday</td>
                          <td>18/02/2022</td>
                          <td>It is a long established fact.</td>
                          <td>Clean</td>
                          <td>This is a dummy text.</td>
                          <td>Active</td>   
                        </tr>
                        <tr >
                          <td colspan="8"><b>Day: SATURDAY (1 Item)</b></td>
                        </tr>
                        <tr>
                          <td>Rentdigi/GSK</td>
                          <td>Saturday</td>
                          <td>12/02/2022</td>
                          <td>It is a long established fact.</td>
                          <td>Clean</td>
                          <td>This is a dummy text.</td>
                          <td>Active</td> 
                        </tr>
                        <tr >
                          <td colspan="8"><b>Day: SUNDAY (1 Item)</b></td>
                        </tr>
                        <tr>
                          <td>Rentdigi/GSK</td>
                          <td>Friday</td>
                          <td>13/05/2021</td>
                          <td>It is a long established fact.</td>
                          <td>Clean</td>
                          <td>This is a dummy text.</td>
                          <td>Active</td>  
                        </tr>
                        <tr >
                          <td colspan="8"><b>Day: MONDAY (2 Items)</b></td>
                        </tr>
                        <tr>
                          <td>Rentdigi/GSK</td>
                          <td>Friday</td>
                          <td>14/05/2020</td>
                          <td>It is a long established fact.</td>
                          <td>Clean</td>
                          <td>This is a dummy text.</td>
                          <td>Active</td>    
                        </tr>
                        <tr>
                          <td>Rentdigi/GSK</td>
                          <td>Friday</td>
                          <td>11/12/2019</td>
                          <td>It is a long established fact.</td>
                          <td>Clean</td>
                          <td>This is a dummy text.</td>
                          <td>Active</td>    
                        </tr>
                      </tbody>
                    </Table>
                  </div>
                  <Row className="proress-style mt-3">
                      <Col xl={3}> 
                      </Col>                    
                      <Col xl={9}>       
                          <div className="pagination-bar">
                          <Pagination aria-label="Page navigation example">
                            <PaginationItem disabled>
                              <PaginationLink href="#" tabIndex="-1">
                                Previous
                              </PaginationLink>
                            </PaginationItem>
                            <PaginationItem>
                              <PaginationLink href="#">1</PaginationLink>
                            </PaginationItem>
                            <PaginationItem active>
                              <PaginationLink href="#">
                                2 <span className="sr-only">(current)</span>
                              </PaginationLink>
                            </PaginationItem>
                            <PaginationItem>
                              <PaginationLink href="#">3</PaginationLink>
                            </PaginationItem>
                            <PaginationItem>
                              <PaginationLink href="#">Next</PaginationLink>
                            </PaginationItem>
                          </Pagination>
                          </div>        
                      </Col>                   
                    </Row>
                </CardBody>
              </Card>
            </Col>
          </Row>
        </div>
      </div>
    </React.Fragment>
  )
}
export default Chart
