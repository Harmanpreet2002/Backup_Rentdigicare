import React from "react";
import MetaTags from 'react-meta-tags';
import {
  Row,
  Col,
  Card,
  CardBody,
  CardHeader,
  Label,
  Input
} from "reactstrap"

//Import Breadcrumb
import Breadcrumbs from "../../components/Common/Breadcrumb"

const Address = () => {

  return (
    <React.Fragment>
      <div className="page-content">
        <MetaTags>
          <title> Rentdigicare | Company Profile</title>
        </MetaTags>
        <div className="container-fluid">
          <Breadcrumbs title="Home" breadcrumbItem="Company Profile" />
          <Row>
            <Col xl={12}>
              <Card>
                <CardHeader>
                    <h4 className="card-title">Company Profile Details</h4>
                </CardHeader>
                <CardBody>
                    <div className="row align-items-center">
                    <div class="col-lg-6">
                            <div className="mb-3">
                                <Label className="form-label" htmlFor="formrow-companyname-input">Company name</Label>
                                <Input type="text" className="form-control" id="formrow-companyname-input" />
                            </div>
                        </div>
                        <div class="col-lg-6">
                            <div className="mb-3">
                                <Label className="form-label" htmlFor="formrow-address-input">Address1</Label>
                                <Input type="text" className="form-control" id="formrow-address-input" />
                            </div>
                        </div>
                        <div class="col-lg-6">
                            <div className="mb-3">
                                <Label className="form-label" htmlFor="formrow-address-input">Address2</Label>
                                <Input type="text" className="form-control" id="formrow-address-input" />
                            </div>
                        </div>
                        <div class="col-lg-6">
                            <div className="mb-3">
                                <Label className="form-label" htmlFor="formrow-city-input">City</Label>
                                <Input type="text" className="form-control" id="formrow-city-input" />
                            </div>
                        </div>
                        <div class="col-lg-6">
                            <div className="mb-3">
                                <Label className="form-label" htmlFor="formrow-state-input">State/Province</Label>
                                <Input type="text" className="form-control" id="formrow-state-input" />
                            </div>
                        </div>
                        <div class="col-lg-6">
                            <div className="mb-3">
                                <Label className="form-label" htmlFor="formrow-postal-input">Postal/Zip Code</Label>
                                <Input type="text" className="form-control" id="formrow-postal-input" />
                            </div>
                        </div>
                        <div class="col-lg-6">
                            <div className="mb-3">
                                <Label className="form-label" htmlFor="formrow-telephone-input">Telephone 1</Label>
                                <Input type="text" className="form-control" id="formrow-telephone-input" />
                            </div>
                        </div>
                        <div class="col-lg-6">
                            <div className="mb-3">
                                <Label className="form-label" htmlFor="formrow-telephone-input">Telephone 2</Label>
                                <Input type="text" className="form-control" id="formrow-telephone-input" />
                            </div>
                        </div>
                        <div class="col-lg-6">
                            <div className="mb-3">
                                <Label className="form-label" htmlFor="formrow-fax-input">Fax</Label>
                                <Input type="text" className="form-control" id="formrow-fax-input" />
                            </div>
                        </div>
                        <div class="col-lg-6">
                            <div className="mb-3">
                                <Label className="form-label" htmlFor="formrow-businessemail-input">Business Email</Label>
                                <Input type="text" className="form-control" id="formrow-businessemail-input" />
                            </div>
                        </div>
                        <div class="col-lg-12">
                            <div className="mt-4">
                                <button type="submit" className="btn btn-primary mr-10 w-md">Submit</button>
                                <button type="submit" className="btn btn-secondary w-md">Cancel</button>
                            </div>
                        </div>
                    </div>
                </CardBody>
              </Card>
            </Col>
          </Row>
        </div>
      </div>
    </React.Fragment>
  )
}

export default Address
