import React, { useState } from "react";
import { getAuth } from "firebase/auth";
import {
  collection,
  getFirestore,
  addDoc,
  serverTimestamp,
  onSnapshot,
  updateDoc,
  query,
  orderBy,
  doc,
} from "firebase/firestore";
import { useLocation, NavLink } from "react-router-dom";

export default function CreateComment(props) {
  const auth = getAuth();
  const db = getFirestore();
  const commentsRef = collection(db, "comments");
  const [formValue, setFormValue] = useState("");
  const location = useLocation();

  function createComment(e) {
    addDoc(commentsRef, {
      body: formValue,
      by: props.user.id,
      to: props.post.id,
      uid: props.user.uid,
      createdAt: serverTimestamp(),
    })
      // UPDATE HAS BEEN UPDATED...
      .then(() => {
        const q = query(commentsRef, orderBy("createdAt"));
        onSnapshot(q, async (snapshot) => {
          snapshot.docs.forEach((document) => {
            const docRef = doc(db, "comments", document.id);
            if (document.data().body === formValue) {
              updateDoc(docRef, {
                id: document.id,
              });
            }
          });
        });
      })
      .then(() => {
        setFormValue("");
      });
  }

  // ########################################################

  return (
    <>
      {auth.currentUser && (
        <div>
          <textarea
            style={{ width: "100%" }}
            className="sendChatMessageInput"
            cols={60}
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
            ENTER
          </NavLink>
        </div>
      )}
    </>
  );
}
