import {getAuth} from 'firebase/auth'
import {arrayRemove, arrayUnion, doc,
   getFirestore, updateDoc
} from 'firebase/firestore'
import React from 'react';


export default function Impact(props){

    const auth = getAuth();
    const db = getFirestore()
    const { text, uid, username} = props.message;
    const messageClass = auth.currentUser 
      ? uid === auth.currentUser.uid 
        ? 'sent' : 'received' 
      : 'received';

    const [approveImpactSelected, setApproveImpactSelected] = React.useState(false);
    const [disapproveImpactSelected, setDisapproveImpactSelected] = React.useState(false);

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

    return (
        <div className="rate-chatMessage">
            <p className={`hidden-impact ${approveImpactClass}`} 
                onClick={updateApprove}>👍</p>
            <p className={`hidden-impact ${disapproveImpactClass}`} 
                onClick={updateDisapprove}>👎</p>
            <p className="impact-metrics hidden-impact">📊</p>
            <p className="impact-metrics hidden-impact" 
                onClick={removeImpact}>🚫</p>
        </div>
    )
}