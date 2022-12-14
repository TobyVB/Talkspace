import React from "react";
import {getFirestore} from "firebase/firestore";
import Notification from "./Notification.js";

export default function Notifications(props){
    const db = getFirestore();

    return (
        <div className="notifications">
            <button 
                className="close-notify" 
                onClick={props.toggleNotifyWindow}
                >CANCEL
            </button>
            {props.notifications && props.notifications.length < 1 && <p>No new notifications.</p>}
            <div>
                {props.notifications && props.notifications.map((notification, index) => 
                notification.to === props.uid && 
                    <Notification 
                        key={index} 
                        message={notification.message}
                        type={notification.type}
                        toPost={props.toPost}
                        sendPostId={props.sendPostId}
                        postId={notification.postId}
                        toggleNotifyWindow={props.toggleNotifyWindow}
                        restartPage={props.restartPage}
                        unique={notification.unique}
                        id={notification.id}
                        sendUnique={props.sendUnique}
                        sendCurrentCommentId={props.sendCurrentCommentId}
                    /> 
                )}
            </div>
        </div>  
    )
}