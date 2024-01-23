import React, { useRef, useEffect, useState } from "react";
import "./homeStyles.css";
import NavBar from "../NavBar";
import Footer from "../Footer";
import CorrectIcon from "../assets/Icons/CorrectIcon";
import { Carousel } from "@trendyol-js/react-carousel";
import { useInView } from "react-intersection-observer";
import CountUp from "react-countup";
import Slider from "react-slick";
import Star5 from "../assets/Rating/Star5";
import Star4_5 from "../assets/Rating/star4_5";
import Star4 from "../assets/Rating/Star4";
import axios from "../../../pages/api/axios";
import { toast } from "react-toastify";
import BlueStar4_5 from "../assets/Rating/BlueStart4_5";
import { useHistory } from "react-router-dom";

const ADD_FORM_DATA = "/leads/admin/addLead";

const rating_card = [
  {
    rating: <Star5 />,
    msg: "I have been using property management software for my rental properties, and it has been a game-changer. The automation features have significantly reduced manual work and saved me valuable time. I can focus more on growing my business and providing better service to my tenants.",
    userImg: "images/user_img.png",
    useName: "Vicky",
    useLocation: "GSK properties",
  },
  {
    rating: <Star5 />,
    msg: "The property management software I adopted has greatly improved my organization and accessibility to property-related information. With a centralized platform, I can easily access tenant details, maintenance history, and many more. It's a relief to have everything in one place, allowing me to quickly retrieve information and stay organized.",
    userImg: "images/user_img.png",
    useName: "Vinay",
    useLocation: "GSK properties",
  },
  {
    rating: <Star5 />,
    msg: "Communication with tenants has become a breeze since using property management software. The built-in messaging system has made it easy to send important updates, handle maintenance requests promptly, and address any queries. It has improved tenant satisfaction and strengthened the landlord-tenant relationship.",
    userImg: "images/user_img.png",
    useName: "Shawn",
    useLocation: "GSK properties",
  },
  {
    rating: <Star5 />,
    msg: "Managing applications has become much simpler with property management software. I have a clear overview of my rental applications, which helps me make better renting decisions and ensures accurate record-keeping.",
    userImg: "images/user_img.png",
    useName: "Rob",
    useLocation: "PK development",
  },
  {
    rating: <Star5 />,
    msg: "The maintenance and work order management capabilities of the property management software have been incredibly valuable. I can track maintenance requests, assign them to vendors or maintenance staff, and monitor the progress in real-time. It ensures that maintenance issues are addressed promptly, resulting in satisfied tenants and well-maintained properties.",
    userImg: "images/user_img.png",
    useName: "Chad",
    useLocation: "PK development",
  },
];

const Home = () => {
  const { ref: counterRef, inView: reachCounter } = useInView();

  const history = useHistory();

  const onContactClick = () => {
    history.push("/contact");
  };

  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [phone, setPhone] = useState("");
  const [company, setCompany] = useState("");
  const [nameError, setNameError] = useState("");
  const [emailError, setEmailError] = useState("");
  const [phoneError, setPhoneError] = useState("");
  const [companyError, setCompanyError] = useState("");
  const [windowWidth, setWindowWidth] = useState(0);

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
  const settings = {
    dots: false,
    infinite: true,
    slidesToShow: 5,
    slidesToScroll: 1,
    autoplay: true,
    autoplaySpeed: 3500,
    speed: 3500,
    pauseOnHover: true,
    cssEase: "linear",
    responsive: [
      {
        breakpoint: 1024,
        settings: {
          slidesToShow: 3,
          slidesToScroll: 3,
          infinite: true,
          dots: true,
        },
      },
      {
        breakpoint: 600,
        settings: {
          slidesToShow: 2,
          slidesToScroll: 2,
          initialSlide: 2,
        },
      },
      {
        breakpoint: 480,
        settings: {
          slidesToShow: 1,
          slidesToScroll: 1,
        },
      },
    ],
  };

  const toTop = () => {
    window.scrollTo({ top: 0, left: 0, behavior: "smooth" });
  };

  return (
    <>
      <NavBar />
      <section className="hero_banner_section ">
        {/* <div
          // style={{
          //   background: `url(${herobackground})`,
          // }}
          className="hero_banner_Img"
        ></div> */}
        <div className="banner_section">
          <div className="hero_banner">
            <h1>
              Automate your property management rental process and all operation online.
            </h1>
            <p>
              Get one stop online digital solution for maintenance, appointment
              with prospects and current tenants, online application and
              approval, online text messages and email notifications and much
              more.
            </p>
            <div className="cta_btn_container">
              <div className="strart_btn" onClick={() => onContactClick()}>
                SIGN UP FREE
              </div>
              <div className="strart_btn" onClick={() => onContactClick()}>
                BOOK A DEMO
              </div>
            </div>
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
      </section>

      <section className="trustedby_section container ">
        <h4>Trusted by forward-thinking enterprises globally</h4>

        <Slider {...settings}>
          <img src="images/gsk_prop_logo.JPG" />
          <img src="images/FCS_logo.png" />
          <img src="images/PK-logo.png" />
          <img src="images/SAM_logo.png" />
          <img src="images/BP_logo.png" className="d-inline" />
          <img src="images/CF_logo.png" />
        </Slider>
      </section>

      <section className="applications_section container">
        <div className="content_section">
          <h1>Applications</h1>
          <p>
            Tenants love this as they can fill out online application instantly
            for preapproval - leasing managers get notification and approve them
            online with credit checks. As a property owner - you can see each
            application status for every property. Closing ratio for each
            property based on application and this is where you can see an
            opportunity to train your leasing manager.
          </p>
          <ul className="d-none">
            <li className="points">
              <span className="bullet_point">
                <CorrectIcon />
              </span>
              Tenants can fill out online.
            </li>
            <li className="points">
              <span className="bullet_point">
                <CorrectIcon />
              </span>
              Leasing managers.
            </li>
            <li className="points">
              <span className="bullet_point">
                <CorrectIcon />
              </span>
              Property owners.
            </li>
            <li className="points">
              <span className="bullet_point">
                <CorrectIcon />
              </span>
              The closing ratio.
            </li>
            <li className="points">
              <span className="bullet_point">
                <CorrectIcon />
              </span>
              There is an opportunity.
            </li>
          </ul>
          <div className="learn_more_btn" onClick={() => onContactClick()}>
            Learn More
          </div>
        </div>

        <div className="img_section">
          <img src={"images/Applications.png"} alt="Applications_img" />
        </div>
      </section>

      <section className="maintenance_section container">
        <div className="img_section">
          <img src={"images/maintenance.png"} alt="Applications_img" />
        </div>

        <div className="content_section_right">
          <h1>Maintenance Online</h1>
          <p>
            No more tracking maintenance via calls, text, email, excel or
            paperwork. All online and assign to 3rd party vendors also or
            internal maintenance team.
          </p>
          <p>Resident can also see live update on each service requested.</p>
          <p>
            As a property owner you have birds eye view on each property to each
            suite, cost control for repair and management.
          </p>
          <ul className="pb-3 d-none">
            <li className="points">
              <span className="bullet_point">
                <CorrectIcon />
              </span>
              Tenants can fill out online.
            </li>
            <li className="points">
              <span className="bullet_point">
                <CorrectIcon />
              </span>
              Leasing managers.
            </li>
            <li className="points">
              <span className="bullet_point">
                <CorrectIcon />
              </span>
              Property owners.
            </li>
            <li className="points">
              <span className="bullet_point">
                <CorrectIcon />
              </span>
              The closing ratio.
            </li>
            <li className="points">
              <span className="bullet_point">
                <CorrectIcon />
              </span>
              There is an opportunity.
            </li>
          </ul>
          <div className="learn_more_btn" onClick={() => onContactClick()}>
            Learn More
          </div>
        </div>
      </section>

      <section className="calendar_section container">
        <div className="content_section">
          <h1>Online Calendar</h1>
          <p>
            Prospects can book appointment with leasing manager, property
            manager online for all showings.
          </p>
          <p>
            Current tenants can book online appointments to discuss anything.
          </p>
          <p>Growth in leads, sales and revenue.</p>
          <p>
            As a property owner- you can see how many appointments are booked
            for showings for each property manager and get closing ratio also.
          </p>
          <ul className="d-none">
            <li className="points">
              <span className="bullet_point">
                <CorrectIcon />
              </span>
              Tenants can fill out online.
            </li>
            <li className="points">
              <span className="bullet_point">
                <CorrectIcon />
              </span>
              Leasing managers.
            </li>
            <li className="points">
              <span className="bullet_point">
                <CorrectIcon />
              </span>
              Property owners.
            </li>
            <li className="points">
              <span className="bullet_point">
                <CorrectIcon />
              </span>
              The closing ratio.
            </li>
            <li className="points">
              <span className="bullet_point">
                <CorrectIcon />
              </span>
              There is an opportunity.
            </li>
          </ul>
          <div className="learn_more_btn" onClick={() => onContactClick()}>
            Learn More
          </div>
        </div>

        <div className="img_section">
          <img src={"images/Calendar.png"} alt="Calendar_img" />
        </div>
      </section>

      <section className="email_section container">
        <div className="img_section">
          <img src={"images/SMS_email.png"} alt="Applications_img" />
        </div>

        <div className="content_section_right">
          <h1>SMS text and Email</h1>
          <p>
            Communicate with tenants digitally instead of printing notices every
            month- snow removal, elevator reserved or out of service, new event
            on site - all online- save money on printer and paper. We have saved
            landlord over $23,000 in a year with rentdigicare with just this
            feature alone.
          </p>
          <ul className="pb-3 d-none">
            <li className="points">
              <span className="bullet_point">
                <CorrectIcon />
              </span>
              Tenants can fill out online.
            </li>
            <li className="points">
              <span className="bullet_point">
                <CorrectIcon />
              </span>
              Leasing managers.
            </li>
            <li className="points">
              <span className="bullet_point">
                <CorrectIcon />
              </span>
              Property owners.
            </li>
            <li className="points">
              <span className="bullet_point">
                <CorrectIcon />
              </span>
              The closing ratio.
            </li>
            <li className="points">
              <span className="bullet_point">
                <CorrectIcon />
              </span>
              There is an opportunity.
            </li>
          </ul>
          <div className="learn_more_btn" onClick={() => onContactClick()}>
            Learn More
          </div>
        </div>
      </section>

      <section className="websites_section container">
        <div className="content_section">
          <h1>Websites</h1>
          <h2>Expert Rent Property Services at Your Fingertips</h2>
          <p>
            At Rentdigicare, We can help you to create modern property management
            websites to get the leads for rental prospects and streamline your property management operations.
          </p>
          <ul>
            <li className="points">
              <CorrectIcon />
              Property Listings
            </li>
            <li className="points">
              <CorrectIcon />
              Advanced search
            </li>
            <li className="points">
              <CorrectIcon />
              IDX/MLS Integration
            </li>
            {/* <li className="points">
              <CorrectIcon />
              RENT Properties
            </li> */}
            <li className="points">
              <CorrectIcon />
              User Management (Register/Login)
            </li>
            <li className="points">
              <CorrectIcon />
              Live Chat/Newsletter Form Integration
            </li>
          </ul>
          <div className="learn_more_btn" onClick={() => onContactClick()}>
            Learn More
          </div>
        </div>

        <div className="img_section">
          <img src={"images/websites.png"} alt="Applications_img" />
        </div>
      </section>

      <section className="social_rating_section container">
        <h2 className="name">RentdigiCare Happy Client</h2>
        <div className="rating_container">
          <div className="rating_block">
            <img src="images/google_icon.png" />
            <div className="rating_content">
              <h5 className="heading">Google Rating</h5>
              <div className="rating">
                <p className="rating_value">4.8</p>
                <div className="rating_stars">
                  <Star4_5 />
                </div>
              </div>
              <p>Based on 357+ reviews</p>
            </div>
          </div>
          <div className="rating_block">
            <img src="images/facebook_icon.png" />
            <div className="rating_content">
              <h5 className="heading">Facebook Rating</h5>
              <div className="rating">
                <p className="rating_value">4.5</p>
                <div className="rating_stars">
                  <BlueStar4_5 />
                </div>
              </div>
              <p>Based on 357+ reviews</p>
            </div>
          </div>
        </div>
      </section>

      <section className="stats_section container">
        <div className="img_section">
          <img src={"images/stats.png"} alt="Applications_img" />
        </div>

        <div className="content_section_right">
          <h1>STATS</h1>
          <h2 className="pb-4">ACTIVE USERS</h2>

          <div className="num_container">
            <div className="counter_section" ref={counterRef}>
              <div>
                <p className="num_sec">
                  <CountUp
                    start={0}
                    end={reachCounter && 245}
                    duration={2}
                    delay={2}
                  />
                  +
                </p>
                <p>ACTIVE LANDLORDS</p>
              </div>
              <div>
                <p className="num_sec">
                  <CountUp
                    start={0}
                    end={reachCounter && 625}
                    duration={3}
                    delay={2}
                  />
                  +
                </p>
                <p>THIRD PARTY VENDORS</p>
              </div>
            </div>
            <div className="counter_section">
              <div>
                <p className="num_sec">
                  <CountUp
                    start={0}
                    end={reachCounter && 485}
                    duration={2.5}
                    delay={2}
                  />
                  +
                </p>
                <p>PROPERTY MANAGERS</p>
              </div>
              <div>
                <p className="num_sec">
                  <CountUp
                    start={0}
                    end={reachCounter && 1245}
                    duration={4}
                    delay={2}
                  />
                  +
                </p>
                <p>ACTIVE TENANTS</p>
              </div>
            </div>
          </div>
          <div className="learn_more_btn" onClick={() => onContactClick()}>
            Learn More
          </div>
        </div>
      </section>

      <section className="review_rating_section container">
        <h1>
          Loved by <i>businesses</i>, and <i>individuals</i> across the globe.
        </h1>

        <Carousel
          show={3}
          slide={1}
          swiping={true}
          autoSwipe={15000}
          className="swiper_in_pc d-none d-md-block"
        >
          {rating_card.map((data, ind) => {
            return (
              <div className="review_rating_card">
                {data.rating}
                <p>{data.msg}</p>
                <div className="user_details_block">
                  <img src={data.userImg} />
                  <div className="user_detail">
                    <p className="user_name">{data.useName}</p>
                    <p className="user_location">{data.useLocation}</p>
                  </div>
                </div>
              </div>
            );
          })}
        </Carousel>

        <Carousel
          show={1}
          slide={1}
          swiping={true}
          autoSwipe={8000}
          className="swiper_in_mobile d-md-none d-block"
        >
          {rating_card.map((data, ind) => {
            return (
              <div className="review_rating_card">
                {data.rating}
                <p>{data.msg}</p>
                <div className="user_details_block">
                  <img src={data.userImg} />
                  <div className="user_detail">
                    <p className="user_name">{data.useName}</p>
                    <p className="user_location">{data.useLocation}</p>
                  </div>
                </div>
              </div>
            );
          })}
        </Carousel>
      </section>

      <section className="cta_section container">
        <div className="img_section">
          <img src={"images/Applications.jpeg"} alt="Applications_img" />
        </div>

        <div className="content_section_right">
          <h1>Manage all your maintenance needs on one platform</h1>
          <p>Get reliable solutions to your toughest challenges.</p>

          <div className="cta_btn_container">
            <div className="strart_btn" onClick={() => toTop()}>
              SIGN UP FREE
            </div>
            <div className="strart_btn" onClick={() => toTop()}>
              BOOK A DEMO
            </div>
          </div>
        </div>
      </section>

      <Footer />
    </>
  );
};

export default Home;
