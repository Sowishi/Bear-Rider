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
      const senderBalance = senderDoc.data()?.balance;

      // Check if sender has enough balance
      if (senderBalance < price) {
        console.error("Insufficient balance");
        return { success: false, message: "Insufficient balance" };
      }

      // Calculate new balances
      const newSenderBalance = senderBalance - price;
      const receiverDoc = await getDoc(receiverRef);
      const receiverBalance = receiverDoc.data()?.balance;
      const newReceiverBalance = receiverBalance + price;

      // Update the sender's and receiver's balances
      await updateDoc(senderRef, { balance: newSenderBalance });
      await updateDoc(receiverRef, { balance: newReceiverBalance });

      return { success: true };
    } catch (error) {
      console.error("Error processing payment:", error);
      return { success: false, message: error.message };
    }
  };

  return { getWallet, data, handleMakePayment };
};

export default useCrudWallet;
