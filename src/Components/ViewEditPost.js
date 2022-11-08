import React, {useEffect, useState, useLayoutEffect} from "react";
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
        await updateDoc(docRef, {...postObj, numArr: numArr})
    }

    function cancel(){
        props.cancel();
    }
    function save(){
        updatePost();
        props.cancel();
    }
// ###########################################################################



    const [titleValue, setTitleValue] = useState("")
    const [ postObj, setPostObj ] = useState("");
    const [numArr, setNumArr] = useState([]);
    const [numInputs, setNumInputs] = useState(0);
    useEffect(() => {
        setTitleValue(foundPost.title)
        setPostObj(foundPost)
        for(let i = 0; i< foundPost.numInputs; i++)
        setNumArr(prev => {
            prev.push(foundPost.numArr[i])
            return prev
        })
        setNumInputs(foundPost.numInputs)
    }, [foundPost])



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
        setPostObj({...copy2, numInputs:numInputs+1});
        setNumInputs(prevNumInputs => prevNumInputs+=1);
        console.log(postObj)
        setNumArr(prev => {
            prev.push(numArr.length+1)
            return prev
        })
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
        setPostObj({...copy2, numInputs:numInputs+1});
        setNumInputs(prevNumInputs => prevNumInputs+=1);
        console.log(postObj)
        setNumArr(prev => {
            prev.push(numArr.length+1)
            return prev
        })
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
        setPostObj({...copy2, numInputs:numInputs+1});
        setNumInputs(prevNumInputs => prevNumInputs+=1);
        console.log(postObj)
        setNumArr(prev => {
            prev.push(numArr.length+1)
            return prev
        })
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
            <div className={`insert-input ${postObj[`${`input`+num}`].output === "" ? "insert-input-animation": postObj[`${`input`+num}`].deleting === true && "delete-input-animation"}`}>
                
                <div className="edit-post-btns">
                    <>
                    {<button onClick={toggleButtons} className={showButtons === false ? "edit-post-btn post-input" : "edit-post-btn post-input invisible-p"}>insert</button>}
                    </>
                    {showButtons &&
                    <>
                        <button className="edit-post-btn post-input cancel-insert" onClick={()=>setShowButtons(false)}>cancel</button>
                        <button className="edit-post-btn post-input" onClick={()=> addText(num)}>add text</button>
                        <button className="edit-post-btn post-input" onClick={()=> addImage(num)}>add image</button>
                        <button className="edit-post-btn post-input" onClick={()=> addVideo(num)}>add video</button>
                    </>}
                </div>
                <textarea  
                    name={postObj[`${`input`+num}`]}
                    className={`create-post-video-textarea`}
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
            <div className={`insert-input ${postObj[`${`input`+num}`].output === "" ? "insert-input-animation": postObj[`${`input`+num}`].deleting === true && "delete-input-animation"}`}>
                
                <div className="edit-post-btns">
                    <>
                    {<button onClick={toggleButtons} className={showButtons === false ? "edit-post-btn post-input" : "edit-post-btn post-input invisible-p"}>insert</button>}
                    </>
                    {showButtons &&
                    <>
                        <button className="edit-post-btn post-input cancel-insert" onClick={()=>setShowButtons(false)}>cancel</button>
                        <button className="edit-post-btn post-input" onClick={()=> addText(num)}>add text</button>
                        <button className="edit-post-btn post-input" onClick={()=> addImage(num)}>add image</button>
                        <button className="edit-post-btn post-input" onClick={()=> addVideo(num)}>add video</button>
                    </>}
                </div>
                <textarea
                    rows={1}
                    name={postObj[`${`input`+num}`]}
                    className="create-post-video-textarea"
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
            <div className={`insert-input ${postObj[`${`input`+num}`].output === "" ? "insert-input-animation": postObj[`${`input`+num}`].deleting === true && "delete-input-animation"}`}>
                
                <div className="edit-post-btns">
                    <>
                    {<button onClick={toggleButtons} className={showButtons === false ? "edit-post-btn post-input" : "edit-post-btn post-input invisible-p"}>insert</button>}
                    </>
                    {showButtons &&
                    <>
                        <button className="edit-post-btn post-input cancel-insert" onClick={()=>setShowButtons(false)}>cancel</button>
                        <button className="edit-post-btn post-input" onClick={()=> addText(num)}>add text</button>
                        <button className="edit-post-btn post-input" onClick={()=> addImage(num)}>add image</button>
                        <button className="edit-post-btn post-input" onClick={()=> addVideo(num)}>add video</button>
                    </>}
                </div>
                <textarea
                    rows={1}
                    name={postObj[`${`input`+num}`]}
                    className="create-post-video-textarea"
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
    console.log("wsdfeesdfsdfsfee")
    console.log(postObj);
    
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
                    value={postObj.title}
                    onChange={(event) => setPostObj({...postObj, title: event.target.value})}
                />
                <div className="post-body">
                    {numArr.length === 0 &&
                    <div className="insert-input">
                        <p>Add input(s)</p>
                        <button onClick={()=>addText(1)}>add text</button>
                        <button onClick={()=> addImage(1)}>add image</button>
                        <button onClick={()=>addVideo(1)}>add video</button>
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
                            <button className="edit-post-btn post-input" onClick={()=> addText(numArr.length+1)}>add text</button>
                            <button className="edit-post-btn post-input" onClick={()=> addImage(numArr.length+1)}>add image</button>
                            <button className="edit-post-btn post-input" onClick={()=> addVideo(numArr.length+1)}>add video</button>
                        </>}
                    </div>
                    }
                </div>
            </div>
        </div>
    )
}