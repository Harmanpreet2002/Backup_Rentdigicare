
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

const Assets = () => {
  
    const [modal_large, setmodal_large] = useState(false);
    const [btnsuccess1, setBtnsuccess1] = useState(false);
    const [modal_large2, setmodal_large2] = useState(false); 

    function removeBodyCss() {
        document.body.classList.add("no_padding")
    }

    function tog_large() {
        setmodal_large(!modal_large)
         removeBodyCss()
     }

     function tog_large2() {
      setmodal_large2(!modal_large2)
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
          <title>RentDigi Care| Parts </title>
        </MetaTags>
        <div className="container-fluid">
          <Breadcrumbs title="Home" breadcrumbItem="Parts" />
          <Row>
            <Col xl={12}>
              <Card>
              <CardHeader>
                <div className="row align-items-center">
                  <div className="col-md-6">
                     <div className="mb">
                        <h5 className="card-title">Parts <span className="text-muted fw-normal ms-2">(6)</span></h5>
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
                    <Dropdown
                        isOpen={btnsuccess1}
                        toggle={() => setBtnsuccess1(!btnsuccess1)}
                    >
                        <DropdownToggle tag="button" className="btn btn-success mr-10">
                            Show Items <i className="mdi mdi-chevron-down" />
                        </DropdownToggle>
                        <DropdownMenu>
                            <DropdownItem>Active</DropdownItem>
                            <DropdownItem>Inactive</DropdownItem>
                        </DropdownMenu>
                    </Dropdown>
                    <button
                        type="button"
                        onClick={() => {
                            tog_large()
                        }}
                        className="btn btn-light "
                        data-toggle="modal"
                        data-target=".bs-example-modal-lg"
                    >
                        <i className="bx bx-plus me-1"></i> Add Parts
                    </button>
                    <Modal
                        size="lg"
                        isOpen={modal_large}
                        toggle={() => {
                            tog_large()
                        }}
                    >
                        <div className="modal-header">
                            <h5
                                className="modal-title mt-0"
                                id="myLargeModalLabel"
                            >
                                Add Parts
                            </h5>
                            <button
                                onClick={() => {
                                    setmodal_large(false)
                                }}
                                type="button"
                                className="close"
                                data-dismiss="modal"
                                aria-label="Close"
                            >
                                <span aria-hidden="true">&times;</span>
                            </button>
                        </div>
                      <div className="modal-body">
                        <Form>
                        <div className="row align-items-center">
                          <div className="col-md-6"> 
                            <div className="mb-3">
                                  <Label className="form-label" htmlFor="formrow-code-input">Part Code</Label>
                                  <Input type="text" className="form-control" id="formrow-code-input" />
                            </div>
                          </div>
                          <div className="col-md-6">
                            <div className="mb-3">
                                <Label className="form-Label">Default Vendor</Label>
                                <select className="form-select">
                                    <option>Select One</option>
                                    <option>Vendor 1</option>
                                    <option>Vendor 2</option>
                                    <option>Vendor 3</option>
                                    <option>Vendor 4</option>
                                    <option>Vendor 5</option>
                                </select>
                            </div>    
                          </div>      
                          <div className="col-md-6">
                            <div className="mb-3">
                                <Label className="form-Label">Status</Label>
                                <select className="form-select">
                                    <option>Select One</option>
                                    <option>Active</option>
                                    <option>Inactive</option>
                                </select>
                            </div>    
                          </div> 
                          <div className="col-md-6"> 
                            <div className="mb-3">
                                  <Label className="form-label" htmlFor="formrow-reorder-input">Reorder Level</Label>
                                  <Input type="text" className="form-control" id="formrow-reorder-input" />
                            </div>
                          </div>   
                          <div className="col-md-6">
                            <div className="mb-3">
                                <Label className="form-Label">Facility</Label>
                                <select className="form-select">
                                    <option>Select One</option>
                                    <option>Facility 1</option>
                                    <option>Facility 2</option>
                                    <option>Facility 3</option>
                                    <option>Facility 4</option>
                                    <option>Facility 5</option>
                                </select>
                            </div>    
                          </div>  
                          <div className="col-md-6">
                            <div className="mb-3">
                                <Label className="form-Label">Reorder Amount</Label>
                                <Currency />
                            </div>    
                          </div>      
                          <div className="col-md-6">
                            <div className="mb-3">
                                <Label className="form-Label">Asset Class</Label>
                                <select className="form-select">
                                    <option>Select One</option>
                                    <option>Asset Class 1</option>
                                    <option>Asset Class 2</option>
                                    <option>Asset Class 3</option>
                                    <option>Asset Class 4</option>
                                    <option>Asset Class 5</option>
                                </select>
                            </div>    
                          </div>  
                          <div className="col-md-6">
                            <div className="mb-3">
                                <Label className="form-Label">Unit Cost ($)</Label>
                                <Currency />
                            </div>    
                          </div>   
                          <div className="col-md-6"> 
                            <div className="mb-3">
                                  <Label className="form-label" htmlFor="formrow-quantity-input">Initial Quantity</Label>
                                  <Input type="text" className="form-control" id="formrow-quantity-input" />
                            </div>
                          </div>   
                          <div className="col-md-12">
                            <div className="mb-3">
                              <label
                                htmlFor="basicpill-address-input"
                                className="form-label"
                              >
                                Description
                              </label>
                              <textarea
                                id="basicpill-address-input"
                                className="form-control"
                                rows="3"
                              ></textarea>
                            </div>
                          </div>  
                          <div className="col-md-12">
                            <div className="mb-3">
                            <Label className="form-Label">Notes</Label>
                                <Editor
                                    toolbarClassName="toolbarClassName"
                                    wrapperClassName="wrapperClassName"
                                    editorClassName="editorClassName"
                                />
                            </div>     
                          </div> 
                          <div className="col-md-12">
                            <div className="text-end">
                              <button
                                type="submit"
                                className="btn btn-success save-user"
                              >
                                Save
                              </button>
                            </div>
                          </div>
                          </div>
                          </Form>
                        </div> 
                    </Modal>
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
                                      <div className="col-md-3">
                                        <div className="mb-3">
                                            <Label className="form-Label">Facility</Label>
                                            <select className="form-select">
                                                <option>Select One</option>
                                                <option>Facility 1</option>
                                                <option>Facility 2</option>
                                                <option>Facility 3</option>
                                                <option>Facility 4</option>
                                            </select>
                                        </div>    
                                      </div>
                                      <div className="col-md-3">
                                        <div className="mb-3">
                                            <Label className="form-Label">Class</Label>
                                            <select className="form-select">
                                                <option>Select One</option>
                                                <option>All</option>
                                                <option>Current</option>
                                                <option>Previous</option>
                                                <option>Inactive</option>
                                            </select>
                                        </div>    
                                      </div>
                                      <div className="col-md-3"> 
                                        <div className="mb-3">
                                              <Label className="form-label" htmlFor="formrow-Code-input">Part Code</Label>
                                              <Input type="text" className="form-control" id="formrow-Code-input" />
                                        </div>
                                      </div>
                                      <div className="col-md-3"> 
                                        <div className="mb-3">
                                              <Label className="form-label" htmlFor="formrow-area-input">Description</Label>
                                              <Input type="text" className="form-control" id="formrow-area-input" />
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
                          <th scope="col">#</th>
                          <th scope="col">Facility</th>
                          <th scope="col">Class</th>
                          <th scope="col">Part Code</th>
                          <th scope="col">Description</th>
                          <th scope="col">In Stock</th>
                          <th scope="col">Adjust</th>
                          <th scope="col">Reorder Level</th>
                          <th scope="col">Unit Cost</th>
                          <th scope="col">Active</th>
                          <th scope="col">Action</th>
                        </tr>
                      </thead>
                      <tbody>
                        <tr>
                          <td>1</td>
                          <td>
                           <a href="#!"
                                onClick={() => {
                                    tog_large2()
                                }}
                                data-toggle="modal"
                                data-target=".bs-example-modal-lg"
                                >
                              Mark Jubarg
                            </a>  
                            <Modal
                        size="lg"
                        isOpen={modal_large2}
                        toggle={() => {
                            tog_large2()
                        }}
                    >
                        <div className="modal-header">
                            <h5
                                className="modal-title mt-0"
                                id="myLargeModalLabel"
                            >
                                View Parts
                            </h5>
                            <button
                                onClick={() => {
                                    setmodal_large2(false)
                                }}
                                type="button"
                                className="close"
                                data-dismiss="modal"
                                aria-label="Close"
                            >
                                <span aria-hidden="true">&times;</span>
                            </button>
                        </div>
                        <div className="modal-body">
                        <Form>
                        <div className="row align-items-center">
                          <div className="col-md-6"> 
                            <div className="mb-3">
                                  <Label className="form-label" htmlFor="formrow-code-input">Part Code</Label>
                                  <Input type="text" className="form-control" value="1234" id="formrow-code-input" readOnly />
                                  
                            </div>
                          </div>
                          <div className="col-md-6">
                            <div className="mb-3">
                                <Label className="form-Label">Default Vendor</Label>
                                <Input type="text" className="form-control" value="Vendor1" id="formrow-vendor-input" readOnly />
                            </div>    
                          </div>      
                          <div className="col-md-6">
                            <div className="mb-3">
                                <Label className="form-Label">Status</Label>
                                <Input type="text" className="form-control" value="Active" id="formrow-status-input" readOnly />
                            </div>    
                          </div> 
                          <div className="col-md-6"> 
                            <div className="mb-3">
                                  <Label className="form-label" htmlFor="formrow-reorder-input">Reorder Level</Label>
                                  <Input type="text" className="form-control" value="12" id="formrow-reorder-input" readOnly />
                            </div>
                          </div>   
                          <div className="col-md-6">
                            <div className="mb-3">
                                <Label className="form-Label">Facility</Label>
                                <Input type="text" className="form-control" value="Facility 1" id="formrow-facility-input" readOnly />
                            </div>    
                          </div>  
                          <div className="col-md-6">
                            <div className="mb-3">
                                <Label className="form-Label">Reorder Amount</Label>
                                <Input type="text" className="form-control" value="100$" id="formrow-amount-input" readOnly />
                            </div>    
                          </div>      
                          <div className="col-md-6">
                            <div className="mb-3">
                                <Label className="form-Label">Asset Class</Label>
                                <Input type="text" className="form-control" value="Asset Class 1" id="formrow-asset-input" readOnly />
                            </div>    
                          </div>  
                          <div className="col-md-6">
                            <div className="mb-3">
                                <Label className="form-Label">Unit Cost ($)</Label>
                                <Input type="text" className="form-control" value="100$" id="formrow-cost-input" readOnly />
                            </div>    
                          </div>   
                          <div className="col-md-6"> 
                            <div className="mb-3">
                                  <Label className="form-label" htmlFor="formrow-quantity-input">Initial Quantity</Label>
                                  <Input type="text" className="form-control" value="100" id="formrow-quantity-input" readOnly />
                            </div>
                          </div>   
                          <div className="col-md-12">
                            <div className="mb-3">
                              <label
                                htmlFor="basicpill-address-input"
                                className="form-label"
                              >
                                Description
                              </label>
                              <textarea
                                id="basicpill-address-input"
                                className="form-control"
                                rows="3"
                                readOnly
                                placeholder="Lorem Ipsum is simply dummy text of the printing and typesetting industry.
                                Lorem Ipsum has been the industry's standard dummy text ever since the 1500s, when an 
                                unknown printer took a galley of type and scrambled it to make a type specimen book."
                              ></textarea>
                            </div>
                          </div>  
                          <div className="col-md-12">
                            <div className="mb-3">
                            <Label className="form-Label">Notes</Label>
                            <textarea
                                id="basicpill-notes-input"
                                className="form-control"
                                rows="3"
                                readOnly
                                placeholder="Lorem Ipsum is simply dummy text of the printing and typesetting industry.
                                Lorem Ipsum has been the industry's standard dummy text ever since the 1500s, when an 
                                unknown printer took a galley of type and scrambled it to make a type specimen book."
                              ></textarea>
                            </div>     
                          </div> 
                          </div>
                          </Form>                
                        </div> 
                     </Modal>
                          </td>
                          <td>12</td>
                          <td>131415</td>
                          <td>It is a long established fact.</td>
                          <td>In Stock</td>
                          <td>Adjust</td>
                          <td>13121</td>
                          <td>5555$</td>
                          <td>Yes</td>
                          <td>
                            <div className="d-flex gap-3">
                              <Link className="text-success" to="#">
                                <i
                                  className="mdi mdi-pencil font-size-18"
                                  id="edittooltip"
                                  onClick={() => {
                                      tog_large()
                                  }}
                                  data-toggle="modal"
                                  data-target=".bs-example-modal-lg"
                                ></i>
                              </Link>
                              <Link className="text-danger" to="#">
                                <i
                                  className="mdi mdi-delete font-size-18"
                                  id="deletetooltip"
                                  onClick={() => {
                                    setmodal_large(false)
                                }}
                                ></i>
                              </Link>
                            </div>
                          </td>    
                        </tr>
                        <tr>
                          <td>2</td>
                          <td> <a href="#!"
                                onClick={() => {
                                    tog_large2()
                                }}
                                data-toggle="modal"
                                data-target=".bs-example-modal-lg"
                                >
                              Mark Jubarg
                            </a>  </td>  
                          <td>12</td>
                          <td>131415</td>
                          <td>It is a long established fact.</td>
                          <td>In Stock</td>
                          <td>Adjust</td>
                          <td>13121</td>
                          <td>5555$</td>
                          <td>Yes</td>
                          <td>
                            <div className="d-flex gap-3">
                              <Link className="text-success" to="#">
                                <i
                                  className="mdi mdi-pencil font-size-18"
                                  id="edittooltip"
                                  onClick={() => {
                                      tog_large()
                                  }}
                                  data-toggle="modal"
                                  data-target=".bs-example-modal-lg"
                                ></i>
                              </Link>
                              <Link className="text-danger" to="#">
                                <i
                                  className="mdi mdi-delete font-size-18"
                                  id="deletetooltip"
                                  onClick={() => {
                                    setmodal_large(false)
                                }}
                                ></i>
                              </Link>
                            </div>
                          </td>    
                        </tr>
                        <tr>
                          <td>3</td>
                          <td> <a href="#!"
                                onClick={() => {
                                    tog_large2()
                                }}
                                data-toggle="modal"
                                data-target=".bs-example-modal-lg"
                                >
                              Mark Jubarg
                            </a>  </td>
                          <td>12</td>
                          <td>131415</td>
                          <td>It is a long established fact.</td>
                          <td>In Stock</td>
                          <td>Adjust</td>
                          <td>13121</td>
                          <td>5555$</td>
                          <td>Yes</td>
                          <td>
                            <div className="d-flex gap-3">
                              <Link className="text-success" to="#">
                                <i
                                  className="mdi mdi-pencil font-size-18"
                                  id="edittooltip"
                                  onClick={() => {
                                      tog_large()
                                  }}
                                  data-toggle="modal"
                                  data-target=".bs-example-modal-lg"
                                ></i>
                              </Link>
                              <Link className="text-danger" to="#">
                                <i
                                  className="mdi mdi-delete font-size-18"
                                  id="deletetooltip"
                                  onClick={() => {
                                    setmodal_large(false)
                                }}
                                ></i>
                              </Link>
                            </div>
                          </td>    
                        </tr>
                        <tr>
                          <td>4</td>
                          <td> <a href="#!"
                                onClick={() => {
                                    tog_large2()
                                }}
                                data-toggle="modal"
                                data-target=".bs-example-modal-lg"
                                >
                              Mark Jubarg
                            </a>  </td>
                          <td>12</td>
                          <td>131415</td>
                          <td>It is a long established fact.</td>
                          <td>In Stock</td>
                          <td>Adjust</td>
                          <td>13121</td>
                          <td>5555$</td>
                          <td>Yes</td>
                          <td>
                            <div className="d-flex gap-3">
                              <Link className="text-success" to="#">
                                <i
                                  className="mdi mdi-pencil font-size-18"
                                  id="edittooltip"
                                  onClick={() => {
                                      tog_large()
                                  }}
                                  data-toggle="modal"
                                  data-target=".bs-example-modal-lg"
                                ></i>
                              </Link>
                              <Link className="text-danger" to="#">
                                <i
                                  className="mdi mdi-delete font-size-18"
                                  id="deletetooltip"
                                  onClick={() => {
                                    setmodal_large(false)
                                }}
                                ></i>
                              </Link>
                            </div>
                          </td>    
                        </tr>
                        <tr>
                          <td>5</td>
                          <td> <a href="#!"
                                onClick={() => {
                                    tog_large2()
                                }}
                                data-toggle="modal"
                                data-target=".bs-example-modal-lg"
                                >
                              Mark Jubarg
                            </a>  </td>
                          <td>12</td>
                          <td>131415</td>
                          <td>It is a long established fact.</td>
                          <td>In Stock</td>
                          <td>Adjust</td>
                          <td>13121</td>
                          <td>5555$</td>
                          <td>Yes</td>
                          <td>
                            <div className="d-flex gap-3">
                              <Link className="text-success" to="#">
                                <i
                                  className="mdi mdi-pencil font-size-18"
                                  id="edittooltip"
                                  onClick={() => {
                                      tog_large()
                                  }}
                                  data-toggle="modal"
                                  data-target=".bs-example-modal-lg"
                                ></i>
                              </Link>
                              <Link className="text-danger" to="#">
                                <i
                                  className="mdi mdi-delete font-size-18"
                                  id="deletetooltip"
                                  onClick={() => {
                                    setmodal_large(false)
                                }}
                                ></i>
                              </Link>
                            </div>
                          </td>    
                        </tr>
                        <tr>
                          <td>6</td>
                          <td> <a href="#!"
                                onClick={() => {
                                    tog_large2()
                                }}
                                data-toggle="modal"
                                data-target=".bs-example-modal-lg"
                                >
                              Mark Jubarg
                            </a>  </td>
                          <td>12</td>
                          <td>131415</td>
                          <td>It is a long established fact.</td>
                          <td>In Stock</td>
                          <td>Adjust</td>
                          <td>13121</td>
                          <td>5555$</td>
                          <td>Yes</td>
                          <td>
                            <div className="d-flex gap-3">
                              <Link className="text-success" to="#">
                                <i
                                  className="mdi mdi-pencil font-size-18"
                                  id="edittooltip"
                                  onClick={() => {
                                      tog_large()
                                  }}
                                  data-toggle="modal"
                                  data-target=".bs-example-modal-lg"
                                ></i>
                              </Link>
                              <Link className="text-danger" to="#">
                                <i
                                  className="mdi mdi-delete font-size-18"
                                  id="deletetooltip"
                                  onClick={() => {
                                    setmodal_large(false)
                                }}
                                ></i>
                              </Link>
                            </div>
                          </td>    
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
export default Assets
