import './App.css';

import Chatroom from "./Components/Chatroom/Chatroom.js";

import {React, useState, useEffect, useRef} from "react";

import { useAuthState } from 'react-firebase-hooks/auth';
import { useCollectionData } from 'react-firebase-hooks/firestore';


import firebase from 'firebase/compat/app';
import 'firebase/compat/auth';
import 'firebase/compat/firestore';

import './firebase-config.js';


const auth = firebase.auth();
const firestore = firebase.firestore();

function App() {
  const [user] = useAuthState(auth);

  function SignOut(){
    return auth.currentUser && (
      <button onClick={() => auth.signOut()}>Sign Out</button>
    )
  }


  return (
    <div className="App">
      <header>
        <h1>TalkSpace</h1>
        <SignOut />
      </header>
      <section>
        <Chatroom />
      </section>
    </div>
  );
}

export default App;
