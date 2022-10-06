import React, {useState, useEffect} from "react";
import {getAuth} from 'firebase/auth';
import {collection, getFirestore, addDoc,
    serverTimestamp, onSnapshot, updateDoc,
     query, orderBy,
     doc
} from 'firebase/firestore';
import { nanoid } from 'nanoid';

export default function CreateComment(props){
    const auth = getAuth();
    const db = getFirestore();
    const commentsRef = collection(db, 'comments');
    const notifyRef = collection(db, 'notifications');

    const [formValue, setFormValue] = useState('');

    const usersRef = collection(db, 'users');
    const [currentUser, setCurrentUser] = useState("")
    // ########## A C C E S S   C U R R E N T   U S E R'S   D O C ##########
    useEffect(() => {
        const q = query(usersRef, orderBy('createdAt'))
        onSnapshot(q, async (snapshot) => {
            snapshot.docs.forEach((doc => {
                if(doc.data().uid === auth.currentUser.uid){
                    setCurrentUser({ ...doc.data(), id: doc.id})
                }
            }))
        })
    },[])

    const [unique, setUnique] = useState(nanoid())

    function createComment(e){
        e.preventDefault()
        addDoc(commentsRef, {
            body: formValue,
            uid: auth.currentUser.uid,
            approval: [],
            disapproval: [],
            createdAt: serverTimestamp(),
            replyTo: props.capturedPostId,
            username: currentUser.username,
            defaultPic: currentUser.defaultPic,
            unique: unique
        })
        .then(() => {
            setFormValue('');
        })
        .then(() => {
            const q = query(commentsRef, orderBy('createdAt'))
            onSnapshot(q, (snapshot) => {
                let comments = []
                snapshot.docs.forEach((doc) => {
                    comments.push({ ...doc.data(), id: doc.id })
                })
                comments.forEach((comment) => {
                    const docRef = doc(db, 'comments', comment.id)
                    updateDoc(docRef, {
                        id: comment.id
                    })
                })
            })
        })
        // create notification for the replyTo
        .then(() => {
            addDoc(notifyRef, {
                to: props.uid,
                from: currentUser.id,
                type: "comment",
                message: `${currentUser.username} commented on your post.`,
                postId: props.capturedPostId,
                unique: unique,
                createdAt: serverTimestamp()
            })
            .then(() => {
                const q = query(notifyRef, orderBy('createdAt'))
                onSnapshot(q, (snapshot) => {
                    let notifications = []
                    snapshot.docs.forEach((doc) => {
                        notifications.push({ ...doc.data(), id: doc.id})
                    })
                    notifications.forEach((notification) => {
                        const docRef = doc(db, 'notifications', notification.id)
                        updateDoc(docRef, {
                            id: notification.id
                        })
                    })
                })
            })
        })
        setUnique(nanoid())
    }

    





    // ########################################################

    const [textareaCols, setTextareaCols] = useState(1);
    function handleKeyPress(e){

        if(e.key === 'Enter' && textareaCols < 3){
            setTextareaCols(prevTextareaCols => prevTextareaCols += 1)
        }
    }

    return (
        <>
        {auth.currentUser && 
            <form className="create-comment-form" onSubmit={createComment}>
                <textarea 
                    onKeyPress={handleKeyPress}
                    className="sendChatMessageInput" 
                    cols={60} 
                    rows={textareaCols}
                    value={formValue} 
                    onChange={(event) => setFormValue(event.target.value)} 
                    placeholder="Add a comment..." />
                <button 
                    className="sendComment-btn" 
                    type="submit" 
                    disabled={!formValue}
                >COMMENT</button>
            </form>
        }
        </>
    )
}