import { useEffect, useRef, useState } from "react";
import {
  getFirestore,
  collection,
  query,
  orderBy,
  onSnapshot,
} from "firebase/firestore";
import { useNavigate, NavLink, useLocation } from "react-router-dom";
import { getAuth } from "firebase/auth";

export default function Navbar(props) {
  const auth = getAuth();
  const db = getFirestore();
  const notifications = props.data.commentAlerts;
  const user = props.data.user;
  const navigate = useNavigate();
  const location = useLocation();

  const [navToggle, setNavToggle] = useState(false);
  const [useNavClassNone, setUseNavClassNone] = useState(true);
  const navClassNone = useNavClassNone ? "none" : "";

  function showMenu() {
    setUseNavClassNone((prev) => !prev);
    setNavToggle((prev) => !prev);
  }
  useEffect(() => {
    setUseNavClassNone(true);
    setNavToggle(false);
    setHidden("hidden");
    setGearClicked(false);
  }, [props.navOpen]);

  function closeNav() {
    setUseNavClassNone(true);
    setNavToggle(false);
    setHidden("hidden");
    setGearClicked(false);
  }

  function signOut() {
    closeNav();
    auth.signOut();
  }

  const [hidden, setHidden] = useState("hidden");
  const [gearClicked, setGearClicked] = useState(false);
  const toggleHidden = () => {
    if (hidden === "hidden") {
      setHidden("");
      setGearClicked(true);
    } else {
      setHidden("hidden");
      setGearClicked(false);
    }
  };

  const usersRef = collection(db, "users");
  const [currentUser, setCurrentUser] = useState("");
  useEffect(() => {
    if (auth.currentUser) {
      const q = query(usersRef, orderBy("createdAt"));
      onSnapshot(q, async (snapshot) => {
        snapshot.docs.forEach((doc) => {
          if (doc.data().uid === auth.currentUser.uid) {
            setCurrentUser({ ...doc.data(), id: doc.id });
          }
        });
      });
    }
  }, [auth.currentUser]);

  // let notesNum;
  // useEffect(() => {
  //   notesNum = notifications.filter(
  //     (notification) => notification.postCreator === user.id
  //   ).length;
  // }, [notifications]);

  return (
    <>
      {
        <header>
          <div className={`header ${navToggle && `header-toggle`}`}>
            <div className="nav-title">
              <p>The</p>
              <h1>
                <NavLink
                  onClick={closeNav}
                  style={{ color: "rgba(255,255,255,.75)" }}
                  to="/"
                >
                  Talkspace
                </NavLink>
              </h1>
            </div>

            <div className="menu-container">
              {!auth.currentUser ||
              (auth.currentUser && !auth.currentUser.emailVerified) ? (
                <div className="login-header-btns">
                  <NavLink
                    onClick={closeNav}
                    to="login"
                    className={({ isActive }) =>
                      isActive ? "link active logLink" : "link logLink"
                    }
                  >
                    Login
                  </NavLink>

                  <NavLink
                    onClick={closeNav}
                    to="register"
                    className={({ isActive }) =>
                      isActive ? "link active logLink" : "link logLink"
                    }
                  >
                    Register
                  </NavLink>
                </div>
              ) : (
                currentUser !== "" && (
                  <div className="header-btns">
                    <button
                      style={{ marginRight: "-.3em" }}
                      className="bell"
                      onClick={props.toggleNotifyWindow}
                    >
                      🛎
                      {auth.currentUser &&
                        user &&
                        notifications.filter(
                          (notification) => notification.postCreator === user.id
                        ).length > 0 && (
                          <span className="notification-num">
                            {
                              notifications.filter(
                                (notification) =>
                                  notification.postCreator === user.id
                              ).length
                            }
                          </span>
                        )}
                    </button>

                    <div
                      className="create"
                      style={{
                        marginTop: "-.2rem",
                      }}
                    >
                      <NavLink
                        onClick={closeNav}
                        to="createPost"
                        className={({ isActive }) =>
                          isActive ? "link active" : "link"
                        }
                      >
                        <span className="plus">+</span>
                      </NavLink>
                    </div>
                    <NavLink
                      onClick={closeNav}
                      to={"profile/" + currentUser.id.toString()}
                      className={({ isActive }) =>
                        isActive ? "link active" : "link"
                      }
                    >
                      <img
                        className="mini-defaultPic m-dp-size"
                        onClick={showMenu}
                        src={currentUser.defaultPic}
                      />
                    </NavLink>

                    {/* S E T T I N G S   D R O P D O W N */}

                    <div>
                      <a
                        style={
                          gearClicked
                            ? {
                                userSelect: "none",
                                display: "inline-block",
                                animation: "gearAnimation .35s 1",
                                cursor: "pointer",
                                color: "rgba(0,0,0,1)",
                              }
                            : {
                                fontSize: "1.25rem",
                                cursor: "pointer",
                              }
                        }
                        onClick={toggleHidden}
                      >
                        <span className="gear">⚙️</span>
                      </a>
                      <div className={`settings-buttons ${hidden}`}>
                        <NavLink
                          onClick={closeNav}
                          className={"settings-link"}
                          to="editProfile"
                        >
                          edit profile
                        </NavLink>
                        <NavLink
                          onClick={closeNav}
                          className={"settings-link"}
                          to="changeUsername"
                        >
                          change username
                        </NavLink>
                        <NavLink
                          onClick={closeNav}
                          className={"settings-link"}
                          to="changePassword"
                        >
                          change password
                        </NavLink>
                        <NavLink
                          className="settings-link link"
                          to="/"
                          onClick={signOut}
                        >
                          log out
                        </NavLink>
                        <NavLink
                          onClick={closeNav}
                          className={"settings-link"}
                          to="deleteAccount"
                        >
                          delete account
                        </NavLink>
                      </div>
                    </div>
                  </div>
                )
              )}
            </div>
          </div>
        </header>
      }
    </>
  );
}
