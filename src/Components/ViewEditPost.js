import React, {useEffect, useState} from "react";
import { query, orderBy, onSnapshot, 
    collection, getFirestore, doc, 
    updateDoc
} from "firebase/firestore";
import { getAuth} from "firebase/auth";

export default function ViewPost(props){
    const db = getFirestore();
    const auth = getAuth();

    useEffect(() => {
        window.scrollTo(0, 0)
    }, [])

    // FIND THE POST DOC
    const postsRef = collection(db, 'posts');
    const [foundPost, setFoundPost] = useState("")
    useEffect(() => {
        const q = query(postsRef, orderBy('createdAt'))
        onSnapshot(q, async (snapshot) => {
            snapshot.docs.forEach((doc => {
                if(doc.data().id === props.capturedPostId){
                    setFoundPost({ ...doc.data(), id: doc.id})
                }
            }))
        })
    },[])

    // FIND THE USER DOC
    const usersRef = collection(db, 'users');
    const [foundUser, setFoundUser] = useState("")
    useEffect(() => {
        const q = query(usersRef, orderBy('createdAt'))
        onSnapshot(q, async (snapshot) => {
            snapshot.docs.forEach((doc => {
                if(doc.data().uid === foundPost.uid){
                    setFoundUser({ ...doc.data(), id: doc.id})
                }
            }))
        })
    },[foundPost])

    async function updatePost(){
        const docRef = doc(db, 'posts', foundPost.id)
        await updateDoc(docRef, {
            title: `${titleValue === ""? foundPost.title: titleValue}`,
            body: `${bodyValue === ""? foundPost.body: bodyValue}`,
            video: `${linkValue === ""? foundPost.video: linkValue}`
        })
    }

    function cancel(){
        props.cancel();
    }
    function save(){
        updatePost();
        props.cancel();
    }

    const [titleValue, setTitleValue] = useState("")
    const [bodyValue, setBodyValue] = useState("")
    const [linkValue, setLinkValue] = useState("")
    useEffect(() => {
        setTitleValue(foundPost.title)
        setBodyValue(foundPost.body)
        foundPost.video && setLinkValue(foundPost.video)
    }, [foundPost])
    
    return (
        <div className="page-body post">
            <button className="edit-post-btn" onClick={cancel}>cancel</button>
            <button className="edit-post-btn" onClick={save}>save</button>
            <div className="view-post-container">
                <p 
                    className="post-author"
                    onClick={() => props.sendUID(foundUser.uid)}>Authored by: {foundUser.username}
                </p>
                    <textarea 
                        className="edit-post-textarea edit-post-title"
                        cols={200}
                        rows={2}
                        value={titleValue}
                        onChange={(event) => setTitleValue(event.target.value)}
                    />
                <div className="post-body">
                    <textarea   
                        className="edit-post-textarea edit-post-body"
                        cols={200}
                        rows={4}
                        value={bodyValue}
                        onChange={(event) => setBodyValue(event.target.value)}
                    />
                    <textarea 
                        className="create-post-video-textarea edit-post-title"
                        cols={200} 
                        row={1}
                        type="text" 
                        placeholder="youtube link..."
                        value={linkValue}
                        onChange={(event) => setLinkValue(event.target.value)}
                    />
                </div>
            </div>
        </div>
    )
}