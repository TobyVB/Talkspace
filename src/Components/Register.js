import {
  getAuth,
  createUserWithEmailAndPassword,
  sendEmailVerification,
} from "firebase/auth";
import {
  getFirestore,
  collection,
  addDoc,
  serverTimestamp,
  onSnapshot,
  doc,
  updateDoc,
  query,
  orderBy,
} from "firebase/firestore";
import { useCollectionData } from "react-firebase-hooks/firestore";
import { getStorage, ref, getDownloadURL } from "firebase/storage";
import { nanoid } from "nanoid";
import React, { useEffect, useState } from "react";

import { useNavigate } from "react-router-dom";

export default function Register(props) {
  const db = getFirestore();
  const auth = getAuth();
  const storage = getStorage();

  const navigate = useNavigate();

  const [users] = useCollectionData(qUsers, {
    username: "username",
  });
  const [unique, setUnique] = useState(nanoid());
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [username, setUsername] = useState("");
  const [loading, setLoading] = useState(false);
  const usersRef = collection(db, "users");
  const qUsers = query(usersRef, orderBy("createdAt"));
  const [letterRef, setLetterRef] = useState("");
  const capL = username.charAt(0).toUpperCase();
  const lowL = username.charAt(0).toLowerCase();
  const letters = [
    "a",
    "b",
    "c",
    "d",
    "e",
    "f",
    "g",
    "h",
    "i",
    "j",
    "k",
    "l",
    "m",
    "n",
    "o",
    "p",
    "q",
    "r",
    "s",
    "t",
    "u",
    "v",
    "w",
    "x",
    "y",
    "z",
  ];

  useEffect(() => {
    window.scrollTo(0, 0);
  }, []);

  useEffect(() => {
    setLetterRef(ref(storage, `defLetters/letter${capL}.png`));
  }, [username]);

  function handleChangeEmail(event) {
    const target = event.target;
    const value = target.value;
    setEmail(value);
  }

  function handleChangePassword(event) {
    const target = event.target;
    const value = target.value;
    setPassword(value);
  }

  function signup(email, password) {
    return createUserWithEmailAndPassword(auth, email, password);
  }
  // ################################   H A N D L E   S I G N U P   ######################################
  async function handleSignup() {
    let defaultPic = "";
    getDownloadURL(letterRef)
      .then((url) => {
        defaultPic = url;
      })
      .catch((error) => {
        console.log(error);
      });
    localStorage.setItem("username", username);
    setLoading(true);
    try {
      await signup(email, password);
    } catch {
      console.log("error with handleSignup function in Register.js");
    }
    await addDoc(usersRef, {
      email: auth.currentUser.email,
      username: username,
      uid: auth.currentUser.uid,
      createdAt: serverTimestamp(),
      unique: unique,
      defaultPic: defaultPic,
    })
      .then(() => {
        const q = query(usersRef, orderBy("createdAt"));
        onSnapshot(q, async (snapshot) => {
          snapshot.docs.forEach((document) => {
            const docRef = doc(db, "users", document.id);
            if (document.data().unique === unique) {
              updateDoc(docRef, {
                id: document.id,
              });
            }
          });
        });
      })
      .then(() => {
        sendEmailVerification(auth.currentUser).then(() => {});
      })
      .then(() => {
        props.exit();
      })
      .then(() => {
        setLoading(false);
        navigate("../login");
      });
  }
  // -/-/-/-/-/-/-/-/-/-/-/-/-/-/-   - E N D -   H A N D L E   S I G N U P   -/-/-/-/-/-/-/-/-/-/-/-/-/-/-/- //

  return (
    <div className="page-style page-body">
      <div className="form-register-email">
        <h1>SIGN UP</h1>
        <label htmlFor="email">Email</label>
        <input
          id="email"
          className="input-user-cred"
          placeholder="email"
          name="email"
          onChange={handleChangeEmail}
          value={email}
        />

        {users && users.filter((user) => user.email === email).length > 0 ? (
          <p>... email already in use</p>
        ) : (
          <p className="invisible-p">invisible text</p>
        )}

        <label htmlFor="password">Password</label>
        <input
          onChange={handleChangePassword}
          value={password}
          id="password"
          className="input-user-cred"
          placeholder="password"
          type="password"
          name="password"
        />
        {/* <p>... password must be between 6 and 50 characters and include letters and numbers</p> */}
        <label htmlFor="username">Username</label>
        <input
          id="username"
          className="input-user-cred"
          placeholder="username"
          name="username"
          onChange={(event) => setUsername(event.target.value)}
          value={username}
        />

        {
          users &&
          users.filter((user) => user.username === username).length > 0 ? (
            <p>... username is already taken</p>
          ) : (
            <p className="invisible-p"></p>
          )
          // make unclickable and invisible, etc
        }
        {!letters.includes(lowL) ? (
          <p>... must start with a letter</p>
        ) : (
          <p className="invisible-p">invisible text</p>
        )}
        <hr />
        {users &&
        users.filter((user) => user.username === username).length < 1 &&
        letters.includes(lowL) &&
        users &&
        users.filter((user) => user.email === email).length === 0 ? (
          <button disabled={loading} onClick={handleSignup}>
            register
          </button>
        ) : (
          <button disabled="+true" onClick={handleSignup}>
            register
          </button>
        )}
      </div>
    </div>
  );
}

// Some snippets for future reference incase I auto delete unverified accounts after
// 10 minutes in this case..
// 60000 is the same as one minute....

// const d1 = new Date();
// const currentTime = d1.getTime();

// if(document.data().isVerified === false){
//     if(currentTime - document.data().createdAt.toDate().getTime() < 600000){
//         // delete doc and delete user

//     }
// }
