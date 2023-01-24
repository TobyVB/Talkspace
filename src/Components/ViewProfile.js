import Clock from "./Utils/Clock.js";
import React, { useEffect, useState } from "react";
import { useCollectionData } from "react-firebase-hooks/firestore";
import {
  getFirestore,
  query,
  orderBy,
  onSnapshot,
  collection,
} from "firebase/firestore";
import { getAuth } from "firebase/auth";
import { useNavigate, NavLink, useLocation } from "react-router-dom";

export default function ViewProfile(props) {
  const db = getFirestore();
  const auth = getAuth();
  const usersRef = collection(db, "users");
  const [foundUser, setFoundUser] = useState("");
  const [currentUser, setCurrentUser] = useState("");
  const [userData, setUserData] = useState("");
  const [image, setImage] = useState(false);
  const navigate = useNavigate();
  const [userProfile, setUserProfile] = useState(false);
  const location = useLocation();

  useEffect(() => {
    window.scrollTo(0, 0);
  }, []);

  // ########## A C C E S S   C U R R E N T   U S E R'S   D O C ##########
  useEffect(() => {
    const q = query(usersRef, orderBy("createdAt"));
    onSnapshot(q, async (snapshot) => {
      snapshot.docs.forEach((doc) => {
        if (doc.data().uid === auth.currentUser.uid) {
          setCurrentUser({ ...doc.data(), id: doc.id });
        }
      });
    });
    setImage(true);
  }, []);

  // ########## A C C E S S   F O U N D   U S E R'S   D O C ##########
  useEffect(() => {
    const q = query(usersRef, orderBy("createdAt"));
    onSnapshot(q, async (snapshot) => {
      snapshot.docs.forEach((doc) => {
        if (doc.data().uid === localStorage.getItem("uid")) {
          setFoundUser({ ...doc.data(), id: doc.id });
        }
      });
    });
  }, []);

  // ########## D E T E R M I N E   I F   O N   U S E R ' S   P R O F I L E ##########
  useEffect(() => {
    if (foundUser !== "" && currentUser !== "") {
      setUserData(foundUser);
    }
  }, [foundUser, currentUser]);

  useEffect(() => {
    if (foundUser.id === currentUser.id) {
      setUserProfile(true);
      console.log(foundUser.id);
      console.log(currentUser.id);
    } else {
      setUserProfile(false);
    }
  }, [userData]);

  // ########## F I N D   U S E R'S   P O S T  D O C S ##########
  const postsRef = collection(db, "posts");
  const qPosts = query(postsRef, orderBy("createdAt"));
  const [posts] = useCollectionData(qPosts, {
    createdAt: "createdAt",
    idField: "id",
    title: "title",
    uid: `uid`,
  });

  function viewPost(e) {
    navigate("/post");
    localStorage.setItem("postId", e);
  }

  function Post(props) {
    return (
      <p className="post-link" onClick={() => viewPost(props.id)}>
        {props.title}
      </p>
    );
  }

  return (
    <div style={{ paddingTop: "51px" }}>
      <div
        style={{
          backgroundColor: "rgba(62, 166, 255,.3)",
          height: "100px",
          display: "flex",
          flexDirection: "column",
          border: "1px solid orange",
        }}
      >
        {auth.currentUser &&
          location.pathname === "/profile" &&
          localStorage.getItem("uid") === auth.currentUser.uid && (
            <NavLink
              style={{
                border: "1px solid red",
                display: "inline-block",
                zIndex: "10",
                background: "pink",
              }}
              className="link"
              to="/editProfile"
            >
              <button
                style={{ marginTop: "61px" }}
                className="edit-profile-btn"
              >
                Edit
              </button>
            </NavLink>
          )}
      </div>
      <div style={{ marginTop: 0 }} className="page-style page-body">
        <div className="profile-jumbotron">
          <div className="profile-info-section">
            <h2 className="profile-header-text">{`${userData.username}`}</h2>
            <div className="flex">
              <p>user since: </p>
              <Clock createdAt={userData.createdAt} />
            </div>
            <hr></hr>
            <p>{`${userData.aboutMe !== undefined ? userData.aboutMe : ""}`}</p>
          </div>
          <div
            className="profile-picture"
            style={{
              backgroundImage: image ? `url(${userData.defaultPic})` : "",
            }}
          ></div>
        </div>

        <div className="profile-post-sections">
          <div>
            <h3>{`${userData.username}'s posts`}</h3>
            <div className="foundUser-posts">
              {posts &&
                posts.filter((post) => post.uid === userData.uid).length < 1 &&
                "... No posts to show"}
              {posts &&
                posts.map(
                  (post) =>
                    post.uid === userData.uid && (
                      <Post id={post.id} key={post.id} title={post.title} />
                    )
                )}
            </div>
          </div>
          <div>
            <h3>Liked Posts</h3>
            <div className="foundUser-posts">
              {posts &&
                posts.filter((post) => post.follows.includes(userData.id))
                  .length < 1 &&
                "... No posts to show"}
              {posts &&
                posts.map(
                  (post) =>
                    post.follows.includes(userData.id) && (
                      <Post id={post.id} key={post.id} title={post.title} />
                    )
                )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
