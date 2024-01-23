import React, { useState, useEffect } from "react";
import PropTypes from 'prop-types';
import {
  Dropdown,
  DropdownToggle,
  DropdownMenu,
  DropdownItem,
} from "reactstrap";

//i18n
import { withTranslation } from "react-i18next";
// Redux
import { connect } from "react-redux";
import { withRouter, Link } from "react-router-dom";

// users
import user1 from "../../../assets/images/users/avatar-1.jpg";
import { SERVER_URL, BUCKET_URL } from "../../../pages/ServerLink";
import jwt_decode from "jwt-decode";

const ProfileMenu = props => {
  const decode = jwt_decode(window.localStorage.accessToken)
  // Declare a new state variable, which we'll call "menu"
  const [menu, setMenu] = useState(false);

  const [username, setusername] = useState(decode.username || decode.email);
  const [profile, setProfile] = useState(decode.profile && !decode.profile.includes(BUCKET_URL) ? `${SERVER_URL}/${decode.profile}` : decode.profile);
  useEffect(() => {
    if (localStorage.getItem("authUser")) {
      if (process.env.REACT_APP_DEFAULTAUTH === "firebase") {
        const obj = JSON.parse(localStorage.getItem("authUser"));
        setusername(obj.displayName);
      } else if (
        process.env.REACT_APP_DEFAULTAUTH === "fake" ||
        process.env.REACT_APP_DEFAULTAUTH === "jwt"
      ) {
        // const obj = JSON.parse(localStorage.getItem("authUser"));
        // setusername(obj.username);
      }
    }
  }, [props.success]);

  function test() {
    window.localStorage.removeItem("role")
    window.localStorage.removeItem("accessToken")
    window.localStorage.removeItem("login_role")
  }

  return (
    <React.Fragment>
      <Dropdown
        isOpen={menu}
        toggle={() => setMenu(!menu)}
        className="d-inline-block"
      >
        <DropdownToggle
          className="btn header-item bg-soft-light border-start border-end"
          id="page-header-user-dropdown"
          tag="button"
        >
          <img
            className="rounded-circle header-profile-user"
            src={profile ? profile : user1}
            alt="Header Avatar"
          />
          <span className="d-none d-xl-inline-block ms-2 me-1">{username}</span>
          <i className="mdi mdi-chevron-down d-none d-xl-inline-block" />
        </DropdownToggle>
        <DropdownMenu className="dropdown-menu-end">
          {/* <DropdownItem tag="a" href="/contacts-profile">
            {" "}
            <i className="bx bx-user font-size-16 align-middle me-1" />
            {props.t("Profile")}{" "}
          </DropdownItem> */}
          <DropdownItem tag="a" href="/setting">
            {/* <span className="badge bg-success float-end">11</span> */}
            <i className="bx bx-wrench font-size-16 align-middle me-1" />
            {props.t("Settings")}
          </DropdownItem>
          {/* <DropdownItem tag="a" href="/page-lock-screen">
            <i className="bx bx-lock-open font-size-16 align-middle me-1" />
            {props.t("Lock screen")}
          </DropdownItem> */}
          {/* <div className="dropdown-divider" /> */}
          <a onClick={test}>
            <Link to={decode.role==="admin" ?"/sadmin" :"/Login" } className="dropdown-item">
              <i className="bx bx-power-off font-size-16 align-middle me-1 text-danger" />
              <span>{props.t("Logout")}</span>
            </Link>
          </a>
        </DropdownMenu>
      </Dropdown>
    </React.Fragment>
  );
};

ProfileMenu.propTypes = {
  success: PropTypes.any,
  t: PropTypes.any
};

const mapStatetoProps = state => {
  const { error, success } = state.Profile;
  return { error, success };
};

export default withRouter(
  connect(mapStatetoProps, {})(withTranslation()(ProfileMenu))
);
