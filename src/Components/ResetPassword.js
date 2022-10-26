
export default function ResetPassword(props){
    
    return (
        <div className="page-body reset-password">
            <h1>Reset Password</h1>
            <button onClick={props.cancel}>cancel</button>
        </div>
    )
}