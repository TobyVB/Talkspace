import React from "react";
import { getFirestore } from "firebase/firestore";
import Notification from "./Notification.js";

export default function Notifications(props) {
  const db = getFirestore();

  return (
    <div className="notifications">
      <button className="close-notify" onClick={props.toggleNotifyWindow}>
        CANCEL
      </button>
      {props.notifications && props.notifications.length < 1 && (
        <p>No new notifications.</p>
      )}
      <div>
        {props.notifications &&
          props.notifications.map(
            (notification, index) =>
              notification.to === localStorage.getItem("uid") && (
                <Notification
                  key={index}
                  notification={notification}
                  toggleNotifyWindow={props.toggleNotifyWindow}
                />
              )
          )}
      </div>
    </div>
  );
}
