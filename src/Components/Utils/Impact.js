import { getAuth } from "firebase/auth";
import {
  arrayRemove,
  arrayUnion,
  doc,
  getFirestore,
  updateDoc,
} from "firebase/firestore";
import React, { useState } from "react";

export default function Impact(props) {
  const auth = getAuth();
  const db = getFirestore();

  const [approveImpactSelected, setApproveImpactSelected] = useState(false);
  const [disapproveImpactSelected, setDisapproveImpactSelected] =
    useState(false);

  const approves = props.approval.length;
  const disapproves = props.disapproval.length;

  function updateApprove(e) {
    e.preventDefault();
    // e.stopPropagation();
    const docRef = doc(db, "comments", props.id);
    if (!props.approval.includes(auth.currentUser.uid)) {
      updateDoc(docRef, {
        approval: arrayUnion(auth.currentUser.uid),
        disapproval: arrayRemove(auth.currentUser.uid),
      }).then(() => {
        setApproveImpactSelected(true);
        setDisapproveImpactSelected(false);
        console.log("approved");
      });
    } else {
      updateDoc(docRef, {
        approval: arrayRemove(auth.currentUser.uid),
      }).then(() => {
        setApproveImpactSelected(false);
      });
    }
  }
  function updateDisapprove(e) {
    e.preventDefault();
    // e.stopPropagation();
    const docRef = doc(db, "comments", props.id);
    if (!props.disapproval.includes(auth.currentUser.uid)) {
      updateDoc(docRef, {
        approval: arrayRemove(auth.currentUser.uid),
        disapproval: arrayUnion(auth.currentUser.uid),
      }).then(() => {
        setDisapproveImpactSelected(true);
        setApproveImpactSelected(false);
        console.log("disapproved");
      });
    } else {
      updateDoc(docRef, {
        disapproval: arrayRemove(auth.currentUser.uid),
      }).then(() => {
        setDisapproveImpactSelected(false);
      });
    }
  }
  // if uid in approval then add class 'voteCasted'
  const approveImpactClass = approveImpactSelected
    ? "approve-impact-selected"
    : "";
  // if uid in disapproval then add class 'votedCasted'
  const disapproveImpactClass = disapproveImpactSelected
    ? "disapprove-impact-selected"
    : "";
  return (
    <div className="rate-chatMessage">
      <p
        className={`hidden-impact ${
          props.approval.includes(auth.currentUser.uid) &&
          `hidden-impact-bright`
        } ${approveImpactClass}`}
        onClick={updateApprove}
      >
        👍
      </p>
      {approves > 0 && <span className="numImpact">{approves}</span>}
      <p
        className={`hidden-impact ${
          props.disapproval.includes(auth.currentUser.uid) &&
          `hidden-impact-bright`
        } ${disapproveImpactClass}`}
        onClick={updateDisapprove}
      >
        👎
      </p>
      {disapproves > 0 && <span className="numImpact">{disapproves}</span>}
    </div>
  );
}
