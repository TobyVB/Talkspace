import {
  doc,
  getFirestore,
  updateDoc,
  query,
  orderBy,
  onSnapshot,
  collection,
} from "firebase/firestore";
import { getAuth } from "firebase/auth";
import { ref, uploadBytes, getDownloadURL } from "firebase/storage";

import { storage } from "../App.js";
import React, { useEffect, useState } from "react";

import { nanoid } from "nanoid";

import * as imageConversion from "image-conversion";

export default function ViewEditProfile(props) {
  const db = getFirestore();
  const auth = getAuth();
  const usersRef = collection(db, "users");

  const [currentUser, setCurrentUser] = useState("");

  const [randomNum, setRandomNum] = useState(nanoid());
  const [image, setImage] = useState(null);
  const [url, setUrl] = useState(null);
  const [defPicLoc, setDefPicLoc] = useState(props.defPicLoc);

  const [objURL, setObjURL] = useState("");

  window.scrollTo(0, 0);
  localStorage.setItem("prevPage", "editProfile");

  // ########## A C C E S S   C U R R E N T   U S E R'S   D O C ##########
  useEffect(() => {
    const q = query(usersRef, orderBy("createdAt"));
    onSnapshot(q, async (snapshot) => {
      snapshot.docs.forEach((doc) => {
        if (doc.data().uid === auth.currentUser.uid) {
          setCurrentUser({ ...doc.data(), id: doc.id });
        }
      });
    });
  }, []);

  // ########## U P D A T E   U S E R ##########
  async function updateUser() {
    const docRef = doc(db, "users", currentUser.id);
    await updateDoc(docRef, {
      defaultPic: `${url === null ? props.defaultPic : url}`,
      defPicLoc: `${url === null ? props.defPicLoc : defPicLoc}`,
      aboutMe: `${aboutMeValue === "" ? props.aboutMe : aboutMeValue}`,
    });
  }

  // ########## S A V E   C H A N G E S ##########
  function save() {
    {
      image !== null && submitImage();
    }
    updateUser();
    props.cancel();
  }
  const [hideEditImage, setHideEditImage] = useState(true);
  function showEditImage() {
    setHideEditImage(false);
  }
  function cancelEditImage() {
    setHideEditImage(true);
  }
  const [hideEditAboutMe, setHideEditAboutMe] = useState(true);
  function showEditAboutMe() {
    setHideEditAboutMe(false);
  }
  function cancelEditAboutMe() {
    setHideEditAboutMe(true);
  }
  // ########## U D A T E   A B O U T   M E ##########
  const [aboutMeValue, setAboutMeValue] = useState(props.aboutMe);

  useEffect(() => {
    setObjURL(image ? URL.createObjectURL(image) : null);
  }, [image]);
  // ########## H A N D L E   I M A G E ##########
  const handleImageChange = async (e) => {
    if (e.target.files[0]) {
      const file = e.target.files[0];
      imageConversion.compressAccurately(file, 100).then((res) => {
        setImage(res);
      });
    }
    await submitImage();
  };
  // ########## I M A G E   S U B M I T ##########
  const submitImage = async () => {
    setDefPicLoc(randomNum);
    const imageRef = ref(storage, randomNum);
    uploadBytes(imageRef, image)
      .then(() => {
        getDownloadURL(imageRef)
          .then((url) => {
            setUrl(url);
          })
          // ^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^
          .catch((error) => {
            console.log(error.message, "error getting image address");
          });
      })
      .catch((error) => {
        console.log(error.message);
      });
  };

  return (
    <div className="page-style page-body">
      {/* ############### E D I T   P R O F I L E   P H O T O ################ */}
      {hideEditAboutMe && hideEditImage && (
        <div className="edit-profile-section">
          <button onClick={showEditImage}>edit profile photo</button>
        </div>
      )}
      {!hideEditImage && (
        <div className="edit-profile-section">
          <div className="edit-defaultPic">
            <img
              alt="profile"
              className="profile-picture"
              src={image !== null ? objURL : props.defaultPic}
            />
            <input
              className="fileTypeInput"
              type="file"
              accept=".jpg, .jpeg, .png"
              onChange={handleImageChange}
            />
            <button onClick={cancelEditImage}>cancel</button>
          </div>
        </div>
      )}
      {/* ############### E D I T   A B O U T   M E ################ */}
      {hideEditImage && hideEditAboutMe && (
        <div className="edit-profile-section">
          <button onClick={showEditAboutMe}>edit About Me</button>
        </div>
      )}
      {!hideEditAboutMe && (
        <div className="edit-profile-section">
          <textarea
            className="edit-about-textarea"
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
      )}
      {/* ############### S A V E   S E T T I N G S ################ */}
      <div className="save-cancel-edit-profile">
        <button onClick={props.cancel}>cancel</button>
        <button onClick={save}>save</button>
      </div>
    </div>
  );
}
