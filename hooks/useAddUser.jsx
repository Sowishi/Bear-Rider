import { addDoc, collection, serverTimestamp } from "firebase/firestore";
import { db } from "../firebase";

const useAddUser = () => {
  const addUser = (forms) => {
    const colRef = collection(db, "users");
    addDoc(colRef, {
      ...forms,
      createdAt: serverTimestamp(),
      profilePic: `https://avatar.iran.liara.run/public?username=${forms.firstName}`,
    });
  };

  return { addUser };
};

export default useAddUser;
