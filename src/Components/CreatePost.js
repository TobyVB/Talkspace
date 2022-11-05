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

    const [unique, setUnique] = useState(nanoid())

    useEffect(() => {
        window.scrollTo(0, 0)
    }, [])

    const [link, setLink] = useState("");
    const [input, setInput] = useState("");


    // deleteField will actually be used in ViewEditPost.js not here
    function deleteField(){
        // below is an example
        // delete Employee.firstname;
    } 

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

    const [numInputs, setNumInputs] = useState(0);

    const [ postObj, setPostObj ] = useState({
        uid: auth.currentUser.uid,
        follows: [],
        approval: [],
        disapproval: [],
        createdAt: serverTimestamp(),
        unique: unique,
        title: formValueTitle,
        body: formValueBody,
        numInputs: numInputs
    })
    function addText(e){
        e.preventDefault()
        setPostObj ({...postObj, 
            ["input"+JSON.stringify(numInputs+1)]: {type: "text", output: ""},
            numInputs: numInputs+1
        })
        setNumInputs(prevNumInputs => prevNumInputs+=1);
        console.log("add text")
        console.log(postObj)
        setNumArr(prev => {
            prev.push(numArr.length+1)
            return prev
        })
    }
    function addVideo(e){
        e.preventDefault()
        setPostObj ({...postObj, 
            ["input"+JSON.stringify(numInputs+1)]: {type: "video", output: ""},
            numInputs: numInputs+1
        })
        setNumInputs(prevNumInputs => prevNumInputs+=1);
        console.log("add video")
        console.log(postObj)
        setNumArr(prev => {
            prev.push(numArr.length+1)
            return prev
        })
    }


    function createPost(e){
        e.preventDefault()
        addDoc(postsRef, postObj)
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


    function deleteInput(e)  {
        if(postObj.numInputs === 1){
            setPostObj(current => {
                const copy = {...current, numInputs: numInputs-1};
                delete copy[`${`input`+e}`];
                return copy;
            })
        }
        if(postObj.numInputs > 1){
            setPostObj(current => {
                return({...current, numInputs: numInputs-1})
            })
            let copy2 = postObj
            let copy3 = copy2
            for(let i=postObj.numInputs, count = 0; i >= e; i--, count++){
                copy3 = {...copy2}
                delete copy3[`${`input`+JSON.stringify(JSON.parse(e)+count)}`];
                copy3 = {...copy2, 
                [`${`input`+JSON.stringify(JSON.parse(e))}`]: postObj[`${`input`+JSON.stringify(JSON.parse(e)+1+count)}`]
                }
                console.log(`${`input`+JSON.stringify(JSON.parse(e)+count)}`)
                console.log(postObj[`${`input`+JSON.stringify(JSON.parse(e)+count+1)}`])
                // delete copy3[`${`input`+JSON.stringify(JSON.parse(e)+1)}`]
                // setPostObj(copy3);
            }
            setPostObj(copy3);
        }
        
        console.log(postObj)
    };

    function cursorEnd(e){
        const target = e.target;
        target.setSelectionRange(1, 1)
    }

    const [numArr, setNumArr] = useState([]);

    const inputs = (nums) => {
        // console.log(postObj[`${`input`+num}`][0])
        return nums.map(num => 
            postObj.numInputs > 0 && postObj[`${`input`+num}`] && postObj[`${`input`+num}`].type === "text" ?
            <div className="insert-input">
                <textarea  
                    name={postObj[`${`input`+num}`]}
                    autoFocus
                    onFocus={e => cursorEnd(e)}

                    className="create-post-video-textarea" 
                    rows={5}
                    placeholder="Add post body..." 
                    value={postObj[`${`input`+num}`].output} 
                    onChange={(event) => setPostObj({...postObj, [`${`input`+num}`]: { type:"text", output: event.target.value } })} 
                />
                <button onClick={addText}>add text</button>
                <button onClick={addVideo}>add video</button>
                <button onClick={()=> deleteInput(num)}>delete</button>
            </div>
            :
            postObj[`${`input`+num}`] &&
            postObj[`${`input`+num}`].type === "video" &&
            <div className="insert-input">
                <textarea
                    name={postObj[`${`input`+num}`]}
                    autoFocus
                    onFocus={e => cursorEnd(e)}

                    className="create-post-video-textarea"
                    type="text" 
                    placeholder="youtube link..."
                    value={postObj[`${`input`+num}`].output} 
                    onChange={(event) => setPostObj({...postObj, [`${`input`+num}`]: { type:"video", output: event.target.value } })} 
                />
                <button onClick={addText}>add text</button>
                <button onClick={addVideo}>add video</button>
                <button onClick={()=> deleteInput(num)}>delete</button>
            </div>
        )
    }
    
    return (
        <>
            <div className="create-post page-body">
                <h1 className="create-post-h1">Create Post</h1>
                {auth.currentUser && 
                <div className="create-post-form" onSubmit={createPost}>
                    <textarea 
                        className="create-post-video-textarea"
                        cols={1} 
                        type="text" 
                        placeholder="Add post title..." 
                        value={postObj.title} 
                        onChange={(event) => setPostObj({...postObj, title: event.target.value})} 
                    />
                    <div className="insert-input">
                        <p>Add input(s)</p>
                        <button onClick={addText}>add text</button>
                        <button onClick={addVideo}>add video</button>
                    </div>
                    {inputs(numArr)}

                    <hr></hr>
                    <button onClick={createPost} className="create-post-btn" type="submit" disabled={!postObj.title}>create post</button>
                </div>
                }
            </div>
            
        </>
    )
}