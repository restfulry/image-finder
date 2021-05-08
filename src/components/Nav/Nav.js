import React from "react";
import { Link } from 'react-router-dom';

const NavBar = () => {
  return (
    <div className="nav"> 
      <Link to={{pathname: "/"}} className="nav-link">Home</Link>
      <Link to={{pathname: "/upload"}} className="nav-link">Upload</Link>
      <Link to={{pathname: "/delete"}} className="nav-link">Manage</Link>
    </div>
  )
}

export default NavBar;