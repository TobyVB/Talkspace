import { useEffect, useLayoutEffect, useRef, useState } from "react";
import {
  useNavigate,
  useLoaderData,
  useParams,
  useLocation,
} from "react-router-dom";
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
import ContentHeader from "./ContentHeader.js";

export default function ViewPost(props) {
  const db = getFirestore();
  const auth = getAuth();
  const navigate = useNavigate();
  const myRef = useRef(null);
  const executeScroll = () =>
    myRef.current.scrollIntoView({ behavior: "smooth" });

  const location = useLocation();
  const { state } = location;
  if (state) {
    console.log(state.from);
  }
  useEffect(() => {
    if (location.state && location.state.viewComments === true) {
      setTimeout(() => {
        executeScroll();
      }, 1);
    }
  }, []);

  const { id } = useParams();
  const data = useLoaderData();
  const profiles = data.profiles;
  const comments = data.comments;
  const posts = data.posts;
  const [profile, setProfile] = useState(null);
  const [post, setPost] = useState(null);
  const user = data.user;
  const commentsRef = collection(db, "comments");

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
    const postRef = doc(db, "posts", post.id);
    // ######################## A D D ###########################
    if (!post.follows.includes(user.id)) {
      updateDoc(postRef, {
        follows: arrayUnion(user.id),
      }).then(() => {
        setPost((prev) => {
          return { ...prev, follows: [...prev.follows, user.id] };
        });
        console.log("added");
      });
      // #################### R E M O V E ########################
    } else {
      updateDoc(postRef, {
        follows: arrayRemove(user.id),
      }).then(() => {
        setPost((prev) => {
          return {
            ...prev,
            follows: [prev.follows.filter((e) => e !== user.id)],
          };
        });
        console.log("removed");
      });
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
            if (document.data().to === post.id) {
              deleteDoc(docRef);
            }
          });
        });
      });
    navigate(-1);
  }
  // ####################################
  // #####################################
  // ######################################
  return (
    <>
      {post && profile && comments && (
        <div className="page-body" style={{ paddingTop: "5em" }}>
          {auth.currentUser && (
            <div style={{ display: "flex", justifyContent: "space-between" }}>
              <button className="profile-options" onClick={followPost}>
                {post.follows.includes(user.id) ? "- UNFOLLOW" : "+ FOLLOW"}
              </button>
              {post.uid === user.uid && (
                <div>
                  <button className="profile-options" onClick={editPost}>
                    EDIT
                  </button>
                  <button className="profile-options" onClick={deletePost}>
                    DELETE
                  </button>
                </div>
              )}
            </div>
          )}
          <div className="post-page-post-container">
            <div
              style={{
                display: "flex",
                flexDirection: "column",
                borderRadius: "3px",
              }}
            >
              <ContentHeader profile={profile} createdAt={post.createdAt} />
              <div className="post-title">{post.title}</div>
              <div className="post-text">{post && parse(post.text)}</div>
              <div ref={myRef}></div>
            </div>
          </div>

          <hr style={{ margin: "1.5em 0", border: "none" }} />
          <Comments
            alertCommentId={state && state.from}
            data={data}
            post={post}
            user={user}
            postCreator={profile}
          />
        </div>
      )}
    </>
  );
}
