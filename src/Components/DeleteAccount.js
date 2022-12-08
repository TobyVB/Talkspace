import { doc, deleteDoc, getFirestore } from "firebase/firestore";
import { getAuth, deleteUser } from "firebase/auth";

export default function DeleteAccount(props) {
  const db = getFirestore();
  const auth = getAuth();

  // ########## D E L E T E   U S E R ##########
  const deleteAllUserData = async () => {
    const docRef = doc(db, "users", props.userData.id);
    deleteDoc(docRef)
      .then(() => {
        console.log(`${props.captured.userData.username} in users deleted`);
      })
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
        props.signout();
      });
  };

  return (
    <div className="page-body">
      <h1>Delete Account</h1>
      <button onClick={() => props.changePageTo("settings")}>cancel</button>
      <button onClick={() => deleteAllUserData(auth.currentUser.uid)}>
        Delete User
      </button>
    </div>
  );
}
