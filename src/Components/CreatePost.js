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

    const [ postObj, setPostObj ] = useState({
        uid: auth.currentUser.uid,
        follows: [],
        approval: [],
        disapproval: [],
        createdAt: serverTimestamp(),
        unique: unique,
        title: formValueTitle,
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
    let newArray = []
    let newArray2 = []
    let finalArray = []
    const beforeLoc = postObj.inputs.filter(input => input.place < loc)
    const afterLoc = postObj.inputs.filter(input => input.place > loc)
    const shiftedAfterLoc = afterLoc.map((input, i)=> {return{...input, place: input.place-1}} )
    newArray2 = newArray.concat(beforeLoc)
    finalArray = newArray2.concat(shiftedAfterLoc)
    const delInputArr = postObj.inputs.map(input => input.place === loc ? {...input, deleting: true} : input)
    const inputArr = finalArray.map(input => input.place === loc ? {...input, deleting: false} : input)
    setPostObj(prev => {
        return{...prev, inputs: delInputArr}
    })
    setDeleteDisabled(true)
    setTimeout(() => {
        setPostObj(prev => {
            return {...prev, inputs: inputArr, numInputs: prev.numInputs-1}
        })
        setDeleteDisabled(false)
    }, 550)
}
// ##########################################################################
const [inputDisabled, setInputDisabled] = useState(false)
    function addInput(loc, type){
        let newArray = []
        let newArray2 = []
        let newArray3 = []
        let finalArray = []
        const beforeLoc = postObj.inputs.filter(input => input.place < loc)
        const afterLoc = postObj.inputs.filter(input => input.place >= loc)
        const shiftedAfterLoc = afterLoc.map((input, i)=> {return{...input, place: input.place+1}} )
        const newInput = {type: type, output: "", place: loc, fontSize: "3rem", initializing: true}
        if (postObj.inputs.length > 1 || postObj.inputs.length === 0){
            newArray2 = newArray.concat(beforeLoc)
            newArray3 = newArray2.concat(newInput)
            finalArray = newArray3.concat(shiftedAfterLoc)
        } 
        if (postObj.inputs.length === 1) { 
            if(loc === 0){
                newArray2 = newArray.concat(newInput)
                finalArray = newArray2.concat(shiftedAfterLoc)
            } else {
                newArray2 = newArray.concat(beforeLoc)
                finalArray = newArray2.concat(newInput)
            }
        }
        setPostObj(prev => {
            return {...prev, inputs: finalArray, numInputs: prev.numInputs+1}
        })
        // setShowButtons(false)
        setInputDisabled(true)
        setTimeout(() => {
            const initializedInputs = finalArray.map(input => input.place === loc ? {...input, initializing: false} : input)
            setPostObj(prev => {
                return {...prev, inputs: initializedInputs}
            })
            setInputDisabled(false)
        },500)
    }
// ##########################################################################
    const [swapStart, setSwapStart] = useState()
    const [swapping, setSwapping] = useState(false)
    const [swappingFrom, setSwappingFrom] = useState()
    function swapFrom(loc){
        setSwapStart(loc)
        setSwapping(true)
        setSwappingFrom(loc)
    }
    function swapTo(loc){
        let nonSwappersArr = postObj.inputs.filter(input => input.place !== loc)
        let nonSwappersArr2 = nonSwappersArr.filter(input => input.place !== swapStart)
        let swapper1 = postObj.inputs.find(input => input.place === loc)
        let swapper2 = postObj.inputs.find(input => input.place === swapStart)
        swapper1 =  {...swapper1, place:swapStart}
        swapper2 = {...swapper2, place:loc}
        let swappers = [swapper1, swapper2]
        let fullArr = nonSwappersArr2.concat(swappers)
        const sorted = fullArr.sort(function(a, b) {
            return a.place - b.place
        })
        setPostObj(prev => {
            return {...prev, inputs: sorted}
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
    function updateInputOutput(place, value){
        const updatedInput = postObj.inputs.map(input => input.place === place ? {...input, output: value, initializing: false} : input )
        setPostObj(prev => {
            return {...prev, inputs: updatedInput}
        })
    }
// ##########################################################################
function InsertBtns(props){
    return (
        <>{!props.inputStart &&<button className="post-input cancel-insert" onClick={()=>setShowButtons(false)}>cancel</button>}
        <button disabled={inputDisabled && "+true"} className={!props.inputStart?"post-input":"edit-post-btn"} 
            onClick={()=> addInput(props.place, "text")}>text</button>
        <button disabled={inputDisabled && "+true"} className={!props.inputStart?"post-input":"edit-post-btn"} 
            onClick={()=> addInput(props.place, "image")}>image</button>
        <button disabled={inputDisabled && "+true"} className={!props.inputStart?"post-input":"edit-post-btn"} 
            onClick={()=> addInput(props.place, "video")}>video</button></>
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
                    {showButtons && <InsertBtns place={input.place} />}
                </div>
                {input.type === "text" ?<>
                <input name="fontSize" type="range" min="1" max="5" value={input.fontSize.slice(0, -3)} 
                    onChange={event => changeFontSize(input.place, event.target.value)}>
                </input>
                {!input.deleting ?
                <textarea
                    name={"input"+JSON.stringify(index)}
                    className={`input-textarea insert-input`}
                    rows={3} placeholder={"Add post body..."}
                    value={input.output}
                    onChange={event => updateInputOutput(input.place, event.target.value)}/>
                    :<div></div>}
                </>
                : input.type === "video" ?<>
                {!input.deleting ?
                <textarea
                    name={"input"+JSON.stringify(index)}
                    className={`input-textarea insert-input`}
                    rows={1} placeholder={"Add youtube link"}
                    value={input.output}
                    onChange={event => updateInputOutput(input.place, event.target.value)}/>
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
                    onChange={event => updateInputOutput(input.place, event.target.value)}/>
                    :<div></div>}
                    <img className={`post-image`} src={input.output}></img></>
                }
                <div className="input-options">
                    {swapping === false && 
                        <button className="edit-post-btn" onClick={()=> swapFrom(input.place)}>swap</button>}
                    {swapping === true && 
                        <><button className="edit-post-btn" onClick={()=> swapTo(input.place)} disabled={swappingFrom === input.place && "+true"}>swapTo</button>
                        <button className="edit-post-btn" onClick={()=> setSwapping(false)}>cancel</button></>}
                    <button disabled={deleteDisabled&&"+true"} className="del-input-btn" onClick={()=> deleteInput(input.place)}>delete</button>
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
                    {postObj.numInputs === 0 && <InsertBtns place={0} inputStart={true} />}
                    <div className="input-chain">
                        {postObj && postObj.inputs.length > 0 && inputs(postObj.inputs)}
                    </div>
                    {postObj && postObj.inputs.length > 0 &&
                        <div className="edit-post-btns">
                        <button onClick={toggleButtons} className={showButtons === false ? "post-input" 
                            : "post-input invisible-p"}>insert
                        </button>
                        {showButtons && <InsertBtns place={postObj.inputs.length} />}
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
