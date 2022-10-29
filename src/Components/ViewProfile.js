import Clock from './Utils/Clock.js';
import { getFirestore, query, orderBy, 
    onSnapshot, collection
} from "firebase/firestore";
import { useCollectionData } from 'react-firebase-hooks/firestore';
import { getAuth } from "firebase/auth";
import React, {useEffect, useState} from "react";
export default function ViewProfile(props){
    const db = getFirestore();
    const auth = getAuth();
    const usersRef = collection(db, 'users');
    const [currentUser, setCurrentUser] = useState("")
    const [image, setImage] = useState(null);
    const [objURL, setObjURL] = useState("")

    useEffect(() => {
        window.scrollTo(0, 0)
    }, [])

    // ########## A C C E S S   C U R R E N T   U S E R'S   D O C ##########
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

    // ########## F I N D   U S E R'S   P O S T  D O C S ##########
    const postsRef = collection(db, 'posts');
    const qPosts = query(postsRef, orderBy('createdAt'));
    const [posts] = useCollectionData(qPosts, { 
      createdAt: 'createdAt', 
      idField: 'id', 
      title: 'title',
      uid: `uid`
    });

    function viewPost(e){
        props.updatePage()
        props.sendPostId(e)
    }

    function Post(props){
        return (
            <p 
                className="post-link"
                onClick={() => viewPost(props.id)}
            >{props.title}
            </p>
        )
    }

    return (
        <div className="profile page-body">
            <button className="edit-user-btn" onClick={props.editProfile}>edit profile</button>
            <h2 
            className="profile-header-text">{`${currentUser.username}`}
            </h2>
            <div className="profile-jumbotron">
                <img 
                    alt="profile" 
                    className="edit-profile-picture" 
                    src={image!==null?objURL:currentUser.defaultPic}
                /> 
                <div className='profile-info-section'>
                    <div className='flex'>
                        <p>user since: </p>
                        <Clock createdAt={currentUser.createdAt}/>
                    </div>     
                    <hr></hr>
                    <p>
                        {`${currentUser.aboutMe !== undefined? currentUser.aboutMe: ""}`}
                    </p>
                </div>
            </div>
            <div className="profile-post-sections">
                <div>
                    <h3>{`${currentUser.username}'s posts`}</h3>
                    <div className="foundUser-posts">
                        {posts && posts.filter(post => post.uid === currentUser.uid).length < 1 && "... No posts to show"}
                        {posts && posts.map(post => post.uid === currentUser.uid && <Post id={post.id} key={post.id} title={post.title}/>)}
                    </div>
                </div>
                <div>
                    <h3>Liked Posts</h3>
                    <div className="foundUser-posts">
                        {posts && posts.filter(post => post.follows.includes(currentUser.id)).length < 1 && "... No posts to show"}
                        {posts && posts.map(post => post.follows.includes(currentUser.id)  && <Post id={post.id} key={post.id} title={post.title}/>)}
                    </div>
                </div>
            </div>
        </div>
    )
}
