import { getFirestore, doc, deleteDoc } from "firebase/firestore";
import { NavLink } from "react-router-dom";

export default function Notification(props) {
  const db = getFirestore();

  function checkNotification() {
    props.toggleNotifyWindow();
    // Delete the notification
    const docRef = doc(db, "commentAlerts", props.notification.id);
    deleteDoc(docRef).then(() => {
      console.log("notification deleted");
    });
  }

  return (
    <div className="flex">
      <p>{`${props.notification.fromUsername} commented on your post.`}</p>
      <NavLink
        to={`posts/${props.notification.post}`}
        state={{ from: props.notification.commentId }}
      >
        <button onClick={checkNotification} className="notifyGo">
          go
        </button>
      </NavLink>
    </div>
  );
}
