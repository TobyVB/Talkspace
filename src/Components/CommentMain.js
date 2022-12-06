import DeleteComment from "./DeleteComment.js";
import Clock from "./Utils/Clock.js";
import Impact from "./Utils/Impact.js";

export default function CommentsMain(props) {
  return (
    <>
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
        <DeleteComment comment={props.comment} type={props.type} />
      </div>
      <p className="comment-text">{props.comment.body}</p>
      <div className="comment-impact">
        <Impact
          approval={props.comment.approval}
          disapproval={props.comment.disapproval}
          id={props.comment.id}
        />
        {!props.showForm && !props.replyPressed && (
          <button onClick={props.startShowForm}>REPLY</button>
        )}
      </div>
    </>
  );
}
