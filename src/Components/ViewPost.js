import React, {useEffect, useState, useRef} from "react";
import { useCollectionData } from 'react-firebase-hooks/firestore';
import { nanoid } from 'nanoid';

import { query, orderBy, onSnapshot, 
    collection, getFirestore, doc
} from "firebase/firestore";

import CreateComment from "./CreateComment.js";
import Comment from "./Comment.js";

export default function ViewPost(props){
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

    useEffect(() => {
        window.scrollTo(0, 0)
    }, [])

    
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



    const scrollTarget = useRef();
    const scrollingTop = (event) => {
        const elmnt = scrollTarget;
        elmnt.current.scrollIntoView({
          behavior: "smooth",
          block: "center",
          inline: "start"
        });
    };
    setTimeout(()=> {
        if(props.capturedUnique !== ""){scrollingTop();}
    }, 200)
        
    function resetUnique(){props.setCapturedUnique("");props.setCurrentCommentId("")}
    function doNothing(){}




    return (
        <div className="page-body post">
            <div>
                <div className="post-header-text">
                    <h2>{foundPost.title}</h2>
                    <p 
                        className="post-author"
                        onClick={() => props.sendUID(foundUser.uid)}>author: {foundUser.username}
                    </p>
                </div>
                <div className="post-body">
                    <p>{foundPost.body}</p>
                </div>
            </div>
            

            {/* write new comment */}
            <CreateComment 
                capturedPostId={props.capturedPostId}
                id={foundUser.id}
                uid={foundUser.uid}
            />
            {/* comments here */}
            
            <div className="chatMessages">
                {comments && comments.map((comment) => comment.replyTo === props.capturedPostId && <div key={nanoid()}><Comment 
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
                    unique={comment.unique}
                    capturedUnique={props.capturedUnique}
                    resetUnique={comment.unique===props.capturedUnique?resetUnique:doNothing}
                    capturedPostId={props.capturedPostId}
                    currentCommentId={props.currentCommentId}
                />  
                {props.capturedUnique===comment.unique&&<div ref={scrollTarget}></div>}
                </div>)}
            </div>
        </div>
    )
    
}