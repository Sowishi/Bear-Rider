import { collection, onSnapshot } from "firebase/firestore";
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

  return { data };
};

export default useGetUsers;
