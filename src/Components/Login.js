import React, { useEffect, useRef, useState } from "react";
import { useCollectionData } from "react-firebase-hooks/firestore";
import {
  getAuth,
  signInWithEmailAndPassword,
  sendPasswordResetEmail,
} from "firebase/auth";
import { query, orderBy, collection, getFirestore } from "firebase/firestore";

export default function Login(props) {
  const auth = getAuth();
  const db = getFirestore();

  useEffect(() => {
    window.scrollTo(0, 0);
  }, []);

  function login(email, password) {
    return signInWithEmailAndPassword(auth, email, password);
  }

  const emailRef = useRef();
  const passwordRef = useRef();

  const usersRef = collection(db, "users");
  const qUsers = query(usersRef, orderBy("createdAt"));
  const [users] = useCollectionData(qUsers, {
    createdAt: "createdAt",
    uid: `uid`,
    username: "username",
    email: "email",
  });

  // loading is just used for disabling button
  const [loading, setLoading] = useState(false);
  async function handleLogin() {
    setLoading(true);
    try {
      await login(emailRef.current.value, passwordRef.current.value);
    } catch {
      console.log("error with handleSignup function in Register.js");
    }
    setLoading(false);
    props.updateReady();
    window.location.reload(false);
  }

  function sendResetPasswordLink() {
    sendPasswordResetEmail(auth, emailRef.current.value)
      .then(() => {
        // Password reset email sent!
        // ..
      })
      .catch((error) => {
        const errorCode = error.code;
        const errorMessage = error.message;
        console.log(errorCode);
        console.log(errorMessage);
        // ..
      });
  }

  const [forgotPassword, setForgotPassword] = useState(false);
  function forgotPasswordBtn() {
    setForgotPassword(true);
  }

  return (
    <div className="login-page page-body">
      <div className="form-login-email">
        <h1>LOG IN</h1>
        <label htmlFor="email">Enter email</label>
        <input
          ref={emailRef}
          id="email"
          className="input-user-cred"
          placeholder="email"
          name="email"
        />
        <label htmlFor="password">Enter password</label>
        <input
          ref={passwordRef}
          id="password"
          className="input-user-cred"
          placeholder="password"
          type="password"
          name="password"
        ></input>
        <hr></hr>
        <button disabled={loading} onClick={handleLogin}>
          login
        </button>
        {!forgotPassword && (
          <button onClick={forgotPasswordBtn}>forgot password?</button>
        )}
        {forgotPassword && (
          <div>
            <p>Click to send reset password link to your email</p>
            <input
              type="email"
              className="input-user-cred"
              ref={emailRef}
            ></input>
            <button onClick={sendResetPasswordLink}>send link</button>
          </div>
        )}
      </div>
    </div>
  );
}
