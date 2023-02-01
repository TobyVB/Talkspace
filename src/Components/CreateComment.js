import DeleteComment from "./DeleteComment.js";
import React, { useState, useEffect } from "react";
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
  const notifyRef = collection(db, "notifyComment");
  const [formValue, setFormValue] = useState("");
  const location = useLocation();

  function createComment(e) {
    addDoc(commentsRef, {
      body: formValue,
      by: props.user.id,
      to: props.to,
      uid: props.user.uid,
      masterComment: props.masterComment,
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
  const [inputClosed, setInputClosed] = useState(true);
  function toggleInput() {
    setInputClosed((prev) => !prev);
  }

  return (
    <>
      {auth.currentUser && (
        <div
          style={
            props.type === "comment"
              ? {
                  display: "flex",
                  flexDirection: "column-reverse",
                }
              : {}
          }
        >
          <div>
            <div style={{ display: "flex", justifyContent: "space-between" }}>
              {props.type === "reply" && (
                <button style={{ paddingLeft: "0" }} onClick={toggleInput}>
                  {inputClosed === true ? "REPLY" : "CLOSE"}
                </button>
              )}
              {props.comment &&
                props.user.uid === props.comment.uid &&
                props.delete === "yes" && (
                  <DeleteComment comment={props.comment} type={props.type} />
                )}
            </div>

            {/* USING NAVLINKS HERE TO UPDATE THE DATA */}
            {props.starter ? (
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
            ) : (
              <div style={{ display: "flex", flexDirection: "column" }}>
                <textarea
                  style={
                    inputClosed && props.type === "reply"
                      ? { display: "none" }
                      : { width: "100%" }
                  }
                  className="sendChatMessageInput"
                  cols={60}
                  value={formValue}
                  onChange={(event) => setFormValue(event.target.value)}
                  placeholder="Add a comment..."
                />
                <NavLink
                  style={
                    inputClosed === false
                      ? {
                          fontSize: ".8rem",
                          textDecoration: "none",
                        }
                      : { display: "none" }
                  }
                  to={location}
                  onClick={createComment}
                  disabled={!formValue}
                >
                  ENTER
                </NavLink>
              </div>
            )}
          </div>

          {props.starter && (
            <textarea
              style={
                inputClosed && props.type === "reply"
                  ? { display: "none" }
                  : { width: "100%" }
              }
              className="sendChatMessageInput"
              cols={60}
              value={formValue}
              onChange={(event) => setFormValue(event.target.value)}
              placeholder="Add a comment..."
            />
          )}
        </div>
      )}
    </>
  );
}

// create notification for the replyTo
// .then(() => {
//     if (currentUser.uid !== props.uid) {
//       addDoc(notifyRef, {
//         to: props.uid,
//         from: currentUser.id,
//         type: "comment",
//         message: `${currentUser.username} commented on your post.`,
//         postId: props.capturedPostId,
//         unique: unique,
//         createdAt: serverTimestamp(),
//       })
//         // UPDATE HAS BEEN UPDATED...
//         .then(() => {
//           const q = query(notifyRef, orderBy("createdAt"));
//           onSnapshot(q, async (snapshot) => {
//             snapshot.docs.forEach((document) => {
//               const docRef = doc(db, "notifications", document.id);
//               if (document.data().unique === unique) {
//                 console.log(unique);
//                 updateDoc(docRef, {
//                   id: document.id,
//                 });
//               }
//             });
//           });
//         });
//     }
