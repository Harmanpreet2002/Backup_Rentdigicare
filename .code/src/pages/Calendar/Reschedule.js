import React, { useEffect, useState } from 'react'
import { useParams } from 'react-router-dom/cjs/react-router-dom.min';
import { Button, Modal, ModalFooter, ModalHeader } from 'reactstrap';
import { SERVER_URL } from '../ServerLink';

const RescheduleAppoinment = () => {
    const { appointmentId, calendarId } = useParams();
    const [modal, setModal]= useState(true);
    const [Appoinment, setAppoinment] = useState('');
    const [loading, setLoading] = useState(false)
    const cancelAppointment = async () => {
      setLoading(true)
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
        setLoading(false)
        window.location.href = `/calendar/${calendarId}`
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
    setModal(false);
    window.location.href = Appoinment.companyDomain
 }
 useEffect(()=>{
    getAppointment()
 },[])
    return (
        <Modal style={{top:'30%'}} isOpen={modal} toggle={toggle}>
        <ModalHeader style={{padding:'2rem'}} toggle={toggle}>Are you sure to reschedule your appointment? If you click 'Yes' then your previous appointment will be cancelled and you will be prompted to schedule your new appointment.</ModalHeader>
        <ModalFooter>
          <Button
            disabled={loading}
            color="primary"
            onClick={() => {
            cancelAppointment()
              // deleteAppoitnment();
            }}
          >
            Yes
          </Button>{" "}
          <Button color="secondary" onClick={()=>{window.location.href = Appoinment.companyDomain}}>
            No
          </Button>
        </ModalFooter>
      </Modal>
    )
}

export default RescheduleAppoinment