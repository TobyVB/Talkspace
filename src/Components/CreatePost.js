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
    const [unique, setUnique] = useState(nanoid())

    useEffect(() => {
        window.scrollTo(0, 0)
    }, [])

    const [ postObj, setPostObj ] = useState({
        uid: auth.currentUser.uid,
        follows: [],
        approval: [],
        disapproval: [],
        createdAt: serverTimestamp(),
        unique: unique,
        title: "",
        numInputs: 0,
        inputs: []
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
// ##########################################################################
    const [deleteDisabled, setDeleteDisabled] = useState(false)
    function deleteInput(loc){
        const caughtItem = postObj.inputs[loc]
        const newArr = postObj.inputs
        const delArr = postObj.inputs
        delArr.splice(loc, 1, {...caughtItem, deleting: true})
        setPostObj(prev => {
            return{...prev, inputs: delArr}
        })
        setDeleteDisabled(true)
        setTimeout(() => {
            newArr.splice(loc, 1)
            setPostObj(prev => {
                return {...prev, inputs: newArr, numInputs: prev.numInputs-1}
            })
            setDeleteDisabled(false)
        }, 550)
    }
// ##########################################################################
    const [inputDisabled, setInputDisabled] = useState(false)
    function addInput(loc, type){
        const newInitInput = {type: type, output: "", fontSize: "3rem", initializing: true, deleting: false}
        const newInput = {type: type, output: "", fontSize: "3rem", initializing: false, deleting: false}
        const initArr = postObj.inputs
        const completedArr = postObj.inputs
        initArr.splice(loc, 0, newInitInput)
        setPostObj(prev => {
            return {...prev, inputs: initArr, numInputs: prev.numInputs+1}
        })
        setInputDisabled(true)
        setTimeout(() => {
            completedArr.splice(loc, 1, newInput)
            setPostObj(prev => {
                return {...prev, inputs: completedArr}
            })
            setInputDisabled(false)
        },500)
    }
// ##########################################################################
    const [swapStart, setSwapStart] = useState()
    const [swapping, setSwapping] = useState(false)
    function swapFrom(loc){
        setSwapStart(loc)
        setSwapping(true)
    }
    function swapTo(loc){
        const newArr = postObj.inputs
        Array.prototype.swapItems = function(a, b){
            this[a] = this.splice(b, 1, this[a])[0]
            return this;
        }
        setPostObj(prev => {
            return {...prev, inputs: newArr.swapItems(swapStart,loc)}
        })
        setSwapping(false)
    }
// ##########################################################################
    const [showButtons, setShowButtons] = useState(false);
    function toggleButtons(){
        setShowButtons(true)
    }
// ##########################################################################
    function changeFontSize(place, value){
        const updatedFontSize = postObj.inputs.map(input => input.place === place ? {...input, fontSize: value+"rem", initializing: false} : input )
        setPostObj(prev => {
            return {...prev, inputs: updatedFontSize}
        })
    }
// ##########################################################################
function updateInputOutput(loc, value){
    const arr = postObj.inputs
    arr.splice(loc, 1, {...postObj.inputs[loc], output: value, initializing: false})
    setPostObj(prev => {
        return {...prev, inputs: arr}
    })
}
// ##########################################################################
function InsertBtns(props){
    return (
        <>{!props.inputStart &&<button className="post-input cancel-insert" onClick={()=>setShowButtons(false)}>cancel</button>}
        <button disabled={inputDisabled && "+true"} className={!props.inputStart?"post-input":"edit-post-btn"} 
            onClick={()=> addInput(props.index, "text")}>text</button>
        <button disabled={inputDisabled && "+true"} className={!props.inputStart?"post-input":"edit-post-btn"} 
            onClick={()=> addInput(props.index, "image")}>image</button>
        <button disabled={inputDisabled && "+true"} className={!props.inputStart?"post-input":"edit-post-btn"} 
            onClick={()=> addInput(props.index, "video")}>video</button></>
    )
}
const inputs = (inputs) => {
    return inputs.map((input, index) => 
        postObj.numInputs > 0 &&
        <div className={`insert-input ${input.initializing === true ? "insert-input-animation"
        : input.deleting === true && "delete-input-animation"}`}> 
            <div className="edit-post-btns">
                <>
                {<button onClick={toggleButtons} className={showButtons === false ? "edit-post-btn post-input" 
                    : "edit-post-btn post-input invisible-p"}>insert</button>}
                </>
                {showButtons && <InsertBtns index={index} />}
            </div>
            {input.type === "text" ?<>
            <input name="fontSize" type="range" min="1" max="5" value={input.fontSize.slice(0, -3)} 
                onChange={event => changeFontSize(index, event.target.value)}>
            </input>
            {!input.deleting ?
            <textarea
                name={"input"+JSON.stringify(index)}
                className={`input-textarea insert-input`}
                rows={3} placeholder={"Add post body..."}
                value={input.output}
                onChange={event => updateInputOutput(index, event.target.value)}/>
                :<div></div>}
            </>
            : input.type === "video" ?<>
            {!input.deleting ?
            <textarea
                name={"input"+JSON.stringify(index)}
                className={`input-textarea insert-input`}
                rows={1} placeholder={"Add youtube link"}
                value={input.output}
                onChange={event => updateInputOutput(index, event.target.value)}/>
                :<div></div>}
                <iframe  className="post-video" 
                    src={`https://www.youtube.com/embed/${input.output.slice(17)}`} 
                    frameBorder="0" allowFullScreen>
                </iframe></>
            : input.type === "image" &&<>
            {!input.deleting ?
            <textarea
                name={"input"+JSON.stringify(index)}
                className={`input-textarea insert-input`}
                rows={1} placeholder={"image url goes here"}
                value={input.output}
                onChange={event => updateInputOutput(index, event.target.value)}/>
                :<div></div>}
                <img className={`post-image`} src={input.output}></img></>
            }
            <div className="input-options">
                {swapping === false && 
                    <button className="edit-post-btn" onClick={()=> swapFrom(index)}>swap</button>}
                {swapping === true && 
                    <><button className="edit-post-btn" onClick={()=> swapTo(index)} disabled={swapStart === index && "+true"}>swapTo</button>
                    <button className="edit-post-btn" onClick={()=> setSwapping(false)}>cancel</button></>}
                <button disabled={deleteDisabled&&"+true"} className="del-input-btn" onClick={()=> deleteInput(index)}>delete</button>
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
                        className="edit-post-textarea"
                        cols={1} 
                        type="text" 
                        placeholder="Add post title..." 
                        value={postObj.title} 
                        onChange={(event) => setPostObj({...postObj, title: event.target.value})} 
                    />
                    <div className="post-body">
                    {postObj.numInputs === 0 && <InsertBtns index={0} inputStart={true} />}
                    <div className="input-chain">
                        {postObj && postObj.inputs.length > 0 && inputs(postObj.inputs)}
                    </div>
                    {postObj && postObj.inputs.length > 0 &&
                        <div className="edit-post-btns">
                        <button onClick={toggleButtons} className={showButtons === false ? "post-input" 
                            : "post-input invisible-p"}>insert
                        </button>
                        {showButtons && <InsertBtns index={postObj.inputs.length} />}
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
