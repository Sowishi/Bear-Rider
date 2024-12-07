import {
  collection,
  doc,
  onSnapshot,
  setDoc,
  deleteDoc,
  serverTimestamp,
} from "firebase/firestore";
import { useEffect, useState } from "react";
import { db } from "../firebase";

const useAddOnline = () => {
  const [onlineUsers, setOnlineUsers] = useState([]);

  useEffect(() => {
    const unsubscribe = onSnapshot(
      collection(db, "online"),
      (snapshot) => {
        const users = snapshot.docs.map((doc) => ({
          id: doc.id,
          ...doc.data(),
        }));
        setOnlineUsers(users);
      },
      (error) => {
        console.error("Error fetching online users:", error);
      }
    );

    // Cleanup subscription on unmount
    return () => unsubscribe();
  }, []);

  const addOnlineUser = async (forms) => {
    try {
      const docRef = doc(db, "online", forms.currentUser.id);
      await setDoc(docRef, { ...forms, createdAt: serverTimestamp() });
      console.log("User added online:", forms.currentUser.id);
    } catch (error) {
      console.error("Error adding online user:", error);
    }
  };

  const deleteOnlineUser = async (id) => {
    try {
      const docRef = doc(db, "online", id);
      await deleteDoc(docRef);
      console.log("User removed from online:", id);
    } catch (error) {
      console.error("Error deleting online user:", error);
    }
  };

  return { onlineUsers, addOnlineUser, deleteOnlineUser };
};

export default useAddOnline;
