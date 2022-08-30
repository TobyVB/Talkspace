
export default function Post(props){
    return (
        <div className="post">
            <h1>{props.title}</h1>
            <p>{props.body}</p>
        </div>
    )
}