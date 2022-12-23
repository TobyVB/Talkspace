import React, { useEffect, useState } from "react";
import { useCollectionData } from "react-firebase-hooks/firestore";
import {
  query,
  orderBy,
  onSnapshot,
  collection,
  getFirestore,
} from "firebase/firestore";
import { getAuth } from "firebase/auth";

import { useNavigate } from "react-router-dom";

export default function Homepage(props) {
  const auth = getAuth();
  const db = getFirestore();

  const navigate = useNavigate();

  useEffect(() => {
    window.scrollTo(0, 0);
  }, []);

  const usersRef = collection(db, "users");
  const [foundUsers, setFoundUsers] = useState("");
  useEffect(() => {
    const q = query(usersRef, orderBy("createdAt"));
    onSnapshot(q, async (snapshot) => {
      snapshot.docs.forEach((doc) => {
        setFoundUsers({ ...doc.data(), id: doc.id });
      });
    });
  }, []);

  const qUsers = query(usersRef, orderBy("createdAt"));
  const [users] = useCollectionData(qUsers, {
    createdAt: "createdAt",
    uid: `uid`,
    username: "username",
  });

  const postsRef = collection(db, "posts");
  const [foundPosts, setFoundPosts] = useState("");
  useEffect(() => {
    const q = query(postsRef, orderBy("createdAt"));
    onSnapshot(q, async (snapshot) => {
      snapshot.docs.forEach((doc) => {
        setFoundPosts({ ...doc.data(), id: doc.id });
      });
    });
  }, []);

  const qPosts = query(postsRef, orderBy("createdAt"));
  const [posts] = useCollectionData(qPosts, {
    createdAt: "createdAt",
    idField: "id",
    title: "title",
    uid: `uid`,
  });

  function viewPost(e) {
    if (auth.currentUser && auth.currentUser.emailVerified) {
      navigate("/post");
      localStorage.setItem("postId", e);
    }
  }

  function viewProfile(e) {
    if (auth.currentUser && auth.currentUser.emailVerified) {
      navigate("/otherProfile");
      localStorage.setItem("uid", e);
    }
  }

  return (
    <div className="page-body">
      <div className="homepage-header-text">
        <h1 className="welcome-homepage">Welcome to</h1>
        <div className="the-talkspace-homepage">
          <span className="the-homepage">The</span>
          <h1 className="talkspace-homepage">Talkspace</h1>
        </div>
      </div>
      <div className="homepage-posts">
        {posts &&
          posts.map((post, index) => (
            <div key={index} className="homepage-post">
              <div
                onClick={() => viewProfile(post.uid)}
                className="profile-link"
              >
                Posted by{" "}
                {users &&
                  users.map((user) => user.uid === post.uid && user.username)}
              </div>
              <p onClick={() => viewPost(post.id)} className="post-link">
                {post.title}
              </p>
            </div>
          ))}
      </div>
    </div>
  );
}
