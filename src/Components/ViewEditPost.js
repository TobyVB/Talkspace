import React, {useEffect, useState, useRef} from "react";
import { query, orderBy, onSnapshot, collection, 
    getFirestore, doc, updateDoc
} from "firebase/firestore";
import { getAuth} from "firebase/auth";

export default function ViewPost(props){
    const db = getFirestore();
    const auth = getAuth();
    const [pagePause, setPagePause] = useState(true)
    useEffect(() => {
        window.scrollTo(0, 0)
        setTimeout(()=>{setPagePause(false)},250)
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
// ##########################################################################
    async function updatePost(){
        const docRef = doc(db, 'posts', foundPost.id)
        await updateDoc(docRef, postObj)
    }
    function cancel(){
        props.cancel();
    }
    function save(){
        updatePost();
        props.cancel();
    }
// ##########################################################################
    const [ postObj, setPostObj ] = useState("")
    useEffect(() => {
        if(foundPost){
            setPostObj({...foundPost, numInputs: foundPost.inputs.length})
        }  
    }, [foundPost])
// ##########################################################################
    const [inputDisabled, setInputDisabled] = useState(false)
    function addInput(loc, type){
        const newInitInput = {type: type, output: "", fontSize: "1rem", topMargin: "1rem", initializing: true, deleting: false}
        const newInput = {type: type, output: "", fontSize: "1rem", topMargin: "1rem", initializing: false, deleting: false}
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
    function changeFontSize(loc, value){
        // modify this to work for new method of handling inputs
        const arr = postObj.inputs
        arr.splice(loc, 1, {...postObj.inputs[loc], fontSize: value+"rem", initializing: false})
        setPostObj(prev => {
            return {...prev, inputs: arr}
        })
    }
// ##########################################################################
    function changeTopMargin(loc, value){
        // modify this to work for new method of handling inputs
        const arr = postObj.inputs
        arr.splice(loc, 1, {...postObj.inputs[loc], topMargin: value+"rem", initializing: false})
        setPostObj(prev => {
            return {...prev, inputs: arr}
        })
    }
// ##########################################################################
    const [updater, setUpdater] = useState(false);
    const [rows, setRows] = useState(1);
    function updateInputOutput(loc, value){
        setUpdater(prev => !prev)
        const arr = postObj.inputs
        arr.splice(loc, 1, {...postObj.inputs[loc], output: value, initializing: false})
        setPostObj(prev => {
            return {...prev, inputs: arr}
        })
    }
    function handleKeyDown(e) {
        e.target.style.height = 'inherit';
        e.target.style.height = `${e.target.scrollHeight}px`; 
        // In case you have a limitation
        // e.target.style.height = `${Math.min(e.target.scrollHeight, limit)}px`;
    }

    const applyTextSize = {
        height : 'inherit',
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


    const textarea = useRef();

    useEffect(()=> {
        if(postObj && textarea.current){
            textarea.current.style.height = 'inherit';
            textarea.current.style.height = `${textarea.current.scrollHeight}px`; 
        }
    }, [postObj])
    
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
                <input name="fontSize" type="range" min=".5" max="10" step=".1" value={input.fontSize.slice(0, -3)} 
                    onChange={event => changeFontSize(index, event.target.value)}>
                </input>
                <input name="topMargin" type="range" min="0" max="10" step=".1" value={input.topMargin.slice(0, -3)} 
                    onChange={event => changeTopMargin(index, event.target.value)}>
                </input>
                {!input.deleting ? 
                <textarea
                    key={index}
                    placeholder="write text here"
                    onKeyDown={e => handleKeyDown(e)}
                    ref={textarea}
                    style={{height: "inherit", fontSize : input.fontSize, marginTop: input.topMargin, overflow:"hidden"}}
                    name={"input"+JSON.stringify(index)}
                    className={`input-textarea insert-input`}
                    rows={rows}
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
        <div className="page-body post">
            <button disabled={pagePause && "+true"} className="edit-post-btn" onClick={cancel}>cancel</button>
            <button disabled={pagePause && "+true"} className="edit-post-btn" onClick={save}>save</button>
            <div className="view-post-container">
                <p 
                    className="post-author"
                    onClick={() => props.sendUID(foundUser.uid)}>Authored by: {foundUser.username}
                </p>
                <textarea 
                    className="edit-post-textarea edit-post-title"
                    cols={200}
                    rows={2}
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
            </div>
        </div>
    )
}
