import { AvField, AvForm } from "availity-reactstrap-validation";
import React, { useEffect, useRef, useState } from "react";
import { Col, Modal, Row } from "reactstrap";
import jwt_decode from "jwt-decode";
import { SERVER_URL } from "../ServerLink";
import { ToastContainer, toast } from "react-toastify";
import moment from "moment";
import moment_timezone from "moment-timezone";

const BookAppointmentModal = ({ open, setOpen, id, defaultDate }) => {
  console.log(defaultDate, "nelogggggggggggggggggg");
  // const [value, onChange] = useState(new Date());
  const [dateFromAPi, setdateFromAPi] = useState([]);
  const [date, setDate] = useState(new Date());
  const [data, setdata] = useState([]);
  const [slots, setslots] = useState([]);
  const [managerAvailability, setmanagerAvailability] = useState("");
  // const onChange=()=>{
  //   setDate(date)
  // }
  const decode = jwt_decode(window.localStorage.getItem("accessToken"));
  const [managerid, setmanagerid] = useState("");
  const [Role, setrole] = useState("");
  const [companyDomain, setcompanyDomain] = useState("");
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [phone, setPhone] = useState("");
  const [phone1, setPhone1] = useState("");
  const [sdate, setSdate] = useState("");
  const [time, setTime] = useState("");
  const [description, setdescription] = useState("");
  const [day, setday] = useState("");
  const [properties, setProperties] = useState([]);
  const [property, setproperty] = useState("");
  const [layOut, setlayOut] = useState("");
  const [category, setCategory] = useState([]);
  const [selectedDay, setSelectedDay] = useState(0);
  const [isEdit, setIsEdit] = useState(false);
  const [daysAvailability, setDayAvailability] = useState([]);
  const [splitTimes, setSplitTimes] = useState([]);
  const [selectedDate, setSelectedDate] = useState("");
  const [reasonType, setReasonType] = useState([]);
  const [reason, setReason] = useState("");
  const formRef = useRef();
  const [loading, setLoading] = useState(false);
  const [propertyName, setPropertyName] = useState("");
  const [contact, setContact] = useState("");
  const GET_CUSTOMER_TICKETS = "/calender/customer_tickets";
  const GET_EVENTS_OF_DATE = "/user_appointment/get-todays-event";
  const moment = require("moment");

  let addMoment;
  let splitedTime = [];
  let newSlot = false;
  console.log(decode, ">>SDDDDDDDDDD");
  useEffect(() => {
    console.log(id, "dddd"); // 123

    getManagerid(id);
  }, [id]);
  const getManagerid = async (managerID) => {
    let res = await fetch(
      SERVER_URL + `/user_appointment/get-id/?id=${managerID}`
    );
    let data = await res.json();
    console.log(data);
    let layout = data?.manager?.proprtyList.map((item) => {
      return item.categoryList;
    });
    setmanagerid(data?.manager?._id);
    setContact(data?.manager?.phone);
    setrole(data?.manager?.role);
    setcompanyDomain(data?.manager?.companyAssigned);
    setProperties(data?.manager.proprtyList);
    availabilityData(data?.manager?._id);
    getReasonTypes(
      decode.role === "manager" ? data?.manager?.companyID : data?.manager?._id
    );
  };

  const getReasonTypes = async (val) => {
    try {
      const res = await fetch(
        SERVER_URL + `/calender/reason/get?companyID=${val}`
      );
      let data = await res.json();
      if (data.results.reasons) {
        const temp = data.results.reasons;
        setReasonType(temp);
      }
    } catch (err) {
      console.error(err.message);
    }
  };

  const setSlots = (date) => {
    let selectedDate = new Date(date);
    setCalenderSlots(selectedDate);
  };
  useEffect(() => {
    setSlots(defaultDate);
    setSdate(defaultDate);
  }, [defaultDate]);

  const convertToLocalTime = (utcTime) => {
    const utcMoment = moment_timezone.utc(utcTime);
    const localTimezone = moment_timezone.tz.guess();
    const localMoment = utcMoment.clone().tz(localTimezone);
    const formattedTime = localMoment.format("h:mm A");

    return formattedTime;
  };

  const availabilityData = async (id) => {
    let res = await fetch(
      SERVER_URL + `/calender/get-availability/?manager_id=${id}`
    );
    let data = await res.json();
    if (data?.ManagerAvailability != null) {
      const convertedAvailability =
        data?.ManagerAvailability?.daysOfWeekAvailability.map((day) => ({
          ...day,
          slots: day.slots.map((slot) => ({
            startTime: convertToLocalTime(slot.startTime),
            endTime: convertToLocalTime(slot.endTime),
          })),
        }));

      setDayAvailability(convertedAvailability);
    } else {
      setDayAvailability([]);
    }
    // console.log("response:", data.ManagerAvailability.daysOfWeekAvailability);
    // console.log("setDayAvailability:", daysAvailability);
  };

  const setCalenderSlots = async (selectedDate) => {
    let dayIndex = selectedDate.getDay();
    let bodyData = {
      method: "POST",
      headers: {
        Accept: "application/json",
        "Content-Type": "application/json",
      },
      body: JSON.stringify({ date: selectedDate, manager_id: managerid }),
    };
    const res = await fetch(
      SERVER_URL + `/user_appointment/get-todays-event`,
      bodyData
    );
    let data = await res.json();
    // console.log("response:", data)

    let bookedEvents = data?.BookedEvents.map((obj) => {
      return obj.startTime;
    });
    // let bookedEvents = [];
    console.log(bookedEvents, "bookedEvents");
    let daysAvail = daysAvailability;

    let availability = daysAvail.filter((day, i) => {
      if (dayIndex == 7) {
        dayIndex = 0;
      }

      if (dayIndex == i) {
        return true;
      } else {
        return false;
      }
    });
    let dayAvailability = availability[0];
    setday(dayAvailability.day);
    // console.log(day, "dayAvailability");
    const timeRecurresive = (slot) => {
      console.log(slot, "slot");
      return new Promise(function (myResolve, myReject) {
        const repeatFunc = (slot) => {
          calculateTime(bookedEvents, slot.startTime, slot.endTime).then(() => {
            if (addMoment !== slot.endTime) {
              repeatFunc(slot);
            } else {
              //   console.log(splitedTime)
              //   setSplitTimes(splitedTime);
              myResolve();
              // setSplitTime(time)
            }
          });
        };

        repeatFunc(slot);
      });
    };

    splitedTime = [];

    const NextSlots = (m) => {
      timeRecurresive(dayAvailability.slots[m]).then(() => {
        m++;
        if (m < dayAvailability.slots.length) {
          newSlot = true;
          NextSlots(m);
        } else {
          //   console.log(splitedTime);
          setSplitTimes(splitedTime);
        }
      });
    };

    newSlot = true;

    if (dayAvailability.available) {
      NextSlots(0);
      setmanagerAvailability("");
    } else {
      setmanagerAvailability("Manager is unAvailable on that date");
      console.log("Manager is unAvailable on that date");
    }

    // timeRecurresive()
  };
  const isDateDisabled = (date, daysAvailability) => {
    const selectedDate = moment(date);

    // Get the day of the week in short format (e.g., 'Sun', 'Mon', etc.)
    const dayOfWeek = selectedDate.format("ddd");

    console.log(dayOfWeek);

    const selectedDayAvailability = daysAvailability.find(
      (dayObj) => dayObj.day === dayOfWeek && !dayObj.available
    );

    return !!selectedDayAvailability;
  };
  const calculateTime = async (BookedEvents, startTime, endTime) => {
    return new Promise(function (resolve, reject) {
      if (!newSlot) {
        let oldMoment = addMoment;
        // console.log("addMoment  3: ", addMoment);
        addMoment = moment(addMoment, ["h:mm A"]).add(30, "m").format("LT");
        // console.log("addMoment  4: ", addMoment);
        let slot = `${oldMoment} - ${addMoment}`;

        if (!BookedEvents.includes(oldMoment)) {
          splitedTime.push(slot);
          console.log(slot, "slot");
        }

        resolve();
      } else {
        // console.log("addMoment  0: ", addMoment);
        addMoment = moment(startTime, ["h:mm A"]).add(30, "m").format("LT");
        // console.log("addMoment  2: ", addMoment);
        let slot = `${startTime} - ${addMoment}`;
        if (!BookedEvents.includes(startTime)) {
          splitedTime.push(slot);
        }
        newSlot = false;

        resolve();
      }
    });
  };
  console.log("reason", reason);
  const onHandleSubmit = async () => {
    console.log(time, "time");
    let tim = time.split(" - ");
    console.log(tim, "tim");
    console.log(tim[0]);
    let bodyData = {
      method: "POST",
      headers: {
        Accept: "application/json",
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        ...(layOut !== "" && { layoutId: layOut }),
        manager_id: managerid,
        role: Role,
        companyDomain: companyDomain,
        name: name,
        phone: phone,
        phone1: phone1,
        email: email,
        description: description,
        date: sdate,
        StartTime: tim[0],
        endTime: tim[1],
        day: day,
        reasonId: reason,
        propertyId: property,
        status: "pending",
      }),
    };
    const foundProperty = properties.find((item) => item._id === property);
    const desiredTitle = foundProperty ? foundProperty.title : null;
    setPropertyName(desiredTitle);
    console.log(bodyData, "bodyData");
    try {
      let response = await fetch(
        SERVER_URL + `/user_appointment/add_slot`,
        bodyData
      );
      let data = await response.json();

      if (data.status == 200) {
        toast(" Appointment is booked!");
        window.location.reload();
        setSplitTimes([]);
        formRef.current.reset();
      } else {
        toast(data.message);
      }
    } catch (error) {
      console.log(error);
    }
  };

  const layoutList =
    properties?.filter((v) => v?._id === property)[0]?.categoryList || [];

  return (
    <Modal
      size="md"
      isOpen={open}
      toggle={() => {
        setOpen(!open);
      }}
    >
      <ToastContainer />

      <div className="modal-header">
        <h5 className="modal-title mt-0" id="myLargeModalLabel">
          Book Appointment
        </h5>
        <button
          onClick={() => {
            setOpen(!open);
            // setmodal_large2(false)
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
        <div className="col-md-12">
          <AvForm
            className="w-100"
            ref={formRef}
            onValidSubmit={(e) => {
              e.preventDefault();
              onHandleSubmit();
            }}
          >
            {/* {managerAvailability} */}
            {/* {addEventError && <p style={{ color: "red" }}>{addEventError}</p>} */}
            <Row className="d-flex flex-wrap" form>
              <Col className="col-12 mb-2">
                <AvField
                  name="name"
                  label="Name *"
                  placeholder="Enter name"
                  type="text"
                  errorMessage="Please Enter the name"
                  validate={{
                    required: { value: true },
                  }}
                  onChange={(e) => {
                    setName(e.target.value);
                  }}
                />
              </Col>

              <Col className="col-12 mb-2">
                <AvField
                  name="email"
                  label="Email *"
                  placeholder="Enter email"
                  type="email"
                  errorMessage="Please Enter the email"
                  validate={{
                    required: { value: true },
                  }}
                  onChange={(e) => {
                    setEmail(e.target.value);
                  }}
                />
              </Col>

              <Col className="col-6 mb-3 " style={{ paddingRight: "7px" }}>
                <AvField
                  name="phone"
                  label="Phone *"
                  type="number"
                  placeholder="Enter phone number"
                  errorMessage="Please Enter a valid phone number"
                  validate={{
                    required: {
                      value: true,
                      errorMessage: "Phone number is required",
                    },
                    pattern: {
                      value: /^\d{10,15}$/, // Regular expression to allow only digits and limit the length to between 10 and 15.
                      errorMessage:
                        "Phone number must be between 10 and 15 digits",
                    },
                  }}
                  onChange={(e) => {
                    setPhone(e.target.value);
                  }}
                />
              </Col>
              <Col className="col-6 mb-3 " style={{ paddingRight: "7px" }}>
                <AvField
                  name="phone"
                  label="Other Phone"
                  type="number"
                  placeholder="Enter phone number"
                  // errorMessage="Please Enter the phone number"
                  // validate={{
                  //   required: { value: true },
                  // }}
                  validate={{
                    pattern: {
                      value: /^\d{10,15}$/, // Regular expression to allow only digits and limit the length to between 10 and 15.
                      errorMessage:
                        "Phone number must be between 10 and 15 digits",
                    },
                  }}
                  onChange={(e) => {
                    setPhone1(e.target.value);
                  }}
                />
              </Col>
              <Col className="col-6 mb-3">
                <AvField
                  name="Reason Type"
                  label="Reason Type *"
                  type="select"
                  errorMessage="Please select reason type"
                  validate={{
                    required: { value: true },
                  }}
                  onChange={(e) => {
                    setReason(e.target.value);
                  }}
                >
                  <option>Select Reason</option>
                  {reasonType.length > 0 ? (
                    <>
                      {reasonType?.map((item) => {
                        return (
                          <option value={item._id}>{item.reasonType}</option>
                        );
                      })}
                    </>
                  ) : (
                    <>
                      <option>{"Not available"}</option>
                    </>
                  )}
                </AvField>
              </Col>
              <Col className="col-12 mb-2">
                <AvField
                  name="Comment"
                  label="Comment"
                  type="textarea"
                  placeholder="Enter comment"
                  // errorMessage="Please Enter the comment"
                  // validate={{
                  //   required: { value: true },
                  // }}
                  onChange={(e) => {
                    setdescription(e.target.value);
                  }}
                />
              </Col>
              <Col className="col-6 mb-3 " style={{ paddingRight: "7px" }}>
                <AvField
                  type="select"
                  name="event_Property"
                  label="Choose Property *"
                  validate={{
                    required: { value: true },
                  }}
                  errorMessage="Please select a property"
                  onChange={(e) => {
                    setproperty(e.target.value);
                  }}
                >
                  <option>Select Property</option>
                  {properties.length > 0 ? (
                    <>
                      {properties?.map((item) => {
                        return <option value={item._id}>{item.title}</option>;
                      })}
                    </>
                  ) : (
                    <>
                      <option>{"Not available"}</option>
                    </>
                  )}
                </AvField>
              </Col>

              <Col className="col-6 mb-3 " style={{ paddingLeft: "7px" }}>
                <AvField
                  type="select"
                  name="event_Category"
                  label="Choose Layout"
                  // validate={{
                  //   required: { value: true },s
                  // }}
                  onChange={(e) => {
                    setlayOut(e.target.value);
                  }}
                >
                  <option value={""}>Select Layout</option>
                  {layoutList.length > 0 ? (
                    <>
                      {layoutList?.map((item) => {
                        return (
                          <option value={item._id}>{item.layoutName}</option>
                        );
                      })}
                    </>
                  ) : (
                    <>
                      <option>{"Not available"}</option>
                    </>
                  )}
                </AvField>
              </Col>

              <Col className="col-6 mb-2" style={{ paddingRight: "7px" }}>
                <AvField
                  name="event_date"
                  label="Appointment Date *"
                  type="date"
                  min={new Date().toJSON().split("T")[0]}
                  value={defaultDate}
                  validate={{
                    required: {
                      value: true,
                      errorMessage: "Please select appointment date",
                    },
                    customValidation: (value, ctx) => {
                      if (value && isDateDisabled(value, daysAvailability)) {
                        return "Selected date is not available for appointment";
                      }
                      return true;
                    },
                  }}
                  onChange={(e) => {
                    setSlots(e.target.value);
                    setSdate(e.target.value);
                  }}
                />
              </Col>

              <Col className="col-6 mb-3 " style={{ paddingLeft: "7px" }}>
                <AvField
                  type="select"
                  name="event_slot"
                  label="Choose Slot *"
                  validate={{
                    required: { value: true },
                  }}
                  errorMessage="Please select event slot"
                  onChange={(e) => {
                    setTime(e.target.value);
                  }}
                >
                  {" "}
                  <option>Select Slot</option>
                  {managerAvailability === "" ? (
                    <>
                      {splitTimes?.map((slot) => {
                        return <option value={slot}>{slot}</option>;
                      })}
                    </>
                  ) : (
                    <>
                      <option>{"No Slots Available"}</option>
                    </>
                  )}
                </AvField>
              </Col>
            </Row>
            <Row>
              <Col>
                <div className="text-center">
                  <button
                    type="submit"
                    className="btn btn-primary save-event me-2"
                  >
                    Submit
                  </button>
                  <button
                    type="button"
                    className="btn btn-light me-2"
                    onClick={() => window.location.replace("/apps-calendar")}
                  >
                    Close
                  </button>
                </div>
              </Col>
            </Row>
          </AvForm>
        </div>
        {/* <div className="col-md-12 d-flex flex-wrap align-items-center justify-content-center">
                        <button className="btn btn-success mo-mb-2 mr-10"
                            disabled={loading}

                            onClick={(e) => {
                                //addSpeciality(e)
                                // tog_rating_view()
                                cancelAppointment(idToCancel)
                            }}
                        >
                            {loading && <div
                                id="saveSpinner"
                                style={{
                                    height: "15px",
                                    width: "15px",
                                    marginLeft: "5px",
                                }}
                                class="spinner-border"
                                role="status"
                            ></div>}
                            Yes</button>
                        <button className='btn btn-danger' onClick={(e) => { bookAppoinment_view() }}>No</button>
                        <br />
                    </div> */}
      </div>
    </Modal>
  );
};

export default BookAppointmentModal;
