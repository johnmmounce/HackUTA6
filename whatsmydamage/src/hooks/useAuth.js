// src/hooks/useAuth.js
import { useEffect, useState } from 'react';
import { onAuthStateChanged } from 'firebase/auth';
import { auth } from '../firebase'; // Adjust the path to firebase.js if necessary

const useAuth = () => {
  const [user, setUser] = useState(null);

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, (currentUser) => {
      setUser(currentUser);
      console.log("User state changed:", currentUser);  // Add logging to see the user state
    });
    return () => unsubscribe(); // Cleanup the subscription on unmount
  }, []);

  return { user };
};

export { useAuth };
