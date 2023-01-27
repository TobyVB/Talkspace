import React, { useEffect, useState } from "react";
import {
  getFirestore,
  doc,
  onSnapshot,
  collection,
  query,
  orderBy,
  deleteDoc,
} from "firebase/firestore";

import { useNavigate } from "react-router-dom";

export default function Notification(props) {
  const db = getFirestore();
  const notificationsRef = collection(db, "notifications");

  const navigate = useNavigate();

  // get current notification
  const [currentNotification, setCurrentNotification] = useState("");
  useEffect(() => {
    const q = query(notificationsRef, orderBy("createdAt"));
    onSnapshot(q, async (snapshot) => {
      snapshot.docs.forEach((doc) => {
        if (doc.data().id === props.notification.id) {
          setCurrentNotification({ ...doc.data(), id: doc.id });
        }
      });
    });
  }, []);

  // grab that comment with the same unique as the currentNotification's unique
  const commentsRef = collection(db, "comments");
  const [currentComment, setCurrentComment] = useState("");
  useEffect(() => {
    if (currentNotification !== "") {
      const q = query(commentsRef, orderBy("createdAt"));
      onSnapshot(q, async (snapshot) => {
        snapshot.docs.forEach((doc) => {
          if (doc.data().unique === currentNotification.unique) {
            setCurrentComment({ ...doc.data(), id: doc.id });
          }
        });
      });
    }
  }, [currentNotification]);

  function checkNotification() {
    if (
      props.notification.type === "comment" ||
      props.notification.type === "reply"
    ) {
      localStorage.setItem("postId", props.notification.postId);
      navigate("/post");
    }
    props.toggleNotifyWindow();
    // Deletes the notification
    const docRef = doc(db, "notifications", currentNotification.id);
    deleteDoc(docRef)
      .then(() => {
        console.log("notification deleted");
      })
      .then(() => {
        localStorage.setItem("unique", currentNotification.unique);
      })
      // set session storage so replychain opens up if type is reply
      // do not want to activate this on a normal comment. I don't think it would work
      // anyway, could test that out...
      .then(() => {
        if ((currentNotification.type = "reply")) {
          sessionStorage.setItem(
            props.notification.unique,
            props.notification.unique
          );
        }
      })
      .then(() => {
        localStorage.setItem("currentCommentId", currentComment.id);
      });
  }

  return (
    <div className="flex">
      <p>{props.notification.message}</p>
      <button onClick={checkNotification} className="notifyGo">
        go
      </button>
    </div>
  );
}
