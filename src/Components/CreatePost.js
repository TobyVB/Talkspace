import React, {useEffect, useState} from "react";
import {getAuth} from 'firebase/auth'
import {collection, getFirestore, addDoc,
     serverTimestamp, onSnapshot, updateDoc,
      query, orderBy,
      doc
} from 'firebase/firestore';
import { nanoid } from 'nanoid';

export default function CreatePost(props){

    const auth = getAuth();
    const db = getFirestore();
    const postsRef = collection(db, 'posts');
    const [formValueTitle, setFormValueTitle] = useState('');
    const [formValueBody, setFormValueBody] = useState('');

    const [unique, setUnique] = useState(nanoid())

    useEffect(() => {
        window.scrollTo(0, 0)
    }, [])

    function createPost(e){
        e.preventDefault()
        addDoc(postsRef, {
            title: formValueTitle,
            body: formValueBody,
            uid: auth.currentUser.uid,
            follows: [],
            approval: [],
            disapproval: [],
            createdAt: serverTimestamp(),
            unique: unique
        })
        .then(() => {
            setFormValueTitle('');
            setFormValueBody('')
        })
        // UPDATE HAS BEEN UPDATED...
        .then(() => {
            const q = query(postsRef, orderBy('createdAt'))
            onSnapshot(q, async (snapshot) => {
                snapshot.docs.forEach((document) => {
                    const docRef = doc(db, 'posts', document.id)
                    if(document.data().unique === unique){
                        console.log(unique)
                        updateDoc(docRef, {
                            id: document.id
                        })
                        props.updatePage();
                        props.sendPostId(document.id)
                    }
                })
            })
        })
    }

    return (
        <>
            <div className="create-post page-body">
                <h1 className="create-post-h1">Create Post</h1>
                {auth.currentUser && 
                <form className="create-post-form" onSubmit={createPost}>
                    <textarea 
                        className="create-post-title-input"
                        cols={1} 
                        type="text" 
                        placeholder="Add post title..." 
                        value={formValueTitle} 
                        onChange={(event) => setFormValueTitle(event.target.value)} 
                    />
                    <textarea 
                        className="create-post-body-input" 
                        cols={120} 
                        rows={5}
                        value={formValueBody} 
                        onChange={(event) => setFormValueBody(event.target.value)} 
                        placeholder="Add post body..." 
                    />
                    <button className="create-post-btn" type="submit" disabled={!formValueTitle}>create post</button>
                </form>
                }
                {/* <h3 className="create-post-title">{formValueTitle}</h3>
                <p className="create-post-body">{formValueBody}</p> */}
            </div>
            
        </>
    )
}