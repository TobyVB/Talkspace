import { getAuth, updatePassword } from "firebase/auth";
import React, { useEffect, useState } from "react";

import { NavLink, useNavigate } from "react-router-dom";

export default function ChangePassword(props) {
  const auth = getAuth();

  const navigate = useNavigate();

  const [password, setPassword] = useState("");
  const [success, setSuccess] = useState(false);

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

  return (
    <div className="page-body">
      <h1>Reset Password</h1>
      <input
        className="reset-password-input"
        placeholder="enter new password"
        type="password"
        name="password"
        value={password}
        onChange={(event) => setPassword(event.target.value)}
      />
      <button onClick={() => navigate(-1)}>Back</button>
      <button onClick={update}>update</button>
      {success && <p>SUCCESS!</p>}
    </div>
  );
}
