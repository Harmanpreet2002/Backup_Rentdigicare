import React, { useEffect, useState } from "react";
import MetaTags from "react-meta-tags";
import { useHistory } from "react-router-dom";
import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import { Row, Col, Card, CardBody, CardHeader, Label, Input } from "reactstrap";

//moment
import moment from "moment";
import moment_timezone from "moment-timezone";

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

  const convertToLocalTime = (utcTime) => {
    const utcMoment = moment_timezone.utc(utcTime);
    const localTimezone = moment_timezone.tz.guess();
    const localMoment = utcMoment.clone().tz(localTimezone);
    const formattedTime = localMoment.format("h:mm A");

    return formattedTime;
  };

  const getManagerAvailability = async () => {
    try {
      const response = await axios.get(
        `${GET_AVAILABILITY}/?manager_id=${decode.id}`
      );

      if (response.data.status == 200) {
        const convertedAvailability =
          response.data.ManagerAvailability.daysOfWeekAvailability.map(
            (day) => ({
              ...day,
              slots: day.slots.map((slot) => ({
                startTime: convertToLocalTime(slot.startTime),
                endTime: convertToLocalTime(slot.endTime),
              })),
            })
          );

        setDayAvailability(convertedAvailability);
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

  const convertToUTC = (localTime) => {
    const localMoment = moment(localTime, "h:mm A");
    const utcTime = localMoment.toISOString();

    return utcTime;
  };

  const submit = async (e) => {
    e.preventDefault();
    let err = true;
    daysAvailability.forEach((dat) => {
      dat.slots.forEach((data) => {
        const startTimeUtc = convertToUTC(data.startTime);
        const endTimeUtc = convertToUTC(data.endTime);

        console.log("StartTimeUtc:", startTimeUtc);
        console.log("EndTimeUtc:", endTimeUtc);

        // Perform time zone-aware validations
        if (moment(endTimeUtc).isSameOrBefore(startTimeUtc)) {
          err = false;
          toast(`End time should be greater than start time for ${dat.day}`);
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

        const convertedAvailability = daysAvailability.map((day) => {
          return {
            ...day,
            slots: day.available
              ? day.slots.map((slot) => ({
                  startTime: convertToUTC(slot.startTime),
                  endTime: convertToUTC(slot.endTime),
                }))
              : [],
          };
        });

        const response = await axios.post(ADD_AVAILABILITY, {
          manager_id: decode.id,
          daysOfWeekAvailability: convertedAvailability,
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

  const changeAvailability = (
    i,
    type,
    data,
    j = 0,
    defaultValues = [
      {
        startTime: "9:00 AM",
        endTime: "5:00 PM",
      },
    ]
  ) => {
    let changedData = daysAvailability.map((item, index) => {
      if (i == index) {
        if (type == "available") {
          return {
            ...item,
            available: data.target.checked,
            slots: defaultValues,
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

    console.log("ChangedData:", changedData);

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
