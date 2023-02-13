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

  function updateTitle(e) {
    if (title.length < 100) {
      setTitle(e);
    } else {
      setTitle(e);
      setTitle((prev) => prev.substring(0, prev.length - 1));
    }
  }

  return (
    <div className="page-body">
      <h1>Create a post</h1>
      {auth.currentUser && (
        <>
          <div className="post-page-post-container">
            <div className="create-post-form">
              <label>Title</label>
              <div
                style={{
                  display: "flex",
                  padding: ".5em .5em .5em .5em",
                  width: "100%",
                  border: "1px solid rgba(0, 0, 0, .2)",
                }}
              >
                <textarea
                  onKeyDown={function (e) {
                    if (e.key === "Enter") {
                      e.preventDefault();
                    } else if (e.key === "Delete") {
                      setTitle((prev) => prev.substring(0, prev.length - 1));
                    }
                  }}
                  id="title"
                  style={{
                    fontFamily: "sans-serif",
                    letterSpacing: ".02em",
                    // border: "1px solid rgba(0, 0, 0, .2)",
                    // borderRadius: "3px",
                    width: "100%",
                    margin: "0 .5em 0 0",
                    padding: "0",
                  }}
                  rows={2}
                  cols={1}
                  type="text"
                  placeholder="Add post title..."
                  value={title}
                  onChange={(event) => updateTitle(event.target.value)}
                />
                <div style={{ fontSize: ".8rem" }}>{title.length}/100</div>
              </div>

              <label>Post</label>
              <TextEditor createPost={true} captureValue={captureValue} />
            </div>
          </div>
          <button
            style={{ marginTop: "1em" }}
            className="submit"
            onClick={createPost}
            disabled={title === ""}
          >
            create post
          </button>
        </>
      )}
    </div>
  );
}
