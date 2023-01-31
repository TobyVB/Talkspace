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
    await updateDoc(docRef, post);
  }
  function cancel() {
    navigate(-1);
  }
  function save() {
    updatePost();
    navigate(-1);
  }
  const [capturedValue, setCapturedValue] = useState();
  const captureValue = (val) => setCapturedValue(val);

  return (
    <>
      {post && profile && (
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
                onClick={() => props.sendUID(profile.uid)}
              >
                Authored by: {profile.username}
              </p>
              <img
                alt={profile.username}
                src={profile.defaultPic}
                className="mini-defaultPic"
              />
            </div>
            <h4 className="post-title">{post.title}</h4>
            <div className="post-body">
              <TextEditor
                createPost={false}
                foundValue={post.text}
                captureValue={captureValue}
                setPostObj={() => setPost}
              />
            </div>
          </div>
        </div>
      )}
    </>
  );
}
