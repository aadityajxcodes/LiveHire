import React, { useState } from "react";
import { Link } from "react-router-dom";
import "./Navbar.css"; // Import CSS for styling
import { useNavigate } from "react-router-dom";

const Navbar = () => {
  const [active, setActive] = useState(""); // To track active section

  const handleScroll = (id) => {
    setActive(id);
    document.getElementById(id).scrollIntoView({ behavior: "smooth" });
  };

  const navigate = useNavigate();
//   const location = useLocation(); // Get the current route


  const handleLoginClick = () => {
    console.log("Login button clicked!"); // Debugging log
    navigate("/login-selection");
  };


  return (
    <nav className="navbar">
      <div className="logo">LIVEHIRE</div>
      <ul className="nav-links">
        <li>
          <button 
            className={active === "why-livehire" ? "active" : ""} 
            onClick={() => handleScroll("why-livehire")}
          >
            Why LIVEHIRE?
          </button>
        </li>
        <li>
          <button 
            className={active === "benefits" ? "active" : ""} 
            onClick={() => handleScroll("benefits")}
          >
            Benefits
          </button>
        </li>
        <li>
          <button 
            className={active === "contact-us" ? "active" : ""} 
            onClick={() => handleScroll("contact-us")}
          >
            Contact Us
          </button>
        </li>
      </ul>
      
      {/* <Link to="/login">
        <button className="login-btn">Login</button>
      </Link> */}

      
      {/* <button className="login-btn" onClick={()=> Navigate("/login-selection")}>Login</button> */}
      <button  className="login-btn" onClick={handleLoginClick}>Login</button>
       {/* Hide login button when on login-selection page
       {location.pathname !== "/login-selection" && (
        <button onClick={handleLoginClick}>Login</button>
      )} */}

    </nav>
  );
};

export default Navbar;