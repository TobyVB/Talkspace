import React, { useEffect, useState } from "react";
import { getFirestore, doc, updateDoc } from "firebase/firestore";
import TextEditor from "./TextEditor";
import { useNavigate, useLoaderData, useParams } from "react-router-dom";

export default function ViewPost(props) {
  const db = getFirestore();
  const [pagePause, setPagePause] = useState(true);
  const navigate = useNavigate();
  const { id } = useParams();
  const data = useLoaderData();
  const profiles = data.profiles;
  const posts = data.posts;
  const [profile, setProfile] = useState(null);
  const [post, setPost] = useState(null);
  const [capturedValue, setCapturedValue] = useState();
  const captureValue = (val) => setCapturedValue(val);
  const [newPost, setNewPost] = useState("filler");

  useEffect(() => {
    setNewPost((prev) => {
      return { ...prev, text: capturedValue };
    });
  }, [capturedValue]);

  useEffect(() => {
    posts.map((obj) => {
      if (obj.id === id) {
        setPost(obj);
        profiles.map((profile) => {
          if (obj.uid === profile.uid) {
            setProfile(profile);
          }
        });
      }
    });
  }, [id]);

  useEffect(() => {
    window.scrollTo(0, 0);
    setTimeout(() => {
      setPagePause(false);
    }, 250);
  }, []);

  async function updatePost() {
    const docRef = doc(db, "posts", post.id);
    await updateDoc(docRef, newPost).then(() => {
      navigate(-1);
    });
  }
  function cancel() {
    navigate(-1);
  }

  return (
    <>
      {post && profile && (
        <div className="page-body">
          <div
            style={{
              paddingTop: "1.75em",
            }}
          >
            <button
              className="profile-options"
              disabled={pagePause && "+true"}
              onClick={cancel}
            >
              CANCEL
            </button>
          </div>

          <div className="post-page-post-container">
            <div className="view-post-container">
              <h4 className="post-title">{post.title}</h4>
              <div className="post-text">
                <TextEditor
                  createPost={false}
                  foundValue={post.text}
                  captureValue={captureValue}
                  setPostObj={() => setPost}
                />
              </div>
            </div>
          </div>
          <button
            style={{ marginTop: ".6em" }}
            className="submit"
            disabled={pagePause && "+true"}
            onClick={updatePost}
          >
            SAVE
          </button>
        </div>
      )}
    </>
  );
}
