import { useEffect, useState } from "react";
import { useNavigate, useLoaderData, useLocation } from "react-router-dom";
import Clock from "./Utils/Clock.js";
import parse from "html-react-parser";
import ContentHeader from "./ContentHeader.js";

export default function Homepage() {
  const navigate = useNavigate();
  const data = useLoaderData();
  const profiles = data.profiles;
  const posts = data.posts;
  const comments = data.comments;
  const location = useLocation();
  const [loggedIn, setLoggedIn] = useState(false);

  const { state } = location;
  useEffect(() => {
    if (!loggedIn) {
      if (location.state && location.state.fromLogin === true) {
        setTimeout(() => {
          navigate(location.path);
          setLoggedIn(true);
        });
      }
    }
  }, []);

  useEffect(() => {
    window.scrollTo(0, 0);
  }, []);

  function viewPost(e, bool) {
    navigate(`/posts/${e}`, { state: { viewComments: bool } });
  }

  function PostList(props) {
    return (
      <>
        {props.profile && (
          <div
            style={{
              display: "flex",
              flexDirection: "column",
              margin: "1em 0",
              cursor: "pointer",
              borderRadius: "3px",
            }}
          >
            <ContentHeader
              profile={props.profile}
              createdAt={props.post.createdAt}
            />
            <div className="linkPost" onClick={() => viewPost(props.post.id)}>
              <p>{props.post.title}</p>
            </div>
          </div>
        )}
      </>
    );
  }

  function Post(props) {
    let commentArr = [];
    comments.map((comment) => {
      if (comment.to === props.post.id) {
        commentArr.push(comment.id);
      }
    });
    return (
      <div className="post-container">
        <div
          className="homepage-post"
          style={{
            display: "flex",
            flexDirection: "column",
          }}
        >
          <ContentHeader
            profile={props.profile}
            createdAt={props.post.createdAt}
          />
          <div
            onClick={() => viewPost(props.post.id)}
            style={{ cursor: "pointer" }}
            className="post-title"
          >
            {props.post.title}
          </div>

          <div
            onClick={() => viewPost(props.post.id)}
            style={{
              overflow: "none",
              cursor: "pointer",
            }}
            className="post-text"
          >
            {props.post && parse(props.post.text)}
          </div>
        </div>
        <button
          onClick={() => viewPost(props.post.id, true)}
          className="view-post-btn"
        >
          <span style={{ color: "black", textShadow: "0px 1px 2px black" }}>
            💬
          </span>{" "}
          {commentArr.length} comments
        </button>
      </div>
    );
  }

  const [listView, setListView] = useState(false);
  function toggleListView() {
    setListView((prev) => !prev);
  }

  return (
    <>
      {
        <div className="page-body homepage">
          <button
            style={{
              margin: "2em 0 2em 0",
            }}
            className="submit"
            onClick={toggleListView}
          >
            change view
          </button>
          <div>
            {posts &&
              posts.map((post, index) =>
                profiles.map(
                  (profile) =>
                    profile.uid === post.uid && (
                      <div
                        key={index}
                        style={{
                          margin: "0",
                          padding: "0",
                        }}
                      >
                        <div>
                          {listView ? (
                            <PostList
                              profile={profile}
                              post={post}
                              key={post.id}
                            />
                          ) : (
                            <>
                              <Post
                                profile={profile}
                                yourPost="false"
                                post={post}
                                key={post.id}
                              />
                            </>
                          )}
                        </div>
                      </div>
                    )
                )
              )}
          </div>
        </div>
      }
    </>
  );
}
