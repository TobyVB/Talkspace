import { useLoaderData, Link } from "react-router-dom";

export default function Profiles() {
  const data = useLoaderData();
  const profiles = data.profiles;
  return (
    <div
      style={{ background: "bluesteele", padding: "2em" }}
      className="profiles"
    >
      {profiles.map((profile) => (
        <Link
          style={{ textDecoration: "none", color: "white" }}
          to={profile.id.toString()}
          key={profile.id}
        >
          <p>{profile.username}</p>
        </Link>
      ))}
    </div>
  );
}
