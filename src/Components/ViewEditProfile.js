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
import { useNavigate } from "react-router-dom";

import { nanoid } from "nanoid";

import * as imageConversion from "image-conversion";

export default function ViewEditProfile(props) {
  const db = getFirestore();
  const auth = getAuth();
  const usersRef = collection(db, "users");

  const [currentUser, setCurrentUser] = useState("");

  const [randomNum, setRandomNum] = useState(nanoid());
  const [coverNum, setCoverNum] = useState(nanoid());
  const [image, setImage] = useState(null);
  const [coverImage, setCoverImage] = useState(null);
  const [url, setUrl] = useState(null);
  const [coverUrl, setCoverUrl] = useState(null);
  const [objURL, setObjURL] = useState("");
  const [coverObjURL, setCoverObjURL] = useState("");
  // const [defPicLoc, setDefPicLoc] = useState(
  //   localStorage.getItem("userData").defPicLoc
  // );
  const [defPicLoc, setDefPicLoc] = useState(null);
  const [coverPicLoc, setCoverPicLoc] = useState(null);

  const [disableSave, setDisableSave] = useState(true);

  const navigate = useNavigate();

  window.scrollTo(0, 0);

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
      coverPic: `${coverUrl === null ? currentUser.coverPic : coverUrl}`,
      coverPicLoc: `${
        coverUrl === null ? currentUser.coverPicLoc : coverPicLoc
      }`,
      defaultPic: `${url === null ? currentUser.defaultPic : url}`,
      defPicLoc: `${url === null ? currentUser.defPicLoc : defPicLoc}`,
      aboutMe: `${aboutMeValue === "" ? currentUser.aboutMe : aboutMeValue}`,
    });
    navigate("/profile");
    window.location.reload(false);
  }

  // ########## S A V E   C H A N G E S ##########
  function save() {
    {
      image !== null && submitImage();
      coverImage !== null && submitCoverImage();
    }
    updateUser();
    setDisableSave(true);
  }

  const [hideEditCoverImage, setHideEditCoverImage] = useState(true);
  function showEditCoverImage() {
    setHideEditCoverImage(false);
  }
  const [hideEditImage, setHideEditImage] = useState(true);
  function showEditImage() {
    setHideEditImage(false);
  }
  const [hideEditAboutMe, setHideEditAboutMe] = useState(true);
  function showEditAboutMe() {
    setHideEditAboutMe(false);
  }
  function cancelEdit() {
    setHideEditAboutMe(true);
    setHideEditImage(true);
    setHideEditCoverImage(true);
  }
  // ########## U D A T E   A B O U T   M E ##########
  const [aboutMeValue, setAboutMeValue] = useState("");
  useEffect(() => {
    setAboutMeValue(currentUser.aboutMe);
  }, [currentUser]);

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

  useEffect(() => {
    setObjURL(image ? URL.createObjectURL(image) : null);
  }, [image]);

  // ########## I M A G E   S U B M I T ##########
  const submitImage = async () => {
    setDefPicLoc(randomNum);
    const imageRef = ref(storage, randomNum);
    uploadBytes(imageRef, image)
      .then(() => {
        getDownloadURL(imageRef)
          .then((theURL) => {
            setUrl(theURL);
            console.log(url);
          })
          // ^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^
          .catch((error) => {
            console.log(error.message, "error getting image address");
          })
          .then(() => {
            setTimeout(() => {
              setDisableSave(false);
            }, 2500);
          });
      })
      .catch((error) => {
        console.log(error.message);
      });
  };
  function test() {
    console.log(url);
  }
  // ########## H A N D L E   C O V E R   I M A G E ##########
  const handleCoverImageChange = async (e) => {
    if (e.target.files[0]) {
      const file = e.target.files[0];
      imageConversion.compressAccurately(file, 100).then((res) => {
        setCoverImage(res);
      });
    }
    await submitCoverImage();
  };

  useEffect(() => {
    setCoverObjURL(coverImage ? URL.createObjectURL(coverImage) : null);
  }, [coverImage]);
  // ########## C O V E R   S U B M I T ##########
  const submitCoverImage = async () => {
    setCoverPicLoc(coverNum);
    const imageRef = ref(storage, coverNum);
    uploadBytes(imageRef, coverImage)
      .then(() => {
        getDownloadURL(imageRef)
          .then((theUrl) => {
            setCoverUrl(theUrl);
          })
          // ^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^
          .catch((error) => {
            console.log(error.message, "error getting image address");
          })
          .then(() => {
            setTimeout(() => {
              setDisableSave(false);
            }, 2500);
          });
      })
      .catch((error) => {
        console.log(error.message);
      });
  };

  return (
    <div className="page-style page-body">
      <div className="editProfile-body">
        {/* ############### E D I T   C O V E R   P H O T O ################ */}
        {hideEditCoverImage && hideEditAboutMe && hideEditImage && (
          <div className="edit-profile-section">
            <button onClick={showEditCoverImage}>edit cover photo</button>
          </div>
        )}
        {!hideEditCoverImage && (
          <div className="edit-profile-section">
            <div className="edit-defaultPic">
              <img
                alt="profile"
                className="cover-picture"
                src={coverImage !== null ? coverObjURL : currentUser.coverPic}
              />
              <input
                className="fileTypeInput"
                type="file"
                accept=".jpg, .jpeg, .png"
                onChange={handleCoverImageChange}
              />
              <button onClick={cancelEdit}>cancel</button>
            </div>
          </div>
        )}
        {/* ############### E D I T   P R O F I L E   P H O T O ################ */}
        {hideEditAboutMe && hideEditImage && hideEditCoverImage && (
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
                src={image !== null ? objURL : currentUser.defaultPic}
              />
              <input
                className="fileTypeInput"
                type="file"
                accept=".jpg, .jpeg, .png"
                onChange={handleImageChange}
              />
              <button onClick={cancelEdit}>cancel</button>
              <button onClick={test}>test</button>
            </div>
          </div>
        )}
        {/* ############### E D I T   A B O U T   M E ################ */}
        {hideEditImage && hideEditAboutMe && hideEditCoverImage && (
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

            <div className="save-cancel-edit-profile">
              <button onClick={cancelEdit}>cancel</button>
              <button onClick={save}>save</button>
            </div>
          </div>
        )}
        {/* ############### S A V E   S E T T I N G S ################ */}
        {hideEditAboutMe && (
          <div className="save-cancel-edit-profile">
            <button onClick={() => navigate(-1)}>cancel</button>
            <button onClick={save} disabled={disableSave ? "+true" : false}>
              save
            </button>
          </div>
        )}
      </div>
    </div>
  );
}
