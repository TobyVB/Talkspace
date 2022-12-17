import React, { useEffect, useState } from "react";
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
import TextEditor from "./TextEditor";
import { useNavigate } from "react-router-dom";

export default function CreatePost(props) {
  const auth = getAuth();
  const db = getFirestore();
  const postsRef = collection(db, "posts");
  const [unique, setUnique] = useState(nanoid());
  const navigate = useNavigate();

  useEffect(() => {
    window.scrollTo(0, 0);
  }, []);

  const [postObj, setPostObj] = useState({
    uid: auth.currentUser.uid,
    follows: [],
    approval: [],
    disapproval: [],
    createdAt: serverTimestamp(),
    unique: unique,
    title: "",
    text: "",
  });

  function createPost(e) {
    e.preventDefault();
    setPostObj({ ...postObj, text: capturedValue });
    addDoc(postsRef, postObj)
      // UPDATE HAS BEEN UPDATED...
      .then(() => {
        const q = query(postsRef, orderBy("createdAt"));
        onSnapshot(q, async (snapshot) => {
          snapshot.docs.forEach((document) => {
            const docRef = doc(db, "posts", document.id);
            if (document.data().unique === unique) {
              console.log(unique);
              updateDoc(docRef, {
                id: document.id,
              });
              navigate("/post");
              props.setCaptured((prev) => {
                return { ...prev, postId: document.id };
              });
            }
          });
        });
      });
  }

  // ##########################################################################
  const [capturedValue, setCapturedValue] = useState("");
  const captureValue = (val) => setCapturedValue(val);
  useEffect(() => {
    setPostObj({ ...postObj, text: capturedValue });
  }, [capturedValue]);
  // ##########################################################################

  return (
    <div className="page-body">
      <h1 className="create-post-h1">Create Post</h1>
      {auth.currentUser && (
        <div className="create-post-form" onSubmit={createPost}>
          <textarea
            className="edit-post-textarea"
            cols={1}
            type="text"
            placeholder="Add post title..."
            value={postObj.title}
            onChange={(event) =>
              setPostObj({ ...postObj, title: event.target.value })
            }
          />
          <div className="post-body">
            <TextEditor createPost={true} captureValue={captureValue} />
          </div>
          <hr></hr>
          <button onClick={createPost} type="submit" disabled={!postObj.title}>
            create post
          </button>
        </div>
      )}
    </div>
  );
}
