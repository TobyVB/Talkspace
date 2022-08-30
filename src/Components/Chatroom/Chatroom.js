import React from "react";
import firebase from 'firebase/compat/app';
import { useCollectionData } from 'react-firebase-hooks/firestore';

import SignIn from './SignIn.js';
import ChatMessage from "./ChatMessage.js";
import SendMessage from "./SendMessage.js";



export default function Chatroom() {
    const auth = firebase.auth();
    const firestore = firebase.firestore();
    const dummy = React.useRef();
    const messagesRef = firestore.collection('messages');
    const query = messagesRef.orderBy('createdAt').limit(25);
    const [messages] = useCollectionData(query, { idField: 'id' });
    
    function handleScroll(){
      return (dummy.current.scrollIntoView({ behavior: 'smooth' }));
    }

    return (
    <>
      <main>
        <p className="endOfChat">beginning of chat</p>
        {messages && messages.map(msg => <ChatMessage key={msg.id} message={msg} />)}
        <span ref={dummy}></span>
        <p className="endOfChat">end of chat</p>
      </main>
      {!auth.currentUser && <SignIn />}
      <SendMessage handleScroll={handleScroll} />
    </>
    )
  }