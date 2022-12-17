import React, { useState } from "react";
import CommentMain from "./CommentMain";
import CreateComment from "./CreateComment.js";
import ToggleReplies from "./ToggleReplies.js";
import { nanoid } from "nanoid";

export default function Comment(props) {
  const [formValue, setFormValue] = useState("");
  const [replyPressed, setReplyPressed] = useState(false);
  const [showForm, setShowForm] = useState(false);
  const [repliesBool, setRepliesBool] = useState("");
  const [open, setOpen] = useState(false);

  function startShowForm() {
    setShowForm(true);
    setTimeout(() => {
      if (showForm) {
        setFormValue(`@${props.comment.username} `);
      }
    }, 500);
    setReplyPressed((prevReplyPressed) => !prevReplyPressed);
  }
  function endShowForm(e) {
    setTimeout(() => {
      setShowForm(false);
    }, 300);
    setReplyPressed((prevReplyPressed) => !prevReplyPressed);
  }

  return (
    <div
      className={`comment ${
        props.comment.unique === props.capturedUnique && `flashing-animation`
      }`}
      onClick={props.resetUnique}
    >
      <CommentMain
        setCaptured={props.setCaptured}
        comment={props.comment}
        startShowForm={startShowForm}
        showForm={showForm}
        replyPressed={replyPressed}
        type={props.type}
      />
      {/* CREATE COMMENT */}
      {showForm && (
        <div className="reply-btns">
          <button className="cancel-reply" onClick={endShowForm}>
            CANCEL
          </button>
          <CreateComment
            type="reply"
            replyTo={props.comment.id}
            commentUID={props.comment.uid}
            chain={props.comment.chain}
            unique={props.comment.unique}
            capturedPostId={props.capturedPostId}
          />
        </div>
      )}
      {/* All COMMENTS || All REPLIES */}
      <div className="comment-chain">
        <ToggleReplies
          comments={props.comments}
          setRepliesBool={setRepliesBool}
          comment={props.comment}
          setOpen={setOpen}
        />
        <div
          className={
            repliesBool === true
              ? `gradual-open-animation`
              : repliesBool === false
              ? `gradual-close-animation`
              : repliesBool
          }
        >
          {/* COMMENT REPLIES */}
          {open &&
            props.comments &&
            props.comments.map(
              (comment) =>
                comment.unique === props.comment.unique &&
                comment.type === "reply" && (
                  <div className="reply" key={nanoid()}>
                    <Comment
                      comment={comment}
                      type={"reply"}
                      sendUID={props.sendUID}
                      key={nanoid()}
                      resetUnique={props.resetUnique}
                      unique={props.comment.unique}
                      capturedPostId={props.capturedPostId}
                      chain={props.comment.chain}
                    />
                  </div>
                )
            )}
        </div>
      </div>
    </div>
  );
}
