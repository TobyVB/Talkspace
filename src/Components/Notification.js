import { getFirestore, doc, deleteDoc } from "firebase/firestore";
import { useEffect, useState } from "react";
import { useNavigate, useLocation } from "react-router-dom";
import Clock from "./Utils/Clock";

export default function Notification(props) {
  const db = getFirestore();
  const navigate = useNavigate();
  const location = useLocation();
  const [noteVisible, setNoteVisible] = useState(false);
  const data = props.data;
  const [post, setPost] = useState();
  useEffect(() => {
    if (data) {
      data.posts.map((post) => {
        if (post.id === props.notification.post) {
          setPost(post);
        }
      });
    }
  }, [data]);

  function checkNotification() {
    // Delete the notification
    const docRef = doc(db, "commentAlerts", props.notification.id);
    deleteDoc(docRef)
      .then(() => {
        console.log("notification deleted");
        document.body.style.overflow = "auto";
      })
      .then(() => {
        navigate(location.pathname);
      });
  }

  function readNote() {
    props.setHideNoteMenu(true);
    setNoteVisible(true);
    props.toggleNotificationWindow();
  }

  function doThis() {
    setNoteVisible(false);
    props.setHideNoteMenu(false);
  }
  function Note() {
    return (
      <div style={{ visibility: "visible" }} className="notification">
        <div>
          <div
            style={{ fontWeight: "300", margin: "2em auto", maxWidth: "300px" }}
          >
            <span
              style={{ cursor: "pointer" }}
              onClick={() => navigate(`/profile/${props.notification.fromId}`)}
            >
              {props.notification.fromUsername}
            </span>
            {` commented on your post, `}
            <span
              style={{ fontWeight: "bold", cursor: "pointer" }}
              onClick={() => navigate(`/posts/${props.notification.post}`)}
            >{`'${post.title}.'`}</span>
          </div>
        </div>

        <div
          style={{
            maxHeight: "200px",
            maxWidth: "300px",
            overflow: "scroll",
            margin: "auto",
          }}
        >
          <div
            style={{
              marginTop: "2em",
              border: "1px solid rgba(0,0,0,.5",
              padding: "1em",
              borderRadius: "3px",
            }}
          >{`${props.notification.body}`}</div>
        </div>

        <div style={{ display: "flex", gap: "3em", marginTop: "5em" }}>
          <button
            className="submit"
            style={{ zIndex: "20" }}
            onClick={checkNotification}
          >
            REMOVE
          </button>
          <button
            className="submit"
            onClick={() => doThis()}
            style={{
              background: "rgba(255,70,70,.9)",
              float: "right",
              color: "white",
              borderRadius: "3px",
            }}
          >
            HOLD
          </button>
        </div>
      </div>
    );
  }

  return (
    <div
      style={{
        display: "flex",
        flexDirection: "column",
        border: "1px solid rgba(0,0,0,.5)",
      }}
    >
      <div style={{ marginLeft: "-5em", marginBottom: "-2.25em" }}>
        <Clock createdAt={props.notification.createdAt} />
      </div>
      <div style={{ display: "flex" }}>
        <p>{`${props.notification.fromUsername} commented on your post.`}</p>
        <button onClick={readNote} className="notifyGo">
          read
        </button>
        {noteVisible && <Note />}
      </div>
    </div>
  );
}

// <div className="flex">
//   <p>{`${props.notification.fromUsername} commented on your post.`}</p>
//   <NavLink
//     to={`posts/${props.notification.post}`}
//     state={{ from: props.notification.commentId }}
//   >
//     <button onClick={checkNotification} className="notifyGo">
//       go
//     </button>
//   </NavLink>
// </div>;
