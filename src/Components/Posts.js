import { useLoaderData, Link } from "react-router-dom";

export default function Posts() {
  const data = useLoaderData();
  const posts = data.posts;
  return (
    <div style={{ background: "dodgerblue", padding: "2em" }} className="posts">
      {posts.map((post) => (
        <div>
          <Link
            style={{ textDecoration: "none", color: "white" }}
            to={post.id.toString()}
            key={post.id}
          >
            <h3>{post.title}</h3>
            <p dangerouslySetInnerHTML={{ __html: post.text }}></p>
          </Link>
          <hr />
        </div>
      ))}
    </div>
  );
}
