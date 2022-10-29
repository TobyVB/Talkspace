import {getAuth, createUserWithEmailAndPassword, sendEmailVerification} from "firebase/auth";
import { getFirestore, collection, addDoc,
     serverTimestamp, onSnapshot, doc,
      updateDoc, query, orderBy 
    } from "firebase/firestore";
import { useCollectionData } from 'react-firebase-hooks/firestore';
import { getStorage, ref, getDownloadURL } from "firebase/storage";
import { nanoid } from 'nanoid';
import React, { useEffect, useRef, useState } from "react";

export default function Register(props){
    const db = getFirestore();
    const auth = getAuth();
    const emailRef = useRef();
    const passwordRef = useRef();
    // const usernameRef = useRef();
    const [email, setEmail] = useState("");
    const [username, setUsername] = useState("");
    const [loading, setLoading] = useState(false);

    const [unique, setUnique] = useState(nanoid());

    const usersRef = collection(db, 'users');
    const qUsers = query(usersRef, orderBy('createdAt'));
    const [users] =  useCollectionData(qUsers, {
        username: 'username'
    });
    
    useEffect(() => {
        window.scrollTo(0, 0)
    }, [])

    const storage = getStorage();
    const [letterRef, setLetterRef] = useState("")
    
    const capL = username.charAt(0).toUpperCase()
    const lowL = username.charAt(0).toLowerCase()
    const letters = ['a','b','c','d','e','f','g','h',
    'i','j','k','l','m','n','o','p','q','r',
    's','t','u','v','w','x','y','z']
    

    useEffect(() => {
        setLetterRef(ref(storage, `defLetters/letter${(capL)}.png`))
    }, [username])
    useEffect(() => {
        console.log(letterRef)
    },[letterRef])

    function signup(email, password) {
        return createUserWithEmailAndPassword(auth, email, password)
    }

    async function handleSignup() {
        let defaultPic = "";
        getDownloadURL(letterRef)
        .then((url) => {
            console.log("This is the url: "+url);
            defaultPic = url;
        })
        .catch((error) => {
            console.log(error);
        });
        
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
            defaultPic: defaultPic
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
                        id="email"
                        className="input-user-cred"
                        placeholder="email"
                        name="email"
                        onChange={(event)=> setEmail(event.target.value)}
                        value={email}
                    />

                    {users && users.filter(user => user.email === email).length > 0
                    ? <p>... email already in use</p>
                    :<p className="invisible-p">invisible text</p>
                    }
                    
                    <label htmlFor="password">Password</label>
                    <input
                        ref={passwordRef}
                        id="password"
                        className="input-user-cred"
                        placeholder="password"
                        type="password"
                        name="password"
                    />
                    {/* <p>... password must be between 6 and 50 characters and include letters and numbers</p> */}
                    <label htmlFor="username">Username</label>
                    <input
                        id="username"
                        className="input-user-cred"
                        placeholder="username"
                        name="username"
                        onChange={(event)=> setUsername(event.target.value)}
                        value={username}
                    />
                    
                    {users && users.filter(user => user.username === username).length > 0 ?
                            <p>... username is already taken</p>
                            :<p className="invisible-p"></p>
                            // make unclickable and invisible, etc
                    }
                    {!letters.includes(lowL) ?
                        <p>... must start with a letter</p>
                        :<p className="invisible-p">invisible text</p>
                    }
                    <hr/>
                    {users && users.filter(user => user.username === username).length < 1 
                    && 
                    letters.includes(lowL)
                    &&
                    users && users.filter(user => user.email === email).length === 0
                    ?
                    <button className="btn-user-cred" 
                        disabled={loading} 
                        onClick={handleSignup}>register
                    </button>
                    :
                    <button className="btn-user-cred" 
                        disabled="+true" 
                        onClick={handleSignup}>register
                    </button>
                    }
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