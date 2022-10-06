import React, { useState, useRef } from "react";
import { useCollectionData } from 'react-firebase-hooks/firestore';
import { getFirestore, collection, query,
   orderBy, doc, deleteDoc 
} from "firebase/firestore";
import {getAuth} from 'firebase/auth'

import ChatMessage from "./ChatMessage.js";
import SendMessage from "./SendMessage.js";


export default function Chatroom(props) {
    const db = getFirestore()
    // const auth = getAuth();
    // const dummy = React.useRef();
    const messagesRef = collection(db, 'messages');
    const q = query(messagesRef, orderBy('createdAt'));
    const [messages] = useCollectionData(q, { 
      createdAt: 'createdAt', 
      idField: 'id', 
      approval: 'approval', 
      disapproval: 'disapproval', 
      username: 'username' 
    });
    
    const scrollTarget = useRef();
    const scrollingTop = (event) => {
      const elmnt = scrollTarget;
      elmnt.current.scrollIntoView({
        behavior: "smooth",
        block: "center",
        inline: "start"
      });
    };
    setTimeout(()=> {
      scrollingTop()
      removeMessage()
    }, 200)

    // if more than 20 chat messages delete oldest message
    // console.log(`# of messages: ${messages.length}`)
    // console.log(`first message ${messages[0].username}`)
    
    function removeMessage(){
      if(messages){
        if(messages.length > 20){
          console.log("trying to delete messages")
          const docRef = doc(db, 'messages', messages[0].id)
          deleteDoc(docRef)
          .then(() => {
            console.log("message(s) removed")
          })
        }
      }
    }

    return (
    <>
      <div className="chatroom page-body">
        <h1>Chatroom!</h1>
        <div className="chatbox">
          <main>
            <p className="endOfChat">beginning of chat...</p>
              <div className="chatMessages">
                {messages && messages.map(msg => <ChatMessage 
                  defaultPic={msg.defaultPic}
                  key={msg.id} 
                  message={msg} 
                  id={msg.id} 
                  approval={msg.approval} 
                  disapproval={msg.disapproval} 
                  createdAt={msg.createdAt}
                  sendUID={props.sendUID}
                  />)}
              </div>
              <span ref={scrollTarget}></span>
            <p className="endOfChat">...end of chat</p>
          </main>
          <SendMessage />
        </div>
      </div>
    </>
    )
  }