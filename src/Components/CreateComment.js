import React, { useState } from "react";
import { getAuth } from "firebase/auth";
import {
  collection,
  getFirestore,
  serverTimestamp,
  doc,
  setDoc,
} from "firebase/firestore";
import { useLocation, NavLink } from "react-router-dom";

export default function CreateComment(props) {
  const auth = getAuth();
  const db = getFirestore();
  const [formValue, setFormValue] = useState("");
  const location = useLocation();

  function createComment() {
    const newCommentRef = doc(collection(db, "comments"));
    setDoc(newCommentRef, {
      body: formValue,
      by: props.user.id,
      to: props.post.id,
      uid: props.user.uid,
      createdAt: serverTimestamp(),
      id: newCommentRef.id,
      defaultPic: props.user.defaultPic,
      username: props.user.username,
    });
    const newAlertRef = doc(collection(db, "commentAlerts"));
    setDoc(newAlertRef, {
      body: formValue,
      fromId: props.user.id,
      fromUsername: props.user.username,
      post: props.post.id,
      postCreator: props.postCreator.id,
      createdAt: serverTimestamp(),
      id: newAlertRef.id,
      commentId: newCommentRef.id,
    });
    setFormValue("");
  }

  return (
    <>
      {auth.currentUser && (
        <div>
          <textarea
            style={{ width: "100%" }}
            className="create-comment"
            cols={60}
            rows={3}
            value={formValue}
            onChange={(event) => setFormValue(event.target.value)}
            placeholder="Add a comment..."
          />
          {/* USING NAVLINKS HERE TO UPDATE THE DATA */}
          <NavLink
            style={{
              fontSize: ".8rem",
              textDecoration: "none",
            }}
            to={location}
            onClick={createComment}
            disabled={!formValue}
          >
            <button className="submit">ENTER</button>
          </NavLink>
        </div>
      )}
    </>
  );
}
