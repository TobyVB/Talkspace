import CreateComment from "./CreateComment.js";
export default function Comment(props) {
  return (
    <div>
      <div
        style={
          props.type === "reply"
            ? { background: "rgba(0,0,0,.2)" }
            : { background: "rgba(0,0,0,.5" }
        }
      >
        <div>{props.comment.body}</div>
      </div>
      <CreateComment
        /* Include props.post so the notify knows where to send user */
        delete={props.delete}
        type="reply"
        to={props.comment.id}
        post={props.post}
        user={props.user}
        comment={props.comment}
        masterComment={props.masterComment}
      />
      <hr />
      <hr />
      {props.data.comments.map((comment, index) => {
        if (props.comment.id === comment.to) {
          return (
            <Comment
              delete={"no"}
              type={"reply"}
              data={props.data}
              comment={comment}
              user={props.user}
              key={index}
              masterComment={props.masterComment}
            />
          );
        }
      })}
    </div>
  );
}
