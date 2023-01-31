import React, { useEffect } from "react";
import { useNavigate, useLoaderData } from "react-router-dom";

export default function Homepage() {
  const navigate = useNavigate();
  const data = useLoaderData();
  const profiles = data.profiles;
  const posts = data.posts;

  useEffect(() => {
    window.scrollTo(0, 0);
  }, []);

  return (
    <>
      {
        <div className="page-body">
          <div className="homepage-header-text">
            <h1 className="welcome-homepage">Welcome to</h1>
            <div className="the-talkspace-homepage">
              <span className="the-homepage">The</span>
              <h1 className="talkspace-homepage">Talkspace</h1>
            </div>
          </div>
          <div className="homepage-posts">
            {posts &&
              posts.map((post, index) =>
                profiles.map(
                  (profile) =>
                    profile.uid === post.uid && (
                      <div key={index} className="homepage-post">
                        <div
                          onClick={() => navigate(`profile/${profile.id}`)}
                          className="profile-link"
                        >
                          Posted by{" "}
                          {profiles &&
                            profiles.map(
                              (profile) =>
                                profile.uid === post.uid && profile.username
                            )}
                        </div>
                        <p
                          onClick={() => navigate(`posts/${post.id}`)}
                          className="post-link"
                        >
                          {post.title}
                        </p>
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
