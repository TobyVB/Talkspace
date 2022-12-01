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

export default function Home(props) {
  const auth = getAuth();
  const db = getFirestore();

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
      props.updatePage();
      props.sendPostId(e);
    } else {
      props.verificationReminder();
    }
  }

  function viewProfile(e) {
    if (auth.currentUser && auth.currentUser.emailVerified) {
      props.goToProfile();
      props.sendUserId(e);
    } else {
      props.verificationReminder();
    }
  }
  function Post(props) {
    return (
      <div className="homepage-post">
        <div onClick={() => viewProfile(props.uid)} className="profile-link">
          Posted by{" "}
          {users &&
            users.map((user) => user.uid === props.uid && user.username)}
        </div>
        <p className="post-link" onClick={() => viewPost(props.id)}>
          {props.title}
        </p>
      </div>
    );
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
          posts.map((post) => (
            <Post
              id={post.id}
              key={post.id}
              title={post.title}
              uid={post.uid}
            />
          ))}
      </div>
    </div>
  );
}
