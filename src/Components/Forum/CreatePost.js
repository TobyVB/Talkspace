import {post} from "../../App.js";
import React from "react";

export default function CreatePost(){

    const [post, setPost] = React.useState({
        title: "",
        body: ""
    })

    function submit(){
        localStorage.setItem("title", post.title)
        localStorage.setItem("body", post.body)
    }

    function handleChange(event){
        const target = event.target;
        const name = target.name;
        const value = target.value;
        setPost(prevPosts => {
          return (
            {...prevPosts, [name]:value}
          )
        })
        console.log(value);
        console.log(`this is ${post.title}`)
    };

    return (
        <form onSubmit={submit}>
            <input
                type="text"
                onChange={handleChange}
                name="title"
                value={post.title}
                placeholder="title here"
            >

            </input>
            <input
                type="text-area"
                onChange={handleChange}            
                name="body"
                value={post.body}
                placeholder="body here"
            >
            
            </input>
            <button>Submit</button>
        </form>
    )
    
}