import {getAuth, createUserWithEmailAndPassword, sendEmailVerification} from "firebase/auth";
import { getFirestore, collection, addDoc,
     serverTimestamp, onSnapshot, doc,
      updateDoc, query, orderBy 
    } from "firebase/firestore";
import { nanoid } from 'nanoid';
import React, { useRef, useState } from "react";

export default function Register(props){
    const db = getFirestore();
    const usersRef = collection(db, 'users');
    const auth = getAuth();
    const emailRef = useRef();
    const passwordRef = useRef();
    const usernameRef = useRef();
    const [loading, setLoading] = useState(false);

    const [unique, setUnique] = useState(nanoid())
    window.scrollTo(0, 0)

    function signup(email, password) {
        return createUserWithEmailAndPassword(auth, email, password)
    }

    async function handleSignup() {
        localStorage.setItem('username', usernameRef.current.value)
        setLoading(true);
        try {
            await signup(emailRef.current.value, passwordRef.current.value);
        } catch {
            console.log("error with handleSignup function in Register.js");
        }
        await addDoc(usersRef, {
            email: auth.currentUser.email,
            username: usernameRef.current.value,
            uid: auth.currentUser.uid,
            createdAt: serverTimestamp(),
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
                        ref={usernameRef}
                        id="username"
                        className="input-user-cred"
                        placeholder="username"
                        name="username"

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