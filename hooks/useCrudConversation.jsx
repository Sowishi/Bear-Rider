import { useEffect, useState } from "react"; // React hooks
import {
  collection,
  query,
  where,
  onSnapshot,
  orderBy,
} from "firebase/firestore"; // Firestore functions
import { db } from "../firebase";

const useCrudConversation = (currentUser) => {
  const [conversations, setConversations] = useState([]);

  useEffect(() => {
    if (!currentUser) return;

    // Step 1: Reference to the conversations collection
    const conversationsRef = collection(db, "conversations");

    // Step 2: Create a query for conversations where currentUser is a participant
    const q = query(
      conversationsRef,
      where("participants", "array-contains", currentUser.id),
      orderBy("lastMessageTimestamp", "desc") // Order by latest message
    );

    // Step 3: Listen for real-time updates
    const unsubscribe = onSnapshot(q, (snapshot) => {
      const fetchedConversations = snapshot.docs.map((doc) => ({
        id: doc.id,
        ...doc.data(),
      }));
      setConversations(fetchedConversations);
    });

    // Step 4: Clean up the listener
    return () => unsubscribe();
  }, [currentUser]);

  return { conversations };
};

export default useCrudConversation;
