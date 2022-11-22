import React, {useEffect, useState, useRef} from "react";
import { useCollectionData } from 'react-firebase-hooks/firestore';
import { nanoid } from 'nanoid';
import { query, orderBy, onSnapshot, 
    collection, getFirestore, doc, 
    updateDoc, arrayUnion, arrayRemove, deleteDoc
} from "firebase/firestore";
import { getAuth } from "firebase/auth";
import CreateComment from "./CreateComment.js";
import Comment from "./Comment.js";

export default function ViewPost(props){
    const db = getFirestore();
    const auth = getAuth();
    const commentsRef = collection(db, 'comments');
    const q = query(commentsRef, orderBy('createdAt'));
    const [comments] = useCollectionData(q, {
        createdAt: 'createAt',
        id: 'id',
        approval: 'approval',
        disapproval: 'disapproval',
        username: 'username',
        body: 'body',
        chain: 'chain'
    })

    const [pagePause, setPagePause] = useState(true)
    useEffect(() => {
        window.scrollTo(0, 0)
        setTimeout(()=>{setPagePause(false)},250)
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

    // #####################################   F O L L O W   A N D   U N F O L L O W   P O S T   #############################################
    function followPost(){
        if(!foundPost.follows.includes(props.userDataId)){
            const postRef = doc(db, 'posts', foundPost.id)
            updateDoc(postRef, {
                follows: arrayUnion(props.userDataId)
            })
            .then(() => {
                const userRef = doc(db, 'users', props.userDataId)
                updateDoc(userRef, {
                    following: arrayUnion(foundPost.id)
                })
            })
        } else {
            const postRef = doc(db, 'posts', foundPost.id)
            updateDoc(postRef, {
                follows: arrayRemove(props.userDataId)
            })
            .then(() => {
                const userRef = doc(db, 'users', props.userDataId)
                updateDoc(userRef, {
                    following: arrayRemove(foundPost.id)
                })
            })
        }
    }
    function editPost(){
        props.editPost();
    }
    function deletePost(){
        const docRef = doc(db, 'posts', props.capturedPostId)
        deleteDoc(docRef)
        .then(() => {
            console.log("notification deleted")
        })
        .then(() => {
            const q = query(commentsRef, orderBy('createdAt'))
            onSnapshot(q, async (snapshot) => {
                snapshot.docs.forEach((document) => {
                    const docRef = doc(db, 'comments', document.id)
                    if(document.data().postId === props.capturedPostId){
                        deleteDoc(docRef)
                    } 
                })
            })

        })
        props.deletePost();
    }

    // if text includes https://youtu.be/ copy the text until the next " " and put it in a variable
    // also hide or remove text that matches the created variable
    // where the removed or hidden text was, put in an iframe


    return (
        <div className="page-body post">
            { auth.currentUser.uid === foundPost.uid && <button className="edit-post-btn" disabled={pagePause && "+true"} onClick={editPost}>edit post</button>}
            { auth.currentUser.uid === foundPost.uid && <button className="edit-post-btn" disabled={pagePause && "+true"} onClick={deletePost}>delete post</button>}
            <div className="view-post-container">
                <div className="post-header">
                    <p 
                        className="post-author"
                        onClick={() => props.sendUID(foundUser.uid)}>Authored by: {foundUser.username}
                    </p>
                    <img 
                        alt={foundUser.username}
                        src={foundUser.defaultPic}
                        className="post-defaultPic"
                    />
                </div>
                <h4 className="post-title">{foundPost.title}</h4>
                <div className="post-body">
                    <div className="input-chain">
                    {foundPost && foundPost.inputs.map(input =>
                    foundPost && input.type === "text"?
                    <p className="post-text" style={{fontSize: input.fontSize, marginTop: input.topMargin}}>{input.output}</p>
                    :
                    input.type === "video" 
                    ?
                    input.output && <iframe className="post-video"  src={`https://www.youtube.com/embed/${input.output.slice(17)}`} frameBorder="0" allowFullScreen ></iframe>
                    :
                    input.type === "image" 
                    &&
                    <img className="post-image" src={input.output}></img>
                    )}
                    </div>
               
                </div>
                <button className="follow-post" onClick={followPost}>{foundPost && foundPost.follows.includes(props.userDataId)?"- UNFOLLOW":"+ FOLLOW"}</button>
            </div>   
            <CreateComment 
                capturedPostId={props.capturedPostId}
                id={foundUser.id}
                uid={foundUser.uid}
            />
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
                    page={props.page}
                    chain={comment.chain}
                />  
                {props.capturedUnique===comment.unique&&<div ref={scrollTarget}></div>}
                </div>)}
            </div>
        </div>
    )
}