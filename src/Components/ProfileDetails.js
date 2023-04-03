import {
  useLoaderData,
  useParams,
  NavLink,
  useNavigate,
} from "react-router-dom";
import { useEffect, useState } from "react";
import { getAuth } from "firebase/auth";
import parse from "html-react-parser";

import Clock from "./Utils/Clock.js";
import ContentHeader from "./ContentHeader.js";

export default function ProfileDetails() {
  const { id } = useParams();
  const data = useLoaderData();
  const profiles = data.profiles;
  const posts = data.posts;
  const auth = getAuth();
  const comments = data.comments;

  const navigate = useNavigate();

  const [profile, setProfile] = useState(null);

  useEffect(() => {
    profiles.map((profile) => {
      if (profile.id === id) {
        setProfile(profile);
      }
    });
  }, [id]);

  // allow to toggle list view
  function PostList(props) {
    let poster = profiles.filter((user) => props.post.uid === user.uid);

    return (
      <>
        {profile && (
          <div
            style={{
              display: "flex",
              flexDirection: "column",
              marginBottom: "1em",
            }}
            onClick={() => viewPost(props.post.id)}
          >
            <ContentHeader
              profile={poster[0]}
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
    let poster = profiles.filter((user) => props.post.uid === user.uid);
    let commentArr = [];
    comments.map((comment) => {
      if (comment.to === props.post.id) {
        commentArr.push(comment.id);
      }
    });
    return (
      <div className="post-page-post-container">
        <div
          style={{
            display: "flex",
            flexDirection: "column",
          }}
        >
          <ContentHeader profile={poster[0]} createdAt={props.post.createdAt} />
          <div className="post-title">{props.post.title}</div>
          <div className="post-text">
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
  function viewPost(e, bool) {
    navigate(`/posts/${e}`, { state: { viewComments: bool } });
  }
  const [usersSelected, setUsersSelected] = useState(true);
  const [listView, setListView] = useState(false);
  function toggleListView() {
    setListView((prev) => !prev);
  }
  return (
    <>
      {posts && (
        <div className="profile" style={{ paddingTop: "51px" }}>
          {profile !== null && (
            <div>
              <div
                style={{
                  backgroundColor: "rgba(62, 166, 255,.3)",
                  height: "200px",
                  backgroundSize: "cover",
                  backgroundPosition: "center center",
                  backgroundImage: `url(${profile.coverPic})`,
                }}
              ></div>

              <div style={{ marginTop: 0 }} className="page-style page-body">
                <div className="profile-header">
                  <div
                    className="profile-picture"
                    style={{
                      border: "7px solid white",
                      backgroundColor: "rgba(0, 0, 0, .5)",
                      borderRadius: "100%",
                      backgroundSize: "cover",
                      backgroundPosition: "center center",
                      backgroundImage: `url(${profile.defaultPic})`,
                    }}
                  ></div>
                  <h2 className="profile-username">{`${profile.username}`}</h2>
                </div>
                <div className="profile-jumbotron">
                  <div className="profile-info-section">
                    <p>"{profile.aboutMe}"</p>
                    <div
                      style={{
                        display: "flex",
                        gap: ".5em",
                        justifyContent: "right",
                      }}
                    >
                      <p>user since:</p>
                      <Clock createdAt={profile.createdAt} />
                    </div>
                  </div>
                </div>
                <div>
                  <div style={{ display: "flex", gap: "2em" }}>
                    {usersSelected ? (
                      <button
                        className="submit"
                        onClick={() => setUsersSelected(false)}
                      >
                        Following
                      </button>
                    ) : (
                      <button
                        className="submit"
                        onClick={() => setUsersSelected(true)}
                      >
                        User's
                      </button>
                    )}
                    <button className="submit" onClick={() => toggleListView()}>
                      {listView ? "Full" : "List"}
                    </button>
                  </div>
                  {usersSelected ? (
                    <div>
                      <h4>{`${profile.username}'s`}</h4>
                      <div className="foundUser-posts">
                        {posts.filter((post) => post.uid === profile.uid)
                          .length < 1 && "... No posts to show"}
                        {posts.map((post) =>
                          post.uid === profile.uid && listView ? (
                            <PostList post={post} key={post.id} />
                          ) : (
                            post.uid === profile.uid &&
                            !listView && (
                              <Post yourPost="true" post={post} key={post.id} />
                            )
                          )
                        )}
                      </div>
                    </div>
                  ) : (
                    <div>
                      <h4>Following</h4>
                      <div className="foundUser-posts">
                        {posts.filter((post) =>
                          post.follows.includes(profile.id)
                        ).length < 1 && "... No posts to show"}
                        {posts.map(
                          (post) =>
                            post.follows.includes(profile.id) &&
                            (listView ? (
                              <PostList post={post} key={post.id} />
                            ) : (
                              post.follows.includes(profile.id) &&
                              !listView && (
                                <Post
                                  yourPost="false"
                                  post={post}
                                  key={post.id}
                                />
                              )
                            ))
                        )}
                      </div>
                    </div>
                  )}
                </div>
              </div>
            </div>
          )}
        </div>
      )}
    </>
  );
}
