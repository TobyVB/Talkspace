import {
  useLoaderData,
  useParams,
  NavLink,
  useNavigate,
} from "react-router-dom";
import { useEffect, useState } from "react";
import { getAuth } from "firebase/auth";

import Clock from "./Utils/Clock.js";

export default function ProfileDetails() {
  const { id } = useParams();
  const data = useLoaderData();
  const profiles = data.profiles;
  const posts = data.posts;
  const auth = getAuth();

  const navigate = useNavigate();

  const [profile, setProfile] = useState(null);

  useEffect(() => {
    profiles.map((obj) => {
      if (obj.id === id) {
        setProfile(obj);
      }
    });
  }, [id]);

  function Post(props) {
    return (
      <p className="post-link" onClick={() => viewPost(props.id)}>
        {props.title}
      </p>
    );
  }
  function viewPost(e) {
    navigate(`/posts/${e}`);
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
                  height: "400px",
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
                <div
                  style={{ marginTop: "100px" }}
                  className="profile-jumbotron"
                >
                  <div className="profile-info-section">
                    <div className="flex">
                      <p>user since: </p>
                      <Clock createdAt={profile.createdAt} />
                    </div>
                    <hr></hr>
                    <p>{profile.aboutMe}</p>
                  </div>
                </div>
                <div className="profile-post-sections">
                  <div>
                    <h3>{`${profile.username}'s posts`}</h3>
                    <div className="foundUser-posts">
                      {posts.filter((post) => post.uid === profile.uid).length <
                        1 && "... No posts to show"}
                      {posts.map(
                        (post) =>
                          post.uid === profile.uid && (
                            <Post
                              id={post.id}
                              key={post.id}
                              title={post.title}
                            />
                          )
                      )}
                    </div>
                  </div>
                  <div>
                    <h3>Liked Posts</h3>
                    <div className="foundUser-posts">
                      {posts.filter((post) => post.follows.includes(profile.id))
                        .length < 1 && "... No posts to show"}
                      {posts.map(
                        (post) =>
                          post.follows.includes(profile.id) && (
                            <Post
                              id={post.id}
                              key={post.id}
                              title={post.title}
                            />
                          )
                      )}
                    </div>
                  </div>
                </div>
              </div>
            </div>
          )}
        </div>
      )}
    </>
  );
}
