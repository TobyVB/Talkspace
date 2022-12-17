import React, { useEffect, useState, useRef } from "react";
import parse from "html-react-parser";
import { useCollectionData } from "react-firebase-hooks/firestore";
import { nanoid } from "nanoid";
import {
  query,
  orderBy,
  onSnapshot,
  collection,
  getFirestore,
  doc,
  updateDoc,
  arrayUnion,
  arrayRemove,
  deleteDoc,
} from "firebase/firestore";
import { getAuth } from "firebase/auth";
import CreateComment from "./CreateComment.js";
import Comment from "./Comment.js";

import { useNavigate } from "react-router-dom";

export default function ViewPost(props) {
  const db = getFirestore();
  const auth = getAuth();
  const navigate = useNavigate();

  const commentsRef = collection(db, "comments");
  const q = query(commentsRef, orderBy("createdAt"));
  const [comments] = useCollectionData(q, {
    createdAt: "createAt",
    id: "id",
    approval: "approval",
    disapproval: "disapproval",
    username: "username",
    body: "body",
    chain: "chain",
  });

  const [pagePause, setPagePause] = useState(true);
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
        if (doc.data().id === props.captured.postId) {
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

  const scrollTarget = useRef();
  const scrollingTop = (event) => {
    const elmnt = scrollTarget;
    elmnt.current.scrollIntoView({
      behavior: "smooth",
      block: "center",
      inline: "start",
    });
  };
  setTimeout(() => {
    if (props.captured.unique !== "") {
      scrollingTop();
    }
  }, 200);

  function resetUnique() {
    props.setCaptured((prev) => {
      return { ...prev, unique: "", currentCommentId: "" };
    });
  }
  function doNothing() {}

  // #####################################   F O L L O W   A N D   U N F O L L O W   P O S T   #############################################
  function followPost() {
    if (!foundPost.follows.includes(props.captured.userData.id)) {
      const postRef = doc(db, "posts", foundPost.id);
      updateDoc(postRef, {
        follows: arrayUnion(props.captured.userData.id),
      }).then(() => {
        const userRef = doc(db, "users", props.captured.userData.id);
        updateDoc(userRef, {
          following: arrayUnion(foundPost.id),
        });
      });
    } else {
      const postRef = doc(db, "posts", foundPost.id);
      updateDoc(postRef, {
        follows: arrayRemove(props.captured.userData.id),
      }).then(() => {
        const userRef = doc(db, "users", props.captured.userData.id);
        updateDoc(userRef, {
          following: arrayRemove(foundPost.id),
        });
      });
    }
  }
  function editPost() {
    navigate("/editPost");
  }
  function deletePost() {
    const docRef = doc(db, "posts", props.captured.postId);
    deleteDoc(docRef)
      .then(() => {
        console.log("notification deleted");
      })
      .then(() => {
        const q = query(commentsRef, orderBy("createdAt"));
        onSnapshot(q, async (snapshot) => {
          snapshot.docs.forEach((document) => {
            const docRef = doc(db, "comments", document.id);
            if (document.data().postId === props.captured.postId) {
              deleteDoc(docRef);
            }
          });
        });
      });
    navigate("/profile");
  }

  return (
    <div className="page-body">
      {auth.currentUser.uid === foundPost.uid && (
        <button disabled={pagePause && "+true"} onClick={editPost}>
          edit post
        </button>
      )}
      {auth.currentUser.uid === foundPost.uid && (
        <button disabled={pagePause && "+true"} onClick={deletePost}>
          delete post
        </button>
      )}
      <div className="view-post-container">
        <div className="post-header">
          <p
            className="post-author"
            onClick={() => props.captured.uid(foundUser.uid)}
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
          <div>{foundPost && parse(foundPost.text)}</div>
        </div>
        <button className="follow-post" onClick={followPost}>
          {foundPost && foundPost.follows.includes(props.captured.userData.id)
            ? "- UNFOLLOW"
            : "+ FOLLOW"}
        </button>
      </div>
      <CreateComment
        replyTo={props.captured.postId}
        id={foundUser.id}
        uid={foundUser.uid}
        type="comment"
        capturedPostId={props.captured.postId}
      />
      <div className="">
        {comments &&
          comments.map(
            (comment) =>
              comment.replyTo === props.captured.postId && (
                <div key={nanoid()}>
                  <Comment
                    comment={comment}
                    type={"comment"}
                    sendUID={props.captured.uid}
                    key={nanoid()}
                    comments={comments}
                    capturedUnique={props.captured.unique}
                    resetUnique={
                      comment.unique === props.captured.unique
                        ? resetUnique
                        : doNothing
                    }
                    capturedPostId={props.captured.postId}
                    currentCommentId={props.captured.currentCommentId}
                  />
                  {props.captured.unique === comment.unique && (
                    <div ref={scrollTarget}></div>
                  )}
                </div>
              )
          )}
      </div>
    </div>
  );
}
