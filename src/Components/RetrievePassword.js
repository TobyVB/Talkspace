import { NavLink } from "react-router-dom";

export default function RetrievePassword(props) {
  return (
    <div className="page-body settings">
      <h1>Retrieve Password</h1>
      <NavLink to="/settings">cancel</NavLink>;
    </div>
  );
}
