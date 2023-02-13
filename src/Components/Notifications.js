import Notification from "./Notification.js";
import { useState } from "react";

export default function Notifications(props) {
  const notifications = props.data.commentAlerts;
  const [flip, setFlip] = useState(false);
  const data = props.data;
  const [hideNoteMenu, setHideNoteMenu] = useState(false);

  return (
    <div
      style={hideNoteMenu ? { visibility: "hidden" } : {}}
      className="notifications"
    >
      <button className="close-notify" onClick={props.toggleNotifyWindow}>
        CANCEL
      </button>
      {notifications && notifications.length < 1 && (
        <p>No new notifications.</p>
      )}
      <div>
        {notifications &&
          notifications.map(
            (notification, index) =>
              notification.postCreator === props.data.user.id && (
                <Notification
                  data={props.data}
                  setFlip={setFlip}
                  key={index}
                  notification={notification}
                  toggleNotifyWindow={props.toggleNotifyWindow}
                  setHideNoteMenu={setHideNoteMenu}
                />
              )
          )}
      </div>
    </div>
  );
}
