import { Outlet } from "react-router-dom";
import Navbar from "./Navbar.js";
import Footer from "./Footer.js";
import Notifications from "./Notifications.js";

const SharedLayout = (props) => {
  return (
    <div className="App">
      <Navbar
        navToggle={props.navToggle}
        menuSignOut={props.menuSignOut}
        navClassNone={props.navClassNone}
        auth={props.auth}
        showMenu={props.showMenu}
        toggleNotifyWindow={props.toggleNotifyWindow}
        notifications={props.notifications}
      />
      <div onClick={props.hideMenu}>
        <Outlet />
        {props.notifyWindow && (
          <Notifications toggleNotifyWindow={props.toggleNotifyWindow} />
        )}
      </div>

      <Footer />
    </div>
  );
};
export default SharedLayout;
