import React, { useContext, useState } from "react";
import Img from "../img/img.png";
import Attach from "../img/attach.png";
import Audio from "../img/audio.png";
import {
  Timestamp,
  arrayUnion,
  doc,
  serverTimestamp,
  updateDoc,
} from "firebase/firestore";
import { auth, db, storage } from "../firebase";
import { v4 as uuid } from "uuid";
import { AuthContext } from "../context/AuthContext";
import { ChatContext } from "../context/ChatContext";
import { getDownloadURL, ref, uploadBytesResumable } from "firebase/storage";
const Input = () => {
  const [text, setText] = useState("");
  const [img, setImg] = useState(null);
  const [audio, setAudio] = useState(null);
  const { currentUser } = useContext(AuthContext);
  const { data } = useContext(ChatContext);
  const handleSend = async () => {
    if (audio && img) {
      const storageRef = ref(storage, uuid());
      const uploadTaskImg = await uploadBytesResumable(storageRef, img);
      let downloadURLImg = null;
      let downloadURLAudio = null;
      await uploadBytesResumable(storageRef, audio).then(() => {
        getDownloadURL(storageRef).then(async (downloadURL) => {
          downloadURLAudio = downloadURL;
        });
      });
      await uploadBytesResumable(storageRef, img).then(() => {
        getDownloadURL(storageRef).then(async (downloadURL) => {
          downloadURLImg = downloadURL;
        });
      });
      await updateDoc(doc(db, "chats", data.chatId), {
        messages: arrayUnion({
          id: uuid(),
          text,
          senderId: currentUser.uid,
          date: Timestamp.now(),
          img: downloadURLImg,
          audio: downloadURLAudio,
        }),
      });
    } else if (audio) {
      const storageRef = ref(storage, uuid());
      await uploadBytesResumable(storageRef, audio).then(() => {
        getDownloadURL(storageRef).then(async (downloadURL) => {
          await updateDoc(doc(db, "chats", data.chatId), {
            messages: arrayUnion({
              id: uuid(),
              text,
              senderId: currentUser.uid,
              date: Timestamp.now(),
              audio: downloadURL,
            }),
          });
        });
      });
    } else if (img) {
      const storageRef = ref(storage, uuid());
      await uploadBytesResumable(storageRef, img).then(() => {
        getDownloadURL(storageRef).then(async (downloadURL) => {
          await updateDoc(doc(db, "chats", data.chatId), {
            messages: arrayUnion({
              id: uuid(),
              text,
              senderId: currentUser.uid,
              date: Timestamp.now(),
              img: downloadURL,
            }),
          });
        });
      });
    } else {
      await updateDoc(doc(db, "chats", data.chatId), {
        messages: arrayUnion({
          id: uuid(),
          text,
          senderId: currentUser.uid,
          date: Timestamp.now(),
        }),
      });
    }
    await updateDoc(doc(db, "userChats", currentUser.uid), {
      [data.chatId + ".lastMessage"]: {
        text,
      },
      [data.chatId + ".date"]: serverTimestamp(),
    });
    await updateDoc(doc(db, "userChats", data.user.uid), {
      [data.chatId + ".lastMessage"]: {
        text,
      },
      [data.chatId + ".date"]: serverTimestamp(),
    });
    setImg(null);
    setText("");
    setAudio(null);
  };
  return (
    <div className="input">
      <input
        type="text"
        placeholder="Type Something"
        onChange={(e) => setText(e.target.value)}
        value={text}
      />
      <div className="send">
        <img src={Attach} alt="" />
        {!audio && (
          <input
            type="file"
            style={{ display: "none" }}
            id="file"
            accept="image/png , image/jpeg"
            onChange={(e) => setImg(e.target.files[0])}
          ></input>
        )}
        <label htmlFor="file">
          <img src={Img} alt="" />
        </label>
        {!img && (
          <input
            type="file"
            id="audio"
            style={{ display: "none" }}
            accept="audio/mp3"
            onChange={(e) => setAudio(e.target.files[0])}
          ></input>
        )}
        <label htmlFor="audio">
          <img src={Audio} />
        </label>
        <button onClick={handleSend}>Send</button>
      </div>
    </div>
  );
};
export default Input;
