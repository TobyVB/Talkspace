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
import ViewOtherProfile from './Components/ViewOtherProfile';
import CreatePost from './Components/CreatePost.js';
import ViewPost from './Components/ViewPost.js';
import ViewEditPost from './Components/ViewEditPost.js';

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
      setPage(1);
      auth.signOut();
      setAllowLogin(true);
      // setuserData('');
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
          if(auth.currentUser && user.uid === auth.currentUser.uid){
            setuserData(user)
            console.log("boinga")
          }
        })
      })
      console.log("user has been updated from app.js")
      setAllowLogin(false)
    }
  }
  updateAccess()
  // useEffect(()=> {
  //   console.log(userData.username)
  // }, [userData])

  const [notifyWindow, setNotifyWindow] = useState(false)
  function toggleNotifyWindow(){
    setNotifyWindow(prevNotifyWindow => !prevNotifyWindow);
  }
  
  const viewHome = 1;
  const viewRegister = 2;
  const viewLogin = 3;
  const viewProfile = 4;
  const viewOtherProfile = 5;
  const viewCreatePost = 6;
  const viewPost = 7;
  const viewEditPost = 8;
  const [page, setPage] = useState(1);
  function startViewHome(){
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
  const [updateReadyGo, setUpdateReadyGo] = useState(false)
  function updateReady(){
    setUpdateReadyGo(true)
    updateAccess();
  }
  useEffect(() => {
    if( updateReadyGo === true ){
      console.log('userData.aboutMe: '+userData.aboutMe);
      startViewHome();
      setUpdateReadyGo(false)
    }
  }, [updateReadyGo])
  function startViewOtherProfile(){
    setPage(5);
  }
  function startViewCreatePost(){
    setPage(6);
  }
  function startViewPost(){
    setPage(7);
  }
  function startViewEditPost(){
    setPage(8);
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
  const [navToggle, setNavToggle] = useState(false)
  function showMenu(){
    setUseNavClassNone(prev => !prev);
    setNavToggle(prev => !prev)
  }
  function hideMenu(){
    setUseNavClassNone(true);
    setNavToggle(false)
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
    // console.log("this is the postId I'm grabbing! "+e)
    startViewPost()
  }
// ############################################################
  const [capturedUnique, setCapturedUnique] = useState("");
  const sendUnique = (e) => {
    setCapturedUnique(e)
  }

  const [currentCommentId, setCurrentCommentId] = useState("");
  const sendCurrentCommentId = (e) => {
    setCurrentCommentId(e)
    console.log("what do we have here from App.js: "+e)
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
      <header onMouseLeave={hideMenu}>
        <div className={`header ${navToggle && `header-toggle`}`}>
          <div className="nav-title"><p>The</p><h1 onClick={startViewHome}>TalkSpace</h1></div>
          <button className="bell" onClick={toggleNotifyWindow}>🛎
            <span className="notification-num"> {notifications && auth.currentUser &&
              notifications.filter(notification => auth.currentUser.uid === notification.to).length > 0 && 
              notifications.filter(notification => auth.currentUser.uid === notification.to).length}
            </span>
          </button>
          <button className="showNav" onClick={showMenu}>menu</button>
        </div>
        <div className={`login-header-buttons  ${navClassNone}`}>
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
        sendCurrentCommentId={sendCurrentCommentId}
        notifications={notifications}
      />}

        {/* PROFILE */}
      {auth.currentUser && page === viewProfile 
      && <ViewProfile username={userData.username} 
        defaultPic={userData.defaultPic}   
        defPicLoc={userData.defPicLoc}
        aboutMe={userData.aboutMe}
        updatePage={startViewPost}
        sendPostId={sendPostId}
        userData={userData}
        id={userData.id} 
        signout={exit}/>}

        {/* HOMEPAGE */}
      {page === viewHome 
      && <Homepage 
        updatePage={startViewPost}
        sendPostId={sendPostId}
        goToProfile={startViewProfile}
        sendUserId={sendUID}
      />}

        {/* LOGIN */}
      {!auth.currentUser && page === viewLogin 
      && <Login 
        updateReady={updateReady}
      />}

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
      && <ViewPost 
        capturedPostId={capturedPostId}
        // username={userData.username} 
        // defaultPic={userData.defaultPic}
        sendUID={sendUID}
        capturedUnique={capturedUnique}
        setCapturedUnique={setCapturedUnique}
        currentCommentId={currentCommentId}
        setCurrentCommentId={setCurrentCommentId}
        userDataId={userData.id}
        editPost={startViewEditPost}
      />}

      {/* VIEW EDIT POST */}
      {auth.currentUser && page === viewEditPost
      && <ViewEditPost 
        capturedPostId={capturedPostId}
        cancel={startViewPost}
      />}
      <div className="footer">
        <h3 className='footer-email'>tobcvb@gmail.com 2022</h3>
      </div>
    </div>
  );
}

export default App;
