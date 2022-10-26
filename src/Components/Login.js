import React, { useEffect, useRef, useState } from "react";
import { useCollectionData } from 'react-firebase-hooks/firestore';
import { getAuth, signInWithEmailAndPassword } from "firebase/auth";
import { query, orderBy, collection, getFirestore
} from "firebase/firestore";

export default function Login(props){
    const auth = getAuth();
    const db = getFirestore();

    function login(email, password) {
        return signInWithEmailAndPassword(auth, email, password);
    }

    const emailRef = useRef();
    const passwordRef = useRef();

    const usersRef = collection(db, 'users');
    const qUsers = query(usersRef, orderBy('createdAt'));
    const [users] = useCollectionData(qUsers, { 
      createdAt: 'createdAt', 
      uid: `uid`,
      username: 'username',
      email: 'email'
    });

    // loading is just used for disabling button
    const [loading, setLoading] = useState(false);
    async function handleLogin() {
        // let userLength = 0;
        // users.forEach(userDoc => {
        //     if(userDoc.email === emailRef.current.value){
        //         userLength ++;
        //     }
        // })
        // if(userLength === 1){
            setLoading(true);
            try {
                await login(emailRef.current.value, passwordRef.current.value);
            } catch {
                console.log("error with handleSignup function in Register.js");
            }
            setLoading(false);
            props.updateReady();
            window.location.reload(false);
        // }
    }

    return (
        <div className="login-page page-body">
            <div className="form-login-email" >
                <h1>LOG IN</h1>
                <label htmlFor="email">Enter email</label>
                <input
                    ref={emailRef}
                    id="email"
                    className="input-user-cred"
                    placeholder="email"
                    name="email"
                />
                <label htmlFor="password">Enter password</label>
                <input
                    ref={passwordRef}
                    id="password"
                    className="input-user-cred"
                    placeholder="password"
                    type="password"
                    name="password"
                ></input>
                <hr></hr>
                <button className="btn-user-cred" disabled={loading} onClick={handleLogin}>login</button>
            </div>
        </div>
    )
}



