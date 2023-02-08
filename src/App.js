import "./App.css";
import { initializeApp } from "firebase/app";
import { getStorage } from "firebase/storage";
import {
  Route,
  createBrowserRouter,
  createRoutesFromElements,
  RouterProvider,
} from "react-router-dom";
import { collection, getDocs, getFirestore, orderBy } from "firebase/firestore";
import { getAuth } from "firebase/auth";

// P A G E S
import Homepage from "./Components/Homepage.js";
import ProfileDetails from "./Components/ProfileDetails.js";
import ViewEditProfile from "./Components/ViewEditProfile.js";
import Login from "./Components/Login.js";
import Register from "./Components/Register.js";
import CreatePost from "./Components/CreatePost.js";
import ViewEditPost from "./Components/ViewEditPost.js";
import ChangeUsername from "./Components/ChangeUsername.js";
import ChangePassword from "./Components/ChangePassword.js";
import DeleteAccount from "./Components/DeleteAccount.js";
import Profiles from "./Components/Profiles.js";
import Posts from "./Components/Posts.js";
import PostDetails from "./Components/PostDetails.js";

// L A Y O U T S
import SharedLayout from "./Components/SharedLayout.js";
import ProfileLayout from "./Components/ProfileLayout.js";
import PostsLayout from "./Components/PostsLayout.js";
import PostLayout from "./Components/PostLayout.js";

const firebaseConfig = {
  apiKey: "AIzaSyCXgrZdHQUbrEgrjTi71-Mc80WK0Ibj3zk",
  authDomain: "fir-practice-cace4.firebaseapp.com",
  projectId: "fir-practice-cace4",
  storageBucket: "fir-practice-cace4.appspot.com",
  messagingSenderId: "732318855377",
  appId: "1:732318855377:web:427b3c2f42cf708aaf15f0",
  measurementId: "G-Z5W900LJ0J",
};
const app = initializeApp(firebaseConfig);
export const storage = getStorage(app);

const mainLoader = async () => {
  const db = getFirestore();
  const auth = getAuth();
  const profilesQuerySnapshot = await getDocs(collection(db, "users"));
  let profiles = [];
  let user = [];
  let posts = [];
  let comments = [];
  let commentAlerts = [];
  profilesQuerySnapshot.forEach((doc) => {
    profiles.push(doc.data());
    if (auth.currentUser && doc.data().uid === auth.currentUser.uid) {
      user.push(doc.data());
    }
  });
  let sortedProfiles = profiles.sort((p1, p2) =>
    p1.createdAt < p2.createdAt ? 1 : p1.createdAt < p2.createdAt ? -1 : 0
  );
  //
  const postsQuerySnapshot = await getDocs(collection(db, "posts"));
  postsQuerySnapshot.forEach((doc) => {
    posts.push(doc.data());
  });
  let sortedPosts = posts.sort((p1, p2) =>
    p1.createdAt > p2.createdAt ? -1 : p1.createdAt > p2.createdAt ? 1 : 0
  );
  //
  const commentsQuerySnapshot = await getDocs(collection(db, "comments"));
  commentsQuerySnapshot.forEach((doc) => {
    comments.push(doc.data());
  });
  let sortedComments = comments.sort((p1, p2) =>
    p1.createdAt > p2.createdAt ? -1 : p1.createdAt > p2.createdAt ? 1 : 0
  );
  //
  const commentAlertQuerySnapshot = await getDocs(
    collection(db, "commentAlerts")
  );
  commentAlertQuerySnapshot.forEach((doc) => {
    commentAlerts.push(doc.data());
  });
  let sortedCommentAlerts = commentAlerts.sort((p1, p2) =>
    p1.createdAt > p2.createdAt ? -1 : p1.createdAt > p2.createdAt ? 1 : 0
  );

  const data = {
    profiles: sortedProfiles,
    posts: sortedPosts,
    user: user[0],
    comments: sortedComments,
    commentAlerts: sortedCommentAlerts,
  };
  return data;
};

const router = createBrowserRouter(
  createRoutesFromElements(
    <Route path="/" element={<SharedLayout />} loader={mainLoader}>
      <Route index element={<Homepage />} loader={mainLoader} />
      <Route path="login" element={<Login />} />
      <Route path="register" element={<Register />} />
      <Route path="profile" element={<ProfileLayout />}>
        <Route index element={<Profiles />} loader={mainLoader} />
        <Route path=":id" element={<ProfileDetails />} loader={mainLoader} />
      </Route>
      <Route path="editProfile" element={<ViewEditProfile />} />
      <Route path="createPost" element={<CreatePost />} />
      <Route path="changeUsername" element={<ChangeUsername />} />
      <Route path="changePassword" element={<ChangePassword />} />
      <Route path="deleteAccount" element={<DeleteAccount />} />
      {/* <Route path="*" element={<page404/>} /> */}
      {/* ########################### P O S T ############################ */}
      <Route path="posts" element={<PostsLayout />}>
        <Route index element={<Posts />} loader={mainLoader} />
        <Route path=":id" element={<PostLayout />} loader={mainLoader}>
          <Route index element={<PostDetails />} loader={mainLoader} />
          <Route
            path="editPost"
            element={<ViewEditPost />}
            loader={mainLoader}
          />
        </Route>
      </Route>
    </Route>
  )
);

export default function App() {
  return <RouterProvider router={router} />;
}

// ############################################################
// ############################################################
// ############################################################
// ############################################################
// ############################################################
// ############################################################
// ############################################################
