import React, {useState, useEffect} from "react";
import {getAuth} from 'firebase/auth';
import {collection, getFirestore, addDoc,
    serverTimestamp, onSnapshot, updateDoc,
     query, orderBy,
     doc
} from 'firebase/firestore';


export default function CreateComment(props){
    const auth = getAuth();
    const db = getFirestore();
    const commentsRef = collection(db, 'comments');
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
            defaultPic: currentUser.defaultPic
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
    }

    return (
        <>
        {auth.currentUser && 
            <form className="create-comment-form" onSubmit={createComment}>
                <textarea 
                    className="sendChatMessageInput" 
                    cols={120} 
                    value={formValue} 
                    onChange={(event) => setFormValue(event.target.value)} 
                    placeholder="From CreateComment.js in ViewPost.js" />
                <button 
                    className="sendComment-btn" 
                    type="submit" 
                    disabled={!formValue}
                >REPLY</button>
            </form>
        }
        </>
    )
}