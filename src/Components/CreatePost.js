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

    const [link, setLink] = useState("");
    const [input, setInput] = useState("");
    // const [link0, setLink0] = useState("")
    // const [link1, setLink1] = useState("")
    // const [link2, setLink2] = useState("")


    // deleteField will actually be used in ViewEditPost.js not here
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

    const [numInputs, setNumInputs] = useState(0);

    const [ postObj, setPostObj ] = useState({
        uid: auth.currentUser.uid,
        follows: [],
        approval: [],
        disapproval: [],
        createdAt: serverTimestamp(),
        unique: unique,
        title:formValueTitle,
        body: formValueBody,
        numInputs: numInputs
    })
    function addText(e){
        e.preventDefault()
        setPostObj ({...postObj, 
            ["input"+JSON.stringify(numInputs+1)]: ["1"+input],
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
            ["input"+JSON.stringify(numInputs+1)]: ["2"+input],
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


    function deleteInput(e)  {
        if(postObj.numInputs === 1){
            setPostObj(current => {
                const copy = {...current};
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
            for(let i=postObj.numInputs; i >= e; i--){
                copy3 = {...copy2}
                delete copy3[`${`input`+e}`];
                copy3 = {...copy2, 
                [`${`input`+e}`]: postObj[`${`input`+JSON.stringify(JSON.parse(e)+1)}`]
                }
                delete copy3[`${`input`+JSON.stringify(JSON.parse(e)+1)}`]
                // setPostObj(copy3);
            }
            setPostObj(copy3);




            






            // for(let i=postObj.numInputs; i >= e; i--){
            //     setPostObj(current => {
            //         let copy = {...current};
            //         delete copy[`${`input`+e}`];
            //         copy = {...current, 
            //             [`${`input`+e}`]: postObj[`${`input`+JSON.stringify(JSON.parse(e)+1)}`]
            //         }
            //         delete copy[`${`input`+JSON.stringify(JSON.parse(e)+1)}`]
            //         return copy
            //     })
            // }

        }
        
        console.log(postObj)
    };
    
    const [numArr, setNumArr] = useState([]);
    const inputs = (nums) => {
        // console.log(postObj[`${`input`+num}`][0])
        return nums.map(num => 
            postObj.numInputs > 0 && postObj[`${`input`+num}`] && postObj[`${`input`+num}`][0] === "1" ?
            <div className="insert-input">
                <p>text</p>
                <button onClick={()=> deleteInput(num)}>delete</button>
                <button onClick={addText}>add text</button>
                <button onClick={addVideo}>add video</button>
            </div>
            :
            postObj[`${`input`+num}`] &&
            postObj[`${`input`+num}`][0] === "2" &&
            <div className="insert-input">
                <p>video</p>
                <button onClick={()=> deleteInput(num)}>delete</button>
                <button onClick={addText}>add text</button>
                <button onClick={addVideo}>add video</button>
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
                        value={formValueTitle} 
                        onChange={(event) => setFormValueTitle(event.target.value)} 
                    />
                    <div className="insert-input">
                        <p>Add input(s)</p>
                        <button onClick={addText}>add text</button>
                        <button onClick={addVideo}>add video</button>
                    </div>
                    {inputs(numArr)}

                
                    {/* 
                        <textarea 
                            className="create-post-video-textarea" 
                            cols={120} 
                            rows={5}
                            value={formValueBody} 
                            onChange={(event) => setFormValueBody(event.target.value)} 
                            placeholder="Add post body..." 
                        />
                        <button onClick={insertInput}>insert input</button>
                    */}



                    {/* <textarea 
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
                    /> */}
                    {/* {Object.keys(postObj).forEach(function(key, index){
                        if(postObj.input1 === "2"){
                            <textarea
                                key={index}
                                className="create-post-video-textarea"
                                cols={1} 
                                type="text" 
                                placeholder="youtube link..."
                                value={JSON.parse("link"+JSON.stringify(index))}
                                onChange={(event) => JSON.parse("setInput"+JSON.stringify(index))(event.target.value)}
                            />
                        } else if (key[0] === 1) {
                            <textarea 
                                key={index}
                                className="create-post-video-textarea" 
                                cols={120} 
                                rows={5}
                                value={key} 
                                onChange={(event) => JSON.parse("setInput"+JSON.stringify(index))(event.target.value)} 
                                placeholder="Add post body..." 
                            />
                        }
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
                    {/* <button onClick={addVideo}>testAdd</button> */}
                    <button className="create-post-btn" type="submit" disabled={!formValueTitle}>create post</button>
                </div>
                }
                {/* <h3 className="create-post-title">{formValueTitle}</h3>
                <p className="create-post-body">{formValueBody}</p> */}
            </div>
            
        </>
    )
}