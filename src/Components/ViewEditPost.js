<<<<<<< HEAD
import React, { useEffect, useState, useRef } from "react";
=======
import React, { useEffect, useState } from "react";
>>>>>>> backup
import {
  query,
  orderBy,
  onSnapshot,
  collection,
  getFirestore,
  doc,
  updateDoc,
} from "firebase/firestore";
<<<<<<< HEAD
import { getAuth } from "firebase/auth";
import parse from "html-react-parser";
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

=======
import TextEditor from "./TextEditor";
import { useNavigate } from "react-router-dom";

export default function ViewPost(props) {
  const db = getFirestore();
  const [pagePause, setPagePause] = useState(true);
  const navigate = useNavigate();

  useEffect(() => {
    window.scrollTo(0, 0);
    setTimeout(() => {
      setPagePause(false);
    }, 250);
  }, []);

>>>>>>> backup
  // FIND THE POST DOC
  const postsRef = collection(db, "posts");
  const [foundPost, setFoundPost] = useState("");
  useEffect(() => {
    const q = query(postsRef, orderBy("createdAt"));
    onSnapshot(q, async (snapshot) => {
      snapshot.docs.forEach((doc) => {
<<<<<<< HEAD
        if (doc.data().id === props.capturedPostId) {
=======
        if (doc.data().id === localStorage.getItem("postId")) {
>>>>>>> backup
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
<<<<<<< HEAD
    props.cancel();
  }
  function save() {
    updatePost();
    props.cancel();
=======
    navigate("/post");
  }
  function save() {
    updatePost();
    navigate("/post");
>>>>>>> backup
  }
  // ##########################################################################
  const [postObj, setPostObj] = useState("");
  useEffect(() => {
    if (foundPost) {
<<<<<<< HEAD
      setPostObj({ ...foundPost, numInputs: foundPost.inputs.length });
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
=======
      setPostObj({ foundPost });
    }
  }, [foundPost]);
  // ##########################################################################
  const [capturedValue, setCapturedValue] = useState();
  const captureValue = (val) => setCapturedValue(val);
  // ##########################################################################

  return (
    <div className="page-body">
      <button disabled={pagePause && "+true"} onClick={cancel}>
        cancel
      </button>
      <button disabled={pagePause && "+true"} onClick={save}>
>>>>>>> backup
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
<<<<<<< HEAD
            className="post-defaultPic"
          />
        </div>
        <h4 className="post-title">{postObj.title}</h4>
        <div className="post-body">
          <TextEditor />
=======
            className="mini-defaultPic"
          />
        </div>
        <h4 className="post-title">{foundPost.title}</h4>
        <div className="post-body">
          <TextEditor
            createPost={false}
            foundValue={foundPost.text}
            captureValue={captureValue}
            setPostObj={setPostObj}
          />
>>>>>>> backup
        </div>
      </div>
    </div>
  );
}
<<<<<<< HEAD
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
// #############################
=======
>>>>>>> backup
