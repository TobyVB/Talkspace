import React, { useEffect } from "react";

export default function Settings(props) {
  useEffect(() => {
    window.scrollTo(0, 0);
  }, []);

  return (
    <div className="page-body">
      <h1 className="settings-title">Settings</h1>
      <hr></hr>
      <div className="settings-buttons">
        <button onClick={() => props.changePageTo("changeUsername")}>
          change username
        </button>
        <button onClick={() => props.changePageTo("retrievePassword")}>
          retrieve password
        </button>
        <button onClick={() => props.changePageTo("changePassword")}>
          change password
        </button>
        <button onClick={() => props.changePageTo("deleteAccount")}>
          delete account
        </button>
      </div>
    </div>
  );
}
