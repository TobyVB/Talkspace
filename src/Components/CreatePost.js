import React, {useEffect, useState} from "react";
import {getAuth} from 'firebase/auth'
import {collection, getFirestore, addDoc,
     serverTimestamp, onSnapshot, updateDoc,
      query, orderBy,
      doc
} from 'firebase/firestore'

export default function CreatePost(props){

    const auth = getAuth();
    const db = getFirestore();
    const postsRef = collection(db, 'posts');
    const [formValueTitle, setFormValueTitle] = useState('');
    const [formValueBody, setFormValueBody] = useState('');

    function createPost(e){
        e.preventDefault()
        addDoc(postsRef, {
            title: formValueTitle,
            body: formValueBody,
            uid: auth.currentUser.uid,
            approval: [],
            disapproval: [],
            createdAt: serverTimestamp()
        })
        .then(() => {
            setFormValueTitle('');
            setFormValueBody('')
        })
        // creating id field and adding doc's id to it
        .then(() => {
            const q = query(postsRef, orderBy('createdAt'))
            onSnapshot(q, (snapshot) => {
                let posts = []
                snapshot.docs.forEach((doc) => {
                    posts.push({ ...doc.data(), id: doc.id})
                })
                posts.forEach((post) => {
                    const docRef = doc(db, 'posts', post.id)
                    updateDoc(docRef, {
                        id: post.id
                    })
                    props.updatePage();
                    props.sendPostId(post.id)
                })
            })
        })
    }

    

    return (
        <>
            <h1>Create Post</h1>
            {auth.currentUser && 
            <form className="chat-message-form" onSubmit={createPost}>
                <input 
                    type="text" 
                    placeholder="title" 
                    value={formValueTitle} 
                    onChange={(event) => setFormValueTitle(event.target.value)} 
                />
                <textarea 
                    className="sendChatMessageInput" 
                    cols={120} 
                    value={formValueBody} 
                    onChange={(event) => setFormValueBody(event.target.value)} 
                    placeholder="create post" 
                />
                <button className="sendChatMessage-btn" type="submit" disabled={!formValueTitle}>📧</button>
            </form>
            }
            <p>{formValueTitle}</p>
            <p>{formValueBody}</p>
        </>
    )
}