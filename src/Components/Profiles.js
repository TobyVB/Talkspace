import { useLoaderData, Link } from "react-router-dom";

export default function Profiles() {
  const data = useLoaderData();
  const profiles = data.profiles;
  return (
    <div
      style={{ background: "bluesteele", padding: "10em 2em 2em 2em" }}
      className="profiles"
    >
      {profiles.map((profile) => (
        <Link
          style={{ textDecoration: "none", color: "white" }}
          to={profile.id.toString()}
          key={profile.id}
        >
          <div>
            <img
              style={{ height: "50px", width: "50px", objectFit: "cover" }}
              src={profile.defaultPic}
            />

            <p>{profile.username}</p>
          </div>
        </Link>
      ))}
    </div>
  );
}
