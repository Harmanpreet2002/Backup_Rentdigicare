import React, { useState } from "react";
import MetaTags from 'react-meta-tags';
import Select from "react-select";
import { Link } from "react-router-dom"
import {
  Table,
  Row,
  Col,
  Card,
  CardBody,
  CardText,
  Modal,
  CardHeader,
  Label,
  Form,
  Nav,
  NavItem,
  NavLink,
  TabContent,
  TabPane,
  Pagination,
  PaginationItem,
  Collapse,
  PaginationLink,
  Input
} from "reactstrap"
// Form Editor
import { Editor } from "react-draft-wysiwyg"
import "react-draft-wysiwyg/dist/react-draft-wysiwyg.css"

// Form Mask
import InputMask from "react-input-mask"

//Import Breadcrumb
import Breadcrumbs from "../../components/Common/Breadcrumb"
import classnames from "classnames"

const Schedule = () => {
  const [customActiveTab, setcustomActiveTab] = useState("1")


    const DUR = props => (
        <InputMask
          mask="99.99"
          value={props.value}
          className="form-control input-color"
          onChange={props.onChange}
        >
        </InputMask>
    )  

    const optionMulti = [
      { label: "Choice 1", value: "choice-1" },
      { label: "Choice 2", value: "choice-2" },
      { label: "Choice 3", value: "choice-3" }
    ]

  const [col5, setcol5] = useState(false) 
  const t_col5 = () => {
      setcol5(!col5)
  }
    const [modal_large, setmodal_large] = useState(false);

    function removeBodyCss() {
        document.body.classList.add("no_padding")
    }

    function tog_large() {
        setmodal_large(!modal_large)
         removeBodyCss()
     }

  const toggleCustom = tab => {
      if (customActiveTab !== tab) {
          setcustomActiveTab(tab)
      }
  }
  
  return (
    <React.Fragment>
      <div className="page-content">
        <MetaTags>
          <title>Rentdigicare | Schedule</title>
        </MetaTags>
        <div className="container-fluid">
          <Breadcrumbs title="Home" breadcrumbItem="Schedule" />
          <Row>
            <Col xl={12}>
              <Card>
        
              <CardHeader>
                <div className="row align-items-center">
                  <div className="col-md-6">
                     <div className="mb">
                        <h5 className="card-title">Schedule<span className="text-muted fw-normal ms-2">(5)</span></h5>
                      </div>
                  </div>
                  <div className="col-md-6 d-flex flex-wrap align-items-center justify-content-end">
                    <div className="mb">
                    <button
                        onClick={t_col5}
                        className="btn btn-primary mo-mb-2 mr-10"
                        type="button"
                        style={{ cursor: "pointer" }}
                    >
                        Filters
                    </button>  
                    <button
                        type="button"
                        onClick={() => {
                            tog_large()
                        }}
                        className="btn btn-light "
                        data-toggle="modal"
                        data-target=".bs-example-modal-lg"
                    >
                        <i className="bx bx-plus me-1"></i>Add Schedule
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
                                Add Schedule
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
                              <div className="col-md-12">
                                  <Nav tabs className="nav-tabs-custom nav-justified">
                                      <NavItem>
                                          <NavLink
                                              style={{ cursor: "pointer" }}
                                              className={classnames({
                                                  active: customActiveTab === "1",
                                              })}
                                              onClick={() => {
                                                  toggleCustom("1")
                                              }}
                                          >
                                              <span className="d-block d-sm-none">
                                                  <i className="fas fa-home"></i>
                                              </span>
                                              <span className="d-none d-sm-block">Overview</span>
                                          </NavLink>
                                      </NavItem>
                                      <NavItem>
                                          <NavLink
                                              style={{ cursor: "pointer" }}
                                              className={classnames({
                                                  active: customActiveTab === "2",
                                              })}
                                              onClick={() => {
                                                  toggleCustom("2")
                                              }}
                                          >
                                              <span className="d-block d-sm-none">
                                                  <i className="fas fa-home"></i>
                                              </span>
                                              <span className="d-none d-sm-block">Trigger Date/Schedule</span>
                                          </NavLink>
                                      </NavItem>
                                      <NavItem>
                                          <NavLink
                                              style={{ cursor: "pointer" }}
                                              className={classnames({
                                                  active: customActiveTab === "3",
                                              })}
                                              onClick={() => {
                                                  toggleCustom("3")
                                              }}
                                          >
                                              <span className="d-block d-sm-none">
                                                  <i className="far fa-user"></i>
                                              </span>
                                              <span className="d-none d-sm-block">Initial Notes</span>
                                          </NavLink>
                                      </NavItem>
                                  </Nav>

                                  <TabContent
                                      activeTab={customActiveTab}
                                      className="p-3 text-muted"
                                  >
                                      <TabPane tabId="1">
                                          <Row>
                                              <Col md="12">
                                                  <CardText className="mb-0">
                                                      <div className="row">    
                                                          <div className="col-md-6">
                                                              <div className="mb-3">
                                                                  <Label className="form-label" htmlFor="formrow-task-input">Task Title</Label>
                                                                  <Input type="text" className="form-control" id="formrow-task-input" />
                                                              </div>
                                                          </div>
                                                          <div className="col-md-6">
                                                            <div className="mb-3">
                                                                <Label className="form-Label">Company</Label>
                                                                <select className="form-select">
                                                                    <option>Select One</option>
                                                                    <option>Company 1</option>
                                                                    <option>Company 2</option>
                                                                    <option>Company 3</option>
                                                                    <option>Company 4</option>
                                                                </select>
                                                            </div>  
                                                          </div>
                                                          <div className="col-md-6">
                                                            <div className="mb-3">
                                                                <Label className="form-Label">Area</Label>
                                                                <select className="form-select">
                                                                    <option>Select One</option>
                                                                    <option>Area 1</option>
                                                                    <option>Area 2</option>
                                                                    <option>Area 3</option>
                                                                    <option>Area 4</option>
                                                                </select>
                                                            </div>  
                                                          </div>
                                                          <div className="col-md-6">
                                                            <div className="mb-3">
                                                                <Label className="form-Label">Task Type</Label>
                                                                <select className="form-select">
                                                                    <option>Select One</option>
                                                                    <option>Type 1</option>
                                                                    <option>Type 2</option>
                                                                    <option>Type 3</option>
                                                                    <option>Type 4</option>
                                                                </select>
                                                            </div>  
                                                          </div>
                                                          <div className="col-md-6">
                                                            <div className="mb-3">
                                                                <Label className="form-Label">Task Class</Label>
                                                                <select className="form-select">
                                                                    <option>Select One</option>
                                                                    <option>Class 1</option>
                                                                    <option>Class 2</option>
                                                                    <option>Class 3</option>
                                                                    <option>Class 4</option>
                                                                </select>
                                                            </div>  
                                                          </div>
                                                          <div className="col-md-6">
                                                              <div className="mb-3">
                                                                  <Label className="form-label" htmlFor="formrow-room-input">Room</Label>
                                                                  <Input type="text" className="form-control" id="formrow-room-input" />
                                                              </div>
                                                          </div>
                                                          <div className="col-md-12">
                                                              <div className="mb-3">
                                                                  <Label className="form-label" htmlFor="formrow-comment-input">Comments</Label>
                                                                  <Input type="text" className="form-control" id="formrow-comment-input" />
                                                              </div>
                                                          </div>
                                                          <div className="col-md-6">
                                                            <div className="mb-3">
                                                                <Label className="form-Label">Duration (H/m)</Label>
                                                                <div class="row">
                                                                    <div class="col-md-8">
                                                                        <div className="mb-3">
                                                                            <Input type="text" className="form-control" id="formrow-code-input" />
                                                                        </div>   
                                                                    </div>
                                                                    <div class="col-md-4">
                                                                        <div className="mb-3">
                                                                            <select className="form-select">
                                                                                <option>Select</option>
                                                                                <option>00</option>
                                                                                <option>01</option>
                                                                                <option>02</option>
                                                                                <option>03</option>
                                                                                <option>04</option>
                                                                                <option>05</option>
                                                                                <option>06</option>
                                                                                <option>07</option>
                                                                                <option>08</option>
                                                                                <option>09</option>
                                                                                <option>10</option>
                                                                                <option>11</option>
                                                                                <option>12</option>
                                                                                <option>13</option>
                                                                                <option>14</option>
                                                                                <option>15</option>
                                                                                <option>16</option>
                                                                                <option>17</option>
                                                                                <option>18</option>
                                                                                <option>19</option>
                                                                                <option>20</option>
                                                                                <option>21</option>
                                                                                <option>22</option>
                                                                                <option>23</option>
                                                                                <option>24</option>
                                                                                <option>25</option>
                                                                                <option>26</option>
                                                                                <option>27</option>
                                                                                <option>28</option>
                                                                                <option>29</option>
                                                                                <option>30</option>
                                                                                <option>31</option>
                                                                                <option>32</option>
                                                                                <option>33</option>
                                                                                <option>34</option>
                                                                                <option>35</option>
                                                                                <option>36</option>
                                                                                <option>37</option>
                                                                                <option>38</option>
                                                                                <option>39</option>
                                                                                <option>40</option>
                                                                                <option>41</option>
                                                                                <option>35</option>
                                                                                <option>36</option>
                                                                                <option>37</option>
                                                                                <option>38</option>
                                                                                <option>39</option>
                                                                                <option>40</option>
                                                                                <option>41</option>
                                                                                <option>35</option>
                                                                                <option>36</option>
                                                                                <option>37</option>
                                                                                <option>38</option>
                                                                                <option>39</option>
                                                                                <option>40</option>
                                                                                <option>41</option>
                                                                                <option>42</option>
                                                                                <option>43</option>
                                                                                <option>44</option>
                                                                                <option>45</option>
                                                                                <option>46</option>
                                                                                <option>47</option>
                                                                                <option>48</option>
                                                                                <option>49</option>
                                                                                <option>50</option>
                                                                                <option>51</option>
                                                                                <option>52</option>
                                                                                <option>53</option>
                                                                                <option>54</option>
                                                                                <option>55</option>
                                                                                <option>56</option>
                                                                                <option>57</option>
                                                                                <option>58</option>
                                                                                <option>59</option>
                                                                            </select>
                                                                        </div>
                                                                    </div>
                                                                </div>
                                                            </div>    
                                                          </div>
                                                      </div>
                                                  </CardText>
                                              </Col>
                                          </Row>
                                      </TabPane>
                                      <TabPane tabId="2">
                                          <Row>
                                              <Col md="12">
                                                  <CardText className="mb-0">
                                                      <div className="row">    
                                                          <div className="col-md-12">
                                                              <div className="mb-3">
                                                                <div className="form-check">
                                                                    <input className="form-check-input" type="radio" name="formRadios"
                                                                        id="formRadios1" defaultChecked />
                                                                    <label className="form-check-label" htmlFor="formRadios1">
                                                                          One Time
                                                                    </label>
                                                                </div>
                                                              </div>
                                                              <div className="mb-3">
                                                                  <Label htmlFor="example-datetime-local-input" className="form-Label">Date and time</Label>
                                                                  <Input className="form-control" type="datetime-local" defaultValue="2019-08-19T13:45:00" id="example-datetime-local-input" />
                                                              </div>
                                                          </div>
                                                          <div className="col-md-12">
                                                              <div className="mb-3">
                                                                <div className="form-check">
                                                                    <input className="form-check-input" type="radio" name="formRadios"
                                                                        id="formRadios2" />
                                                                    <label className="form-check-label" htmlFor="formRadios2">
                                                                         Every Week Day
                                                                    </label>
                                                                </div>
                                                              </div>
                                                              <div className="row">
                                                              <Label className="form-Label">Day</Label>
                                                                  <div class="col-md-1">
                                                                      <div className="form-check mb-3">
                                                                        <input className="form-check-input" type="checkbox" id="formCheck1"/>
                                                                        <label className="form-check-label" htmlFor="formCheck1">
                                                                             Mon
                                                                        </label>
                                                                      </div>
                                                                  </div>
                                                                  <div class="col-md-1">
                                                                     <div className="form-check mb-3">
                                                                        <input className="form-check-input" type="checkbox" id="formCheck2"/>
                                                                        <label className="form-check-label" htmlFor="formCheck2">
                                                                            Tue
                                                                        </label>
                                                                      </div>
                                                                  </div>
                                                                  <div class="col-md-1">
                                                                      <div className="form-check mb-3">
                                                                        <input className="form-check-input" type="checkbox" id="formCheck3"/>
                                                                        <label className="form-check-label" htmlFor="formCheck3">
                                                                            Wed
                                                                        </label>
                                                                      </div>
                                                                  </div>
                                                                  <div class="col-md-1">
                                                                     <div className="form-check mb-3">
                                                                        <input className="form-check-input" type="checkbox" id="formCheck4"/>
                                                                        <label className="form-check-label" htmlFor="formCheck4">
                                                                             Thu
                                                                        </label>
                                                                      </div>
                                                                  </div>
                                                                  <div class="col-md-1">
                                                                      <div className="form-check mb-3">
                                                                        <input className="form-check-input" type="checkbox" id="formCheck5"/>
                                                                        <label className="form-check-label" htmlFor="formCheck5">
                                                                            Fri
                                                                        </label>
                                                                      </div>
                                                                  </div>
                                                                  <div class="col-md-1">
                                                                      <div className="form-check mb-3">
                                                                        <input className="form-check-input" type="checkbox" id="formCheck6"/>
                                                                        <label className="form-check-label" htmlFor="formCheck6">
                                                                            Sat
                                                                        </label>
                                                                      </div>
                                                                  </div>
                                                                  <div class="col-md-1">
                                                                      <div className="form-check mb-3">
                                                                        <input className="form-check-input" type="checkbox" id="formCheck7"/>
                                                                        <label className="form-check-label" htmlFor="formCheck7">
                                                                            Sun
                                                                        </label>
                                                                      </div>
                                                                  </div>
                                                                  <div class="col-md-1">
                                                                      <div className="form-check mb-3">
                                                                        <input className="form-check-input" type="checkbox" id="formCheck8"/>
                                                                        <label className="form-check-label" htmlFor="formCheck8">
                                                                            All
                                                                        </label>
                                                                      </div>
                                                                  </div>
                                                              </div>

                                                              <div className="row">
                                                              <Label className="form-Label">Month</Label>
                                                                  <div class="col-md-1">
                                                                      <div className="form-check mb-3">
                                                                        <input className="form-check-input" type="checkbox" id="formCheck01"/>
                                                                        <label className="form-check-label" htmlFor="formCheck01">
                                                                            Jan
                                                                        </label>
                                                                      </div>
                                                                  </div>
                                                                  <div class="col-md-1">
                                                                     <div className="form-check mb-3">
                                                                        <input className="form-check-input" type="checkbox" id="formCheck02"/>
                                                                        <label className="form-check-label" htmlFor="formCheck02">
                                                                            Feb
                                                                        </label>
                                                                      </div>
                                                                  </div>
                                                                  <div class="col-md-1">
                                                                      <div className="form-check mb-3">
                                                                        <input className="form-check-input" type="checkbox" id="formCheck03"/>
                                                                        <label className="form-check-label" htmlFor="formCheck03">
                                                                             Mar
                                                                        </label>
                                                                      </div>
                                                                  </div>
                                                                  <div class="col-md-1">
                                                                     <div className="form-check mb-3">
                                                                        <input className="form-check-input" type="checkbox" id="formCheck04"/>
                                                                        <label className="form-check-label" htmlFor="formCheck04">
                                                                            Apr
                                                                        </label>
                                                                      </div>
                                                                  </div>
                                                                  <div class="col-md-1">
                                                                      <div className="form-check mb-3">
                                                                        <input className="form-check-input" type="checkbox" id="formCheck05"/>
                                                                        <label className="form-check-label" htmlFor="formCheck05">
                                                                            May
                                                                        </label>
                                                                      </div>
                                                                  </div>
                                                                  <div class="col-md-1">
                                                                      <div className="form-check mb-3">
                                                                        <input className="form-check-input" type="checkbox" id="formCheck06"/>
                                                                        <label className="form-check-label" htmlFor="formCheck06">
                                                                            Jun
                                                                        </label>
                                                                      </div>
                                                                  </div>
                                                                  <div class="col-md-1">
                                                                      <div className="form-check mb-3">
                                                                        <input className="form-check-input" type="checkbox" id="formCheck07"/>
                                                                        <label className="form-check-label" htmlFor="formCheck07">
                                                                            Jul
                                                                        </label>
                                                                      </div>
                                                                  </div>
                                                                  <div class="col-md-1">
                                                                      <div className="form-check mb-3">
                                                                        <input className="form-check-input" type="checkbox" id="formCheck08"/>
                                                                        <label className="form-check-label" htmlFor="formCheck08">
                                                                            Aug
                                                                        </label>
                                                                      </div>
                                                                  </div>
                                                                  <div class="col-md-1">
                                                                      <div className="form-check mb-3">
                                                                        <input className="form-check-input" type="checkbox" id="formCheck09"/>
                                                                        <label className="form-check-label" htmlFor="formCheck09">
                                                                            Sep
                                                                        </label>
                                                                      </div>
                                                                  </div>
                                                                  <div class="col-md-1">
                                                                      <div className="form-check mb-3">
                                                                        <input className="form-check-input" type="checkbox" id="formCheck010"/>
                                                                        <label className="form-check-label" htmlFor="formCheck010">
                                                                            Oct
                                                                        </label>
                                                                      </div>
                                                                  </div>
                                                                  <div class="col-md-1">
                                                                      <div className="form-check mb-3">
                                                                        <input className="form-check-input" type="checkbox" id="formCheck011"/>
                                                                        <label className="form-check-label" htmlFor="formCheck011">
                                                                            Nov
                                                                        </label>
                                                                      </div>
                                                                  </div>
                                                                  <div class="col-md-1">
                                                                      <div className="form-check mb-3">
                                                                        <input className="form-check-input" type="checkbox" id="formCheck012"/>
                                                                        <label className="form-check-label" htmlFor="formCheck012">
                                                                           Dec
                                                                        </label>
                                                                      </div>
                                                                  </div>
                                                                  <div class="col-md-1">
                                                                      <div className="form-check mb-3">
                                                                        <input className="form-check-input" type="checkbox" id="formCheck013"/>
                                                                        <label className="form-check-label" htmlFor="formCheck013">
                                                                           All
                                                                        </label>
                                                                      </div>
                                                                  </div>
                                                              </div>
                                                          </div>
                                                          <div className="col-md-12">
                                                              <div className="mb-3">
                                                                <div className="form-check">
                                                                    <input className="form-check-input" type="radio" name="formRadios"
                                                                        id="formRadios12" defaultChecked />
                                                                    <label className="form-check-label" htmlFor="formRadios12">
                                                                         Day of Month
                                                                    </label>
                                                                </div>
                                                              </div>
                                                              <div className="mb-3">
                                                                  <select className="form-select">
                                                                      <option>Select One</option>
                                                                      <option>1st</option>
                                                                      <option>2nd</option>
                                                                      <option>3rd</option>
                                                                      <option>4th</option>
                                                                      <option>5th</option>
                                                                      <option>6th</option>
                                                                      <option>7th</option>
                                                                      <option>8th</option>
                                                                      <option>9th</option>
                                                                      <option>10th</option>
                                                                      <option>11th</option>
                                                                      <option>12th</option>
                                                                      <option>13th</option>
                                                                      <option>14th</option>
                                                                      <option>15th</option>
                                                                      <option>16th</option>
                                                                      <option>17th</option>
                                                                      <option>18th</option>
                                                                      <option>19th</option>
                                                                      <option>20th</option>
                                                                      <option>21st</option>
                                                                      <option>22nd</option>
                                                                      <option>23rd</option>
                                                                      <option>24th</option>
                                                                      <option>25th</option>
                                                                      <option>26th</option>
                                                                      <option>27th</option>
                                                                      <option>28th</option> 
                                                                      <option>29th</option>
                                                                      <option>30th</option>
                                                                      <option>31st</option>
                                                                  </select>
                                                            </div>
                                                          </div>
                                                          <div className="col-md-12">
                                                              <div className="mb-3">
                                                                <div className="form-check">
                                                                    <input className="form-check-input" type="radio" name="formRadios"
                                                                        id="formRadios13" defaultChecked />
                                                                    <label className="form-check-label" htmlFor="formRadios13">
                                                                         Week Day
                                                                    </label>
                                                                </div>
                                                              </div>
                                                              <div className="mb-3">
                                                                  <div class="row">
                                                                      <div class="col-md-6">
                                                                          <select className="form-select">
                                                                              <option>Select</option>
                                                                              <option>1st</option>
                                                                              <option>2nd</option>
                                                                              <option>3rd</option>
                                                                              <option>4th</option>
                                                                              <option>5th</option>
                                                                          </select>
                                                                      </div>
                                                                      <div class="col-md-6">
                                                                          <select className="form-select">
                                                                              <option>Select</option>
                                                                              <option>Monday</option>
                                                                              <option>Tuesday</option>
                                                                              <option>Wednesday</option>
                                                                              <option>Thursday</option>
                                                                              <option>Friday</option>
                                                                              <option>Saturday</option>
                                                                              <option>Sunday</option>
                                                                          </select>
                                                                      </div>
                                                                  </div>
                                                              </div>
                                                          </div>
                                                          <div className="col-md-12">
                                                              <div className="mb-3">
                                                                <div className="form-check">
                                                                    <input className="form-check-input" type="radio" name="formRadios"
                                                                        id="formRadios14" defaultChecked />
                                                                    <label className="form-check-label" htmlFor="formRadios14">
                                                                        The last day of the Month
                                                                    </label>
                                                                </div>
                                                              </div>
                                                          </div>
                                                          <div className="col-md-12">
                                                              <div className="mb-3">
                                                                <div className="form-check">
                                                                    <input className="form-check-input" type="radio" name="formRadios"
                                                                        id="formRadios14" defaultChecked />
                                                                    <label className="form-check-label" htmlFor="formRadios14">
                                                                         Every
                                                                    </label>
                                                                </div> 
                                                              </div>
                                                              <div className="mb-3">
                                                                <div class="row">
                                                                    <div class="col-md-4">
                                                                      <Label className="form-label" htmlFor="formrow-room-input">Days</Label>
                                                                       <select className="form-select">
                                                                            <option>Select</option>
                                                                            <option>1</option>
                                                                            <option>2</option>
                                                                            <option>3</option>
                                                                            <option>4</option>
                                                                            <option>5</option>
                                                                            <option>6</option>
                                                                            <option>7</option>
                                                                            <option>8</option>
                                                                            <option>9</option>
                                                                            <option>10</option>
                                                                            <option>11</option>
                                                                            <option>12</option>
                                                                            <option>13</option>
                                                                            <option>14</option>
                                                                            <option>15</option> 
                                                                            <option>16</option> 
                                                                            <option>17</option>
                                                                            <option>18</option> 
                                                                            <option>19</option> 
                                                                            <option>20</option>
                                                                            <option>21</option>
                                                                            <option>22</option>
                                                                            <option>23</option>
                                                                            <option>24</option>
                                                                            <option>25</option>
                                                                            <option>26</option>
                                                                            <option>27</option>
                                                                            <option>28</option>
                                                                            <option>29</option>
                                                                            <option>30</option>
                                                                            <option>31</option>
                                                                        </select>
                                                                    </div>
                                                                    <div class="col-md-4">
                                                                      <div>
                                                                          <Label htmlFor="example-date-input" className="form-Label">Starting on</Label>
                                                                          <Input className="form-control" type="date" defaultValue="2019-08-19" id="example-date-input" />
                                                                      </div>
                                                                    </div>
                                                                </div>
                                                                
                                                              </div>
                                                          </div>
                                                      </div>
                                                  </CardText>
                                              </Col>
                                          </Row>
                                      </TabPane>
                                      <TabPane tabId="3">
                                          <Row>
                                              <Col md="12">
                                              <CardText className="mb-0">
                                                      <div className="row">    
                                                      <div className="col-md-12">
                                                          <div className="mb-3">
                                                              <Editor
                                                                  toolbarClassName="toolbarClassName"
                                                                  wrapperClassName="wrapperClassName"
                                                                  editorClassName="editorClassName"
                                                              />
                                                          </div>          
                                                      </div> 
                                                      </div>
                                                  </CardText>
                                              </Col>
                                          </Row>
                                      </TabPane>
                                  </TabContent>
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
                                            <Label className="form-Label">Company</Label>
                                            <select className="form-select">
                                                <option>Select One</option>
                                                <option>Company 1</option>
                                                <option>Company 2</option>
                                                <option>Company 3</option>
                                                <option>Company 4</option>
                                            </select>
                                        </div>    
                                      </div>
                                      <div className="col-md-3">
                                        <div className="mb-3">
                                            <Label className="form-Label">Category</Label>
                                            <select className="form-select">
                                                <option>Select One</option>
                                                <option>Category 1</option>
                                                <option>Category 2</option>
                                                <option>Category 3</option>
                                                <option>Category 4</option>
                                            </select>
                                        </div>    
                                      </div>
                                      <div className="col-md-3">
                                        <div className="mb-3">
                                            <Label className="form-Label">Type</Label>
                                            <select className="form-select">
                                                <option>Select One</option>
                                                <option>Type 1</option>
                                                <option>Type 2</option>
                                                <option>Type 3</option>
                                                <option>Type 4</option>
                                            </select>
                                        </div>    
                                      </div>
                                      <div className="col-md-3">
                                        <div className="mb-3">
                                            <Label className="form-Label">Class</Label>
                                            <select className="form-select">
                                                <option>Select One</option>
                                                <option>Class 1</option>
                                                <option>Class 2</option>
                                                <option>Class 3</option>
                                                <option>Class 4</option>
                                            </select>
                                        </div>    
                                      </div>  
                                      <div className="col-md-3">
                                        <div className="mb-3">
                                            <Label className="form-Label">Assigned To</Label>
                                            <select className="form-select">
                                                <option>Select One</option>
                                                <option>Assign 1</option>
                                                <option>Assign 2</option>
                                                <option>Assign 3</option>
                                                <option>Assign 4</option>
                                            </select>
                                        </div>    
                                      </div>  
                                      <div className="col-md-3"> 
                                        <div className="mb-3">
                                              <Label className="form-label" htmlFor="formrow-key-input">Keywords</Label>
                                              <Input type="text" className="form-control" id="formrow-key-input" />
                                        </div>
                                      </div>
                                      <div className="col-md-3">
                                        <div className="mb-3">
                                            <Label className="form-Label">Status</Label>
                                            <select className="form-select">
                                                <option>Select One</option>
                                                <option>All</option>
                                                <option>Current</option>
                                                <option>Previous</option>
                                                <option>Inactive</option>
                                            </select>
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
                          <th scope="col">Company</th>
                          <th scope="col">Category</th>
                          <th scope="col">Description</th>
                          <th scope="col">Title</th>
                          <th scope="col">Fire Date</th>
                          <th scope="col">Status</th>
                          <th scope="col">Action</th>
                        </tr>
                      </thead>
                      <tbody>
                        <tr>
                          <td>1</td>
                          <td>Rentdigi/GSK</td>
                          <td>Other</td>
                          <td>Runs on: MON in JAN,FEB At 04:00</td>
                          <td>this is a dummy task title </td>
                          <td>18/01/2022</td>
                          <td>Closed</td>
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
                          <td>Rentdigi/GSK</td>
                          <td>Other</td>
                          <td>Runs on: MON in JAN,FEB At 04:00</td>
                          <td>this is a dummy task title </td>
                          <td>18/01/2022</td>
                          <td>Closed</td>
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
                          <td>Rentdigi/GSK</td>
                          <td>Other</td>
                          <td>Runs on: MON in JAN,FEB At 04:00</td>
                          <td>this is a dummy task title </td>
                          <td>18/01/2022</td>
                          <td>Closed</td>
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
                          <td>Rentdigi/GSK</td>
                          <td>Other</td>
                          <td>Runs on: MON in JAN,FEB At 04:00</td>
                          <td>this is a dummy task title </td>
                          <td>18/01/2022</td>
                          <td>Closed</td>
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
                          <td>Rentdigi/GSK</td>
                          <td>Other</td>
                          <td>Runs on: MON in JAN,FEB At 04:00</td>
                          <td>this is a dummy task title </td>
                          <td>18/01/2022</td>
                          <td>Closed</td>
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

export default Schedule
