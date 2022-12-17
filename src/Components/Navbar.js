import { NavLink } from "react-router-dom";

export default function Navbar(props) {
  function SignOut() {
    return (
      props.auth.currentUser && (
        <button className="nav-btn" onClick={props.menuSignOut}>
          Sign Out
        </button>
      )
    );
  }
  return (
    <header>
      <div className={`header ${props.navToggle && `header-toggle`}`}>
        <div className="nav-title">
          <p>The</p>
          <h1>
            <NavLink style={{ color: "rgba(255,255,255,.75)" }} to="/">
              TalkSpace
            </NavLink>
          </h1>
        </div>
        <div className="menu-container">
          <div className={`login-header-buttons  ${props.navClassNone}`}>
            {!props.auth.currentUser ? (
              <>
                <NavLink
                  to="login"
                  className={({ isActive }) =>
                    isActive ? "link active" : "link"
                  }
                >
                  {" "}
                  Login{" "}
                </NavLink>

                <NavLink
                  to="register"
                  className={({ isActive }) =>
                    isActive ? "link active" : "link"
                  }
                >
                  Register
                </NavLink>
              </>
            ) : (
              <>
                <NavLink
                  to="profile"
                  className={({ isActive }) =>
                    isActive ? "link active" : "link"
                  }
                >
                  Profile
                </NavLink>

                <NavLink
                  to="createPost"
                  className={({ isActive }) =>
                    isActive ? "link active" : "link"
                  }
                >
                  Create Post
                </NavLink>

                <NavLink
                  to="settings"
                  className={({ isActive }) =>
                    isActive ? "link active" : "link"
                  }
                >
                  Settings
                </NavLink>

                <SignOut />
              </>
            )}
          </div>
          <button className="showNav" onClick={props.showMenu}>
            menu
          </button>
          {props.auth.currentUser && props.auth.currentUser.emailVerified && (
            <button className="bell" onClick={props.toggleNotifyWindow}>
              🛎
              <span className="notification-num">
                {props.notifications &&
                  props.notifications.filter(
                    (notification) =>
                      props.auth.currentUser.uid === notification.to
                  ).length > 0 &&
                  props.notifications.filter(
                    (notification) =>
                      props.auth.currentUser.uid === notification.to
                  ).length}
              </span>
            </button>
          )}
        </div>
      </div>
    </header>
  );
}
