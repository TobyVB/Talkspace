import { useEffect, useRef, useState } from "react";
import {
  getAuth,
  signInWithEmailAndPassword,
  sendPasswordResetEmail,
} from "firebase/auth";
import { useNavigate } from "react-router-dom";

export default function Login() {
  const auth = getAuth();
  const [passwordSent, setPasswordSent] = useState(false);
  const navigate = useNavigate();

  useEffect(() => {
    window.scrollTo(0, 0);
  }, []);

  function login(email, password) {
    return signInWithEmailAndPassword(auth, email, password);
  }

  const emailRef = useRef();
  const passwordRef = useRef();

  // loading is just used for disabling button
  const [loading, setLoading] = useState(false);
  async function handleLogin() {
    setLoading(true);
    try {
      await login(emailRef.current.value, passwordRef.current.value).then(
        () => {
          setLoading(false);
          navigate("/");
        }
      );
    } catch {
      console.log("error with handleSignup function in Register.js");
    }
  }

  function sendResetPasswordLink() {
    sendPasswordResetEmail(auth, emailRef.current.value)
      .then(() => {
        setPasswordSent(true);
        // Password reset email sent!
        // ..
      })
      .catch((error) => {
        setPasswordSent(false);
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
    <div className="page-body">
      <div className="form-login-email">
        <h1 className="cred-header">LOG IN</h1>
        <label className="cred-label" htmlFor="email">
          Enter email
        </label>
        <input ref={emailRef} id="email" placeholder="email" name="email" />
        <label className="cred-label" htmlFor="password">
          Enter password
        </label>
        <input
          ref={passwordRef}
          id="password"
          placeholder="password"
          type="password"
          name="password"
        ></input>
        <button
          className="submit cred-submit"
          disabled={loading}
          onClick={handleLogin}
        >
          login
        </button>

        {!forgotPassword && (
          <button style={{ marginTop: "3em" }} onClick={forgotPasswordBtn}>
            forgot password?
          </button>
        )}
        <hr style={{ margin: "2em 0", border: "none" }} />
        {forgotPassword && (
          <div>
            <p>Enter your email to send reset password link</p>
            <input placeholder="email" type="email" ref={emailRef}></input>
            <button onClick={sendResetPasswordLink}>send link</button>
            {passwordSent && <div>password sent!</div>}
          </div>
        )}
      </div>
    </div>
  );
}
