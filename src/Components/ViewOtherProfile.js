import Clock from "./Utils/Clock.js";
import React, { useEffect, useState } from "react";
import { useCollectionData } from "react-firebase-hooks/firestore";
import {
  query,
  orderBy,
  onSnapshot,
  collection,
  getFirestore,
} from "firebase/firestore";
// import { updateCurrentUser } from "firebase/auth";

export default function ViewOtherProfile(props) {
  const db = getFirestore();

  // FIND THE USER DOC
  const usersRef = collection(db, "users");
  const [foundUser, setFoundUser] = useState("");
  useEffect(() => {
    const q = query(usersRef, orderBy("createdAt"));
    onSnapshot(q, async (snapshot) => {
      snapshot.docs.forEach((doc) => {
        if (doc.data().uid === props.capturedUID) {
          setFoundUser({ ...doc.data(), id: doc.id });
        }
      });
    });
  }, []);

  // FIND THE POST DOC
  const postsRef = collection(db, "posts");
  const [foundPosts, setFoundPosts] = useState("");
  useEffect(() => {
    const q = query(postsRef, orderBy("createdAt"));
    onSnapshot(q, async (snapshot) => {
      snapshot.docs.forEach((doc) => {
        if (doc.data().uid === foundUser.uid) {
          setFoundPosts({ ...doc.data(), id: doc.id });
        }
      });
    });
  }, [foundUser]);

  const q = query(postsRef, orderBy("createdAt"));
  const [posts] = useCollectionData(q, {
    createdAt: "createdAt",
    idField: "id",
    title: "title",
    uid: `uid`,
  });

  function viewPost(e) {
    props.updatePage();
    props.sendPostId(e);
  }

  function Post(props) {
    return (
      <>
        <p className="post-link" onClick={() => viewPost(props.id)}>
          {props.title}
        </p>
      </>
    );
  }

  return (
    <div className="page-style page-body">
      <h1 className="profile-header-text">{`${foundUser.username}'s page`}</h1>
      <div className="profile-jumbotron">
        <img
          alt="profile"
          className="profile-picture"
          src={foundUser.defaultPic}
        />
        <div>
          <div className="flex">
            <p>user since: </p>
            <Clock createdAt={foundUser.createdAt} />
          </div>
          <hr></hr>
          <p>{`${foundUser.aboutMe !== undefined ? foundUser.aboutMe : ""}`}</p>
        </div>
      </div>
      <div className="profile-post-sections">
        <div>
          <div>
            <h3>{`${foundUser.username}'s posts`}</h3>
            <div className="foundUser-posts">
              {posts &&
                posts.filter((post) => post.uid === foundUser.uid).length < 1 &&
                "... No posts to show"}
              {posts &&
                posts.map(
                  (post) =>
                    post.uid === foundUser.uid && (
                      <Post id={post.id} key={post.id} title={post.title} />
                    )
                )}
            </div>
          </div>
        </div>
        <div>
          <h3>Liked Posts</h3>
          <div className="foundUser-posts">
            {posts &&
              posts.filter((post) => post.follows.includes(foundUser.id))
                .length < 1 &&
              "... No posts to show"}
            {posts &&
              posts.map(
                (post) =>
                  post.follows.includes(foundUser.id) && (
                    <Post id={post.id} key={post.id} title={post.title} />
                  )
              )}
          </div>
        </div>
      </div>
    </div>
  );
}
