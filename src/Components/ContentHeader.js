import { useNavigate } from "react-router-dom";
import Clock from "./Utils/Clock.js";

export default function ContentHeader(props) {
  const navigate = useNavigate();

  return (
    <>
      {props.profile && (
        <div
          className="content-header"
          style={{
            float: "right",
            background: "rgba(0,0,0,.65)",
            padding: "0 .5em",
            display: "flex",
            justifyContent: "space-between",
            verticalAlign: "center",
            borderTopLeftRadius: "3px",
            borderTopRightRadius: "3px",
          }}
        >
          <div
            className="user-link-header"
            style={{ display: "flex", cursor: "pointer" }}
            onClick={() => navigate(`/profile/${props.profile.id}`)}
          >
            <img
              alt={props.profile.username}
              className="mini-defaultPic"
              src={props.profile.defaultPic}
              style={{ marginRight: ".5em" }}
            />
            <p className="content-header-username">{props.profile.username}</p>
          </div>

          <Clock createdAt={props.createdAt} />
        </div>
      )}
    </>
  );
}
