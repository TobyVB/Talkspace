import React from "react";
import { useCollectionData } from "react-firebase-hooks/firestore";
import { getFirestore, collection, query, orderBy } from "firebase/firestore";
import Notification from "./Notification.js";
import { getAuth } from "firebase/auth";

export default function Notifications(props) {
  const db = getFirestore();
  const auth = getAuth();

  localStorage.setItem("uid", auth.currentUser.uid);
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

  return (
    <div className="notifications">
      <button className="close-notify" onClick={props.toggleNotifyWindow}>
        CANCEL
      </button>
      {notifications && notifications.length < 1 && (
        <p>No new notifications.</p>
      )}
      <div>
        {notifications &&
          notifications.map(
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
