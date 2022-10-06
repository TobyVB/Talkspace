import {getAuth} from 'firebase/auth'
import {arrayRemove, arrayUnion, doc,
   getFirestore, updateDoc, collection,
   query, orderBy, onSnapshot,
   serverTimestamp, addDoc
} from 'firebase/firestore'
import React, {useState, useEffect, useRef} from 'react';
import Clock from "./Utils/Clock.js";

import { nanoid } from 'nanoid';

export default function Comment(props){
    const auth = getAuth();
    const db = getFirestore()
    const { body, uid, username } = props.comment;

    const commentsRef = collection(db, 'comments');
    const notifyRef = collection(db, 'notifications');

    const [formValue, setFormValue] = useState('');


    const [approveImpactSelected, setApproveImpactSelected] = React.useState(false);
    const [disapproveImpactSelected, setDisapproveImpactSelected] = React.useState(false);

    function updateApprove(e){
        e.stopPropagation();
        const docRef = props.type === "reply" ? doc(db, 'comments', props.commentId) : doc(db, 'comments', props.id)
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
        const docRef = props.type === "reply" ? doc(db, 'comments', props.commentId) : doc(db, 'comments', props.id)
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

    const [unique, setUnique] = useState(nanoid())

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
            type: props.type,
            unique: `${props.type?props.unique:unique}`,
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
                type: "reply",
                message: `${currentUser.username} replied to your comment.`,
                postId: props.capturedPostId,
                unique: `${props.type?props.unique:unique}`,         
                createdAt: serverTimestamp()
            })
            .then(() => {
                const q = query(notifyRef, orderBy('createdAt'))
                onSnapshot(q, (snapshot) => {
                    let notifications = []
                    snapshot.docs.forEach((doc) => {
                        notifications.push({...doc.data(), id: doc.id})
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

    

    // ACCESS REPLIES
    const [update, setUpdate] = useState(false)

    function toggleReplies(){   
        // REMOVE COMMENT/REPLY TO OPEN REPLIES FOR
        if(sessionStorage.getItem(props.unique) === props.unique){
            sessionStorage.removeItem(props.unique)
        } else {
            sessionStorage.setItem(props.unique, props.unique)
        }   
        setUpdate(prevUpdate => !prevUpdate);
    }

    const [replyPressed, setReplyPressed] = useState(false)
    const [showForm, setShowForm] = useState(false);
    function toggleShowForm(){
        setShowForm(prevShowForm => !prevShowForm)
        if(showForm){
            setTextareaCols(0);
            setFormValue("");
        } else {
            setFormValue(`@${props.username} `)
        }
        setReplyPressed(prevReplyPressed => !prevReplyPressed)
    }

    const [replyList, setReplyList] = useState(0)
    useEffect(() => {
        props.comments && props.comments.map((comment) => {
            if(comment.replyTo === props.id){
                setReplyList(prevReplyList => {
                    return prevReplyList+=1
                })
                console.log(`replyList length `+replyList.length)
            }
        })
    }, [])

    const [textareaCols, setTextareaCols] = useState(1);
    function handleKeyPress(e){
        if(e.key === 'Enter'){
            setTextareaCols(prevTextareaCols => prevTextareaCols += 1)
        }
    }

    
    
    
    return (
        <div 
            className={`comment ${props.unique===props.capturedUnique&& `targetedComment`}`}
            onClick={props.resetUnique}
        >
            <div className="comment-container-main flex">    
                <img 
                    className="comment-profile-pic" 
                    alt="user" 
                    src={props.defaultPic}
                    onClick={() => props.sendUID(props.uid)} 
                />
                <div>
                    <div className={`comment-full-header`}>
                    
                        <div className={`container-chat-header`}>
                            <p className="comment-name">{props.username}</p>
                        </div>
                        
                        <Clock createdAt={props.createdAt}/>
                    </div>
                    <div className={`container-full-comment`}>
                        <div className={`comment-chat-text`}>
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
                            {!showForm && !replyPressed && <button className="reply-btn" onClick={toggleShowForm}>REPLY</button>}
                        </div>

                        {showForm && 
                            <form className="create-comment-form" onSubmit={createComment}>
                                <textarea className="reply-input" 
                                    ref={ref => ref && ref.focus()}
                                    onFocus={(e) => e.currentTarget.setSelectionRange(e.currentTarget.value.length, e.currentTarget.value.length)}
                                    autoFocus
                                    onKeyPress={handleKeyPress}
                                    cols={40} 
                                    rows={textareaCols}
                                    value={formValue} 
                                    onChange={(event) => setFormValue(event.target.value)} 
                                    placeholder="Add a reply..." />
                                <div className="reply-btns">
                                    {showForm && <button className="cancel-reply" onClick={toggleShowForm}>CANCEL</button>}
                                    <button 
                                        className="sendComment-btn" 
                                        type="submit" 
                                        disabled={!formValue}
                                    >REPLY</button>
                                </div>
                            </form>
                        } 
                        
                        <div className="comment-chain">
                            {props.type === "comment" 
                            && sessionStorage.getItem(props.unique) === props.unique
                            && <button 
                                className="show-replies" 
                                onClick={toggleReplies}>hide replies
                            </button>}
                            {sessionStorage.getItem(props.unique) === props.unique && props.comments && 
                            props.comments.map(comment => comment.replyTo === props.id && 
                                <div className="reply" key={nanoid()}> 
                                    <Comment 
                                        comment={comment.body}
                                        createdAt={comment.createdAt}
                                        approval={comment.approval} 
                                        disapproval={comment.disapproval}
                                        username={comment.username}
                                        uid={comment.uid}
                                        id={props.type===comment? comment.id: props.id}
                                        commentId={comment.id}
                                        type={"reply"}
                                        sendUID={props.sendUID}
                                        defaultPic={comment.defaultPic}
                                        key={nanoid()}
                                        resetUnique={props.resetUnique}
                                        unique={props.unique}
                                        capturedPostId={props.capturedPostId}
                                    />
                                </div>
                            )}
                            {/* ############################################################ */}
                            {props.type === "comment" 
                            && sessionStorage.getItem(props.unique) === null
                            && replyList > 0 
                            && <button 
                                className="show-replies" 
                                onClick={toggleReplies}>{`${replyList}`} {`${replyList>1?"REPLIES":"REPLY"}`}
                            </button>}
                        </div>
                    </div>
                </div>
            </div>
        </div>
    )
}       