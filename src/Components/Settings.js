import React, { useEffect } from "react";

import { NavLink } from "react-router-dom";

export default function Settings(props) {
  useEffect(() => {
    window.scrollTo(0, 0);
  }, []);

  return (
    <div className="page-body">
      <h1 className="settings-title">Settings</h1>
      <hr></hr>
      <div className="settings-buttons">
        <NavLink to="changeUsername">change username</NavLink>
        <NavLink to="retreivePassword">retrieve password</NavLink>
        <NavLink to="changePassword">change password</NavLink>
        <NavLink to="deleteAccount">delete account</NavLink>
      </div>
    </div>
  );
}
