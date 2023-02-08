import Notification from "./Notification.js";

export default function Notifications(props) {
  const notifications = props.data.commentAlerts;

  return (
    <div className="notifications">
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
                  key={index}
                  notification={notification}
                  toggleNotifyWindow={props.toggleNotifyWindow}
                />
              )
          )}
      </div>
    </div>
  );
}
