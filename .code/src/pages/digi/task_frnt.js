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

const TaskFrnt = () => {
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
    const [modal_large2, setmodal_large2] = useState(false); 

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
    function tog_large2() {
      setmodal_large2(!modal_large2)
       removeBodyCss()
    }
  
  return (
    <React.Fragment>
      <div className="page-content">
        <MetaTags>
          <title>Rentdigicare | Task List</title>
        </MetaTags>
        <div className="container-fluid">
          <Breadcrumbs title="Home" breadcrumbItem="Task List" />
          <Row>
            <Col xl={12}>
              <Card>
        
              <CardHeader>
                <div className="row align-items-center">
                  <div className="col-md-6">
                     <div className="mb">
                        <h5 className="card-title">Task List<span className="text-muted fw-normal ms-2">(6)</span></h5>
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
                        <i className="bx bx-plus me-1"></i>Add Task
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
                                Add Task
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
                                    <span className="d-none d-sm-block">Ticket Detail</span>
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
                                    <span className="d-none d-sm-block">Assign</span>
                                </NavLink>
                            </NavItem>
                        </Nav>
                        <TabContent
                            activeTab={customActiveTab}
                            className="p-3 text-muted"
                        >
                           <TabPane tabId="1">
                            <Form>

                                <div className="row align-items-center">
                                    <div className="col-md-4">
                                        <div className="mb-3">
                                            <Label className="form-label" htmlFor="formrow-facility-input">Company</Label>
                                            <select className="form-select">
                                                <option>Select</option>
                                                <option>Company 1</option>
                                                <option>Company 2</option>
                                                <option>Company 3</option>
                                                <option>Company 4</option>
                                                <option>Company 5</option>
                                            </select>
                                        </div>
                                    </div>
                                    <div className="col-md-4">
                                        <div className="mb-3">
                                            <Label className="form-label" htmlFor="formrow-facility-input">Status</Label>
                                            <select className="form-select">
                                                <option>Select</option>
                                                <option>New</option>
                                                <option>Closed</option>
                                                <option>Re-Opened</option>
                                                <option>Pending</option>
                                                <option>Delayed</option>
                                                <option>Excluded</option>
                                            </select>
                                        </div>
                                    </div>
                                    <div className="col-md-4">
                                        <div className="mb-3">
                                            <Label className="form-Label">Type</Label>
                                            <select className="form-select">
                                                <option>Select</option>
                                                <option>Type 1</option>
                                                <option>Type 2</option>
                                                <option>Type 3</option>
                                                <option>Type 4</option>
                                                <option>Type 5</option>
                                                <option>Type 6</option>
                                            </select>
                                        </div>    
                                    </div>
                                    <div className="col-md-4">
                                        <div className="mb-3">
                                            <Label className="form-Label">Class</Label>
                                            <select className="form-select">
                                                <option>Select</option>
                                                <option>Class 1</option>
                                                <option>Class 2</option>
                                                <option>Class 3</option>
                                                <option>Class 4</option>
                                                <option>Class 5</option>
                                                <option>Class 6</option>
                                            </select>
                                        </div>    
                                    </div>
                                    <div className="col-md-4">
                                        <div className="mb-3">
                                            <Label className="form-Label">Area</Label>
                                            <select className="form-select">
                                                <option>Select</option>
                                                <option>Area 1</option>
                                                <option>Area 2</option>
                                                <option>Area 3</option>
                                                <option>Area 4</option>
                                                <option>Area 5</option>
                                                <option>Area 6</option>
                                            </select>
                                        </div>    
                                    </div>
                                   
                                    <div className="col-md-4">
                                        <div className="mb-3">
                                            <Label className="form-label" htmlFor="formrow-room-input">Room</Label>
                                            <Input type="text" className="form-control" id="formrow-room-input" />
                                        </div>
                                    </div>
                                    <div className="col-md-4">
                                        <div className="mb-3">
                                            <Label className="form-label" htmlFor="formrow-phone-input">Phone</Label>
                                            <Input type="text" className="form-control" id="formrow-phone-input" />
                                        </div>
                                    </div>
                                    <div className="col-md-4">
                                        <div className="mb-3">
                                            <Label className="form-label" htmlFor="formrow-email-input">Email</Label>
                                            <Input type="text" className="form-control" id="formrow-email-input" />
                                        </div>
                                    </div>
                                    
                                    <div className="col-md-4">
                                        <div className="mb-3">
                                        <Label className="form-Label"></Label>    
                                            <div className="form-check">
                                                <input className="form-check-input" type="checkbox" id="formCheck22" defaultChecked/>
                                                <label className="form-check-label" htmlFor="formCheck22">
                                                    Disable Email
                                                </label>
                                            </div>
                                        </div>    
                                    </div>
                                   
                                    <div className="col-md-12">
                                        <div className="mb-3">
                                        <label
                                            htmlFor="basicpill-address-input"
                                            className="form-label"
                                        >
                                            Comments
                                        </label>
                                        <textarea
                                            id="basicpill-address-input"
                                            className="form-control"
                                            rows="3"
                                        ></textarea>
                                        </div>
                                    </div>
                                    </div> 
                                </Form>     
                            </TabPane> 
                            <TabPane tabId="2">
                            <div className="row">
                                <div className="col-md-12">
                                    <div className="mb-3">
                                    <label htmlFor="choices-multiple-default" className="form-label font-size-13 text-muted">Assign Vendor</label>
                                    <Select
                                        defaultValue={[optionMulti[1]]}
                                        isMulti
                                        options={optionMulti}
                                        className="basic-multi-select"
                                        classNamePrefix="select"
                                    />
                                    </div>
                                </div>
                                <div className="col-md-6">
                                        <div className="mb-3">
                                            <Label className="form-Label">Priority</Label>
                                            <select className="form-select">
                                                <option>Select</option>
                                                <option>Yes</option>
                                                <option>No</option>
                                            </select>
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
                                <div className="col-md-6">
                                    <div className="mb-3">
                                        <Label htmlFor="example-date-input" className="form-Label">Calender Date</Label>
                                        <Input className="form-control" type="date" defaultValue="2019-08-19" id="example-date-input" />
                                    </div>
                                </div> 
                                <div className="col-md-6">
                                    <div className="mb-3">
                                        <Label htmlFor="example-time-input" className="form-Label">Calender Time</Label>
                                        <Input className="form-control" type="time" defaultValue="13:45:00" id="example-time-input" />
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
                            </div>
                            </TabPane>           
                            </TabContent>    
                                
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
                                              <Label htmlFor="example-date-input" className="form-Label">From</Label>
                                              <Input className="form-control" type="date" defaultValue="2019-08-19" id="example-date-input" />
                                          </div>
                                      </div>  
                                      <div className="col-md-3">       
                                          <div className="mb-3">
                                              <Label htmlFor="example-date-input" className="form-Label">To</Label>
                                              <Input className="form-control" type="date" defaultValue="2019-08-19" id="example-date-input" />
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
                                      <div className="col-md-3"> 
                                        <div className="mb-3">
                                              <Label className="form-label" htmlFor="formrow-task-input">Task#</Label>
                                              <Input type="text" className="form-control" id="formrow-task-input" />
                                        </div>
                                      </div>
                                      <div className="col-md-3">
                                        <div className="mb-3">
                                            <Label className="form-Label">Type</Label>
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
                                            <Label className="form-Label">Class</Label>
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
                                              <Label className="form-label" htmlFor="formrow-area-input">Area</Label>
                                              <Input type="text" className="form-control" id="formrow-area-input" />
                                        </div>
                                      </div>
                                      <div className="col-md-3"> 
                                        <div className="mb-3">
                                              <Label className="form-label" htmlFor="formrow-room-input">Room</Label>
                                              <Input type="text" className="form-control" id="formrow-room-input" />
                                        </div>
                                      </div>
                                      <div className="col-md-3"> 
                                        <div className="mb-3">
                                              <Label className="form-label" htmlFor="formrow-submitted-input">Submitted By</Label>
                                              <Input type="text" className="form-control" id="formrow-submitted-input" />
                                        </div>
                                      </div>
                                      <div className="col-md-3"> 
                                        <div className="mb-3">
                                            <Label className="form-Label">Assign To</Label>
                                            <select className="form-select">
                                                <option>Select One</option>
                                                <option>Assign 1</option>
                                                <option>Assign 2</option>
                                                <option>Assign 3</option>
                                                <option>Assign 4</option>
                                                <option>Assign 5</option>
                                            </select>
                                        </div> 
                                      </div>  
                                      <div className="col-md-3"> 
                                        <div className="mb-3">
                                              <Label className="form-label" htmlFor="formrow-comment-input">Comments</Label>
                                              <Input type="text" className="form-control" id="formrow-comment-input" />
                                        </div>
                                      </div>
                                        <div className="col-md-1"> 
                                          <div className="mb-3">
                                            <Label className="form-Label"></Label>    
                                              <div className="form-check">
                                                    <input className="form-check-input" type="checkbox" id="formCheck22"/>
                                                    <label className="form-check-label" htmlFor="formCheck22">
                                                       Scheduled
                                                    </label>
                                                </div>
                                          </div>  
                                        </div>
                                        <div className="col-md-1"> 
                                          <div className="mb-3">
                                            <Label className="form-Label"></Label>    
                                              <div className="form-check">
                                                    <input className="form-check-input" type="checkbox" id="formCheck22" defaultChecked/>
                                                    <label className="form-check-label" htmlFor="formCheck22">
                                                        Priority
                                                    </label>
                                                </div>
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
                          <th scope="col">Ticket #</th>
                          <th scope="col">Type</th>
                          <th scope="col">Class</th>
                          <th scope="col">Area</th>
                          <th scope="col">Room</th>
                          <th scope="col">Comments</th>
                          <th scope="col">Created</th>
                          <th scope="col">Submitted By</th>
                          <th scope="col">Modified</th>
                          <th scope="col">Priority</th>
                          <th scope="col">Attachment</th>
                          {/* <th scope="col">Age</th> */}
                          <th scope="col">Status</th>
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
                              PLUMB
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
                                      View Task list Details
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
                                          <span className="d-none d-sm-block">Ticket Detail</span>
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
                                          <span className="d-none d-sm-block">Assign</span>
                                      </NavLink>
                                  </NavItem>
                              </Nav>
                              <TabContent
                                  activeTab={customActiveTab}
                                  className="p-3 text-muted"
                              >
                                <TabPane tabId="1">
                                  <Form>

                                      <div className="row align-items-center">
                                          <div className="col-md-4">
                                              <div className="mb-3">
                                                  <Label className="form-label" htmlFor="formrow-facility-input">Company</Label>
                                                  <Input type="text" value="Company Name" className="form-control" id="formrow-room-input" readOnly/>
                                              </div>
                                          </div>
                                          <div className="col-md-4">
                                              <div className="mb-3">
                                                  <Label className="form-label" htmlFor="formrow-facility-input">Status</Label>
                                                  <Input type="text" value="Closed" className="form-control" id="formrow-room-input" readOnly/>
                                              </div>
                                          </div>
                                          <div className="col-md-4">
                                              <div className="mb-3">
                                                  <Label className="form-Label">Type</Label>
                                                  <Input type="text" value="Type 1" className="form-control" id="formrow-room-input" readOnly/>
                                              </div>    
                                          </div>
                                          <div className="col-md-4">
                                              <div className="mb-3">
                                                  <Label className="form-Label">Class</Label>
                                                  <Input type="text" value="Class" className="form-control" id="formrow-room-input" readOnly/>
                                              </div>    
                                          </div>
                                          <div className="col-md-4">
                                              <div className="mb-3">
                                                  <Label className="form-Label">Area</Label>
                                                  <Input type="text" value="Area 1" className="form-control" id="formrow-room-input" readOnly/>
                                              </div>    
                                          </div>
                                        
                                          <div className="col-md-4">
                                              <div className="mb-3">
                                                  <Label className="form-label" htmlFor="formrow-room-input">Room</Label>
                                                  <Input type="text" value="Room 1" className="form-control" id="formrow-room-input" readOnly/>
                                              </div>
                                          </div>
                                          <div className="col-md-4">
                                              <div className="mb-3">
                                                  <Label className="form-label" htmlFor="formrow-phone-input">Phone</Label>
                                                  <Input type="text" value="8556055809" className="form-control" id="formrow-room-input" readOnly/>
                                              </div>
                                          </div>
                                          <div className="col-md-4">
                                              <div className="mb-3">
                                                  <Label className="form-label" htmlFor="formrow-email-input">Email</Label>
                                                  <Input type="text" value="abc@gmail.com" className="form-control" id="formrow-room-input" readOnly/>
                                              </div>
                                          </div>
                                          
                                          <div className="col-md-4">
                                              <div className="mb-3">
                                                  <Label className="form-label" htmlFor="formrow-email-input">Disable Email</Label>
                                                  <Input type="text" value="Yes" className="form-control" id="formrow-room-input" readOnly/>
                                              </div>    
                                          </div>
                                          <div className="col-md-12">
                                              <div className="mb-3">
                                              <label
                                                  htmlFor="basicpill-address-input"
                                                  className="form-label"
                                              >
                                                  Comments
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
                                        </div> 
                                      </Form>     
                                  </TabPane> 
                                  <TabPane tabId="2">
                                  <div className="row">
                                      <div className="col-md-12">
                                          <div className="mb-3">
                                          <Label className="form-Label">Assign Vendor</Label>
                                          <Input type="text" value="Vendor 1" className="form-control" id="formrow-room-input" readOnly/>
                                          </div>
                                      </div>
                                      <div className="col-md-6">
                                              <div className="mb-3">
                                                  <Label className="form-Label">Priority</Label>
                                                  <Input type="text" value="Yes" className="form-control" id="formrow-room-input" readOnly/>
                                              </div>    
                                      </div> 
                                      <div className="col-md-6">
                                          <div className="mb-3">
                                              <Label className="form-Label">Duration (H/m)</Label>
                                              <div class="row">
                                                  <div class="col-md-8">
                                                      <div className="mb-3">
                                                          <Input type="text" value="10" className="form-control" id="formrow-code-input" readOnly/>
                                                      </div>   
                                                  </div>
                                                  <div class="col-md-4">
                                                      <div className="mb-3">
                                                        <Input type="text" value="59" className="form-control" id="formrow-code-input" readOnly/>
                                                      </div>
                                                  </div>
                                              </div>
                                          </div>    
                                      </div>   
                                      <div className="col-md-6">
                                          <div className="mb-3">
                                              <Label htmlFor="example-date-input" className="form-Label">Calender Date</Label>
                                              <Input className="form-control" type="date" defaultValue="2019-08-19" id="example-date-input" readOnly />
                                          </div>
                                      </div> 
                                      <div className="col-md-6">
                                          <div className="mb-3">
                                              <Label htmlFor="example-time-input" className="form-Label">Calender Time</Label>
                                              <Input className="form-control" type="time" defaultValue="13:45:00" id="example-time-input"  readOnly/>
                                          </div> 
                                      </div>
                                      <div className="col-md-12">
                                          <div className="mb-3">
                                              <Label className="form-Label">Notes</Label>
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
                                  </div>
                                  </TabPane>           
                                  </TabContent>          
                              </div>
                              </Modal>
                          </td>
                          <td>YES</td>
                          <td>1071</td>
                          <td>213</td>
                          <td>The water</td>
                          <td>18/01/2022</td>
                          <td>Katrina</td>
                          <td>20/01/2022</td>
                          <td>111</td>
                          <td>
                              <div>
                              <button
                                type="button"
                                className="btn btn-soft-light btn-sm w-xs waves-effect btn-label waves-light"
                              >
                                <i className="bx bx-download label-icon"></i> PDF
                              </button>
                            </div>
                          </td>
                          {/* <td>2</td> */}
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
                          <td><a href="#!"
                                onClick={() => {
                                    tog_large2()
                                }}
                                data-toggle="modal"
                                data-target=".bs-example-modal-lg"
                                >
                              PLUMB
                            </a>  </td>
                          <td>YES</td>
                          <td>1071</td>
                          <td>213</td>
                          <td>The water</td>
                          <td>18/01/2022</td>
                          <td>Katrina</td>
                          <td>20/01/2022</td>
                          <td>111</td>
                          <td>
                              <div>
                              <button
                                type="button"
                                className="btn btn-soft-light btn-sm w-xs waves-effect btn-label waves-light"
                              >
                                <i className="bx bx-download label-icon"></i> Excel
                              </button>
                            </div>
                          </td>
                            {/* <td>2</td> */}
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
                          <td><a href="#!"
                                onClick={() => {
                                    tog_large2()
                                }}
                                data-toggle="modal"
                                data-target=".bs-example-modal-lg"
                                >
                              PLUMB
                            </a>  </td>
                          <td>YES</td>
                          <td>1071</td>
                          <td>213</td>
                          <td>The water</td>
                          <td>18/01/2022</td>
                          <td>Katrina</td>
                          <td>20/01/2022</td>
                          <td>111</td>
                          <td>
                              <div>
                              <button
                                type="button"
                                className="btn btn-soft-light btn-sm w-xs waves-effect btn-label waves-light"
                              >
                                <i className="bx bx-download label-icon"></i> PDF
                              </button>
                            </div>
                          </td>
                            {/* <td>2</td> */}
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
                          <td><a href="#!"
                                onClick={() => {
                                    tog_large2()
                                }}
                                data-toggle="modal"
                                data-target=".bs-example-modal-lg"
                                >
                              PLUMB
                            </a>  </td>
                          <td>YES</td>
                          <td>1071</td>
                          <td>213</td>
                          <td>The water</td>
                          <td>18/01/2022</td>
                          <td>Katrina</td>
                          <td>20/01/2022</td>
                          <td>111</td>
                          <td>
                              <div>
                              <button
                                type="button"
                                className="btn btn-soft-light btn-sm w-xs waves-effect btn-label waves-light"
                              >
                                <i className="bx bx-download label-icon"></i> PDF
                              </button>
                            </div>
                          </td>
                            {/* <td>2</td> */}
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
                          <td><a href="#!"
                                onClick={() => {
                                    tog_large2()
                                }}
                                data-toggle="modal"
                                data-target=".bs-example-modal-lg"
                                >
                              PLUMB
                            </a>  </td>
                          <td>YES</td>
                          <td>1071</td>
                          <td>213</td>
                          <td>The water</td>
                          <td>18/01/2022</td>
                          <td>Katrina</td>
                          <td>20/01/2022</td>
                          <td>111</td>
                          <td>
                              <div>
                              <button
                                type="button"
                                className="btn btn-soft-light btn-sm w-xs waves-effect btn-label waves-light"
                              >
                                <i className="bx bx-download label-icon"></i> PDF
                              </button>
                            </div>
                          </td>
                            {/* <td>2</td> */}
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
                          <td>6</td>
                          <td><a href="#!"
                                onClick={() => {
                                    tog_large2()
                                }}
                                data-toggle="modal"
                                data-target=".bs-example-modal-lg"
                                >
                              PLUMB
                            </a>  </td>
                          <td>YES</td>
                          <td>1071</td>
                          <td>213</td>
                          <td>The water</td>
                          <td>18/01/2022</td>
                          <td>Katrina</td>
                          <td>20/01/2022</td>
                          <td>111</td>
                          <td>
                              <div>
                              <button
                                type="button"
                                className="btn btn-soft-light btn-sm w-xs waves-effect btn-label waves-light"
                              >
                                <i className="bx bx-download label-icon"></i> PDF
                              </button>
                            </div>
                          </td>
                           {/* <td>2</td> */}
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

export default TaskFrnt
