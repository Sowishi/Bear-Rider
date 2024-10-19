import { doc, onSnapshot } from "firebase/firestore";
import { useState } from "react";
import { db } from "../firebase";

const useCrudWallet = () => {
  const [data, setData] = useState();
  const getWallet = (id) => {
    const docRef = doc(db, "wallet", id);
    onSnapshot(docRef, (doc) => {
      if (doc.exists()) {
        setData({ ...doc.data(), id: doc.id });
      } else {
        console.log("No such document!");
      }
    });
  };
  return { getWallet, data };
};

export default useCrudWallet;
