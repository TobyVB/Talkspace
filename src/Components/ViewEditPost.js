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

  // FIND THE POST DOC
  const postsRef = collection(db, "posts");
  const [foundPost, setFoundPost] = useState("");
  useEffect(() => {
    const q = query(postsRef, orderBy("createdAt"));
    onSnapshot(q, async (snapshot) => {
      snapshot.docs.forEach((doc) => {
        if (doc.data().id === localStorage.getItem("postId")) {
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
    navigate("/post");
  }
  function save() {
    updatePost();
    navigate("/post");
  }
  // ##########################################################################
  const [postObj, setPostObj] = useState("");
  useEffect(() => {
    if (foundPost) {
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
        </div>
      </div>
    </div>
  );
}
