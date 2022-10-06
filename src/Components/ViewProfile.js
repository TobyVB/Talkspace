// #############################################################################
// ############################# I M P O R T S #################################
// #############################################################################
import { doc, deleteDoc, getFirestore,
    updateDoc, query, orderBy,
    onSnapshot, collection
} from "firebase/firestore";
import { useCollectionData } from 'react-firebase-hooks/firestore';
import { getAuth, deleteUser } from "firebase/auth";
import {ref, uploadBytes, getDownloadURL} from "firebase/storage";

import {storage} from '../App.js';
import React, {useEffect, useState} from "react";
import * as imageConversion from 'image-conversion';
import { nanoid } from 'nanoid';
// #############################################################################
// ######################### P R O F I L E   F U N C. ##########################
// #############################################################################
export default function ViewProfile(props){
    const db = getFirestore();
    const auth = getAuth();
    const usersRef = collection(db, 'users');

    const [currentUser, setCurrentUser] = useState("")
    const [showSettings, setShowSettings] = useState(false)

    const [randomNum, setRandomNum] = useState(nanoid())
    const [image, setImage] = useState(null);
    const [url, setUrl] = useState(null);
    const [defPicLoc, setDefPicLoc] = useState(props.defPicLoc);

    const [objURL, setObjURL] = useState("")
    

    // ########## A C C E S S   C U R R E N T   U S E R'S   D O C ##########
    useEffect(() => {
        const q = query(usersRef, orderBy('createdAt'))
        onSnapshot(q, async (snapshot) => {
            snapshot.docs.forEach(doc => {
                if(doc.data().uid === auth.currentUser.uid){
                    setCurrentUser({ ...doc.data(), id: doc.id})
                }
            })
        })
    },[])

    // ########## F I N D   U S E R'S   P O S T  D O C S ##########
    const postsRef = collection(db, 'posts');
    const [foundPosts, setFoundPosts] = useState("")
    useEffect(() => {
        const q = query(postsRef, orderBy('createdAt'))
        onSnapshot(q, async (snapshot) => {
            snapshot.docs.forEach((doc => {
                if(doc.data().uid === currentUser.uid){
                    setFoundPosts({ ...doc.data(), id: doc.id})
                }
            }))
        })
    },[currentUser])

    const q = query(postsRef, orderBy('createdAt'));
    const [posts] = useCollectionData(q, { 
      createdAt: 'createdAt', 
      idField: 'id', 
      title: 'title',
      uid: `uid`
    });
    function viewPost(e){
        props.updatePage()
        props.sendPostId(e)
    }
    function Post(props){
        return (
            <>
                <p 
                    className="post-link"
                    onClick={() => viewPost(props.id)}
                >{props.title}</p>
                <hr></hr>
            </>
        )
    }

    // ########## S H O W   E D I T   P R O F I L E ##########
    function showSettingsBool(){
        setShowSettings(prevChange => !prevChange)
    }
    function cancelShowSettings(){
        setShowSettings(prevChange => !prevChange)
        setImage(null)

        setHideEditAboutMe(true)
        setHideEditImage(true);
    }
    // ########## U P D A T E   U S E R ##########
    async function updateUser(){
        const docRef = doc(db, 'users', currentUser.id)
        await updateDoc(docRef, {
            defaultPic: `${url === null? props.defaultPic: url}`,
            defPicLoc: `${url === null? props.defPicLoc: defPicLoc}`,
            aboutMe: `${aboutMeValue === ""? props.aboutMe: aboutMeValue}`
        })
        setShowSettings(false)
    }
    // ########## S A V E   C H A N G E S ##########
    function save(){
        {image !== null &&
            submitImage();
        }
        updateUser()
    }
    const [hideEditImage, setHideEditImage] = useState(true);
    function showEditImage(){
        setHideEditImage(false);
    }
    function cancelEditImage(){
        setHideEditImage(true);
    }
    const [hideEditAboutMe, setHideEditAboutMe] = useState(true);
    function showEditAboutMe(){
        setHideEditAboutMe(false)
    }
    function cancelEditAboutMe(){
        setHideEditAboutMe(true)
    }
    // ########## U D A T E   A B O U T   M E ##########
    const [aboutMeValue, setAboutMeValue] = useState(props.aboutMe);
// #############################################################################
// ######################## I M A G E   S T U F F ##############################
// #############################################################################
    
    useEffect(()=> {
        setObjURL(image?URL.createObjectURL(image):null)
    },[image])
    // ########## H A N D L E   I M A G E ##########
    const handleImageChange = async(e) => {
        if (e.target.files[0]) {
            const file = e.target.files[0];
            imageConversion.compressAccurately(file, 100).then(res=>{
                setImage(res);
            })
        }
        await submitImage();
    }
    // ########## I M A G E   S U B M I T ##########
    const submitImage = async () => {
        setDefPicLoc(randomNum)
        const imageRef = ref(storage, randomNum);
        uploadBytes(imageRef, image).then(() => {
            getDownloadURL(imageRef).then((url) => {
                setUrl(url);
            })
            // ^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^
            .catch((error) => {
                console.log(error.message, "error getting image address")
            });
        }).catch((error) => {
            console.log(error.message)
        })
    };
// #############################################################################
// #############################################################################
// #############################  R E T U R N  #################################
// #############################################################################
// #############################################################################
    return (
        <div>
            {/* ############### P R O F I L E ################ */}
            <div className="profile page-body">
                <button className="edit-user-btn" onClick={showSettingsBool}>edit profile</button>
                <h2 
                className="profile-header-text">{`${currentUser.username}'s page`}
                </h2>
                <div className="profile-jumbotron">
                    <img 
                        alt="profile" 
                        className="profile-picture" 
                        src={image!==null?objURL:currentUser.defaultPic}
                    /> 
                    <p>
                        {`${props.aboutMe !== undefined? currentUser.aboutMe: ""}`}
                    </p>
                </div>
                <h3>POSTS</h3>
                <div className="foundUser-posts">
                    <hr></hr>
                    {posts && posts.map(post => post.uid === currentUser.uid && <Post id={post.id} key={post.id} title={post.title}/>)}
                </div>
            </div>
            {/* ############### S E T T I N G S ################ */}
            <div className={!showSettings 
                ? `hideProSettings edit-profile profile` 
                : `edit-profile profile`}>

                {/* ############### E D I T   P R O F I L E   P H O T O ################ */}
                {hideEditImage && <div className="edit-profile-section"><button  onClick={showEditImage}>edit profile photo</button></div>}
                {!hideEditImage && 
                    <>
                        <img 
                            alt="profile" 
                            className="profile-picture" 
                            src={image!==null?objURL:props.defaultPic}
                        /> 
                        <input 
                            className="fileTypeInput" 
                            type="file" 
                            accept=".jpg, .jpeg, .png" 
                            onChange={handleImageChange} 
                        />
                        <button onClick={cancelEditImage}>cancel</button>
                    </>
                } 
                <hr className="settings-hr"></hr>
                {/* ############### E D I T   A B O U T   M E ################ */}
                {hideEditAboutMe && <div className="edit-profile-section"><button onClick={showEditAboutMe}>edit About Me</button></div>}
                {!hideEditAboutMe &&
                    <div className="edit-profile-section">
                        <textarea
                            id="aboutMe"
                            placeholder="Write about yourself"
                            name="aboutMe"
                            cols={30}
                            rows={4}
                            value={aboutMeValue}
                            onChange={(event) => setAboutMeValue(event.target.value)}
                        />
                        <button onClick={cancelEditAboutMe}>cancel</button>
                    </div>
                }
                <hr className="settings-hr"></hr>
                {/* ############### S A V E   S E T T I N G S ################ */}
                <div>
                    <button onClick={save}>save()</button>
                    <button onClick={cancelShowSettings}>cancel</button>
                </div>
            </div>
        </div>
    )
}


/* <button className="delete-user-btn" 
    onClick={()=> deleteAllUserData(auth.currentUser)}
    >Delete User
</button>  */



// ########## D E L E T E   U S E R ##########
    // const deleteAllUserData = async (uid) =>{
    //     const docRef = doc(db, 'users', props.id)
    //     deleteDoc(docRef)
    //         .then(() => {
    //             console.log(`${props.username} in users deleted`)
    //         })
    //         .then(() => {
    //             ("deleting from database")
    //             deleteUser(auth.currentUser).then(() => {
    //                 console.log(`user auth doc has been deleted`)
    //             }).catch((error) => {
    //                 console.log(error)
    //             })
    //         })
    //         .then(() => {
    //             props.signout();
    //         })
    // }