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
        onClick={() => viewPost(props.post.id)}
        style={{
          display: "flex",
          flexDirection: "column",
          margin: "3em 0 1em 0",
          border: "1px solid black",
          borderRadius: "3px",
          cursor: "pointer",
        }}
      >
        <ContentHeader profile={profile} createdAt={props.post.createdAt} />
        <div className="post-title">{props.post.title}</div>
        <div className="post-text">{props.post && parse(props.post.text)}</div>
      </div>
    );
  }
  function viewPost(e) {
    navigate(`/posts/${e}`);
  }
  const [usersSelected, setUsersSelected] = useState(true);
  const [listView, setListView] = useState(false);
  function toggleListView() {
    setListView((prev) => !prev);
  }
  return (
    <>
      {auth.currentUser && posts && (
        <div style={{ paddingTop: "51px" }}>
          {profile !== null && (
            <div>
              <div
                style={{
                  backgroundColor: "rgba(62, 166, 255,.3)",
                  height: "200px",
                  display: "flex",
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
                      border: "7px solid rgb(57, 76, 95)",
                      backgroundColor: "rgb(57, 76, 95)",
                      borderRadius: "100%",
                      backgroundSize: "cover",
                      backgroundPosition: "center center",
                      backgroundImage: `url(${profile.defaultPic})`,
                    }}
                  ></div>
                  <h2 className="profile-username">{`${profile.username}`}</h2>
                  {profile.uid === auth.currentUser.uid && (
                    <div className="profile-header-btns">
                      <span>
                        <NavLink to="/createPost">
                          <button className="edit-profile-btn">Post</button>
                        </NavLink>
                      </span>
                      <span>
                        <NavLink to="/editProfile">
                          <button className="edit-profile-btn">Edit</button>
                        </NavLink>
                      </span>
                    </div>
                  )}
                </div>
                <div className="profile-jumbotron">
                  <div className="profile-info-section">
                    <p style={{ fontSize: ".8rem" }}>{profile.aboutMe}</p>
                    <hr></hr>
                    <div
                      style={{
                        display: "flex",
                        gap: "1em",
                      }}
                    >
                      <p
                        style={{
                          fontSize: ".7rem",
                        }}
                      >
                        user since:
                      </p>
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
                            <Post yourPost="true" post={post} key={post.id} />
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
                              <Post
                                yourPost="false"
                                post={post}
                                key={post.id}
                              />
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
