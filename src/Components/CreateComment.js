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
import { nanoid } from "nanoid";

export default function CreateComment(props) {
  const auth = getAuth();
  const db = getFirestore();
  const commentsRef = collection(db, "comments");
  const notifyRef = collection(db, "notifications");
  const [formValue, setFormValue] = useState("");

  const usersRef = collection(db, "users");
  const [currentUser, setCurrentUser] = useState("");
  // ########## A C C E S S   C U R R E N T   U S E R'S   D O C ##########
  useEffect(() => {
    const q = query(usersRef, orderBy("createdAt"));
    onSnapshot(q, async (snapshot) => {
      snapshot.docs.forEach((doc) => {
        if (doc.data().uid === auth.currentUser.uid) {
          setCurrentUser({ ...doc.data(), id: doc.id });
        }
      });
    });
  }, []);

  const [unique, setUnique] = useState(nanoid());

  function createComment(e) {
    e.preventDefault();
    addDoc(commentsRef, {
      body: formValue,
      uid: auth.currentUser.uid,
      approval: [],
      disapproval: [],
      type: props.type,
      replyTo: `${
        props.type === "comment"
          ? localStorage.getItem("postId")
          : props.comment.replyTo
      }`,
      username: currentUser.username,
      defaultPic: currentUser.defaultPic,
      chain: `${props.type === "comment" ? unique : props.comment.chain}`,
      unique: `${props.type === "comment" ? unique : props.comment.unique}`,
      createdAt: serverTimestamp(),
      postId: props.capturedPostId,
    })
      .then(() => {
        setFormValue("");
      })
      // UPDATE HAS BEEN UPDATED...
      .then(() => {
        const q = query(commentsRef, orderBy("createdAt"));
        onSnapshot(q, async (snapshot) => {
          snapshot.docs.forEach((document) => {
            const docRef = doc(db, "comments", document.id);
            if (props.type === "comment") {
              if (document.data().unique === unique) {
                console.log(unique);
                updateDoc(docRef, {
                  id: document.id,
                });
              }
            } else if (props.type === "reply") {
              if (document.data().unique === props.comment.unique) {
                console.log(unique);
                updateDoc(docRef, {
                  id: document.id,
                });
              }
            }
          });
        });
      })
      // create notification for the replyTo
      .then(() => {
        if (props.type === "comment") {
          if (currentUser.uid !== props.uid) {
            addDoc(notifyRef, {
              to: props.uid,
              from: currentUser.id,
              type: "comment",
              message: `${currentUser.username} commented on your post.`,
              postId: props.capturedPostId,
              unique: unique,
              createdAt: serverTimestamp(),
            })
              // UPDATE HAS BEEN UPDATED...
              .then(() => {
                const q = query(notifyRef, orderBy("createdAt"));
                onSnapshot(q, async (snapshot) => {
                  snapshot.docs.forEach((document) => {
                    const docRef = doc(db, "notifications", document.id);
                    if (document.data().unique === unique) {
                      console.log(unique);
                      updateDoc(docRef, {
                        id: document.id,
                      });
                    }
                  });
                });
              });
          }
        } else if (props.type === "reply")
          if (currentUser.uid !== props.comment.uid) {
            addDoc(notifyRef, {
              to: props.comment.uid,
              from: currentUser.id,
              type: "reply",
              message: `${currentUser.username} replied to your comment.`,
              postId: props.capturedPostId,
              unique: props.comment.unique,
              createdAt: serverTimestamp(),
            }).then(() => {
              const q = query(notifyRef, orderBy("createdAt"));
              onSnapshot(q, async (snapshot) => {
                snapshot.docs.forEach((document) => {
                  const docRef = doc(db, "notifications", document.id);
                  if (document.data().unique === props.comment.unique) {
                    console.log(unique);
                    updateDoc(docRef, {
                      id: document.id,
                    });
                  }
                });
              });
            });
          }
      });
    setUnique(nanoid());
  }

  // ########################################################

  return (
    <>
      {auth.currentUser && (
        <form className="create-comment-form" onSubmit={createComment}>
          <textarea
            className="sendChatMessageInput"
            cols={60}
            value={formValue}
            onChange={(event) => setFormValue(event.target.value)}
            placeholder="Add a comment..."
          />
          <button type="submit" disabled={!formValue}>
            COMMENT
          </button>
        </form>
      )}
    </>
  );
}
