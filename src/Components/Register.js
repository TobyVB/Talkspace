import {
  getAuth,
  createUserWithEmailAndPassword,
  sendEmailVerification,
} from "firebase/auth";
import {
  getFirestore,
  collection,
  serverTimestamp,
  doc,
  query,
  orderBy,
  setDoc,
} from "firebase/firestore";
import { useCollectionData } from "react-firebase-hooks/firestore";
import { getStorage, ref, getDownloadURL } from "firebase/storage";
import React, { useEffect, useState } from "react";

import { useNavigate } from "react-router-dom";

export default function Register(props) {
  const db = getFirestore();
  const auth = getAuth();
  const storage = getStorage();

  const navigate = useNavigate();

  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [username, setUsername] = useState("");
  const [loading, setLoading] = useState(false);

  const [noError, setNoError] = useState(true);
  const [usernameTaken, setUsernameTaken] = useState(true);
  const [startLetter, setStartLetter] = useState(true);
  const [emailTaken, setEmailTaken] = useState(false);

  const usersRef = collection(db, "users");
  const qUsers = query(usersRef, orderBy("createdAt"));
  const [letterRef, setLetterRef] = useState("");
  const capL = username.charAt(0).toUpperCase();
  const lowL = username.charAt(0).toLowerCase();
  const [users] = useCollectionData(qUsers, {
    username: "username",
  });
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
      .then((url) => (defaultPic = url))
      .catch((error) => console.log(error));
    setLoading(true);
    try {
      await signup(email, password);
    } catch {
      console.log("error with handleSignup function in Register.js");
    }
    const newUserRef = doc(collection(db, "users"));
    setDoc(newUserRef, {
      email: auth.currentUser.email,
      username: username,
      uid: auth.currentUser.uid,
      createdAt: serverTimestamp(),
      defaultPic: defaultPic,
      id: newUserRef.id,
    })
      .then(() => sendEmailVerification(auth.currentUser).then(() => {}))
      .then(() => props.exit())
      .then(() => {
        setLoading(false);
        navigate("../login");
      });
  }
  // C H E C K   F O R   E R R O R S
  useEffect(() => {
    let usernameList = [];
    let emailList = [];

    users &&
      users.map((user) => {
        if (user.username.toLowerCase() === username.toLowerCase()) {
          usernameList.push(user.username.toLowerCase());
        } else if (user.email === email) {
          emailList.push(user.email);
        }
      });

    usernameList.length === 1
      ? setUsernameTaken(true)
      : setUsernameTaken(false);

    username !== ""
      ? !letters.includes(username.charAt(0).toLowerCase())
        ? setStartLetter(false)
        : setStartLetter(true)
      : setStartLetter(true);

    emailList.length === 0 && email !== "" && setEmailTaken(false);
    email === "" && setEmailTaken(false);

    emailList.length > 0 && setEmailTaken(true);
  }, [username, email]);

  useEffect(() => {
    if (!usernameTaken && !emailTaken && startLetter) {
      setNoError(true);
    } else {
      setNoError(false);
    }
  }, [usernameTaken, emailTaken, startLetter]);

  return (
    <div className="page-style page-body">
      <div className="form-register-email">
        <h1 className="cred-header">SIGN UP</h1>
        <label>Email</label>
        <input placeholder="email" onChange={handleChangeEmail} value={email} />
        <label>Password</label>
        <input
          onChange={handleChangePassword}
          value={password}
          placeholder="password"
          type="password"
        />
        <label>Username</label>
        <input
          placeholder="username"
          onChange={(event) => setUsername(event.target.value)}
          value={username}
        />
        {users &&
        users.filter((user) => user.username === username).length < 1 &&
        letters.includes(lowL) &&
        users &&
        users.filter((user) => user.email === email).length === 0 ? (
          <button
            className="submit cred-submit"
            disabled={loading}
            onClick={handleSignup}
          >
            register
          </button>
        ) : (
          <button
            style={{ color: "rgba(255,255,255,.35" }}
            className="submit cred-submit"
            disabled="+true"
            onClick={handleSignup}
          >
            register
          </button>
        )}
        <hr style={{ margin: "1em 0", border: "none" }} />
        {/* ################################################### */}
        {!noError && (
          <div className="error-box-container">
            <div className="error-box">
              {usernameTaken && (
                <div style={{ margin: ".5em" }}>Username is taken</div>
              )}
              {!startLetter && (
                <div style={{ margin: ".5em" }}>
                  username must start with a letter
                </div>
              )}
              {emailTaken && (
                <div style={{ margin: ".5em" }}>Email is in use</div>
              )}
            </div>
          </div>
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
