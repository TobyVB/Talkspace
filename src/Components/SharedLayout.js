import { Outlet } from "react-router-dom";
import Navbar from "./Navbar.js";
import Footer from "./Footer.js";
import Notifications from "./Notifications.js";
import { useAuthState } from "react-firebase-hooks/auth";
import { getAuth } from "firebase/auth";
import { useLoaderData } from "react-router-dom";

import { useState } from "react";
import { getFirestore } from "firebase/firestore";

const SharedLayout = () => {
  const data = useLoaderData();
  const db = getFirestore();
  const auth = getAuth();
  useAuthState(auth);
  const [notifyWindow, setNotifyWindow] = useState(false);
  const [navOpen, setNavOpen] = useState(false);

  function toggleNotifyWindow() {
    setNotifyWindow((prevNotifyWindow) => !prevNotifyWindow);
    if (!notifyWindow) {
      // prevent body from scrolling
      document.body.style.overflow = "hidden";
    } else {
      // allow body to scroll again
      document.body.style.overflow = "auto";
    }
  }
  function triggerNav() {
    setNavOpen((prev) => !prev);
  }

  return (
    <div className="App">
      <Navbar
        data={data}
        toggleNotifyWindow={toggleNotifyWindow}
        navOpen={navOpen}
      />
      <div onClick={triggerNav}>
        <main>
          <Outlet />
        </main>
        {notifyWindow && (
          <Notifications data={data} toggleNotifyWindow={toggleNotifyWindow} />
        )}
      </div>

      <Footer />
    </div>
  );
};
export default SharedLayout;
