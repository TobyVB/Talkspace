import DeleteComment from "./DeleteComment.js";

export default function Comment(props) {
  return (
    <div style={{ display: "flex" }}>
      <div
        style={{
          width: "100%",
          background: "rgba(0,0,0,.5",
          padding: "1rem",
          borderRadius: "5px",
          margin: "1rem 0",
        }}
      >
        <div>{props.comment.body}</div>
      </div>
      {props.user.uid === props.comment.uid && (
        <div>
          <DeleteComment comment={props.comment} />
        </div>
      )}
    </div>
  );
}
