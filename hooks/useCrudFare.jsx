import {
  collection,
  deleteDoc,
  doc,
  onSnapshot,
  orderBy,
  query,
  setDoc,
  updateDoc,
} from "firebase/firestore";
import { useEffect, useState } from "react";
import { db } from "../firebase";

const useCrudFare = () => {
  const getFare = (setFare) => {
    const docRef = doc(db, "fare", "fareData");

    onSnapshot(docRef, (docSnapshot) => {
      if (docSnapshot.exists()) {
        setFare(docSnapshot.data());
      } else {
        setFare(null);
      }
    });
  };

  return { getFare };
};

export default useCrudFare;
