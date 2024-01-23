import React, { useEffect, useState } from "react";
import MetaTags from "react-meta-tags";
import { useHistory } from "react-router-dom";
import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import { Row, Col, Card, CardBody, CardHeader, Label, Input } from "reactstrap";

//moment
import moment from "moment";

//Import Breadcrumb
import Breadcrumbs from "../../components/Common/Breadcrumb";

import jwt_decode from "jwt-decode";
import axios from "../api/axios";

const Calender_availabilty = () => {
  const ADD_AVAILABILITY = "/calender/set-availability";
  const GET_AVAILABILITY = "/calender/get-availability";

  const decode = jwt_decode(window.localStorage.getItem("accessToken"));

  const [daysAvailability, setDayAvailability] = useState([
    {
      day: "Sun",
      available: false,
      slots: [
        {
          startTime: "9:00 AM",
          endTime: "5:00 PM",
        },
      ],
    },
    {
      day: "Mon",
      available: false,
      slots: [
        {
          startTime: "9:00 AM",
          endTime: "5:00 PM",
        },
      ],
    },
    {
      day: "Tue",
      available: false,
      slots: [
        {
          startTime: "9:00 AM",
          endTime: "5:00 PM",
        },
      ],
    },
    {
      day: "Wed",
      available: false,
      slots: [
        {
          startTime: "9:00 AM",
          endTime: "5:00 PM",
        },
      ],
    },
    {
      day: "Thu",
      available: false,
      slots: [
        {
          startTime: "9:00 AM",
          endTime: "5:00 PM",
        },
      ],
    },
    {
      day: "Fri",
      available: false,
      slots: [
        {
          startTime: "9:00 AM",
          endTime: "5:00 PM",
        },
      ],
    },
    {
      day: "Sat",
      available: false,
      slots: [
        {
          startTime: "9:00 AM",
          endTime: "5:00 PM",
        },
      ],
    },
  ]);

  const [splitTime, setSplitTime] = useState([]);

  const [availableError, setAvailableError] = useState("");

  const history = useHistory();

  const time = [];

  let addMoment;

  const calculateTime = async (i) => {
    return new Promise(function (resolve, reject) {
      if (time.length > 0) {
        addMoment = moment(addMoment).add(30, "m");

        time.push(addMoment.format("LT"));

        resolve();
      } else {
        addMoment = moment("6.30");
        time.push(moment("6.30").format("LT"));
        resolve();
      }
    });
  };

  const getManagerAvailability = async () => {
    try {
      const response = await axios.get(
        `${GET_AVAILABILITY}/?manager_id=${decode.id}`
      );

      if (response.data.status == 200) {
        // console.log(response.data.ManagerAvailability.daysOfWeekAvailability)
        setDayAvailability(
          response.data.ManagerAvailability.daysOfWeekAvailability
        );
      }
    } catch (error) {
      console.log(error); // TODO proper error
    }
  };

  useEffect(() => {
    getManagerAvailability();

    const timeRecurresive = (i) => {
      calculateTime(i).then(() => {
        if (i < 47) {
          i++;
          timeRecurresive(i);
        } else {
          setSplitTime(time);
        }
      });
    };

    timeRecurresive(0);
  }, []);

  const submit = async (e) => {
    e.preventDefault();
    let err = true;
    const find = daysAvailability.map((dat) => {
      const slots = dat.slots.map((data) => {
        var time = data.startTime;
        var hours = Number(time.match(/^(\d+)/)[1]);
        var minutes = Number(time.match(/:(\d+)/)[1]);
        var AMPM = time.match(/\s(.*)$/)[1];
        if (AMPM == "PM" && hours < 12) hours = hours + 12;
        if (AMPM == "AM" && hours == 12) hours = hours - 12;
        var sHours = hours.toString();
        var sMinutes = minutes.toString();
        if (hours < 10) sHours = "0" + sHours;
        if (minutes < 10) sMinutes = "0" + sMinutes;
        var time2 = data.endTime;
        if (time2 == "") {
          var time2 = "00:00 AM";
        }
        var hours2 = Number(time2.match(/^(\d+)/)[1]);
        var minutes2 = Number(time2.match(/:(\d+)/)[1]);
        var AMPM2 = time2.match(/\s(.*)$/)[1];
        if (AMPM2 == "PM" && hours2 < 12) hours2 = hours2 + 12;
        if (AMPM2 == "AM" && hours2 == 12) hours2 = hours2 - 12;
        var sHours2 = hours2.toString();
        var sMinutes2 = minutes2.toString();
        if (hours2 < 10) sHours2 = "0" + sHours2;
        if (minutes2 < 10) sMinutes2 = "0" + sMinutes2;
        var comparehour = sHours2 - sHours;
        var comparemin = sMinutes2 - sMinutes;
        if (comparehour < 0) {
          err = false;
          toast(`end time of ${dat.day} should not be greater than start time`);
        } else if (comparehour == 0 && comparemin < 0) {
          err = false;
          toast(`end time of ${dat.day} should not be greater than start time`);
        }
      });
    });
    if (err) {
      var submited = false;
      try {
        let role = decode.role;

        if (role == "manager") {
          role = "PropertyManager";
        } else if (role == "technical staff") {
          role = "technicalStaff";
        } else if (role == "company") {
          role = "company";
        }

        const response = await axios.post(ADD_AVAILABILITY, {
          manager_id: decode.id,
          daysOfWeekAvailability: daysAvailability,
          role: role,
        });

        if (response.data.success) {
          submited = true;
        } else {
          setAvailableError("Events are already booked on changed days");
        }
      } catch (error) {
        console.log(error);
      } finally {
        if (submited) {
          history.push("/apps-calendar");
          // document.querySelector(".alert").alert()
        }
      }
    }
  };

  const changeAvailability = (i, type, data, j = 0) => {
    let changedData = daysAvailability.map((item, index) => {
      if (i == index) {
        if (type == "available") {
          return {
            ...item,
            available: data.target.checked,
          };
        } else if (type == "startTime") {
          item.slots[j].startTime = data;
          return {
            ...item,
          };
        } else if (type == "endTime") {
          item.slots[j].endTime = data;

          return {
            ...item,
          };
        } else if (type == "removeslot") {
          item.slots.splice(j, 1);
          return {
            ...item,
          };
        } else if (type == "addslot") {
          item.slots.push({
            startTime: "9:00 AM",
            endTime: "5:00 PM",
          });
          return {
            ...item,
          };
        }
      } else {
        return item;
      }
    });

    setDayAvailability(changedData);
  };

  return (
    <React.Fragment>
      <div className="page-content">
        <MetaTags>
          <title> Rentdigicare | Availability </title>
        </MetaTags>
        <div className="container-fluid">
          <ToastContainer />
          <Breadcrumbs title="Home" breadcrumbItem="Availability" />

          <Row>
            <Col xl={12}>
              <Card>
                <CardHeader>
                  <div className="row align-items-center">
                    <div className="col-md-6">
                      <div className="mb">
                        <h5 className="card-title">
                          Set your weekly hours
                          <span className="text-muted fw-normal ms-2"></span>
                        </h5>
                      </div>
                    </div>
                  </div>
                </CardHeader>
                <CardBody>
                  {availableError && (
                    <p style={{ color: "red" }}>{availableError}</p>
                  )}

                  {daysAvailability.map((dayRow, i) => {
                    console.log(dayRow, "dayRow.available");
                    return (
                      <div className="row ">
                        <div className="col-md-2  mt-1">
                          <Input
                            id={`day`}
                            type="checkbox"
                            checked={dayRow.available}
                            onChange={(e) => {
                              changeAvailability(i, "available", e, 0);
                            }}
                          />
                          <Label
                            htmlFor="day"
                            className="form-Label"
                            style={{ marginLeft: "10px" }}
                          >
                            <b>{dayRow.day}</b>
                          </Label>
                        </div>
                        {dayRow.available ? (
                          <div className="row col-md-8">
                            {dayRow.slots.map((slot, j) => {
                              return (
                                <div className="row align-items-center mb-3">
                                  {/* <Label htmlFor="example-time-input" className="form-Label">Start Time</Label> */}
                                  <div className="col-md-4">
                                    <select
                                      className="form-select"
                                      value={slot.startTime}
                                      onChange={(e) => {
                                        changeAvailability(
                                          i,
                                          "startTime",
                                          e.target.value,
                                          j
                                        );
                                      }}
                                    >
                                      {splitTime.map((newTime) => {
                                        return (
                                          <option value={newTime}>
                                            {newTime}
                                          </option>
                                        );
                                      })}
                                    </select>
                                  </div>
                                  <div className="col-md-4">
                                    {/* <Label htmlFor="example-time-input" className="form-Label">Start Time</Label> */}
                                    <select
                                      className="form-select"
                                      value={slot.endTime}
                                      onChange={(e) => {
                                        changeAvailability(
                                          i,
                                          "endTime",
                                          e.target.value,
                                          j
                                        );
                                      }}
                                    >
                                      {splitTime.map((newTime) => {
                                        return (
                                          <option value={newTime}>
                                            {newTime}
                                          </option>
                                        );
                                      })}
                                    </select>
                                  </div>
                                  <div className="col-md-4">
                                    {j == 0 ? (
                                      <button
                                        onClick={(e) => {
                                          changeAvailability(
                                            i,
                                            "addslot",
                                            0,
                                            j
                                          );
                                        }}
                                      >
                                        +
                                      </button>
                                    ) : (
                                      <button
                                        onClick={(e) => {
                                          changeAvailability(
                                            i,
                                            "removeslot",
                                            0,
                                            j
                                          );
                                        }}
                                      >
                                        -
                                      </button>
                                    )}
                                  </div>
                                </div>
                              );
                            })}
                          </div>
                        ) : (
                          <div className="col-md-4 mt-1 mb-3">
                            <Label
                              htmlFor="day"
                              className="form-Label"
                              style={{ marginLeft: "10px" }}
                            >
                              <b>unavailable</b>
                            </Label>
                          </div>
                        )}
                      </div>
                    );
                  })}
                  <div className="col-md-12 d-flex flex-wrap align-items-center justify-content-center">
                    <button
                      className="btn btn-primary mo-mb-2 mr-10"
                      onClick={(e) => {
                        submit(e);
                      }}
                    >
                      Submit
                    </button>
                  </div>
                </CardBody>
              </Card>
            </Col>
          </Row>
        </div>
      </div>
    </React.Fragment>
  );
};

export default Calender_availabilty;
