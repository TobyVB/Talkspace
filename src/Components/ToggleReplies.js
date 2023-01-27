import React, { useState } from "react";

export default function ToggleReplies(props) {
  const [replyDisabled, setReplyDisabled] = useState(false);
  const [open, setOpen] = useState(false);
  function toggleReplies(bool) {
    setReplyDisabled(true);
    props.setRepliesBool(bool);
    setOpen(bool);
    if (!open) {
      props.setOpen(bool);
    }
    setTimeout(() => {
      setReplyDisabled(false);
      if (open) {
        props.setOpen(bool);
      }
    }, 1000);
  }

  return (
    <>
      {props.comments &&
      props.comments.filter((comment) => comment.replyTo === props.comment.id)
        .length > 0 &&
      !open ? (
        <button
          onClick={() => toggleReplies(true)}
          disabled={replyDisabled && "+true"}
        >
          show replies
        </button>
      ) : (
        open && (
          <button
            onClick={() => toggleReplies(false)}
            disabled={replyDisabled && "+true"}
          >
            hide replies
          </button>
        )
      )}
    </>
  );
}
