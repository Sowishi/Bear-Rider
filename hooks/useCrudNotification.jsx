import {
  addDoc,
  collection,
  onSnapshot,
  orderBy,
  query,
  serverTimestamp,
} from "firebase/firestore";
import { db } from "../firebase";
import { useEffect, useState } from "react";

const useCrudNotification = () => {
  const [data, setData] = useState([]);
  useEffect(() => {
    const colRef = collection(db, "notification");
    const q = query(colRef, orderBy("createdAt"));
    onSnapshot(q, (snapshot) => {
      const output = [];
      snapshot.docs.forEach((doc) => {
        output.push({ ...doc.data(), id: doc.id });
      });
      setData(output.reverse());
    });
  }, []);

  const addNotification = (transaction, currentUser, type) => {
    const colRef = collection(db, "notification");
    addDoc(colRef, {
      currentUser,
      transaction,
      createdAt: serverTimestamp(),
      type,
    });
  };

  return { addNotification, data };
};

export default useCrudNotification;
