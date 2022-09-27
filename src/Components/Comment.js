import {getAuth} from 'firebase/auth'
import {arrayRemove, arrayUnion, doc,
   getFirestore, updateDoc, collection,
   query, orderBy, onSnapshot,
   serverTimestamp, addDoc
} from 'firebase/firestore'
import React, {useState, useEffect} from 'react';
import Clock from "./Utils/Clock.js";

import { nanoid } from 'nanoid';

export default function Comment(props){
    const auth = getAuth();
    const db = getFirestore()
    const { body, uid, username } = props.comment;

    


    const commentsRef = collection(db, 'comments');
    const [formValue, setFormValue] = useState('');


    const [approveImpactSelected, setApproveImpactSelected] = React.useState(false);
    const [disapproveImpactSelected, setDisapproveImpactSelected] = React.useState(false);

    function updateApprove(e){
        e.stopPropagation();
        const docRef = doc(db, 'comments', props.id)
        updateDoc(docRef, {
            approval: arrayUnion(auth.currentUser.uid),
            disapproval: arrayRemove(auth.currentUser.uid)
        })
        .then(() => {
            setApproveImpactSelected(true)
            setDisapproveImpactSelected(false)
            console.log("approved")
        })
    }
    function updateDisapprove(e){
        e.stopPropagation();
        const docRef = doc(db, 'comments', props.id)
        updateDoc(docRef, {
            approval: arrayRemove(auth.currentUser.uid),
            disapproval: arrayUnion(auth.currentUser.uid)
        })
        .then(() => {
            setDisapproveImpactSelected(true)
            setApproveImpactSelected(false)
            console.log("disapproved")
        })
    }
    function removeImpact(){
        const docRef = doc(db, 'comments', props.id)
        updateDoc(docRef, {
            approval: arrayRemove(auth.currentUser.uid),
            disapproval: arrayRemove(auth.currentUser.uid)
        })
        .then(() => {
            setDisapproveImpactSelected(false)
            setApproveImpactSelected(false)
            console.log("impact removed")
        })
    }


    // if uid in approval then add class 'voteCasted'
    const approveImpactClass = approveImpactSelected? 'approve-impact-selected': ''
    // if uid in disapproval then add class 'votedCasted'
    const disapproveImpactClass = disapproveImpactSelected? 'disapprove-impact-selected': ''


    const approves = props.approval.length;
    const disapproves = props.disapproval.length;
    const headCount = approves + disapproves;



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
            replyTo: props.id,
            username: currentUser.username,
            defaultPic: currentUser.defaultPic,
            type: props.type
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
        e.preventDefault()
    }



    

    // ACCESS REPLIES
    const [update, setUpdate] = useState(false)

    function toggleReplies(){   
        // REMOVE COMMENT/REPLY TO OPEN REPLIES FOR
        if(sessionStorage.getItem(props.id) === props.id){
            sessionStorage.removeItem(props.id)
        } else {
            sessionStorage.setItem(props.id, props.id)
        }   
        setUpdate(prevUpdate => !prevUpdate);
    }



    const [showForm, setShowForm] = useState(false);
    function toggleShowForm(){
        setShowForm(prevShowForm => !prevShowForm)
    }
    return (
        <div className="comment">
            <div className="container-main flex">    
                <img 
                    className="comment-profile-pic" 
                    alt="user" 
                    src={props.defaultPic}
                    onClick={() => props.sendUID(props.uid)} 
                />
                <div>
                    <div className={`comment-full-header`}>
                    
                        <div className={`container-chat-header`}>
                            <p className="name">{props.username}</p>
                        </div>
                        
                        <Clock createdAt={props.createdAt}/>
                    </div>
                    <div className={`container-full-comment`}>
                        <div className={`comment-chat-text`}>
                            {/* {props.type==="reply" && <p>@{props.username}</p>} */}
                            <p className="comment-text">{props.comment}</p>
                        </div>
                        <div className="flex comment-impact">
                            <div className="rate-chatMessage">
                                <p className={`hidden-impact ${approves > 0 && `hidden-impact-bright`} ${approveImpactClass}`} 
                                onClick={updateApprove}>👍</p>
                                {approves > 0 
                                    &&<span className="numImpact">{approves}</span>}

                                <p className={`hidden-impact ${disapproves > 0 && `hidden-impact-bright`} ${disapproveImpactClass}`} 
                                onClick={updateDisapprove}>👎</p>
                                {disapproves > 0
                                    &&<span className="numImpact">{disapproves}</span>}

                                {/* <p className="impact-metrics hidden-impact">📊</p>
                                <p className="impact-metrics hidden-impact" 
                                onClick={removeImpact}>🚫</p> */}
                            </div>
                            {!showForm && <button className="reply-btn" onClick={toggleShowForm}>REPLY</button>}
                        </div>
                        

                        {showForm && 
                            <form className="create-comment-form" onSubmit={createComment}>
                                <textarea className="reply-input" 
                                    cols={40} 
                                    value={formValue} 
                                    onChange={(event) => setFormValue(event.target.value)} 
                                    placeholder="From Comment.js map function in ViewPost.js" />
                                <div>
                                    <button 
                                        className="sendComment-btn" 
                                        type="submit" 
                                        disabled={!formValue}
                                    >REPLY</button>
                                    {showForm && <button onClick={toggleShowForm}>cancel</button>}
                                </div>
                            </form>
                        } 
                        
                        

                        {sessionStorage.getItem(props.id) === props.id && props.comments && 
                        props.comments.map(comment => comment.replyTo === props.id && 
                            <div className="reply"> 
                                <Comment 
                                    comment={comment.body}
                                    createdAt={comment.createdAt}
                                    approval={comment.approval} 
                                    disapproval={comment.disapproval}
                                    username={comment.username}
                                    uid={comment.uid}
                                    id={props.type===comment? comment.id: props.id}
                                    type={"reply"}
                                    sendUID={props.sendUID}
                                    defaultPic={comment.defaultPic}
                                    key={nanoid()}
                                />
                            </div>
                        )}
                        {/* ############################################################ */}
                        {props.type === "comment" && sessionStorage.getItem(props.id) === null
                        && <button className="show-replies" onClick={toggleReplies}>REPLIES</button>}
                        {props.type === "comment" && sessionStorage.getItem(props.id) === props.id
                        && <button className="show-replies" onClick={toggleReplies}>hide replies</button>}
                    </div>
                </div>
            </div>
        </div>
    )
}       