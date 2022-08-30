import firebase from 'firebase/compat/app';

export default function ChatMessage(props) {
    const auth = firebase.auth();
    const { text, uid, photoURL, nickname } = props.message;
    const messageClass = auth.currentUser ? uid === auth.currentUser.uid ? 'sent' : 'received': 'received';
    return (<>
      <div className={`message ${messageClass}`}>
        <img alt="user" src={photoURL || 'https://api.adorable.io/avatars/23/abott@adorable.png'} />
        <div className="chatMessage">
            <p className="nickname">{nickname}</p>
            <p className="chatBody">{text}</p>
        </div>
      </div>
    </>)
  }