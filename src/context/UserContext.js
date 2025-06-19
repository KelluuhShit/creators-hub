// src/context/UserContext.jsx
import { createContext, useState, useEffect } from 'react';
import { getAuth, onAuthStateChanged } from 'firebase/auth';
import { getFirestore, doc, getDoc } from 'firebase/firestore';

export const UserContext = createContext();

export function UserProvider({ children }) {
  const [userData, setUserData] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const auth = getAuth();
    const db = getFirestore();
    const unsubscribe = onAuthStateChanged(auth, async (user) => {
      if (user) {
        try {
          const userDoc = doc(db, 'users', user.uid);
          const docSnap = await getDoc(userDoc);
          if (docSnap.exists()) {
            const data = docSnap.data();
            setUserData({
              uid: user.uid,
              email: user.email,
              displayName: data.displayName || user.displayName || '-',
              phoneNumber: data.phoneNumber || '',
              dateOfBirth: data.dateOfBirth || '',
              isPremium: data.isPremium || false,
              subscriptionTier: data.subscriptionTier || null,
              instagramConnected: data.instagramConnected || false,
              verified: data.verified || false,
            });
          } else {
            setUserData(null);
          }
        } catch (err) {
          console.error('User data fetch error:', err.message);
          setUserData(null);
        }
      } else {
        setUserData(null);
      }
      setLoading(false);
    });

    return () => unsubscribe();
  }, []);

  return (
    <UserContext.Provider value={{ userData, setUserData, loading }}>
      {children}
    </UserContext.Provider>
  );
}