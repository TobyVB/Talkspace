export default function Navbar(props) {
  function SignOut() {
    return (
      props.nav.auth.currentUser && (
        <button className="nav-btn" onClick={props.nav.menuSignOut}>
          Sign Out
        </button>
      )
    );
  }
  return (
    <header>
      <div className={`header ${props.nav.navToggle && `header-toggle`}`}>
        <div className="nav-title">
          <p>The</p>
          <h1 onClick={props.menu.menuHome}>TalkSpace</h1>
        </div>
        <div className="menu-container">
          <div className={`login-header-buttons  ${props.nav.navClassNone}`}>
            {!props.nav.auth.currentUser && (
              <>
                <button
                  className="nav-btn"
                  disabled={
                    props.nav.page === props.nav.pages.login ? "+true" : ""
                  }
                  onClick={props.menu.menuLogin}
                >
                  Login
                </button>
                <button
                  className="nav-btn"
                  disabled={
                    props.nav.page === props.nav.pages.register ? "+true" : ""
                  }
                  onClick={props.menu.menuRegister}
                >
                  Register
                </button>
              </>
            )}
            {props.nav.auth.currentUser && (
              <>
                <button
                  className="nav-btn"
                  disabled={
                    props.nav.page === props.nav.pages.profile ? "+true" : ""
                  }
                  onClick={props.menu.menuProfile}
                >
                  Profile
                </button>
                <button
                  className="nav-btn"
                  disabled={
                    props.nav.page === props.nav.pages.createPost ? "+true" : ""
                  }
                  onClick={props.menu.menuCreatePost}
                >
                  Create Post
                </button>
                <button
                  className="nav-btn"
                  disabled={
                    props.nav.page === props.nav.pages.settings ? "+true" : ""
                  }
                  onClick={props.menu.menuSettings}
                >
                  Settings
                </button>
              </>
            )}
            {props.nav.auth.currentUser && <SignOut />}
          </div>
          <button className="showNav" onClick={props.nav.showMenu}>
            menu
          </button>
          {props.nav.auth.currentUser &&
            props.nav.auth.currentUser.emailVerified && (
              <button className="bell" onClick={props.nav.toggleNotifyWindow}>
                🛎
                <span className="notification-num">
                  {" "}
                  {props.nav.notifications &&
                    props.nav.auth.currentUser &&
                    props.nav.notifications.filter(
                      (notification) =>
                        props.nav.auth.currentUser.uid === notification.to
                    ).length > 0 &&
                    props.nav.notifications.filter(
                      (notification) =>
                        props.nav.auth.currentUser.uid === notification.to
                    ).length}
                </span>
              </button>
            )}
        </div>
      </div>
    </header>
  );
}
