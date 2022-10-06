import React, {useState, useEffect} from "react";
import {getAuth} from 'firebase/auth';
import {collection, getFirestore, addDoc,
     serverTimestamp, onSnapshot, updateDoc,
      query, orderBy,
      doc
} from 'firebase/firestore'


export default function SendMessage(props){
    // console.log(props.userData)
    const auth = getAuth();
    const db = getFirestore();
    const messagesRef = collection(db, 'messages');
    const [formValue, setFormValue] = useState('');

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


    function sendMessage(e){
        e.preventDefault()
        addDoc(messagesRef, {
            text: formValue,
            uid: auth.currentUser.uid,
            username: currentUser.username,
            approval: [],
            disapproval: [],
            createdAt: serverTimestamp(),
            defaultPic: currentUser.defaultPic
        })
        .then(() => {
            setFormValue('');
        })
        // creating id field and adding doc's id to it
        .then(() => {
            const q = query(messagesRef, orderBy('createdAt'))
            onSnapshot(q, (snapshot) => {
                let messages = []
                snapshot.docs.forEach((doc) => {
                    messages.push({ ...doc.data(), id: doc.id })
                    // console.log(messages)
                })
                // if time stamp is same
                messages.forEach((message) => {
                    const docRef = doc(db, 'messages', message.id)
                    updateDoc(docRef, {
                        id: message.id
                    })
                    // console.log("it worked "+docRef)
                })
            })
        })
    }

    return (
        <>
        {auth.currentUser && 
            <form className="chat-message-form" onSubmit={sendMessage}>
                <textarea className="sendChatMessageInput" 
                    autoFocus
                    rows={2}
                    cols={120} 
                    value={formValue} 
                    onChange={(event) => setFormValue(event.target.value)} 
                    placeholder="compose message" />
                <button 
                    className="sendChatMessage-btn" 
                    type="submit" 
                    disabled={!formValue}
                >send</button>
            </form>
        }
        </>
    )
}