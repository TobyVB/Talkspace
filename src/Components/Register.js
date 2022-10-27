import {getAuth, createUserWithEmailAndPassword, sendEmailVerification} from "firebase/auth";
import { getFirestore, collection, addDoc,
     serverTimestamp, onSnapshot, doc,
      updateDoc, query, orderBy 
    } from "firebase/firestore";
import { getStorage, ref } from "firebase/storage";
import { nanoid } from 'nanoid';
import React, { useEffect, useRef, useState } from "react";

export default function Register(props){
    const db = getFirestore();
    const usersRef = collection(db, 'users');
    const auth = getAuth();
    const emailRef = useRef();
    const passwordRef = useRef();
    // const usernameRef = useRef();
    const [username, setUsername] = useState("");
    const [loading, setLoading] = useState(false);

    const [unique, setUnique] = useState(nanoid())
    window.scrollTo(0, 0)


    const storage = getStorage();
    const [letterRef, setLetterRef] = useState("")

    useEffect(() => {
        if(username.charAt(0).toLowerCase()=== "a"){
            setLetterRef(ref(storage, 'defLetters/letterA.png'))
        } else if(username.charAt(0).toLowerCase()=== "b"){
            setLetterRef(ref(storage, 'defLetters/letterB.png'))
        } else if(username.charAt(0).toLowerCase()=== "c"){
            setLetterRef(ref(storage, 'defLetters/letterC.png'))
        } else if(username.charAt(0).toLowerCase()=== "d"){
            setLetterRef(ref(storage, 'defLetters/letterD.png'))
        } else if(username.charAt(0).toLowerCase()=== "e"){
            setLetterRef(ref(storage, 'defLetters/letterE.png'))
        } else if(username.charAt(0).toLowerCase()=== "f"){
            setLetterRef(ref(storage, 'defLetters/letterF.png'))
        } else if(username.charAt(0).toLowerCase()=== "g"){
            setLetterRef(ref(storage, 'defLetters/letterG.png'))
        } else if(username.charAt(0).toLowerCase()=== "h"){
            setLetterRef(ref(storage, 'defLetters/letterH.png'))
        } else if(username.charAt(0).toLowerCase()=== "i"){
            setLetterRef(ref(storage, 'defLetters/letterI.png'))
        } else if(username.charAt(0).toLowerCase()=== "j"){
            setLetterRef(ref(storage, 'defLetters/letterJ.png'))
        } else if(username.charAt(0).toLowerCase()=== "k"){
            setLetterRef(ref(storage, 'defLetters/letterK.png'))
        } else if(username.charAt(0).toLowerCase()=== "l"){
            setLetterRef(ref(storage, 'defLetters/letterL.png'))
        } else if(username.charAt(0).toLowerCase()=== "m"){
            setLetterRef(ref(storage, 'defLetters/letterM.png'))
        } else if(username.charAt(0).toLowerCase()=== "n"){
            setLetterRef(ref(storage, 'defLetters/letterN.png'))
        } else if(username.charAt(0).toLowerCase()=== "o"){
            setLetterRef(ref(storage, 'defLetters/letterO.png'))
        } else if(username.charAt(0).toLowerCase()=== "p"){
            setLetterRef(ref(storage, 'defLetters/letterP.png'))
        } else if(username.charAt(0).toLowerCase()=== "q"){
            setLetterRef(ref(storage, 'defLetters/letterQ.png'))
        } else if(username.charAt(0).toLowerCase()=== "r"){
            setLetterRef(ref(storage, 'defLetters/letterR.png'))
        } else if(username.charAt(0).toLowerCase()=== "s"){
            setLetterRef(ref(storage, 'defLetters/letterS.png'))
        } else if(username.charAt(0).toLowerCase()=== "t"){
            setLetterRef(ref(storage, 'defLetters/letterT.png'))
        } else if(username.charAt(0).toLowerCase()=== "u"){
            setLetterRef(ref(storage, 'defLetters/letterU.png'))
        } else if(username.charAt(0).toLowerCase()=== "v"){
            setLetterRef(ref(storage, 'defLetters/letterV.png'))
        } else if(username.charAt(0).toLowerCase()=== "w"){
            setLetterRef(ref(storage, 'defLetters/letterW.png'))
        } else if(username.charAt(0).toLowerCase()=== "x"){
            setLetterRef(ref(storage, 'defLetters/letterX.png'))
        } else if(username.charAt(0).toLowerCase()=== "y"){
            setLetterRef(ref(storage, 'defLetters/letterY.png'))
        } else if(username.charAt(0).toLowerCase()=== "z"){
            setLetterRef(ref(storage, 'defLetters/letterZ.png'))
        }
        console.log(letterRef)
    }, [username])
    
    // function getRandomInt(max) {
    //     return Math.floor(Math.random() * max);
    //   }

    function signup(email, password) {
        return createUserWithEmailAndPassword(auth, email, password)
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
            unique: unique,
            defaultPic: letterRef
            // first: usernameRef.current.value.charAt(0),
            // bgColor: `rgb(${getRandomInt(255), getRandomInt(255), getRandomInt(255)})`
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
        .then(() => {
            sendEmailVerification(auth.currentUser)
            .then(() => {
                // Email verification sent!
                // ...
            });
        })
        .then(() => {
            props.exit();
        })
        .then(() => {
            setLoading(false);
            props.updatePage(); 
        })
    }

    return (
        <>  
            <div className="register-page page-body">
                <div className="form-register-email">
                    <h1>SIGN UP</h1>
                    <label htmlFor="email">Email</label>
                    <input
                        ref={emailRef}
                        id="email"
                        className="input-user-cred"
                        placeholder="email"
                        name="email"
                    />
                    <p>... not a valid email</p>
                    <label htmlFor="password">Password</label>
                    <input
                        ref={passwordRef}
                        id="password"
                        className="input-user-cred"
                        placeholder="password"
                        type="password"
                        name="password"
                    />
                    <p>... password must be between 6 and 50 characters and include letters and numbers</p>
                    <label htmlFor="username">Username</label>
                    <input
                        // ref={usernameRef}
                        id="username"
                        className="input-user-cred"
                        placeholder="username"
                        name="username"
                        onChange={(event)=> setUsername(event.target.value)}
                        value={username}
                    />
                    <p>... username is already taken</p>
                    <hr/>
                    <button className="btn-user-cred" 
                        disabled={loading} 
                        onClick={handleSignup}>register</button>
                </div>
            </div>
        </>
    )
}

// Some snippets for future reference incase I auto delete unverified accounts after 
// 10 minutes in this case..
// 60000 is the same as one minute....

// const d1 = new Date();
// const currentTime = d1.getTime();

// if(document.data().isVerified === false){
    //     if(currentTime - document.data().createdAt.toDate().getTime() < 600000){
    //         // delete doc and delete user
            
    //     }
// }