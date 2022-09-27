import React, {useEffect, useState} from "react";
import { useCollectionData } from 'react-firebase-hooks/firestore';
import { nanoid } from 'nanoid';

import { query, orderBy, onSnapshot, 
    collection, getFirestore, doc
} from "firebase/firestore";

import CreateComment from "./CreateComment.js";
import Comment from "./Comment.js";

export default function ViewPost(props){
    console.log("viewPost.js")
    const db = getFirestore();
    const commentsRef = collection(db, 'comments');
    const q = query(commentsRef, orderBy('createdAt'));
    const [comments] = useCollectionData(q, {
        createdAt: 'createAt',
        id: 'id',
        approval: 'approval',
        disapproval: 'disapproval',
        username: 'username',
        body: 'body'
    })

    
    // FIND THE POST DOC
    const postsRef = collection(db, 'posts');
    const [foundPost, setFoundPost] = useState("")
    useEffect(() => {
        const q = query(postsRef, orderBy('createdAt'))
        onSnapshot(q, async (snapshot) => {
            snapshot.docs.forEach((doc => {
                if(doc.data().id === props.capturedPostId){
                    setFoundPost({ ...doc.data(), id: doc.id})
                }
            }))
        })
    },[])


    // FIND THE USER DOC
    const usersRef = collection(db, 'users');
    const [foundUser, setFoundUser] = useState("")
    useEffect(() => {
        const q = query(usersRef, orderBy('createdAt'))
        onSnapshot(q, async (snapshot) => {
            snapshot.docs.forEach((doc => {
                if(doc.data().uid === foundPost.uid){
                    setFoundUser({ ...doc.data(), id: doc.id})
                }
            }))
        })
    },[foundPost])

    
    return (
        <div className="page-body post">
            <div className="post-header-text">
                <h2>{foundPost.title}</h2>
                <p 
                    className="post-author"
                    onClick={() => props.sendUID(foundUser.uid)}>author: {foundUser.username}
                </p>
            </div>
            
            <p>{foundPost.body}</p>

            {/* write new comment */}
            <CreateComment 
                capturedPostId={props.capturedPostId}
            />
            {/* comments here */}
            <div className="chatMessages">
                {comments && comments.map(comment => comment.replyTo === props.capturedPostId && <Comment 
                    comment={comment.body}
                    createdAt={comment.createdAt}
                    approval={comment.approval} 
                    disapproval={comment.disapproval}
                    username={comment.username}
                    uid={comment.uid}
                    id={comment.id}
                    type={"comment"}
                    sendUID={props.sendUID}
                    defaultPic={comment.defaultPic}
                    key={nanoid()}
                    comments={comments}
                    page={props.page}
                />)}
            </div>

        </div>
    )
}