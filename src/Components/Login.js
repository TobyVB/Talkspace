// #############################################################################
// ############################# I M P O R T S #################################
// #############################################################################
import {getAuth, signInWithEmailAndPassword} from "firebase/auth";
import React, {useEffect, useRef, useState} from "react";

// #############################################################################
// ########################### L O G I N   F U N C. ############################
// #############################################################################
export default function Login(props){
    const auth = getAuth();
    function login(email, password) {
        return signInWithEmailAndPassword(auth, email, password);
    }

    const emailRef = useRef();
    const passwordRef = useRef();

    // loading is just used for disabling button
    const [loading, setLoading] = useState(false);
    async function handleLogin() {
        setLoading(true);
        try {
            await login(emailRef.current.value, passwordRef.current.value);
        } catch {
            console.log("error with handleSignup function in Register.js");
        }
        setLoading(false);
        props.updateReady();
        window.location.reload(false);
    }
// #############################################################################
// #############################  R E T U R N  #################################
// #############################################################################
    return (
        <>  
            <div className="login-page page-body">
                <div className="form-login-email" >
                    <h1>LOG IN</h1>
                    <label htmlFor="email">Enter email</label>
                    <input
                        ref={emailRef}
                        id="email"
                        className="input-login"
                        placeholder="email"
                        name="email"
                    />
                    <label htmlFor="password">Enter password</label>
                    <input
                        ref={passwordRef}
                        id="password"
                        className="input-login"
                        placeholder="password"
                        type="password"
                        name="password"
                    ></input>
                    <button className="login-btn" disabled={loading} onClick={handleLogin}>login</button>
                </div>
            </div>
        </>
    )
}



