import { Outlet } from "react-router-dom";
import Navbar from "./Navbar.js";
import Footer from "./Footer.js";
import Notifications from "./Notifications.js";
import { useAuthState } from "react-firebase-hooks/auth";
import { getAuth } from "firebase/auth";
import { useLoaderData } from "react-router-dom";

import { useState, useEffect } from "react";
import {
  getFirestore,
  onSnapshot,
  collection,
  query,
  orderBy,
} from "firebase/firestore";

const SharedLayout = () => {
  const data = useLoaderData();
  const db = getFirestore();
  const auth = getAuth();
  useAuthState(auth);
  const [notifyWindow, setNotifyWindow] = useState(false);
  const [navOpen, setNavOpen] = useState(false);
  const [allowLogin, setAllowLogin] = useState(true);
  const [loginCompleted, setLoginCompleted] = useState(false);

  function toggleNotifyWindow() {
    setNotifyWindow((prevNotifyWindow) => !prevNotifyWindow);
  }
  function triggerNav() {
    setNavOpen((prev) => !prev);
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
            localStorage.setItem("userData", user);
          }
        });
      });
      console.log("user has been updated from app.js");
      setAllowLogin(false);
      setLoginCompleted(true);
    }
  }
  function exit() {
    auth.signOut();
    setAllowLogin(true);
  }
  function menuSignOut() {
    exit();
  }

  return (
    <div className="App">
      <Navbar
        toggleNotifyWindow={toggleNotifyWindow}
        menuSignOut={menuSignOut}
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
