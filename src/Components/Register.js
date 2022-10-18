// #############################################################################
// ############################# I M P O R T S #################################
// #############################################################################
import {getAuth, createUserWithEmailAndPassword} from "firebase/auth";
import { getFirestore, collection, addDoc,
     serverTimestamp, onSnapshot, doc,
      updateDoc, query, orderBy 
    } from "firebase/firestore";
import {storage} from '../App.js';
import {ref, uploadBytes, getDownloadURL} from "firebase/storage";

import * as imageConversion from 'image-conversion';

import { nanoid } from 'nanoid';

import React, {useEffect, useRef, useState} from "react";

// #############################################################################
// ######################## R E G I S T E R   F U N C. #########################
// #############################################################################
export default function Register({updatePage}){
    const db = getFirestore();
    const usersRef = collection(db, 'users');
    const auth = getAuth();
    function signup(email, password) {
        return createUserWithEmailAndPassword(auth, email, password);
    }
    const emailRef = useRef();
    const passwordRef = useRef();
    const [randomNum, setRandomNum] = useState(nanoid())
    const [loading, setLoading] = useState(false);
    const [username, setUsername] = useState('');

    const [unique, setUnique] = useState(nanoid())
    window.scrollTo(0, 0)

    function handleChange(event){
        const target = event.target;
        const name = target.name;
        const value = target.value;
        setUsername(value)
    }

    async function handleSignup() {
        localStorage.setItem('username', username)
        setLoading(true);
        try {
            await signup(emailRef.current.value, passwordRef.current.value);
        } catch {
            console.log("error with handleSignup function in Register.js");
        }
        await addDoc(usersRef, {
            email: auth.currentUser.email,
            username: username,
            uid: auth.currentUser.uid,
            createdAt: serverTimestamp(),
            defaultPic: url,
            defPicLoc: randomNum,
            unique: unique,
        })
        // UPDATE HAS BEEN UPDATED...
        .then(() => {
            const q = query(usersRef, orderBy('createdAt'))
            onSnapshot(q, async (snapshot) => {
                snapshot.docs.forEach((document) => {
                    const docRef = doc(db, 'users', document.id)
                    if(document.data().unique === unique){
                        console.log(unique)
                        updateDoc(docRef, {
                            id: document.id
                        })
                    }
                })
            })
        })
        setImage(null);
        setLoading(false);
        updatePage(); 
        URL.revokeObjectURL(image) 
    }
    
// #############################################################################
// ######################## I M A G E   S T U F F ##############################
// #############################################################################
    const [image, setImage] = useState(null);
    const [url, setUrl] = useState(null);
    const [objURL, setObjURL] = useState("")

    // This is to make sure createObjectURL only runs once
    useEffect(()=> {
        setObjURL(image?URL.createObjectURL(image):null)
    },[image])

    const handleImageChange = (e) => {
        if (e.target.files[0]) {
            const file = e.target.files[0];
            console.log("file is: "+file);
            imageConversion.compressAccurately(file, 100).then(res=>{
                console.log(res);
                setImage(res)
            })
        }
        setReady(false);
    }
    const handleSubmit = () => {
        const imageRef = ref(storage, randomNum);
        uploadBytes(imageRef, image).then(() => {
            getDownloadURL(imageRef).then((url) => {
                setUrl(url);
            })
            .catch((error) => {
                console.log(error.message, "error getting image address")
            });
        }).catch((error) => {
            console.log(error.message)
        })
        setReady(true);
    };

    const [ready, setReady] = useState(false);

// #############################################################################
// #############################  R E T U R N  #################################
// #############################################################################
    return (
        <>  
            <div className="register-page page-body">
                <div className="form-register-email">
                    <h1>SIGN UP</h1>
                    <label htmlFor="email">Email</label>
                    <input
                        ref={emailRef}
                        id="email"
                        className="input-register"
                        placeholder="email"
                        name="email"
                    />
                    <label htmlFor="password">Password</label>
                    <input
                        ref={passwordRef}
                        id="password"
                        className="input-register"
                        placeholder="password"
                        type="password"
                        name="password"
                    />
                    <label htmlFor="username">Username</label>
                    <input
                        id="username"
                        className="input-register"
                        placeholder="username"
                        name="username"
                        value={username}
                        onChange={handleChange}
                    />
                    <hr />
                    <h2>Set Avatar</h2>
                    <input 
                        className="fileTypeInput" 
                        type="file" 
                        accept=".jpg, .jpeg, .png" 
                        onChange={handleImageChange} /> 
                    <img    
                        className="preview-image"
                        alt="preview profile"
                        src={image !== null ?objURL:null}
                    />
                    <button className="finalizeImage register-btn" 
                        disabled={image === null || ready === true} 
                        onClick={handleSubmit}>finalize image</button>
                    <button className="register-btn btm-btn" 
                        disabled={loading || ready === false} 
                        onClick={handleSignup}>register</button>
                </div>
            </div>
        </>
    )
}


 
