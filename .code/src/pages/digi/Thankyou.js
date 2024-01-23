import React, { Children } from "react";
import ThankYou from './thnx.gif'
import { Link } from 'react-router-dom';

import './style.css'
function Thankyou(props) {
  
  return (
    <div className={`thankyou-screen ${props.customClass} text-${props.alignTitle}`}>
        <img src={ThankYou} />
        <div className={`Thankyou-title`}>
            <span>Thank You !</span>
        </div>
        <div className={`Thankyou-descrip`}>
          {props.descrip}
        </div>

            <Link className="dp-btn dp-bg-primary dp-color-white" to="/">Back To Home</Link>          
         
        
    </div>
  );
}

// Text.propTypes = {
//   after: PropTypes.bool,
// };

export default Thankyou;
