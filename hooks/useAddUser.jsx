import { addDoc, collection, serverTimestamp } from "firebase/firestore";
import { db } from "../firebase";

const useAddUser = () => {
  const addUser = (forms) => {
    const colRef = collection(db, "users");
    addDoc(colRef, {
      ...forms,
      createdAt: serverTimestamp(),
    });
  };

  return { addUser };
};

export default useAddUser;
