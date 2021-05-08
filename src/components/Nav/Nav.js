import React from "react";
import { Link } from 'react-router-dom';

import "./Nav.css"

const NavBar = () => {
  return (
    <div className="nav-container"> 
      <Link to={{pathname: "/"}} className="nav-link">Image Repo</Link>
      <Link to={{pathname: "/upload"}} className="nav-link">Upload</Link>
      <Link to={{pathname: "/delete"}} className="nav-link">Manage</Link>
    </div>
  )
}

export default NavBar;