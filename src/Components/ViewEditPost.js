import React, {useEffect, useState, useRef} from "react";
import { query, orderBy, onSnapshot, collection, 
    getFirestore, doc, updateDoc
} from "firebase/firestore";
import { getAuth} from "firebase/auth";
import parse from "html-react-parser";


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
    const [newInput, setNewInput] = useState(false)
    function addInput(loc, type){
        setNewInput(true)
        const newInitInput = {type: type, output: "", fontSize: "1rem", topMargin: ".5rem", bottomMargin: ".5rem", leftMargin: "0rem", rightMargin: "0rem", initializing: true, deleting: false}
        const newInput = {type: type, output: "", fontSize: "1rem", topMargin: ".5rem", bottomMargin: ".5rem", leftMargin: "0rem", rightMargin: "0rem", initializing: false, deleting: false}
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
        setTextarea(true)
        setShowInsertBtns(loc)
        setInsertingMode(false)
    }
// ##########################################################################
    const [deleteDisabled, setDeleteDisabled] = useState(false)
    function deleteInput(loc){
        setNewInput(false)
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
        setShowInsertBtns(loc-1)
    }
// ##########################################################################
    const [swapStart, setSwapStart] = useState(null)
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
        setSwapStart(null)
    }
// ##########################################################################
    const [showInsertBtns, setShowInsertBtns] = useState(null);
    function toggleButtons(loc){
        setShowInsertBtns(loc)
    }
// ##########################################################################
    function changeFontSize(loc, value){
        const arr = postObj.inputs
        arr.splice(loc, 1, {...postObj.inputs[loc], fontSize: value+"rem", initializing: false})
        setPostObj(prev => {
            return {...prev, inputs: arr}
        })
    }
// ##########################################################################
    function changeTopMargin(loc, value){
        const arr = postObj.inputs
        arr.splice(loc, 1, {...postObj.inputs[loc], topMargin: value+"rem", initializing: false})
        setPostObj(prev => {
            return {...prev, inputs: arr}
        })
    }
    function changeBottomMargin(loc, value){
        const arr = postObj.inputs
        arr.splice(loc, 1, {...postObj.inputs[loc], bottomMargin: value+"rem", initializing: false})
        setPostObj(prev => {
            return {...prev, inputs: arr}
        })
    }
    function changeLeftMargin(loc, value){
        const arr = postObj.inputs
        arr.splice(loc, 1, {...postObj.inputs[loc], leftMargin: value+"rem", initializing: false})
        setPostObj(prev => {
            return {...prev, inputs: arr}
        })
    }
    function changeRightMargin(loc, value){
        const arr = postObj.inputs
        arr.splice(loc, 1, {...postObj.inputs[loc], rightMargin: value+"rem", initializing: false})
        setPostObj(prev => {
            return {...prev, inputs: arr}
        })
    }
// ##########################################################################
    const [updater, setUpdater] = useState(false);
    function updateInputOutput(loc, value){
        setUpdater(prev => !prev)
        const arr = postObj.inputs
        arr.splice(loc, 1, {...postObj.inputs[loc], output: value, initializing: false})
        setPostObj(prev => {
            return {...prev, inputs: arr}
        })
    }
// ##########################################################################
    const [insertingMode, setInsertingMode] = useState(false)
    function inserting(loc){
        setTextarea(false)
        setShowInsertBtns(loc)
        setInsertingMode(true)
    }
    function modifyInput(loc){ 
        if(swapping === true){
            swapTo(loc)
        } else {
            setShowInsertBtns(loc)
            setInsertingMode(false)
        }
    }
    const [fontSettings, setFontSettings] = useState(false)
    const [marginSettings, setMarginSettings] = useState(false)
    const [textarea, setTextarea] = useState(false)
    function selectSorter(type){
        setFontSettings(false)
        setMarginSettings(false)
        setTextarea(false)
        if(type === "font"){setFontSettings(true)}
        if(type === "margin"){setMarginSettings(true)}
        if(type === "text"){setTextarea(true)}
    }
    function cancelSwap(){
        setSwapping(false)
        setSwapStart(null)
    }
// ##########################################################################
    function InsertBtns(props){
        return (
            <>{!props.inputStart && !props.inputEnd && postObj.inputs > 0&&<button className="edit-post-btn cancel-insert" onClick={()=>setInsertingMode(false)}>cancel</button>}
                <div className="edit-post-types">
                <button disabled={inputDisabled && "+true"} className={"edit-post-btn"} 
                    onClick={()=> addInput(props.index, "text")}>text</button>
                <button disabled={inputDisabled && "+true"} className={"edit-post-btn"} 
                    onClick={()=> addInput(props.index, "image")}>image</button>
                <button disabled={inputDisabled && "+true"} className={"edit-post-btn"} 
                    onClick={()=> addInput(props.index, "video")}>video</button>
            </div> </>
            
        )
    }
    function SelectSetting(){
        return(
            <div className="select-setting-btns">
                <button className={'edit-post-btn'} disabled={textarea&&"+true"}  onClick={()=>selectSorter("text")}>text</button>
                <button className={'edit-post-btn'} disabled={fontSettings&&"+true"}  onClick={()=>selectSorter("font")}>font</button>
                <button className={'edit-post-btn'} disabled={marginSettings&&"+true"}  onClick={()=>selectSorter("margin")}>margin</button>
            </div>
        )
    }
    function InputOptions(props){
        return (
            <div className="input-options">
                {swapping === false && 
                    <button className="edit-post-btn" onClick={()=> swapFrom(props.index)}>swap</button>}
                {swapping === true && 
                    <><button className="edit-post-btn" onClick={()=> swapTo(props.index)} disabled={swapStart === props.index && "+true"}>swapTo</button>
                    <button className="edit-post-btn" onClick={cancelSwap}>cancel</button></>}
                    {/* setSwapStart to null as well <----------*/}
                <button disabled={deleteDisabled&&"+true"} className="del-input-btn" onClick={()=> deleteInput(props.index)}>delete</button>
            </div>
        )
    }

    const inputs = (inputs) => {
        return inputs.map((input, index) => 
            postObj.numInputs > 0 && 
            <div className={swapStart===index?"swap-highlight":""} >
            {index === 0 && <p className="insert-section-btn" onClick={()=>inserting(-2)}></p>}
                <div className={`insert-input ${input.initializing === true ? "insert-input-animation"
                : input.deleting === true && "delete-input-animation"}`}>  
                {postObj && 
                input.type === "text"
                ?
                <p onClick={()=> modifyInput(index)} className={`post-text text-highlight ${input.output===""&&"empty-field"}`} style={
                    {fontSize: input.fontSize, marginTop: input.topMargin, marginBottom: input.bottomMargin, marginLeft: input.leftMargin, marginRight: input.rightMargin}
                }>{input.output === ""?"field empty":input.output}</p>
                :
                input.type === "video" 
                ?
                input.output===""?<p className="text-highlight empty-field" onClick={()=> modifyInput(index)}>add video</p>:
                input.output === ""?"field empty":input.output && <iframe className="post-video text-highlight"  onClick={()=> modifyInput(index)} src={`https://www.youtube.com/embed/${input.output.slice(17)}`} frameBorder="0" allowFullScreen ></iframe>
                :
                input.type === "image" 
                &&
                input.output===""?<p className="text-highlight empty-field" onClick={()=> modifyInput(index)}>add image</p>:
                input.output === ""?"field empty":input.output &&<img className="post-image text-highlight" onClick={()=> modifyInput(index)} src={input.output}></img>}
                {/* #########################   s h o w I n s e r t B t n s  === i n d e x   ######################## */}
                    {showInsertBtns === index || showInsertBtns === -2?
                    <div className="modifier-section">
                        <div className="edit-post-btns">
                        {!insertingMode && <SelectSetting key={index+"a"}/>}
                        {!insertingMode && <InputOptions key={index+"b"} index={index} />}
                            {/* clicking top arrow gives a state variable a value of -1, clicking anyother arrow sets that state variable to a value of 0 */}
                            {insertingMode && showInsertBtns === index && <InsertBtns index={index+1} />}
                            {insertingMode && showInsertBtns === -2 && <InsertBtns index={0} />}
                        </div>
                        {/* ####################   M O D I F I C A T I O N   G U I   ################### */}
                        {!insertingMode &&
                        // #####################################################
                        // ###################   F O N T   #####################
                        fontSettings?
                        <div className="font-size"><span>font size</span>
                        <select onChange={e => changeFontSize(index, e.target.value)}>
                            <option value="1">default</option>
                            <option value="2">h1</option>
                            <option value="1.5">h2</option>
                            <option value="1.17">h3</option>
                            <option value="1">h4</option>
                            <option value=".83">h5</option>
                            <option value=".67">h6</option>
                        </select>
                        <input name="fontSize" type="range" min=".5" max="5" step=".1" value={input.fontSize.slice(0, -3)} 
                        onChange={event => changeFontSize(index, event.target.value)}></input>
                        </div> 
                        
                        // #########################################################
                        // ###################   M A R G I N   #####################
                            :marginSettings? <div className="margin-sliders"><div className="margin-slider"><p>top margin</p>
                        <input name="topMargin" type="range" min="0" max="20" step=".1" value={input.topMargin.slice(0, -3)} 
                            onChange={event => changeTopMargin(index, event.target.value)}>
                        </input></div>
                        <div className="margin-slider"><p>bottom margin</p>
                        <input name="bottomMargin" type="range" min="0" max="20" step=".1" value={input.bottomMargin.slice(0, -3)} 
                            onChange={event => changeBottomMargin(index, event.target.value)}>
                        </input></div>
                        <div className="margin-slider"><p>left margin</p>
                        <input name="leftMargin" type="range" min="0" max="20" step=".1" value={input.leftMargin.slice(0, -3)} 
                            onChange={event => changeLeftMargin(index, event.target.value)}>
                        </input></div>
                        <div className="margin-slider"><p>right margin</p>
                        <input name="rightMargin" type="range" min="0" max="20" step=".1" value={input.rightMargin.slice(0, -3)} 
                            onChange={event => changeRightMargin(index, event.target.value)}>
                        </input></div></div>
                        
                        // #####################################################
                        // ###################   T E X T   #####################
                        : textarea &&
                        input.type === "text" ?<>
                        {!input.deleting ? 
                        <textarea
                            autoFocus="+true"
                            rows={4}
                            key={index}
                            placeholder="write text here"
                            name={"input"+JSON.stringify(index)}
                            className={`input-textarea insert-input`}
                            value={input.output}
                            onChange={event => updateInputOutput(index, event.target.value)}/>
                            :<div></div>}
                        </>
                        : input.type === "video" ?<>
                        {!input.deleting ?
                        <textarea
                            autoFocus="+true"
                            name={"input"+JSON.stringify(index)}
                            className={`input-textarea insert-input`}
                            rows={1} placeholder={"Add youtube link"}
                            value={input.output}
                            onChange={event => updateInputOutput(index, event.target.value)}/>
                            :<div></div>}</>
                        : input.type === "image" &&<>
                        {!input.deleting ?
                        <textarea
                            autoFocus="+true" 
                            name={"input"+JSON.stringify(index)}
                            className={`input-textarea insert-input`}
                            rows={1} placeholder={"image url goes here"}
                            value={input.output}
                            onChange={event => updateInputOutput(index, event.target.value)}/>
                            :<div></div>}</>      
                        }
                    </div>
                    /* #########################   s h o w I n s e r t B t n s  ===  - 1   ######################## */
                    :showInsertBtns === -1 && 
                    <textarea 
                        className="edit-post-textarea edit-post-title"
                        cols={200}
                        rows={1}
                        value={postObj.title}
                        onChange={(event) => setPostObj({...postObj, title: event.target.value})}/>}
                </div>
            <p className="insert-section-btn" onClick={()=>inserting(index)}></p>
            </div>
        )
    }
    
    return (
        <div className="page-body post">
            <button disabled={pagePause && "+true"} className="edit-post-btn" onClick={cancel}>cancel</button>
            <button disabled={pagePause && "+true"} className="edit-post-btn" onClick={save}>save</button>
            <div className="view-post-container">
                <div className="post-header">
                    <p 
                        className="post-author"
                        onClick={() => props.sendUID(foundUser.uid)}>Authored by: {foundUser.username}
                    </p>
                    <img alt={foundUser.username} src={foundUser.defaultPic} className="post-defaultPic"/>
                </div>
                <h4 className="post-title" onClick={()=> modifyInput(0)}>{postObj.title}</h4>
                <div className="post-body">
                    {postObj && postObj.inputs.length === 0 && insertingMode===false&&<p className="insert-section-btn" onClick={()=>inserting(0)}></p>}
                    {postObj && postObj.inputs.length === 0 && insertingMode && <InsertBtns index={0} />}
                    <div className="input-chain">
                        {postObj && postObj.inputs.length > 0 && inputs(postObj.inputs)}
                    </div>
                </div>
            </div>
        </div>
    )
}
// #############################
// #############################
// #############################
// #############################
// #############################
// #############################
// #############################
// #############################
// #############################
// #############################
// #############################
