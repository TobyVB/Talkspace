import CreateComment from "./CreateComment.js";
import Comment from "./Comment.js";
export default function Comments(props) {
  return (
    <div>
      <CreateComment
        /* Include props.post so the notify knows where to send user */
        type="comment"
        to={props.post.id}
        post={props.post}
        user={props.user}
      />
      <hr />
      <hr />
      <hr />
      <hr />
      <hr />
      {props.data.comments.map((comment) => {
        if (props.post.id === comment.to) {
          return (
            <Comment
              color={"comment"}
              data={props.data}
              comment={comment}
              user={props.user}
              key={comment.id}
            />
          );
        }
      })}
    </div>
  );
}
