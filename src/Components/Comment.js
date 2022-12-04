import {
  doc,
  getFirestore,
  collection,
  query,
  orderBy,
  onSnapshot,
  deleteDoc,
} from "firebase/firestore";
import React, { useState } from "react";
import Clock from "./Utils/Clock.js";
import Impact from "./Utils/Impact.js";
import CreateComment from "./CreateComment.js";
import ToggleReplies from "./ToggleReplies.js";

import { nanoid } from "nanoid";

export default function Comment(props) {
  const db = getFirestore();
  const commentsRef = collection(db, "comments");
  const [formValue, setFormValue] = useState("");

  function deleteComment() {
    const docRef = doc(db, "comments", props.comment.id);
    deleteDoc(docRef)
      .then(() => {
        console.log("notification deleted");
      })
      .then(() => {
        console.log("what's up?");
        const q = query(commentsRef, orderBy("createdAt"));
        onSnapshot(q, async (snapshot) => {
          snapshot.docs.forEach((document) => {
            const docRef = doc(db, "comments", document.id);
            if (
              document.data().chain === props.comment.chain &&
              props.type == "comment"
            ) {
              deleteDoc(docRef);
            }
          });
        });
      });
  }
  const [showRepliesClass, setShowRepliesClass] = useState(false);
  const [hideRepliesClass, setHideRepliesClass] = useState(false);
  const [replyPressed, setReplyPressed] = useState(false);
  const [showForm, setShowForm] = useState(false);
  const [startCreateReply, setStartCreateReply] = useState(false);
  const [endCreateReply, setEndCreateReply] = useState(false);
  function startShowForm() {
    setStartCreateReply(true);
    setShowForm(true);
    setTimeout(() => {
      if (showForm) {
        setTextareaCols(0);
        setFormValue("");
      } else {
        setFormValue(`@${props.comment.username} `);
      }
      setStartCreateReply(false);
    }, 500);
    setReplyPressed((prevReplyPressed) => !prevReplyPressed);
  }
  function endShowForm(e) {
    setEndCreateReply(true);
    setTimeout(() => {
      setEndCreateReply(false);
      setShowForm(false);
    }, 300);
    setReplyPressed((prevReplyPressed) => !prevReplyPressed);
  }

  const [textareaCols, setTextareaCols] = useState(1);
  function handleKeyPress(e) {
    if (e.key === "Enter") {
      setTextareaCols((prevTextareaCols) => (prevTextareaCols += 1));
    }
    if (e.key === "Backspace") {
      setTextareaCols((prevTextareaCols) => (prevTextareaCols -= 1));
    }
  }

  return (
    <div
      className={`comment ${
        props.comment.unique === props.capturedUnique && `flashing-animation`
      }${
        props.type === "reply" ? " comment-type-reply" : " comment-type-comment"
      }`}
      onClick={props.resetUnique}
    >
      <div className="comment-container-main">
        <div>
          <div className={`comment-full-header`}>
            <div className="comment-auth">
              <img
                className="mini-defaultPic"
                alt="user"
                src={props.comment.defaultPic}
                onClick={() => props.sendUID(props.comment.uid)}
              />
              <p className="comment-name">{props.comment.username}</p>
            </div>
            <Clock createdAt={props.comment.createdAt} type={props.type} />
            <button className="delete-comment" onClick={deleteComment}>
              delete
            </button>
          </div>
          <div className={`container-full-comment`}>
            <div className={`comment-chat-text`}>
              <p className="comment-text">{props.comment.body}</p>
            </div>
            <div className="comment-impact">
              <Impact
                approval={props.comment.approval}
                disapproval={props.comment.disapproval}
                id={props.comment.id}
              />
              {!showForm && !replyPressed && (
                <button onClick={startShowForm}>REPLY</button>
              )}
            </div>
            {showForm && (
              <div
                className={`create-reply-form ${
                  startCreateReply
                    ? "gradual-open-animation"
                    : endCreateReply && "gradual-close-animation"
                }`}
              >
                <textarea
                  className="reply-input"
                  ref={(ref) => ref && ref.focus()}
                  onFocus={(e) =>
                    e.currentTarget.setSelectionRange(
                      e.currentTarget.value.length,
                      e.currentTarget.value.length
                    )
                  }
                  autoFocus
                  onKeyDown={handleKeyPress}
                  cols={40}
                  rows={textareaCols}
                  value={formValue}
                  onChange={(event) => setFormValue(event.target.value)}
                  placeholder="Add a reply..."
                />
                <div className="reply-btns">
                  {showForm && (
                    <button className="cancel-reply" onClick={endShowForm}>
                      CANCEL
                    </button>
                  )}
                  <CreateComment
                    type="reply"
                    replyTo={props.comment.id}
                    commentUID={props.comment.uid}
                    chain={props.comment.chain}
                    unique={props.comment.unique}
                    capturedPostId={props.capturedPostId}
                  />
                </div>
              </div>
            )}
            {/* COMMENT CHAIN */}
            <div className="comment-chain">
              <ToggleReplies
                setShowRepliesClass={setShowRepliesClass}
                setHideRepliesClass={setHideRepliesClass}
                comments={props.comments}
                comment={props.comment}
                type={props.type}
                version="hide"
              />
              <div
                className={
                  showRepliesClass === true
                    ? `gradual-open-animation`
                    : hideRepliesClass
                    ? `gradual-close-animation`
                    : ``
                }
              >
                {/* REPLY CHAIN */}
                {sessionStorage.getItem(props.comment.unique) === "true" &&
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
              <ToggleReplies
                setShowRepliesClass={setShowRepliesClass}
                setHideRepliesClass={setHideRepliesClass}
                comments={props.comments}
                comment={props.comment}
                type={props.type}
                version="show"
              />
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
