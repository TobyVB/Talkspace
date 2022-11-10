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

import Notifications from './Components/Notifications.js';
import Settings from './Components/Settings.js';
import Homepage from "./Components/Homepage.js";
import ViewProfile from './Components/ViewProfile.js';
import ViewEditProfile from './Components/ViewEditProfile.js';
import Login from './Components/Login.js';
import Register from './Components/Register.js';
import ViewOtherProfile from './Components/ViewOtherProfile';
import CreatePost from './Components/CreatePost.js';
import ViewPost from './Components/ViewPost.js';
import ViewEditPost from './Components/ViewEditPost.js';
// settings
import ChangeUsername from './Components/ChangeUsername.js';
// import UpdateEmail from './Components/UpdateEmail.js';
import RetrievePassword from './Components/RetrievePassword.js';
import ChangePassword from './Components/ChangePassword.js';
import DeleteAccount from './Components/DeleteAccount.js';

const firebaseConfig = {
  apiKey: "AIzaSyCXgrZdHQUbrEgrjTi71-Mc80WK0Ibj3zk",
  authDomain: "fir-practice-cace4.firebaseapp.com",
  projectId: "fir-practice-cace4",
  storageBucket: "fir-practice-cace4.appspot.com",
  messagingSenderId: "732318855377",
  appId: "1:732318855377:web:427b3c2f42cf708aaf15f0",
  measurementId: "G-Z5W900LJ0J"
};
const app = initializeApp(firebaseConfig);
export const storage = getStorage(app);
const auth = getAuth();
const db = getFirestore();

function App() {
  useAuthState(auth);

  function exit(){
      auth.signOut();
      setAllowLogin(true);
  }
  function cancelSignIn(){
    auth.signOut();
      setAllowLogin(true);
  }
  function SignOut(){
    return auth.currentUser && (
      <button 
      className="nav-btn"
      onClick={menuSignOut}
      >Sign Out
    </button>
    )
  }
  const [userData, setuserData] = useState('');
  const [allowLogin, setAllowLogin] = useState(true)

  const [loginCompleted, setLoginCompleted] = useState(false)
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
          }
        })
      })
      console.log("user has been updated from app.js")
      setAllowLogin(false)
      setLoginCompleted(true)
    }
  }
  updateAccess()

  useEffect(() => {
    if(loginCompleted === true){
        if(auth.currentUser && !auth.currentUser.emailVerified){
            verificationReminder()
            auth.signOut();
            setAllowLogin(true);
        }
        setLoginCompleted(false)
    }
  }, [loginCompleted])

  const [notifyWindow, setNotifyWindow] = useState(false)
  function toggleNotifyWindow(){
    setNotifyWindow(prevNotifyWindow => !prevNotifyWindow);
  }
  
  const viewSettings = 0;
  const viewHome = 1;
  const viewRegister = 2;
  const viewLogin = 3;
  const viewProfile = 4;
  const viewOtherProfile = 5;
  const viewCreatePost = 6;
  const viewPost = 7;
  const viewEditPost = 8;
  const viewEditProfile = 9;
  // settings pages
  const viewChangeUsername = 10;
  // const viewUpdateEmail = 11;
  const viewRetrievePassword = 12;
  const viewChangePassword = 13;
  const viewDeleteAccount = 14;

  const [page, setPage] = useState(1);
  function startViewSettings(){
    setPage(0);
  }
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
  function startViewEditProfile(){
    setPage(9);
  }
  // settings start page functions
  function startViewChangeUsername(){
    setPage(10)
  }
  function startViewUpdateEmail(){
    setPage(11)
  }
  function startViewRetrievePassword(){
    setPage(12)
  }
  function startViewChangePassword(){
    setPage(13)
  }
  function startViewDeleteAccount(){
    setPage(14)
  }
  const [startUp, setStartUp] = useState(false)
  function restartPage(){
    setPage(99);
    setStartUp(true)
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

  useEffect(() => {
    if(startUp === true){
      startViewPost();
      setStartUp(false);
    }
  }, [startUp])

  const [useNavClassNone, setUseNavClassNone] = useState(true) 
  const navClassNone = useNavClassNone? "none": ""
  const [navToggle, setNavToggle] = useState(false)

  const [warning, setWarning] = useState(false);
  const [transformWarning, setTransformWarning] = useState(false)
  function verificationReminder(){
    setWarning(true)
    setTimeout(()=> {
      setWarning(false);
      setTransformWarning(false)
    },8000)
    setTimeout(()=> {
      setTransformWarning(true)
    },6000)
  }
  function showMenu(){
    setUseNavClassNone(prev => !prev);
    setNavToggle(prev => !prev)
  }
  function hideMenu(){
    setUseNavClassNone(true);
    setNavToggle(false)
  }
// ############################################################
  const [capturedUID, setCapturedUID] = useState("");
  const sendUID = (e) => {
    setCapturedUID(e);
    startViewOtherProfile();
  }
// ############################################################
  const [capturedPostId, setCapturedPostId] = useState("");
  const sendPostId = (e) => {
    setCapturedPostId(e);
    startViewPost()
  }
// ############################################################
  const [capturedUnique, setCapturedUnique] = useState("");
  const sendUnique = (e) => {
    setCapturedUnique(e)
  }
// ############################################################
  const [currentCommentId, setCurrentCommentId] = useState("");
  const sendCurrentCommentId = (e) => {
    setCurrentCommentId(e)
  }
// ############################################################

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

  function menuHome(){
    startViewHome()
    hideMenu()
  }
  function menuLogin(){
    startViewLogin()
    hideMenu()
  }
  function menuRegister(){
    startViewRegister()
    hideMenu()
  }
  function menuProfile(){
    startViewProfile()
    hideMenu()
  }
  function menuCreatePost(){
    startViewCreatePost()
    hideMenu()
  }
  function menuSettings(){
    startViewSettings()
    hideMenu()
  }
  function menuSignOut(){
    exit()
    setPage(1);
    hideMenu()
  }

  

  return (
    <div className="App">
      {warning && <p className={transformWarning?'warning-text transform-warning':'warning-text'}>user needs to be verified</p>}
      {/* When clicking off header hideMenu */}
      <header >
        <div className={`header ${navToggle && `header-toggle`}`}>
          <div className="nav-title"><p>The</p><h1 onClick={menuHome}>TalkSpace</h1></div>
          <div className='menu-container'>
            <div className={`login-header-buttons  ${navClassNone}`}>
              {!auth.currentUser &&
              <>
                <button 
                  className="nav-btn" 
                  disabled={page === viewLogin ? "+true" : ""} 
                  onClick={menuLogin}
                >Login</button>
                <button 
                  className="nav-btn" 
                  disabled={page === viewRegister ? "+true" : ""} 
                  onClick={menuRegister}
                >Register</button>
              </>
              }
              { auth.currentUser && 
              <>
                <button 
                  className="nav-btn" 
                  disabled={page === viewProfile ? "+true" : ""} 
                  onClick={menuProfile}
                  >Profile
                </button>
                <button 
                  className="nav-btn" 
                  disabled={page === viewCreatePost ? "+true" : ""} 
                  onClick={menuCreatePost}
                  >Create Post
                </button>
                <button 
                  className="nav-btn"
                  disabled={page === viewSettings ? "+true" : ""}
                  onClick={menuSettings}
                  >Settings
                </button>
              </>
              }
              {auth.currentUser && <SignOut />}
            </div>
            <button className="showNav" onClick={showMenu}>menu</button>
            {auth.currentUser && auth.currentUser.emailVerified && <button className="bell" onClick={toggleNotifyWindow}>🛎
              <span className="notification-num"> {notifications && auth.currentUser &&
                notifications.filter(notification => auth.currentUser.uid === notification.to).length > 0 && 
                notifications.filter(notification => auth.currentUser.uid === notification.to).length}
              </span>
            </button>}
            
          </div>  
        </div>
      </header>
    
      <section onClick={hideMenu}>
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

        {/* SETTINGS */}
      {auth.currentUser && page === viewSettings
      && <Settings
        changeUsername={startViewChangeUsername}
        // updateEmail={startViewUpdateEmail}
        retreivePassword={startViewRetrievePassword}
        changePassword={startViewChangePassword}
        deleteAccount={startViewDeleteAccount}
      />}

        {/* PROFILE */}
      {auth.currentUser && page === viewProfile 
      && <ViewProfile username={userData.username} 
        defaultPic={userData.defaultPic}   
        defPicLoc={userData.defPicLoc}
        aboutMe={userData.aboutMe}
        updatePage={startViewPost}
        editProfile={startViewEditProfile}
        sendPostId={sendPostId}
        userData={userData}
        id={userData.id} 
        signout={exit}
      />}

        {/* EDIT PROFILE */}
      {auth.currentUser && page === viewEditProfile
      && <ViewEditProfile  
        cancel={startViewProfile}
        defaultPic={userData.defaultPic}
        defPicLoc={userData.defPicLoc}
        aboutMe={userData.aboutMe}
      />}

        {/* HOMEPAGE */}
      {page === viewHome 
      && <Homepage 
        updatePage={startViewPost}
        sendPostId={sendPostId}
        goToProfile={startViewProfile}
        sendUserId={sendUID}
        verificationReminder={verificationReminder}
      />}

        {/* LOGIN */}
      { !auth.currentUser && page === viewLogin 
      && <Login 
        updateReady={updateReady}
        startViewLogin={startViewLogin}
        setAllowLogin={setAllowLogin}
        verificationReminder={verificationReminder}
        cancelSignIn={cancelSignIn}
      />}

        {/* REGISTER */}
      {!auth.currentUser && page === viewRegister 
      && <Register 
        updatePage={startViewLogin}
        exit={exit}
      />}
  

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

      {/* VIEW CHANGE USERNAME */}
      {auth.currentUser && page === viewChangeUsername
      && <ChangeUsername 
        cancel={startViewSettings}              
      />}

      {/* VIEW UPDATE EMAIL */}
      {/* {auth.currentUser && page === viewUpdateEmail
      && <UpdateEmail 
        cancel={startViewSettings}     
        userData={userData}       
      />} */}

      {/* VIEW RETRIEVE PASSWORD */}
      {auth.currentUser && page === viewRetrievePassword
      && <RetrievePassword
        cancel={startViewSettings}            
      />}

      {/* VIEW RESET PASSWORD */}
      {auth.currentUser && page === viewChangePassword
      && <ChangePassword
        cancel={startViewSettings}            
      />}

      {/* VIEW DELETE ACCOUNT */}
      {auth.currentUser && page === viewDeleteAccount
      && <DeleteAccount
        cancel={startViewSettings}  
        id={userData.id}   
        username={userData.username}  
        updatePage={startViewHome}     
      />}

      </section>

      <div className="footer">
        <h3 className='footer-email'>tobcvb@gmail.com 2022</h3>
      </div>
    </div>
  );
}

export default App;

