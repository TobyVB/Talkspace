import { doc, getFirestore,
    updateDoc, query, orderBy,
    onSnapshot, collection
} from "firebase/firestore";
import {getAuth} from "firebase/auth";

import React, {useEffect, useState} from "react";


export default function ChangeUsername(props){
    const db = getFirestore();
    const auth = getAuth();
    const usersRef = collection(db, 'users');
    const [currentUser, setCurrentUser] = useState("")

    useEffect(() => {
        const q = query(usersRef, orderBy('createdAt'))
        onSnapshot(q, async (snapshot) => {
            snapshot.docs.forEach(doc => {
                if(doc.data().uid === auth.currentUser.uid){
                    setCurrentUser({ ...doc.data(), id: doc.id})
                }
            })
        })
    },[])

    const [usernameChanged, setUsernameChanged] = useState(false)
    const [username, setUsername] = useState("")
    // ########## U P D A T E   U S E R ##########
    async function updateUser(){
        const docRef = doc(db, 'users', currentUser.id)
        await updateDoc(docRef, {
            username: username
        })
        setUsernameChanged(true)
    }

    
    
    return (
        <div className="page-body change-username">
            <h1>Change Username</h1>
            <button onClick={props.cancel}>cancel</button>
            <input 
                onChange={(event) => setUsername(event.target.value)}
                placeholder="enter new username"
                value={username}
            />
            <button onClick={updateUser}>update</button>
            {usernameChanged && <p>Username has been changed to: </p>}
            {usernameChanged && <p>{username}</p>}
        </div>
    )
}