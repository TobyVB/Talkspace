import React, { useState } from "react";

export default function ToggleReplies(props) {
  const replyChain =
    props.comments &&
    props.comments.filter((comment) => comment.replyTo === props.comment.id);

  // ACCESS REPLIES
  const [replyDisabled, setReplyDisabled] = useState(false);

  function showReplies() {
    // make user unable to click until animation finishes
    setReplyDisabled(true);
    // add class for animation
    props.setShowRepliesClass(true);
    // setTimeout for remove animation class
    setTimeout(() => {
      setReplyDisabled(false);
      props.setShowRepliesClass(false);
    }, 1000);
    sessionStorage.setItem(props.comment.unique, "true");
  }
  function hideReplies() {
    // make user unable to click until animation finishes
    setReplyDisabled(true);
    // add class for animation
    props.setHideRepliesClass(true);
    // setTimeout for remove animation class
    setTimeout(() => {
      setReplyDisabled(false);
      props.setHideRepliesClass(false);
      sessionStorage.setItem(props.comment.unique, "false");
    }, 1000);
  }

  return props.type === "comment" && props.version === "hide"
    ? sessionStorage.getItem(props.comment.unique) === "true" &&
        props.comments.filter((comment) => comment.replyTo === props.comment.id)
          .length > 0 && (
          <button
            disabled={replyDisabled && "+true"}
            className="show-replies"
            onClick={hideReplies}
          >
            hide replies
          </button>
        )
    : sessionStorage.getItem(props.comment.unique) !== "true" &&
        replyChain.length > 0 && (
          <button
            disabled={replyDisabled && "+true"}
            className="show-replies"
            onClick={showReplies}
          >
            {" "}
            - show replies -
          </button>
        );
}
