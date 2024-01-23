// import axios from 'axios';
import React, { useEffect, useState } from "react";
import jwt_decode from "jwt-decode";
import {
  Card,
  CardBody,
  Col,
  Pagination,
  PaginationItem,
  PaginationLink,
  Row,
  Table,
} from "reactstrap";
import axios from "../api/axios";

const TenantsTable = (props) => {
  const decode = jwt_decode(window.localStorage.getItem("accessToken"));
  const GET_CUSTOMERS = "customer";
  // customer?applicantId=&isActive=&page=&limit=

  const [tenantsData, setTenantsData] = useState([]);
  const [startPage, setStartPage] = useState(1);
  const [currentPage, setCurrentPage] = useState(1);
  const [pageLimit, setPageLimit] = useState(10);
  const [total, setTotal] = useState(0);

  const pageTotal = Math.ceil(total / pageLimit);

  // console.log("response from table", tenantsData);

  const getTenants = async () => {
    try {
      const response = await axios.get(
        `${GET_CUSTOMERS}?applicantId=${props.id}&page=${currentPage}&limit=10`
      );
      if (response.status === 200) {
        setTenantsData(response.data.data);
        setTotal(response?.data?.totalCount?.[0]?.totalCount);
      }
    } catch (error) {
      console.error("error", error);
    }
  };
  useEffect(() => {
    getTenants();
  }, []);

  const changeStatus = async (id, val) => {
    let data = {
      customerId: id,
      active: val,
    };
    try {
      if (["company"].includes(decode.role)) {
        const response = await axios.put(`company/customerActive`, data);
        getTenants();
      }
      if (["manager"].includes(decode.role)) {
        const response = await axios.put(`property/customerActive`, data);
        getTenants();
      }
    } catch (error) {
      console.error("error", error);
    }
  };

  const handlePageChange = (page) => {
    setCurrentPage(page);

    if (page > startPage + pageLimit - 1 || page < startPage) {
      setStartPage(Math.max(1, page - pageLimit / 2));
    }
  };

  return (
    <Row>
      <Col xl={12}>
        <Card>
          <CardBody>
            <div className="table-responsive">
              <Table className="table-striped table-bordered mb-0">
                <thead>
                  <tr>
                    <th scope="col">#</th>
                    <th scope="col">Tenant</th>
                    <th scope="col">Property Name</th>
                    <th scope="col">Suite/Documents</th>
                    <th scope="col">Action</th>
                  </tr>
                </thead>
                <tbody>
                  {tenantsData &&
                    tenantsData.map((data, index) => {
                      return (
                        <tr>
                          <td>{index + 1}</td>
                          <td>
                            <div>
                              {data?.firstname} {data?.lastname}
                            </div>
                            <div>{data?.email}</div>
                            <div>{data?.mobile}</div>
                          </td>
                          <td>{data?.properties?.[0]?.propertyName}</td>
                          <td>
                            <div>{data?.suite}</div>
                            <div>
                              {data?.document?.length > 0 &&
                                data?.document?.map((doc, ind) => {
                                  return (
                                    <div key={ind}>
                                      <a
                                        // href={`${SERVER_URL}/applicant/pdf?id=${props.id}`}
                                        href={`http://138.197.170.239:8080/customer/download-document?ID=${data?._id}.zip`}
                                        // download={"Applicant.pdf"}
                                        download={`${
                                          doc ? doc : "Doc"
                                        }.zip`}
                                      >
                                        <button
                                          type="button"
                                          className="btn btn-soft-light btn-sm w-xs waves-effect btn-label waves-light"
                                        >
                                          <i className="bx bx-download label-icon"></i>{" "}
                                          Doc
                                        </button>
                                      </a>
                                    </div>
                                  );
                                })}
                            </div>
                          </td>
                          <td>
                            <select
                              className={`form-select btn-sm btn ${
                                data.isActive ? "btn-success" : "btn-warning"
                              }`}
                              style={{ width: "120px" }}
                              value={data.isActive ? 1 : 0}
                              onChange={(event) => {
                                changeStatus(data._id, event.target.value);
                              }}
                            >
                              <option className="btn btn-light" value={0}>
                                Suspend
                              </option>
                              <option className="btn btn-light " value={1}>
                                Activate
                              </option>
                            </select>
                          </td>
                        </tr>
                      );
                    })}
                </tbody>
              </Table>
            </div>
            <Row className="proress-style mt-3">
              <Col xl={3}></Col>
              <Col xl={9}>
                <div className="pagination-bar">
                  <Pagination>
                    <PaginationItem disabled={currentPage === 1}>
                      <PaginationLink
                        first
                        onClick={() => handlePageChange(1)}
                      />
                    </PaginationItem>
                    <PaginationItem disabled={currentPage === 1}>
                      <PaginationLink
                        previous
                        onClick={() => handlePageChange(currentPage - 1)}
                      />
                    </PaginationItem>
                    {Array.from(
                      { length: pageLimit },
                      (_, i) => i + startPage
                    ).map((page) => {
                      if (page > pageTotal) return null;
                      return (
                        <PaginationItem
                          key={page}
                          active={currentPage === page}
                        >
                          <PaginationLink
                            onClick={() => handlePageChange(page)}
                          >
                            {page}
                          </PaginationLink>
                        </PaginationItem>
                      );
                    })}
                    <PaginationItem disabled={currentPage === pageTotal}>
                      <PaginationLink
                        next
                        onClick={() => handlePageChange(currentPage + 1)}
                      />
                    </PaginationItem>
                    <PaginationItem disabled={currentPage === pageTotal}>
                      <PaginationLink
                        last
                        onClick={() => handlePageChange(pageTotal)}
                      />
                    </PaginationItem>
                  </Pagination>
                </div>
              </Col>
            </Row>
          </CardBody>
        </Card>
      </Col>
    </Row>
  );
};

export default TenantsTable;
