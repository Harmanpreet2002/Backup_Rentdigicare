import React from "react";
import { Accordion, Card } from "react-bootstrap";
import { Container } from "reactstrap";
import logoSvg from "../assets/images/logo-sm.svg";

const MasterHeader = () => {
  return (
    <div className="text-center">
      <div className="logo-top text-center">
        <img src={logoSvg} alt="" height="70" />
      </div>
      <h3 className="display-4 mb-4">FYI for Tenants</h3>
      <p className="lead">
        Welcome to our renting property company. Below are important sections
        for your information.
      </p>
    </div>
  );
};

const RequestTypeFYI = [
  {
    header: "Electrical Issue",
    body: (
      <div>
        {/* Video */}
        <video width="100%" height="auto" controls>
          <source
            src="https://www.rentdigicare.com/videos/Hero-Video.mp4"
            type="video/mp4"
          />
          Your browser does not support the video tag.
        </video>

        <p>
          If you are experiencing electrical issues, please make sure to check
          the circuit breakers in your property.
        </p>
        <p>
          If the problem persists, submit a maintenance request, providing
          detailed information about the issue and any troubleshooting steps
          you've taken.
        </p>
      </div>
    ),
  },
  {
    header: "Plumbing",
    body: "For plumbing issues such as leaks or clogs, try to identify the source of the problem and turn off the water supply if necessary. Submit a maintenance request with a clear description of the issue, including any DIY efforts you've made to address the problem.",
  },
  {
    header: "Air Condition",
    body: "If your air conditioning system is not working properly, check to ensure that the thermostat settings are correct and that the air filters are clean. If the issue persists, submit a maintenance request with details on the problem for prompt assistance.",
  },
  {
    header: "Application",
    body: "If you have questions or concerns related to the rental application process, please contact our leasing office directly. We are here to assist you with any inquiries you may have during the application and approval process.",
  },
  {
    header: "Clean Up / Spill",
    body: "In the event of a clean-up or spill, take immediate action to contain the situation and clean up any hazardous materials. If the cleanup requires professional assistance, please contact our maintenance team and provide details of the incident for a prompt response.",
  },
  {
    header: "Elevator",
    body: "If the elevator is not functioning correctly or if you notice any unusual noises or behavior, please report it immediately. Do not attempt to fix the issue yourself. Use the emergency button if necessary, and submit a maintenance request with a description of the problem.",
  },
  {
    header: "Smoke Detector",
    body: "Smoke detectors are crucial for your safety. If your smoke detector is beeping, it may indicate a low battery. Replace the battery promptly. If the issue persists or if there are any other problems with the smoke detector, submit a maintenance request for assistance.",
  },
];

const FYI = () => {
  return (
    <React.Fragment>
      <div className="bg-soft-light min-vh-100 py-5">
        <div className="py-4">
          {/* Header */}
          <MasterHeader />
          <Container>
            <Accordion defaultActiveKey="0">
              {RequestTypeFYI.map((section, index) => (
                <Card key={index}>
                  <Accordion.Item eventKey={index.toString()}>
                    <Accordion.Header>{section.header}</Accordion.Header>
                    <Accordion.Body>{section.body}</Accordion.Body>
                  </Accordion.Item>
                </Card>
              ))}
            </Accordion>
          </Container>
        </div>
      </div>
    </React.Fragment>
  );
};

export default FYI;
