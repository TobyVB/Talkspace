import React, { useEffect, useState } from "react";

import {
  query,
  orderBy,
  onSnapshot,
  collection,
  getFirestore,
  doc,
  updateDoc,
} from "firebase/firestore";
import { getAuth } from "firebase/auth";
import TextEditor from "./TextEditor";

export default function ViewPost(props) {
  const db = getFirestore();
  const auth = getAuth();
  const [pagePause, setPagePause] = useState(true);
  useEffect(() => {
    window.scrollTo(0, 0);
    setTimeout(() => {
      setPagePause(false);
    }, 250);
  }, []);

  // FIND THE POST DOC
  const postsRef = collection(db, "posts");
  const [foundPost, setFoundPost] = useState("");
  useEffect(() => {
    const q = query(postsRef, orderBy("createdAt"));
    onSnapshot(q, async (snapshot) => {
      snapshot.docs.forEach((doc) => {
        if (doc.data().id === props.capturedPostId) {
          setFoundPost({ ...doc.data(), id: doc.id });
        }
      });
    });
  }, []);
  // FIND THE USER DOC
  const usersRef = collection(db, "users");
  const [foundUser, setFoundUser] = useState("");
  useEffect(() => {
    const q = query(usersRef, orderBy("createdAt"));
    onSnapshot(q, async (snapshot) => {
      snapshot.docs.forEach((doc) => {
        if (doc.data().uid === foundPost.uid) {
          setFoundUser({ ...doc.data(), id: doc.id });
        }
      });
    });
  }, [foundPost]);
  // ##########################################################################
  async function updatePost() {
    const docRef = doc(db, "posts", foundPost.id);
    await updateDoc(docRef, postObj);
  }
  function cancel() {
    props.cancel();
  }
  function save() {
    updatePost();
    props.cancel();
  }
  // ##########################################################################
  const [postObj, setPostObj] = useState("");
  useEffect(() => {
    if (foundPost) {
      setPostObj({ foundPost });
    }
  }, [foundPost]);
  // ##########################################################################

  // ##########################################################################

  return (
    <div className="page-body post">
      <button
        disabled={pagePause && "+true"}
        className="edit-post-btn"
        onClick={cancel}
      >
        cancel
      </button>
      <button
        disabled={pagePause && "+true"}
        className="edit-post-btn"
        onClick={save}
      >
        save
      </button>
      <div className="view-post-container">
        <div className="post-header">
          <p
            className="post-author"
            onClick={() => props.sendUID(foundUser.uid)}
          >
            Authored by: {foundUser.username}
          </p>
          <img
            alt={foundUser.username}
            src={foundUser.defaultPic}
            className="post-defaultPic"
          />
        </div>
        <h4 className="post-title">{postObj.title}</h4>
        <div className="post-body">
          <TextEditor />
        </div>
      </div>
    </div>
  );
}
// #############################
// #############################
// #############################
// #############################
// #############################
// #############################
// #############################
// #############################
// #############################
// #############################
// #############################
