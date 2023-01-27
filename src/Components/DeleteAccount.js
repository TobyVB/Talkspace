import { doc, deleteDoc, getFirestore } from "firebase/firestore";
import { getAuth, deleteUser } from "firebase/auth";

import { useNavigate } from "react-router-dom";

export default function DeleteAccount(props) {
  const db = getFirestore();
  const auth = getAuth();

  const navigate = useNavigate();

  // ########## D E L E T E   U S E R ##########
  const deleteAllUserData = async () => {
    const docRef = doc(db, "users", props.userData.id);
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
        props.menuSignOut();
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
