import { Outlet } from "react-router-dom";
import Navbar from "./Navbar.js";
import Footer from "./Footer.js";
import Notifications from "./Notifications.js";

import { React, useState } from "react";

const SharedLayout = (props) => {
  const [notifyWindow, setNotifyWindow] = useState(false);

  function toggleNotifyWindow() {
    setNotifyWindow((prevNotifyWindow) => !prevNotifyWindow);
  }

  const [navOpen, setNavOpen] = useState(false);
  function triggerNav() {
    setNavOpen((prev) => !prev);
  }
  return (
    <div className="App">
      <Navbar
        toggleNotifyWindow={toggleNotifyWindow}
        menuSignOut={props.menuSignOut}
        navOpen={navOpen}
      />
      <div onClick={triggerNav}>
        <Outlet />
        {notifyWindow && (
          <Notifications toggleNotifyWindow={toggleNotifyWindow} />
        )}
      </div>

      <Footer />
    </div>
  );
};
export default SharedLayout;

// ############################################################
// ############################################################
// ############################################################
// ############################################################
// ############################################################
