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

import { useAuthState } from "react-firebase-hooks/auth";
import { getStorage } from "firebase/storage";

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
// ############################################################
// ############################################################
// ############################################################

export default function App() {
  const auth = getAuth();
  const db = getFirestore();

  const [allowLogin, setAllowLogin] = useState(true);
  const [loginCompleted, setLoginCompleted] = useState(false);
  useAuthState(auth);

  // ############################################################
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
  // ############################################################
  function exit() {
    auth.signOut();
    setAllowLogin(true);
  }
  function cancelSignIn() {
    auth.signOut();
    setAllowLogin(true);
  }
  // ############################################################
  function menuSignOut() {
    exit();
  }
  // ############################################################

  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<SharedLayout menuSignOut={menuSignOut} />}>
          <Route index element={<Homepage />} />
          <Route
            path="login"
            element={
              <Login
                setAllowLogin={setAllowLogin}
                cancelSignIn={cancelSignIn}
              />
            }
          />
          <Route path="register" element={<Register exit={exit} />} />
          <Route path="profile" element={<ViewProfile signout={exit} />} />
          <Route path="editProfile" element={<ViewEditProfile />} />
          <Route path="otherProfile" element={<ViewOtherProfile />} />
          <Route path="createPost" element={<CreatePost />} />
          <Route path="settings" element={<Settings />} />
          <Route path="settings/changeUsername" element={<ChangeUsername />} />
          <Route
            path="settings/retreivePassword"
            element={<RetrievePassword />}
          />
          <Route path="settings/changePassword" element={<ChangePassword />} />
          <Route
            path="settings/deleteAccount"
            element={<DeleteAccount menuSignOut={menuSignOut} />}
          />

          <Route path="post" element={<ViewPost />} />
          <Route path="editPost" element={<ViewEditPost />} />
          {/* <Route path="*" element={<Dunno />} /> */}
          {/* Make error page ^ */}
        </Route>
      </Routes>
    </BrowserRouter>
  );
}
// ############################################################
// ############################################################
// ############################################################
// ############################################################
// ############################################################
// ############################################################
// ############################################################
// ############################################################
// ############################################################
// ############################################################
// ############################################################
// ############################################################
// ############################################################
// ############################################################
// ############################################################
