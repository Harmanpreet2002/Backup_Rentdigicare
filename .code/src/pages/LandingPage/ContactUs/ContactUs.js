import React, { useEffect, useState } from "react";
import NavBar from "../NavBar";
import Footer from "../Footer";
import "./contactStyles.css";
import axios from "../../../pages/api/axios";
import { toast } from "react-toastify";

const ADD_FORM_DATA = "/leads/admin/addLead";

const ContactUs = () => {
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [phone, setPhone] = useState("");
  const [company, setCompany] = useState("");
  const [nameError, setNameError] = useState("");
  const [emailError, setEmailError] = useState("");
  const [phoneError, setPhoneError] = useState("");
  const [companyError, setCompanyError] = useState("");

  const handleSubmitNormal = async () => {
    setNameError("");
    setEmailError("");
    setPhoneError("");
    setCompanyError("");
    let isValid = true;

    const isValidPhone = (value) => {
      // Regular expression to validate phone number
      // const phoneRegex = /^\+?\d+$/;
      const phoneRegex = /^\+?\d{10,}$/;
      return phoneRegex.test(value);
    };

    const isValidEmail = (value) => {
      // Basic email validation example
      const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
      return emailRegex.test(value);
    };
    if (name.trim() === "") {
      setNameError("Please enter your name.");
      isValid = false;
    }
    if (name.trim() === "") {
      setNameError("Please enter your name.");
      isValid = false;
    }
    if (company.trim() === "") {
      setCompanyError("Please enter your Company.");
      isValid = false;
    }

    if (email.trim() === "") {
      setEmailError("Please enter your email.");
      isValid = false;
    } else if (!isValidEmail(email)) {
      setEmailError("Please enter a valid email.");
      isValid = false;
    }
    if (phone.trim() === "") {
      setPhoneError("Please enter your phone number.");
      isValid = false;
    } else if (!isValidPhone(phone)) {
      setPhoneError("Please enter a valid phone number.");
      isValid = false;
    }

    if (isValid) {
      try {
        const response = await axios.post(ADD_FORM_DATA, {
          name: name,
          email: email,
          phone: phone,
          company: company,
        });
        if (response.data.status === 201) {
          toast.success(response.data.message);
          setName("");
          setEmail("");
          setPhone("");
          setCompany("");
        }
      } catch (error) {
        // toast.error("Form already submitted")
        setTimeout(() => {
          window.location.reload();
        }, 5000);
        // TODO proper message
      }
    }
  };

  useEffect(() => {
    // 👇️ scroll to top on page load
    window.scrollTo({ top: 0, left: 0, behavior: "smooth" });
  }, []);

  return (
    <>
      <NavBar />
      <div className="contact_conatiner">
        <div className="hero_banner">
          <h1>Automate your rental and leasing process & operation online.</h1>
          <p>
            Get one stop online digital solution for maintenance, Appointment
            with prospects and current tenants, online application and approval,
            Online Text messages and email notifications and much more.
          </p>
        </div>
        <div className="form_container">
          <div className="form">
            <h4>
              Discover the future of <big>property</big> management
            </h4>
            {/* <input type="text" placeholder="Name" />
            <input type="email" placeholder="Email" />
            <input type="text" placeholder="Phone" />
            <input type="text" placeholder="Company Name" />
            <div className="form_submit_btn">Submit</div> */}
            <input
              type="text"
              placeholder="Name"
              name="name"
              value={name}
              onChange={(e) => setName(e.target.value)}
            />
            {nameError && <div className="error">{nameError}</div>}
            <input
              type="email"
              placeholder="Email"
              name="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
            />
            {emailError && <div className="error">{emailError}</div>}
            <input
              type="text"
              placeholder="Phone"
              name="phone"
              value={phone}
              onChange={(e) => setPhone(e.target.value)}
            />
            {phoneError && <div className="error">{phoneError}</div>}
            <input
              type="text"
              placeholder="Company"
              name="company"
              value={company}
              onChange={(e) => setCompany(e.target.value)}
            />
            {companyError && <div className="error">{companyError}</div>}
            <div className="form_submit_btn" onClick={handleSubmitNormal}>
              Submit
            </div>
          </div>
        </div>
      </div>
      <Footer />
    </>
  );
};

export default ContactUs;
