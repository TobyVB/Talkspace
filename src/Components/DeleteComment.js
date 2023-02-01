import {
  doc,
  getFirestore,
  collection,
  query,
  orderBy,
  onSnapshot,
  deleteDoc,
} from "firebase/firestore";
import { useLocation, NavLink } from "react-router-dom";

export default function DeleteComment(props) {
  const db = getFirestore();
  const commentsRef = collection(db, "comments");
  const location = useLocation();

  function deleteComment() {
    const docRef = doc(db, "comments", props.comment.id);
    const target = props.comment.id;
    deleteDoc(docRef)
      .then(() => {
        console.log("notification deleted");
      })
      .then(() => {
        const q = query(commentsRef, orderBy("createdAt"));
        onSnapshot(q, async (snapshot) => {
          snapshot.docs.forEach((document) => {
            console.log("test1");
            const docRef = doc(db, "comments", document.id);
            if (document.data().masterComment === target) {
              console.log("test2");
              deleteDoc(docRef);
            }
            // function cleanout(param) {
            //   const q = query(commentsRef, orderBy("createdAt"));
            //   onSnapshot(q, async (snapshot) => {
            //     snapshot.docs.forEach((document) => {
            //       const docRef = doc(db, "comments", document.id);
            //       if (document.data().to === param) {
            //       }
            //       deleteDoc(docRef);
            //       // cleanout(document.data().to);
            //     });
            //   });
            // }
            // cleanout(props.comment.id);
          });
        });
      });
  }
  return (
    <NavLink
      style={{
        fontSize: ".8rem",
        textDecoration: "none",
        color: "coral",
      }}
      onClick={deleteComment}
      to={location}
    >
      DELETE
    </NavLink>
  );
}
