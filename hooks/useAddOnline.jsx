import {
  addDoc,
  collection,
  deleteDoc,
  doc,
  onSnapshot,
  serverTimestamp,
  setDoc,
} from "firebase/firestore";
import { db } from "../firebase";
import { createdAt } from "expo-updates";
import { useEffect, useState } from "react";

const useAddOnline = () => {
  const [onlineUsers, setOnlineUsers] = useState([]);

  useEffect(() => {
    const colRef = collection(db, "online");
    onSnapshot(colRef, (snapshot) => {
      const output = [];
      snapshot.docs.forEach((doc) => {
        output.push({ ...doc.data(), id: doc.id });
      });
      setOnlineUsers(output);
    });
  }, []);

  const addOnlineUser = (forms) => {
    const docRef = doc(db, "online", forms.currentUser.id);
    console.log("Added online");
    setDoc(docRef, { ...forms, createdAt: serverTimestamp() });
  };

  const deleteOnlineUser = (id) => {
    const docRef = doc(db, "online", id);
    deleteDoc(docRef);
  };
  return { addOnlineUser, deleteOnlineUser, onlineUsers };
};

export default useAddOnline;
