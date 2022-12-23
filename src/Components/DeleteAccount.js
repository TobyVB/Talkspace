import { doc, deleteDoc, getFirestore } from "firebase/firestore";
import { getAuth, deleteUser } from "firebase/auth";

import { NavLink } from "react-router-dom";

export default function DeleteAccount(props) {
  const db = getFirestore();
  const auth = getAuth();

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
      <NavLink to="/settings">cancel</NavLink>
      <button onClick={() => deleteAllUserData(auth.currentUser.uid)}>
        Delete User
      </button>
    </div>
  );
}
