import React, {useEffect, useState} from "react";
import {getFirestore, doc, onSnapshot,
    collection, query, orderBy, deleteDoc
} from "firebase/firestore";

export default function Notification(props){
    const db = getFirestore();
    const notificationsRef = collection(db, 'notifications');

    // get current notification
    const [currentNotification, setCurrentNotification] = useState("");
    useEffect(() => {
        const q = query(notificationsRef, orderBy('createdAt'))
        onSnapshot(q, async (snapshot) => {
            snapshot.docs.forEach(doc => {
                if(doc.data().id === props.id){
                    setCurrentNotification({...doc.data(), id: doc.id})
                }
            })
        })
    }, [])




    // grab that comment with the same unique as the currentNotification's unique
    const commentsRef = collection(db, 'comments');
    const [currentComment, setCurrentComment] = useState("");
    useEffect(() => {
        if(currentNotification !== ""){
            const q = query(commentsRef, orderBy('createdAt'))
            onSnapshot(q, async (snapshot)=> {
                snapshot.docs.forEach(doc => {
                    if(doc.data().unique === currentNotification.unique){
                        setCurrentComment({...doc.data(), id: doc.id})
                    }
                })
            })
        } 
    }, [currentNotification])
    
    useEffect(() => {
        if(currentComment !== ""){
            console.log("from notification.js: "+currentComment.id)
        }
    },[currentComment])


    function checkNotification(){
        console.log('the current notification id: '+currentNotification.id)
        if(props.type==="comment" || props.type==="reply"){
            props.sendPostId(props.postId)
            props.restartPage()
        }
        console.log(props.postId+' from the Notification.js')
        props.toggleNotifyWindow()
        // Deletes the notification
        const docRef = doc(db, 'notifications', currentNotification.id)
        deleteDoc(docRef)
        .then(() => {
            console.log("notification deleted")
        })
        .then(() => {
            props.sendUnique(currentNotification.unique);
        })
        // set session storage so replychain opens up if type is reply
        // do not want to activate this on a normal comment. I don't think it would work
        // anyway, could test that out...
        .then(() => {
            if(currentNotification.type="reply"){
                sessionStorage.setItem(props.unique, props.unique)
            }
        })
        .then(() => {
            // For some reason session storage isn't getting the currentComment.id
            // so fixing that is the next order of business.
            // console.log("blahblahblah: "+currentComment.id)
            // sessionStorage.setItem("commentId", JSON.stringify(currentComment.id))
            // instead of using sessionStorage, send it to a capture function
            props.sendCurrentCommentId(currentComment.id)
        })
    }

    return (
        <div className="flex">
            <p>{props.message}</p>
            <button 
                onClick={checkNotification} 
                className="notifyGo"
                >go
            </button>
        </div>
    )
}