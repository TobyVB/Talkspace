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
        // .then(() => {
        //     const q = query(postsRef, orderBy('createdAt'))
        //     onSnapshot(q, (snapshot) => {
        //         let posts = []
        //         snapshot.docs.forEach((doc) => {
        //             posts.push({ ...doc.data(), id: doc.id})
        //         })
        //         posts.forEach((post) => {
        //             const docRef = doc(db, 'posts', post.id)
        //             updateDoc(docRef, {
        //                 id: post.id
        //             })
        //             props.updatePage();
        //             props.sendPostId(post.id)
        //         })
        //     })
        // })
    }

    

    return (
        <>
            <div className="create-post page-body">
                <h1>Create Post</h1>
                {auth.currentUser && 
                <form className="create-post-form" onSubmit={createPost}>
                    <input 
                        className="create-post-title"
                        type="text" 
                        placeholder="Add post title..." 
                        value={formValueTitle} 
                        onChange={(event) => setFormValueTitle(event.target.value)} 
                    />
                    <hr></hr>
                    <textarea 
                        className="create-post-body" 
                        cols={120} 
                        value={formValueBody} 
                        onChange={(event) => setFormValueBody(event.target.value)} 
                        placeholder="Add post body..." 
                    />
                    <button className="sendChatMessage-btn" type="submit" disabled={!formValueTitle}>create post</button>
                </form>
                }
                <p>Title: {formValueTitle}</p>
                <p>Body:{formValueBody}</p>
            </div>
            
        </>
    )
}