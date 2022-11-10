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

    const [approveImpactSelected, setApproveImpactSelected] = useState(false);
    const [disapproveImpactSelected, setDisapproveImpactSelected] = useState(false);


    function updateApprove(e){
        e.preventDefault();
        e.stopPropagation();
        const docRef = doc(db, "comments", props.id)
        if(!props.approval.includes(auth.currentUser.uid)){
            updateDoc(docRef, {
                approval: arrayUnion(auth.currentUser.uid),
                disapproval: arrayRemove(auth.currentUser.uid)
            })
            .then(() => {
                setApproveImpactSelected(true)
                setDisapproveImpactSelected(false)
                console.log("approved")
            })
        } else {
            updateDoc(docRef, {
                approval: arrayRemove(auth.currentUser.uid)
            })
            .then(() => {
                setApproveImpactSelected(false)
            })
        }
    }
    function updateDisapprove(e){
        e.preventDefault();
        e.stopPropagation();
        const docRef = doc(db, "comments", props.id)
        if(!props.disapproval.includes(auth.currentUser.uid)){
            updateDoc(docRef, {
                approval: arrayRemove(auth.currentUser.uid),
                disapproval: arrayUnion(auth.currentUser.uid)
            })
            .then(() => {
                setDisapproveImpactSelected(true)
                setApproveImpactSelected(false)
                console.log("disapproved")
            })
        } else {
            updateDoc(docRef, {
                disapproval: arrayRemove(auth.currentUser.uid)
            })
            .then(() => {
                setDisapproveImpactSelected(false)
            })
        }
    }

    // if uid in approval then add class 'voteCasted'
    const approveImpactClass = approveImpactSelected? 'approve-impact-selected': ''
    // if uid in disapproval then add class 'votedCasted'
    const disapproveImpactClass = disapproveImpactSelected? 'disapprove-impact-selected': ''

    const approves = props.approval.length;
    const disapproves = props.disapproval.length;
    const headCount = approves + disapproves;

    const [unique, setUnique] = useState(nanoid())

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

    

    // NEED TO UPDATE THE CREATE COMMENT FUNCTION HERE TO
    // USE THE NEW UPDATE STYLE
    function createComment(e){
        e.preventDefault()
        e.stopPropagation();
        addDoc(commentsRef, {
            body: formValue,
            uid: auth.currentUser.uid,
            approval: [],
            disapproval: [],
            createdAt: serverTimestamp(),
            replyTo: props.id,
            username: currentUser.username,
            defaultPic: currentUser.defaultPic,
            type: "reply",
            unique: `${props.type?props.unique:unique}`,
        })
        .then(() => {
            setFormValue('');
        })
        .then(() => {
            const q = query(commentsRef, orderBy('createdAt'))
            onSnapshot(q, async (snapshot) => {
                snapshot.docs.forEach((document) => {
                    const docRef = doc(db, 'comments', document.id)
                    if(document.data().unique === unique){
                        console.log(unique)
                        updateDoc(docRef, {
                            id: document.id
                        })
                    }
                })
            })
        })
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
                onSnapshot(q, async (snapshot) => {
                    snapshot.docs.forEach((document) => {
                        const docRef = doc(db, 'notifications', document.id)
                        if(document.data().unique === unique){
                            console.log(unique)
                            updateDoc(docRef, {
                                id: document.id
                            })
                        }
                    })
                })
            })
        })
        setUnique(nanoid())
    }

    // ACCESS REPLIES
    const [openReplies, setOpenReplies] = useState(null);
    const [update, setUpdate] = useState(false);
    const [replyDisabled, setReplyDisabled] = useState(false);
    

    // function toggleReplies(){   
    //     if(sessionStorage.getItem(props.unique) === props.unique){
    //         sessionStorage.removeItem(props.unique)
    //     } else {
    //         sessionStorage.setItem(props.unique, props.unique)
    //     }   
    //     setUpdate(prevUpdate => !prevUpdate);
    // }

    console.log("test")

    function toggleReplies(){
        setReplyDisabled(true);
        if(openReplies === null){
            setReplyDisabled(false)
            setOpenReplies(true)
            if(sessionStorage.getItem(props.unique) === props.unique){
                sessionStorage.removeItem(props.unique);
            } else {
                sessionStorage.setItem(props.unique, props.unique);
            }   
            setUpdate(true);
        }
        if(openReplies === false){
            setOpenReplies(true)
            setReplyDisabled(false)
            if(sessionStorage.getItem(props.unique) === props.unique){
                sessionStorage.removeItem(props.unique);
            } else {
                sessionStorage.setItem(props.unique, props.unique);
            }   
            setUpdate(true);
        }   
        if(openReplies === true) {
            setOpenReplies(false);
            setTimeout(() => {
                setReplyDisabled(false)
                if(sessionStorage.getItem(props.unique) === props.unique){
                    sessionStorage.setItem(props.unique, props.unique);
                } else {
                    sessionStorage.removeItem(props.unique);
                }   
                setUpdate(false);
            },1000) 
        }
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



    const replyChain = props.comments && props.comments.filter(comment => comment.replyTo === props.id)

    const [textareaCols, setTextareaCols] = useState(1);
    function handleKeyPress(e){if(e.key === 'Enter'){setTextareaCols(prevTextareaCols => prevTextareaCols += 1)}}

    return (
        <div 
            className={`comment ${props.unique===props.capturedUnique&& `targetedComment`}${props.type === 'reply'?' comment-type-reply':' comment-type-comment'}`}
            onClick={props.resetUnique} 
        >
            <div className="comment-container-main flex">    
                
                <div>
                    <div className={`comment-full-header`}>
                        <img 
                            className="comment-profile-pic" 
                            alt="user" 
                            src={props.defaultPic}
                            onClick={() => props.sendUID(props.uid)} 
                        />
                        <div className={`container-chat-header`}>
                            <p className="comment-name">{props.username}</p>
                        </div>
                        <Clock createdAt={props.createdAt} type={props.type}/>
                    </div>
                    <div className={`container-full-comment`}>
                        <div className={`comment-chat-text`}>
                            <p className="comment-text">{props.comment}</p>
                        </div>
                        <div className="flex comment-impact">
                            <div className="rate-chatMessage">
                                <p className={`hidden-impact ${props.approval.includes(auth.currentUser.uid) && `hidden-impact-bright`} ${approveImpactClass}`} 
                                onClick={updateApprove}>👍</p>
                                {approves > 0 
                                    &&<span className="numImpact">{approves}</span>}

                                <p className={`hidden-impact ${props.disapproval.includes(auth.currentUser.uid) && `hidden-impact-bright`} ${disapproveImpactClass}`} 
                                onClick={updateDisapprove}>👎</p>
                                {disapproves > 0 &&<span className="numImpact">{disapproves}</span>}
                            </div>
                            {!showForm && !replyPressed && <button className="reply-btn" onClick={toggleShowForm}>REPLY</button>}
                        </div>
                        {showForm && 
                            <form className="create-reply-form" onSubmit={createComment}>
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
                                        onClick={createComment}
                                    >REPLY</button>
                                </div>
                            </form>
                        } 
                        <div className="comment-chain">
                            {props.type === "comment" 
                            && update
                            && props.comments.filter(comment => comment.replyTo === props.id).length > 0 &&
                             <button 
                                disabled={replyDisabled && "+true"}
                                className="show-replies" 
                                onClick={toggleReplies}>hide replies
                            </button>}
                            <div className={openReplies === true ?`open-reply-chain` : `close-reply-chain`}>
                                {update && 
                                props.comments && 
                                props.comments.map(comment => comment.unique === props.unique && comment.type === "reply" &&

                                    <div className="reply" key={nanoid()}> 
                                        <Comment 
                                            comment={comment.body}
                                            createdAt={comment.createdAt}
                                            approval={comment.approval} 
                                            disapproval={comment.disapproval}
                                            username={comment.username}
                                            uid={comment.uid}
                                            id={comment.id}
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
                            </div>
                            {/* ############################################################ */}
                            {props.type === "comment" 
                            && !update
                            && replyChain.length > 0 && <button disabled={replyDisabled && "+true"} className="show-replies" onClick={toggleReplies}> - show replies -</button>
                            }
                        </div>
                    </div>
                </div>
            </div>
        </div>
    )
}       