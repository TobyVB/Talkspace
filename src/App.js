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

// import Notifications from "./Components/Notifications.js";
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

import { Routes, Route, BrowserRouter } from "react-router-dom";
import SharedLayout from "./Components/SharedLayout";

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
  // ############################################################
  const [captured, setCaptured] = useState({
    uid: "",
    postId: "",
    unique: "",
    currentCommentId: "",
    userData: "",
  });
  // ############################################################
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
  // ############################################################
  const [page, setPage] = useState("home");
  const [notifyWindow, setNotifyWindow] = useState(false);
  const [startUp, setStartUp] = useState(false);
  const [updateReadyGo, setUpdateReadyGo] = useState(false);
  const [navToggle, setNavToggle] = useState(false);
  const [useNavClassNone, setUseNavClassNone] = useState(true);
  const navClassNone = useNavClassNone ? "none" : "";

  if (page !== "post") {
    sessionStorage.clear();
  }

  useEffect(() => {
    if (updateReadyGo === true) {
      console.log("userData.aboutMe: " + captured.userData.aboutMe);
      setUpdateReadyGo(false);
    }
  }, [updateReadyGo]);
  useEffect(() => {
    if (startUp === true) {
      setStartUp(false);
    }
  }, [startUp]);
  useEffect(() => {
    if (loginCompleted === true) {
      if (auth.currentUser && !auth.currentUser.emailVerified) {
        auth.signOut();
        setAllowLogin(true);
      }
      setLoginCompleted(false);
    }
  }, [loginCompleted]);

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
  // ############################################################
  function exit() {
    auth.signOut();
    setAllowLogin(true);
  }
  function cancelSignIn() {
    auth.signOut();
    setAllowLogin(true);
  }
  function toggleNotifyWindow() {
    setNotifyWindow((prevNotifyWindow) => !prevNotifyWindow);
  }
  function restartPage() {
    setPage(99);
    setStartUp(true);
  }
  function updateReady() {
    setUpdateReadyGo(true);
    updateAccess();
  }
  function showMenu() {
    setUseNavClassNone((prev) => !prev);
    setNavToggle((prev) => !prev);
  }
  function hideMenu() {
    setUseNavClassNone(true);
    setNavToggle(false);
  }
  // ############################################################
  function menuSignOut() {
    exit();
    hideMenu();
  }
  // ############################################################

  return (
    <BrowserRouter>
      <Routes>
        <Route
          path="/"
          element={
            <SharedLayout
              navToggle={navToggle}
              menuSignOut={menuSignOut}
              navClassNone={navClassNone}
              auth={auth}
              showMenu={showMenu}
              hideMenu={hideMenu}
              toggleNotifyWindow={toggleNotifyWindow}
              notifications={notifications}
              notifyWindow={notifyWindow}
            />
          }
        >
          <Route index element={<Homepage setCaptured={setCaptured} />} />
          <Route
            path="login"
            element={
              <Login
                updateReady={updateReady}
                setAllowLogin={setAllowLogin}
                cancelSignIn={cancelSignIn}
              />
            }
          />
          <Route path="register" element={<Register exit={exit} />} />
          <Route
            path="profile"
            element={<ViewProfile setCaptured={setCaptured} signout={exit} />}
          />
          <Route
            path="editProfile"
            element={<ViewEditProfile captured={captured} />}
          />
          <Route
            path="otherProfile"
            element={
              <ViewOtherProfile captured={captured} setCaptured={setCaptured} />
            }
          />
          <Route
            path="createPost"
            element={<CreatePost setCaptured={setCaptured} />}
          />
          <Route path="settings" element={<Settings />} />

          <Route
            path="post"
            element={<ViewPost captured={captured} setCaptured={setCaptured} />}
          />
          <Route
            path="editPost"
            element={<ViewEditPost captured={captured} />}
          />
          {/* 
          <Route
            path="notifications"
            element={
              <Notifications
                toggleNotifyWindow={toggleNotifyWindow}
                captured={captured}
                restartPage={restartPage}
                notifications={notifications}
              />
            }
          /> */}

          {/* <Route path="*" element={<Dunno />} /> */}
          {/* Make error page ^ */}
        </Route>
      </Routes>
    </BrowserRouter>
  );
}

{
  /* {auth.currentUser && page === pages.changeUsername && (
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
        )} */
}
