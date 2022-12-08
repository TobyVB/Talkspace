export default function RetrievePassword(props) {
  return (
    <div className="page-body settings">
      <h1>Retrieve Password</h1>
      <button onClick={() => props.changePageTo("settings")}>cancel</button>
    </div>
  );
}
