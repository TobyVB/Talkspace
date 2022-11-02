import React, {useEffect, useState} from "react";
import {getAuth} from 'firebase/auth'
import {collection, getFirestore, addDoc,
     serverTimestamp, onSnapshot, updateDoc,
      query, orderBy,
      doc
} from 'firebase/firestore';
import { nanoid } from 'nanoid';

export default function CreatePost(props){

    const auth = getAuth();
    const db = getFirestore();
    const postsRef = collection(db, 'posts');
    const [formValueTitle, setFormValueTitle] = useState('');

    const [formValueBody, setFormValueBody] = useState('');
    // const [formValueBody0, setFormValueBody0] = useState('');
    // const [formValueBody1, setFormValueBody1] = useState('');
    // const [formValueBody2, setFormValueBody2] = useState('');

    const [unique, setUnique] = useState(nanoid())

    useEffect(() => {
        window.scrollTo(0, 0)
    }, [])

    const [link, setLink] = useState("")
    // const [link0, setLink0] = useState("")
    // const [link1, setLink1] = useState("")
    // const [link2, setLink2] = useState("")



    function deleteField(){
        // below is an example
        // delete Employee.firstname;
    }

    // useEffect(()=> {
    //     console.log(postObj)
    // }, postObj)



    // addDoc(postsRef, {
    //     title: formValueTitle,
    //     body: formValueBody0,
    //     video0: link0,
    //     video1: link1,
    //     video2: link2,
    //     uid: auth.currentUser.uid,
    //     follows: [],
    //     approval: [],
    //     disapproval: [],
    //     createdAt: serverTimestamp(),
    //     unique: unique,
    // })

        // const [arr, setArr] = useState([
    //     {name:"text1", type:"text"},
    //     {name:"vid1", type:"video"}
    // ])


    let postObj = {
        uid: auth.currentUser.uid,
        follows: [],
        approval: [],
        disapproval: [],
        createdAt: serverTimestamp(),
        unique: unique,
        title:formValueTitle,
        body: formValueBody,
        
        // video: link
    }
    function addVideo(e){
        e.preventDefault()
        postObj ={...postObj, video: link }
    }

    function createPost(e){
        e.preventDefault()
        addDoc(postsRef, postObj)
        .then(() => {
            setFormValueTitle('');
            // setFormValueBody('')
        })
        // UPDATE HAS BEEN UPDATED...
        .then(() => {
            const q = query(postsRef, orderBy('createdAt'))
            onSnapshot(q, async (snapshot) => {
                snapshot.docs.forEach((document) => {
                    const docRef = doc(db, 'posts', document.id)
                    if(document.data().unique === unique){
                        console.log(unique)
                        updateDoc(docRef, {
                            id: document.id
                        })
                        props.updatePage();
                        props.sendPostId(document.id)
                    }
                })
            })
        })
    }
    
    return (
        <>
            <div className="create-post page-body">
                <h1 className="create-post-h1">Create Post</h1>
                {auth.currentUser && 
                <form className="create-post-form" onSubmit={createPost}>
                    <textarea 
                        className="create-post-video-textarea"
                        cols={1} 
                        type="text" 
                        placeholder="Add post title..." 
                        value={formValueTitle} 
                        onChange={(event) => setFormValueTitle(event.target.value)} 
                    />
                    <textarea 
                        className="create-post-video-textarea" 
                        cols={120} 
                        rows={5}
                        value={formValueBody} 
                        onChange={(event) => setFormValueBody(event.target.value)} 
                        placeholder="Add post body..." 
                    />
                    <textarea
                        className="create-post-video-textarea"
                        cols={1} 
                        type="text" 
                        placeholder="youtube link..."
                        value={link}
                        onChange={(event) => setLink(event.target.value)}
                    />
                    {/* {Object.keys(postObj).forEach(function(key, index){
                        
                    })} */}
                    {/* {arr && arr.map((item, index) => item.type === "video"
                        ?
                        <textarea
                            key={index}
                            className="create-post-video-textarea"
                            cols={1} 
                            type="text" 
                            placeholder="youtube link..."
                            value={JSON.parse("link"+JSON.stringify(index))}
                            onChange={(event) => JSON.parse("setLink"+JSON.stringify(index))(event.target.value)}
                        />
                        :
                        <textarea 
                            key={index}
                            className="create-post-video-textarea" 
                            cols={120} 
                            rows={5}
                            value={JSON.parse("formValueBody"+JSON.stringify(index))} 
                            onChange={(event) => JSON.parse("setFormValueBody"+JSON.stringify(index))(event.target.value)} 
                            placeholder="Add post body..." 
                        />
                    )} */}
                    <hr></hr>
                    <button onClick={addVideo}>testAdd</button>
                    <button className="create-post-btn" type="submit" disabled={!formValueTitle}>create post</button>
                </form>
                }
                {/* <h3 className="create-post-title">{formValueTitle}</h3>
                <p className="create-post-body">{formValueBody}</p> */}
            </div>
            
        </>
    )
}