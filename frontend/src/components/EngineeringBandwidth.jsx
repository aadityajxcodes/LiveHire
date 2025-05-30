import React from "react";
import "./EngineeringBandwidth.css";


const EngineeringBandwidth = () => {
  return (
    <div className="container">
      <div className="text">
        <span>Optimize Your </span>
        <span className="highlight">Engineering Resources</span>
      </div>
      {/* <div className="image-container"> */}
        <div className="top-image">
          {/* <img src="top-image.jpg" alt="Video call woman" />
           */}
           <img src="../images/hero1.png" alt="main" className="second-img" />
          {/* <div className="code-snippet">📄</div> */}
        </div>
        <div className="bottom-image">
          {/* <img src="bottom-image.jpg" alt="Video call man" />/ */}
        </div>
      </div>
    // </div>
  );
};

export default EngineeringBandwidth;
