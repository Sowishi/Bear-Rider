import { doc, getDoc, onSnapshot, updateDoc } from "firebase/firestore";
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

  const handleMakePayment = async (receiver, price, sender) => {
    const senderRef = doc(db, "wallet", sender);
    const receiverRef = doc(db, "wallet", receiver);

    try {
      // Get the sender's current balance
      const senderDoc = await getDoc(senderRef);
      const senderBalance = senderDoc.data().balance;

      // Subtract the price from the sender's balance
      const newSenderBalance = senderBalance - price;

      // Update the sender's balance
      await updateDoc(senderRef, { balance: newSenderBalance });

      // (Optional) You can also update the receiver's balance
      const receiverDoc = await getDoc(receiverRef);
      const receiverBalance = receiverDoc.data().balance;

      const newReceiverBalance = receiverBalance + price;
      await updateDoc(receiverRef, { balance: newReceiverBalance });
    } catch (error) {
      console.error("Error processing payment: ", error);
    }
  };
  return { getWallet, data, handleMakePayment };
};

export default useCrudWallet;
