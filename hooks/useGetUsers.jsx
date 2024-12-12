import { collection, doc, onSnapshot } from "firebase/firestore";
import { useEffect, useState } from "react";
import { db } from "../firebase";

const useGetUsers = () => {
  const [data, setData] = useState([]);
  const colRef = collection(db, "users");

  useEffect(() => {
    onSnapshot(colRef, (snapshot) => {
      const output = [];
      snapshot.docs.forEach((doc) => {
        output.push({ ...doc.data(), id: doc.id });
      });
      setData(output);
    });
  }, []);

  const getUser = (userId, setUser) => {
    const docRef = doc(db, "users", userId);

    onSnapshot(docRef, (docSnapshot) => {
      if (docSnapshot.exists()) {
        setUser({ ...docSnapshot.data(), id: docSnapshot.id });
      } else {
        setUser(null);
      }
    });
  };

  return { data, getUser };
};

export default useGetUsers;
