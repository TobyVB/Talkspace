import React, {useEffect, useState} from "react";
import { useCollectionData } from 'react-firebase-hooks/firestore';
import { query, orderBy, onSnapshot, 
    collection, getFirestore 
} from "firebase/firestore";
// import { updateCurrentUser } from "firebase/auth";

export default function ViewOtherProfile(props){

    const db = getFirestore();
    


    // FIND THE USER DOC
    const usersRef = collection(db, 'users');
    const [foundUser, setFoundUser] = useState("")
    useEffect(() => {
        const q = query(usersRef, orderBy('createdAt'))
        onSnapshot(q, async (snapshot) => {
            snapshot.docs.forEach((doc => {
                if(doc.data().uid === props.capturedUID){
                    setFoundUser({ ...doc.data(), id: doc.id})
                }
            }))
        })
    },[])


    const [filterOn, setFilterOn] = useState(false)
    // FIND THE POST DOC
    const postsRef = collection(db, 'posts');
    const [foundPosts, setFoundPosts] = useState("")
    useEffect(() => {
        const q = query(postsRef, orderBy('createdAt'))
        onSnapshot(q, async (snapshot) => {
            snapshot.docs.forEach((doc => {
                if(doc.data().uid === foundUser.uid){
                    setFoundPosts({ ...doc.data(), id: doc.id})
                }
            }))
        })
        setFilterOn(true)
    },[foundUser])

    const q = query(postsRef, orderBy('createdAt'));
    const [posts] = useCollectionData(q, { 
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
            <>
                <p 
                    className="post-link"
                    onClick={() => viewPost(props.id)}
                >{props.title}</p>
                <hr></hr>
            </>
        )
    }

    return (
        <div className="profile page-body">
            <h1 
                className="profile-header-text"
                >{`${foundUser.username}'s page`}
            </h1>
            <div className="profile-jumbotron">
                <img 
                    alt="profile" 
                    className="profile-picture" 
                    src={foundUser.defaultPic}
                /> 
                <p>
                    {foundUser.aboutMe}
                </p>
            </div>
            <div className="foundUser-posts">
                <h3>POSTS</h3>
                <hr></hr>
                {posts && posts.map(post => post.uid === foundUser.uid && <Post id={post.id} key={post.id} title={post.title}/>)}
            </div>

        </div>
    )
}