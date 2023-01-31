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

export default function CreateComment(props) {
  const auth = getAuth();
  const db = getFirestore();
  const commentsRef = collection(db, "comments");
  const notifyRef = collection(db, "notifyComment");
  const [formValue, setFormValue] = useState("");

  function createComment(e) {
    addDoc(commentsRef, {
      body: formValue,
      by: props.user.id,
      to: props.to,
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
          <button onClick={createComment} disabled={!formValue}>
            {props.type === "reply" ? "REPLY" : "COMMENT"}
          </button>
          {props.comment && props.user.uid === props.comment.uid && (
            <button>DELETE</button>
          )}
        </div>
      )}
    </>
  );
}
