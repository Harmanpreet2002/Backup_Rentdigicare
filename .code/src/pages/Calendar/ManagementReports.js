import React, { useEffect, useState } from "react";
import { Accordion, AccordionItem } from "react-bootstrap";
import { Table, Row, Col, Card, CardBody, CardHeader, Label } from "reactstrap";
import Select from "react-select";
import jwt_decode from "jwt-decode";
import axios from "../api/axios";

const ManagementReports = () => {
  const [sortingOption, setSortingOption] = useState("");
  const [selectPropertyName, setSelectPropertyName] = useState(null);
  const [filterPropertyManager, setFilterPropertyManager] = useState("");
  const [propertyManagerList, setPropertyManagerList] = useState([]);
  const [tickets, setTickets] = useState([]);
  const decode = jwt_decode(window.localStorage.getItem("accessToken"));
  const userRole = JSON.parse(window.localStorage.getItem("authUser")).role;

  console.log("Tickets:", tickets);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const response = await axios.post(`/property_manager/admin`, {
          company: decode.id,
        });
        if (response?.data?.managers) {
          setPropertyManagerList(response.data.managers);
        }
      } catch (error) {
        console.error("Error fetching property manager list:", error.message);
      }
    };

    fetchData();

    // Fetch tickets if the user is a company
    if (decode.role === "company") {
      const getTickets = async () => {
        try {
          const ticketResponse = await axios.post(
            "/ticket/filter_tickets_company",
            {
              companyDomain: decode.domain,
            }
          );
          setTickets(ticketResponse.data.tickets);
        } catch (error) {
          console.error("Error fetching tickets:", error.message);
        }
      };

      getTickets();
    }
  }, [decode.id]);

  const handleSorting = (e) => {
    setSortingOption(e.target.value);
    // Add sorting logic here
  };

  const renderSortingDropdown = () => (
    <select
      onChange={handleSorting}
      className="form-select custom-select"
      style={{
        borderRadius: "4px",
        marginBottom: "10px",
        borderColor: "#d1d1d5",
      }}
    >
      <option value="">Sorting</option>
      <option value={1}>A-Z</option>
      <option value={2}>Z-A</option>
      <option value={3}>Created Latest</option>
      <option value={4}>Created Oldest</option>
    </select>
  );

  const renderPropertyManagerFilter = () => (
    <div className="col-md-3">
      <div className="mb-3">
        <Label className="form-Label">Property Manager</Label>
        <Select
          value={selectPropertyName}
          options={propertyManagerList?.map((item) => ({
            value: item._id,
            label: `${item.firstname} ${item.lastname}`,
          }))}
          placeholder="Search By Name"
          onChange={(e) => {
            setSelectPropertyName(e);
            setFilterPropertyManager(e.value);
          }}
        />
      </div>
    </div>
  );

  return (
    <div className="page-content">
      <div className="container-fluid">
        <Row>
          <Col xl={12}>
            <Card>
              <CardHeader>
                <h1 className="card-title">Managerial Reports</h1>
                {userRole === "company" && renderPropertyManagerFilter()}
              </CardHeader>
              <CardBody>
                {/* Appointments Report */}
                <Accordion>
                  <AccordionItem>
                    <Accordion.Header className="accordion-header">
                      Appointments Report
                    </Accordion.Header>
                    <Accordion.Body>
                      <div className="table-responsive">
                        {renderSortingDropdown()}
                        <Table className="table table-striped table-bordered mb-0">
                          <thead>
                            <tr>
                              <th scope="col">#</th>
                              <th scope="col">Property Name</th>
                              <th scope="col">Applicant</th>
                              <th scope="col">Address</th>
                              <th scope="col">Created On</th>
                              <th scope="col">Documents</th>
                              <th scope="col">Id Proof's</th>
                              <th scope="col">Status</th>
                              <th scope="col">Source</th>
                              <th scope="col">Action</th>
                            </tr>
                          </thead>
                          <tbody></tbody>
                        </Table>
                      </div>
                    </Accordion.Body>
                  </AccordionItem>
                </Accordion>

                {/* Maintenance Requests Report */}
                <Accordion>
                  <AccordionItem>
                    <Accordion.Header className="accordion-header">
                      Maintenance Requests Report
                    </Accordion.Header>
                    <Accordion.Body>
                      <div className="table-responsive">
                        {renderSortingDropdown()}
                        <Table className="table table-striped table-bordered mb-0">
                          <thead>
                            <tr>
                              <th scope="col">#</th>
                              <th scope="col">Property Name</th>
                              <th scope="col">Manager Name</th>
                              <th scope="col">Created On</th>
                              <th scope="col">Open</th>
                              <th scope="col">Inprogress</th>
                              <th scope="col">Completed</th>
                              <th scope="col">Unresolved</th>
                            </tr>
                          </thead>
                          <tbody>
                            {tickets.map((ticket) => {
                              return (
                                <>
                                  <tr>
                                    <td></td>
                                    <td>{ticket.property}</td>
                                    <td>{`${ticket.propertyManagerId[0].firstname} ${ticket.propertyManagerId[0].lastname}`}</td>
                                    <td></td>
                                    <td></td>
                                    <td></td>
                                    <td></td>
                                    <td></td>
                                  </tr>
                                </>
                              );
                            })}
                          </tbody>
                        </Table>
                      </div>
                    </Accordion.Body>
                  </AccordionItem>
                </Accordion>

                {/* Resident Applications Report */}
                <Accordion>
                  <AccordionItem>
                    <Accordion.Header className="accordion-header">
                      Resident Applications Report
                    </Accordion.Header>
                    <Accordion.Body>
                      <div className="table-responsive">
                        {renderSortingDropdown()}
                        <Table className="table table-striped table-bordered mb-0">
                          <thead>
                            <tr>
                              <th scope="col">#</th>
                              <th scope="col">Property Name</th>
                              <th scope="col">Manager Name</th>
                              <th scope="col">Created On</th>
                              <th scope="col">Pending</th>
                              <th scope="col">Approved</th>
                              <th scope="col">Denied</th>
                              <th scope="col">Source</th>
                            </tr>
                          </thead>
                          <tbody></tbody>
                        </Table>
                      </div>
                    </Accordion.Body>
                  </AccordionItem>
                </Accordion>
              </CardBody>
            </Card>
          </Col>
        </Row>
      </div>
    </div>
  );
};

export default ManagementReports;
