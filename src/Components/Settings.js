import React, {useEffect} from "react";

export default function Settings(props){

    useEffect(() => {
        window.scrollTo(0, 0)
    }, [])

    // const userEmail = 'user@example.com';
    // getAuth()
    //     .generatePasswordResetLink(userEmail, actionCodeSettings)
    //     .then((link) => {
    //         // Construct password reset email template, embed the link and send
    //         // using custom SMTP server.
    //         return sendCustomPasswordResetEmail(userEmail, displayName, link);
    //     })
    //     .catch((error) => {
    //         // Some error occurred.
    //     });



    return (
        <div className="page-body settings">
            <h1 className="settings-title">Settings</h1>
            <hr></hr>
            <div className="settings-buttons">
                <button onClick={props.changeUsername} >change username</button>
                {/* <button onClick={props.updateEmail} >update email</button> */}
                <button onClick={props.retreivePassword} >retrieve password</button>
                <button onClick={props.changePassword} >change password</button>
                <button onClick={props.deleteAccount} >delete account</button>
            </div>
        </div>
    )
}