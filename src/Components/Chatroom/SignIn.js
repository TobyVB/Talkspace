import firebase from 'firebase/compat/app';
import React from "react";


export default function SignIn(){
    const firestore = firebase.firestore();
    const auth = firebase.auth();

    const signInWithGoogle = () => {
        const provider = new firebase.auth.GoogleAuthProvider();
        auth.signInWithPopup(provider)
    }

    const signInAsGuest = () => {
        auth.signInAnonymously(auth)
        .then(() => {
            console.log("You signed in anonymously.")
        })
        .catch((error) => {
            const errorCode = error.code;
            const errorMessage = error.message;
            console.log("You were unable to sign in anonymously.")
        })
    }
    
    const [nickname, setNickname] = React.useState('');
    const [hideForm, setHideForm] = React.useState(false);
    const [showLoginOptions, setShowLoginOptions] = React.useState(false);

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
            {showLoginOptions && 
                <>
                    <button onClick={signInWithGoogle}> Sign in with Google </button>
                    <button onClick={signInAsGuest}> View as guest</button>
                </>
            }
            {!hideForm &&
            <form className="form-nickname" onSubmit={submit}>
                <input
                    onChange={handleChange}
                    placeholder="make nickname"
                    type="text"
                    name="nickname"
                    value={nickname}
                ></input>
                <button>submit</button>
            </form>}
        </>
    )
}
