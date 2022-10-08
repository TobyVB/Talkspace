import {getAuth} from 'firebase/auth'
import {arrayRemove, arrayUnion, doc,
   getFirestore, updateDoc
} from 'firebase/firestore'
import React from 'react';
import Clock from "../src/Components/Utils/Clock.js";



export default function ChatMessage(props) {
    const auth = getAuth();
    const db = getFirestore()
    const { text, uid, username } = props.message;
    const messageClass = auth.currentUser 
      ? uid === auth.currentUser.uid 
        ? 'sent' : 'received' 
      : 'received';

    const [impactVisible, setImpactVisible] = React.useState(false);
    const [approveImpactSelected, setApproveImpactSelected] = React.useState(false);
    const [disapproveImpactSelected, setDisapproveImpactSelected] = React.useState(false);


    function showImpact(){
      setImpactVisible(prevImpactVisible => {
        return !prevImpactVisible
      });
    }
    function hideImpact(){
      setImpactVisible(false);
    }
  
    function updateApprove(e){
      e.stopPropagation();
      const docRef = doc(db, 'messages', props.id)
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
      const docRef = doc(db, 'messages', props.id)
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
      const docRef = doc(db, 'messages', props.id)
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

    return (
      <div>
        <div className="container-main" onMouseLeave={hideImpact} onClick={showImpact}>
          {/* ----------- NAME, PIC, & IMPACT ------------ */}
          <div className={`container-full-header ${messageClass}`}>
            <div className={`container-chat-header ${messageClass}`}>
              <img className="chat-message-pic" 
                alt="user" 
                src={props.message.defaultPic}
                onClick={() => props.sendUID(props.message.uid)} />
              <p className="name">{username}</p>
              {headCount > 1 
                &&<p className="headCount">👥</p>}{headCount > 1 
                  &&<span className="numImpact">{headCount}</span>}
              {approves > disapproves 
                && <p className="approve">👍</p>}{approves > 1 
                  &&<span className="numImpact">{approves}</span>}
              {disapproves > approves 
                && <p className="disapprove">👎</p>} {disapproves > 1 
                  &&<span className="numImpact">{disapproves}</span>}
            </div>
              {/* -------------- HIDDEN IMPACT ------------- */}
              {impactVisible &&
            <div className="rate-chatMessage">
                <p className={`hidden-impact ${approveImpactClass}`} 
                  onClick={updateApprove}>👍</p>
                <p className={`hidden-impact ${disapproveImpactClass}`} 
                  onClick={updateDisapprove}>👎</p>
                <p className="impact-metrics hidden-impact">📊</p>
                <p className="impact-metrics hidden-impact" 
                  onClick={removeImpact}>🚫</p>
            </div>
              }
          </div> 
          {/* ---------------- TEXT ----------------- */}
          <div className={`container-full-chat-text ${messageClass}`}>
            <div className={`container-chat-text ${messageClass}`}>
              <p className="chat-text">{text}</p>
            </div>
            <Clock messageClass={messageClass} createdAt={props.createdAt}/>
          </div>
        </div>
        <hr className={`${messageClass}`}/>
      </div>
    )
  }
  
  
  