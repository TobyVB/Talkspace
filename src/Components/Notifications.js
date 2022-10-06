import React, {useState} from "react";
import {getFirestore, collection, query,
    orderBy
} from "firebase/firestore";
import {useCollectionData} from "react-firebase-hooks/firestore";
import Notification from "./Notification.js";

export default function Notifications(props){
    const db = getFirestore();
    const notificationsRef = collection(db, 'notifications');
    const q = query(notificationsRef, orderBy('createdAt'));
    const [notifications] = useCollectionData(q, {
        createdAt: 'createdAt',
        unique: 'unique',
        to: 'to',
        from: 'from',
        type: 'type',
        message: 'message',
        postId: 'postId'
    })
    

    return (

        <div className="notifications">
            <button 
                className="close-notify" 
                onClick={props.toggleNotifyWindow}
                >CANCEL
            </button>

            {notifications && notifications.length < 1 && <p>No new notifications.</p>}

            <div>
            {notifications && notifications.map((notification, index) => notification.to === props.uid && 
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
                /> )}
            </div>
        </div>  
    )
}