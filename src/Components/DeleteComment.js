import {
  doc,
  getFirestore,
  collection,
  query,
  orderBy,
  onSnapshot,
  deleteDoc,
} from "firebase/firestore";

export default function DeleteComment(props) {
  const db = getFirestore();
  const commentsRef = collection(db, "comments");

  function deleteComment() {
    const docRef = doc(db, "comments", props.comment.id);
    deleteDoc(docRef)
      .then(() => {
        console.log("notification deleted");
      })
      .then(() => {
        console.log("what's up?");
        const q = query(commentsRef, orderBy("createdAt"));
        onSnapshot(q, async (snapshot) => {
          snapshot.docs.forEach((document) => {
            const docRef = doc(db, "comments", document.id);
            if (
              document.data().chain === props.comment.chain &&
              props.type == "comment"
            ) {
              deleteDoc(docRef);
            }
          });
        });
      });
  }
  return (
    <button className="delete-comment" onClick={deleteComment}>
      delete
    </button>
  );
}
