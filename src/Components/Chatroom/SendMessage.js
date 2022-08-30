import firebase from 'firebase/compat/app';
import React, {useState} from "react";


export default function SendMessage({handleScroll}){
    const firestore = firebase.firestore();
    const auth = firebase.auth();
    const messagesRef = firestore.collection('messages');
    const [formValue, setFormValue] = useState('');


    const sendMessage = async (event) => {
        event.preventDefault();
        const { uid, photoURL } = auth.currentUser;
        await messagesRef.add({
          text: formValue,
          createdAt: firebase.firestore.FieldValue.serverTimestamp(),
          uid,
          photoURL,
          nickname: localStorage.getItem('nickname')
        })
        setFormValue('');
        handleScroll();
    }

    return (
        <>
        {auth.currentUser && 
            <form onSubmit={sendMessage}>
                <input value={formValue} onChange={(event) => setFormValue(event.target.value)} placeholder="compose message" />
                <button className="sendChatMessage" type="submit" disabled={!formValue}>📧</button>
            </form>
        }
        </>
    )
}