import React from "react";
import "./styles.css";
import MailIcon from "./assets/Icons/MailIcon";
import PhoneIcon from "./assets/Icons/PhoneIcon";
import FacebookIcon from "./assets/Icons/FacebookIcon";
import InstagramIcon from "./assets/Icons/InstagramIcon";
import YoutubeIcon from "./assets/Icons/YoutubeIcon";
import { useHistory } from "react-router-dom";

const Footer = () => {
  const history = useHistory();

  const onHomeClick = () => {
    history.push("/home");
  };

  const onContactClick = () => {
    history.push("/contact");
  };
  return (
    <div className="Footer column">
      <div className="Footer_Content">
        <div className="Footer_Section1 column">
          <img src="images/logo-sm.svg" />
          <p>
            Rentdigicare is a one stop solution for both landlord and tenants,
            this is the reason we are leading in rental home industry. Renting
            your next home as a renter can be tiresome and even frustrating
            especially when you find the place you want to rent.
          </p>
        </div>
        <div className="Footer_Section2 column">
          <h2 className="font26">Quick Links</h2>
          <ul>
            <li onClick={() => onHomeClick()}>Home</li>
            {/* <li>About Us</li>
            <li>How it Works</li>
            <li>Blog</li> */}
            <li onClick={() => onContactClick()}>Contact Us</li>
          </ul>
        </div>
        <div className="Footer_Section3 column">
          <h2 className="font26">Contact Details</h2>
          <div className="contact mb-3">
            <MailIcon />{" "}
            <span className="ml-2">
              {" "}
              <a href="mailto: help@rentdigi.com">help@rentdigi.com</a>
            </span>
          </div>
          <div className="contact">
            <PhoneIcon />{" "}
            <span className="ml-2">
              <a href="tel:+1-844-999-3444"> +1-844-999-3444</a>
            </span>
          </div>
        </div>
      </div>
      <img src="images/SSL_Image.png" className="ssl_img" />

      <div className="Footer_Divider"></div>

      <div className="Social_Section ">
        <div className="social">
          <h3>Follow Us</h3>
          <div className="social_Icon">
            <a target="_blank" href="https://www.facebook.com/Rentdigi">
              <FacebookIcon />
            </a>
          </div>
          <div className="social_Icon">
            <a target="_blank" href="https://www.instagram.com/rentdigi/">
              <InstagramIcon />
            </a>
          </div>
          <div className="social_Icon">
            <a target="_blank" href="https://www.youtube.com/@rentdigi2735">
              <YoutubeIcon />
            </a>
          </div>
        </div>
        <p>©Copyrights 2023 - www.rentdigicare.com - All rights reserved</p>
      </div>
    </div>
  );
};

export default Footer;
