import {
  doc,
  deleteDoc,
  getFirestore,
  collection,
  query,
  where,
  getDocs,
} from "firebase/firestore";
import { getAuth, deleteUser } from "firebase/auth";

import { useNavigate } from "react-router-dom";
import { useEffect, useState } from "react";

export default function DeleteAccount(props) {
  const db = getFirestore();
  const auth = getAuth();
  const [userId, setUserId] = useState(null);

  const navigate = useNavigate();

  useEffect(() => {
    async function getUsers() {
      const querySnapshot = await getDocs(collection(db, "users"));
      querySnapshot.forEach((doc) => {
        if (doc.data().uid === auth.currentUser.uid) {
          setUserId(doc.data().id);
        }
      });
    }
    getUsers();
  }, []);

  // ########## D E L E T E   U S E R ##########
  const deleteAllUserData = async () => {
    const docRef = doc(db, "users", userId);
    deleteDoc(docRef)
      .then(() => {
        ("deleting from database");
        deleteUser(auth.currentUser)
          .then(() => {
            console.log(`user auth doc has been deleted`);
          })
          .catch((error) => {
            console.log(error);
          });
      })
      .then(() => {
        auth.signOut().then(() => {
          navigate("/register");
        });
      });
  };

  return (
    <div className="page-body">
      <h1>Delete Account</h1>
      <button onClick={() => navigate(-1)}>Back</button>
      <button onClick={() => deleteAllUserData(auth.currentUser.uid)}>
        Delete User
      </button>
    </div>
  );
}
