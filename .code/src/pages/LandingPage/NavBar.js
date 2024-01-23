import React, { useCallback, useState } from "react";
import "./styles.css";
import { loginUser } from "../../store/actions";
import { useLocation, useHistory } from "react-router-dom";

const NavBar = (props) => {
  const history = useHistory();

  const [showMenu, setShowMenu] = useState(false);

  const onMenuIconClick = () => {
    setShowMenu(!showMenu);
  };

  const onSignInClick = async () => {
    history.push("/login");
  };

  const onHomeClick = () => {
    history.push("/home");
  };

  const onContactClick = () => {
    history.push("/contact");
  };

  const location = useLocation();
  console.log("location", location.pathname);

  return (
    <div className="nav">
      <i
        class="fa fa-solid fa-bars"
        id="menu_icon"
        onClick={() => onMenuIconClick()}
      ></i>
      {showMenu && (
        <div className="menuList">
          <ul>
            <li onClick={() => onHomeClick()}>Home</li>
            {/* <li>About Us</li>
            <li>How it Works</li>
            <li>Blog</li> */}
            <li onClick={() => onContactClick()}>Contact Us</li>
          </ul>
          <div className="signIn_btn_mob" onClick={() => onSignInClick()}>
            Sign In
          </div>
        </div>
      )}
      <img src="images/logo-sm.svg" style={{height:"5rem"}} onClick={() => onHomeClick()} />
      <div className="navList">
        <p onClick={() => onHomeClick()}>Home</p>
        {/* <p>About Us</p>
            <p>How it Works</p>
            <p>Blog</p> */}
        <p onClick={() => onContactClick()}>Contact Us</p>
        <div className="signIn_btn" onClick={() => onSignInClick()}>
          Sign In
        </div>
      </div>
    </div>
  );
};

export default NavBar;
