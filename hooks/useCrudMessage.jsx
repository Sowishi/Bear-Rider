import {
  collection,
  doc,
  getDoc,
  setDoc,
  updateDoc,
  addDoc,
  serverTimestamp,
  query,
  orderBy,
  onSnapshot,
} from "firebase/firestore";
import { db } from "../firebase";
import { useEffect, useState } from "react";
import { useSmokeContext } from "../utils/appContext";

const useCrudMessage = () => {
  const [messages, setMessages] = useState([]);
  const { messageInfo, currentUser } = useSmokeContext();

  const sender = messageInfo.sender;
  const receiver = messageInfo.receiver;

  const handleSendMessage = async (content) => {
    // Step 1: Check if a conversation exists between these two users
    const conversationsRef = collection(db, "conversations");
    const participants = [sender, receiver].sort(); // Sort to maintain consistent order
    const conversationId = `${participants[0]}_${participants[1]}`;

    const conversationDocRef = doc(conversationsRef, conversationId);
    const conversationDoc = await getDoc(conversationDocRef);

    if (!conversationDoc.exists()) {
      // If conversation does not exist, create a new one
      await setDoc(conversationDocRef, {
        participants,
        lastMessage: content,
        lastMessageTimestamp: serverTimestamp(),
      });
    } else {
      // If it exists, update the lastMessage and lastMessageTimestamp
      await updateDoc(conversationDocRef, {
        lastMessage: content,
        lastMessageTimestamp: serverTimestamp(),
      });
    }

    // Step 2: Add the message to the messages subcollection
    const messagesRef = collection(conversationDocRef, "messages");
    await addDoc(messagesRef, {
      sender,
      receiver,
      content,
      timestamp: serverTimestamp(),
      isRead: false,
    });
  };

  function receiveMessages() {
    const participants = [sender, receiver].sort();
    const conversationId = `${participants[0]}_${participants[1]}`;
    const messagesRef = collection(
      db,
      "conversations",
      conversationId,
      "messages"
    );
    const q = query(messagesRef, orderBy("timestamp", "asc"));
    onSnapshot(q, (snapshot) => {
      const messages = snapshot.docs.map((doc) => ({
        id: doc.id,
        ...doc.data(),
      }));
      setMessages(messages.reverse());
    });
  }

  useEffect(() => {
    receiveMessages();
  }, []);

  return { handleSendMessage, messages };
};

export default useCrudMessage;
