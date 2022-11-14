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

    function deleteInput(loc){
        let newArray = []
        let newArray2 = []
        let finalArray = []
        const beforeLoc = postObj.inputs.filter(input => input.place < loc)
        const afterLoc = postObj.inputs.filter(input => input.place > loc)
        const shiftedAfterLoc = afterLoc.map((input, i)=> {return{...input, place: input.place-1}} )
        newArray2 = newArray.concat(beforeLoc)
        finalArray = newArray2.concat(shiftedAfterLoc)
        const delInputArr = finalArray.map(input => input.place === loc ? {...input, deleting: true} : input)
        setPostObj(prev => {
            return{...prev, inputs: delInputArr, numInputs: prev.numInputs-1}
        })
        setTimeout(() => {
            setPostObj(prev => {
                return {...prev, inputs: finalArray}
            })
        }, 250)
    }

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
        setTimeout(() => {
            const initializedInputs = finalArray.map(input => input.place === loc ? {...input, initializing: false} : input)
            setPostObj(prev => {
                return {...prev, inputs: initializedInputs}
            })
        },1000)
    }

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

    const [showButtons, setShowButtons] = useState(false);
    function toggleButtons(){
        setShowButtons(true)
    }

    function changeFontSize(place, value){
        const updatedFontSize = postObj.inputs.map(input => input.place === place ? {...input, fontSize: value+"rem", initializing: false} : input )
        setPostObj(prev => {
            return {...prev, inputs: updatedFontSize}
        })
    }

    function updateInputOutput(place, value){
        const updatedInput = postObj.inputs.map(input => input.place === place ? {...input, output: value, initializing: false} : input )
        setPostObj(prev => {
            return {...prev, inputs: updatedInput}
        })
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
                    {showButtons &&
                    <>
                        <button className="post-input cancel-insert" onClick={()=>setShowButtons(false)}>cancel</button>
                        <button className="post-input" onClick={()=> addInput(input.place, "text")}>text</button>
                        <button className="post-input" onClick={()=> addInput(input.place, "image")}>image</button>
                        <button className="post-input" onClick={()=> addInput(input.place, "video")}>video</button>
                    </>}
                </div>
                {input.type === "text" ?
                    <>{input && 
                        <input name="fontSize" type="range" min="1" max="5" value={input.fontSize.slice(0, -3)} 
                            onChange={event => changeFontSize(input.place, event.target.value)}>
                        </input>}
                        <textarea
                            name={"input"+JSON.stringify(index)}
                            className={`input-textarea insert-input ${input.output === "" 
                                ? input.initializing === true && "insert-input-animation"
                                : input.deleting === true && "delete-input-animation"}`}
                            rows={3} placeholder="Add post body..."
                            onChange={event => updateInputOutput(input.place, event.target.value)}
                            value={input.output}/> 
                    </>
                : input.type === "video" ?
                <>
                    <textarea
                        rows={1}
                        name={"input"+JSON.stringify(index)}
                        className={`input-textarea insert-input ${input.output === "" 
                            ? input.initializing === true && "insert-input-animation"
                            : input.deleting === true && "delete-input-animation"}`}
                        type="text" 
                        placeholder="youtube link..."
                        value={input.output} 
                        onChange={event => updateInputOutput(input.place, event.target.value)}
                    />
                    {input.output && <iframe  className="post-video" 
                    src={`https://www.youtube.com/embed/${input.output.slice(17)}`} 
                    frameBorder="0" allowFullScreen></iframe>}
                    </>
                : input.type === "image" &&
                <>
                    <textarea
                        rows={1}
                        name={"input"+JSON.stringify(index)}
                        className={`input-textarea insert-input ${input.output === "" 
                            ? input.initializing === true && "insert-input-animation"
                            : input.deleting === true && "delete-input-animation"}`}
                        type="text" 
                        placeholder="image url goes here"
                        value={input.output} 
                        onChange={event => updateInputOutput(input.place, event.target.value)}
                    />
                    <img className={`post-image ${input.deleting === true && "delete-input-animation"}`} src={input.output}></img>
                </>
                }
                <div className="input-options">
                    {swapping === false && 
                        <button className="edit-post-btn" onClick={()=> swapFrom(input.place)}>swap</button>}
                    {swapping === true && 
                        <><button className="edit-post-btn" onClick={()=> swapTo(input.place)} disabled={swappingFrom === input.place && "+true"}>swapTo</button>
                        <button className="edit-post-btn" onClick={()=> setSwapping(false)}>cancel</button></>}
                    <button className="del-input-btn" onClick={()=> deleteInput(input.place)}>delete</button>
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
                    {postObj.numInputs === 0 &&
                    <div className="insert-input">
                        <p>Add input(s)</p>
                        <button className="edit-post-btn" onClick={()=>addInput(0, "text")}>text</button>
                        <button className="edit-post-btn" onClick={()=> addInput(0, "image")}>image</button>
                        <button className="edit-post-btn" onClick={()=>addInput(0, "video")}>video</button>
                    </div>
                    }
                    <div className="input-chain">
                        {postObj && postObj.inputs.length > 0 && inputs(postObj.inputs)}
                    </div>
                    {postObj && postObj.inputs.length > 0 &&
                        <div className="edit-post-btns">
                        <button onClick={toggleButtons} className={showButtons === false ? "post-input" 
                            : "post-input invisible-p"}>insert
                        </button>
                        {showButtons &&
                        <>
                            <button className="post-input cancel-insert" onClick={()=>setShowButtons(false)}>cancel</button>
                            <button className="post-input" onClick={()=> addInput(postObj.inputs.length, "text")}>text</button>
                            <button className="post-input" onClick={()=> addInput(postObj.inputs.length, "image")}>image</button>
                            <button className="post-input" onClick={()=> addInput(postObj.inputs.length, "video")}>video</button>
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
