import { useEffect, useState } from "react";
import {
  getFirestore,
  collection,
  query,
  orderBy,
  onSnapshot,
} from "firebase/firestore";
import { useCollectionData } from "react-firebase-hooks/firestore";
import { NavLink } from "react-router-dom";
import { getAuth } from "firebase/auth";

export default function Navbar(props) {
  const auth = getAuth();
  const db = getFirestore();
  const notificationsRef = collection(db, "notifications");
  const notifyQ = query(notificationsRef, orderBy("createdAt"));
  const [notifications] = useCollectionData(notifyQ, {
    createdAt: "createdAt",
    unique: "unique",
    to: "to",
    from: "from",
    type: "type",
    message: "message",
    postId: "postId",
  });

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
  }, [props.navOpen]);

  function closeNav() {
    setUseNavClassNone(true);
    setNavToggle(false);
    setHidden("hidden");
  }

  function signOut() {
    closeNav();
    props.menuSignOut();
  }

  const [hidden, setHidden] = useState("hidden");
  const toggleHidden = () => {
    if (hidden === "hidden") {
      setHidden("");
    } else {
      setHidden("hidden");
    }
  };

  const usersRef = collection(db, "users");
  const [currentUser, setCurrentUser] = useState("");
  useEffect(() => {
    const q = query(usersRef, orderBy("createdAt"));
    onSnapshot(q, async (snapshot) => {
      snapshot.docs.forEach((doc) => {
        if (doc.data().uid === auth.currentUser.uid) {
          setCurrentUser({ ...doc.data(), id: doc.id });
        }
      });
    });
  }, []);

  return (
    <>
      {currentUser && (
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
              <div className={`header-btns-container  ${navClassNone}`}>
                {!auth.currentUser ? (
                  <div className="login-header-btns">
                    <NavLink
                      onClick={closeNav}
                      to="login"
                      className={({ isActive }) =>
                        isActive ? "link active" : "link"
                      }
                    >
                      Login
                    </NavLink>

                    <NavLink
                      onClick={closeNav}
                      to="register"
                      className={({ isActive }) =>
                        isActive ? "link active" : "link"
                      }
                    >
                      Register
                    </NavLink>
                  </div>
                ) : (
                  <div className="header-btns">
                    <NavLink
                      to={"profile/" + currentUser.id.toString()}
                      className={({ isActive }) =>
                        isActive ? "link active" : "link"
                      }
                    >
                      Profile
                    </NavLink>
                    <NavLink
                      onClick={closeNav}
                      to="createPost"
                      className={({ isActive }) =>
                        isActive ? "link active" : "link"
                      }
                    >
                      Create Post
                    </NavLink>

                    {/* S E T T I N G S   D R O P D O W N */}

                    <div>
                      <a className="link" onClick={toggleHidden}>
                        Settings ⬇
                      </a>
                      <div className={`settings-buttons ${hidden}`}>
                        <NavLink
                          className={"settings-link"}
                          to="changeUsername"
                        >
                          change username
                        </NavLink>
                        <NavLink
                          className={"settings-link"}
                          to="retreivePassword"
                        >
                          retrieve password
                        </NavLink>
                        <NavLink
                          className={"settings-link"}
                          to="changePassword"
                        >
                          change password
                        </NavLink>
                        <NavLink className={"settings-link"} to="deleteAccount">
                          delete account
                        </NavLink>
                      </div>
                    </div>
                    <NavLink className="link" to="/" onClick={signOut}>
                      SignOut
                    </NavLink>
                  </div>
                )}
              </div>
              {auth.currentUser && auth.currentUser.emailVerified && (
                <button className="bell" onClick={props.toggleNotifyWindow}>
                  🛎
                  <span className="notification-num">
                    {notifications &&
                      notifications.filter(
                        (notification) =>
                          auth.currentUser.uid === notification.to
                      ).length > 0 &&
                      notifications.filter(
                        (notification) =>
                          auth.currentUser.uid === notification.to
                      ).length}
                  </span>
                </button>
              )}
              <img
                className="mini-defaultPic"
                onClick={showMenu}
                src={currentUser.defaultPic}
              />
            </div>
          </div>
        </header>
      )}
    </>
  );
}
