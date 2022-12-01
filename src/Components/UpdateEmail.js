// import { getAuth, updateEmail, sendEmailVerification } from "firebase/auth";
// import { doc, getFirestore, updateDoc
// } from "firebase/firestore";
// import React, { useState } from "react";

// export default function UpdateEmail(props){
//     const db = getFirestore();
//     const auth = getAuth();
//     const [email, setEmail] = useState("")

//     const [emailChanged, setEmailChanged] = useState(false)
//     async function updateUser(){
//         const docRef = doc(db, 'users', props.userData.id)
//         await updateDoc(docRef, {
//             email: email
//         })
//         setEmailChanged(true)
//         updateEmail(auth.currentUser, email)
//         .then(() => {
//             sendEmailVerification(auth.currentUser)
//             .then(() => {
//                 console.log('verification sent')
//             });
//         })
//         .then(() => {
//             updateUser();
//         }).catch((error) => {
//             console.log(error)
//         });
//     }

//     return (
//         <div className="page-body settings">
//             <h1>Update Email</h1>
//             <button onClick={props.cancel}>cancel</button>
//             <input
//                 onChange={(event) => setEmail(event.target.value)}
//                 placeholder="enter new email"
//                 value={email}
//             />
//             <button onClick={updateUser}>update</button>
//             {emailChanged && <p>email has been changed to: </p>}
//             {emailChanged && <p>{email}</p>}
//         </div>
//     )
// }
