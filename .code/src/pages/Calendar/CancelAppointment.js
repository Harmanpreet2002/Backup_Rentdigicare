import React, { useEffect, useState } from 'react'
import { useParams } from 'react-router-dom'
import ThankYou from '../../assets/images/thnx.gif'
import "./style.css";
import { SERVER_URL } from "../ServerLink";
import { Button, Modal, ModalBody, ModalFooter, ModalHeader } from 'reactstrap';



const CancelAppointment = () => {
  const { appointmentId, calendarId } = useParams();
  const [modal, setModal]= useState(true);
  const [show, setShow] = useState(false);
  const [Appointment, setAppoinment] = useState('')
  const cancelAppointment = async () => {
    setShow(true)
    let body = {
      appointmentId
    }
    let res = await fetch(
      SERVER_URL + '/user_appointment/cancel-appointment',
      {
        method: 'PATCH',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(body),
      }
    );
  }
  const getAppointment = async () => {
    try {
      const response = await fetch(`${SERVER_URL}/user_appointment/get_appointment/${appointmentId}`);
      const data = await response.json();
  
      if (response.ok) {
        // The request was successful
        const appointment = data.appointment;
        console.log(appointment);
        setAppoinment(appointment);
        // Handle the appointment data here as needed
      } else {
        // The server returned an error
        console.log(`Error: ${data.message}`);
        // Handle the error as needed
      }
    } catch (error) {
      // An error occurred while fetching the data
      console.log('Error:', error.message);
      // Handle the error as needed
    }
  };
  const toggle = ()=>{
    setModal(!modal);
    setTimeout(()=>{
      window.location.href = Appointment.companyDomain
    }, 10000)
  }
  useEffect(() => {
    getAppointment();
  }, [])
  return (
    <div className="calendarForm container">
      {
        !modal && show &&
        <div className="row" style={{ minHeight: '80vh', minWidth: '8vh' }}>
        <div className="col-md-6 mx-auto">
          <div className="text-center" >
            <img src={ThankYou} />
            <div className={`thankyou-title`}>
              <span>Thank You !</span>
            </div>
            <h5>
              We are sorry to inform you that we have cancelled your appointment. To reschedule the appointment click below
            </h5>
            <p className="text-center" style={{ padding: '10px', margin: '0' }}>
      <a
        href={`/reschedule-appoinment/${appointmentId}/${calendarId}`}
        className="btn btn-primary"
        target="_blank"
        rel="noopener noreferrer"
        style={{
          textDecoration: 'none',
          transition: 'all 100ms ease-in',
          WebkitTextSizeAdjust: 'none',
          MozTextSizeAdjust: 'none',
          msTextSizeAdjust: 'none',
          WebkitLineHeightRule: 'exactly',
          color: '#FFFFFF',
          fontSize: '14px',
          fontWeight: 'bold',
          fontStyle: 'normal',
          lineHeight: '17px',
          width: 'auto',
          textAlign: 'center',
          padding: '15px 30px',
          borderRadius: '50px',
          fontFamily: 'arial, "helvetica neue", helvetica, sans-serif',
        }}
      >
        Reschedule Appointment
      </a>
    </p>
          </div>
        </div>
      </div>
      }
      <Modal style={{top:'30%'}} isOpen={modal} toggle={toggle}>
        <ModalHeader toggle={toggle}>Are you sure to cancel your appointment ?</ModalHeader>
        <ModalFooter>
          <Button
            color="primary"
            onClick={() => {
              toggle()
              cancelAppointment()

              // deleteAppoitnment();
            }}
          >
            Yes
          </Button>{" "}
          <Button color="secondary" onClick={()=>window.location.href = Appointment.companyDomain}>
            No
          </Button>
        </ModalFooter>
      </Modal>
    </div>
  )
}

export default CancelAppointment