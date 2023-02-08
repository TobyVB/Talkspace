import { useEffect, useState } from "react";
import { useNavigate, useLoaderData } from "react-router-dom";
import Clock from "./Utils/Clock.js";
import parse from "html-react-parser";
import ContentHeader from "./ContentHeader.js";

export default function Homepage() {
  const navigate = useNavigate();
  const data = useLoaderData();
  const profiles = data.profiles;
  const posts = data.posts;

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
            }}
            onClick={() => viewPost(props.post.id)}
          >
            <div>
              <Clock createdAt={props.post.createdAt} />
            </div>
            <div className="linkPost" onClick={() => viewPost(props.post.id)}>
              <p>{props.post.title}</p>
            </div>
          </div>
        )}
      </>
    );
  }

  function Post(props) {
    return (
      <div
        className="homepage-post fade"
        style={{
          display: "flex",
          flexDirection: "column",
          borderRadius: "3px",
          border: "1px solid black",
          margin: "2em 0 0 0",
          cursor: "pointer",
        }}
        onClick={() => viewPost(props.post.id)}
      >
        <ContentHeader
          profile={props.profile}
          createdAt={props.post.createdAt}
        />
        <div className="post-title">{props.post.title}</div>

        <div
          style={{
            borderBottomLeftRadius: "5px",
            borderBottomRightRadius: "5px",
            overflow: "none",
          }}
          className="post-text"
        >
          <div className="post-text">
            {props.post && parse(props.post.text)}
          </div>
        </div>
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
        <div className="page-body">
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
                              <button
                                onClick={() => viewPost(post.id, true)}
                                className="view-post-btn"
                              >
                                comments
                              </button>
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
