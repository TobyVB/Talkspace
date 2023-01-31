import { useEffect, useState } from "react";
import { useNavigate, useLoaderData, useParams } from "react-router-dom";
import parse from "html-react-parser";
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
import Comments from "./Comments.js";

export default function ViewPost(props) {
  const db = getFirestore();
  const auth = getAuth();
  const navigate = useNavigate();

  const { id } = useParams();
  const data = useLoaderData();
  const profiles = data.profiles;
  const comments = data.comments;
  const posts = data.posts;
  const [profile, setProfile] = useState(null);
  const [post, setPost] = useState(null);
  const user = data.user;
  const commentsRef = collection(db, "comments");
  const repliesRef = collection(db, "replies");

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

  function followPost() {
    // ######################## A D D ###########################
    if (!post.follows.includes(user.id)) {
      const postRef = doc(db, "posts", post.id);
      updateDoc(postRef, {
        follows: arrayUnion(user.id),
      }).then(() => {
        const userRef = doc(db, "users", user.id);
        updateDoc(userRef, {
          following: arrayUnion(post.id),
        });
      });
      setPost((prev) => {
        return { ...prev, follows: [...prev.follows, user.id] };
      });
      console.log("added");
      // #################### R E M O V E ########################
    } else {
      const postRef = doc(db, "posts", post.id);
      updateDoc(postRef, {
        follows: arrayRemove(user.id),
      }).then(() => {
        const userRef = doc(db, "users", user.id);
        updateDoc(userRef, {
          following: arrayRemove(post.id),
        });
      });
      setPost((prev) => {
        return {
          ...prev,
          follows: [prev.follows.filter((e) => e !== user.id)],
        };
      });
      console.log("removed");
    }
  }

  function editPost() {
    navigate(`./editPost`);
  }

  function deletePost() {
    const docRef = doc(db, "posts", post.id);
    deleteDoc(docRef)
      .then(() => {
        console.log("notification deleted");
      })
      .then(() => {
        const q = query(commentsRef, orderBy("createdAt"));
        onSnapshot(q, async (snapshot) => {
          snapshot.docs.forEach((document) => {
            const docRef = doc(db, "comments", document.id);
            if (document.data().comToPost === post.id) {
              deleteDoc(docRef);
            }
          });
        });
      })
      .then(() => {
        const q = query(repliesRef, orderBy("createdAt"));
        onSnapshot(q, async (snapshot) => {
          snapshot.docs.forEach((document) => {
            const docRef = doc(db, "replies", document.id);
            if (document.data().repToCom === post.id) {
              deleteDoc(docRef);
            }
          });
        });
      });
    navigate(-1);
  }

  return (
    <>
      {post && profile && auth.currentUser && comments && (
        <div className="page-body">
          <button onClick={editPost}>edit post</button>
          <button onClick={deletePost}>delete post</button>
          <div className="view-post-container">
            <div className="post-header">
              <p
                className="post-author"
                onClick={() => navigate(`/profile/${profile.id}`)}
              >
                Authored by: {profile.username}
              </p>
              <img
                alt={profile.username}
                src={profile.defaultPic}
                className="mini-defaultPic"
                onClick={() => navigate(`/profile/${profile.id}`)}
              />
            </div>
            <h4 className="post-title">{post.title}</h4>
            <div className="post-body">
              <div>{post && parse(post.text)}</div>
            </div>
            <button className="follow-post" onClick={() => followPost()}>
              {post.follows.includes(user.id) ? "- UNFOLLOW" : "+ FOLLOW"}
            </button>
          </div>
          <Comments data={data} post={post} user={user} />
        </div>
      )}
    </>
  );
}

// const scrollTarget = useRef();
// const scrollingTop = (event) => {
//   const elmnt = scrollTarget;
//   elmnt.current.scrollIntoView({
//     behavior: "smooth",
//     block: "center",
//     inline: "start",
//   });
// };
// setTimeout(() => {
//   if (localStorage.getItem("unique") !== "") {
//     scrollingTop();
//   }
// }, 200);
