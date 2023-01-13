import { useNavigate } from "react-router-dom";

export default function RetrievePassword(props) {
  const navigate = useNavigate();

  return (
    <div className="page-body settings">
      <h1>Retrieve Password</h1>
      <button onClick={() => navigate(-1)}>Back</button>
    </div>
  );
}
