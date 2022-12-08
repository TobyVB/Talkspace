import "./App.css";
import { useEffect, useState } from "react";
import { initializeApp } from "firebase/app";
import { getAuth } from "firebase/auth";
import {
  getFirestore,
  onSnapshot,
  collection,
  query,
  orderBy,
} from "firebase/firestore";
import { useCollectionData } from "react-firebase-hooks/firestore";
import { useAuthState } from "react-firebase-hooks/auth";

import { getStorage } from "firebase/storage";

// import Navbar from "./Components/Navbar.js";
import Notifications from "./Components/Notifications.js";
import Settings from "./Components/Settings.js";
import Homepage from "./Components/Homepage.js";
import ViewProfile from "./Components/ViewProfile.js";
import ViewEditProfile from "./Components/ViewEditProfile.js";
import Login from "./Components/Login.js";
import Register from "./Components/Register.js";
import ViewOtherProfile from "./Components/ViewOtherProfile";
import CreatePost from "./Components/CreatePost.js";
import ViewPost from "./Components/ViewPost.js";
import ViewEditPost from "./Components/ViewEditPost.js";
// settings
import ChangeUsername from "./Components/ChangeUsername.js";
import RetrievePassword from "./Components/RetrievePassword.js";
import ChangePassword from "./Components/ChangePassword.js";
import DeleteAccount from "./Components/DeleteAccount.js";

const firebaseConfig = {
  apiKey: "AIzaSyCXgrZdHQUbrEgrjTi71-Mc80WK0Ibj3zk",
  authDomain: "fir-practice-cace4.firebaseapp.com",
  projectId: "fir-practice-cace4",
  storageBucket: "fir-practice-cace4.appspot.com",
  messagingSenderId: "732318855377",
  appId: "1:732318855377:web:427b3c2f42cf708aaf15f0",
  measurementId: "G-Z5W900LJ0J",
};
const app = initializeApp(firebaseConfig);
export const storage = getStorage(app);

export default function App() {
  const auth = getAuth();
  const db = getFirestore();

  const [allowLogin, setAllowLogin] = useState(true);
  const [loginCompleted, setLoginCompleted] = useState(false);
  useAuthState(auth);

  function exit() {
    auth.signOut();
    setAllowLogin(true);
  }
  function cancelSignIn() {
    auth.signOut();
    setAllowLogin(true);
  }
  function SignOut() {
    return (
      auth.currentUser && (
        <button className="nav-btn" onClick={menuSignOut}>
          Sign Out
        </button>
      )
    );
  }

  updateAccess();
  function updateAccess() {
    if (auth.currentUser && allowLogin === true) {
      const usersRef = collection(db, "users");
      const q = query(usersRef, orderBy("createdAt"));
      onSnapshot(q, (snapshot) => {
        let users = [];
        snapshot.docs.forEach((doc) => {
          users.push({ ...doc.data() });
        });
        users.forEach((user) => {
          if (auth.currentUser && user.uid === auth.currentUser.uid) {
            setCaptured((prev) => {
              return { ...prev, userData: user };
            });
          }
        });
      });
      console.log("user has been updated from app.js");
      setAllowLogin(false);
      setLoginCompleted(true);
    }
  }

  useEffect(() => {
    if (loginCompleted === true) {
      if (auth.currentUser && !auth.currentUser.emailVerified) {
        auth.signOut();
        setAllowLogin(true);
      }
      setLoginCompleted(false);
    }
  }, [loginCompleted]);

  const [notifyWindow, setNotifyWindow] = useState(false);
  function toggleNotifyWindow() {
    setNotifyWindow((prevNotifyWindow) => !prevNotifyWindow);
  }

  const [page, setPage] = useState("home");
  function changePageTo(arg) {
    setPage(arg);
  }
  const pages = {
    settings: "settings",
    home: "home",
    register: "register",
    login: "login",
    profile: "profile",
    otherProfile: "otherProfile",
    createPost: "createPost",
    post: "post",
    editPost: "editPost",
    editProfile: "editProfile",
    changeUsername: "changeUsername",
    retrievePassword: "retrievePassword",
    changePassword: "changePassword",
    deleteAccount: "deleteAccount",
  };

  const [startUp, setStartUp] = useState(false);
  function restartPage() {
    setPage(99);
    setStartUp(true);
  }

  const [updateReadyGo, setUpdateReadyGo] = useState(false);
  function updateReady() {
    setUpdateReadyGo(true);
    updateAccess();
  }
  useEffect(() => {
    if (updateReadyGo === true) {
      console.log("userData.aboutMe: " + captured.userData.aboutMe);
      changePageTo(pages.home);
      setUpdateReadyGo(false);
    }
  }, [updateReadyGo]);

  useEffect(() => {
    if (startUp === true) {
      changePageTo(pages.post);
      setStartUp(false);
    }
  }, [startUp]);

  const [useNavClassNone, setUseNavClassNone] = useState(true);
  const navClassNone = useNavClassNone ? "none" : "";
  const [navToggle, setNavToggle] = useState(false);

  function showMenu() {
    setUseNavClassNone((prev) => !prev);
    setNavToggle((prev) => !prev);
  }
  function hideMenu() {
    setUseNavClassNone(true);
    setNavToggle(false);
  }
  // ############################################################
  const [captured, setCaptured] = useState({
    uid: "",
    postId: "",
    unique: "",
    currentCommentId: "",
    userData: "",
  });
  // ############################################################

  if (page !== "post") {
    sessionStorage.clear();
  }

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
  // const nav = {
  //   currentUser: auth.currentUser,
  //   page: page,
  //   pages: pages,
  //   showMenu,
  //   toggleNotifyWindow,
  //   notifications: notifications,
  //   navToggle: navToggle,
  //   auth: auth,
  //   menuSignOut,
  // };
  function menuSignOut() {
    exit();
    changePageTo(pages.home);
    hideMenu();
  }
  const menu = {
    menuHome() {
      changePageTo(pages.home);
      hideMenu();
    },
    menuLogin() {
      changePageTo(pages.login);
      hideMenu();
    },
    menuRegister() {
      changePageTo(pages.register);
      hideMenu();
    },
    menuProfile() {
      changePageTo(pages.profile);
      hideMenu();
    },
    menuCreatePost() {
      changePageTo(pages.createPost);
      hideMenu();
    },
    menuSettings() {
      changePageTo(pages.settings);
      hideMenu();
    },
  };

  return (
    <div className="App">
      <header>
        <div className={`header ${navToggle && `header-toggle`}`}>
          <div className="nav-title">
            <p>The</p>
            <h1 onClick={menu.menuHome}>TalkSpace</h1>
          </div>
          <div className="menu-container">
            <div className={`login-header-buttons  ${navClassNone}`}>
              {!auth.currentUser && (
                <>
                  <button
                    className="nav-btn"
                    disabled={page === pages.login ? "+true" : ""}
                    onClick={menu.menuLogin}
                  >
                    Login
                  </button>
                  <button
                    className="nav-btn"
                    disabled={page === pages.register ? "+true" : ""}
                    onClick={menu.menuRegister}
                  >
                    Register
                  </button>
                </>
              )}
              {auth.currentUser && (
                <>
                  <button
                    className="nav-btn"
                    disabled={page === pages.profile ? "+true" : ""}
                    onClick={menu.menuProfile}
                  >
                    Profile
                  </button>
                  <button
                    className="nav-btn"
                    disabled={page === pages.createPost ? "+true" : ""}
                    onClick={menu.menuCreatePost}
                  >
                    Create Post
                  </button>
                  <button
                    className="nav-btn"
                    disabled={page === pages.settings ? "+true" : ""}
                    onClick={menu.menuSettings}
                  >
                    Settings
                  </button>
                </>
              )}
              {auth.currentUser && <SignOut />}
            </div>
            <button className="showNav" onClick={showMenu}>
              menu
            </button>
            {auth.currentUser && auth.currentUser.emailVerified && (
              <button className="bell" onClick={toggleNotifyWindow}>
                🛎
                <span className="notification-num">
                  {" "}
                  {notifications &&
                    auth.currentUser &&
                    notifications.filter(
                      (notification) => auth.currentUser.uid === notification.to
                    ).length > 0 &&
                    notifications.filter(
                      (notification) => auth.currentUser.uid === notification.to
                    ).length}
                </span>
              </button>
            )}
          </div>
        </div>
      </header>

      <section onClick={hideMenu}>
        {notifyWindow && (
          <Notifications
            toggleNotifyWindow={toggleNotifyWindow}
            uid={auth.currentUser.uid}
            captured={captured}
            toPost={changePageTo(pages.post)}
            restartPage={restartPage}
            notifications={notifications}
          />
        )}
        {auth.currentUser && page === pages.settings && (
          <Settings changePageTo={changePageTo} />
        )}
        {auth.currentUser && page === pages.profile && (
          <ViewProfile
            changePageTo={changePageTo}
            setCaptured={setCaptured}
            signout={exit}
          />
        )}
        {auth.currentUser && page === pages.editProfile && (
          <ViewEditProfile changePageTo={changePageTo} captured={captured} />
        )}
        {page === pages.home && (
          <Homepage setCaptured={setCaptured} changePageTo={changePageTo} />
        )}
        {!auth.currentUser && page === pages.login && (
          <Login
            updateReady={updateReady}
            setAllowLogin={setAllowLogin}
            cancelSignIn={cancelSignIn}
          />
        )}
        {!auth.currentUser && page === pages.register && (
          <Register goToLogin={changePageTo(pages.login)} exit={exit} />
        )}
        {auth.currentUser && page === pages.otherProfile && (
          <ViewOtherProfile
            captured={captured}
            setCaptured={setCaptured}
            changePageTo={changePageTo}
          />
        )}
        {auth.currentUser && page === pages.createPost && (
          <CreatePost changePageTo={changePageTo} setCaptured={setCaptured} />
        )}
        {auth.currentUser && page === pages.post && (
          <ViewPost
            captured={captured}
            setCaptured={setCaptured}
            changePageTo={changePageTo}
          />
        )}
        {auth.currentUser && page === pages.editPost && (
          <ViewEditPost captured={captured} changePageTo={changePageTo} />
        )}
        {auth.currentUser && page === pages.changeUsername && (
          <ChangeUsername changePageTo={changePageTo} />
        )}
        {auth.currentUser && page === pages.retrievePassword && (
          <RetrievePassword changePageTo={changePageTo} />
        )}
        {auth.currentUser && page === pages.changePassword && (
          <ChangePassword changePageTo={changePageTo} />
        )}
        {auth.currentUser && page === pages.deleteAccount && (
          <DeleteAccount changePageTo={changePageTo} captured={captured} />
        )}
      </section>

      <div className="footer">
        <h3 className="footer-email">tobcvb@gmail.com 2022</h3>
      </div>
    </div>
  );
}
