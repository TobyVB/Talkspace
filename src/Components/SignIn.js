import {getAuth, signInAnonymously} from "firebase/auth"

import React from "react";


export default function Anonymous(){
    const auth = getAuth();

    // const signInWithGoogle = () => {
    //     const provider = new firebase.auth.GoogleAuthProvider();
    //     auth.signInWithPopup(provider)
    // }

    const signInAsGuest = () => {
        signInAnonymously(auth)
        .then(() => {
            setHideForm(false);
            setShowLoginOptions(false);
            console.log("You signed in anonymously.")
        })
        .catch((error) => {
            const errorCode = error.code;
            const errorMessage = error.message;
            console.log("You were unable to sign in anonymously.")
        })
    }
    
    const [nickname, setNickname] = React.useState('');
    const [hideForm, setHideForm] = React.useState(true);
    const [showLoginOptions, setShowLoginOptions] = React.useState(true);

    // create nickname
    function handleChange(event){
        const target = event.target;
        const name = target.name;
        const value = target.value;
        setNickname(value)
    }

    // send nickname to local storage
    const submit = async (e) => {
        e.preventDefault();
        await JSON.stringify(localStorage.setItem('nickname', nickname));
        setHideForm(true);
        setShowLoginOptions(true);
    }
    
    
    return (
        <>  
            <div className="sign-in-page">
                {showLoginOptions && 
                    <div className="signin-btns">
                        {/* <button className="signin-btn" onClick={signInWithGoogle}> Sign in with Google </button> */}
                        <button className="signin-btn" onClick={signInAsGuest}> View as guest</button>
                    </div>
                }
                {!hideForm &&
                <form className="form-nickname" onSubmit={submit}>
                    <label htmlFor="nicknameId">Sign in anonymously</label>
                    <input
                        id="nickname"
                        className="input-nickname"
                        onChange={handleChange}
                        placeholder="make nickname"
                        type="text"
                        name="nickname"
                        value={nickname}
                    ></input>
                    <button>submit</button>
                </form>}
            </div>
            
        </>
    )
}
