import { useEffect, useState } from "react";
import { getAuth } from "firebase/auth";
import {
  collection,
  getFirestore,
  serverTimestamp,
  doc,
  setDoc,
} from "firebase/firestore";
import TextEditor from "./TextEditor";
import { useNavigate } from "react-router-dom";

export default function CreatePost() {
  const auth = getAuth();
  const db = getFirestore();
  const navigate = useNavigate();

  const [title, setTitle] = useState("");
  const [text, setText] = useState("");
  const [capturedValue, setCapturedValue] = useState("");
  const captureValue = (val) => setCapturedValue(val);
  useEffect(() => {
    setText(capturedValue);
  }, [capturedValue]);

  useEffect(() => {
    window.scrollTo(0, 0);
  }, []);

  function createPost() {
    const newPostRef = doc(collection(db, "posts"));
    setDoc(newPostRef, {
      uid: auth.currentUser.uid,
      follows: [],
      createdAt: serverTimestamp(),
      title: title,
      text: text,
      id: newPostRef.id,
    }).then(() => {
      navigate(`/posts/${newPostRef.id}`);
    });
  }

  return (
    <div className="page-body" style={{ paddingTop: "6.5em" }}>
      <h1 style={{ marginBottom: "2.5em" }}>Create a post</h1>
      {auth.currentUser && (
        <div className="create-post-form">
          <label>Title</label>
          <textarea
            style={{
              fontFamily: "sans-serif",
              letterSpacing: ".02em",
              margin: "0 0 2em 0",
              padding: "0",
              color: "rgba(255,255,255,.8",
              border: "1px solid rgba(255, 255, 255, .8)",
              borderRadius: "5px",
              padding: ".5em .5em 0 .5em",
            }}
            className="edit-post-textarea"
            cols={1}
            type="text"
            placeholder="Add post title..."
            value={title}
            onChange={(event) => setTitle(event.target.value)}
          />
          <label>Post</label>
          <TextEditor createPost={true} captureValue={captureValue} />
          <button
            style={{ marginTop: "1em" }}
            className="submit"
            onClick={createPost}
            disabled={title === ""}
          >
            create post
          </button>
        </div>
      )}
    </div>
  );
}
