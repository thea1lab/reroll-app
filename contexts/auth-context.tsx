import { createContext, useContext, useEffect, useState } from 'react';
import { getApp } from '@react-native-firebase/app';
import { getAuth, onAuthStateChanged, signInWithCredential, signOut as firebaseSignOut, GoogleAuthProvider, type User } from '@react-native-firebase/auth';
import { GoogleSignin } from '@react-native-google-signin/google-signin';

interface AuthContextValue {
  user: User | null;
  isLoading: boolean;
  signInWithGoogle: () => Promise<void>;
  signOut: () => Promise<void>;
}

const AuthContext = createContext<AuthContextValue | null>(null);

const firebaseAuth = getAuth(getApp());

export function AuthProvider({ children }: { children: React.ReactNode }) {
  const [user, setUser] = useState<User | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    GoogleSignin.configure({
      webClientId: '152660167338-s4cfbuueh11vv96vh9g3sluq4it0gmc9.apps.googleusercontent.com',
    });
  }, []);

  useEffect(() => {
    return onAuthStateChanged(firebaseAuth, (firebaseUser) => {
      setUser(firebaseUser);
      setIsLoading(false);
    });
  }, []);

  const handleSignInWithGoogle = async () => {
    await GoogleSignin.hasPlayServices({ showPlayServicesUpdateDialog: true });
    const response = await GoogleSignin.signIn();

    if (!response.data?.idToken) {
      throw new Error('Google Sign-In failed: no ID token');
    }

    const credential = GoogleAuthProvider.credential(response.data.idToken);
    await signInWithCredential(firebaseAuth, credential);
  };

  const handleSignOut = async () => {
    await firebaseSignOut(firebaseAuth);
    await GoogleSignin.signOut();
  };

  return (
    <AuthContext.Provider value={{ user, isLoading, signInWithGoogle: handleSignInWithGoogle, signOut: handleSignOut }}>
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth(): AuthContextValue {
  const ctx = useContext(AuthContext);
  if (!ctx) throw new Error('useAuth must be used within AuthProvider');
  return ctx;
}
