import { useState, useEffect } from 'react';
import { 
  signInWithEmailAndPassword, 
  createUserWithEmailAndPassword,
  signOut as firebaseSignOut,
  onAuthStateChanged,
  GoogleAuthProvider,
  signInWithPopup,
  sendPasswordResetEmail,
  updateProfile
} from 'firebase/auth';
import { doc, setDoc, getDoc, updateDoc } from 'firebase/firestore';
import { auth, db } from '../lib/firebase';

export const useFirebaseAuth = () => {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, async (user) => {
      if (user) {
        // Get additional user data from Firestore
        try {
          const userDoc = await getDoc(doc(db, 'users', user.uid));
          if (userDoc.exists()) {
            setUser({ ...user, ...userDoc.data() });
          } else {
            setUser(user);
          }
        } catch (error) {
          console.error('Error fetching user data:', error);
          setUser(user);
        }
      } else {
        setUser(null);
      }
      setLoading(false);
    });

    return unsubscribe;
  }, []);

  const signIn = async (email, password) => {
    try {
      setError(null);
      const result = await signInWithEmailAndPassword(auth, email, password);
      return result;
    } catch (error) {
      setError(error.message);
      throw error;
    }
  };

  const signUp = async (email, password, displayName) => {
    try {
      setError(null);
      const result = await createUserWithEmailAndPassword(auth, email, password);
      
      // Update profile
      await updateProfile(result.user, { displayName });
      
      // Create user document in Firestore
      await setDoc(doc(db, 'users', result.user.uid), {
        email: result.user.email,
        displayName,
        role: 'user',
        createdAt: new Date(),
        lastLogin: new Date()
      });

      return result;
    } catch (error) {
      setError(error.message);
      throw error;
    }
  };

  const signInWithGoogle = async () => {
    try {
      setError(null);
      const provider = new GoogleAuthProvider();
      const result = await signInWithPopup(auth, provider);
      
      // Check if user document exists, if not create it
      const userDoc = await getDoc(doc(db, 'users', result.user.uid));
      if (!userDoc.exists()) {
        await setDoc(doc(db, 'users', result.user.uid), {
          email: result.user.email,
          displayName: result.user.displayName,
          photoURL: result.user.photoURL,
          role: 'user',
          createdAt: new Date(),
          lastLogin: new Date()
        });
      } else {
        // Update last login
        await updateDoc(doc(db, 'users', result.user.uid), {
          lastLogin: new Date()
        });
      }

      return result;
    } catch (error) {
      setError(error.message);
      throw error;
    }
  };

  const signOut = async () => {
    try {
      setError(null);
      await firebaseSignOut(auth);
    } catch (error) {
      setError(error.message);
      throw error;
    }
  };

  const resetPassword = async (email) => {
    try {
      setError(null);
      await sendPasswordResetEmail(auth, email);
    } catch (error) {
      setError(error.message);
      throw error;
    }
  };

  const updateUserProfile = async (updates) => {
    try {
      setError(null);
      await updateProfile(auth.currentUser, updates);
      
      // Update Firestore document
      if (auth.currentUser) {
        await updateDoc(doc(db, 'users', auth.currentUser.uid), updates);
      }
    } catch (error) {
      setError(error.message);
      throw error;
    }
  };

  return {
    user,
    loading,
    error,
    signIn,
    signUp,
    signInWithGoogle,
    signOut,
    resetPassword,
    updateUserProfile
  };
}; 