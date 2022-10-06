import './App.css';
import {useEffect, useState} from 'react';
import {initializeApp} from 'firebase/app';
import {getAuth} from 'firebase/auth';
import {getFirestore, onSnapshot,
   collection, query, orderBy
} from 'firebase/firestore';
import {useCollectionData} from "react-firebase-hooks/firestore";
import { useAuthState } from 'react-firebase-hooks/auth';

import {getStorage} from "firebase/storage";

import Notifications from './Components/Notifications';
import Homepage from "./Components/Homepage.js";
import ViewProfile from './Components/ViewProfile.js';
import Login from './Components/Login.js';
import Register from './Components/Register.js';
import Chatroom from "./Components/Chatroom.js";
import ViewOtherProfile from './Components/ViewOtherProfile';
import CreatePost from './Components/CreatePost.js';
import ViewPost from './Components/ViewPost.js';

const firebaseConfig = {
  apiKey: "AIzaSyCXgrZdHQUbrEgrjTi71-Mc80WK0Ibj3zk",
  authDomain: "fir-practice-cace4.firebaseapp.com",
  projectId: "fir-practice-cace4",
  storageBucket: "fir-practice-cace4.appspot.com",
  messagingSenderId: "732318855377",
  appId: "1:732318855377:web:427b3c2f42cf708aaf15f0",
  measurementId: "G-Z5W900LJ0J"
};
// initializeApp(firebaseConfig);
const app = initializeApp(firebaseConfig);
export const storage = getStorage(app);
const auth = getAuth();
const db = getFirestore();

function App() {
  useAuthState(auth);

  function exit(){
      setPage(0);
      auth.signOut();
      setAllowLogin(true)
  }
  function SignOut(){
    return auth.currentUser && (
      <button className="nav-btn" onClick={exit}>Sign Out</button>
    )
  }

  const [userData, setuserData] = useState('');
  const [allowLogin, setAllowLogin] = useState(true)

  function updateAccess(){
    if(auth.currentUser && allowLogin === true){
      const usersRef = collection(db, 'users');
      const q = query(usersRef, orderBy('createdAt'))
      onSnapshot(q, (snapshot) => {
        let users = []
        snapshot.docs.forEach((doc) => {
        users.push({ ...doc.data()})
        })
        users.forEach(user => {
          if(user.uid === auth.currentUser.uid){
            setuserData(user)
          }
        })
      })
      setAllowLogin(false)
    }
  }

  // user alerts/notifications
  // show bell icon at navbar, when clicked show alerts/notifications
  // if any alerts/notification, there will be a number of the amount of
  // missed alerts there are. There will also be a chime each time a new one
  // is recieved.

  // New doc under notication collection will be created.
  //  there will be a "to" field, which will store the users doc id, rather than uid
  //  there will be a "from" field, which will store the notification initiator if there
  //  is one. For example; a commentor, replier, follower, poster (if you're following)...
  //  there will be a "type" field, this can be 'reply', 'comment', 'followed', etc
  
  // I can look through all notifications, and grab all the onces that are "to" the currentUser
  // Would do this on every state change in app.js...


  const [notifyWindow, setNotifyWindow] = useState(false)
  function toggleNotifyWindow(){
    setNotifyWindow(prevNotifyWindow => !prevNotifyWindow);
  }

  
  updateAccess();
  const viewHome = 0;
  const viewChatroom = 1;
  const viewRegister = 2;
  const viewLogin = 3;
  const viewProfile = 4;
  const viewOtherProfile = 5;
  const viewCreatePost = 6;
  const viewPost = 7;
  const [page, setPage] = useState(0);
  function startViewHome(){
    setPage(0);
  }
  function startViewChatroom(){
    // put update access here, because this is the first 
    // location user moves to after logging in or Registering.
    updateAccess();
    setPage(1);
  }
  function startViewRegister(){
    setPage(2);
  }
  function startViewLogin(){
    setPage(3)
  }
  function startViewProfile(){
    setPage(4);
  }
  function startViewOtherProfile(){
    setPage(5);
  }
  function startViewCreatePost(){
    setPage(6);
  }
  function startViewPost(){
    setPage(7);
  }
  const [startUp, setStartUp] = useState(false)
  function restartPage(){
    setPage(99);
    setStartUp(true)
  }
  useEffect(() => {
    if(startUp === true){
      startViewPost();
      setStartUp(false);
    }
  }, [startUp])

  const [useNavClassNone, setUseNavClassNone] = useState(true) 
  const navClassNone = useNavClassNone? "none": ""

  function showMenu(){
    setUseNavClassNone(false);
  }
  function hideMenu(){
    setUseNavClassNone(true);
  }
  


  const [capturedUID, setCapturedUID] = useState("");
  const sendUID = (e) => {
    setCapturedUID(e);
    startViewOtherProfile();
  }
// ############################################################
  const [capturedPostId, setCapturedPostId] = useState("");
  const sendPostId = (e) => {
    setCapturedPostId(e);
    console.log("this is the postId I'm grabbing! "+e)
    startViewPost()
  }
// ############################################################
  const [capturedUnique, setCapturedUnique] = useState("");
  const sendUnique = (e) => {
    setCapturedUnique(e)
  }

  if(page !== 7){sessionStorage.clear();}

  const notificationsRef = collection(db, 'notifications');
  const notifyQ = query(notificationsRef, orderBy('createdAt'));
  const [notifications] = useCollectionData(notifyQ, {
        createdAt: 'createdAt',
        unique: 'unique',
        to: 'to',
        from: 'from',
        type: 'type',
        message: 'message',
        postId: 'postId'
  })


  return (
    <div className="App">
      <header>
        <div className="header">
          <h1 onClick={startViewHome}>TalkSpace</h1>
          <button className="bell" onClick={toggleNotifyWindow}>🛎<span className="notification-num">{notifications && notifications.length > 0 && notifications.length}</span></button>
          <button className="showNav" onClick={showMenu}>menu</button>
        </div>
        <div className={`login-header-buttons  ${navClassNone}`}
          onMouseLeave={hideMenu}>
          {!auth.currentUser &&
          <>
            <button 
              className="nav-btn" 
              disabled={page === viewLogin ? "+true" : ""} 
              onClick={startViewLogin}
            >Login</button>
            <button 
              className="nav-btn" 
              disabled={page === viewRegister ? "+true" : ""} 
              onClick={startViewRegister}
            >Register</button>
          </>
          }
          {auth.currentUser && 
          <>
            <button 
              className="nav-btn" 
              disabled={page === viewProfile ? "+true" : ""} 
              onClick={startViewProfile}
            >Profile</button>
            <button 
              className="nav-btn" 
              disabled={page === viewChatroom ? "+true" : ""} 
              onClick={startViewChatroom}
            >Chatroom</button>
            <button className="nav-btn">
              Settings
            </button>
            <button 
              className="nav-btn" 
              disabled={page === viewCreatePost ? "+true" : ""} 
              onClick={startViewCreatePost}
            >Create Post</button>
          </>
          }
          {auth.currentUser && <SignOut />}
        </div>
      </header>
    
      <section>
        {/* NOTIFICATIONS */}
      {notifyWindow 
      && <Notifications 
        toggleNotifyWindow={toggleNotifyWindow} 
        uid={auth.currentUser.uid} 
        sendPostId={sendPostId}
        toPost={startViewPost}
        restartPage={restartPage}
        sendUnique={sendUnique}
      />}

        {/* PROFILE */}
      {auth.currentUser && page === viewProfile 
      && <ViewProfile username={userData.username} 
        defaultPic={userData.defaultPic}   
        defPicLoc={userData.defPicLoc}
        aboutMe={userData.aboutMe}
        updatePage={startViewPost}
        sendPostId={sendPostId}

        id={userData.id} 
        signout={exit}/>}

        {/* CHATROOM */}
      {auth.currentUser && page === viewChatroom 
      && <Chatroom username={userData.username} 
        defaultPic={userData.defaultPic}
        sendUID={sendUID}/>}

        {/* HOMEPAGE */}
      {page === viewHome 
      && <Homepage />}

        {/* HOME */}
      {!auth.currentUser && page === viewLogin 
      && <Login 
        updatePage={startViewProfile} />}

        {/* REGISTER */}
      {!auth.currentUser && page === viewRegister 
      && <Register updatePage={startViewProfile}/>}
      </section>

        {/* OTHERS PROFILE */}
      {auth.currentUser && page === viewOtherProfile
      && <ViewOtherProfile 
        capturedUID={capturedUID} 
        updatePage={startViewPost}
        sendPostId={sendPostId}
      />}

        {/* CREATE POST */}
      {auth.currentUser && page === viewCreatePost
      && <CreatePost 
        updatePage={startViewPost} 
        sendPostId={sendPostId}
      />}

        {/* VIEW POST */}
      {auth.currentUser && page === viewPost 
      && <ViewPost capturedPostId={capturedPostId}
        username={userData.username} 
        defaultPic={userData.defaultPic}
        sendUID={sendUID}
        capturedUnique={capturedUnique}
        setCapturedUnique={setCapturedUnique}
      />}
      <div className="footer">
        <h3>tobcvb@gmail.com 2022</h3>
      </div>
    </div>
  );
}

export default App;
