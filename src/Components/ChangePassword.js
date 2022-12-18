import { getAuth, updatePassword } from "firebase/auth";
import React, { useState } from "react";

import { NavLink } from "react-router-dom";

export default function ChangePassword(props) {
  const auth = getAuth();

  const [password, setPassword] = useState("");
  const [showPass, setShowPass] = useState(false);
  const [success, setSuccess] = useState(false);
  function changeShowPass() {
    setShowPass((prevShowPass) => !prevShowPass);
  }

  const user = auth.currentUser;

  function update() {
    updatePassword(user, password)
      .then(() => {
        // Update successful.
        console.log("it worked");
        setSuccess(true);
        setTimeout(() => {
          <NavLink to="/settings" />;
        }, 3000);
      })
      .catch((error) => {
        // An error ocurred
        console.log(error);
        // ...
      });
  }
  function noSelect(event) {
    event.preventDefault();
  }

  return (
    <div className="page-body">
      <h1>Reset Password</h1>
      <input
        className="reset-password-input"
        type="password"
        name="password"
        value={password}
        onChange={(event) => setPassword(event.target.value)}
      />
      <button onMouseDown={noSelect} onClick={changeShowPass}>
        show password
      </button>
      <NavLink to="/settings">cancel</NavLink>
      {showPass && <p>{password}</p>}
      <button onClick={updatePassword}>save</button>
      {success && <p>SUCCESS!</p>}
    </div>
  );
}
