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

    const [unique, setUnique] = useState(nanoid())

    useEffect(() => {
        window.scrollTo(0, 0)
    }, [])

    // deleteField will actually be used in ViewEditPost.js not here
    function deleteField(){
        // below is an example
        // delete Employee.firstname;
    } 


    const [numInputs, setNumInputs] = useState(0);
    const [numArr, setNumArr] = useState([]);

    const [ postObj, setPostObj ] = useState({
        uid: auth.currentUser.uid,
        follows: [],
        approval: [],
        disapproval: [],
        createdAt: serverTimestamp(),
        unique: unique,
        title: formValueTitle,
        numInputs: numInputs,
        numArr: numArr
    })
    
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
        if(postObj[`${`input`+e}`].type === "text"){
            setPostObj({...postObj, [`${`input`+e}`]: {type:"text", output: postObj[`${`input`+e}`].ouput, deleting:true}})
        }
        if(postObj[`${`input`+e}`].type === "image"){
            setPostObj({...postObj, [`${`input`+e}`]: {type:"image", output: postObj[`${`input`+e}`].ouput, deleting:true}})
        }
        if(postObj[`${`input`+e}`].type === "video"){
            setPostObj({...postObj, [`${`input`+e}`]: {type:"video", output: postObj[`${`input`+e}`].ouput, deleting:true}})
        }
        setTimeout(() => {
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
                let copy = postObj
                let copy2 = copy
                for(let i=postObj.numInputs, count = 0; i >= JSON.parse(e); i--, count++){
                    delete copy2[`${`input`+JSON.stringify(JSON.parse(e)+count)}`];
                    copy2 = {...copy2, 
                        [`${`input`+JSON.stringify(JSON.parse(e)+count)}`]: copy[`${`input`+JSON.stringify(JSON.parse(e)+1+count)}`]
                    }
                }
                delete copy2[`${`input`+JSON.stringify(numInputs)}`]
                setPostObj({...copy2, numInputs:numInputs-1});
            }
            console.log(postObj)
            setNumArr(prev => {
                prev.pop(numArr.length+1)
                return prev
            })
            setNumInputs(prev => prev-=1);
        }, 250)
    };

    function addText(e){
        let copy = postObj
        let copy2 = copy
        let store = {
            numStore: 0,
            place: e
        }
        for(let i=postObj.numInputs, count = 0; i >= JSON.parse(e); i--, count++){
            store = {...store, 
                numStore: count+1,
                [`${`input`+JSON.stringify(JSON.parse(e)+count+1)}`]: copy[`${`input`+JSON.stringify(JSON.parse(e)+count)}`]
            }
            delete copy2[`${`input`+JSON.stringify(JSON.parse(e)+count)}`];
        }
        copy2 = {...copy2, ["input"+JSON.stringify(e)]: {type: "text", output: ""}}
        for(let i=store.numStore, count = 0; count < i; count++){
            if(count === 0){
                copy2 = {...copy2, ["input"+JSON.stringify(e)]: {type: "text", output: ""},
                [`${`input`+JSON.stringify(JSON.parse(e)+count+1)}`]: store[`${`input`+JSON.stringify(JSON.parse(e)+count+1)}`]  
                }
            } else {
                copy2 = {...copy2, [`${`input`+JSON.stringify(JSON.parse(e)+count+1)}`]: store[`${`input`+JSON.stringify(JSON.parse(e)+count+1)}`]}
            }
        }
        setNumInputs(prevNumInputs => prevNumInputs+=1);
        console.log(postObj)
        setNumArr(prev => {
            prev.push(numArr.length+1)
            return prev
        })
        setPostObj({...copy2, numInputs:numInputs+1, numArr:numArr, ["input"+JSON.stringify(e)]: {type: "text", output: "", initializing:true}});
        setTimeout(() => {
            setPostObj({...copy2, numInputs:numInputs+1, numArr:numArr, ["input"+JSON.stringify(e)]: {type: "text", output: "", initializing:false}});
        }, 1000)
        setShowButtons(false)
    }
    function addImage(e){
        let copy = postObj
        let copy2 = copy
        let store = {
            numStore: 0,
            place: e
        }
        for(let i=postObj.numInputs, count = 0; i >= JSON.parse(e); i--, count++){
            store = {...store, 
                numStore: count+1,
                [`${`input`+JSON.stringify(JSON.parse(e)+count+1)}`]: copy[`${`input`+JSON.stringify(JSON.parse(e)+count)}`]
            }
            delete copy2[`${`input`+JSON.stringify(JSON.parse(e)+count)}`];
        }
        copy2 = {...copy2, ["input"+JSON.stringify(e)]: {type: "image", output: ""}}
        for(let i=store.numStore, count = 0; count < i; count++){
            if(count === 0){
                copy2 = {...copy2, ["input"+JSON.stringify(e)]: {type: "image", output: ""},
                [`${`input`+JSON.stringify(JSON.parse(e)+count+1)}`]: store[`${`input`+JSON.stringify(JSON.parse(e)+count+1)}`]  
                }
            } else {
                copy2 = {...copy2, [`${`input`+JSON.stringify(JSON.parse(e)+count+1)}`]: store[`${`input`+JSON.stringify(JSON.parse(e)+count+1)}`]}
            }
        }
        setNumInputs(prevNumInputs => prevNumInputs+=1);
        console.log(postObj)
        setNumArr(prev => {
            prev.push(numArr.length+1)
            return prev
        })
        setPostObj({...copy2, numInputs:numInputs+1, numArr:numArr, ["input"+JSON.stringify(e)]: {type: "image", output: "", initializing:true}});
        setTimeout(() => {
            setPostObj({...copy2, numInputs:numInputs+1, numArr:numArr, ["input"+JSON.stringify(e)]: {type: "image", output: "", initializing:false}});
        }, 1000)
        setShowButtons(false)
    }
    function addVideo(e){
        let copy = postObj
        let copy2 = copy
        let store = {
            numStore: 0,
            place: e
        }
        for(let i=postObj.numInputs, count = 0; i >= JSON.parse(e); i--, count++){
            store = {...store, 
                numStore: count+1,
                [`${`input`+JSON.stringify(JSON.parse(e)+count+1)}`]: copy[`${`input`+JSON.stringify(JSON.parse(e)+count)}`]
            }
            delete copy2[`${`input`+JSON.stringify(JSON.parse(e)+count)}`];
        }
        copy2 = {...copy2, ["input"+JSON.stringify(e)]: {type: "video", output: ""}}
        for(let i=store.numStore, count = 0; count < i; count++){
            if(count === 0){
                copy2 = {...copy2, ["input"+JSON.stringify(e)]: {type: "video", output: ""},
                [`${`input`+JSON.stringify(JSON.parse(e)+count+1)}`]: store[`${`input`+JSON.stringify(JSON.parse(e)+count+1)}`]  
                }
            } else {
                copy2 = {...copy2, [`${`input`+JSON.stringify(JSON.parse(e)+count+1)}`]: store[`${`input`+JSON.stringify(JSON.parse(e)+count+1)}`]}
            }
        }
        setNumInputs(prevNumInputs => prevNumInputs+=1);
        console.log(postObj)
        setNumArr(prev => {
            prev.push(numArr.length+1)
            return prev
        })
        setPostObj({...copy2, numInputs:numInputs+1, numArr:numArr, ["input"+JSON.stringify(e)]: {type: "video", output: "", initializing:true}});
        setTimeout(() => {
            setPostObj({...copy2, numInputs:numInputs+1, numArr:numArr, ["input"+JSON.stringify(e)]: {type: "video", output: "", initializing:false}});
        }, 1000)
        setShowButtons(false)
    }



    const [selectedSwapKey, setSelectedSwapKey] = useState();
    const [selectedSwapValue, setSelectedSwapValue] = useState();
    const [swapping, setSwapping] = useState(false);
    function swapFrom(e){
        setSelectedSwapKey(`input`+JSON.stringify(e))
        setSelectedSwapValue(postObj[`${`input`+JSON.stringify(e)}`])
        setSwapping(true)
        console.log(postObj[`${`input`+JSON.stringify(e)}`])
    }
    function swapTo(e){
        let copy = postObj;
        copy = {
            ...copy,
            [`${selectedSwapKey}`]: postObj[`${`input`+JSON.stringify(e)}`],
            [`input`+JSON.stringify(e)] : selectedSwapValue
        }
        setPostObj(copy);
        setSwapping(false)
    }

    const [showButtons, setShowButtons] = useState(false);
    function toggleButtons(){
        setShowButtons(true)
    }

    const inputs = (nums) => {
        return nums.map(num => 
            postObj.numInputs > 0 && postObj[`${`input`+num}`] && postObj[`${`input`+num}`].type === "text" ?
            <div className={`insert-input ${postObj[`${`input`+num}`].output === "" ? postObj[`${`input`+num}`].initializing === true && "insert-input-animation": postObj[`${`input`+num}`].deleting === true && "delete-input-animation"}`}>
                
                <div className="edit-post-btns">
                    <>
                    {<button onClick={toggleButtons} className={showButtons === false ? "edit-post-btn post-input" : "edit-post-btn post-input invisible-p"}>insert</button>}
                    </>
                    {showButtons &&
                    <>
                        <button className="edit-post-btn post-input cancel-insert" onClick={()=>setShowButtons(false)}>cancel</button>
                        <button className="edit-post-btn post-input" onClick={()=> addText(num)}>text</button>
                        <button className="edit-post-btn post-input" onClick={()=> addImage(num)}>image</button>
                        <button className="edit-post-btn post-input" onClick={()=> addVideo(num)}>video</button>
                    </>}
                </div>
                <textarea  
                    name={postObj[`${`input`+num}`]}
                    className={`create-post-video-textarea insert-input ${postObj[`${`input`+num}`].output === "" ? postObj[`${`input`+num}`].initializing === true && "insert-input-animation": postObj[`${`input`+num}`].deleting === true && "delete-input-animation"}`}
                    rows={5}
                    placeholder="Add post body..." 
                    value={postObj[`${`input`+num}`].output} 
                    onChange={(event) => setPostObj({...postObj, [`${`input`+num}`]: { type:"text", output: event.target.value } })} 
                />
                <div className="input-options">
                    {swapping === false && <button className="edit-post-btn" onClick={()=> swapFrom(num)}>swap</button>}
                    {swapping === true && <button className="edit-post-btn" onClick={()=> swapTo(num)}>swapTo</button>}
                    <button className="del-input-btn" onClick={()=> deleteInput(num)}>delete</button>
                </div>
            </div>
            :
            postObj[`${`input`+num}`] &&
            postObj[`${`input`+num}`].type === "video" ?
            <div className={`insert-input ${postObj[`${`input`+num}`].output === "" ? postObj[`${`input`+num}`].initializing === true && "insert-input-animation": postObj[`${`input`+num}`].deleting === true && "delete-input-animation"}`}>
                
                <div className="edit-post-btns">
                    <>
                    {<button onClick={toggleButtons} className={showButtons === false ? "edit-post-btn post-input" : "edit-post-btn post-input invisible-p"}>insert</button>}
                    </>
                    {showButtons &&
                    <>
                        <button className="edit-post-btn post-input cancel-insert" onClick={()=>setShowButtons(false)}>cancel</button>
                        <button className="edit-post-btn post-input" onClick={()=> addText(num)}>text</button>
                        <button className="edit-post-btn post-input" onClick={()=> addImage(num)}>image</button>
                        <button className="edit-post-btn post-input" onClick={()=> addVideo(num)}>video</button>
                    </>}
                </div>
                <textarea
                    rows={1}
                    name={postObj[`${`input`+num}`]}
                    className={`create-post-video-textarea insert-input ${postObj[`${`input`+num}`].output === "" ? postObj[`${`input`+num}`].initializing === true && "insert-input-animation": postObj[`${`input`+num}`].deleting === true && "delete-input-animation"}`}
                    type="text" 
                    placeholder="youtube link..."
                    value={postObj[`${`input`+num}`].output} 
                    onChange={(event) => setPostObj({...postObj, [`${`input`+num}`]: { type:"video", output: event.target.value } })} 
                />
                {postObj[`${`input`+num}`].output && <iframe  className="post-video" src={`https://www.youtube.com/embed/${postObj[`${`input`+num}`].output.slice(17)}`} frameBorder="0" allowFullScreen></iframe>}
                <div className="input-options">
                    {swapping === false && <button className="edit-post-btn" onClick={()=> swapFrom(num)}>swap</button>}
                    {swapping === true && <button className="edit-post-btn" onClick={()=> swapTo(num)}>swapTo</button>}
                    <button className="del-input-btn" onClick={()=> deleteInput(num)}>delete</button>
                </div>
            </div>
            :
            postObj[`${`input`+num}`] &&
            postObj[`${`input`+num}`].type === "image" &&
            <div className={`insert-input ${postObj[`${`input`+num}`].output === "" ? postObj[`${`input`+num}`].initializing === true && "insert-input-animation": postObj[`${`input`+num}`].deleting === true && "delete-input-animation"}`}>
                
                <div className="edit-post-btns">
                    <>
                    {<button onClick={toggleButtons} className={showButtons === false ? "edit-post-btn post-input" : "edit-post-btn post-input invisible-p"}>insert</button>}
                    </>
                    {showButtons &&
                    <>
                        <button className="edit-post-btn post-input cancel-insert" onClick={()=>setShowButtons(false)}>cancel</button>
                        <button className="edit-post-btn post-input" onClick={()=> addText(num)}>text</button>
                        <button className="edit-post-btn post-input" onClick={()=> addImage(num)}>image</button>
                        <button className="edit-post-btn post-input" onClick={()=> addVideo(num)}>video</button>
                    </>}
                </div>
                <textarea
                    rows={1}
                    name={postObj[`${`input`+num}`]}
                    className={`create-post-video-textarea insert-input ${postObj[`${`input`+num}`].output === "" ? postObj[`${`input`+num}`].initializing === true && "insert-input-animation": postObj[`${`input`+num}`].deleting === true && "delete-input-animation"}`}
                    type="text" 
                    placeholder="image url goes here"
                    value={postObj[`${`input`+num}`].output} 
                    onChange={(event) => setPostObj({...postObj, [`${`input`+num}`]: { type:"image", output: event.target.value } })} 
                />
                <img className={`post-image ${postObj[`${`input`+num}`].deleting === true && "delete-input-animation"}`} src={postObj[`${`input`+num}`].output}></img>
                <div className="input-options">
                    {swapping === false && <button className="edit-post-btn" onClick={()=> swapFrom(num)}>swap</button>}
                    {swapping === true && <button className="edit-post-btn" onClick={()=> swapTo(num)}>swapTo</button>}
                    <button className="del-input-btn" onClick={()=> deleteInput(num)}>delete</button>
                </div>
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
                    <div className="post-body">
                    {numArr.length === 0 &&
                    <div className="edit-post-btns">
                    <>
                    {<button onClick={toggleButtons} className={showButtons === false ? "edit-post-btn post-input" : "edit-post-btn post-input invisible-p"}>insert</button>}
                    </>
                    {showButtons &&
                    <>
                        <button className="edit-post-btn post-input cancel-insert" onClick={()=>setShowButtons(false)}>cancel</button>
                        <button className="edit-post-btn post-input" onClick={()=> addText(numArr.length+1)}>text</button>
                        <button className="edit-post-btn post-input" onClick={()=> addImage(numArr.length+1)}>image</button>
                        <button className="edit-post-btn post-input" onClick={()=> addVideo(numArr.length+1)}>video</button>
                    </>}
                </div>
                    }
                    <div className="input-chain">
                        {inputs(numArr)}
                    </div>
                    {numArr.length > 0 &&
                        <div className="edit-post-btns">
                        <>
                        {<button onClick={toggleButtons} className={showButtons === false ? "edit-post-btn post-input" : "edit-post-btn post-input invisible-p"}>insert</button>}
                        </>
                        {showButtons &&
                        <>
                            <button className="edit-post-btn post-input cancel-insert" onClick={()=>setShowButtons(false)}>cancel</button>
                            <button className="edit-post-btn post-input" onClick={()=> addText(numArr.length+1)}>text</button>
                            <button className="edit-post-btn post-input" onClick={()=> addImage(numArr.length+1)}>image</button>
                            <button className="edit-post-btn post-input" onClick={()=> addVideo(numArr.length+1)}>video</button>
                        </>}
                    </div>
                    }
                </div>
                    <hr></hr>
                    <button onClick={createPost} className="create-post-btn" type="submit" disabled={!postObj.title}>create post</button>
                </div>
                }
            </div>
            
        </>
    )
}