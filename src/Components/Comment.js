import { useState } from "react";
import DeleteComment from "./DeleteComment.js";
import ContentHeader from "./ContentHeader.js";

export default function Comment(props) {
  const [togglerHidden, setTogglerHidden] = useState(true);
  const [options, setOptions] = useState(false);

  function showOptions() {
    setOptions(true);
  }

  const forContentHeader = {
    username: props.comment.username,
    defaultPic: props.comment.defaultPic,
    id: props.comment.by,
  };

  return (
    <div
      className="container-comment"
      onMouseEnter={() => setTogglerHidden(false)}
      onMouseLeave={() => setTogglerHidden(true, setOptions(false))}
    >
      {options && (
        <div
          style={{
            top: "0",
            left: "0",
            display: "block",
            position: "fixed",
            background: "rgba(0,0,0,0)",
            width: "100vw",
            height: "100vh",
          }}
          onClick={() => setOptions(false)}
        ></div>
      )}
      <div style={{ display: "flex", flexDirection: "column", width: "100%" }}>
        <ContentHeader
          profile={forContentHeader}
          createdAt={props.comment.createdAt}
        />
        <div
          style={
            props.alertCommentId !== props.comment.id
              ? { textDecoration: "underscore" }
              : { background: "red" }
          }
          className="comment-text"
        >
          <div>{props.comment.body}</div>
        </div>
      </div>

      <div style={{ margin: "auto", width: "0", display: "flex" }}>
        {options && props.user.uid === props.comment.uid && (
          <div
            style={{
              transitionDelay: ".2s",
              background: "rgba(20, 20, 20, 1",
              border: "1px solid white",
              margin: "auto",
              transform: "translateX(-80px)",
              padding: ".5em",
              borderRadius: "5px",
              zIndex: "10",
            }}
          >
            <div onClick={() => setOptions(false)} style={{ margin: "auto" }}>
              <DeleteComment
                createdAt={props.comment.createdAt}
                comment={props.comment}
              />
            </div>
          </div>
        )}
        <span
          style={
            togglerHidden
              ? { color: "rgba(0,0,0,0)" }
              : { color: "rgba(255,255,255,.8)" }
          }
          className="comment-options-toggler"
          onClick={showOptions}
        >
          &#8942;
        </span>
      </div>
    </div>
  );
}
